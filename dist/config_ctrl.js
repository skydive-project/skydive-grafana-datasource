"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var _createClass, SkydiveConfigCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
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

      _export("SkydiveConfigCtrl", SkydiveConfigCtrl = function () {

        /** @ngInject */
        function SkydiveConfigCtrl($scope) {
          _classCallCheck(this, SkydiveConfigCtrl);

          this.scope = $scope;

          this.versionFields = [{ text: "0.9.x", value: "0.9" }, { text: ">= 0.10.x", value: "0.10" }];

          this.current.jsonData.version = this.current.jsonData.version || this.versionFields[0].value;
        }

        _createClass(SkydiveConfigCtrl, [{
          key: "versionChanged",
          value: function versionChanged() {
            console.log(this.current.jsonData.version);
          }
        }]);

        return SkydiveConfigCtrl;
      }());

      _export("SkydiveConfigCtrl", SkydiveConfigCtrl);

      SkydiveConfigCtrl.templateUrl = 'partials/config.html';
    }
  };
});
//# sourceMappingURL=config_ctrl.js.map
