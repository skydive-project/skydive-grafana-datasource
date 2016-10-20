import {SkydiveDatasource} from './datasource';
import {SkydiveDatasourceQueryCtrl} from './query_ctrl';

class SkydiveConfigCtrl {}
SkydiveConfigCtrl.templateUrl = 'partials/config.html';

class SkydiveQueryOptionsCtrl {}
SkydiveQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

export {
  SkydiveDatasource as Datasource,
  SkydiveDatasourceQueryCtrl as QueryCtrl,
  SkydiveConfigCtrl as ConfigCtrl,
  SkydiveQueryOptionsCtrl as QueryOptionsCtrl
};
