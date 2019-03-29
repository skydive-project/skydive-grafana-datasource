"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var SkydiveConfigCtrl;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [],
    execute: function () {
      _export("SkydiveConfigCtrl", SkydiveConfigCtrl =
      /*#__PURE__*/
      function () {
        /** @ngInject */
        function SkydiveConfigCtrl($scope) {
          _classCallCheck(this, SkydiveConfigCtrl);

          this.scope = $scope;
          this.versionFields = [{
            text: "0.9.x",
            value: "0.9"
          }, {
            text: ">= 0.10.x",
            value: "0.10"
          }];
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

      SkydiveConfigCtrl.templateUrl = 'partials/config.html';
    }
  };
});
//# sourceMappingURL=config_ctrl.js.map
