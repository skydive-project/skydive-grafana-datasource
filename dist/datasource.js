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

        /** @ngInject **/
        function SkydiveDatasource(instanceSettings, $q, backendSrv, templateSrv) {
          _classCallCheck(this, SkydiveDatasource);

          console.log(instanceSettings);
          this.type = instanceSettings.type;
          this.url = instanceSettings.url;
          this.name = instanceSettings.name;
          this.version = instanceSettings.jsonData.version;
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
              return !target.hide && target.gremlin && target.gremlin !== 'Gremlin query';
            });

            if (targets.length <= 0) {
              return this.q.when({ data: [] });
            }

            var queries = _.map(targets, function (target) {
              return _this.targetToQuery(target, options.range.from.format('X'), options.range.to.format('X'));
            });

            var promises = this.doQueries(queries);
            return this.q.all(promises).then(function (results) {
              return { data: _.flatten(results) };
            });
          }
        }, {
          key: "targetToRequest",
          value: function targetToRequest(target, from, to) {
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
        }, {
          key: "targetToQuery",
          value: function targetToQuery(target, from, to) {
            return this.requestToQuery(this.targetToRequest(target, from, to));
          }
        }, {
          key: "gremlinTimeContext",
          value: function gremlinTimeContext(gremlin, request) {
            if (this.version == "0.9") {
              gremlin = gremlin.replace(/^G\./i, 'G.At(' + request.to + ').');
              gremlin = gremlin.replace(/\.Flows\([^)]*\)/i, '.Flows(Since(' + (request.to - request.from) + '))');
            } else {
              gremlin = gremlin.replace(/^G\./i, 'G.At(' + request.to + ',' + (request.to - request.from) + ').');
            }

            return gremlin;
          }
        }, {
          key: "requestToQuery",
          value: function requestToQuery(request) {
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

            return { gremlin: gremlin, request: request };
          }
        }, {
          key: "doQueries",
          value: function doQueries(queries) {
            var _this2 = this;

            return _.map(queries, function (query) {
              return _this2.doQuery(query);
            });
          }
        }, {
          key: "doQuery",
          value: function doQuery(query) {
            var _this3 = this;

            console.log(query.gremlin);

            return this.doGremlinQuery(query.gremlin).then(function (result) {
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

                  if (_this3.version != "0.9") {
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
        }, {
          key: "doGremlinQuery",
          value: function doGremlinQuery(gremlin) {
            var options = {
              url: this.url + '/api/topology',
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              data: { 'GremlinQuery': gremlin }
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
