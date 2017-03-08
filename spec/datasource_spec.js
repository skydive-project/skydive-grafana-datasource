import {Datasource} from "../module";
import _ from "lodash";
import moment from "moment";
import Q from "q";

describe('SkydiveDatasource', function() {
    var ctx = {};

    beforeEach(function() {
        ctx.$q = Q;
        ctx.backendSrv = {};
        ctx.templateSrv = {};
        ctx.ds = new Datasource({jsonData:{version: "0.10"}}, ctx.$q, ctx.backendSrv, ctx.templateSrv);

    });

    it('should return an empty array when no targets are set', function(done) {
        ctx.ds.query({targets: []}).then(function(result) {
            expect(result.data).to.have.length(0);
            done();
        });
    });

    it('should return the server results when a target is set', function(done) {
        ctx.backendSrv.datasourceRequest = function(request) {
            expect(request.data).to.eql({"GremlinQuery": 'G.At(1,1).Flows().Has("ParentUUID", "").Dedup("NodeTID").Metrics()'});

            return ctx.$q.when({
                status: 200,
                data: [{
                    "1a7d0b9e56bd294ba27fe57e40359ccd14381832":[
                        {"Start": 1481295511, "Last": 1481295521, "ABPackets": 2, "ABBytes": 84, "BAPackets": 2, "BABytes": 84},
                        {"Start": 1481295521, "Last": 1481295531, "ABPackets": 1, "ABBytes": 42, "BAPackets": 1, "BABytes": 42}
                    ],
                    "86f04793da537b012b9a527edf68ff151ecae38a":[
                        {"Start": 1481295511, "Last": 1481295521, "ABPackets": 10, "ABBytes": 840, "BAPackets": 10, "BABytes": 840},
                        {"Start": 1481295521, "Last": 1481295531, "ABPackets": 10, "ABBytes": 840, "BAPackets": 10, "BABytes": 840}
                    ]
                }]
            });
        };

        ctx.templateSrv.replace = function(data) {
            return data;
        };

        var targets = [{
            "dedup": "NodeTID",
            "metricField": "Bytes",
            "gremlin": "G.Flows()",
            "aggregates": false,
            "mode": "Outer",
        }];

        var from = moment(0, 'X');
        var to = moment(1, 'X');

        ctx.ds.query({targets: targets, "range": {"from": from, "to": to}}).then(function(result) {
            expect(result.data).to.have.length(2);

            _.forEach(result.data, (serie, uuid) => {
                expect(serie.datapoints).to.have.length(2);
            });
            done();
        });
    });
});
