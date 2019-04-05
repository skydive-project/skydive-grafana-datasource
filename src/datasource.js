import _ from "lodash";
import { SemverCmp } from "./semver";
import { Metrics, Version } from './metrics';

export class SkydiveDatasource {

  /** @ngInject **/
  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.version = instanceSettings.jsonData.version;
    this.q = $q;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;

    Version(this.version);
  }

  // Called once per panel (graph)
  query(options) {
    var targets = _.filter(options.targets, target => {
      return !target.hide && target.gremlin && target.gremlin !== 'Gremlin query';
    });

    if (targets.length <= 0) {
      return this.q.when({ data: [] });
    }

    var requests = _.map(targets, target => {
      return this.targetToRequest(target, options.range.from.format('X'), options.range.to.format('X'));
    });

    var promises = this.sendRequests(requests);
    return this.q.all(promises).then(function (results) {
      return { data: _.flatten(results) };
    });
  }

  targetToRequest(target, from, to) {
    var gremlin = this.setTimeContext(target.gremlin, from, to);

    var path = target.metricField.split(".");
    var type = path[0];
    var subType = path[1];
    var field = path[2];

    var field = Metrics[type][subType].Fields[field];

    var suffix = field.Suffix.replace(/%from/i, from * 1000);
    suffix = suffix.replace(/%to/i, to * 1000);
    gremlin += "." + suffix;

    return {
      "target": target,
      "gremlin": gremlin,
      "field": field,
    };
  }

  setTimeContext(gremlin, from, to) {
    // removing Context/At and Metric from the original query if present
    gremlin = gremlin.replace(/^G\.At\([^)]*\)/i, 'G');
    gremlin = gremlin.replace(/^G\.Context\([^)]*\)/i, 'G');
    gremlin = gremlin.replace(/\.Metrics\([^)]*\)/i, '');
    gremlin = gremlin.replace(/\.Aggregates\([^)]*\)/i, '');
    gremlin = gremlin.replace(/\.Dedup\([^)]*\)/i, '');

    // add time context
    if (SemverCmp(this.version, "0.9") == 0) {
      gremlin = gremlin.replace(/^G\./i, 'G.At(' + to + ').');
      gremlin = gremlin.replace(/\.Flows\([^)]*\)/i, '.Flows(Since(' + (to - from) + '))');
    } else {
      gremlin = gremlin.replace(/^G\./i, 'G.At(' + to + ',' + (to - from) + ').');
    }

    return gremlin;
  }

  getKeys(gremlin, from, to) {
    gremlin = this.setTimeContext(gremlin, from, to);
    return this.sendRawGremlinQuery(gremlin + ".Limit(10).Keys()");
  }

  sendRequests(requests) {
    return _.map(requests, request => {
      return this.sendRequest(request);
    });
  }

  sendRequest(request) {
    console.log(request.gremlin);

    return this.sendRawGremlinQuery(request.gremlin).then(resp => {
      if (resp.status !== 200) {
        return [];
      }

      if (resp.data.length <= 0) {
        return [];
      }

      var datapoints =  request.field.PointsFnc(resp.data, request.target.field);

      return [{
        target: request.target.title || "Metrics",
        datapoints: _.toArray(datapoints).reverse()
      }];
    }).catch(err => {
      if (err.data) {
        throw { message: err.data };
      } else {
        throw { message: err };
      }
    });
  }

  // send a raw gremlin query
  sendRawGremlinQuery(gremlin) {
    var request = {
      url: this.url + '/api/topology',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { 'GremlinQuery': gremlin }
    };
    return this.backendSrv.datasourceRequest(request);
  }

  // Required
  // Used for testing datasource in datasource configuration page
  testDatasource() {
    var request = {
      url: this.url + '/api',
      method: 'GET'
    };

    if (SemverCmp(this.version, "0.9") > 0) {
      request = {
        url: this.url + '/api/topology',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { 'GremlinQuery': "G.At('-1s').V().Limit(1)" }
      };
    }

    return this.backendSrv.datasourceRequest(request).then(response => {
      if (response.status === 200) {
        return { status: "success", message: "Data source is working", title: "Success" };
      }
    }).catch(err => {
      var msg = err.status + " - " + err.statusText;
      if (err.data.length > 0) {
        msg += " : " + err.data;
      }

      throw { message: msg };
    });
  }
}
