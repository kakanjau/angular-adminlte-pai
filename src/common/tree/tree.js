import controller from './treeCtrl';
import treeTpl from './tree.html';
import checkboxTreeTpl from './checkboxTree.html';

export default app => {
  app.directive('snTree', function ($compile) {
    return {
      restrict: "E",
      scope: {
        treeData: "="
      },
      controller: controller,
      template: (tElement, tAttrs) => {
        return tAttrs["treeTpl"] === 'checkboxTreeTpl' ? checkboxTreeTpl : treeTpl;
      },
      link: function (scope, element, attr) {
        scope.treeId = attr["treeId"];

        // if (!scope.$parent.$isTreeNode) {
        //   scope.treeTpl = 
        // }

        // element.html(scope.getRoot().treeTpl);

        // $compile(element.contents())(scope);
      }
    };
  });
}