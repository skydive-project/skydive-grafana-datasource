"use strict";

System.register(["lodash", "moment"], function (_export, _context) {
  "use strict";

  var _, moment, _createClass, SkydiveDatasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_moment) {
      moment = _moment.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export("SkydiveDatasource", SkydiveDatasource = function () {
        function SkydiveDatasource(instanceSettings, $q, backendSrv, templateSrv) {
          _classCallCheck(this, SkydiveDatasource);

          this.type = instanceSettings.type;
          this.url = instanceSettings.url;
          this.name = instanceSettings.name;
          this.q = $q;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;
        }

        // Called once per panel (graph)


        _createClass(SkydiveDatasource, [{
          key: "query",
          value: function query(options) {
            var _this = this;

            var targets = _.filter(options.targets, function (target) {
              return !target.hide && target.query && target.query !== 'Gremlin query';
            });

            if (targets.length <= 0) {
              return this.q.when({ data: [] });
            }

            var requests = _.map(targets, function (target) {
              return {
                query: _this.templateSrv.replace(target.query),
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

            var promises = this.doRequests(requests);
            return this.q.all(promises).then(function (results) {
              return { data: _.flatten(results) };
            });
          }
        }, {
          key: "doRequests",
          value: function doRequests(requests) {
            var _this2 = this;

            return _.map(requests, function (request) {
              return _this2.doRequest(request);
            });
          }
        }, {
          key: "doRequest",
          value: function doRequest(request) {
            // removing Context/At and Metric from the original query if present
            var query = request.query.replace(/^G\.At\([^)]*\)/i, 'G');
            query = request.query.replace(/^G\.Context\([^)]*\)/i, 'G');
            query = query.replace(/\.Metrics\([^)]*\)/i, '');

            // add time context
            query = query.replace(/^G\./i, 'G.At(' + request.to + ').');

            // add Since predicate to flows
            query = query.replace(/\.Flows\([^)]*\)/i, '.Flows(Since(' + (request.to - request.from) + '))');

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

            return this.doGremlinQuery(query).then(function (result) {
              var data = [];
              if (result.status !== 200) {
                return data;
              }

              if (result.data.length <= 0) {
                return data;
              }

              _.forEach(result.data[0], function (metrics, uuid) {
                var datapoints = _.map(metrics, function (metric) {
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
        }, {
          key: "doGremlinQuery",
          value: function doGremlinQuery(query) {
            var options = {
              url: this.url + '/api/topology',
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              data: { 'GremlinQuery': query }
            };
            return this.backendSrv.datasourceRequest(options);
          }
        }, {
          key: "testDatasource",
          value: function testDatasource() {
            return this.backendSrv.datasourceRequest({
              url: this.url + '/api',
              method: 'GET'
            }).then(function (response) {
              if (response.status === 200) {
                return { status: "success", message: "Data source is working", title: "Success" };
              }
            });
          }
        }]);

        return SkydiveDatasource;
      }());

      _export("SkydiveDatasource", SkydiveDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
