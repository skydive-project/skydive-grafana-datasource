"use strict";

System.register(["lodash", "./semver", "./metrics"], function (_export, _context) {
  "use strict";

  var _, SemverCmp, Metrics, Version, SkydiveDatasource;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_semver) {
      SemverCmp = _semver.SemverCmp;
    }, function (_metrics) {
      Metrics = _metrics.Metrics;
      Version = _metrics.Version;
    }],
    execute: function () {
      _export("SkydiveDatasource", SkydiveDatasource =
      /*#__PURE__*/
      function () {
        /** @ngInject **/
        function SkydiveDatasource(instanceSettings, $q, backendSrv, templateSrv) {
          _classCallCheck(this, SkydiveDatasource);

          this.type = instanceSettings.type;
          this.url = instanceSettings.url;
          this.name = instanceSettings.name;
          this.version = instanceSettings.jsonData.version;
          this.q = $q;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;
          Version(this.version);
        } // Called once per panel (graph)


        _createClass(SkydiveDatasource, [{
          key: "query",
          value: function query(options) {
            var _this = this;

            var targets = _.filter(options.targets, function (target) {
              return !target.hide && target.gremlin && target.gremlin !== 'Gremlin query';
            });

            if (targets.length <= 0) {
              return this.q.when({
                data: []
              });
            }

            var requests = _.map(targets, function (target) {
              return _this.targetToRequest(target, options.range.from.format('X'), options.range.to.format('X'));
            });

            var promises = this.sendRequests(requests);
            return this.q.all(promises).then(function (results) {
              return {
                data: _.flatten(results)
              };
            });
          }
        }, {
          key: "targetToRequest",
          value: function targetToRequest(target, from, to) {
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
              "field": field
            };
          }
        }, {
          key: "setTimeContext",
          value: function setTimeContext(gremlin, from, to) {
            // removing Context/At and Metric from the original query if present
            gremlin = gremlin.replace(/^G\.At\([^)]*\)/i, 'G');
            gremlin = gremlin.replace(/^G\.Context\([^)]*\)/i, 'G');
            gremlin = gremlin.replace(/\.Metrics\([^)]*\)/i, '');
            gremlin = gremlin.replace(/\.Aggregates\([^)]*\)/i, '');
            gremlin = gremlin.replace(/\.Dedup\([^)]*\)/i, ''); // add time context

            if (SemverCmp(this.version, "0.9") == 0) {
              gremlin = gremlin.replace(/^G\./i, 'G.At(' + to + ').');
              gremlin = gremlin.replace(/\.Flows\([^)]*\)/i, '.Flows(Since(' + (to - from) + '))');
            } else {
              gremlin = gremlin.replace(/^G\./i, 'G.At(' + to + ',' + (to - from) + ').');
            }

            return gremlin;
          }
        }, {
          key: "getKeys",
          value: function getKeys(gremlin, from, to) {
            gremlin = this.setTimeContext(gremlin, from, to);
            return this.sendRawGremlinQuery(gremlin + ".Limit(10).Keys()");
          }
        }, {
          key: "sendRequests",
          value: function sendRequests(requests) {
            var _this2 = this;

            return _.map(requests, function (request) {
              return _this2.sendRequest(request);
            });
          }
        }, {
          key: "sendRequest",
          value: function sendRequest(request) {
            console.log(request.gremlin);
            return this.sendRawGremlinQuery(request.gremlin).then(function (resp) {
              if (resp.status !== 200) {
                return [];
              }

              if (resp.data.length <= 0) {
                return [];
              }

              var datapoints = request.field.PointsFnc(resp.data, request.target.field);
              return [{
                target: request.target.title || "Metrics",
                datapoints: _.toArray(datapoints).reverse()
              }];
            }).catch(function (err) {
              if (err.data) {
                throw {
                  message: err.data
                };
              } else {
                throw {
                  message: err
                };
              }
            });
          } // send a raw gremlin query

        }, {
          key: "sendRawGremlinQuery",
          value: function sendRawGremlinQuery(gremlin) {
            var request = {
              url: this.url + '/api/topology',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              data: {
                'GremlinQuery': gremlin
              }
            };
            return this.backendSrv.datasourceRequest(request);
          } // Required
          // Used for testing datasource in datasource configuration page

        }, {
          key: "testDatasource",
          value: function testDatasource() {
            var request = {
              url: this.url + '/api',
              method: 'GET'
            };

            if (SemverCmp(this.version, "0.9") > 0) {
              request = {
                url: this.url + '/api/topology',
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                data: {
                  'GremlinQuery': "G.At('-1s').V().Limit(1)"
                }
              };
            }

            return this.backendSrv.datasourceRequest(request).then(function (response) {
              if (response.status === 200) {
                return {
                  status: "success",
                  message: "Data source is working",
                  title: "Success"
                };
              }
            }).catch(function (err) {
              var msg = err.status + " - " + err.statusText;

              if (err.data.length > 0) {
                msg += " : " + err.data;
              }

              throw {
                message: msg
              };
            });
          }
        }]);

        return SkydiveDatasource;
      }());
    }
  };
});
//# sourceMappingURL=datasource.js.map
