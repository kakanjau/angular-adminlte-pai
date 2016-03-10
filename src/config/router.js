export default app => {
  app.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/search');
    $stateProvider
    .state('Console', {
      abstract: true,
      templateUrl: 'business/template/console.html',
      controller: 'ConsoleCtrl',
    })
    .state('Console.Search', {
      url: '/search',
      templateUrl: 'business/template/search.html',
      controller: 'SearchCtrl'
    })
    ;
  }]);
}