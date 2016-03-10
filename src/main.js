import "../node_modules/admin-lte/bootstrap/css/bootstrap.css";
import "../node_modules/admin-lte/dist/css/AdminLTE.css";
import "../node_modules/admin-lte/dist/css/skins/_all-skins.css";
import "../node_modules/font-awesome/css/font-awesome.css";
import "./business/style/reset.css";
import "./business/style/basic-style.css";

import angular from "angular";

import snCommon from "./common/snCommon";

import appConfiguration from './config/config';
import appRouter from './config/router';
import appControler from './business/script/controller/controller';
import appDirective from './business/script/directive/directive';

let app = angular.module('app', ['ui.router', 'ngSanitize', snCommon.name]);

// 如果是工程开发，请使用注释掉的部分。打包production工程时，mock不会生效
// if(ENVIRONMENT == 'development'){
//   Mock.mockjax(app);
// }

// 本项目为纯粹前端项目，数据直接由mockData.js提供，所以需要mock一直生效
Mock.mockjax(app);

appConfiguration(app);
appRouter(app);
appControler(app);
appDirective(app);

app.run(['$state', '$rootScope',
  function ($state, $rootScope) {
  }
]);

export default app;
