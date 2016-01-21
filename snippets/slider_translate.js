$scope.slider = {
  minValue: 100,
  maxValue: 400,
  options: {
    floor: 0,
    ceil: 500,
    translate: function(value) {
      return '$' + value;
    }
  }
};
