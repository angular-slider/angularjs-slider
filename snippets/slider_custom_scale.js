$scope.slider = {
  value: 50,
  options: {
    floor: 0,
    ceil: 100,
    step: 10,
    showTicksValues: true,
    customValueToPosition: function(val, minVal, maxVal) {
      val = Math.sqrt(val);
      minVal = Math.sqrt(minVal);
      maxVal = Math.sqrt(maxVal);
      var range = maxVal - minVal;
      return (val - minVal) / range;
    },
    customPositionToValue: function(percent, minVal, maxVal) {
      minVal = Math.sqrt(minVal);
      maxVal = Math.sqrt(maxVal);
      var value = percent * (maxVal - minVal) + minVal;
      return Math.pow(value, 2);
    }
  }
};
