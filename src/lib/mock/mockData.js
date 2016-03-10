// select2
Mock.mock(/authStatus/, {
  "hasLogin": true
});
Mock.mock(/\/getRemoteSelectList\.htm/, {
  result: true,
  'data|10': [{name: '@cname', no: '@integer(1,100)'}]
});