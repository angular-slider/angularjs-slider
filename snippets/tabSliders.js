$scope.tabSliders = {
  slider1: {
    value: 100
  },
  slider2: {
    value: 200
  }
};
$scope.refreshSlider = function () {
  $timeout(function () {
    $scope.$broadcast('rzSliderForceRender');
  });
};
