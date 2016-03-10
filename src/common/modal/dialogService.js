export default app => {
  app.service("DialogService", ["$http", "$document", "$rootScope", "$compile", '$q',
    function ($http, $document, $rootScope, $compile, $q) {
      var zIndex = 1050;
      var dialogCounter = 0;

      var dialogMap = {};
      return {
        modal: function (param, data) {
          var defer = $q.defer();
          $http.get(param.url).then(function (result) {
            dialogCounter += 2;

            dialogMap[param.key] = param;
            dialogMap[param.key].promise = defer.promise;

            var mask = angular.element('<div class="modal-backdrop fade in"></div>');
            $document.find("body").append(mask).addClass('overflow-hidden');
            mask.css("z-index", zIndex + dialogCounter);

            dialogMap[param.key].mask = mask;

            var dialog = angular.element(result.data);
            var newScope = $rootScope.$new();
            if (data) {
              angular.extend(newScope, data);
            }
            var element = $compile(dialog)(newScope);

            $document.find("body").append(element);
            element.css("display", "block");
            element.css("z-index", zIndex + dialogCounter + 1);

            dialogMap[param.key].dialog = element;
            defer.resolve();
          });
        },

        accept: function (key, result) {
          this.dismiss(key);

          if (dialogMap[key].accept) {
            dialogMap[key].accept(result);
          }
        },

        refuse: function (key, reason) {
          this.dismiss(key);

          if (dialogMap[key].refuse) {
            dialogMap[key].refuse(reason);
          }
        },

        dismiss: function (key) {
          dialogMap[key].mask.remove();
          dialogMap[key].dialog.remove();
          $document.find("body").removeClass('overflow-hidden');
          //            delete dialogMap[key];
        },

        hide: function (key) {
          dialogMap[key].promise.then(function () {
            dialogMap[key].mask.hide();
            dialogMap[key].dialog.hide();
          });
        },

        show: function (key) {
          dialogMap[key].mask && dialogMap[key].mask.show();
          dialogMap[key].dialog && dialogMap[key].dialog.show();
        },

        dismissAll: function () {
          for (var key in dialogMap) {
            this.dismiss(key);
          }
        },

        postMessage: function (key, type, message) {
          if (dialogMap[key].messageHandler) {
            if (dialogMap[key].messageHandler[type]) {
              dialogMap[key].messageHandler[type](message);
            }
          }
        }
      };
    }]);
}