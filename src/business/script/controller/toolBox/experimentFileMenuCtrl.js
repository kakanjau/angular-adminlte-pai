let ExperimentFileMenuCtrl = ($scope, TreeToListService) => {
  let vm = $scope.vm = {};
  vm.openExp = () => {
    console.info($scope);
  };
  vm.removeExp = () => {
    TreeToListService.removeNode($scope.node, $scope.list);
  };
};

ExperimentFileMenuCtrl.$inject = ['$scope', 'TreeToListService'];

export default app => app.controller('ExperimentFileMenuCtrl', ExperimentFileMenuCtrl);