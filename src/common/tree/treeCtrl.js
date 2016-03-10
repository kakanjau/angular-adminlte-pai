let Tree = function ($scope) {
  $scope.isTreeNode = true;
  $scope.getRoot = function () {
    var pointer = this;
    var parent = pointer.$parent;
    while (parent.isTreeNode) {
      pointer = parent;
      parent = parent.$parent;
    }

    return pointer;
  };

  $scope.state = function (node) {
    if (node.children && node.children.length > 0) {
      if (node.$collapsed) {
        return "fa fa-caret-right";
      } else {
        return "fa fa-caret-down";
      }
    } else {
      return "fa";
    }
  };

  $scope.type = function (node) {
    if (node.children && node.children.length > 0) {
      if (node.$collapsed) {
        return "fa fa-folder";
      } else {
        return "fa fa-folder-open";
      }
    } else {
      return "fa fa-leaf";
    }
  };

  $scope.select = function (node) {
    if (node != $scope.selectedNode) {
      var root = $scope.getRoot();
      if (root.selectedNode) {
        root.selectedNode.$selected = false;
      }
      node.$selected = true;

      root.selectedNode = node;

      var evt = {
        newNode: node,
        oldNode: $scope.selectedNode,
        treeId: root.treeId
      };

      root.$emit("sn.controls.tree:selectedNodeChanged", evt);
    }
  };

  $scope.itemClick = function (node) {
    $scope.select(node);
  };

  $scope.itemCheck = function (node) {
    $scope.$emit("sn.controls.tree:itemChecked", node, 'itemCheck');
  };

  $scope.$on("sn.controls.tree:itemChecked", function (e, item) {
    item && checkChildren(item);

    if ($scope.treeData) {
      $scope.treeData.forEach(function (node) {
        if (node.children) {
          var checkedLength = node.children.filter(function (it) {
            return it.checked;
          }).length;

          if (checkedLength == node.children.length) {
            node.checked = true;
          } else if (checkedLength == 0) {
            node.checked = false;
          } else {
            node.checked = null;
          }
        }
      });
    }
  });

  $scope.iconClick = function (node) {
    node.$collapsed = !node.$collapsed;

    var evt = {
      currentNode: node
    };
    var root = $scope.getRoot();
    root.$emit("sn.controls.tree:nodeIconClicked", evt);
  };

  function checkChildren(node) {
    if (node.children) {
      node.children.forEach(function (it) {
        it.checked = node.checked;
        checkChildren(it);
      });
    }
  }
};

Tree.$inject = ['$scope'];

export default Tree;