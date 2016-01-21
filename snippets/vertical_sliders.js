$scope.verticalSlider1 = {
  value: 0,
  options: {
    floor: 0,
    ceil: 10,
    vertical: true
  }
};
$scope.verticalSlider2 = {
  minValue: 20,
  maxValue: 80,
  options: {
    floor: 0,
    ceil: 100,
    vertical: true
  }
};
$scope.verticalSlider3 = {
  value: 5,
  options: {
    floor: 0,
    ceil: 10,
    vertical: true,
    showTicks: true
  }
};
$scope.verticalSlider4 = {
  minValue: 1,
  maxValue: 5,
  options: {
    floor: 0,
    ceil: 6,
    vertical: true,
    showTicksValues: true
  }
};
$scope.verticalSlider5 = {
  value: 50,
  options: {
    floor: 0,
    ceil: 100,
    vertical: true,
    showSelectionBar: true
  }
};
$scope.verticalSlider6 = {
  value: 6,
  options: {
    floor: 0,
    ceil: 6,
    vertical: true,
    showSelectionBar: true,
    showTicksValues: true,
    ticksValuesTooltip: function (v) {
      return 'Tooltip for ' + v;
    }
  }
};
