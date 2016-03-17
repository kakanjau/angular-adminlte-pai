import 'angular';
let ExperimentCtrl = ($scope, TreeToListService) => {
  let vm = $scope.vm = {};
  vm.curExp = {};
  let experimentTree = [{
    name: '0314实验',
    children: [{
      name: '1111'
    }, {
      name: '1111'
    }, {
      name: '1111'
    }, {
      name: '1111'
    }, {
      name: '1111'
    }, {
      name: '1111'
    }, {
      name: '1111'
    }, {
      name: '1111'
    }, {
      name: '1111'
    }, {
      name: '1111'
    }, {
      name: '2222'
    }, {
      name: '3333',
      children: [{
        name: '34444'
      }]
    }]
  }, {
    name: 'aaaaa'
  }];
  vm.experimentTree = [{
    name: '我的实验',
    children: experimentTree
  }];
  vm.experimentList = TreeToListService.treeToList(vm.experimentTree);
  vm.canNodeShow = TreeToListService.canNodeShow;
};

ExperimentCtrl.$inject = ['$scope', 'TreeToListService'];

export default app => app.controller('ExperimentCtrl', ExperimentCtrl);