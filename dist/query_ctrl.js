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

        function SkydiveDatasourceQueryCtrl($scope, $injector, uiSegmentSrv) {
          _classCallCheck(this, SkydiveDatasourceQueryCtrl);

          var _this = _possibleConstructorReturn(this, (SkydiveDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(SkydiveDatasourceQueryCtrl)).call(this, $scope, $injector));

          _this.scope = $scope;
          _this.uiSegmentSrv = uiSegmentSrv;

          _this.target.metricField = "Bytes";

          // TODO(safchain) request datasource to get metrics fields dynamically
          _this.metricFields = [{ text: "Bytes", value: "Bytes" }, { text: "Packets", value: "Packets" }, { text: "ABBytes", value: "ABBytes" }, { text: "BABytes", value: "BABytes" }, { text: "ABPackets", value: "ABPackets" }, { text: "BAPackets", value: "BAPackets" }];

          _this.target.dedup = "---";
          _this.dedup = [{ text: "---", value: "---" }, { text: "LayersPath", value: "LayersPath" }, { text: "Application", value: "Application" }, { text: "TrackingID", value: "TrackingID" }, { text: "ParentUUID", value: "ParentUUID" }, { text: "NodeTID", value: "NodeTID" }, { text: "ANodeTID", value: "ANodeTID" }, { text: "BNodeTID", value: "BNodeTID" }];

          _this.target.aggregates = true;

          _this.target.mode = 'All';
          _this.mode = [{ text: "All", value: "All" }, { text: "Outer only", value: "Outer" }, { text: "Inner only", value: "Inner" }];
          return _this;
        }

        _createClass(SkydiveDatasourceQueryCtrl, [{
          key: 'getCollapsedText',
          value: function getCollapsedText() {
            return this.target.query;
          }
        }, {
          key: 'onChangeInternal',
          value: function onChangeInternal() {
            this.panelCtrl.refresh();
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
