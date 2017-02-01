[![Build Status](https://travis-ci.org/skydive-project/skydive-grafana-datasource.png)](https://travis-ci.org/skydive-project/skydive-grafana-datasource)

# Skydive Grafana Datasource

Skydive Datasource for Grafana 3.x.

## Installation

```console
$ git clone https://github.com/skydive-project/skydive-grafana-datasource.git
$ cd skydive-grafana-datasource
$ npm install
$ ./node_modules/grunt-cli/bin/grunt
$ mkdir -p /var/lib/grafana/plugins
$ ln -s `pwd`/dist /var/lib/grafana/plugins/skydive-grafana-datasource
```

## Configuration

![](https://raw.githubusercontent.com/skydive-project/skydive-grafana-datasource/master/doc/img/configuration.png)

Address of Skydive Analyzer has to be used as URL. By default listening on
http://localhost:8082

If using Authentication, just use the `Basic Auth` and provide User/Password of
Skydive Analyzer.

## Query editor

![](https://raw.githubusercontent.com/skydive-project/skydive-grafana-datasource/master/doc/img/query-editor.png)

In order to get metrics the Skydive Gremlin query language is used. You just
need to provide a query that returns Flows. Ex:

```console
G.V().Has('Name', 'br-int').Flows()
```

Refer to the
[Skydive Gremlin section](http://skydive-project.github.io/skydive/getting-started/gremlin/)
for further explanations about the syntax and the functions available.

## Contact

* IRC: #skydive-project on irc.freenode.net
* Mailing list: https://www.redhat.com/mailman/listinfo/skydive-dev

## License

This software is licensed under the Apache License, Version 2.0 (the
"License"); you may not use this software except in compliance with the
License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
