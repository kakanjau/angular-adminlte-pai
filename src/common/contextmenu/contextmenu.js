export default app => {
  app.factory('contextMenuService', ['$rootScope', $rootScope => {
    return {
      cancelAll: () => {
        $rootScope.$broadcast('context-menu:close');
      },
      eventBound: false
    }
  }]);
  app.directive('contextMenu', ['$http', '$rootScope', '$timeout', '$interpolate', '$compile', 'contextMenuService',
    ($http, $rootScope, $timeout, $interpolate, $compile, contextMenuService) => {
      return {
        restrict: 'EA',
        scope: {
         contextMenuData: '=' 
        },
        require: '?ngModel',
        link: (scope, element, attr, model) => {
          if (!contextMenuService.eventBound) {
            document.addEventListener('click', evt => {
              contextMenuService.cancelAll();
              scope.$apply();
            });
          }

          function closeMenu() {
            if (scope.menu) {
              scope.menu.remove();
              scope.menu = null;
              scope.position = null;
            }
          }

          scope.$on('context-menu:close', closeMenu);

          function getModel() {
            let newScope = $rootScope.$new();
            return angular.extend(newScope, model ? model.$modelValue : scope.contextMenuData);
          }
          
          function render(event, strategy) {

            strategy = strategy || 'append';

            if ('preventDefault' in event) {
              contextMenuService.cancelAll();
              event.stopPropagation();
              event.preventDefault();
              scope.position = { x: event.clientX, y: event.clientY };
            } else {
              if (!scope.menu) {
                return;
              }
            }

            $http.get(attr.contextMenu, { cache: true }).then(function then(response) {
              let compiled = $compile(response.data)(angular.extend(getModel())),
                menu = angular.element(compiled);
              switch (strategy) {
                case ('append'): element.append(menu); break;
                default: scope.menu.replaceWith(menu); break;
              }

              menu.css({
                position: 'fixed',
                top: 0,
                left: 0,
                transform: $interpolate('translate({{x}}px, {{y}}px)')({
                  x: scope.position.x, y: scope.position.y
                })
              });

              scope.menu = menu;
              scope.menu.bind('click', closeMenu);
            });
          }

          if (model) {
            var listener = function listener() {
              return model.$modelValue;
            };
            scope.$watch(listener, function modelChanged() {
              render({}, 'replaceWith');
            }, true);
          }

          element.bind(attr.contextEvent || 'contextmenu', render);
        }
      }
    }
  ]);
}