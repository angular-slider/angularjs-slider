$scope.slider = {
  minValue: 100,
  maxValue: 400,
  options: {
    floor: 0,
    ceil: 500,
    translate: function(value, sliderId, label) {
      switch (label) {
        case 'model':
          return '<b>Min price:</b> $' + value;
        case 'high':
          return '<b>Max price:</b> $' + value;
        default:
          return '$' + value
      }
    }
  }
};
