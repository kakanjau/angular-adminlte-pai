export default app => {
  app.service('EventBus', () => {
    var eventMap = {};
    return {
      on: function (eventType, handler) {
        //multiple event listener
        if (!eventMap[eventType]) {
          eventMap[eventType] = [];
        }
        eventMap[eventType].push(handler);
      },

      off: function (eventType, handler) {
        for (var i = 0; i < eventMap[eventType].length; i++) {
          if (eventMap[eventType][i] === handler) {
            eventMap[eventType].splice(i, 1);
            break;
          }
        }
      },

      fire: function (event) {
        var eventType = event.type;
        if (eventMap[eventType]) {
          for (var i = 0; i < eventMap[eventType].length; i++) {
            eventMap[eventType][i](event);
          }
        }
      }
    };
  });

  app.service("LazyLoader", ["$q", function ($q) {
    var createdScripts = {}; //是否已创建script标签
    var pendingScripts = {}; //哪些处于加载过程中

    var loader = {
      load: function (url) {
        var deferred = $q.defer();

        if (!createdScripts[url]) {
          var script = document.createElement('script');
          script.src = encodeURI(url);

          script.onload = function () {
            if (pendingScripts[url]) {
              for (var i = 0; i < pendingScripts[url].length; i++) {
                pendingScripts[url][i].deferred && pendingScripts[url][i].deferred.resolve();
                pendingScripts[url][i].callback && pendingScripts[url][i].callback();
              }
              delete pendingScripts[url];
            }
          };

          createdScripts[url] = script;
          document.body.appendChild(script);

          if (!pendingScripts[url]) {
            pendingScripts[url] = [];
          }
          pendingScripts[url].push({
            deferred: deferred
          });
        } else if (pendingScripts[url]) {
          pendingScripts[url].push({
            deferred: deferred
          });
        } else {
          deferred.resolve();
        }

        return deferred.promise;
      },
      loadArr: function (arr) {
        var deferred = $q.defer();
        var counter = 0;

        function checkAll() {
          if (counter == arr.length) {
            deferred.resolve();
          }
        }

        for (var j = 0; j < arr.length; j++) {
          var url = arr[j];
          if (!createdScripts[url]) {
            var script = document.createElement('script');
            script.src = encodeURI(url);

            script.onload = function () {
              //这段是唯一需要关注pendingScripts的，因为你是顺带帮别人加载了代码，对你自己并无本质帮助
              if (pendingScripts[url]) {
                for (var i = 0; i < pendingScripts[url].length; i++) {
                  pendingScripts[url][i].deferred && pendingScripts[url][i].deferred.resolve();
                  pendingScripts[url][i].callback && pendingScripts[url][i].callback();
                }
                delete pendingScripts[url];
              }

              counter++;
              checkAll();
            };

            createdScripts[url] = script;
            document.body.appendChild(script);

            if (!pendingScripts[url]) {
              pendingScripts[url] = [];
            }
            pendingScripts[url].push({
              callback: checkAll
            });
          } else if (pendingScripts[url]) {
            //这里很麻烦啊，要是你想加载的js被别人顺带加载了，怎么办？
            pendingScripts[url].push({
              callback: checkAll
            });
          } else {
            checkAll();
          }
        }

        return deferred.promise;
      },
      loadQueue: function (arr) {
        var deferred = $q.defer();

        loadStep(0);

        function loadStep(index) {
          if (index == arr.length) {
            deferred.resolve();
          } else {
            loader.load(arr[index]).then(function () {
              loadStep(index + 1);
            });
          }
        }

        return deferred.promise;
      }
    };

    return loader;
  }]);

  app.directive('contentWrapperMinHeight', [function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        if ($.AdminLTE) {
          $.AdminLTE.layout.activate();
        }
      }
    };
  }]);
}