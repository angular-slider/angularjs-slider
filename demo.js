var app = angular.module('rzSliderDemo', ['rzModule', 'ui.bootstrap', 'hljs', 'ngSanitize']);

app.directive('showCode', function () {
  return {
    scope: {
      jsFile: '@',
      htmlFile: '@'
    },
    templateUrl: 'show-code.html'
  };
});

app.directive('clickableLabel', function () {
  return {
    restrict: 'E',
    scope: {label: '='},
    replace: true,
    template: "<button ng-click='onclick(label)' style='cursor: pointer;'>click me - {{label}}</button>",
    link: function (scope, elem, attrs) {
      scope.onclick = function (label) {
        alert("I'm " + label);
      };
    }
  };
});

app.controller('MainCtrl', function ($scope, $rootScope, $timeout, $uibModal) {
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

  $scope.minMaxLimitSlider = {
    value: 50,
    options: {
      floor: 0,
      ceil: 100,
      step: 1,
      minLimit: 10,
      maxLimit: 90
    }
  };

  $scope.minRangeSlider = {
    minValue: 40,
    maxValue: 60,
    options: {
      floor: 0,
      ceil: 100,
      step: 1,
      minRange: 10,
      maxRange: 50
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

  //Range slider with pushRange config
  $scope.pushRangeSlider = {
    minValue: 40,
    maxValue: 60,
    options: {
      floor: 0,
      ceil: 100,
      step: 1,
      minRange: 10,
      maxRange: 30,
      pushRange: true
    }
  };

  //Slider with selection bar
  $scope.slider_visible_bar = {
    value: 10,
    options: {
      showSelectionBar: true
    }
  };

  //Slider with selection bar at the end
  $scope.slider_visible_bar_end = {
    value: 5,
    options: {
      floor: 0,
      ceil: 10,
      showSelectionBarEnd: true
    }
  };

  //Slider with selection bar from a value
  $scope.slider_visible_bar_from_value = {
    value: 5,
    options: {
      floor: -10,
      ceil: 10,
      showSelectionBarFromValue: 0
    }
  };

  $scope.color_slider_bar = {
    value: 12,
    options: {
      showSelectionBar: true,
      getSelectionBarColor: function (value) {
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

  $scope.color_slider_pointer = {
    value: 12,
    options: {
      getPointerColor: function (value) {
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

  $scope.color_slider_tick = {
    value: 0,
    options: {
      ceil: 12,
      floor: 0,
      showSelectionBar: true,
      showTicks: true,
      getTickColor: function (value) {
        if (value < 3)
          return 'red';
        if (value < 6)
          return 'orange';
        if (value < 9)
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

  //Slider config with rtl
  $scope.slider_rtl = {
    value: 20,
    options: {
      floor: 10,
      ceil: 100,
      step: 5,
      rightToLeft: true
    }
  };

  //Slider config with floating values
  $scope.slider_float = {
    value: 0.5,
    options: {
      floor: 0,
      ceil: 2,
      step: 0.1,
      precision: 1
    }
  };

  //Slider config with callbacks
  $scope.slider_callbacks = {
    value: 100,
    options: {
      onStart: function () {
        $scope.otherData.start = $scope.slider_callbacks.value * 10;
      },
      onChange: function () {
        $scope.otherData.change = $scope.slider_callbacks.value * 10;
      },
      onEnd: function () {
        $scope.otherData.end = $scope.slider_callbacks.value * 10;
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
      floor: 0,
      ceil: 500,
      translate: function (value) {
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
      translate: function (value, sliderId, label) {
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
    value: 'E',
    options: {
      stepsArray: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    }
  };

  //Slider with ticks
  $scope.slider_ticks = {
    value: 5,
    options: {
      floor: 0,
      ceil: 10,
      showTicks: true
    }
  };

  //Slider with ticks
  $scope.slider_ticks_intermediate = {
    value: 55,
    options: {
      floor: 0,
      ceil: 100,
      showTicks: 10
    }
  };

  //Slider with ticksArray
  $scope.slider_ticks_array = {
    value: 75,
    options: {
      floor: 0,
      ceil: 100,
      ticksArray: [0, 10, 25, 50, 100]
    }
  };

  //Slider with ticks values and legend
  $scope.slider_ticks_legend = {
    value: 5,
    options: {
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

  //Slider with ticks and tooltip
  $scope.slider_ticks_tooltip = {
    value: 5,
    options: {
      floor: 0,
      ceil: 10,
      showTicks: true,
      ticksTooltip: function (v) {
        return 'Tooltip for ' + v;
      }
    }
  };

  //Slider with ticks and values
  $scope.slider_ticks_values = {
    value: 5,
    options: {
      floor: 0,
      ceil: 10,
      showTicksValues: true,
      ticksValuesTooltip: function (v) {
        return 'Tooltip for ' + v;
      }
    }
  };

  //Range slider with ticks and values
  $scope.range_slider_ticks_values = {
    minValue: 1,
    maxValue: 8,
    options: {
      floor: 0,
      ceil: 10,
      showTicksValues: true
    }
  };

  //Range slider with ticks and values
  $scope.range_slider_ticks_values_intermediate = {
    minValue: 15,
    maxValue: 85,
    options: {
      floor: 0,
      ceil: 100,
      showTicksValues: 10
    }
  };


  //Slider config with logarithmic scale
  $scope.slider_log = {
    value: 1,
    options: {
      floor: 1,
      ceil: 100,
      logScale: true,
      showTicks: true
    }
  };

  //Slider config with custom scale
  $scope.slider_custom_scale = {
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


  //Slider with custom template in order to use HTML formatting for ticks
  $scope.slider_custom_template = {
    value: 100,
    options: {
      floor: 0,
      ceil: 500,
      step: 100,
      showTicksValues: true,
      translate: function(value) {
        return '<b>Price:</b> $' + value;
      }
    }
  };

  //Slider config with angular directive inside custom template
  $scope.slider_custom_directive_inside_template = {
    minValue: 20,
    maxValue: 80,
    options: {
      floor: 0,
      ceil: 100
    }
  };

  var dates = [];
  for (var i = 1; i <= 31; i++) {
    dates.push(new Date(2016, 7, i));
  }
  $scope.slider_dates = {
    value: new Date(2016, 7, 10),
    options: {
      stepsArray: dates,
      translate: function(date) {
        if (date != null)
          return date.toDateString();
        return '';
      }
    }
  };

  //Slider with draggable range
  $scope.slider_draggable_range = {
    minValue: 1,
    maxValue: 8,
    options: {
      floor: 0,
      ceil: 10,
      draggableRange: true
    }
  };

  //Slider with draggable range only
  $scope.slider_draggable_range_only = {
    minValue: 4,
    maxValue: 6,
    options: {
      floor: 0,
      ceil: 10,
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
      ticksValuesTooltip: function (v) {
        return 'Tooltip for ' + v;
      }
    }
  };

  //Read-only slider
  $scope.read_only_slider = {
    value: 50,
    options: {
      floor: 0,
      ceil: 100,
      readOnly: true
    }
  };

  //Disabled slider
  $scope.disabled_slider = {
    minValue: 20,
    maxValue: 80,
    options: {
      floor: 0,
      ceil: 100,
      step: 10,
      disabled: true,
      showTicks: true, // just to show the disabled style
      draggableRange: true // just to show the disabled style
    }
  };

  // Slider inside ng-show
  $scope.visible = false;
  $scope.slider_toggle = {
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
  $scope.openModal = function () {
    var modalInstance = $uibModal.open({
      templateUrl: 'sliderModal.html',
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

  //Slider inside tabs
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
      showTicksValues: false,
      rightToLeft: false
    }
  };
  $scope.toggleHighValue = function () {
    if ($scope.slider_all_options.maxValue != null) {
      $scope.slider_all_options.maxValue = undefined;
    } else {
      $scope.slider_all_options.maxValue = 8;
    }
  }
});
