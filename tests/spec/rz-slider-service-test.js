'use strict';

describe('rzslider - ', function() {
  var RzSlider,
    RzSliderOptions,
    $rootScope,
    scope,
    $compile,
    $timeout,
    $window,
    element,
    parent,
    slider;
  beforeEach(module('rzModule'));
  beforeEach(module('appTemplates'));

  beforeEach(inject(function(_RzSlider_, _RzSliderOptions_, _$rootScope_, _$compile_, _$timeout_, _$window_) {
    RzSlider = _RzSlider_;
    RzSliderOptions = _RzSliderOptions_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $timeout = _$timeout_;
    $window = _$window_;
  }));

  afterEach(function() {
    //clean the element we append at each test
    parent.remove();
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
      template = '<rzslider rz-slider-model="slider.min" rz-slider-high="slider.max"></rzslider>';
    initSlider(sliderObj, template);
  }

  function initSlider(sliderObj, template) {
    scope = $rootScope.$new();
    scope.slider = sliderObj;
    parent = angular.element('<div style="width: 1000px; height:1000px;"></div>');
    element = $compile(template)(scope);
    parent.append(element);
    angular.element(document).find('body').append(parent);
    scope.$digest();
    slider = element.isolateScope().slider;
    $timeout.flush();
  }

  /*
  ******************************************************************************
    SINGLE SLIDER INIT
  ******************************************************************************
  */
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

    it('should exist compiled and with correct config', function() {
      expect(element.find('span')).to.have.length(11);
      expect(slider.range).to.be.false;
      expect(slider.valueRange).to.equal(100);
    });

    it('should watch rzSliderModel and reflow the slider accordingly', function() {
      sinon.spy(slider, 'onLowHandleChange');
      scope.slider.value = 54;
      scope.$digest();
      slider.onLowHandleChange.called.should.be.true;
    });

    it('should watch rzSliderOptions and reset the slider accordingly', function() {
      sinon.spy(slider, 'applyOptions');
      sinon.spy(slider, 'resetSlider');
      scope.slider.options.showTicks = true;
      scope.$digest();
      slider.applyOptions.called.should.be.true;
      slider.resetSlider.called.should.be.true;
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

    it('should call calcViewDimensions() on reCalcViewDimensions', function() {
      sinon.spy(slider, 'calcViewDimensions');
      scope.$broadcast('reCalcViewDimensions');
      slider.calcViewDimensions.called.should.be.true;
    });

    it('should reset everything on rzSliderForceRender', function() {
      sinon.spy(slider, 'resetLabelsValue');
      sinon.spy(slider, 'resetSlider');
      sinon.spy(slider, 'onLowHandleChange');

      scope.$broadcast('rzSliderForceRender');

      slider.resetLabelsValue.called.should.be.true;
      slider.resetSlider.called.should.be.true;
      slider.onLowHandleChange.called.should.be.true;
    });

    it('should call calcViewDimensions() on window resize event', function() {
      sinon.spy(slider, 'calcViewDimensions');
      angular.element($window).triggerHandler('resize');
      slider.calcViewDimensions.called.should.be.true;
    });

    it('should unregister all dom events on $destroy', function() {
      sinon.spy(slider, 'calcViewDimensions');
      sinon.spy(slider, 'unbindEvents');

      scope.$broadcast('$destroy');
      angular.element($window).triggerHandler('resize');

      slider.calcViewDimensions.called.should.be.false;
      slider.unbindEvents.called.should.be.true;
    });
  });

  /*
  ******************************************************************************
    RANGE SLIDER INIT
  ******************************************************************************
  */
  describe('range slider initialisation', function() {
    beforeEach(function() {
      var sliderConf = {
        min: 10,
        max: 90,
        options: {
          floor: 0,
          ceil: 100,
          step: 10
        }
      };
      createRangeSlider(sliderConf);
    });

    it('should exist compiled and with correct config', function() {
      expect(element.find('span')).to.have.length(11);
      expect(slider.range).to.be.true;
      expect(slider.valueRange).to.equal(100);
    });

    it('should watch rzSliderHigh and reflow the slider accordingly', function() {
      sinon.spy(slider, 'onHighHandleChange');
      scope.slider.max = 95;
      scope.$digest();
      slider.onHighHandleChange.called.should.be.true;
    });

    it('should switch to a single slider when rzSliderHigh is unset after init', function() {
      sinon.spy(slider, 'onHighHandleChange');
      sinon.spy(slider, 'applyOptions');
      sinon.spy(slider, 'resetSlider');
      scope.slider.max = undefined;
      scope.$digest();
      slider.onHighHandleChange.called.should.be.false;
      slider.applyOptions.called.should.be.true;
      slider.resetSlider.called.should.be.true;
    });

    it('should switch to a range slider when rzSliderHigh is set after init', function() {
      scope.slider.max = undefined;
      scope.$digest();
      sinon.spy(slider, 'onHighHandleChange');
      sinon.spy(slider, 'applyOptions');
      sinon.spy(slider, 'resetSlider');
      scope.slider.max = 100;
      scope.$digest();
      slider.onHighHandleChange.called.should.be.true;
      slider.applyOptions.called.should.be.true;
      slider.resetSlider.called.should.be.true;
    });

    it('should round the model value to the step', function() {
      scope.slider.min = 13;
      scope.slider.max = 94;
      scope.$digest();
      expect(scope.slider.min).to.equal(10);
      expect(scope.slider.max).to.equal(90);

      scope.slider.min = 15;
      scope.slider.max = 95;
      scope.$digest();
      $timeout.flush(); //to flush the throttle function
      expect(scope.slider.min).to.equal(20);
      expect(scope.slider.max).to.equal(100);
    });

    it('should reset everything on rzSliderForceRender', function() {
      sinon.spy(slider, 'resetLabelsValue');
      sinon.spy(slider, 'resetSlider');
      sinon.spy(slider, 'onLowHandleChange');
      sinon.spy(slider, 'onHighHandleChange');

      scope.$broadcast('rzSliderForceRender');

      slider.resetLabelsValue.called.should.be.true;
      slider.resetSlider.called.should.be.true;
      slider.onLowHandleChange.called.should.be.true;
      slider.onHighHandleChange.called.should.be.true;
    });
  });

  /*
  ******************************************************************************
    RzSliderOptions
  ******************************************************************************
  */
  describe('RzSliderOptions', function() {

    it('should have a correct getOptions method that apply custom options', function() {
      var defaultOpts = RzSliderOptions.getOptions();
      var customOpts = {
        showTicks: true
      };

      var expectedOpts = angular.extend({}, defaultOpts, customOpts);
      var options = RzSliderOptions.getOptions(customOpts);
      expect(options).to.deep.equal(expectedOpts);
    });

    it('should have a correct options method to update the global options', function() {
      var defaultOpts = RzSliderOptions.getOptions();
      var globalOpts = {
        showTicks: true
      };
      RzSliderOptions.options(globalOpts);

      var expectedOpts = angular.extend({}, defaultOpts, globalOpts);
      var options = RzSliderOptions.getOptions();
      expect(options).to.deep.equal(expectedOpts);
    });
  });

  /*
  ******************************************************************************
    Options handling
  ******************************************************************************
  */
  describe('options handling - ', function() {

    describe('tests with same config', function() {
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

      it('horizontal slider should take the full width and get correct position/dimension properties', function() {
        scope.$digest();
        expect(element[0].getBoundingClientRect().width).to.equal(1000);
        expect(slider.positionProperty).to.equal('left');
        expect(slider.dimensionProperty).to.equal('width');
      });

      it('vertical slider should take the full height and get correct position/dimension properties', function() {
        scope.$digest();
        scope.slider.options.vertical = true;
        scope.$digest();
        expect(element[0].getBoundingClientRect().height).to.equal(1000);
        expect(slider.positionProperty).to.equal('bottom');
        expect(slider.dimensionProperty).to.equal('height');
      });

      it('should prevent invalid step', function() {
        scope.slider.options.step = 0;
        scope.$digest();
        expect(slider.options.step).to.equal(1);

        scope.slider.options.step = -1;
        scope.$digest();
        expect(slider.options.step).to.equal(1);
      });

      it('should set the showTicks scope flag to true when showTicks is true', function() {
        scope.slider.options.showTicks = true;
        scope.$digest();
        expect(slider.scope.showTicks).to.be.true;
      });

      it('should set the showTicks scope flag to true when showTicksValues is true', function() {
        scope.slider.options.showTicksValues = true;
        scope.$digest();
        expect(slider.scope.showTicks).to.be.true;
      });

      it('should set not accept draggableRange to true when slider is a single one', function() {
        scope.slider.options.draggableRange = true;
        scope.$digest();
        expect(slider.options.draggableRange).to.be.false;
      });

      it('should set not accept draggableRangeOnly to true when slider is a single one', function() {
        scope.slider.options.draggableRangeOnly = true;
        scope.$digest();
        expect(slider.options.draggableRange).to.be.false;
        expect(slider.options.draggableRangeOnly).to.be.false;
      });

      it('should set correct step/floor/ceil and translate function when stepsArray is used', function() {
        scope.slider.options.stepsArray = ['A', 'B', 'C', 'D', 'E'];
        scope.$digest();
        expect(slider.options.step).to.equal(1);
        expect(slider.options.floor).to.equal(0);
        expect(slider.options.ceil).to.equal(4);

        expect(slider.customTrFn(0)).to.equal('A');
        expect(slider.customTrFn(2)).to.equal('C');
      });

      it('should sanitize rzSliderModel between floor and ceil', function() {
        scope.slider.options.enforceRange = true;
        scope.slider.value = 1000;
        scope.$digest();
        expect(scope.slider.value).to.equal(100);

        scope.slider.value = -1000;
        scope.$digest();
        $timeout.flush(); //to flush the throttle function
        expect(scope.slider.value).to.equal(0);
      });
    });

    describe('tests with specific config', function() {
      it('should accept custom translate function', function() {
        var sliderConf = {
          value: 10,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
            translate: function(v) {
              return 'custom value';
            }
          }
        };
        createSlider(sliderConf);
        expect(slider.customTrFn(0)).to.equal('custom value');
        expect(slider.customTrFn(100)).to.equal('custom value');
      });

      it('should set maxValue to rzSliderModel if no ceil is set for a single slider', function() {
        var sliderConf = {
          value: 10
        };
        createSlider(sliderConf);
        expect(slider.maxValue).to.equal(10);
      });

      it('should set maxValue to rzSliderHigh if no ceil is set for a range slider', function() {
        var sliderConf = {
          min: 10,
          max: 100
        };
        createRangeSlider(sliderConf);
        expect(slider.maxValue).to.equal(100);
      });
    });
  });

  describe('options handling (specific to range) - ', function() {
    beforeEach(function() {
      var sliderConf = {
        min: 10,
        max: 90,
        options: {
          floor: 0,
          ceil: 100,
          step: 10
        }
      };
      createRangeSlider(sliderConf);
    });

    it('should set draggableRange to true when draggableRangeOnly is true', function() {
      scope.slider.options.draggableRangeOnly = true;
      scope.$digest();
      expect(slider.options.draggableRange).to.be.true;
    });

    it('should sanitize rzSliderModel and rzSliderHigh between floor and ceil', function() {
      scope.slider.options.enforceRange = true;
      scope.slider.min = -1000;
      scope.slider.max = 1000;
      scope.$digest();
      expect(scope.slider.min).to.equal(0);
      expect(scope.slider.max).to.equal(100);
    });
  });

  /*
  ******************************************************************************
    Slider with ticks
  ******************************************************************************
  */
  describe('slider with ticks', function() {

    it('should not create any tick if showTicks is false (default)', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10
        }
      };
      createSlider(sliderConf);
      expect(element[0].querySelectorAll('.tick')).to.have.length(0);
    });

    it('should create the correct number of ticks when showTicks is true', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true
        }
      };
      createSlider(sliderConf);
      expect(element[0].querySelectorAll('.tick')).to.have.length(11);
    });

    it('should create the correct number of ticks when showTicksValues is true', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicksValues: true
        }
      };
      createSlider(sliderConf);
      expect(element[0].querySelectorAll('.tick')).to.have.length(11);
      expect(element[0].querySelectorAll('.tick-value')).to.have.length(11);
      var firstTick = angular.element(element[0].querySelectorAll('.tick-value')[0]);
      expect(firstTick.text()).to.equal('0');
      var secondTick = angular.element(element[0].querySelectorAll('.tick-value')[1]);
      expect(secondTick.text()).to.equal('10');
    });

    it('should set selected class to ticks below the model value if showSelectionBar is true', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          showSelectionBar: true
        }
      };
      createSlider(sliderConf);
      var firstTick = angular.element(element[0].querySelectorAll('.tick')[0]);
      expect(firstTick.hasClass('selected')).to.be.true;
      var sixthTick = angular.element(element[0].querySelectorAll('.tick')[5]);
      expect(sixthTick.hasClass('selected')).to.be.true;
      var seventhTick = angular.element(element[0].querySelectorAll('.tick')[6]);
      expect(seventhTick.hasClass('selected')).to.be.false;
      var lastTick = angular.element(element[0].querySelectorAll('.tick')[10]);
      expect(lastTick.hasClass('selected')).to.be.false;
    });

    it('should set selected class to ticks between min/max if showSelectionBar is true on range slider', function() {
      var sliderConf = {
        min: 40,
        max: 60,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true
        }
      };
      createRangeSlider(sliderConf);
      var firstTick = angular.element(element[0].querySelectorAll('.tick')[0]);
      expect(firstTick.hasClass('selected')).to.be.false;
      var sixthTick = angular.element(element[0].querySelectorAll('.tick')[5]);
      expect(sixthTick.hasClass('selected')).to.be.true;
      var seventhTick = angular.element(element[0].querySelectorAll('.tick')[6]);
      expect(seventhTick.hasClass('selected')).to.be.true;
      var lastTick = angular.element(element[0].querySelectorAll('.tick')[10]);
      expect(lastTick.hasClass('selected')).to.be.false;
    });

    it('should set the correct color to ticks when getSelectionBarColor is defined', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          showSelectionBar: true,
          getSelectionBarColor: function(value) {
            if (value <= 50)
              return 'red';
            else
              return 'green';
          }
        }
      };
      createSlider(sliderConf);
      var firstTick = angular.element(element[0].querySelectorAll('.tick')[0]);
      expect(firstTick.css('background-color')).to.equal('red');

      scope.slider.value = 100;
      scope.$digest();
      expect(firstTick.css('background-color')).to.equal('green');
    });

    it('should set a tooltip attribute if ticksTooltip is defined', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          ticksTooltip: function(value) {
            return 'tooltip for ' + value;
          }
        }
      };
      createSlider(sliderConf);
      var firstTick = angular.element(element[0].querySelectorAll('.tick')[0]);
      expect(firstTick.attr('uib-tooltip')).to.equal('tooltip for 0');
      var secondTick = angular.element(element[0].querySelectorAll('.tick')[1]);
      expect(secondTick.attr('uib-tooltip')).to.equal('tooltip for 10');
    });

    it('should set a tooltip attribute on tick-value if ticksValuesTooltip is defined', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicksValues: true,
          ticksValuesTooltip: function(value) {
            return 'tooltip for ' + value;
          }
        }
      };
      createSlider(sliderConf);
      var firstTick = angular.element(element[0].querySelectorAll('.tick-value')[0]);
      expect(firstTick.attr('uib-tooltip')).to.equal('tooltip for 0');
      var secondTick = angular.element(element[0].querySelectorAll('.tick-value')[1]);
      expect(secondTick.attr('uib-tooltip')).to.equal('tooltip for 10');
    });
  });

  /*
  ******************************************************************************
    KEYBOARD CONTROLS
  ******************************************************************************
  */
  describe('keyboard controls', function() {

    describe('simple cases for single slider - ', function() {
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

      it('should toggle active style when handle focused/blured', function() {
        slider.minH.triggerHandler('focus');
        expect(slider.minH.hasClass('rz-active')).to.be.true;
        slider.minH.triggerHandler('blur');
        expect(slider.minH.hasClass('rz-active')).to.be.false;
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

      it('should increment by 1 when UP is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'UP');
        expect(scope.slider.value).to.equal(101);
      });

      it('should decrement by 1 when DOWN is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'DOWN');
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

      it('should  set value to max when END is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'END');
        expect(scope.slider.value).to.equal(200);
      });

      it('should do nothing when SPACE is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'SPACE');
        expect(scope.slider.value).to.equal(100);
      });

      it('should not modify when keypress but not focused', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'RIGHT');
        expect(scope.slider.value).to.equal(101);
        slider.minH.triggerHandler('blur');
        pressKeydown(slider.minH, 'RIGHT');
        expect(scope.slider.value).to.equal(101);
      });
    });

    describe('simple cases for range slider - ', function() {
      beforeEach(function() {
        var sliderConf = {
          min: 50,
          max: 100,
          options: {
            floor: 0,
            ceil: 200
          }
        };
        createRangeSlider(sliderConf);
      });

      it('should toggle active style when handle focused/blured', function() {
        slider.minH.triggerHandler('focus');
        expect(slider.minH.hasClass('rz-active')).to.be.true;
        expect(slider.maxH.hasClass('rz-active')).to.be.false;
        slider.minH.triggerHandler('blur');
        slider.maxH.triggerHandler('focus');
        expect(slider.minH.hasClass('rz-active')).to.be.false;
        expect(slider.maxH.hasClass('rz-active')).to.be.true;
        slider.maxH.triggerHandler('blur');
        expect(slider.minH.hasClass('rz-active')).to.be.false;
        expect(slider.maxH.hasClass('rz-active')).to.be.false;
      });

      it('should increment minH by 1 when RIGHT is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'RIGHT');
        expect(scope.slider.min).to.equal(51);
      });

      it('should increment maxH by 1 when RIGHT is pressed', function() {
        slider.maxH.triggerHandler('focus');
        pressKeydown(slider.maxH, 'RIGHT');
        expect(scope.slider.max).to.equal(101);
      });

      it('should decrement minH by 1 when LEFT is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'LEFT');
        expect(scope.slider.min).to.equal(49);
      });

      it('should decrement maxH by 1 when LEFT is pressed', function() {
        slider.maxH.triggerHandler('focus');
        pressKeydown(slider.maxH, 'LEFT');
        expect(scope.slider.max).to.equal(99);
      });

      it('should increment minH by 10% when PAGEUP is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'PAGEUP');
        expect(scope.slider.min).to.equal(70);
      });

      it('should increment maxH by 10% when PAGEUP is pressed', function() {
        slider.maxH.triggerHandler('focus');
        pressKeydown(slider.maxH, 'PAGEUP');
        expect(scope.slider.max).to.equal(120);
      });

      it('should decrement minH by 10% when PAGEDOWN is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'PAGEDOWN');
        expect(scope.slider.min).to.equal(30);
      });

      it('should decrement maxH by 10% when PAGEDOWN is pressed', function() {
        slider.maxH.triggerHandler('focus');
        pressKeydown(slider.maxH, 'PAGEDOWN');
        expect(scope.slider.max).to.equal(80);
      });

      it('should set minH to min when HOME is pressed on minH', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'HOME');
        expect(scope.slider.min).to.equal(0);
      });

      it('should set minH value to previous min and switch min/max when HOME is pressed on maxH', function() {
        slider.maxH.triggerHandler('focus');
        pressKeydown(slider.maxH, 'HOME');
        expect(scope.slider.min).to.equal(0);
        expect(scope.slider.max).to.equal(50);
      });

      it('should set minH value to previous max and switch min/max when END is pressed on minH', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'END');
        expect(scope.slider.min).to.equal(100);
        expect(scope.slider.max).to.equal(200);
      });

      it('should set maxH value to max when END is pressed on maxH', function() {
        slider.maxH.triggerHandler('focus');
        pressKeydown(slider.maxH, 'END');
        expect(scope.slider.max).to.equal(200);
      });

      it('should do nothing when SPACE is pressed on minH', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'SPACE');
        expect(scope.slider.min).to.equal(50);
      });

      it('should do nothing when SPACE is pressed on maxH', function() {
        slider.maxH.triggerHandler('focus');
        pressKeydown(slider.maxH, 'SPACE');
        expect(scope.slider.max).to.equal(100);
      });

      it('should not modify minH when keypress but not focused', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'RIGHT');
        expect(scope.slider.min).to.equal(51);
        slider.minH.triggerHandler('blur');
        pressKeydown(slider.minH, 'RIGHT');
        expect(scope.slider.min).to.equal(51);
      });

      it('should not modify maxH when keypress but not focused', function() {
        slider.maxH.triggerHandler('focus');
        pressKeydown(slider.maxH, 'RIGHT');
        expect(scope.slider.max).to.equal(101);
        slider.maxH.triggerHandler('blur');
        pressKeydown(slider.maxH, 'RIGHT');
        expect(scope.slider.max).to.equal(101);
      });
    });

    describe('range slider with draggableRangeOnly=true - ', function() {
      beforeEach(function() {
        var sliderConf = {
          min: 90,
          max: 110,
          options: {
            floor: 0,
            ceil: 200,
            draggableRangeOnly: true
          }
        };
        createRangeSlider(sliderConf);
      });

      it('should increment minH/maxH by 1 when RIGHT is pressed on minH', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'RIGHT');
        expect(scope.slider.min).to.equal(91);
        expect(scope.slider.max).to.equal(111);
      });

      it('should increment minH/maxH by 1 when RIGHT is pressed on maxH', function() {
        slider.maxH.triggerHandler('focus');
        pressKeydown(slider.maxH, 'RIGHT');
        expect(scope.slider.min).to.equal(91);
        expect(scope.slider.max).to.equal(111);
      });

      it('should increment minH/maxH by 1 when LEFT is pressed on minH', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'LEFT');
        expect(scope.slider.min).to.equal(89);
        expect(scope.slider.max).to.equal(109);
      });

      it('should increment minH/maxH by 1 when LEFT is pressed on maxH', function() {
        slider.maxH.triggerHandler('focus');
        pressKeydown(slider.maxH, 'LEFT');
        expect(scope.slider.min).to.equal(89);
        expect(scope.slider.max).to.equal(109);
      });

      it('should increment minH/maxH by 10% when PAGEUP is pressed on minH', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'PAGEUP');
        expect(scope.slider.min).to.equal(110);
        expect(scope.slider.max).to.equal(130);
      });

      it('should increment minH/maxH by 10% when PAGEUP is pressed on maxH', function() {
        slider.maxH.triggerHandler('focus');
        pressKeydown(slider.maxH, 'PAGEUP');
        expect(scope.slider.min).to.equal(110);
        expect(scope.slider.max).to.equal(130);
      });

      it('should decrement minH/maxH by 10% when PAGEDOWN is pressed on minH', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'PAGEDOWN');
        expect(scope.slider.min).to.equal(70);
        expect(scope.slider.max).to.equal(90);
      });

      it('should decrement minH/maxH by 10% when PAGEDOWN is pressed on maxH', function() {
        slider.maxH.triggerHandler('focus');
        pressKeydown(slider.maxH, 'PAGEDOWN');
        expect(scope.slider.min).to.equal(70);
        expect(scope.slider.max).to.equal(90);
      });

      it('should set minH to min when HOME is pressed on minH', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'HOME');
        expect(scope.slider.min).to.equal(0);
        expect(scope.slider.max).to.equal(20);
      });

      it('should set minH to min when HOME is pressed on maxH', function() {
        slider.maxH.triggerHandler('focus');
        pressKeydown(slider.maxH, 'HOME');
        expect(scope.slider.min).to.equal(0);
        expect(scope.slider.max).to.equal(20);
      });

      it('should set minH to min when END is pressed on minH', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'END');
        expect(scope.slider.min).to.equal(180);
        expect(scope.slider.max).to.equal(200);
      });

      it('should set minH to min when END is pressed on maxH', function() {
        slider.maxH.triggerHandler('focus');
        pressKeydown(slider.maxH, 'END');
        expect(scope.slider.min).to.equal(180);
        expect(scope.slider.max).to.equal(200);
      });
    });

    describe('simple cases for vertical slider - ', function() {
      beforeEach(function() {
        var sliderConf = {
          value: 100,
          options: {
            floor: 0,
            ceil: 200,
            vertical: true
          }
        };
        createSlider(sliderConf);
      });

      it('should increment by 1 when RIGHT is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'RIGHT');
        expect(scope.slider.value).to.equal(101);
      });

      it('should increment by 1 when UP is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'UP');
        expect(scope.slider.value).to.equal(101);
      });

      it('should decrement by 1 when DOWN is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'DOWN');
        expect(scope.slider.value).to.equal(99);
      });

      it('should decrement by 1 when LEFT is pressed', function() {
        slider.minH.triggerHandler('focus');
        pressKeydown(slider.minH, 'LEFT');
        expect(scope.slider.value).to.equal(99);
      });
    });

    it('should not go below floor', function() {
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

    it('should not go above ceil', function() {
      var sliderConf = {
        value: 990,
        options: {
          floor: 0,
          ceil: 1000,
          step: 10
        }
      };
      createSlider(sliderConf);
      slider.minH.triggerHandler('focus');
      pressKeydown(slider.minH, 'PAGEUP');
      expect(scope.slider.value).to.equal(1000);
    });

    it('should not be modified by keyboard if disabled=true', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          disabled: true
        }
      };
      createSlider(sliderConf);
      slider.minH.triggerHandler('focus');
      pressKeydown(slider.minH, 'LEFT');
      expect(scope.slider.value).to.equal(10);
    });

    it('should not be modified by keyboard if readOnly=true', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          readOnly: true
        }
      };
      createSlider(sliderConf);
      slider.minH.triggerHandler('focus');
      pressKeydown(slider.minH, 'LEFT');
      expect(scope.slider.value).to.equal(10);
    });

    it('should not be modified by keyboard if keyboardSupport=false', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          keyboardSupport: false
        }
      };
      createSlider(sliderConf);
      slider.minH.triggerHandler('focus');
      pressKeydown(slider.minH, 'LEFT');
      expect(scope.slider.value).to.equal(10);
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
        'END': 35,
        'SPACE': 32
      };
      var keyCode = keys[key];
      if (oldAPI)
        eent.which = keyCode;
      else event.keyCode = keyCode;
      element.triggerHandler(event);
    }
  });
});
