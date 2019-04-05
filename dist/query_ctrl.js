"use strict";

System.register(["app/plugins/sdk", "app/core/app_events", "./css/query-editor.css!", "./metrics", "./semver"], function (_export, _context) {
  "use strict";

  var QueryCtrl, appEvents, TypeByKeys, Metrics, SemverCmp, SkydiveDatasourceQueryCtrl;

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
    }, function (_cssQueryEditorCss) {}, function (_metrics) {
      TypeByKeys = _metrics.TypeByKeys;
      Metrics = _metrics.Metrics;
    }, function (_semver) {
      SemverCmp = _semver.SemverCmp;
    }],
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
          _this.uiSegmentSrv = uiSegmentSrv;
          _this.metricTypes = [];
          _this.metricFields = [];
          _this.target.gremlin = _this.target.gremlin || "";
          _this.target.metricType = _this.target.metricType || 'Interface';
          _this.target.metricField = _this.target.metricField || 'Interface.Default.Bytes';
          _this.prevGremlin = _this.target.gremlin;

          _this.updateTypes();

          return _this;
        }

        _createClass(SkydiveDatasourceQueryCtrl, [{
          key: "getCollapsedText",
          value: function getCollapsedText() {
            return this.target.gremlin;
          }
        }, {
          key: "updateTypes",
          value: function updateTypes() {
            var _this2 = this;

            if (this.target.gremlin == "") {
              return;
            }

            var range = this.panelCtrl.range;
            this.datasource.getKeys(this.target.gremlin, range.from.format('X'), range.to.format('X')).then(function (result) {
              if (result.status === 200) {
                if (!result.data || result.data.length == 0) {
                  throw "No data, please check your Gremlin expression";
                }

                var type = TypeByKeys(result.data);
                var metrics = Metrics[type];

                if (Object.keys(metrics).length == 0) {
                  return _this2.onError({
                    message: "Unable to detect type of metric"
                  });
                }

                _this2.metricTypes = [];

                for (var subType in metrics) {
                  if (SemverCmp(_this2.datasource.version, metrics[subType].MinVer) >= 0) {
                    _this2.metricTypes.push({
                      text: metrics[subType].Name,
                      value: type + "." + subType
                    });
                  }
                }

                if (_this2.target.metricType == '') {
                  _this2.target.metricType = type + ".Default";
                }

                _this2.updateMetricFields();

                _this2.panelCtrl.refresh();
              }
            }).catch(this.onError.bind(this));
          }
        }, {
          key: "updateMetricFields",
          value: function updateMetricFields() {
            var tm = this.target.metricType.split(".");
            var type = tm[0];
            var subType = tm[1];
            this.metricFields = [];
            var fields = Metrics[type][subType].Fields;

            for (var key in fields) {
              this.metricFields.push({
                text: fields[key].Name,
                value: this.target.metricType + "." + key
              });
            }

            if (this.target.metricField == '') {
              this.target.metricField = this.target.metricType + "." + Metrics[type][subType].Default;
            }
          }
        }, {
          key: "onMetricTypeChange",
          value: function onMetricTypeChange() {
            this.target.metricField = '';
            this.updateMetricFields();
            this.panelCtrl.refresh();
          }
        }, {
          key: "onMetricFieldChange",
          value: function onMetricFieldChange() {
            this.panelCtrl.refresh();
          }
        }, {
          key: "onGremlinChange",
          value: function onGremlinChange() {
            if (this.target.gremlin == "") {
              return;
            }

            if (this.prevGremlin != this.target.gremlin) {
              this.prevGremlin = this.target.gremlin;
              this.target.metricType = '';
              this.target.metricField = '';
              this.updateTypes();
            }
          }
        }, {
          key: "onError",
          value: function onError(err) {
            if (err.status) {
              var msg = err.status + " - " + err.statusText;

              if (err.data && err.data.length > 0) {
                msg += " : " + err.data;
              }

              appEvents.emit('alert-error', ['Error', msg]);
            } else {
              appEvents.emit('alert-error', ['Error', err]);
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
