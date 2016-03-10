import template from './tooltip.html';

function getOffset(element) {
  var x = 0;
  var y = 0;

  while (element.offsetParent) {
    x += element.offsetLeft;
    y += element.offsetTop;

    element = element.offsetParent;
  }

  return {
    x: x,
    y: y
  };
}

export default app => {
  app.directive("snTooltip", ["$document", "$http", "$compile", "$rootScope",
    function ($document, $http, $compile, $rootScope) {
      return {
        restrict: "A",
        link: function (scope, element, attrs) {
          var content = attrs.snTooltip;

          var tooltip;

          tooltip = angular.element(template);

          var newScope = angular.extend($rootScope.$new(), {
            content: content
          });
          $compile(tooltip)(newScope);

          element.on("mouseenter", function (evt) {
            var target = evt.target;
            var offset = getOffset(target);

            $document.find("body").append(tooltip);
            tooltip.addClass("in");

            var x = offset.x + element[0].offsetWidth;
            var y = offset.y + (element[0].offsetHeight - tooltip[0].offsetHeight) / 2;

            tooltip.css("z-index", "1500");
            tooltip.css("display", "block");
            tooltip.css("left", x + "px");
            tooltip.css("top", y + "px");
          });

          element.on("mouseleave", function () {
            tooltip.remove();
          });
        }
      };
    }
  ]);
}