export default app => {
  app.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/search');
    $stateProvider
    .state('Console', {
      abstract: true,
      controller: 'ConsoleCtrl',
      templateUrl: 'business/template/console.html',
    })
    .state('Console.Search', {
      url: '/search',
      controller: 'SearchCtrl',
      templateUrl: 'business/template/search.html',
    })
    ;
  }]);
}