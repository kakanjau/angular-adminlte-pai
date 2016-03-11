export default app => {
  app.directive('snPropPanel', ['$compile', '$rootScope', ($compile, $rootScope) => {
    let getInstancePanel = data => {
      let dirName = 'sn-experiment';
      return `<${dirName}><//${dirName}>`;
    };
    return {
      restrict: 'EA',
      link: function(scope, ele, attr) {
        scope.$on('sn.prop-panel.change-panel', (e, data) => {
          let newScope = $rootScope.$new(true, scope);
          ele.html(getInstancePanel(data));
          $compile(ele.contents())(newScope);
        });
      }
    }
  }]);
}