let ComponentCtrl = ($scope, TreeToListService) => {
  let vm = $scope.vm = {};
  vm.curComp = {};
  let componentTree = [{
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
  }];
  vm.componentTree = [{
    name: '我的实验',
    children: componentTree
  }];
  vm.componentList = TreeToListService.treeToList(vm.componentTree);
  vm.canNodeShow = TreeToListService.canNodeShow;
};

ComponentCtrl.$inject = ['$scope', 'TreeToListService'];

export default app => app.controller('ComponentCtrl', ComponentCtrl);