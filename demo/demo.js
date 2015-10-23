var app = angular.module('rzSliderDemo', ['rzModule']);

app.controller('MainCtrl', function($scope, $timeout) {
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

  //Slider config with custom display function displaying letters
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $scope.slider_alphabet = {
    value: 0,
    options: {
      ceil: alphabet.length - 1,
      floor: 0,
      translate: function(value) {
        if (value >= 0 && value < alphabet.length)
          return alphabet[value];
        return '';
      }
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
      showTicksValues: true
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

  $scope.visible = false;

  $scope.toggle = function() {
    $scope.visible = !$scope.visible;
    $timeout(function() {
      $scope.$broadcast('rzSliderForceRender');
    });
  };

  $scope.slider_toggle = {
    value: 5,
    options: {
      ceil: 10,
      floor: 0
    }
  };
});
