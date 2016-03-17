let ConsoleCtrl = function ($scope, $state, $rootScope) {
  let vm = $scope;
  let globals = {
    stateAndMenus: {}
  };
  vm.formData = {};
  vm.menus = [
    {
      name: '搜索',
      state: 'Console.Search',
      clazz: 'fa fa-search'
    }, {
      name: '实验',
      state: 'Console.ToolBox.Experiment',
      clazz: 'fa fa-balance-scale'
    }, {
      name: '数据源',
      state: 'Console.ToolBox.Datasource',
      clazz: 'fa fa-database'
    }, {
      name: '组件',
      state: 'Console.ToolBox.Component',
      clazz: 'fa fa-cubes'
    }, {
      name: '模型',
      // state: 'Console.Search',
      clazz: 'fa fa-diamond'
    }, {
      name: '设置',
      // state: 'Console.Search',
      clazz: 'fa fa-cog'
    }];
  init();
  
  ////////////////$scope functions/////////////////
  vm.selectMenu = function (e, menuItem) {
    e.preventDefault();
    e.stopPropagation();
    var stateName = menuItem.state,
      stateParam = menuItem.param;
    if (stateName) {
      //当使用reload:true时会重新生成一个scope,init方法都会再次执行
      $state.go(menuItem.state, stateParam);
      selectedMenu(menuItem.state);
    } else {
      if (formData['selectedMenu' + menuItem.level] === menuItem) {
        formData['selectedMenu' + menuItem.level] = null;
      } else {
        formData['selectedMenu' + menuItem.level] = menuItem;
      }

      while (menuItem.parent) {
        menuItem = menuItem.parent;
        formData['selectedMenu' + menuItem.level] = menuItem;
      }
    }
  };

  vm.doLogout = function () {
  };

  ///////////////////watches//////////////////////////////
  ///////////////////Events///////////////////
  $scope.$on('router:state:change', function (event, toState) {
    event.preventDefault();
    locateMenu(toState);
  });

  function reCfgMenus(menus, parent, level) {
    menus.forEach(function (v) {
      var child = v.children;
      if (Array.isArray(child)) {
        reCfgMenus(child, v, level + 1);
      }
      v.parent = parent;
      v.level = level;
    });
  }
    
  //router state与菜单映射关系
  function bulidStateAndMenuInfo(menus, result) {
    result = result || {};
    menus.forEach(function (v) {
      //如出现重复state则  throw error
      if (result[v.state]) {
        throw new Error(v.state + ' state is already exists');
      }

      if (typeof v.state === 'string') {
        result[v.state] = v;
      }

      //关系
      if (Array.isArray(v.relation)) {
        v.relation.forEach(function (item) {
          result[item] = v;
        })
      }

      if (Array.isArray(v.children)) {
        bulidStateAndMenuInfo(v.children, result);
      }
    });
  }

  function selectedMenu(stateName) {
    var menu;
    vm.formData.selectedMenu1 = null;
    vm.formData.selectedMenu2 = null;
    vm.formData.selectedMenu3 = null;

    if (stateName) {
      menu = globals.stateAndMenus[stateName];
      while (menu) {
        vm.formData['selectedMenu' + menu.level] = menu;
        menu = menu.parent;
      }
    }
  }

  function locateMenu(state) {
    selectedMenu(state.name);
  }

  function init() {
    reCfgMenus(vm.menus, null, 1);
    bulidStateAndMenuInfo(vm.menus, globals.stateAndMenus);
    locateMenu($state.current);
    vm.now = new Date;
  }
}

ConsoleCtrl.$injector = ['$scope', '$state', '$rootScope'];
export default app => app.controller('ConsoleCtrl', ConsoleCtrl);