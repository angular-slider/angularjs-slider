'use strict';

describe('rzslider - ', function() {
  var RzSlider,
    $rootScope,
    scope,
    $compile,
    $timeout,
    element,
    slider;
  beforeEach(module('rzModule'));
  beforeEach(module('appTemplates'));

  beforeEach(inject(function(_RzSlider_, _$rootScope_, _$compile_, _$timeout_) {
    RzSlider = _RzSlider_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $timeout = _$timeout_;
  }));

  describe('single slider initialisation', function() {
    beforeEach(function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          step: 10
        }
      };
      createSlider(sliderConf);
    });

    it('should exist compiled', function() {
      expect(element.find('span')).to.have.length(11);
    });

    it('should round the model value to the step', function() {
      scope.slider.value = 54;
      scope.$digest();
      expect(scope.slider.value).to.equal(50);

      scope.slider.value = 55;
      scope.$digest();
      $timeout.flush(); //to flush the throttle function
      expect(scope.slider.value).to.equal(60);
    });
  });

  describe('keyboard controls', function() {

    describe('simple cases', function() {
      beforeEach(function() {
        var sliderConf = {
          value: 100,
          options: {
            floor: 0,
            ceil: 200
          }
        };
        createSlider(sliderConf);
      });

      it('should increment by 1 when RIGHT is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'RIGHT');
        expect(scope.slider.value).to.equal(101);
      });

      it('should decrement by 1 when LEFT is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'LEFT');
        expect(scope.slider.value).to.equal(99);
      });

      it('should increment by 10% when PAGEUP is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'PAGEUP');
        expect(scope.slider.value).to.equal(120);
      });

      it('should decrement by 10% when PAGEDOWN is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'PAGEDOWN');
        expect(scope.slider.value).to.equal(80);
      });

      it('should set value to min when HOME is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'HOME');
        expect(scope.slider.value).to.equal(0);
      });

      it('set value to max when END is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'END');
        expect(scope.slider.value).to.equal(200);
      });
    });

    it('should not go below 0', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 1000,
          step: 10
        }
      };
      createSlider(sliderConf);
      slider.minH.triggerHandler('focus');
      pressKeydown(slider.minH, 'PAGEDOWN');
      expect(scope.slider.value).to.equal(0);
    });

    function pressKeydown(element, key, oldAPI) {
      key = key.toUpperCase();
      var event = {
        type: 'keydown'
      };
      var keys = {
        'UP': 38,
        'DOWN': 40,
        'LEFT': 37,
        'RIGHT': 39,
        'PAGEUP': 33,
        'PAGEDOWN': 34,
        'HOME': 36,
        'END': 35
      };
      var keyCode = keys[key];
      if (oldAPI)
        eent.which = keyCode;
      else event.keyCode = keyCode;
      element.triggerHandler(event);
    }
  });

  function createSlider(sliderObj) {
    var template = '';
    if (sliderObj.options)
      template = '<rzslider rz-slider-model="slider.value" rz-slider-options="slider.options"></rzslider>';
    else
      template = '<rzslider rz-slider-model="slider.value"></rzslider>';
    initSlider(sliderObj, template);
  }

  function createRangeSlider(sliderObj) {
    var template = '';
    if (sliderObj.options)
      template = '<rzslider rz-slider-model="slider.min" rz-slider-high="slider.max"' +
      'rz-slider-options="slider.options"></rzslider>';
    else
      template = '<rzslider rz-slider-model="slider.value" rz-slider-high="slider.max"></rzslider>';
    initSlider(sliderObj, template);
  }

  function initSlider(sliderObj, template) {
    scope = $rootScope.$new();
    scope.slider = sliderObj;
    element = $compile(template)(scope);
    scope.$apply();
    slider = element.isolateScope().slider;
    $timeout.flush();
  }
});
