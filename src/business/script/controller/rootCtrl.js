let RootCtrl = function($rootScope) {
  $rootScope.$on('sn.change-panel', data => {
    $rootScope.$broadcast('sn.prop-panel.change-panel', data);
  });
}

RootCtrl.$inject = ['$rootScope'];

export default app => app.controller('RootCtrl', RootCtrl);