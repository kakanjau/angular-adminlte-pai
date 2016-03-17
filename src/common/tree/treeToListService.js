export default app => {
  app.service('TreeToListService', [() => {
    let service = {};
    let option = {
      childrenStr: 'children', 
      isBranchStr: 'isBranch', 
      showChildrenStr: 'showChildren'
    };
    
    service.init = options => {
      angular.extend(option, options);
    };

    service.treeToList = tree => {
      let list = [];
      let call = (list, nodes, parent) => {
        for (let node of nodes) {
          let children = node[option.childrenStr];
          node.parent = parent;
          node.level = parent ? (parent.level + 1) : 0;
          node.chilren = null;
          list.push(node);
          if (children) {
            node[option.isBranchStr] = true;
            call(list, children, node);
          }
        }
      };
      call(list, tree);
      return list;
    };

    service.canNodeShow = node => {
      let ret = true;
      while (node.parent) {
        ret = ret && node.parent[option.showChildrenStr];
        if (!ret) {
          break;
        }
        node = node.parent;
      }
      return ret;
    };
    
    service.appendChild = (node, data, list) => {
      // node.children = node.children || [];
      // node.children.splice(0, 0, data);
      data.level = node.level + 1;
      data.parent = node;
      let nodeIdx = list.indexOf(node);
      list.splice(nodeIdx+1, 0 ,data);
    };
    
    service.removeNode = (node, list) => {
      // let nodeIdx = node.parent[option.childrenStr].indexOf(node);
      // node.parent[option.childrenStr].splice(nodeIdx, 1);
      let nodeIdx = list.indexOf(node);
      let startIdx = nodeIdx;
      let length = list.length;
      let level = node.level;
      let childrenCount = 1;
      while(++nodeIdx < length && level < list[nodeIdx].level){
        childrenCount++;
      }
      list.splice(startIdx, childrenCount);
    };
    return service;
  }]);
}