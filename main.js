import bpmn from 'bpmn-js';
import BpmnModeler from 'bpmn-js/lib/Modeler.js';
import $ from 'jquery';
import camunda from 'camunda-bpmn-moddle';
import diagram from 'diagram-js';

window.bpmn = bpmn;
window.$ = $;
window.BpmnModeler = BpmnModeler;
window.propertiesPanelModule = require('bpmn-js-properties-panel');
window.camunda = camunda;
window.diagram = diagram;
window.propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda');
window.camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda');
window.minimapModule = require('diagram-js-minimap');
window.debounce = require('lodash/debounce');