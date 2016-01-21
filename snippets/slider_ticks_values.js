$scope.slider = { //requires angular-bootstrap to display tooltips
  value: 5,
  options: {
    floor: 0,
    ceil: 10,
    showTicksValues: true,
    ticksValuesTooltip: function(v) {
      return 'Tooltip for ' + v;
    }
  }
};
