let PaiWorkSpaceCtrl = ($scope) => {
  let vm = $scope.vm = {};
  vm.canDrop = true;
  vm.onDropComplete = (data, evt) => {
    let artical = evt.event.target;
    let rect = artical.getBoundingClientRect();
    let relativePos = {
      left: evt.tx - rect.left,
      top: evt.ty - rect.top
    };
    console.info(relativePos);
  };
};

PaiWorkSpaceCtrl.$inject = ['$scope'];

export default app => app.controller('PaiWorkSpaceCtrl', PaiWorkSpaceCtrl);