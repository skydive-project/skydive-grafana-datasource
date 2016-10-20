'use strict';

System.register(['./datasource', './query_ctrl'], function (_export, _context) {
  "use strict";

  var SkydiveDatasource, SkydiveDatasourceQueryCtrl, SkydiveConfigCtrl, SkydiveQueryOptionsCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_datasource) {
      SkydiveDatasource = _datasource.SkydiveDatasource;
    }, function (_query_ctrl) {
      SkydiveDatasourceQueryCtrl = _query_ctrl.SkydiveDatasourceQueryCtrl;
    }],
    execute: function () {
      _export('ConfigCtrl', SkydiveConfigCtrl = function SkydiveConfigCtrl() {
        _classCallCheck(this, SkydiveConfigCtrl);
      });

      SkydiveConfigCtrl.templateUrl = 'partials/config.html';

      _export('QueryOptionsCtrl', SkydiveQueryOptionsCtrl = function SkydiveQueryOptionsCtrl() {
        _classCallCheck(this, SkydiveQueryOptionsCtrl);
      });

      SkydiveQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

      _export('Datasource', SkydiveDatasource);

      _export('QueryCtrl', SkydiveDatasourceQueryCtrl);

      _export('ConfigCtrl', SkydiveConfigCtrl);

      _export('QueryOptionsCtrl', SkydiveQueryOptionsCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
