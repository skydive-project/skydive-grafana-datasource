import prunk from 'prunk';
import { JSDOM } from 'jsdom';
import chai from 'chai';

// Mock Grafana modules that are not available outside of the core project
// Required for loading module.js
prunk.mock('./css/query-editor.css!', 'no css, dude.');
prunk.mock('app/plugins/sdk', {
    QueryCtrl: null
});
prunk.mock('app/core/app_events', {});

// Setup jsdom
// Required for loading angularjs
global.dom = new JSDOM('<html><head><script></script></head><body></body></html>');
global.window = dom.window;
global.navigator = {};
global.Node = window.Node;

// Setup Chai
chai.should();
global.assert = chai.assert;
global.expect = chai.expect;
