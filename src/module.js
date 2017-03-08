import {SkydiveDatasource} from './datasource';
import {SkydiveConfigCtrl} from './config_ctrl';
import {SkydiveDatasourceQueryCtrl} from './query_ctrl';

class SkydiveQueryOptionsCtrl {}
SkydiveQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

export {
  SkydiveDatasource as Datasource,
  SkydiveDatasourceQueryCtrl as QueryCtrl,
  SkydiveConfigCtrl as ConfigCtrl,
  SkydiveQueryOptionsCtrl as QueryOptionsCtrl
};
