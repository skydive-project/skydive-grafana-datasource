import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'

export class SkydiveDatasourceQueryCtrl extends QueryCtrl {

  constructor($scope, $injector, uiSegmentSrv)  {
    super($scope, $injector);

    this.scope = $scope;
    this.uiSegmentSrv = uiSegmentSrv;

    this.target.metricField = "Bytes";

    // TODO(safchain) request datasource to get metrics fields dynamically
    this.metricFields = [
      {text: "Bytes", value: "Bytes"},
      {text: "Packets", value: "Packets"},
      {text: "ABBytes", value: "ABBytes"},
      {text: "BABytes", value: "BABytes"},
      {text: "ABPackets", value: "ABPackets"},
      {text: "BAPackets", value: "BAPackets"}
    ];

    this.target.dedup = "---";
    this.dedup = [
      {text: "---", value: "---"},
      {text: "LayersPath", value: "LayersPath"},
      {text: "Application", value: "Application"},
      {text: "TrackingID", value: "TrackingID"},
      {text: "ParentUUID", value: "ParentUUID"},
      {text: "NodeTID", value: "NodeTID"},
      {text: "ANodeTID", value: "ANodeTID"},
      {text: "BNodeTID", value: "BNodeTID"}
    ];

    this.target.aggregates = true;

    this.target.mode = 'All';
    this.mode = [
      {text: "All", value: "All"},
      {text: "Outer only", value: "Outer"},
      {text: "Inner only", value: "Inner"}
    ];
  }

  getCollapsedText() {
    return this.target.query;
  }

  onChangeInternal() {
    this.panelCtrl.refresh();
  }
}

SkydiveDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
