// 基础组件部分，一般都需要加载
import angular from 'angular';
import core from './core';
import modal from './modal/modal';
import http from './httpServer/httpServer';

// 功能组件部分，根据需要确认是否加载
import tree from './tree/tree';
import treeToListService from './tree/treeToListService';
// import markdown from './markdown/markdown';
import dropdown from './dropdown/dropdown';
// import preview from './preview/preview';
// import echarts from './echarts/echarts';
// import dateRangePicker from './dateRangePicker/dateRangePicker';
import inputMask from './inputMask/inputMask';
import select2 from './select2/select2';
import tooltip from './tooltip/tooltip';
import contextmenu from './contextmenu/contextmenu';
import draggable from './draggable/draggable';

let app = angular.module("sn.common", []);

INCLUDE_ALL_MODULES(
  [
    core, 
    modal, 
    http, 
    tree, 
    treeToListService,
    // markdown,
    dropdown, 
    // preview, 
    // echarts, 
    // dateRangePicker, 
    inputMask, 
    select2, 
    tooltip,
    contextmenu,
    draggable
  ], 
  app);

export default app;