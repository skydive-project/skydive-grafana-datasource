FROM grafana/grafana

COPY dist /var/lib/grafana/plugins/skydive-grafana-datasource
