import _ from "lodash";
import moment from "moment";

export class SkydiveDatasource {

  /** @ngInject **/
  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    console.log( instanceSettings);
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.version = instanceSettings.jsonData.version;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
  }

  // Called once per panel (graph)
  query(options) {
    var targets = _.filter(options.targets, target => {
      return !target.hide && target.gremlin && target.gremlin !== 'Gremlin query';
    });

    if (targets.length <= 0) {
      return this.q.when({data: []});
    }

    var queries = _.map(targets, target => {
      return this.targetToQuery(target, options.range.from.format('X'), options.range.to.format('X'));
    });

    var promises =  this.doQueries(queries);
    return this.q.all(promises).then(function(results) {
      return { data: _.flatten(results) };
    });
  }

  targetToRequest(target, from, to) {
    return {
      title: target.title || "",
      gremlin: target.gremlin || "",
      field: target.metricField,
      dedup: target.dedup,
      aggregates: target.aggregates,
      mode: target.mode,
      from: from,
      to: to,
      refId: target.refId,
      hide: target.hide
    };
  }

  targetToQuery(target, from, to) {
    return this.requestToQuery(this.targetToRequest(target, from, to));
  }

  gremlinTimeContext(gremlin, request) {
    if (this.version == "0.9") {
      gremlin = gremlin.replace(/^G\./i, 'G.At(' + request.to + ').');
      gremlin = gremlin.replace(/\.Flows\([^)]*\)/i, '.Flows(Since(' + (request.to-request.from) + '))');
    } else {
      gremlin = gremlin.replace(/^G\./i, 'G.At(' + request.to + ',' + (request.to-request.from) + ').');
    }

    return gremlin;
  }

  requestToQuery(request) {
    // removing Context/At and Metric from the original query if present
    var gremlin = request.gremlin.replace(/^G\.At\([^)]*\)/i, 'G');
    gremlin = request.gremlin.replace(/^G\.Context\([^)]*\)/i, 'G');
    gremlin = gremlin.replace(/\.Metrics\([^)]*\)/i, '');
    gremlin = gremlin.replace(/\.Aggregates\([^)]*\)/i, '');
    gremlin = gremlin.replace(/\.Dedup\([^)]*\)/i, '');

    // add time context
    gremlin = this.gremlinTimeContext(gremlin, request);

    switch (request.mode) {
      case "Outer":
        gremlin += '.Has("ParentUUID", "")';
        break;
      case "Inner":
        gremlin += '.Has("ParentUUID", Ne(""))';
        break;
    }

    if (request.dedup && request.dedup != '---') {
      gremlin += '.Dedup("' + request.dedup + '")';
    }

    gremlin += '.Metrics()';

    if (request.aggregates) {
      gremlin += '.Aggregates()';
    }

    return {gremlin: gremlin, request: request};
  }

  doQueries(queries) {
    return _.map(queries, query => {
      return this.doQuery(query);
    });
  }

  doQuery(query) {
    console.log(query.gremlin);

    return this.doGremlinQuery(query.gremlin).then(result => {
      var data = [];
      if (result.status !== 200) {
        return data;
      }

      if (result.data.length <= 0) {
        return data;
      }

      _.forEach(result.data[0], (metrics, uuid) => {
        var datapoints = _.map(metrics, metric => {
          var value = 0;
          switch (query.request.field) {
            case "Bytes":
              // flow or interface metrics ?
              if (_.has(metric, "ABBytes")) {
                value = metric.ABBytes + metric.BABytes;
              } else {
                value = metric.RxBytes + metric.RxBytes;
              }
              break;
            case "Packets":
              // flow or interface metrics ?
              if (_.has(metric, "ABPackets")) {
                value = metric.ABPackets + metric.BAPackets;
              } else {
                value = metric.RxPackets + metric.TxPackets;
              }
              break;
            default:
              value = metric[query.request.field];
          }
          var start = metric.Start;
          var last = metric.Last;

          if (this.version != "0.9") {
            start /= 1000;
            last /= 1000;
          }
          return [value / (last - start), moment(last, 'X').valueOf()];
        });

        data.push({
          target: query.request.title || uuid,
          datapoints: _.toArray(datapoints).reverse()
        });
      });

      return data;
    });
  }

  doGremlinQuery(gremlin) {
    var options = {
      url: this.url + '/api/topology',
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      data: {'GremlinQuery': gremlin}
    };
    return this.backendSrv.datasourceRequest(options);
  }

  // Required
  // Used for testing datasource in datasource configuration pange
  testDatasource() {
    return this.backendSrv.datasourceRequest({
      url: this.url + '/api',
      method: 'GET'
    }).then(response => {
      if (response.status === 200) {
        return { status: "success", message: "Data source is working", title: "Success" };
      }
    });
  }
}
