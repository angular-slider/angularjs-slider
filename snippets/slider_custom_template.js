//You need to import the ngSanitize module:
angular.module('app', ['rzModule', 'ngSanitize']);


$scope.slider = {
  value: 100,
  options: {
    floor: 0,
    ceil: 500,
    step: 100,
    showTicksValues: true,
    translate: function(value) {
      return '<b>Price:</b> $' + value;
    }
  }
};
