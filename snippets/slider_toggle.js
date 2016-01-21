$scope.visible = false;


$scope.slider = {
  value: 5,
  options: {
    floor: 0,
    ceil: 10
  }
};

$scope.toggle = function () {
  $scope.visible = !$scope.visible;
  $timeout(function () {
    $scope.$broadcast('rzSliderForceRender');
  });
};
