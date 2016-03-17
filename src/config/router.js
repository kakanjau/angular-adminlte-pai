export default app => {
  app.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/search');
    $stateProvider
    .state('Console', {
      abstract: true,
      controller: 'ConsoleCtrl',
      templateUrl: 'business/template/console.html'
    })
    .state('Console.Search', {
      url: '/search',
      controller: 'SearchCtrl',
      templateUrl: 'business/template/search.html'
    })
    .state('Console.ToolBox', {
      abstract: true,
      controller: 'ToolBoxCtrl',
      templateUrl: 'business/template/toolBox/toolBox.html'
    })
    .state('Console.ToolBox.Experiment', {
      url: '/experiment',
      controller: 'ExperimentCtrl',
      templateUrl: 'business/template/toolBox/experiment.html'
    })
    .state('Console.ToolBox.Datasource', {
      url: '/datasource',
      controller: 'DatasourceCtrl',
      templateUrl: 'business/template/toolBox/datasource.html'
    })
    .state('Console.ToolBox.Component', {
      url: '/component',
      controller: 'ComponentCtrl',
      templateUrl: 'business/template/toolBox/component.html'
    })
    ;
  }]);
}