export default app => {
  app.constant('baseUrl', '/systemName');
  app.config(function ($httpProvider) {
    'use strict';
    //jshint -W089
    $httpProvider.interceptors.push('noCacheInterceptor');

    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
      /**
       * The workhorse; converts an object to x-www-form-urlencoded serialization.
       * @param {Object} obj
       * @return {String}
       */
      var param = function (obj) {
        var query = '',
          name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
          value = obj[name];

          if (value instanceof Array) {
            for (i = 0; i < value.length; ++i) {
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          } else if (value instanceof Object) {
            for (subName in value) {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          } else {
            //edit hw 2015 5-11
            // else if (value !== undefined && value !== null) {
            //jshint -W116
            query += encodeURIComponent(name) + '=' + encodeURIComponent((value == null ? '' : value)) + '&';
          }
        }

        return query.length ? query.substr(0, query.length - 1) : query;
      };

      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
  });

  app.constant('Utils', {})
    .run(['$rootScope', '$state', '$location', 'Utils',
      function ($rootScope, $state, $location, Utils) {
        'use strict';

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
          
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
          $rootScope.$broadcast('router:state:change', toState);
        });
        
        $rootScope.$on('$locationChangeSuccess', function(evt, newUrl, oldUrl) {
          var url = $location.url();
          var newPath;
          if (url.indexOf("#loginSuccess:") >= 0 && (url.indexOf("#loginSuccess:") == url.length - 14)) {
            // LoginService.loginSuccess();
            newPath = url.slice(0, url.indexOf("#loginSuccess:"));
            $location.url(newPath);
          } else if (url.indexOf("#close:") >= 0 && (url.indexOf("#close:") == url.length - 7)) {
            // LoginService.closeContainer();
            newPath = url.slice(0, url.indexOf("#close:"));
            $location.url(newPath);
          } else if (url.indexOf("#resize:") >= 0) {
            // LoginService.resizeContainer(url.slice(url.indexOf("#resize:") + 8));
            newPath = url.slice(0, url.indexOf("#resize:"));
            $location.url(newPath);
          }
        });
      }
    ]);

  app.factory('noCacheInterceptor', function () {
    'use strict';

    return {
      request: function (config) {
        //config.url.indexOf('tpl.html') === '-1'
        //解决$templateCache的tpl.html模板URL,加上noCache之后无法取到template的问题
        if (config.method === 'GET' && config.url.indexOf('tpl.html') === -1) {
          var separator = config.url.indexOf('?') === -1 ? '?' : '&';
          config.url = config.url + separator + 'noCache=' + new Date().getTime();
        }
        return config;
      }
    };
  });
}
