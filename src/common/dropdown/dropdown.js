import angular from 'angular';

export default app => {
  app.directive("snDropdown", ["$document", function($document) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      angular.element(element[0].querySelector(".dropdown-toggle")).on("click", function(evt) {
        element.toggleClass("open");

        evt.preventDefault();
        evt.stopPropagation();
      });

      $document.on("click", function() {
        element.removeClass("open");
      });
    }
  };
}]);
}