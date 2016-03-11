let SearchCtrl = ($scope, $timeout) => {
  $timeout(() => {
    $scope.$emit('sn.change-panel', {
      propType: 'experiment',
      propId: 'text'
    });
  }, 0);
};

SearchCtrl.$inject = ['$scope', '$timeout'];

export default app => app.controller('SearchCtrl', SearchCtrl);