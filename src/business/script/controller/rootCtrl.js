let RootCtrl = function() {
    this.$injector = [];
}

RootCtrl.$inject = [];

export default app => app.controller('RootCtrl', RootCtrl);