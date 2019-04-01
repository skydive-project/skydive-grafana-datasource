"use strict";

System.register(["app/plugins/sdk", "app/core/app_events", "./css/query-editor.css!"], function (_export, _context) {
  "use strict";

  var QueryCtrl, appEvents, SkydiveDatasourceQueryCtrl;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  return {
    setters: [function (_appPluginsSdk) {
      QueryCtrl = _appPluginsSdk.QueryCtrl;
    }, function (_appCoreApp_events) {
      appEvents = _appCoreApp_events.default;
    }, function (_cssQueryEditorCss) {}],
    execute: function () {
      _export("SkydiveDatasourceQueryCtrl", SkydiveDatasourceQueryCtrl =
      /*#__PURE__*/
      function (_QueryCtrl) {
        _inherits(SkydiveDatasourceQueryCtrl, _QueryCtrl);

        /** @ngInject */
        function SkydiveDatasourceQueryCtrl($scope, $injector, uiSegmentSrv) {
          var _this;

          _classCallCheck(this, SkydiveDatasourceQueryCtrl);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(SkydiveDatasourceQueryCtrl).call(this, $scope, $injector));
          _this.scope = $scope;
          _this.uiSegmentSrv = uiSegmentSrv; // set visibility of some field depending on the type of metrics returned

          _this.metricType = 'interface';
          _this.target.metricField = _this.target.metricField || "Bytes";
          _this.metricFields = [];
          _this.metricTypeFields = {
            "interface": ['Bytes', 'Packets', 'Collisions', 'Multicast', 'RxBytes', 'RxCompressed', 'RxCrcErrors', 'RxDropped', 'RxErrors', 'RxFifoErrors', 'RxFrameErrors', 'RxLengthErrors', 'RxMissedErrors', 'RxOverErrors', 'RxPackets', 'TxAbortedErrors', 'TxBytes', 'TxCarrierErrors', 'TxCompressed', 'TxDropped', 'TxErrors', 'TxFifoErrors', 'TxHeartbeatErrors', 'TxPackets', 'TxWindowErrors'],
            "flow": ['Bytes', 'Packets', 'ABPackets', 'ABBytes', 'BAPackets', 'BABytes']
          };
          _this.dedupFlow = [{
            text: "---",
            value: "---"
          }, {
            text: "LayersPath",
            value: "LayersPath"
          }, {
            text: "Application",
            value: "Application"
          }, {
            text: "TrackingID",
            value: "TrackingID"
          }, {
            text: "ParentUUID",
            value: "ParentUUID"
          }, {
            text: "L3TrackingID",
            value: "L3TrackingID"
          }, {
            text: "NodeTID",
            value: "NodeTID"
          }];
          _this.dedupIntf = [{
            text: "---",
            value: "---"
          }, {
            text: "ID",
            value: "ID"
          }, {
            text: "TID",
            value: "TID"
          }, {
            text: "Type",
            value: "Type"
          }];
          _this.target.dedup = _this.target.dedup || "---";
          _this.dedup = _this.dedupFlow;
          _this.target.aggregates = _this.target.aggregates || false;
          _this.target.mode = _this.target.mode || "All";
          _this.mode = [{
            text: "All",
            value: "All"
          }, {
            text: "Outer only",
            value: "Outer"
          }, {
            text: "Inner only",
            value: "Inner"
          }];
          _this.prevWorked = false;
          _this.prevTitle = "";
          _this.prevGremlin = "";
          _this.prevMetricField = _this.metricField;
          _this.prevDedup = _this.dedup;
          _this.prevAggregates = _this.aggregates;
          _this.prevMode = _this.mode;

          _this.onChangeInternal();

          return _this;
        }

        _createClass(SkydiveDatasourceQueryCtrl, [{
          key: "getCollapsedText",
          value: function getCollapsedText() {
            return this.target.gremlin;
          }
        }, {
          key: "onChangeInternal",
          value: function onChangeInternal() {
            var _this2 = this;

            var range = this.panelCtrl.range;
            var query = this.datasource.targetToQuery(this.target, 1, 2);

            if (!this.prevWorked || this.prevGremlin !== query.gremlin || this.prevMetricField != this.target.metricField || this.prevAggregates != this.target.aggregates || this.prevMode != this.target.mode || this.prevTitle != this.target.title) {
              this.prevWorked = false; // flow metrics ?

              var metricType = this.metricType;
              var target = {
                gremlin: this.target.gremlin
              };
              var q = this.datasource.targetToQuery(target, range.from.format('X'), range.to.format('X'));
              this.datasource.doGremlinQuery(q.gremlin).then(function (result) {
                if (result.status === 200 && result.data.length > 0) {
                  _this2.prevWorked = true;
                  _this2.metricFields = [];
                  _this2.prevMetricField = _this2.target.metricField;

                  _.forEach(result.data[0], function (metrics, uuid) {
                    _.forEach(metrics, function (metric) {
                      _.forOwn(metric, function (value, key) {
                        if (key === "ABBytes" || key === "BABytes") {
                          metricType = "flow";
                          return false;
                        } else if (key === "RxPackets" || key === "TxPackets") {
                          metricType = "interface";
                          return false;
                        }
                      });

                      return false;
                    });

                    return false;
                  });
                }

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (var _iterator = _this2.metricTypeFields[metricType][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var k = _step.value;

                    _this2.metricFields.push({
                      text: k,
                      value: k
                    });
                  }
                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                      _iterator.return();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }

                if (metricType === "flow") {
                  _this2.dedup = _this2.dedupFlow;
                } else {
                  _this2.dedup = _this2.dedupIntf;
                }

                if (_this2.metricType != metricType) {
                  _this2.metricType = metricType; // reset the metricField as we changed of type of metrics

                  _this2.target.metricField = "Bytes";
                }

                _this2.prevTitle = _this2.target.title;
                _this2.prevGremlin = query.gremlin;
                _this2.prevMetricField = _this2.target.metricField;
                _this2.prevDedup = _this2.target.dedup;
                _this2.prevAggregates = _this2.target.aggregates;
                _this2.prevMode = _this2.target.mode;

                _this2.panelCtrl.refresh();
              }).catch(function (err) {
                var msg = err.status + " - " + err.statusText;

                if (err.data.length > 0) {
                  msg += " : " + err.data;
                }

                appEvents.emit('alert-error', ['Error', msg]);
              });
            }
          }
        }]);

        return SkydiveDatasourceQueryCtrl;
      }(QueryCtrl));

      SkydiveDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
    }
  };
});
//# sourceMappingURL=query_ctrl.js.map
