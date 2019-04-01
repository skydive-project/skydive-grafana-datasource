
export function SemverCmp(v1, v2) {
    if (v1 === v2) {
        return 0;
    }

    var v1_els = v1.split(".");
    var v2_els = v2.split(".");

    var len = Math.min(v1_els.length, v2_els.length);
    for (var i = 0; i < len; i++) {
        if (parseInt(v1_els[i]) > parseInt(v2_els[i])) {
            return 1;
        }

        if (parseInt(v1_els[i]) < parseInt(v2_els[i])) {
            return -1;
        }
    }

    if (v1_els.length > v2_els.length) {
        return 1;
    }

    if (v1_els.length < v2_els.length) {
        return -1;
    }

    return 0;
}