import * as select2 from 'select2/dist/js/select2';
import 'select2/dist/js/i18n/zh-CN';
import 'select2/dist/css/select2.min.css';

export default app => {
  app.directive('select2', ["$timeout", "LazyLoader", function ($timeout, LazyLoader) {
    // 防止select的ng-option等指令没有执行
    function setOption(element, option) {
      $timeout(function () {
        element.select2(option);
      }, 0);
    }
    return {
      restrict: 'A',
      // 对于普通的单选、固定备选列表的select，使用select2进行属性配置，ngModel绑定选中结果即可。
      // ngModel和selectModel都会记录select的备选值。
      // 区别在于ngModel会触发angular的select指令解析option，并影响select2的解析。
      // 区别很微妙，需要具体问题具体分析
      scope: {
        select2: "=",
        item: "=ngModel",
        itemModel: "=selectModel"
      },
      link: function (scope, element, attrs) {
        // scope.select2 = scope.select2 || {};
        scope.hasNgModel = !!attrs.ngModel;
        scope.hasItemModel = !!attrs.selectModel;
        var SelectAdapter = $.fn.select2.amd.require('select2/data/select');
        // 扩展功能配置：limitNumber
        // 限制显示的备选项数量
        SelectAdapter.prototype.query = function (params, callback) {
          var data = [];
          var self = this;
          var $options = this.$element.children();
          $options.each(function () {
            var $option = $(this);
            if (!$option.is('option') && !$option.is('optgroup')) {
              return;
            }
            var option = self.item($option);
            var matches = self.matches(params, option);
            if (matches !== null) {
              var limitNumber = self.options.get('limitNumber');
              (!limitNumber || limitNumber > data.length) && data.push(matches);
            }
          });
          callback({
            results: data
          });
        };
        // 重置select2配置
        scope.select2 && (scope.select2.reset = scope.select2.reset || function () {
          setOption(element, scope.select2);
        });

        // 语言默认为中文（需要导入中文语言的js文件）
        scope.select2 && (scope.select2.language = scope.select2.language || 'zh-CN');

        // ajax处理
        if (scope.select2 && scope.select2.ajax) {
          // 设置默认的ajax转换 markup函数
          scope.select2.ajax.escapeMarkup = scope.select2.ajax.escapeMarkup
          || function (markup) { return markup; };
          // 处理select和unselect事件。主要用户多选select的情况下。
          element.on('select2:select', function (e) {
            scope.hasNgModel && !angular.isArray(scope.item) && (scope.item = e.params.data);
            scope.hasItemModel &&
            (angular.isArray(scope.itemModel) ? scope.itemModel.push(e.params.data) : (scope.itemModel = e.params.data));
            scope.$apply();

            var evtName = 'sn.select2.select';
            evtName += (scope.select2 && scope.select2.key) ? ':' + scope.select2.key : '';
            scope.$emit(evtName);
          });
          // unselect需要判断当前是单选还是多选。如果是多选的话，itemModel会做数组去元素操作
          element.on('select2:unselect', function (e) {
            scope.hasNgModel && !angular.isArray(scope.item) && (scope.item = undefined);
            if (scope.hasItemModel) {
              if (angular.isArray(scope.itemModel)) {
                var id = e.params.data.id;
                scope.itemModel = scope.itemModel.filter(function (item) {
                  return item.id != id
                });
              } else {
                scope.itemModel = undefined;
              }
            }
            scope.$apply();

            var evtName = 'sn.select2.unselect';
            evtName += (scope.select2 && scope.select2.key) ? ':' + scope.select2.key : '';
            scope.$emit(evtName);
          });
        };

        scope.hasNgModel && scope.$watch('item', function (newVal, oldVal) {
          if (newVal && !oldVal) {
            setOption(element, scope.select2);
          }
        });

        // 初始化 select2
        setOption(element, scope.select2);
      }
    }
  }]);
}