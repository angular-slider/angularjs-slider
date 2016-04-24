var app = angular.module('rzSliderDemo', ['rzModule', 'ui.bootstrap']);

app.controller('MainCtrl', function($scope, $rootScope, $timeout, $modal) {
  //Minimal slider config
  $scope.minSlider = {
    value: 10
  };

  //Range slider config
  $scope.rangeSlider = {
    minValue: 10,
    maxValue: 90,
    options: {
      floor: 0,
      ceil: 100,
      step: 1
    }
  };

  //Range slider with minRange config
  $scope.minRangeSlider = {
    minValue: 10,
    maxValue: 90,
    options: {
      floor: 0,
      ceil: 100,
      step: 1,
      minRange: 10
    }
  };

  //Range slider with noSwitching config
  $scope.noSwitchingSlider = {
    minValue: 10,
    maxValue: 90,
    options: {
      floor: 0,
      ceil: 100,
      step: 1,
      noSwitching: true
    }
  };

  //Slider with selection bar
  $scope.slider_visible_bar = {
    value: 10,
    options: {
      showSelectionBar: true
    }
  };

  //Slider with selection bar end
  $scope.slider_visible_bar_end = {
    value: 10,
    options: {
      ceil: 100,
      showSelectionBarEnd: true
    }
  };

  //Slider with selection bar from value
  $scope.slider_visible_bar_from_value = {
    value: 10,
    options: {
      floor: -100,
      ceil: 100,
      step: 10,
      showSelectionBarFromValue: 0
    }
  };

  //Slider with selection bar color
  $scope.color_slider_bar = {
    value: 12,
    options: {
      showSelectionBar: true,
      getSelectionBarColor: function(value) {
        if (value <= 3)
          return 'red';
        if (value <= 6)
          return 'orange';
        if (value <= 9)
          return 'yellow';
        return '#2AE02A';
      }
    }
  };

  //Slider with pointer color
  $scope.color_slider_pointer = {
    value: 12,
    options: {
      getPointerColor: function(value) {
        if (value <= 3)
          return 'red';
        if (value <= 6)
          return 'orange';
        if (value <= 9)
          return 'yellow';
        return '#2AE02A';
      }
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

  //Right to left slider with floor, ceil and step
  $scope.slider_floor_ceil_rtl = {
    value: 12,
    options: {
      floor: 10,
      ceil: 100,
      step: 5,
      rightToLeft: true
    }
  }

  //Slider config with callbacks
  $scope.slider_callbacks = {
    value: 100,
    options: {
      onStart: function(id, newValue) {
        console.info('start', id, newValue);
        $scope.otherData.start = newValue * 10;
      },
      onChange: function(id, newValue) {
        console.info('change', id, newValue);
        $scope.otherData.change = newValue * 10;
      },
      onEnd: function(id, newValue) {
        console.info('end', id, newValue);
        $scope.otherData.end = newValue * 10;
      }
    }
  };
  $scope.otherData = {
    start: 0,
    change: 0,
    end: 0
  };

  //Slider config with custom display function
  $scope.slider_translate = {
    minValue: 100,
    maxValue: 400,
    options: {
      ceil: 500,
      floor: 0,
      id: 'translate-slider',
      translate: function(value, id, which) {
        console.info(value, id, which);
        return '$' + value;
      }
    }
  };

  //Slider config with custom display function using html formatting
  $scope.slider_translate_html = {
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

  //Slider config with steps array of letters
  $scope.slider_alphabet = {
    value: 0,
    options: {
      stepsArray: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
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

  //Slider with ticks and tooltip
  $scope.slider_ticks_tooltip = {
    value: 5,
    options: {
      ceil: 10,
      floor: 0,
      showTicks: true,
      ticksTooltip: function(v) {
        return 'Tooltip for ' + v;
      }
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

  //Slider with ticks at intermediate positions
  $scope.slider_ticks_at = {
    value: 500,
    options: {
      ceil: 1000,
      floor: 0,
      showTicks: 100
    }
  };

  //Slider with ticks and values at intermediate positions
  $scope.slider_ticks_values_at = {
    value: 500,
    options: {
      ceil: 1000,
      floor: 0,
      showTicksValues: 100
    }
  };

  //Slider with ticks values and legend
  $scope.slider_ticks_legend = {
    value: 5,
    options: {
      ceil: 10,
      floor: 0,
      showTicksValues: true,
      stepsArray: [
        {value: 1, legend: 'Very poor'},
        {value: 2},
        {value: 3, legend: 'Fair'},
        {value: 4},
        {value: 5, legend: 'Average'},
        {value: 6},
        {value: 7, legend: 'Good'},
        {value: 8},
        {value: 9, legend: 'Excellent'}
      ]
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

  //Slider with draggable range only
  $scope.slider_draggable_range_only = {
    minValue: 4,
    maxValue: 6,
    options: {
      ceil: 10,
      floor: 0,
      draggableRangeOnly: true
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
      $rootScope.$broadcast('rzSliderForceRender'); //Force refresh sliders on render. Otherwise bullets are aligned at left side.
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
    if ($scope.slider_all_options.maxValue != null) {
      $scope.slider_all_options.maxValue = undefined;
    } else {
      $scope.slider_all_options.maxValue = 8;
    }
  }
});
