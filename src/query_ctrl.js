import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'

export class SkydiveDatasourceQueryCtrl extends QueryCtrl {

  /** @ngInject */
  constructor($scope, $injector, uiSegmentSrv) {
    super($scope, $injector);

    this.scope = $scope;
    this.uiSegmentSrv = uiSegmentSrv;

    // set visibility of some field depending on the type of metrics returned
    this.metricType = 'interface';

    this.target.metricField = this.target.metricField || "Bytes";

    this.metricFields = [];
    this.metricTypeFields = {
      "interface": [
        'Bytes',
        'Packets',
        'Collisions',
        'Multicast',
        'RxBytes',
        'RxCompressed',
        'RxCrcErrors',
        'RxDropped',
        'RxErrors',
        'RxFifoErrors',
        'RxFrameErrors',
        'RxLengthErrors',
        'RxMissedErrors',
        'RxOverErrors',
        'RxPackets',
        'TxAbortedErrors',
        'TxBytes',
        'TxCarrierErrors',
        'TxCompressed',
        'TxDropped',
        'TxErrors',
        'TxFifoErrors',
        'TxHeartbeatErrors',
        'TxPackets',
        'TxWindowErrors'
      ],
      "flow": [
        'Bytes',
        'Packets',
        'ABPackets',
        'ABBytes',
        'BAPackets',
        'BABytes'
      ]
    };

    this.dedupFlow = [
      {text: "---", value: "---"},
      {text: "LayersPath", value: "LayersPath"},
      {text: "Application", value: "Application"},
      {text: "TrackingID", value: "TrackingID"},
      {text: "ParentUUID", value: "ParentUUID"},
      {text: "NodeTID", value: "NodeTID"},
      {text: "ANodeTID", value: "ANodeTID"},
      {text: "BNodeTID", value: "BNodeTID"}
    ];

    this.dedupIntf = [
      {text: "---", value: "---"},
      {text: "ID", value: "ID"},
      {text: "TID", value: "TID"},
      {text: "Type", value: "Type"}
    ];

    this.target.dedup = this.target.dedup || "---";
    this.dedup = this.dedupFlow;

    this.target.aggregates = this.target.aggregates || false;

    this.target.mode = this.target.mode || "All";
    this.mode = [
      {text: "All", value: "All"},
      {text: "Outer only", value: "Outer"},
      {text: "Inner only", value: "Inner"}
    ];

    this.prevWorked = false;
    this.prevTitle = "";
    this.prevGremlin = "";
    this.prevMetricField = this.metricField;
    this.prevDedup = this.dedup;
    this.prevAggregates = this.aggregates;
    this.prevMode = this.mode;

    this.onChangeInternal();
  }

  getCollapsedText() {
    return this.target.gremlin;
  }

  onChangeInternal() {
    var range = this.panelCtrl.range;

    var query = this.datasource.targetToQuery(this.target, 1, 2);

    if (!this.prevWorked || this.prevGremlin !== query.gremlin || this.prevMetricField != this.target.metricField ||
        this.prevAggregates != this.target.aggregates || this.prevMode != this.target.mode ||
        this.prevTitle != this.target.title) {

      this.prevWorked = false;

      // flow metrics ?
      var metricType = this.metricType;

      var target = {
        gremlin: this.target.gremlin
      };

      var q = this.datasource.targetToQuery(target, range.from.format('X'), range.to.format('X'));
      this.datasource.doGremlinQuery(q.gremlin).then(result => {
        if (result.status === 200 && result.data.length > 0) {
          this.prevWorked = true;

          this.metricFields = [];
          this.prevMetricField = this.target.metricField;

          _.forEach(result.data[0], (metrics, uuid) => {
            _.forEach(metrics, metric => {
              _.forOwn(metric, (value, key) => {
                if (key === "ABBytes" || key === "BABytes") {
                  metricType = "flow";
                  return false;
                } else if (key === "RxPackets" || key === "TxPackets") {
                  metricType = "interface";
                  return false;
                }
              });

              return false;
            });
            return false;
          });
        }

        for (let k of this.metricTypeFields[metricType]) {
          this.metricFields.push({text: k, value: k});
        }

        if (metricType === "flow") {
          this.dedup = this.dedupFlow;
        } else {
          this.dedup = this.dedupIntf;
        }
        if (this.metricType != metricType) {
          this.metricType = metricType;

          // reset the metricField as we changed of type of metrics
          this.target.metricField = "Bytes";
        }

        this.prevTitle = this.target.title;
        this.prevGremlin = query.gremlin;
        this.prevMetricField = this.target.metricField;
        this.prevDedup = this.target.dedup;
        this.prevAggregates = this.target.aggregates;
        this.prevMode = this.target.mode;

        this.panelCtrl.refresh();
      });
    }
  }
}

SkydiveDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
