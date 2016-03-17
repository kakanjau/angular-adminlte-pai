let ExperimentFolderMenuCtrl = ($scope, TreeToListService) => {
  let vm = $scope.vm = {};
  vm.createExp = () => {
    TreeToListService.appendChild($scope.node, {name: 'hahaha'}, $scope.list);
  };
};

ExperimentFolderMenuCtrl.$inject = ['$scope', 'TreeToListService'];

export default app => app.controller('ExperimentFolderMenuCtrl', ExperimentFolderMenuCtrl);