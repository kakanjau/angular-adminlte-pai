let RootCtrl = function($scope, $rootScope, $timeout) {
  $rootScope.$on('sn.change-panel', data => {
    $rootScope.$broadcast('sn.prop-panel.change-panel', data);
  });
  $timeout(() => {
    $scope.$emit('sn.change-panel', {
      propType: 'experiment',
      propId: 'text'
    });
  }, 0);
}

RootCtrl.$inject = ['$scope', '$rootScope', '$timeout'];

export default app => app.controller('RootCtrl', RootCtrl);