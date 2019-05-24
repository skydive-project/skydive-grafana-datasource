"use strict";

System.register(["lodash", "moment", "./semver"], function (_export, _context) {
  "use strict";

  var _, moment, SemverCmp, Metrics, version, metricFnc, rttFnc;

  function Version(ver) {
    _export("version", version = ver);
  }

  function TypeByKeys(keys) {
    if (keys.indexOf("Filters") >= 0 && keys.indexOf("Actions") >= 0) {
      return "OpenFlow";
    } else if (keys.indexOf("TrackingID") >= 0) {
      return "Flow";
    } else {
      return "Interface";
    }

    return {};
  }

  _export({
    Version: Version,
    TypeByKeys: TypeByKeys
  });

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_moment) {
      moment = _moment.default;
    }, function (_semver) {
      SemverCmp = _semver.SemverCmp;
    }],
    execute: function () {
      _export("Metrics", Metrics = {});

      _export("version", version = "");

      ;

      metricFnc = function metricFnc(res, field1, field2) {
        var points = [];
        var div = 1;

        if (SemverCmp(version, "0.9") > 0) {
          div = 1000;
        }

        _.forEach(res[0], function (entries) {
          _.forEach(entries, function (entry) {
            var value1 = 0,
                value2 = 0;

            if (field1 in entry) {
              value1 = entry[field1];
            }

            if (field2 in entry) {
              value2 = entry[field2];
            }

            var start = entry.Start;
            var last = entry.Last;

            if (div > 1) {
              start /= div;
              last /= div;
            }

            var value = (value1 + value2) / (last - start);
            points.push([value, moment(last, 'X').valueOf()]);
          });
        });

        return points;
      };

      rttFnc = function rttFnc(res, field) {
        var points = [];

        _.forEach(res[0], function (entries) {
          _.forEach(entries, function (entry) {
            var value = 0;

            if (field in entry) {
              value = entry[field];
            }

            var start = entry.Start / 1000;
            points.push([value, moment(start, 'X').valueOf()]);
          });
        });

        return _.sortBy(points, [function (v) {
          return v[1];
        }]);
      };

      Metrics["Flow"] = {
        "Default": {
          "Name": "Flow",
          "Default": "Bytes",
          "MinVer": "0.1",
          "Fields": {
            "Packets": {
              Name: "Packets",
              Suffix: "Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "ABPackets", "BAPackets");
              }
            },
            "Bytes": {
              Name: "Bytes",
              Suffix: "Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "ABBytes", "BABytes");
              }
            },
            "ABPackets": {
              Name: "ABPackets",
              Suffix: "Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "ABPackets");
              }
            },
            "ABBytes": {
              Name: "ABBytes",
              Suffix: "Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "ABBytes");
              }
            },
            "BAPackets": {
              Name: "BAPackets",
              Suffix: "Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "ABBytes");
              }
            },
            "BABytes": {
              Name: "BABytes",
              Suffix: "Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "ABBytes");
              }
            },
            "RTT": {
              Name: "RTT",
              Suffix: "Metrics()",
              PointsFnc: function PointsFnc(res) {
                return rttFnc(res, "RTT");
              }
            }
          }
        }
      };
      Metrics["OpenFlow"] = {
        "Default": {
          "Name": "OpenFlow",
          "Default": "RxBytes",
          "MinVer": "0.23",
          "Fields": {
            "RxPackets": {
              Name: "Packets",
              Suffix: "Has('Type', 'ofrule').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxPackets");
              }
            },
            "RxBytes": {
              Name: "Bytes",
              Suffix: "Has('Type', 'ofrule').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxBytes");
              }
            }
          }
        }
      };
      Metrics["Interface"] = {
        "Default": {
          "Name": "Interface",
          "Default": "Bytes",
          "MinVer": "0.1",
          "Fields": {
            "Packets": {
              Name: "Packets",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxPackets", "TxPackets");
              }
            },
            "Bytes": {
              Name: "Bytes",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxBytes", "TxBytes");
              }
            },
            "Collisions": {
              Name: "Collisions",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "Collisions");
              }
            },
            "Multicast": {
              Name: "Multicast",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "Multicast");
              }
            },
            "RxBytes": {
              Name: "RxBytes",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxBytes");
              }
            },
            "RxCompressed": {
              Name: "RxCompressed",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxCompressed");
              }
            },
            "RxCrcErrors": {
              Name: "RxCrcErrors",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxCrcErrors");
              }
            },
            "RxDropped": {
              Name: "RxDropped",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxDropped");
              }
            },
            "RxErrors": {
              Name: "RxErrors",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxErrors");
              }
            },
            "RxFifoErrors": {
              Name: "RxFifoErrors",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxFifoErrors");
              }
            },
            "RxFrameErrors": {
              Name: "RxFrameErrors",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxFrameErrors");
              }
            },
            "RxLengthErrors": {
              Name: "RxLengthErrors",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxLengthErrors");
              }
            },
            "RxMissedErrors": {
              Name: "RxMissedErrors",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxMissedErrors");
              }
            },
            "RxOverErrors": {
              Name: "RxOverErrors",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxOverErrors");
              }
            },
            "RxPackets": {
              Name: "RxPackets",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxPackets");
              }
            },
            "TxAbortedErrors": {
              Name: "TxAbortedErrors",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "TxAbortedErrors");
              }
            },
            "TxBytes": {
              Name: "TxBytes",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "TxBytes");
              }
            },
            "TxCarrierErrors": {
              Name: "TxCarrierErrors",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "TxCarrierErrors");
              }
            },
            "TxCompressed": {
              Name: "TxCompressed",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "TxCompressed");
              }
            },
            "TxDropped": {
              Name: "TxDropped",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "TxDropped");
              }
            },
            "TxHeartbeatErrors": {
              Name: "TxHeartbeatErrors",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "TxHeartbeatErrors");
              }
            },
            "TxPackets": {
              Name: "TxPackets",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "TxPackets");
              }
            },
            "TxWindowErrors": {
              Name: "TxWindowErrors",
              Suffix: "HasKey('Metric').Metrics().Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "TxWindowErrors");
              }
            }
          }
        },
        "OpenvSwitch": {
          "Name": "OpenvSwitch",
          "Default": "Bytes",
          "MinVer": "0.23",
          "Fields": {
            "Packets": {
              Name: "Packets",
              Suffix: "HasKey('Ovs.Metric').Metrics('Ovs').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxPackets", "TxPackets");
              }
            },
            "Bytes": {
              Name: "Bytes",
              Suffix: "Metrics('Ovs').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxBytes", "res.TxBytes");
              }
            },
            "Collisions": {
              Name: "Collisions",
              Suffix: "HasKey('Ovs.Metric').Metrics('Ovs').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "Collisions");
              }
            },
            "RxBytes": {
              Name: "RxBytes",
              Suffix: "HasKey('Ovs.Metric').Metrics('Ovs').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxBytes");
              }
            },
            "RxCrcErrors": {
              Name: "RxCrcErrors",
              Suffix: "HasKey('Ovs.Metric').Metrics('Ovs').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxCrcErrors");
              }
            },
            "RxDropped": {
              Name: "RxDropped",
              Suffix: "HasKey('Ovs.Metric').Metrics('Ovs').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxDropped");
              }
            },
            "RxErrors": {
              Name: "RxErrors",
              Suffix: "HasKey('Ovs.Metric').Metrics('Ovs').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxErrors");
              }
            },
            "RxFrameErrors": {
              Name: "RxFrameErrors",
              Suffix: "HasKey('Ovs.Metric').Metrics('Ovs').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxFrameErrors");
              }
            },
            "RxOverErrors": {
              Name: "RxOverErrors",
              Suffix: "HasKey('Ovs.Metric').Metrics('Ovs').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxOverErrors");
              }
            },
            "RxPackets": {
              Name: "RxPackets",
              Suffix: "HasKey('Ovs.Metric').Metrics('Ovs').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "RxPackets");
              }
            },
            "TxBytes": {
              Name: "TxBytes",
              Suffix: "HasKey('Ovs.Metric').Metrics('Ovs').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "TxBytes");
              }
            },
            "TxDropped": {
              Name: "TxDropped",
              Suffix: "HasKey('Ovs.Metric').Metrics('Ovs').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "TxDropped");
              }
            },
            "TxErrors": {
              Name: "TxErrors",
              Suffix: "HasKey('Ovs.Metric').Metrics('Ovs').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "TxErrors");
              }
            },
            "TxPackets": {
              Name: "TxPackets",
              Suffix: "HasKey('Ovs.Metric').Metrics('Ovs').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "TxPackets");
              }
            }
          }
        },
        "sFlow": {
          "Name": "sFlow",
          "Default": "IfInOctets",
          "MinVer": "0.23",
          "Fields": {
            "IfInOctets": {
              Name: "IfInOctets",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "IfInOctets");
              }
            },
            "IfInUcastPkts": {
              Name: "IfInUcastPkts",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "IfInUcastPkts");
              }
            },
            "IfInMulticastPkts": {
              Name: "IfInMulticastPkts",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "IfInMulticastPkts");
              }
            },
            "IfInBroadcastPkts": {
              Name: "IfInBroadcastPkts",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "IfInBroadcastPkts");
              }
            },
            "IfInDiscards": {
              Name: "IfInDiscards",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "IfInDiscards");
              }
            },
            "IfInErrors": {
              Name: "IfInErrors",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "IfInErrors");
              }
            },
            "IfInUnknownProtos": {
              Name: "IfInUnknownProtos",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "IfInUnknownProtos");
              }
            },
            "IfOutOctets": {
              Name: "IfOutOctets",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "IfOutOctets");
              }
            },
            "IfOutUcastPkts": {
              Name: "IfOutUcastPkts",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "IfOutUcastPkts");
              }
            },
            "IfOutMulticastPkts": {
              Name: "IfOutMulticastPkts",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "IfOutMulticastPkts");
              }
            },
            "IfOutBroadcastPkts": {
              Name: "IfOutBroadcastPkts",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "IfOutBroadcastPkts");
              }
            },
            "IfOutDiscards": {
              Name: "IfOutDiscards",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "IfOutDiscards");
              }
            },
            "IfOutErrors": {
              Name: "IfOutErrors",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "IfOutErrors");
              }
            },
            "OvsdpNHit": {
              Name: "OvsdpNHit",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "OvsdpNHit");
              }
            },
            "OvsdpNMissed": {
              Name: "OvsdpNMissed",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "OvsdpNMissed");
              }
            },
            "OvsdpNLost": {
              Name: "OvsdpNLost",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "OvsdpNLost");
              }
            },
            "OvsdpNMaskHit": {
              Name: "OvsdpNMaskHit",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "OvsdpNMaskHit");
              }
            },
            "OvsdpNFlows": {
              Name: "OvsdpNFlows",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "OvsdpNFlows");
              }
            },
            "OvsdpNMasks": {
              Name: "OvsdpNMasks",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "OvsdpNMasks");
              }
            },
            "OvsAppFdOpen": {
              Name: "OvsAppFdOpen",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "OvsAppFdOpen");
              }
            },
            "OvsAppFdMax": {
              Name: "OvsAppFdMax",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "OvsAppFdMax");
              }
            },
            "OvsAppConnOpen": {
              Name: "OvsAppConnOpen",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "OvsAppConnOpen");
              }
            },
            "OvsAppConnMax": {
              Name: "OvsAppConnMax",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "OvsAppConnMax");
              }
            },
            "OvsAppMemUsed": {
              Name: "OvsAppMemUsed",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "OvsAppMemUsed");
              }
            },
            "OvsAppMemMax": {
              Name: "OvsAppMemMax",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "OvsAppMemMax");
              }
            },
            "VlanOctets": {
              Name: "VlanOctets",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "VlanOctets");
              }
            },
            "VlanUcastPkts": {
              Name: "VlanUcastPkts",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "VlanUcastPkts");
              }
            },
            "VlanMulticastPkts": {
              Name: "VlanMulticastPkts",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "VlanMulticastPkts");
              }
            },
            "VlanBroadcastPkts": {
              Name: "VlanBroadcastPkts",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "VlanBroadcastPkts");
              }
            },
            "VlanDiscards": {
              Name: "VlanDiscards",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "VlanDiscards");
              }
            },
            "EthAlignmentErrors": {
              Name: "EthAlignmentErrors",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "EthAlignmentErrors");
              }
            },
            "EthFCSErrors": {
              Name: "EthFCSErrors",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "EthFCSErrors");
              }
            },
            "EthSingleCollisionFrames": {
              Name: "EthSingleCollisionFrames",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "EthSingleCollisionFrames");
              }
            },
            "EthMultipleCollisionFrames": {
              Name: "EthMultipleCollisionFrames",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "EthMultipleCollisionFrames");
              }
            },
            "EthSQETestErrors": {
              Name: "EthSQETestErrors",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "EthSQETestErrors");
              }
            },
            "EthDeferredTransmissions": {
              Name: "EthDeferredTransmissions",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "EthDeferredTransmissions");
              }
            },
            "EthLateCollisions": {
              Name: "EthLateCollisions",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "EthLateCollisions");
              }
            },
            "EthExcessiveCollisions": {
              Name: "EthExcessiveCollisions",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "EthExcessiveCollisions");
              }
            },
            "EthInternalMacReceiveErrors": {
              Name: "EthInternalMacReceiveErrors",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "EthInternalMacReceiveErrors");
              }
            },
            "EthInternalMacTransmitErrors": {
              Name: "EthInternalMacTransmitErrors",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "EthInternalMacTransmitErrors");
              }
            },
            "EthCarrierSenseErrors": {
              Name: "EthCarrierSenseErrors",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "EthCarrierSenseErrors");
              }
            },
            "EthFrameTooLongs": {
              Name: "EthFrameTooLongs",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "EthFrameTooLongs");
              }
            },
            "EthSymbolErrors": {
              Name: "EthSymbolErrors",
              Suffix: "HasKey('SFlow').Metrics('SFlow').Aggregates()",
              PointsFnc: function PointsFnc(res) {
                return metricFnc(res, "EthSymbolErrors");
              }
            }
          }
        }
      };
    }
  };
});
//# sourceMappingURL=metrics.js.map
