var app = angular.module('rzSliderDemo', ['rzModule', 'ui.bootstrap']);

app.controller('MainCtrl', function($scope, $rootScope, $timeout, $modal) {
  //Minimal slider config
  $scope.minSlider = {
    value: 10
  };

  //Slider with selection bar
  $scope.slider_visible_bar = {
    value: 10,
    options: {
      showSelectionBar: true
    }
  };

  //Range slider config
  $scope.minRangeSlider = {
    minValue: 10,
    maxValue: 90,
    options: {
      floor: 0,
      ceil: 100,
      step: 1
    }
  };

  //Slider config with floor, ceil and step
  $scope.slider_floor_ceil = {
    value: 12,
    options: {
      floor: 10,
      ceil: 100,
      step: 5
    }
  };

  //Slider config with callbacks
  $scope.slider_callbacks = {
    value: 100,
    options: {
      onStart: function() {
        $scope.otherData.start = $scope.slider_callbacks.value * 10;
      },
      onChange: function() {
        $scope.otherData.change = $scope.slider_callbacks.value * 10;
      },
      onEnd: function() {
        $scope.otherData.end = $scope.slider_callbacks.value * 10;
      }
    }
  };
  $scope.otherData = {start: 0, change: 0, end: 0};

  //Slider config with custom display function
  $scope.slider_translate = {
    minValue: 100,
    maxValue: 400,
    options: {
      ceil: 500,
      floor: 0,
      translate: function(value) {
        return '$' + value;
      }
    }
  };

  //Slider config with steps array of letters
  $scope.slider_alphabet = {
    value: 0,
    options: {
      stepsArray:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    }
  };

  //Slider with ticks
  $scope.slider_ticks = {
    value: 5,
    options: {
      ceil: 10,
      floor: 0,
      showTicks: true
    }
  };

  //Slider with ticks and values
  $scope.slider_ticks_values = {
    value: 5,
    options: {
      ceil: 10,
      floor: 0,
      showTicksValues: true,
      ticksValuesTooltip: function(v) {
        return 'Tooltip for ' + v;
      }
    }
  };

  //Range slider with ticks and values
  $scope.range_slider_ticks_values = {
    minValue: 1,
    maxValue: 8,
    options: {
      ceil: 10,
      floor: 0,
      showTicksValues: true
    }
  };

  //Slider with draggable range
  $scope.slider_draggable_range = {
    minValue: 1,
    maxValue: 8,
    options: {
      ceil: 10,
      floor: 0,
      draggableRange: true
    }
  };

  //Vertical sliders
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
      ticksValuesTooltip: function(v) {
        return 'Tooltip for ' + v;
      }
    }
  };

  //Read-only slider
  $scope.read_only_slider = {
    value: 50,
    options: {
      ceil: 100,
      floor: 0,
      readOnly: true
    }
  };

  //Disabled slider
  $scope.disabled_slider = {
    value: 50,
    options: {
      ceil: 100,
      floor: 0,
      disabled: true
    }
  };

  // Slider inside ng-show
  $scope.visible = false;
  $scope.slider_toggle = {
    value: 5,
    options: {
      ceil: 10,
      floor: 0
    }
  };
  $scope.toggle = function() {
    $scope.visible = !$scope.visible;
    $timeout(function() {
      $scope.$broadcast('rzSliderForceRender');
    });
  };

  //Slider inside modal
  $scope.percentages = {
    normal: {
      low: 15
    },
    range: {
      low: 10,
      high: 50
    }
  };
  $scope.openModal = function() {
    var modalInstance = $modal.open({
      templateUrl: 'sliderModal.html',
      controller: function($scope, $modalInstance, values) {
        $scope.percentages = JSON.parse(JSON.stringify(values)); //Copy of the object in order to keep original values in $scope.percentages in parent controller.


        var formatToPercentage = function(value) {
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
        $scope.ok = function() {
          $modalInstance.close($scope.percentages);
        };
        $scope.cancel = function() {
          $modalInstance.dismiss();
        };
      },
      resolve: {
        values: function() {
          return $scope.percentages;
        }
      }
    });
    modalInstance.result.then(function(percentages) {
      $scope.percentages = percentages;
    });
    modalInstance.rendered.then(function() {
      $rootScope.$broadcast('rzSliderForceRender');//Force refresh sliders on render. Otherwise bullets are aligned at left side.
    });
  };


  //Slider inside tabs
  $scope.tabSliders = {
    slider1: {
      value: 100
    },
    slider2: {
      value: 200
    }
  };
  $scope.refreshSlider = function() {
    $timeout(function() {
      $scope.$broadcast('rzSliderForceRender');
    });
  };


  //Slider with draggable range
  $scope.slider_all_options = {
    minValue: 2,
    options: {
      floor: 0,
      ceil: 10,
      step: 1,
      precision: 0,
      draggableRange: false,
      showSelectionBar: false,
      hideLimitLabels: false,
      readOnly: false,
      disabled: false,
      showTicks: false,
      showTicksValues: false
    }
  };
  $scope.toggleHighValue = function() {
    if($scope.slider_all_options.maxValue != null) {
      $scope.slider_all_options.maxValue = undefined;
    }
    else {
      $scope.slider_all_options.maxValue = 8;
    }
  }
});
