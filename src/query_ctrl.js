import { QueryCtrl } from 'app/plugins/sdk';
import appEvents from 'app/core/app_events';
import './css/query-editor.css!'
import { TypeByKeys, Metrics } from './metrics';
import { SemverCmp } from "./semver";

export class SkydiveDatasourceQueryCtrl extends QueryCtrl {

  /** @ngInject */
  constructor($scope, $injector, uiSegmentSrv) {
    super($scope, $injector);

    this.scope = $scope;
    this.uiSegmentSrv = uiSegmentSrv;

    this.metricTypes = [];
    this.metricFields = [];

    this.target.gremlin = this.target.gremlin || "";
    this.target.metricType = this.target.metricType || 'Interface';
    this.target.metricField = this.target.metricField || 'Interface.Default.Bytes';

    this.prevGremlin = this.target.gremlin;

    this.updateTypes();
  }

  getCollapsedText() {
    return this.target.gremlin;
  }

  updateTypes() {
    if (this.target.gremlin == "") {
      return;
    }

    var range = this.panelCtrl.range;

    this.datasource.getKeys(this.target.gremlin,
      range.from.format('X'), range.to.format('X')).then(result => {

        if (result.status === 200) {
          if (!result.data || result.data.length == 0) {
            throw("No data, please check your Gremlin expression")
          }

          var type = TypeByKeys(result.data);

          var metrics = Metrics[type];
          if (Object.keys(metrics).length == 0) {
            return this.onError({ message: "Unable to detect type of metric" })
          }

          this.metricTypes = [];
          for (let subType in metrics) {
            if (SemverCmp(this.datasource.version, metrics[subType].MinVer) >= 0) {
              this.metricTypes.push({ text: metrics[subType].Name, value: type + "." + subType });
            }
          }
          if (this.target.metricType == '') {
            this.target.metricType = type + ".Default";
          }

          this.updateMetricFields();

          this.panelCtrl.refresh();
        }
      }).catch(this.onError.bind(this));
  }

  updateMetricFields() {
    var tm = this.target.metricType.split(".");

    var type = tm[0];
    var subType = tm[1];

    this.metricFields = [];

    var fields = Metrics[type][subType].Fields;
    for (let key in fields) {
      this.metricFields.push({ text: fields[key].Name, value: this.target.metricType + "." + key });
    }
    if (this.target.metricField == '') {
      this.target.metricField = this.target.metricType + "." + Metrics[type][subType].Default;
    }
  }

  onMetricTypeChange() {
    this.target.metricField = '';
    this.updateMetricFields();

    this.panelCtrl.refresh();
  }

  onMetricFieldChange() {
    this.panelCtrl.refresh();
  }

  onGremlinChange() {
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

  onError(err) {
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
}

SkydiveDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
