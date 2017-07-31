'use strict';

System.register(['app/plugins/sdk', './css/query-editor.css!'], function (_export, _context) {
  "use strict";

  var QueryCtrl, _createClass, SkydiveDatasourceQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      QueryCtrl = _appPluginsSdk.QueryCtrl;
    }, function (_cssQueryEditorCss) {}],
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

      _export('SkydiveDatasourceQueryCtrl', SkydiveDatasourceQueryCtrl = function (_QueryCtrl) {
        _inherits(SkydiveDatasourceQueryCtrl, _QueryCtrl);

        /** @ngInject */
        function SkydiveDatasourceQueryCtrl($scope, $injector, uiSegmentSrv) {
          _classCallCheck(this, SkydiveDatasourceQueryCtrl);

          var _this = _possibleConstructorReturn(this, (SkydiveDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(SkydiveDatasourceQueryCtrl)).call(this, $scope, $injector));

          _this.scope = $scope;
          _this.uiSegmentSrv = uiSegmentSrv;

          // set visibility of some field depending on the type of metrics returned
          _this.flowMetrics = false;

          _this.target.metricField = _this.target.metricField || "Bytes";

          // TODO(safchain) request datasource to get metrics fields dynamically
          _this.metricFields = [];

          _this.dedupFlow = [{ text: "---", value: "---" }, { text: "LayersPath", value: "LayersPath" }, { text: "Application", value: "Application" }, { text: "TrackingID", value: "TrackingID" }, { text: "ParentUUID", value: "ParentUUID" }, { text: "NodeTID", value: "NodeTID" }, { text: "ANodeTID", value: "ANodeTID" }, { text: "BNodeTID", value: "BNodeTID" }];

          _this.dedupIntf = [{ text: "---", value: "---" }, { text: "ID", value: "ID" }, { text: "TID", value: "TID" }, { text: "Type", value: "Type" }];

          _this.target.dedup = _this.target.dedup || "---";
          _this.dedup = _this.dedupFlow;

          _this.target.aggregates = _this.target.aggregates || false;

          _this.target.mode = _this.target.mode || "All";
          _this.mode = [{ text: "All", value: "All" }, { text: "Outer only", value: "Outer" }, { text: "Inner only", value: "Inner" }];

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
          key: 'getCollapsedText',
          value: function getCollapsedText() {
            return this.target.gremlin;
          }
        }, {
          key: 'onChangeInternal',
          value: function onChangeInternal() {
            var _this2 = this;

            var range = this.panelCtrl.range;

            var query = this.datasource.targetToQuery(this.target, 1, 2);

            if (!this.prevWorked || this.prevGremlin != query.gremlin || this.prevMetricField != this.target.metricField || this.prevAggregates != this.target.aggregates || this.prevMode != this.target.mode || this.prevTitle != this.target.title) {

              this.prevWorked = false;

              // flow metrics ?
              var flowMetrics = false;

              var target = {
                gremlin: this.target.gremlin
              };

              var q = this.datasource.targetToQuery(target, range.from.format('X'), range.to.format('X'));
              this.datasource.doGremlinQuery(q.gremlin).then(function (result) {
                if (result.status === 200 && result.data.length > 0) {
                  _this2.prevWorked = true;

                  _this2.metricFields = [{ text: "Bytes", value: "Bytes" }, { text: "Packets", value: "Packets" }];
                  _this2.prevMetricField = _this2.target.metricField;

                  _.forEach(result.data[0], function (metrics, uuid) {
                    _.forEach(metrics, function (metric) {
                      _.forOwn(metric, function (value, key) {
                        if (key == "ABBytes") {
                          flowMetrics = true;
                        }
                        _this2.metricFields.push({ text: key, value: key });
                      });

                      return false;
                    });
                    return false;
                  });
                }

                if (flowMetrics) {
                  _this2.dedup = _this2.dedupFlow;
                } else {
                  _this2.dedup = _this2.dedupIntf;
                }
                if (_this2.flowMetrics != flowMetrics) {
                  _this2.flowMetrics = flowMetrics;

                  // reset the metricField as we changed of type of metrics
                  _this2.target.metricField = "Bytes";
                }

                _this2.prevTitle = _this2.target.title;
                _this2.prevGremlin = query.gremlin;
                _this2.prevMetricField = _this2.target.metricField;
                _this2.prevDedup = _this2.target.dedup;
                _this2.prevAggregates = _this2.target.aggregates;
                _this2.prevMode = _this2.target.mode;

                _this2.panelCtrl.refresh();
              });
            }
          }
        }]);

        return SkydiveDatasourceQueryCtrl;
      }(QueryCtrl));

      _export('SkydiveDatasourceQueryCtrl', SkydiveDatasourceQueryCtrl);

      SkydiveDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
    }
  };
});
//# sourceMappingURL=query_ctrl.js.map
