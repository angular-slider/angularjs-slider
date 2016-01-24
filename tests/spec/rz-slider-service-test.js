'use strict';

describe('rzslider - ', function() {
  var RzSlider,
    RzSliderOptions,
    $rootScope,
    scope,
    $compile,
    $timeout,
    $window,
    $document,
    element,
    parent,
    slider;
  beforeEach(module('rzModule'));
  beforeEach(module('appTemplates'));

  beforeEach(inject(function(_RzSlider_, _RzSliderOptions_, _$rootScope_, _$compile_, _$timeout_, _$window_,
                             _$document_) {
    RzSlider = _RzSlider_;
    RzSliderOptions = _RzSliderOptions_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $timeout = _$timeout_;
    $window = _$window_;
    $document = _$document_;
  }));

  afterEach(function() {
    //simulate to $destroy event to clean everything
    scope.$broadcast('$destroy');
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
      expect(slider.maxH.css('display')).to.equal('none');
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
      expect(slider.maxH.css('display')).to.equal('');
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
        expect(slider.sliderElem.hasClass('vertical')).to.be.false;
      });

      it('vertical slider should take the full height and get correct position/dimension properties', function() {
        scope.$digest();
        scope.slider.options.vertical = true;
        scope.$digest();
        expect(element[0].getBoundingClientRect().height).to.equal(1000);
        expect(slider.positionProperty).to.equal('bottom');
        expect(slider.dimensionProperty).to.equal('height');
        expect(slider.sliderElem.hasClass('vertical')).to.be.true;
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

      it('should set the correct dimension/position for selection bar for single slider with showSelectionBar=true', function() {
        var sliderConf = {
          value: 2,
          options: {
            floor: 0,
            ceil: 10,
            showSelectionBar: true
          }
        };
        createSlider(sliderConf);
        var expectedDimension = slider.valueToOffset(2) + slider.handleHalfDim;
        expect(slider.selBar.css('width')).to.equal(expectedDimension + 'px');
        expect(slider.selBar.css('left')).to.equal('0px');
      });

      it('should set the correct dimension/position for selection bar for single slider with showSelectionBarEnd=true', function() {
        var sliderConf = {
          value: 2,
          options: {
            floor: 0,
            ceil: 10,
            showSelectionBarEnd: true
          }
        };
        createSlider(sliderConf);
        var expectedDimension = slider.valueToOffset(8) + slider.handleHalfDim,
          expectedPosition = slider.valueToOffset(2) + slider.handleHalfDim;
        expect(slider.selBar.css('width')).to.equal(expectedDimension + 'px');
        expect(slider.selBar.css('left')).to.equal(expectedPosition + 'px');
      });

      it('should set the correct background-color on selection bar for single slider', function() {
        var sliderConf = {
          value: 10,
          options: {
            floor: 0,
            ceil: 10,
            showSelectionBar: true,
            getSelectionBarColor: function(v) {
              if (v < 5) return 'red';
              return 'green';
            }
          }
        };
        createSlider(sliderConf);
        var selBarChild = angular.element(slider.selBar[0].querySelector('.rz-selection'));
        expect(selBarChild.css('background-color')).to.equal('green');

        scope.slider.value = 2;
        scope.$digest();
        expect(selBarChild.css('background-color')).to.equal('red');
      });

      it('should set the correct dimension/position for selection bar for range slider', function() {
        var sliderConf = {
          min: 2,
          max: 8,
          options: {
            floor: 0,
            ceil: 10
          }
        };
        createRangeSlider(sliderConf);
        var expectedDimension = slider.valueToOffset(6) + slider.handleHalfDim,
          expectedPosition = slider.valueToOffset(2) + slider.handleHalfDim;
        expect(slider.selBar.css('width')).to.equal(expectedDimension + 'px');
        expect(slider.selBar.css('left')).to.equal(expectedPosition + 'px');
      });

      it('should set the correct background-color on selection bar for range slider', function() {
        var sliderConf = {
          min: 2,
          max: 8,
          options: {
            floor: 0,
            ceil: 10,
            getSelectionBarColor: function(min, max) {
              if (max - min < 5) return 'red';
              return 'green';
            }
          }
        };
        createRangeSlider(sliderConf);
        var selBarChild = angular.element(slider.selBar[0].querySelector('.rz-selection'));
        expect(selBarChild.css('background-color')).to.equal('green');

        scope.slider.min = 4;
        scope.slider.max = 6;
        scope.$digest();
        expect(selBarChild.css('background-color')).to.equal('red');
      });

      it('should call the correct callback for onStart', function() {
        var sliderConf = {
          value: 10,
          options: {
            id: 'test',
            onStart: sinon.spy()
          }
        };
        createSlider(sliderConf);

        slider.callOnStart();
        $timeout.flush();
        sliderConf.options.onStart.calledWith('test').should.be.true;
      });

      it('should call the correct callback for onChange', function() {
        var sliderConf = {
          value: 10,
          options: {
            id: 'test',
            onChange: sinon.spy()
          }
        };
        createSlider(sliderConf);

        slider.callOnChange();
        $timeout.flush();
        sliderConf.options.onChange.calledWith('test').should.be.true;
      });

      it('should call the correct callback for onEnd', function() {
        var sliderConf = {
          value: 10,
          options: {
            id: 'test',
            onEnd: sinon.spy()
          }
        };
        createSlider(sliderConf);

        slider.callOnEnd();
        $timeout.flush();
        sliderConf.options.onEnd.calledWith('test').should.be.true;
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

    it('should set the correct class to true when draggableRange is true', function() {
      scope.slider.options.draggableRange = true;
      scope.$digest();
      expect(slider.selBar.hasClass('rz-draggable')).to.be.true;
    });

    it('should set draggableRange to true when draggableRangeOnly is true', function() {
      scope.slider.options.draggableRangeOnly = true;
      scope.$digest();
      expect(slider.options.draggableRange).to.be.true;
      expect(slider.selBar.hasClass('rz-draggable')).to.be.true;
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
   Accessibility
   ******************************************************************************
   */
  describe('accessibility - ', function() {
    it('should have accessible horizontal single slider', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          step: 10
        }
      };
      createSlider(sliderConf);
      expect(slider.minH.attr('role')).to.equal('slider');
      expect(slider.minH.attr('tabindex')).to.equal('0');
      expect(slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(slider.minH.attr('aria-valuemax')).to.equal('100');

      scope.slider.value = 20;
      scope.$digest();
      expect(slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(slider.minH.attr('aria-valuetext')).to.equal('20');
    });

    it('should have accessible vertical single slider', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          vertical: true
        }
      };
      createSlider(sliderConf);
      expect(slider.minH.attr('role')).to.equal('slider');
      expect(slider.minH.attr('tabindex')).to.equal('0');
      expect(slider.minH.attr('aria-orientation')).to.equal('vertical');
      expect(slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(slider.minH.attr('aria-valuemax')).to.equal('100');

      scope.slider.value = 20;
      scope.$digest();
      expect(slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(slider.minH.attr('aria-valuetext')).to.equal('20');
    });

    it('should have accessible horizontal range slider', function() {
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
      expect(slider.minH.attr('role')).to.equal('slider');
      expect(slider.minH.attr('tabindex')).to.equal('0');
      expect(slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(slider.minH.attr('aria-valuemax')).to.equal('100');
      expect(slider.maxH.attr('role')).to.equal('slider');
      expect(slider.maxH.attr('tabindex')).to.equal('0');
      expect(slider.maxH.attr('aria-valuenow')).to.equal('90');
      expect(slider.maxH.attr('aria-valuetext')).to.equal('90');
      expect(slider.maxH.attr('aria-valuemin')).to.equal('0');
      expect(slider.maxH.attr('aria-valuemax')).to.equal('100');

      scope.slider.min = 20;
      scope.$digest();
      expect(slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(slider.minH.attr('aria-valuetext')).to.equal('20');

      scope.slider.max = 80;
      scope.$digest();
      expect(slider.maxH.attr('aria-valuenow')).to.equal('80');
      expect(slider.maxH.attr('aria-valuetext')).to.equal('80');
    });

    it('should have accessible vertical range slider', function() {
      var sliderConf = {
        min: 10,
        max: 90,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          vertical: true
        }
      };
      createRangeSlider(sliderConf);
      expect(slider.minH.attr('role')).to.equal('slider');
      expect(slider.minH.attr('tabindex')).to.equal('0');
      expect(slider.minH.attr('aria-orientation')).to.equal('vertical');
      expect(slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(slider.minH.attr('aria-valuemax')).to.equal('100');
      expect(slider.maxH.attr('role')).to.equal('slider');
      expect(slider.maxH.attr('tabindex')).to.equal('0');
      expect(slider.maxH.attr('aria-orientation')).to.equal('vertical');
      expect(slider.maxH.attr('aria-valuenow')).to.equal('90');
      expect(slider.maxH.attr('aria-valuetext')).to.equal('90');
      expect(slider.maxH.attr('aria-valuemin')).to.equal('0');
      expect(slider.maxH.attr('aria-valuemax')).to.equal('100');

      scope.slider.min = 20;
      scope.$digest();
      expect(slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(slider.minH.attr('aria-valuetext')).to.equal('20');

      scope.slider.max = 80;
      scope.$digest();
      expect(slider.maxH.attr('aria-valuenow')).to.equal('80');
      expect(slider.maxH.attr('aria-valuetext')).to.equal('80');
    });

    it('should have accessible horizontal single slider when keyboardSupport is false', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          keyboardSupport: false
        }
      };
      createSlider(sliderConf);
      expect(slider.minH.attr('role')).to.equal('slider');
      expect(slider.minH.attr('tabindex')).to.equal('');
      expect(slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(slider.minH.attr('aria-valuemax')).to.equal('100');

      scope.slider.value = 20;
      scope.$digest();
      expect(slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(slider.minH.attr('aria-valuetext')).to.equal('20');
    });

    it('should have accessible horizontal range slider when keyboardSupport is false', function() {
      var sliderConf = {
        min: 10,
        max: 90,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          keyboardSupport: false
        }
      };
      createRangeSlider(sliderConf);
      expect(slider.minH.attr('role')).to.equal('slider');
      expect(slider.minH.attr('tabindex')).to.equal('');
      expect(slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(slider.minH.attr('aria-valuemax')).to.equal('100');
      expect(slider.maxH.attr('role')).to.equal('slider');
      expect(slider.maxH.attr('tabindex')).to.equal('');
      expect(slider.maxH.attr('aria-valuenow')).to.equal('90');
      expect(slider.maxH.attr('aria-valuetext')).to.equal('90');
      expect(slider.maxH.attr('aria-valuemin')).to.equal('0');
      expect(slider.maxH.attr('aria-valuemax')).to.equal('100');

      scope.slider.min = 20;
      scope.$digest();
      expect(slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(slider.minH.attr('aria-valuetext')).to.equal('20');

      scope.slider.max = 80;
      scope.$digest();
      expect(slider.maxH.attr('aria-valuenow')).to.equal('80');
      expect(slider.maxH.attr('aria-valuetext')).to.equal('80');
    });

    it('should have accessible slider when values are text', function() {
      var sliderConf = {
        value: 1,
        options: {
          stepsArray: ['A', 'B', 'C']
        }
      };
      createSlider(sliderConf);
      expect(slider.minH.attr('role')).to.equal('slider');
      expect(slider.minH.attr('tabindex')).to.equal('0');
      expect(slider.minH.attr('aria-valuenow')).to.equal('1');
      expect(slider.minH.attr('aria-valuetext')).to.equal('B');
      expect(slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(slider.minH.attr('aria-valuemax')).to.equal('2');

      scope.slider.value = 2;
      scope.$digest();
      expect(slider.minH.attr('aria-valuenow')).to.equal('2');
      expect(slider.minH.attr('aria-valuetext')).to.equal('C');
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
   HELPER FUNCTIONS
   ******************************************************************************
   */
  describe('helper functions - ', function() {
    beforeEach(function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10
        }
      };
      createSlider(sliderConf);
    });

    it('should have a valid roundStep for integer values', function() {
      expect(slider.roundStep(10)).to.equal(10);
      expect(slider.roundStep(9)).to.equal(10);
      expect(slider.roundStep(11)).to.equal(10);
      expect(slider.roundStep(15)).to.equal(20);
      expect(slider.roundStep(14)).to.equal(10);
      expect(slider.roundStep(-10)).to.equal(-10);
      expect(slider.roundStep(-9)).to.equal(-10);
      expect(slider.roundStep(-11)).to.equal(-10);
      expect(slider.roundStep(-16)).to.equal(-20);
      expect(slider.roundStep(-15)).to.equal(-10);
      expect(slider.roundStep(-14)).to.equal(-10);
    });

    it('should have a valid roundStep for floating values', function() {
      scope.slider.options.precision = 1;
      scope.slider.options.step = 0.1;
      scope.$digest();

      expect(slider.roundStep(10)).to.equal(10);
      expect(slider.roundStep(1.1)).to.equal(1.1);
      expect(slider.roundStep(1.09)).to.equal(1.1);
      expect(slider.roundStep(1.11)).to.equal(1.1);
      expect(slider.roundStep(1.15)).to.equal(1.2);
      expect(slider.roundStep(1.14)).to.equal(1.1);

      expect(slider.roundStep(-10)).to.equal(-10);
      expect(slider.roundStep(-1.1)).to.equal(-1.1);
      expect(slider.roundStep(-1.09)).to.equal(-1.1);
      expect(slider.roundStep(-1.11)).to.equal(-1.1);
      expect(slider.roundStep(-1.16)).to.equal(-1.2);
      expect(slider.roundStep(-1.15)).to.equal(-1.1);
      expect(slider.roundStep(-1.14)).to.equal(-1.1);
    });

    it('should have a valid hideEl', function() {
      var el = angular.element('<div></div>');
      slider.hideEl(el);
      expect(el.css('opacity')).to.equal('0');
    });

    it('should have a valid showEl when not rzAlwaysHide', function() {
      var el = angular.element('<div></div>');
      slider.showEl(el);
      expect(el.css('opacity')).to.equal('1');
    });

    it('should have a valid showEl when rzAlwaysHide', function() {
      var el = angular.element('<div></div>');
      el.css('opacity', 0);
      el.rzAlwaysHide = true;

      slider.showEl(el);
      expect(el.css('opacity')).to.equal('0');
    });

    it('should have a valid setPosition for horizontal sliders', function() {
      var el = angular.element('<div></div>');
      slider.setPosition(el, 12);
      expect(el.css('left')).to.equal('12px');
    });

    it('should have a valid setPosition for vertical sliders', function() {
      scope.slider.options.vertical = true;
      scope.$digest();
      var el = angular.element('<div></div>');
      slider.setPosition(el, 12);
      expect(el.css('bottom')).to.equal('12px');
    });

    it('should have a valid getDimension for horizontal sliders', function() {
      expect(slider.getDimension(slider.sliderElem)).to.equal(1000);
    });

    it('should have a valid getDimension for horizontal sliders with custom scale', function() {
      scope.slider.options.scale = 2;
      scope.$digest();
      expect(slider.getDimension(slider.sliderElem)).to.equal(2000);
    });

    it('should have a valid getDimension for vertical sliders', function() {
      scope.slider.options.vertical = true;
      scope.$digest();
      expect(slider.getDimension(slider.sliderElem)).to.equal(1000);
    });

    it('should have a valid getDimension for vertical sliders with custom scale', function() {
      scope.slider.options.scale = 2;
      scope.slider.options.vertical = true;
      scope.$digest();
      expect(slider.getDimension(slider.sliderElem)).to.equal(2000);
    });

    it('should have a valid setDimension for horizontal sliders', function() {
      var el = angular.element('<div></div>');
      slider.setDimension(el, 12);
      expect(el.css('width')).to.equal('12px');
    });

    it('should have a valid setDimension for vertical sliders', function() {
      scope.slider.options.vertical = true;
      scope.$digest();
      var el = angular.element('<div></div>');
      slider.setDimension(el, 12);
      expect(el.css('height')).to.equal('12px');
    });

    it('should have a valid valueToOffset for positive sliders', function() {
      slider.maxPos = 1000;
      expect(slider.valueToOffset(0)).to.equal(0);
      expect(slider.valueToOffset(50)).to.equal(500);
      expect(slider.valueToOffset(100)).to.equal(1000);
    });

    it('should have a valid valueToOffset for negative sliders', function() {
      scope.slider.options.floor = -100;
      scope.slider.options.ceil = 0;
      scope.slider.value = -50;
      scope.$digest();

      slider.maxPos = 1000;
      expect(slider.valueToOffset(0)).to.equal(1000);
      expect(slider.valueToOffset(-50)).to.equal(500);
      expect(slider.valueToOffset(-100)).to.equal(0);
    });

    it('should have a valid sanitizeValue', function() {
      expect(slider.sanitizeValue(0)).to.equal(0);
      expect(slider.sanitizeValue(50)).to.equal(50);
      expect(slider.sanitizeValue(100)).to.equal(100);
      expect(slider.sanitizeValue(-1)).to.equal(0);
      expect(slider.sanitizeValue(-10)).to.equal(0);
      expect(slider.sanitizeValue(101)).to.equal(100);
      expect(slider.sanitizeValue(110)).to.equal(100);
    });

    it('should have a valid offsetToValue for positive sliders', function() {
      slider.maxPos = 1000;
      expect(slider.offsetToValue(0)).to.equal(0);
      expect(slider.offsetToValue(1000)).to.equal(100);
      expect(slider.offsetToValue(500)).to.equal(50);
    });

    it('should have a valid offsetToValue for for negative sliders', function() {
      scope.slider.options.floor = -100;
      scope.slider.options.ceil = 0;
      scope.slider.value = -50;
      scope.$digest();
      slider.maxPos = 1000;

      expect(slider.offsetToValue(0)).to.equal(-100);
      expect(slider.offsetToValue(1000)).to.equal(0);
      expect(slider.offsetToValue(500)).to.equal(-50);
    });

    it('should have a valid getEventXY for horizontal sliders on desktop browsers', function() {
      var event = {
        clientX: 12
      };
      expect(slider.getEventXY(event)).to.equal(12);
    });

    it('should have a valid getEventXY for vertical sliders on desktop browsers', function() {
      scope.slider.options.vertical = true;
      scope.$digest();
      var event = {
        clientY: 12
      };
      expect(slider.getEventXY(event)).to.equal(12);
    });

    it('should have a valid getEventXY for horizontal sliders on mobile browsers with no originalEvent', function() {
      var event = {
        touches: [{
          clientX: 12
        }]
      };
      expect(slider.getEventXY(event)).to.equal(12);
    });

    it('should have a valid getEventXY for horizontal sliders on mobile browsers with originalEvent', function() {
      var event = {
        originalEvent: {
          touches: [{
            clientX: 12
          }]
        }
      };
      expect(slider.getEventXY(event)).to.equal(12);
    });

    it('should have a valid getEventXY for vertical sliders on mobile browsers with no originalEvent', function() {
      scope.slider.options.vertical = true;
      scope.$digest();
      var event = {
        touches: [{
          clientY: 12
        }]
      };
      expect(slider.getEventXY(event)).to.equal(12);
    });

    it('should have a valid getEventXY for vertical sliders on mobile browsers with originalEvent', function() {
      scope.slider.options.vertical = true;
      scope.$digest();
      var event = {
        originalEvent: {
          touches: [{
            clientY: 12
          }]
        }
      };
      expect(slider.getEventXY(event)).to.equal(12);
    });

    it('should have a valid getEventPosition for horizontal sliders', function() {
      sinon.stub(slider, 'getEventXY').returns(46);
      var event = {};

      //fake slider's dimension
      slider.sliderElem.rzsp = 10;
      slider.handleHalfDim = 16;

      expect(slider.getEventPosition(event)).to.equal(20);
    });

    it('should have a valid getEventPosition for vertical sliders', function() {
      scope.slider.options.vertical = true;
      scope.$digest();
      sinon.stub(slider, 'getEventXY').returns(46);
      var event = {};

      //fake slider's dimension
      slider.sliderElem.rzsp = 10;
      slider.handleHalfDim = 16;

      expect(slider.getEventPosition(event)).to.equal(-52);
    });

    it('should have a valid getEventPosition for horizontal sliders with scale option', function() {
      scope.slider.options.scale = 0.5;
      scope.$digest();
      sinon.stub(slider, 'getEventXY').returns(46);
      var event = {};

      //fake slider's dimension
      slider.sliderElem.rzsp = 10;
      slider.handleHalfDim = 16;

      expect(slider.getEventPosition(event)).to.equal(10);
    });

    it('should have a valid getEventPosition for vertical sliders with scale option', function() {
      scope.slider.options.scale = 0.5;
      scope.slider.options.vertical = true;
      scope.$digest();
      sinon.stub(slider, 'getEventXY').returns(46);
      var event = {};

      //fake slider's dimension
      slider.sliderElem.rzsp = 10;
      slider.handleHalfDim = 16;

      expect(slider.getEventPosition(event)).to.equal(-26);
    });

    it('should have a valid getEventNames for desktop', function() {
      var event = {
        clientX: 10,
        clientY: 100
      };
      var eventNames = slider.getEventNames(event);
      expect(eventNames).to.deep.equal({
        moveEvent: 'mousemove',
        endEvent: 'mouseup'
      });
    });

    it('should have a valid getEventNames for mobile with new API', function() {
      var event = {
        touches: [{
          clientX: 10,
          clientY: 100
        }]
      };
      var eventNames = slider.getEventNames(event);
      expect(eventNames).to.deep.equal({
        moveEvent: 'touchmove',
        endEvent: 'touchend'
      });
    });

    it('should have a valid getEventNames for mobile with old API', function() {
      var event = {
        originalEvent: {
          touches: [{
            clientX: 10,
            clientY: 100
          }]
        }
      };
      var eventNames = slider.getEventNames(event);
      expect(eventNames).to.deep.equal({
        moveEvent: 'touchmove',
        endEvent: 'touchend'
      });
    });

    it('should have a valid getNearestHandle for single sliders', function() {
      sinon.stub(slider, 'getEventPosition').returns(46);
      var event = {};
      expect(slider.getNearestHandle(event)).to.equal(slider.minH);
    });

    it('should have a valid focusElement', function() {
      var el = [{
        focus: sinon.spy()
      }];
      slider.focusElement(el);
      el[0].focus.called.should.be.true;
    });
  });

  it('should have a valid getNearestHandle for range sliders when click is near minH', function() {
    var sliderConf = {
      min: 20,
      max: 80,
      options: {
        floor: 0,
        ceil: 100,
        step: 10
      }
    };
    createRangeSlider(sliderConf);
    sinon.stub(slider, 'getEventPosition').returns(46);

    //fake slider's dimension
    slider.minH.rzsp = 0;
    slider.maxH.rzsp = 100;

    var event = {};
    expect(slider.getNearestHandle(event)).to.equal(slider.minH);
  });

  it('should have a valid getNearestHandle for range sliders when click is near maxH', function() {
    var sliderConf = {
      min: 20,
      max: 80,
      options: {
        floor: 0,
        ceil: 100,
        step: 10
      }
    };
    createRangeSlider(sliderConf);
    sinon.stub(slider, 'getEventPosition').returns(66);

    //fake slider's dimension
    slider.minH.rzsp = 0;
    slider.maxH.rzsp = 100;

    var event = {};
    expect(slider.getNearestHandle(event)).to.equal(slider.maxH);
  });

  it('should have a bindEvents that bind correct events for single sliders on desktop', function() {
    var sliderConf = {
      value: 50,
      options: {
        floor: 0,
        ceil: 100,
        step: 10
      }
    };
    createSlider(sliderConf);
    slider.onStart = sinon.spy();
    slider.onMove = sinon.spy();
    slider.onPointerFocus = sinon.spy();

    slider.unbindEvents(); //remove previously bound events
    slider.bindEvents();

    slider.selBar.triggerHandler('mousedown');
    expect(slider.onStart.callCount).to.equal(1);
    expect(slider.onMove.callCount).to.equal(1);

    slider.minH.triggerHandler('mousedown');
    expect(slider.onStart.callCount).to.equal(2);
    expect(slider.onMove.callCount).to.equal(1);

    slider.maxH.triggerHandler('mousedown');
    expect(slider.onStart.callCount).to.equal(2);
    expect(slider.onMove.callCount).to.equal(1);

    slider.fullBar.triggerHandler('mousedown');
    expect(slider.onStart.callCount).to.equal(3);
    expect(slider.onMove.callCount).to.equal(2);

    slider.ticks.triggerHandler('mousedown');
    expect(slider.onStart.callCount).to.equal(4);
    expect(slider.onMove.callCount).to.equal(3);

    slider.minH.triggerHandler('focus');
    expect(slider.onPointerFocus.callCount).to.equal(1);
    slider.maxH.triggerHandler('focus');
    expect(slider.onPointerFocus.callCount).to.equal(1);
  });

  it('should have a bindEvents that bind correct events for single sliders on mobile', function() {
    var sliderConf = {
      value: 50,
      options: {
        floor: 0,
        ceil: 100,
        step: 10
      }
    };
    createSlider(sliderConf);
    slider.onStart = sinon.spy();
    slider.onMove = sinon.spy();
    slider.onPointerFocus = sinon.spy();

    slider.unbindEvents(); //remove previously bound events
    slider.bindEvents();

    slider.selBar.triggerHandler('touchstart');
    expect(slider.onStart.callCount).to.equal(1);
    expect(slider.onMove.callCount).to.equal(1);

    slider.minH.triggerHandler('touchstart');
    expect(slider.onStart.callCount).to.equal(2);
    expect(slider.onMove.callCount).to.equal(1);

    slider.maxH.triggerHandler('touchstart');
    expect(slider.onStart.callCount).to.equal(2);
    expect(slider.onMove.callCount).to.equal(1);

    slider.fullBar.triggerHandler('touchstart');
    expect(slider.onStart.callCount).to.equal(3);
    expect(slider.onMove.callCount).to.equal(2);

    slider.ticks.triggerHandler('touchstart');
    expect(slider.onStart.callCount).to.equal(4);
    expect(slider.onMove.callCount).to.equal(3);
  });

  it('should have a bindEvents that bind correct events for range sliders on desktop', function() {
    var sliderConf = {
      min: 20,
      max: 80,
      options: {
        floor: 0,
        ceil: 100,
        step: 10
      }
    };
    createRangeSlider(sliderConf);
    slider.onStart = sinon.spy();
    slider.onMove = sinon.spy();
    slider.onPointerFocus = sinon.spy();

    slider.unbindEvents(); //remove previously bound events
    slider.bindEvents();

    slider.selBar.triggerHandler('mousedown');
    expect(slider.onStart.callCount).to.equal(1);
    expect(slider.onMove.callCount).to.equal(1);

    slider.minH.triggerHandler('mousedown');
    expect(slider.onStart.callCount).to.equal(2);
    expect(slider.onMove.callCount).to.equal(1);

    slider.maxH.triggerHandler('mousedown');
    expect(slider.onStart.callCount).to.equal(3);
    expect(slider.onMove.callCount).to.equal(1);

    slider.fullBar.triggerHandler('mousedown');
    expect(slider.onStart.callCount).to.equal(4);
    expect(slider.onMove.callCount).to.equal(2);

    slider.ticks.triggerHandler('mousedown');
    expect(slider.onStart.callCount).to.equal(5);
    expect(slider.onMove.callCount).to.equal(3);

    slider.minH.triggerHandler('focus');
    expect(slider.onPointerFocus.callCount).to.equal(1);
    slider.maxH.triggerHandler('focus');
    expect(slider.onPointerFocus.callCount).to.equal(2);
  });

  it('should have a bindEvents that bind correct events for range sliders on mobile', function() {
    var sliderConf = {
      min: 20,
      max: 80,
      options: {
        floor: 0,
        ceil: 100,
        step: 10
      }
    };
    createRangeSlider(sliderConf);
    slider.onStart = sinon.spy();
    slider.onMove = sinon.spy();
    slider.onPointerFocus = sinon.spy();

    slider.unbindEvents(); //remove previously bound events
    slider.bindEvents();

    slider.selBar.triggerHandler('touchstart');
    expect(slider.onStart.callCount).to.equal(1);
    expect(slider.onMove.callCount).to.equal(1);

    slider.minH.triggerHandler('touchstart');
    expect(slider.onStart.callCount).to.equal(2);
    expect(slider.onMove.callCount).to.equal(1);

    slider.maxH.triggerHandler('touchstart');
    expect(slider.onStart.callCount).to.equal(3);
    expect(slider.onMove.callCount).to.equal(1);

    slider.fullBar.triggerHandler('touchstart');
    expect(slider.onStart.callCount).to.equal(4);
    expect(slider.onMove.callCount).to.equal(2);

    slider.ticks.triggerHandler('touchstart');
    expect(slider.onStart.callCount).to.equal(5);
    expect(slider.onMove.callCount).to.equal(3);
  });

  it('should have a unbindEvents that unbind all events', function() {
    var sliderConf = {
      min: 20,
      max: 80,
      options: {
        floor: 0,
        ceil: 100,
        step: 10
      }
    };
    createRangeSlider(sliderConf);
    slider.onStart = sinon.spy();
    slider.onMove = sinon.spy();
    slider.onPointerFocus = sinon.spy();

    slider.unbindEvents(); //remove previously bound events
    slider.bindEvents();
    slider.unbindEvents();

    slider.selBar.triggerHandler('mousedown');
    slider.minH.triggerHandler('mousedown');
    slider.maxH.triggerHandler('mousedown');
    slider.fullBar.triggerHandler('mousedown');
    slider.ticks.triggerHandler('mousedown');
    slider.minH.triggerHandler('focus');
    expect(slider.onStart.callCount).to.equal(0);
    expect(slider.onMove.callCount).to.equal(0);
    expect(slider.onPointerFocus.callCount).to.equal(0);
  });

  /*
   ******************************************************************************
   MOUSE CONTROLS
   ******************************************************************************
   */
  describe('mouse controls - ', function() {

    describe('single horizontal slider - ', function() {
      beforeEach(function() {
        var sliderConf = {
          value: 0,
          options: {
            floor: 0,
            ceil: 100
          }
        };
        createSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        fireMouseup();
      });

      it('should handle mousedown on minH correctly when keyboardSupport is true', function() {
        sinon.spy(slider, 'calcViewDimensions');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'focusElement');

        var event = fireMousedown(slider.minH, 0);

        slider.calcViewDimensions.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.focusElement.calledWith(slider.minH).should.be.true;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(slider.tracking).to.equal('rzSliderModel');
        expect(slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on minH correctly when keyboardSupport is false', function() {
        scope.slider.options.keyboardSupport = false;
        scope.$digest();

        sinon.spy(slider, 'calcViewDimensions');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'focusElement');

        var event = fireMousedown(slider.minH, 0);

        slider.calcViewDimensions.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.focusElement.called.should.be.false;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(slider.tracking).to.equal('rzSliderModel');
        expect(slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is on the middle', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnChange');
        var event = fireMousedown(slider.minH, 0);
        var expectedValue = 50,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;
        fireMousemove(offset);
        expect(scope.slider.value).to.equal(expectedValue);
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is before the slider and previous value was already 0', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        var event = fireMousedown(slider.minH, 0);
        fireMousemove(-100);
        expect(scope.slider.value).to.equal(0);
        slider.positionTrackingHandle.called.should.be.false;
      });

      it('should handle click and drag on minH correctly when mouse is before the slider and previous value was different than 0', function() {
        scope.slider.value = 50;
        scope.$digest();

        sinon.spy(slider, 'positionTrackingHandle');
        var event = fireMousedown(slider.minH, 0);
        fireMousemove(-100);
        expect(scope.slider.value).to.equal(0);
        slider.positionTrackingHandle.called.should.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is after the slider and previous value was different than 100', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        var event = fireMousedown(slider.minH, 0);
        fireMousemove(slider.maxPos + 100);
        expect(scope.slider.value).to.equal(100);
        slider.positionTrackingHandle.called.should.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is after the slider and previous value was already 100', function() {
        scope.slider.value = 100;
        scope.$digest();

        sinon.spy(slider, 'positionTrackingHandle');
        var event = fireMousedown(slider.minH, 0);
        fireMousemove(slider.maxPos + 100);
        expect(scope.slider.value).to.equal(100);
        slider.positionTrackingHandle.called.should.be.false;
      });

      it('should call correct callbacks on slider end and keep handle focused when keyboardSupport is true', function() {
        var event = fireMousedown(slider.minH, 0);

        sinon.spy(slider, 'callOnEnd');
        sinon.spy(slider.scope, '$emit');
        fireMouseup();

        expect(slider.tracking).to.equal('rzSliderModel');
        expect(slider.minH.hasClass('rz-active')).to.be.true;
        slider.callOnEnd.called.should.be.true;
        slider.scope.$emit.calledWith('slideEnded').should.be.true;
      });

      it('should call correct callbacks on slider end and not keep handle focused when keyboardSupport is false', function() {
        scope.slider.options.keyboardSupport = false;
        scope.$digest();
        var event = fireMousedown(slider.minH, 0);

        sinon.spy(slider, 'callOnEnd');
        sinon.spy(slider.scope, '$emit');

        fireMouseup();

        expect(slider.tracking).to.equal('');
        expect(slider.minH.hasClass('rz-active')).to.be.false;
        slider.callOnEnd.called.should.be.true;
        slider.scope.$emit.calledWith('slideEnded').should.be.true;
      });

      it('should handle click on fullbar and move minH', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');

        var expectedValue = 12,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;

        var event = fireMousedown(slider.fullBar, offset);

        expect(scope.slider.value).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderModel');
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move minH', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');

        var expectedValue = 12,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;

        var event = fireMousedown(slider.selBar, offset);

        expect(scope.slider.value).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderModel');
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click on ticks and move minH', function() {
        scope.slider.options.step = 10;
        scope.slider.options.showTicks = true;
        scope.$digest();
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');

        var expectedValue = 10,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;

        fireMousedown(slider.ticks, offset);

        expect(scope.slider.value).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderModel');
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });
    });

    describe('range horizontal slider - ', function() {
      beforeEach(function() {
        var sliderConf = {
          min: 0,
          max: 100,
          options: {
            floor: 0,
            ceil: 100
          }
        };
        createRangeSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        fireMouseup();
      });

      it('should handle mousedown on minH correctly when keyboardSupport is true', function() {
        sinon.spy(slider, 'calcViewDimensions');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'focusElement');

        var event = fireMousedown(slider.minH, 0);

        slider.calcViewDimensions.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.focusElement.calledWith(slider.minH).should.be.true;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(slider.tracking).to.equal('rzSliderModel');
        expect(slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on minH correctly when keyboardSupport is false', function() {
        scope.slider.options.keyboardSupport = false;
        scope.$digest();

        sinon.spy(slider, 'calcViewDimensions');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'focusElement');

        var event = fireMousedown(slider.minH, 0);

        slider.calcViewDimensions.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.focusElement.called.should.be.false;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(slider.tracking).to.equal('rzSliderModel');
        expect(slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on maxH correctly when keyboardSupport is true', function() {
        sinon.spy(slider, 'calcViewDimensions');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'focusElement');

        var event = fireMousedown(slider.maxH, 0);

        slider.calcViewDimensions.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.focusElement.calledWith(slider.maxH).should.be.true;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(slider.tracking).to.equal('rzSliderHigh');
        expect(slider.maxH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on maxH correctly when keyboardSupport is false', function() {
        scope.slider.options.keyboardSupport = false;
        scope.$digest();

        sinon.spy(slider, 'calcViewDimensions');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'focusElement');

        var event = fireMousedown(slider.maxH, 0);

        slider.calcViewDimensions.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.focusElement.called.should.be.false;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(slider.tracking).to.equal('rzSliderHigh');
        expect(slider.maxH.hasClass('rz-active')).to.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is on the middle', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnChange');
        var event = fireMousedown(slider.minH, 0);
        var expectedValue = 50,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;
        fireMousemove(offset);
        expect(scope.slider.min).to.equal(expectedValue);
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on maxH correctly when mouse is on the middle', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnChange');
        var event = fireMousedown(slider.maxH, 0);
        var expectedValue = 50,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;
        fireMousemove(offset);
        expect(scope.slider.max).to.equal(expectedValue);
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on minH and switch min/max if needed', function() {
        scope.slider.min = 40;
        scope.slider.max = 60;
        scope.$digest();

        var event = fireMousedown(slider.minH, 0);
        var expectedValue = 80,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;
        fireMousemove(offset);

        expect(scope.slider.min).to.equal(60);
        expect(scope.slider.max).to.equal(80);
      });

      it('should handle click and drag on maxH and switch min/max if needed', function() {
        scope.slider.min = 40;
        scope.slider.max = 60;
        scope.$digest();

        var event = fireMousedown(slider.maxH, 0);
        var expectedValue = 20,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;
        fireMousemove(offset);

        expect(scope.slider.min).to.equal(20);
        expect(scope.slider.max).to.equal(40);
      });

      it('should handle click on fullbar and move minH when click pos is nearer to minH', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');
        sinon.spy(slider, 'focusElement');

        var expectedValue = 10,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;

        var event = fireMousedown(slider.fullBar, offset);

        expect(scope.slider.min).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderModel');
        slider.focusElement.calledWith(slider.minH).should.be.true;
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click on fullbar and move maxH when click pos is nearer to maxH', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');
        sinon.spy(slider, 'focusElement');

        var expectedValue = 90,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;

        var event = fireMousedown(slider.fullBar, offset);

        expect(scope.slider.max).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderHigh');
        slider.focusElement.calledWith(slider.maxH).should.be.true;
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move minH when click pos is nearer to minH', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');
        sinon.spy(slider, 'focusElement');

        var expectedValue = 10,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;

        var event = fireMousedown(slider.selBar, offset);

        expect(scope.slider.min).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderModel');
        slider.focusElement.calledWith(slider.minH).should.be.true;
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move maxH when click pos is nearer to maxH', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');
        sinon.spy(slider, 'focusElement');

        var expectedValue = 90,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;

        var event = fireMousedown(slider.selBar, offset);

        expect(scope.slider.max).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderHigh');
        slider.focusElement.calledWith(slider.maxH).should.be.true;
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });
    });

    describe('single vertical slider - ', function() {
      beforeEach(function() {
        var sliderConf = {
          value: 0,
          options: {
            floor: 0,
            ceil: 100,
            vertical: true
          }
        };
        createSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        fireMouseup();
      });

      it('should handle mousedown on minH correctly when keyboardSupport is true', function() {
        sinon.spy(slider, 'calcViewDimensions');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'focusElement');

        var event = fireMousedown(slider.minH, 0, true);

        slider.calcViewDimensions.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.focusElement.calledWith(slider.minH).should.be.true;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(slider.tracking).to.equal('rzSliderModel');
        expect(slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on minH correctly when keyboardSupport is false', function() {
        scope.slider.options.keyboardSupport = false;
        scope.$digest();

        sinon.spy(slider, 'calcViewDimensions');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'focusElement');

        var event = fireMousedown(slider.minH, 0, true);

        slider.calcViewDimensions.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.focusElement.called.should.be.false;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(slider.tracking).to.equal('rzSliderModel');
        expect(slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is on the middle', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnChange');
        fireMousedown(slider.minH, 0, true);

        var expectedValue = 50,
          offset = slider.sliderElem.rzsp - slider.valueToOffset(expectedValue) - slider.handleHalfDim;

        fireMousemove(offset, true);
        expect(scope.slider.value).to.equal(expectedValue);
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is before the slider and previous value was already 0', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        fireMousedown(slider.minH, 0, true);
        fireMousemove(slider.maxPos + 100, true);
        expect(scope.slider.value).to.equal(0);
        slider.positionTrackingHandle.called.should.be.false;
      });

      it('should handle click and drag on minH correctly when mouse is before the slider and previous value was different than 0', function() {
        scope.slider.value = 50;
        scope.$digest();

        sinon.spy(slider, 'positionTrackingHandle');
        var event = fireMousedown(slider.minH, 0, true);
        fireMousemove(slider.maxPos + 100, true);
        expect(scope.slider.value).to.equal(0);
        slider.positionTrackingHandle.called.should.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is after the slider and previous value was different than 100', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        var event = fireMousedown(slider.minH, 0, true);
        fireMousemove(-100, true);
        expect(scope.slider.value).to.equal(100);
        slider.positionTrackingHandle.called.should.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is after the slider and previous value was already 100', function() {
        scope.slider.value = 100;
        scope.$digest();

        sinon.spy(slider, 'positionTrackingHandle');
        var event = fireMousedown(slider.minH, 0, true);
        fireMousemove(-100, true);
        expect(scope.slider.value).to.equal(100);
        slider.positionTrackingHandle.called.should.be.false;
      });

      it('should call correct callbacks on slider end and keep handle focused when keyboardSupport is true', function() {
        var event = fireMousedown(slider.minH, 0, true);

        sinon.spy(slider, 'callOnEnd');
        sinon.spy(slider.scope, '$emit');
        fireMouseup();

        expect(slider.tracking).to.equal('rzSliderModel');
        expect(slider.minH.hasClass('rz-active')).to.be.true;
        slider.callOnEnd.called.should.be.true;
        slider.scope.$emit.calledWith('slideEnded').should.be.true;
      });

      it('should call correct callbacks on slider end and not keep handle focused when keyboardSupport is false', function() {
        scope.slider.options.keyboardSupport = false;
        scope.$digest();
        var event = fireMousedown(slider.minH, 0, true);

        sinon.spy(slider, 'callOnEnd');
        sinon.spy(slider.scope, '$emit');

        fireMouseup();

        expect(slider.tracking).to.equal('');
        expect(slider.minH.hasClass('rz-active')).to.be.false;
        slider.callOnEnd.called.should.be.true;
        slider.scope.$emit.calledWith('slideEnded').should.be.true;
      });

      it('should handle click on fullbar and move minH', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');

        var expectedValue = 50,
          offset = slider.sliderElem.rzsp - slider.valueToOffset(expectedValue) - slider.handleHalfDim;

        var event = fireMousedown(slider.fullBar, offset, true);

        expect(scope.slider.value).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderModel');
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move minH', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');

        var expectedValue = 12,
          offset = slider.sliderElem.rzsp - slider.valueToOffset(expectedValue) - slider.handleHalfDim;

        var event = fireMousedown(slider.selBar, offset, true);

        expect(scope.slider.value).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderModel');
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click on ticks and move minH', function() {
        scope.slider.options.step = 10;
        scope.slider.options.showTicks = true;
        scope.$digest();
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');

        var expectedValue = 10,
          offset = slider.sliderElem.rzsp - slider.valueToOffset(expectedValue) - slider.handleHalfDim;

        fireMousedown(slider.ticks, offset, true);

        expect(scope.slider.value).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderModel');
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });
    });

    describe('range vertical slider - ', function() {
      beforeEach(function() {
        var sliderConf = {
          min: 0,
          max: 100,
          options: {
            floor: 0,
            ceil: 100,
            vertical: true
          }
        };
        createRangeSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        fireMouseup();
      });

      it('should handle mousedown on minH correctly when keyboardSupport is true', function() {
        sinon.spy(slider, 'calcViewDimensions');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'focusElement');

        var event = fireMousedown(slider.minH, 0, true);

        slider.calcViewDimensions.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.focusElement.calledWith(slider.minH).should.be.true;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(slider.tracking).to.equal('rzSliderModel');
        expect(slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on minH correctly when keyboardSupport is false', function() {
        scope.slider.options.keyboardSupport = false;
        scope.$digest();

        sinon.spy(slider, 'calcViewDimensions');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'focusElement');

        var event = fireMousedown(slider.minH, 0, true);

        slider.calcViewDimensions.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.focusElement.called.should.be.false;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(slider.tracking).to.equal('rzSliderModel');
        expect(slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on maxH correctly when keyboardSupport is true', function() {
        sinon.spy(slider, 'calcViewDimensions');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'focusElement');

        var event = fireMousedown(slider.maxH, 0, true);

        slider.calcViewDimensions.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.focusElement.calledWith(slider.maxH).should.be.true;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(slider.tracking).to.equal('rzSliderHigh');
        expect(slider.maxH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on maxH correctly when keyboardSupport is false', function() {
        scope.slider.options.keyboardSupport = false;
        scope.$digest();

        sinon.spy(slider, 'calcViewDimensions');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'focusElement');

        var event = fireMousedown(slider.maxH, 0, true);

        slider.calcViewDimensions.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.focusElement.called.should.be.false;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(slider.tracking).to.equal('rzSliderHigh');
        expect(slider.maxH.hasClass('rz-active')).to.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is on the middle', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnChange');
        var event = fireMousedown(slider.minH, 0, true);
        var expectedValue = 50,
          offset = slider.sliderElem.rzsp - slider.valueToOffset(expectedValue) - slider.handleHalfDim;
        fireMousemove(offset, true);
        expect(scope.slider.min).to.equal(expectedValue);
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on maxH correctly when mouse is on the middle', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnChange');
        var event = fireMousedown(slider.maxH, 0, true);
        var expectedValue = 50,
          offset = slider.sliderElem.rzsp - slider.valueToOffset(expectedValue) - slider.handleHalfDim;
        fireMousemove(offset, true);
        expect(scope.slider.max).to.equal(expectedValue);
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on minH and switch min/max if needed', function() {
        scope.slider.min = 40;
        scope.slider.max = 60;
        scope.$digest();

        var event = fireMousedown(slider.minH, 0, true);
        var expectedValue = 80,
          offset = slider.sliderElem.rzsp - slider.valueToOffset(expectedValue) - slider.handleHalfDim;
        fireMousemove(offset, true);

        expect(scope.slider.min).to.equal(60);
        expect(scope.slider.max).to.equal(80);
      });

      it('should handle click and drag on maxH and switch min/max if needed', function() {
        scope.slider.min = 40;
        scope.slider.max = 60;
        scope.$digest();

        var event = fireMousedown(slider.maxH, 0, true);
        var expectedValue = 20,
          offset = slider.sliderElem.rzsp - slider.valueToOffset(expectedValue) - slider.handleHalfDim;
        fireMousemove(offset, true);

        expect(scope.slider.min).to.equal(20);
        expect(scope.slider.max).to.equal(40);
      });

      it('should handle click on fullbar and move minH when click pos is nearer to minH', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');
        sinon.spy(slider, 'focusElement');

        var expectedValue = 10,
          offset = slider.sliderElem.rzsp - slider.valueToOffset(expectedValue) - slider.handleHalfDim;

        var event = fireMousedown(slider.fullBar, offset, true);

        expect(scope.slider.min).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderModel');
        slider.focusElement.calledWith(slider.minH).should.be.true;
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click on fullbar and move maxH when click pos is nearer to maxH', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');
        sinon.spy(slider, 'focusElement');

        var expectedValue = 90,
          offset = slider.sliderElem.rzsp - slider.valueToOffset(expectedValue) - slider.handleHalfDim;

        var event = fireMousedown(slider.fullBar, offset, true);

        expect(scope.slider.max).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderHigh');
        slider.focusElement.calledWith(slider.maxH).should.be.true;
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move minH when click pos is nearer to minH', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');
        sinon.spy(slider, 'focusElement');

        var expectedValue = 10,
          offset = slider.sliderElem.rzsp - slider.valueToOffset(expectedValue) - slider.handleHalfDim;

        var event = fireMousedown(slider.selBar, offset, true);

        expect(scope.slider.min).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderModel');
        slider.focusElement.calledWith(slider.minH).should.be.true;
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move maxH when click pos is nearer to maxH', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');
        sinon.spy(slider, 'focusElement');

        var expectedValue = 90,
          offset = slider.sliderElem.rzsp - slider.valueToOffset(expectedValue) - slider.handleHalfDim;

        var event = fireMousedown(slider.selBar, offset, true);

        expect(scope.slider.max).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderHigh');
        slider.focusElement.calledWith(slider.maxH).should.be.true;
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });
    });

    describe('range horizontal slider with draggableRange - ', function() {
      beforeEach(function() {
        var sliderConf = {
          min: 40,
          max: 60,
          options: {
            floor: 0,
            ceil: 100,
            draggableRange: true
          }
        };
        createRangeSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        fireMouseup();
      });

      it('should handle click and drag on minH correctly when mouse is on the middle', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnChange');
        var event = fireMousedown(slider.minH, 0);
        var expectedValue = 50,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;
        fireMousemove(offset);
        expect(scope.slider.min).to.equal(expectedValue);
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on maxH correctly when mouse is on the middle', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnChange');
        var event = fireMousedown(slider.maxH, 0);
        var expectedValue = 50,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;
        fireMousemove(offset);
        expect(scope.slider.max).to.equal(expectedValue);
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on minH and switch min/max if needed', function() {
        var event = fireMousedown(slider.minH, 0);
        var expectedValue = 80,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;
        fireMousemove(offset);

        expect(scope.slider.min).to.equal(60);
        expect(scope.slider.max).to.equal(80);
      });

      it('should handle click and drag on maxH and switch min/max if needed', function() {
        var event = fireMousedown(slider.maxH, 0);
        var expectedValue = 20,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;
        fireMousemove(offset);

        expect(scope.slider.min).to.equal(20);
        expect(scope.slider.max).to.equal(40);
      });

      it('should handle click on fullbar and move minH when click pos is nearer to minH', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');
        sinon.spy(slider, 'focusElement');

        var expectedValue = 10,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;

        var event = fireMousedown(slider.fullBar, offset);

        expect(scope.slider.min).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderModel');
        slider.focusElement.calledWith(slider.minH).should.be.true;
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click on fullbar and move maxH when click pos is nearer to maxH', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');
        sinon.spy(slider, 'focusElement');

        var expectedValue = 90,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;

        var event = fireMousedown(slider.fullBar, offset);

        expect(scope.slider.max).to.equal(expectedValue);
        expect(slider.tracking).to.equal('rzSliderHigh');
        slider.focusElement.calledWith(slider.maxH).should.be.true;
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move whole range when moved within slider range', function() {
        sinon.spy(slider, 'positionTrackingBar');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');
        sinon.spy(slider, 'focusElement');

        fireMousedown(slider.selBar, 0);

        var moveValue = 10,
          offset = slider.valueToOffset(moveValue);
        fireMousemove(offset);

        expect(scope.slider.min).to.equal(50);
        expect(scope.slider.max).to.equal(70);
        expect(slider.tracking).to.equal('rzSliderModel');
        slider.focusElement.calledWith(slider.minH).should.be.true;
        slider.positionTrackingBar.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move move range when near 0 and moved left', function() {
        scope.slider.min = 10;
        scope.$digest();

        fireMousedown(slider.selBar, 0);
        fireMousemove(-1000);

        expect(scope.slider.min).to.equal(0);
        expect(scope.slider.max).to.equal(50);
        expect(slider.tracking).to.equal('rzSliderModel');
      });

      it('should handle click on selbar and don\'t move range when already at 0 and moved left', function() {
        scope.slider.min = 0;
        scope.$digest();

        fireMousedown(slider.selBar, 0);
        fireMousemove(-100);

        expect(scope.slider.min).to.equal(0);
        expect(scope.slider.max).to.equal(60);
        expect(slider.tracking).to.equal('rzSliderModel');
      });

      it('should handle click on selbar and move move range when near max and moved right', function() {
        scope.slider.max = 90;
        scope.$digest();

        fireMousedown(slider.selBar, 0);
        fireMousemove(slider.maxPos);

        expect(scope.slider.min).to.equal(50);
        expect(scope.slider.max).to.equal(100);
        expect(slider.tracking).to.equal('rzSliderModel');
      });

      it('should handle click on selbar and don\'t move range when already at max and moved right', function() {
        scope.slider.max = 100;
        scope.$digest();

        fireMousedown(slider.selBar, 0);
        fireMousemove(slider.maxPos);

        expect(scope.slider.min).to.equal(40);
        expect(scope.slider.max).to.equal(100);
        expect(slider.tracking).to.equal('rzSliderModel');
      });

      it('should a working positionTrackingBar', function() {
        var newMin = 50,
          newMax = 90,
          minOffset = slider.valueToOffset(newMin),
          maxOffset = slider.valueToOffset(newMax);
        slider.positionTrackingBar(newMin, newMax, minOffset, maxOffset);

        expect(scope.slider.min).to.equal(50);
        expect(scope.slider.max).to.equal(90);
        expect(slider.minH.css('left')).to.equal(minOffset + 'px');
        expect(slider.maxH.css('left')).to.equal(maxOffset + 'px');
      });
    });

    describe('range horizontal slider with draggableRangeOnly - ', function() {
      beforeEach(function() {
        var sliderConf = {
          min: 40,
          max: 60,
          options: {
            floor: 0,
            ceil: 100,
            draggableRangeOnly: true
          }
        };
        createRangeSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        fireMouseup();
      });

      it('should handle click and drag on minH correctly', function() {
        sinon.spy(slider, 'positionTrackingBar');
        sinon.spy(slider, 'callOnChange');

        var event = fireMousedown(slider.minH, 0);
        var moveValue = 10,
          offset = slider.valueToOffset(moveValue);
        fireMousemove(offset);

        expect(scope.slider.min).to.equal(50);
        expect(scope.slider.max).to.equal(70);
        slider.positionTrackingBar.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on maxH correctly', function() {
        sinon.spy(slider, 'positionTrackingBar');
        sinon.spy(slider, 'callOnChange');
        var event = fireMousedown(slider.maxH, 0);
        var moveValue = 10,
          offset = slider.valueToOffset(moveValue);
        fireMousemove(offset);
        expect(scope.slider.min).to.equal(50);
        expect(scope.slider.max).to.equal(70);
        slider.positionTrackingBar.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should not handle click on fullbar', function() {
        sinon.spy(slider, 'callOnStart');

        var moveValue = 10,
          offset = slider.valueToOffset(moveValue);

        var event = fireMousedown(slider.fullBar, offset);

        expect(scope.slider.min).to.equal(40);
        expect(scope.slider.max).to.equal(60);
        expect(slider.tracking).to.equal('');
        slider.callOnStart.called.should.be.false;
      });

      it('should handle click on selbar and move whole range when moved within slider range', function() {
        sinon.spy(slider, 'positionTrackingBar');
        sinon.spy(slider, 'callOnStart');
        sinon.spy(slider, 'callOnChange');
        sinon.spy(slider, 'focusElement');

        fireMousedown(slider.selBar, 0);

        var moveValue = 10,
          offset = slider.valueToOffset(moveValue);
        fireMousemove(offset);

        expect(scope.slider.min).to.equal(50);
        expect(scope.slider.max).to.equal(70);
        expect(slider.tracking).to.equal('rzSliderModel');
        slider.focusElement.calledWith(slider.minH).should.be.true;
        slider.positionTrackingBar.called.should.be.true;
        slider.callOnStart.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move move range when near 0 and moved left', function() {
        scope.slider.min = 10;
        scope.$digest();

        fireMousedown(slider.selBar, 0);
        fireMousemove(-1000);

        expect(scope.slider.min).to.equal(0);
        expect(scope.slider.max).to.equal(50);
        expect(slider.tracking).to.equal('rzSliderModel');
      });

      it('should handle click on selbar and don\'t move range when already at 0 and moved left', function() {
        scope.slider.min = 0;
        scope.$digest();

        fireMousedown(slider.selBar, 0);
        fireMousemove(-100);

        expect(scope.slider.min).to.equal(0);
        expect(scope.slider.max).to.equal(60);
        expect(slider.tracking).to.equal('rzSliderModel');
      });

      it('should handle click on selbar and move move range when near max and moved right', function() {
        scope.slider.max = 90;
        scope.$digest();

        fireMousedown(slider.selBar, 0);
        fireMousemove(slider.maxPos);

        expect(scope.slider.min).to.equal(50);
        expect(scope.slider.max).to.equal(100);
        expect(slider.tracking).to.equal('rzSliderModel');
      });

      it('should handle click on selbar and don\'t move range when already at max and moved right', function() {
        scope.slider.max = 100;
        scope.$digest();

        fireMousedown(slider.selBar, 0);
        fireMousemove(slider.maxPos);

        expect(scope.slider.min).to.equal(40);
        expect(scope.slider.max).to.equal(100);
        expect(slider.tracking).to.equal('rzSliderModel');
      });
    });

    describe('single horizontal slider with onlyBindHandles - ', function() {
      beforeEach(function() {
        var sliderConf = {
          value: 0,
          options: {
            floor: 0,
            ceil: 100,
            showTicks: true,
            onlyBindHandles: true
          }
        };
        createSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        fireMouseup();
      });

      it('should handle click and drag on minH correctly when mouse is on the middle', function() {
        sinon.spy(slider, 'positionTrackingHandle');
        sinon.spy(slider, 'callOnChange');
        var event = fireMousedown(slider.minH, 0);
        var expectedValue = 50,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;
        fireMousemove(offset);
        expect(scope.slider.value).to.equal(expectedValue);
        slider.positionTrackingHandle.called.should.be.true;
        slider.callOnChange.called.should.be.true;
      });

      it('should do nothing when a click happen on another element than the handle', function() {
        scope.slider.value = 100;
        scope.$digest();

        sinon.spy(slider, 'positionTrackingHandle');
        fireMousedown(slider.selBar, 0);
        fireMousedown(slider.fullBar, 0);
        fireMousedown(slider.ticks, 0);

        expect(scope.slider.value).to.equal(100);
        slider.positionTrackingHandle.called.should.be.false;
      });
    });

    describe('single horizontal slider with onlyBindHandles - ', function() {
      beforeEach(function() {
        var sliderConf = {
          min: 45,
          max: 55,
          options: {
            floor: 0,
            ceil: 100,
            minRange: 10
          }
        };
        createRangeSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        fireMouseup();
      });

      it('should not modify any value if new range would be smaller than minRange when moving minH', function() {
        fireMousedown(slider.minH, 0);
        var expectedValue = 50,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;
        fireMousemove(offset);
        expect(scope.slider.min).to.equal(45);
      });

      it('should not modify any value if new range would be smaller than minRange when moving maxH', function() {
        fireMousedown(slider.maxH, 0);
        var expectedValue = 50,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;
        fireMousemove(offset);
        expect(scope.slider.max).to.equal(55);
      });

      it('should modify the min value if new range is larger than minRange when moving minH', function() {
        fireMousedown(slider.minH, 0);
        var expectedValue = 30,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;
        fireMousemove(offset);
        expect(scope.slider.min).to.equal(expectedValue);
      });

      it('should modify the max value if new range is larger than than minRange when moving maxH', function() {
        fireMousedown(slider.maxH, 0);
        var expectedValue = 70,
          offset = slider.valueToOffset(expectedValue) + slider.handleHalfDim + slider.sliderElem.rzsp;
        fireMousemove(offset);
        expect(scope.slider.max).to.equal(expectedValue);
      });
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

    it('should not be modified by keyboard if new range is below minRange', function() {
      var sliderConf = {
        min: 45,
        max: 55,
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
          minRange: 10
        }
      };
      createRangeSlider(sliderConf);
      //try to move minH right
      slider.minH.triggerHandler('focus');
      pressKeydown(slider.minH, 'RIGHT');
      expect(scope.slider.min).to.equal(45);

      //try to move maxH left
      slider.maxH.triggerHandler('focus');
      pressKeydown(slider.maxH, 'LEFT');
      expect(scope.slider.max).to.equal(55);
    });

    it('should be modified by keyboard if new range is above minRange', function() {
      var sliderConf = {
        min: 45,
        max: 55,
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
          minRange: 10
        }
      };
      createRangeSlider(sliderConf);

      //try to move minH left
      slider.minH.triggerHandler('focus');
      pressKeydown(slider.minH, 'LEFT');
      expect(scope.slider.min).to.equal(44);

      //try to move maxH right
      slider.maxH.triggerHandler('focus');
      pressKeydown(slider.maxH, 'RIGHT');
      expect(scope.slider.max).to.equal(56);
    });
  });

  function fireMousedown(element, position, vertical) {
    var positionProp = vertical ? 'clientY' : 'clientX';
    var event = {
      type: 'mousedown',
      preventDefault: sinon.stub(),
      stopPropagation: sinon.stub()
    };
    event[positionProp] = position;

    element.triggerHandler(event);
    return event;
  }

  function fireMousemove(position, vertical) {
    var positionProp = vertical ? 'clientY' : 'clientX';
    var event = {
      type: 'mousemove'
    };
    event[positionProp] = position;

    $document.triggerHandler(event);
  }

  function fireMouseup() {
    var event = {
      type: 'mouseup'
    };
    $document.triggerHandler(event);
  }

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
