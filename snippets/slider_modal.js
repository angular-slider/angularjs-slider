$scope.percentages = {
  normal: {
    low: 15
  },
  range: {
    low: 10,
    high: 50
  }
};
$scope.openModal = function () {
  var modalInstance = $uibModal.open({
    templateUrl: 'slider_modal.html',
    controller: function ($scope, $uibModalInstance, values) {
      $scope.percentages = JSON.parse(JSON.stringify(values)); //Copy of the object in order to keep original values in $scope.percentages in parent controller.


      var formatToPercentage = function (value) {
        return value + '%';
      };

      $scope.percentages.normal.options = {
        floor: 0,
        ceil: 100,
        translate: formatToPercentage,
        showSelectionBar: true
      };
      $scope.percentages.range.options = {
        floor: 0,
        ceil: 100,
        translate: formatToPercentage
      };
      $scope.ok = function () {
        $uibModalInstance.close($scope.percentages);
      };
      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };
    },
    resolve: {
      values: function () {
        return $scope.percentages;
      }
    }
  });
  modalInstance.result.then(function (percentages) {
    $scope.percentages = percentages;
  });
  modalInstance.rendered.then(function () {
    $rootScope.$broadcast('rzSliderForceRender'); //Force refresh sliders on render. Otherwise bullets are aligned at left side.
  });
};
