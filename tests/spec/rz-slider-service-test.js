'use strict';

describe('rzslider - ', function() {
  var RzSlider,
    $rootScope,
    scope,
    $compile,
    element,
    service;
  beforeEach(module('rzModule'));
  beforeEach(module('appTemplates'));

  beforeEach(inject(function(_RzSlider_, _$rootScope_, _$compile_) {
    RzSlider = _RzSlider_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  describe('initialisation', function() {
    beforeEach(function() {
      var slider = {
        value: 10,
        options: {
          floor: 0,
          ceil: 1000,
          step: 100
        }
      };
      createSlider(slider);
    });
    it('should exist compiled', function() {
      expect(element.find('span')).to.have.length(11);
    });
  });

  describe('keyboard controls', function() {
    beforeEach(function() {
      var slider = {
        value: 10,
        options: {
          floor: 0,
          ceil: 1000,
          step: 100
        }
      };
      createSlider(slider);
    });

    it('should trigger a left arrow respecting step values and not go below 0', function() {
      var event = pressLeftArrow();
      service.onPointerFocus(element, 'rzSliderModel', event);
      service.onKeyboardEvent(event);
      expect(scope.slider.value).to.equal(0);
    });

    function pressLeftArrow() {
      var evt = document.createEvent('CustomEvent'); // MUST be 'CustomEvent'
      evt.initCustomEvent('keydown', false, false, null);
      evt.which = 37;
      return evt;
    }
  });

  function createSlider(sliderObj) {
    scope = $rootScope.$new();
    scope.slider = sliderObj;
    var template = '';
    if (sliderObj.options)
      template = '<rzslider rz-slider-model="slider.value" rz-slider-options="slider.options"></rzslider>';
    else
      template = '<rzslider rz-slider-model="slider.value"></rzslider>';
    element = $compile(template)(scope);
    scope.$apply();
    service = element.isolateScope().service;
  }

  function createRangeSlider(sliderObj) {
    scope = $rootScope.$new();
    scope.slider = sliderObj;
    var template = '';
    if (sliderObj.options)
      template = '<rzslider rz-slider-model="slider.min" rz-slider-high="slider.max"' +
      'rz-slider-options="slider.options"></rzslider>';
    else
      template = '<rzslider rz-slider-model="slider.value" rz-slider-high="slider.max"></rzslider>';
    element = $compile(template)(scope);
    scope.$apply();
    service = element.isolateScope().service;
  }
});
