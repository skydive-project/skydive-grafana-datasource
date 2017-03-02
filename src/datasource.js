import _ from "lodash";
import moment from "moment";

export class SkydiveDatasource {

  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
  }

  // Called once per panel (graph)
  query(options) {
    var targets = _.filter(options.targets, target => {
      return !target.hide && target.query && target.query !== 'Gremlin query';
    });

    if (targets.length <= 0) {
      return this.q.when({data: []});
    }

    var requests = _.map(targets, target => {
      return {
        query: this.templateSrv.replace(target.query),
        field: target.metricField,
        dedup: target.dedup,
        aggregates: target.aggregates,
        mode: target.mode,
        from: options.range.from.format('X'),
        to: options.range.to.format('X'),
        refId: target.refId,
        hide: target.hide
      };
    });

    var promises =  this.doRequests(requests);
    return this.q.all(promises).then(function(results) {
      return { data: _.flatten(results) };
    });
  }

  doRequests(requests) {
    return _.map(requests, request => {
      return this.doRequest(request);
    });
  }

  doRequest(request) {
    // removing Context/At and Metric from the original query if present
    var query = request.query.replace(/^G\.At\([^)]*\)/i, 'G');
    query = request.query.replace(/^G\.Context\([^)]*\)/i, 'G');
    query = query.replace(/\.Metrics\([^)]*\)/i, '');

    // add time context
    query = query.replace(/^G\./i, 'G.At(' + request.to + ',' + (request.to-request.from) + ').');

    switch (request.mode) {
      case "Outer":
        query += '.Has("ParentUUID", "")';
        break;
      case "Inner":
        query += '.Has("ParentUUID", Ne(""))';
        break;
    }

    if (request.dedup != '---') {
      query += '.Dedup("' + request.dedup + '")';
    }

    query += '.Metrics()';

    if (request.aggregates) {
      query += '.Aggregates()';
    }

    console.log(query);

    return this.doGremlinQuery(query).then(result => {
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
          switch (request.field) {
            case "Bytes":
              value = metric.ABBytes + metric.BABytes;
              break;
            case "Packets":
              value = metric.ABPackets + metric.BAPackets;
              break;
            default:
              value = metric[request.field];
          }
          return [value / (metric.Last - metric.Start), moment(metric.Last, 'X').valueOf()];
        });

        data.push({
          target: uuid,
          datapoints: _.toArray(datapoints).reverse()
        });
      });

      return data;
    });
  }

  doGremlinQuery(query) {
    var options = {
      url: this.url + '/api/topology',
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      data: {'GremlinQuery': query}
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
