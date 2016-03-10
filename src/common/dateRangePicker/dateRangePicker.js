import 'bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

export default app => {
  app.directive("dateRangePicker", ["LazyLoader", function (LazyLoader) {
    return {
      restrict: "A",
      scope: {
        dateRangePicker: "="
      },
      link: function (scope, element, attrs) {
        // daterangepicker.js 842行修改判断
        scope.$watch("dateRangePicker", function (value) {
          try {
            var key = scope.dateRangePicker.key || '';
            var e = "dateRangePicker" + (key ? (':' + key) : '');
            scope.dateRangePicker.locale = angular.extend({
              "format": "YYYY/MM/DD",
              "separator": " - ",
              "applyLabel": "确定",
              "cancelLabel": scope.dateRangePicker.canClear ? "清空" : "取消",
              "fromLabel": "开始",
              "toLabel": "到",
              "customRangeLabel": "自定义",
              "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
              "monthNames": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
              "firstDay": 1
            }, scope.dateRangePicker.locale);

            //扩展一个设置输入框内容的方法供control调用
            scope.dateRangePicker.setInputValue = function (startDate, endDate) {
              if (startDate && endDate) {
                element.val(moment(startDate).format(scope.dateRangePicker.locale.format) + scope.dateRangePicker.locale.separator + moment(endDate).format(scope.dateRangePicker.locale.format));
              } else {
                element.val('');
              }
            };

            element.on('apply.daterangepicker', function (ev, picker) {
              $(this).val(picker.startDate.format(scope.dateRangePicker.locale.format) + scope.dateRangePicker.locale.separator + picker.endDate.format(scope.dateRangePicker.locale.format));
              scope.$emit(e, { 'start': picker.startDate, 'end': picker.endDate, 'label': picker.label });
            });

            element.on('cancel.daterangepicker', function (ev, picker) {
              if (scope.dateRangePicker.canClear) {
                $(this).val('');
                scope.$emit(e, { 'start': undefined, 'end': undefined, 'label': '' });
              }
            });
            element.daterangepicker(scope.dateRangePicker);
          } catch (ex) {
            console.log(ex);
          }
        });
      }
    }
  }]);
}