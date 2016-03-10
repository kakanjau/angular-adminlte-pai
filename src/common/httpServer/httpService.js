export default app => {
  app.service("HttpService", ["$http", "$q", "$document", "$location",
    "AlertService", "LoginService", "EventBus", "baseUrl", "ErrorHandle",
    function ($http, $q, $document, $location, AlertService, LoginService, EventBus, baseUrl, ErrorHandle) {
      var loginUrl = LoginService.config.base + 'authStatus?callback=JSON_CALLBACK&_t=' + (+new Date());

      function busy() {
        document.body.style.cssText = "cursor: progress !important";
      }

      function idle() {
        document.body.style.cssText = "";
      }

      function sendRequest(url, params, method) {
        var defer = $q.defer();
        busy();

        $http[method](url, params).success(function (result) {
          idle();

          ErrorHandle.handle(result)
            .then(function (data) {
              defer.resolve(data);
            }, function (data) {
              defer.reject(data);
            });

          /*defer.resolve(result);
  
          // errCode为500时出错统一处理
          if(!!result.errorCode && result.errorCode == '500'){
              AlertService.alert({
                  title: "服务端异常",
                  content: '系统出了点小问题，请稍后重试！'
              });
              defer.reject(result);
          }else{
              defer.resolve(result);
          }*/
        }).error(function (reason, status) {
          idle();

          var errorContent = reason;
          if (reason != undefined && reason.errorresponse != undefined) {
            errorContent = reason.errorresponse.errortext;
          }

          if (status) {
            AlertService.alert({
              title: "服务端异常",
              content: '系统出了点小问题，请稍后重试！'
              //content: errorContent
            });
          }
          defer.reject(reason);
        });

        return defer.promise;
      }

      return {
        "get": function (url, param, option) {
          var defer = $q.defer();

          if (option && option.unrestricted) {
            sendRequest(baseUrl + url, { params: param }, "get").then(
              function (result) {
                defer.resolve(result);
              }
              , function (data) {
                defer.reject(data);
              });
          } else {
            $http.jsonp(loginUrl)
              .success(function (data) {
                if (data.hasLogin) {
                  sendRequest(baseUrl + url, { params: param }, "get").then(
                    function (result) {
                      defer.resolve(result);
                    }, function (data) {
                      defer.reject(data);
                    }
                    );
                } else {
                  LoginService.popupLoginContainer();
                  LoginService.enqueue(function () {
                    sendRequest(baseUrl + url, { params: param }, "get").then(
                      function (result) {
                        defer.resolve(result);
                      }, function (data) {
                        defer.reject(data);
                      }
                      );
                  }, function () {
                    defer.reject('close');
                  });
                }
              });
          }

          /*sendRequest(baseUrl + url, {
              params: param
            }, "get")
            .then(function(result) {
              defer.resolve(result);
            }, function(data) {
              defer.reject(data);
            });*/
          return defer.promise;
        },
        "post": function (url, param, option) {
          var defer = $q.defer();

          if (option && option.unrestricted) {
            sendRequest(baseUrl + url, param, "post").then(
              function (result) {
                defer.resolve(result);
              }, function (data) {
                defer.reject(data);
              }
              );
          } else {
            $http.jsonp(loginUrl)
              .success(function (data) {
                if (data.hasLogin) {
                  sendRequest(baseUrl + url, param, "post").then(
                    function (result) {
                      defer.resolve(result);
                    }, function (data) {
                      defer.reject(data);
                    }
                    );
                } else {
                  LoginService.popupLoginContainer();
                  LoginService.enqueue(function () {
                    sendRequest(baseUrl + url, param, "post").then(
                      function (result) {
                        defer.resolve(result);
                      }, function (data) {
                        defer.reject(data);
                      }
                      );
                  }, function () {
                    defer.reject('close');
                  });
                }
              });
          }
          /*sendRequest(baseUrl + url, param, "post").then(
            function(result) {
              defer.resolve(result);
            },
            function(data) {
              defer.reject(data);
            }
          );*/
          return defer.promise;
        }
      };
    }
  ]);
}