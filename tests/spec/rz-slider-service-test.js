'use strict';

describe('rzslider - ', function() {
  var helper,
    RzSliderOptions,
    $rootScope,
    $timeout;

  beforeEach(module('test-helper'));

  beforeEach(inject(function(TestHelper, _RzSliderOptions_, _$rootScope_, _$timeout_) {
    helper = TestHelper;
    RzSliderOptions = _RzSliderOptions_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  afterEach(function() {
    helper.clean();
  });

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
      helper.createSlider(sliderConf);
    });

    it('should exist compiled and with correct config', function() {
      expect(helper.element.find('span')).to.have.length(11);
      expect(helper.slider.range).to.be.false;
      expect(helper.slider.valueRange).to.equal(100);
      expect(helper.slider.maxH.css('display')).to.equal('none');
    });

    it('should watch rzSliderModel and reflow the slider accordingly', function() {
      sinon.spy(helper.slider, 'onLowHandleChange');
      helper.scope.slider.value = 54;
      helper.scope.$digest();
      helper.slider.onLowHandleChange.called.should.be.true;
    });

    it('should watch rzSliderOptions and reset the slider accordingly', function() {
      sinon.spy(helper.slider, 'applyOptions');
      sinon.spy(helper.slider, 'resetSlider');
      helper.scope.slider.options.showTicks = true;
      helper.scope.$digest();
      helper.slider.applyOptions.called.should.be.true;
      helper.slider.resetSlider.called.should.be.true;
    });

    it('should round the model value to the step by default', function() {
      helper.scope.slider.value = 54;
      helper.scope.$digest();
      expect(helper.scope.slider.value).to.equal(50);

      helper.scope.slider.value = 55;
      helper.scope.$digest();
      $timeout.flush(); //to flush the throttle function since we modify twice in a row
      expect(helper.scope.slider.value).to.equal(60);
    });

    it('should call calcViewDimensions() on reCalcViewDimensions', function() {
      sinon.spy(helper.slider, 'calcViewDimensions');
      helper.scope.$broadcast('reCalcViewDimensions');
      helper.slider.calcViewDimensions.called.should.be.true;
    });

    it('should reset everything on rzSliderForceRender', function() {
      sinon.spy(helper.slider, 'resetLabelsValue');
      sinon.spy(helper.slider, 'resetSlider');
      sinon.spy(helper.slider, 'onLowHandleChange');

      helper.scope.$broadcast('rzSliderForceRender');

      helper.slider.resetLabelsValue.called.should.be.true;
      helper.slider.resetSlider.called.should.be.true;
      helper.slider.onLowHandleChange.called.should.be.true;
    });

    it('should call calcViewDimensions() on window resize event', inject(function($window) {
      sinon.spy(helper.slider, 'calcViewDimensions');
      angular.element($window).triggerHandler('resize');
      helper.slider.calcViewDimensions.called.should.be.true;
    }));

    it('should unregister all dom events on $destroy', inject(function($window) {
      sinon.spy(helper.slider, 'calcViewDimensions');
      sinon.spy(helper.slider, 'unbindEvents');

      helper.scope.$broadcast('$destroy');
      angular.element($window).triggerHandler('resize');

      helper.slider.calcViewDimensions.called.should.be.false;
      helper.slider.unbindEvents.called.should.be.true;
    }));
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
      helper.createRangeSlider(sliderConf);
    });

    it('should exist compiled and with correct config', function() {
      expect(helper.element.find('span')).to.have.length(11);
      expect(helper.slider.range).to.be.true;
      expect(helper.slider.valueRange).to.equal(100);
      expect(helper.slider.maxH.css('display')).to.equal('');
    });

    it('should watch rzSliderHigh and reflow the slider accordingly', function() {
      sinon.spy(helper.slider, 'onHighHandleChange');
      helper.scope.slider.max = 95;
      helper.scope.$digest();
      helper.slider.onHighHandleChange.called.should.be.true;
    });

    it('should switch to a single slider when rzSliderHigh is unset after init', function() {
      sinon.spy(helper.slider, 'onHighHandleChange');
      sinon.spy(helper.slider, 'applyOptions');
      sinon.spy(helper.slider, 'resetSlider');
      helper.scope.slider.max = undefined;
      helper.scope.$digest();
      helper.slider.onHighHandleChange.called.should.be.false;
      helper.slider.applyOptions.called.should.be.true;
      helper.slider.resetSlider.called.should.be.true;
    });

    it('should switch to a range slider when rzSliderHigh is set after init', function() {
      helper.scope.slider.max = undefined;
      helper.scope.$digest();
      sinon.spy(helper.slider, 'onHighHandleChange');
      sinon.spy(helper.slider, 'applyOptions');
      sinon.spy(helper.slider, 'resetSlider');
      helper.scope.slider.max = 100;
      helper.scope.$digest();
      helper.slider.onHighHandleChange.called.should.be.true;
      helper.slider.applyOptions.called.should.be.true;
      helper.slider.resetSlider.called.should.be.true;
    });

    it('should round the model value to the step', function() {
      helper.scope.slider.min = 13;
      helper.scope.slider.max = 94;
      helper.scope.$digest();
      expect(helper.scope.slider.min).to.equal(10);
      expect(helper.scope.slider.max).to.equal(90);

      helper.scope.slider.min = 15;
      helper.scope.slider.max = 95;
      helper.scope.$digest();
      $timeout.flush(); //to flush the throttle function
      expect(helper.scope.slider.min).to.equal(20);
      expect(helper.scope.slider.max).to.equal(100);
    });

    it('should reset everything on rzSliderForceRender', function() {
      sinon.spy(helper.slider, 'resetLabelsValue');
      sinon.spy(helper.slider, 'resetSlider');
      sinon.spy(helper.slider, 'onLowHandleChange');
      sinon.spy(helper.slider, 'onHighHandleChange');

      helper.scope.$broadcast('rzSliderForceRender');

      helper.slider.resetLabelsValue.called.should.be.true;
      helper.slider.resetSlider.called.should.be.true;
      helper.slider.onLowHandleChange.called.should.be.true;
      helper.slider.onHighHandleChange.called.should.be.true;
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
        helper.createSlider(sliderConf);
      });

      it('horizontal slider should take the full width and get correct position/dimension properties', function() {
        helper.scope.$digest();
        expect(helper.element[0].getBoundingClientRect().width).to.equal(1000);
        expect(helper.slider.positionProperty).to.equal('left');
        expect(helper.slider.dimensionProperty).to.equal('width');
        expect(helper.slider.sliderElem.hasClass('vertical')).to.be.false;
      });

      it('vertical slider should take the full height and get correct position/dimension properties', function() {
        helper.scope.$digest();
        helper.scope.slider.options.vertical = true;
        helper.scope.$digest();
        expect(helper.element[0].getBoundingClientRect().height).to.equal(1000);
        expect(helper.slider.positionProperty).to.equal('bottom');
        expect(helper.slider.dimensionProperty).to.equal('height');
        expect(helper.slider.sliderElem.hasClass('vertical')).to.be.true;
      });

      it('should prevent invalid step', function() {
        helper.scope.slider.options.step = 0;
        helper.scope.$digest();
        expect(helper.slider.options.step).to.equal(1);

        helper.scope.slider.options.step = -1;
        helper.scope.$digest();
        expect(helper.slider.options.step).to.equal(1);
      });

      it('should not round value to step if enforceStep is false', function() {
        helper.scope.slider.options.enforceStep = false;
        helper.scope.$digest();

        helper.scope.slider.value = 14;
        helper.scope.$digest();
        expect(helper.scope.slider.value).to.equal(14);
      });

      it('should round value to step if enforceStep is true', function() {
        helper.scope.slider.options.enforceStep = true;
        helper.scope.$digest();

        helper.scope.slider.value = 14;
        helper.scope.$digest();
        expect(helper.scope.slider.value).to.equal(10);
      });

      it('should set the showTicks scope flag to true when showTicks is true', function() {
        helper.scope.slider.options.showTicks = true;
        helper.scope.$digest();
        expect(helper.slider.scope.showTicks).to.be.true;
      });

      it('should set the showTicks scope flag to true when showTicksValues is true', function() {
        helper.scope.slider.options.showTicksValues = true;
        helper.scope.$digest();
        expect(helper.slider.scope.showTicks).to.be.true;
      });

      it('should set not accept draggableRange to true when slider is a single one', function() {
        helper.scope.slider.options.draggableRange = true;
        helper.scope.$digest();
        expect(helper.slider.options.draggableRange).to.be.false;
      });

      it('should set not accept draggableRangeOnly to true when slider is a single one', function() {
        helper.scope.slider.options.draggableRangeOnly = true;
        helper.scope.$digest();
        expect(helper.slider.options.draggableRange).to.be.false;
        expect(helper.slider.options.draggableRangeOnly).to.be.false;
      });

      it('should set correct step/floor/ceil and translate function when stepsArray is used', function() {
        helper.scope.slider.options.stepsArray = ['A', 'B', 'C', 'D', 'E'];
        helper.scope.$digest();
        expect(helper.slider.options.step).to.equal(1);
        expect(helper.slider.options.floor).to.equal(0);
        expect(helper.slider.options.ceil).to.equal(4);

        expect(helper.slider.customTrFn(0)).to.equal('A');
        expect(helper.slider.customTrFn(2)).to.equal('C');
      });

      it('should sanitize rzSliderModel between floor and ceil', function() {
        helper.scope.slider.options.enforceRange = true;
        helper.scope.slider.value = 1000;
        helper.scope.$digest();
        expect(helper.scope.slider.value).to.equal(100);

        helper.scope.slider.value = -1000;
        helper.scope.$digest();
        $timeout.flush(); //to flush the throttle function
        expect(helper.scope.slider.value).to.equal(0);
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
        helper.createSlider(sliderConf);
        expect(helper.slider.customTrFn(0)).to.equal('custom value');
        expect(helper.slider.customTrFn(100)).to.equal('custom value');
      });

      it('should set maxValue to rzSliderModel if no ceil is set for a single slider', function() {
        var sliderConf = {
          value: 10
        };
        helper.createSlider(sliderConf);
        expect(helper.slider.maxValue).to.equal(10);
      });

      it('should set maxValue to rzSliderHigh if no ceil is set for a range slider', function() {
        var sliderConf = {
          min: 10,
          max: 100
        };
        helper.createRangeSlider(sliderConf);
        expect(helper.slider.maxValue).to.equal(100);
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
        helper.createSlider(sliderConf);
        var expectedDimension = helper.slider.valueToOffset(2) + helper.slider.handleHalfDim;
        expect(helper.slider.selBar.css('width')).to.equal(expectedDimension + 'px');
        expect(helper.slider.selBar.css('left')).to.equal('0px');
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
        helper.createSlider(sliderConf);
        var expectedDimension = helper.slider.valueToOffset(8) + helper.slider.handleHalfDim,
          expectedPosition = helper.slider.valueToOffset(2) + helper.slider.handleHalfDim;
        expect(helper.slider.selBar.css('width')).to.equal(expectedDimension + 'px');
        expect(helper.slider.selBar.css('left')).to.equal(expectedPosition + 'px');
      });

      it('should set the correct dimension/position for selection bar for single slider with showSelectionBarFromValue is used with a value on the right', function() {
        var sliderConf = {
          value: 15,
          options: {
            floor: 0,
            ceil: 20,
            showSelectionBarFromValue: 10
          }
        };
        helper.createSlider(sliderConf);
        var expectedDimension = helper.slider.valueToOffset(5),
          expectedPosition = helper.slider.valueToOffset(10) + helper.slider.handleHalfDim;
        expect(helper.slider.selBar.css('width')).to.equal(expectedDimension + 'px');
        expect(helper.slider.selBar.css('left')).to.equal(expectedPosition + 'px');
      });

      it('should set the correct dimension/position for selection bar for single slider with showSelectionBarFromValue is used with a value on the left', function() {
        var sliderConf = {
          value: 3,
          options: {
            floor: 0,
            ceil: 20,
            showSelectionBarFromValue: 10
          }
        };
        helper.createSlider(sliderConf);
        var expectedDimension = helper.slider.valueToOffset(7),
          expectedPosition = helper.slider.valueToOffset(3) + helper.slider.handleHalfDim;
        expect(helper.slider.selBar.css('width')).to.equal(expectedDimension + 'px');
        expect(helper.slider.selBar.css('left')).to.equal(expectedPosition + 'px');
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
        helper.createSlider(sliderConf);
        var selBarChild = angular.element(helper.slider.selBar[0].querySelector('.rz-selection'));
        expect(selBarChild.css('background-color')).to.equal('green');

        helper.scope.slider.value = 2;
        helper.scope.$digest();
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
        helper.createRangeSlider(sliderConf);
        var expectedDimension = helper.slider.valueToOffset(6),
          expectedPosition = helper.slider.valueToOffset(2) + helper.slider.handleHalfDim;
        expect(helper.slider.selBar.css('width')).to.equal(expectedDimension + 'px');
        expect(helper.slider.selBar.css('left')).to.equal(expectedPosition + 'px');
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
        helper.createRangeSlider(sliderConf);
        var selBarChild = angular.element(helper.slider.selBar[0].querySelector('.rz-selection'));
        expect(selBarChild.css('background-color')).to.equal('green');

        helper.scope.slider.min = 4;
        helper.scope.slider.max = 6;
        helper.scope.$digest();
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
        helper.createSlider(sliderConf);

        helper.slider.callOnStart();
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
        helper.createSlider(sliderConf);

        helper.slider.callOnChange();
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
        helper.createSlider(sliderConf);

        helper.slider.callOnEnd();
        $timeout.flush();
        sliderConf.options.onEnd.calledWith('test').should.be.true;
      });

      it('should set the correct background-color on pointer for single slider', function() {
        var sliderConf = {
          value: 10,
          options: {
            floor: 0,
            ceil: 10,
            showSelectionBar: true,
            getPointerColor: function(v) {
              if (v < 5) return 'red';
              return 'green';
            }
          }
        };
        helper.createSlider(sliderConf);
        var minHChild = angular.element(helper.slider.minH[0]);
        expect(minHChild.css('background-color')).to.equal('green');

        helper.scope.slider.value = 2;
        helper.scope.$digest();
        expect(minHChild.css('background-color')).to.equal('red');
      });

      it('should set the correct background-color on pointer for range slider (simple rule)', function() {
        var sliderConf = {
          min: 2,
          max: 8,
          options: {
            floor: 0,
            ceil: 10,
            getPointerColor: function(v) {
              if (v < 5) return 'red';
              return 'green';
            }
          }
        };
        helper.createRangeSlider(sliderConf);
        var minHChild = angular.element(helper.slider.minH[0]),
            maxHChild = angular.element(helper.slider.maxH[0]);
        expect(minHChild.css('background-color')).to.equal('red');
        expect(maxHChild.css('background-color')).to.equal('green');

        helper.scope.slider.min = 6;
        helper.scope.slider.max = 7;
        helper.scope.$digest();
        expect(minHChild.css('background-color')).to.equal('green');
        expect(maxHChild.css('background-color')).to.equal('green');
      });

      it('should set the correct background-color on pointer for range slider (min/high independent rule 1)', function() {
        var sliderConf = {
          min: 2,
          max: 8,
          options: {
            floor: 0,
            ceil: 10,
            getPointerColor: function(v, type) {
              if ( type === 'min' ) {
                if (v < 5) return 'red';
                return 'green';
              }

              if ( type === 'max' ) {
                if (v < 5) return 'blue';
                return 'orange';
              }
            }
          }
        };
        helper.createRangeSlider(sliderConf);
        var minHChild = angular.element(helper.slider.minH[0]),
            maxHChild = angular.element(helper.slider.maxH[0]);
        expect(minHChild.css('background-color')).to.equal('red');
        expect(maxHChild.css('background-color')).to.equal('orange');

        helper.scope.slider.min = 6;
        helper.scope.$digest();
        expect(minHChild.css('background-color')).to.equal('green');
      });

      it('should set the correct background-color on pointer for range slider (min/high independent rule 2)', function() {
        var sliderConf = {
          min: 2,
          max: 8,
          options: {
            floor: 0,
            ceil: 10,
            getPointerColor: function(v, type) {
              if ( type === 'min' ) {
                if (v < 5) return 'red';
                return 'green';
              }

              if ( type === 'max' ) {
                if (v < 5) return 'blue';
                return 'orange';
              }
            }
          }
        };
        helper.createRangeSlider(sliderConf);
        var minHChild = angular.element(helper.slider.minH[0]),
            maxHChild = angular.element(helper.slider.maxH[0]);
        expect(minHChild.css('background-color')).to.equal('red');
        expect(maxHChild.css('background-color')).to.equal('orange');

        helper.scope.slider.max = 3;
        helper.scope.$digest();
        expect(minHChild.css('background-color')).to.equal('red');
        expect(maxHChild.css('background-color')).to.equal('blue');

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
      helper.createRangeSlider(sliderConf);
    });

    it('should set the correct class to true when draggableRange is true', function() {
      helper.scope.slider.options.draggableRange = true;
      helper.scope.$digest();
      expect(helper.slider.selBar.hasClass('rz-draggable')).to.be.true;
    });

    it('should set draggableRange to true when draggableRangeOnly is true', function() {
      helper.scope.slider.options.draggableRangeOnly = true;
      helper.scope.$digest();
      expect(helper.slider.options.draggableRange).to.be.true;
      expect(helper.slider.selBar.hasClass('rz-draggable')).to.be.true;
    });

    it('should sanitize rzSliderModel and rzSliderHigh between floor and ceil', function() {
      helper.scope.slider.options.enforceRange = true;
      helper.scope.slider.min = -1000;
      helper.scope.slider.max = 1000;
      helper.scope.$digest();
      expect(helper.scope.slider.min).to.equal(0);
      expect(helper.scope.slider.max).to.equal(100);
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
      helper.createSlider(sliderConf);
      expect(helper.slider.minH.attr('role')).to.equal('slider');
      expect(helper.slider.minH.attr('tabindex')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuemax')).to.equal('100');

      helper.scope.slider.value = 20;
      helper.scope.$digest();
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('20');
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
      helper.createSlider(sliderConf);
      expect(helper.slider.minH.attr('role')).to.equal('slider');
      expect(helper.slider.minH.attr('tabindex')).to.equal('0');
      expect(helper.slider.minH.attr('aria-orientation')).to.equal('vertical');
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuemax')).to.equal('100');

      helper.scope.slider.value = 20;
      helper.scope.$digest();
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('20');
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
      helper.createRangeSlider(sliderConf);
      expect(helper.slider.minH.attr('role')).to.equal('slider');
      expect(helper.slider.minH.attr('tabindex')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuemax')).to.equal('100');
      expect(helper.slider.maxH.attr('role')).to.equal('slider');
      expect(helper.slider.maxH.attr('tabindex')).to.equal('0');
      expect(helper.slider.maxH.attr('aria-valuenow')).to.equal('90');
      expect(helper.slider.maxH.attr('aria-valuetext')).to.equal('90');
      expect(helper.slider.maxH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.maxH.attr('aria-valuemax')).to.equal('100');

      helper.scope.slider.min = 20;
      helper.scope.$digest();
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('20');

      helper.scope.slider.max = 80;
      helper.scope.$digest();
      expect(helper.slider.maxH.attr('aria-valuenow')).to.equal('80');
      expect(helper.slider.maxH.attr('aria-valuetext')).to.equal('80');
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
      helper.createRangeSlider(sliderConf);
      expect(helper.slider.minH.attr('role')).to.equal('slider');
      expect(helper.slider.minH.attr('tabindex')).to.equal('0');
      expect(helper.slider.minH.attr('aria-orientation')).to.equal('vertical');
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuemax')).to.equal('100');
      expect(helper.slider.maxH.attr('role')).to.equal('slider');
      expect(helper.slider.maxH.attr('tabindex')).to.equal('0');
      expect(helper.slider.maxH.attr('aria-orientation')).to.equal('vertical');
      expect(helper.slider.maxH.attr('aria-valuenow')).to.equal('90');
      expect(helper.slider.maxH.attr('aria-valuetext')).to.equal('90');
      expect(helper.slider.maxH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.maxH.attr('aria-valuemax')).to.equal('100');

      helper.scope.slider.min = 20;
      helper.scope.$digest();
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('20');

      helper.scope.slider.max = 80;
      helper.scope.$digest();
      expect(helper.slider.maxH.attr('aria-valuenow')).to.equal('80');
      expect(helper.slider.maxH.attr('aria-valuetext')).to.equal('80');
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
      helper.createSlider(sliderConf);
      expect(helper.slider.minH.attr('role')).to.equal('slider');
      expect(helper.slider.minH.attr('tabindex')).to.equal('');
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuemax')).to.equal('100');

      helper.scope.slider.value = 20;
      helper.scope.$digest();
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('20');
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
      helper.createRangeSlider(sliderConf);
      expect(helper.slider.minH.attr('role')).to.equal('slider');
      expect(helper.slider.minH.attr('tabindex')).to.equal('');
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuemax')).to.equal('100');
      expect(helper.slider.maxH.attr('role')).to.equal('slider');
      expect(helper.slider.maxH.attr('tabindex')).to.equal('');
      expect(helper.slider.maxH.attr('aria-valuenow')).to.equal('90');
      expect(helper.slider.maxH.attr('aria-valuetext')).to.equal('90');
      expect(helper.slider.maxH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.maxH.attr('aria-valuemax')).to.equal('100');

      helper.scope.slider.min = 20;
      helper.scope.$digest();
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('20');

      helper.scope.slider.max = 80;
      helper.scope.$digest();
      expect(helper.slider.maxH.attr('aria-valuenow')).to.equal('80');
      expect(helper.slider.maxH.attr('aria-valuetext')).to.equal('80');
    });

    it('should have accessible slider when values are text', function() {
      var sliderConf = {
        value: 1,
        options: {
          stepsArray: ['A', 'B', 'C']
        }
      };
      helper.createSlider(sliderConf);
      expect(helper.slider.minH.attr('role')).to.equal('slider');
      expect(helper.slider.minH.attr('tabindex')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('1');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('B');
      expect(helper.slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuemax')).to.equal('2');

      helper.scope.slider.value = 2;
      helper.scope.$digest();
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('2');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('C');
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
      helper.createSlider(sliderConf);
      expect(helper.element[0].querySelectorAll('.tick')).to.have.length(0);
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
      helper.createSlider(sliderConf);
      expect(helper.element[0].querySelectorAll('.tick')).to.have.length(11);
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
      helper.createSlider(sliderConf);
      expect(helper.element[0].querySelectorAll('.tick')).to.have.length(11);
      expect(helper.element[0].querySelectorAll('.tick-value')).to.have.length(11);
      var firstTick = angular.element(helper.element[0].querySelectorAll('.tick-value')[0]);
      expect(firstTick.text()).to.equal('0');
      var secondTick = angular.element(helper.element[0].querySelectorAll('.tick-value')[1]);
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
      helper.createSlider(sliderConf);
      var firstTick = angular.element(helper.element[0].querySelectorAll('.tick')[0]);
      expect(firstTick.hasClass('selected')).to.be.true;
      var sixthTick = angular.element(helper.element[0].querySelectorAll('.tick')[5]);
      expect(sixthTick.hasClass('selected')).to.be.true;
      var seventhTick = angular.element(helper.element[0].querySelectorAll('.tick')[6]);
      expect(seventhTick.hasClass('selected')).to.be.false;
      var lastTick = angular.element(helper.element[0].querySelectorAll('.tick')[10]);
      expect(lastTick.hasClass('selected')).to.be.false;
    });

    it('should set selected class to ticks above the model value if showSelectionBarEnd is true', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          showSelectionBarEnd: true
        }
      };
      helper.createSlider(sliderConf);
      var firstTick = angular.element(helper.element[0].querySelectorAll('.tick')[0]);
      expect(firstTick.hasClass('selected')).to.be.false;
      var fifthTick = angular.element(helper.element[0].querySelectorAll('.tick')[4]);
      expect(fifthTick.hasClass('selected')).to.be.false;
      var sixthTick = angular.element(helper.element[0].querySelectorAll('.tick')[5]);
      expect(sixthTick.hasClass('selected')).to.be.true;
      var seventhTick = angular.element(helper.element[0].querySelectorAll('.tick')[6]);
      expect(seventhTick.hasClass('selected')).to.be.true;
      var lastTick = angular.element(helper.element[0].querySelectorAll('.tick')[10]);
      expect(lastTick.hasClass('selected')).to.be.true;
    });

    it('should set selected class to correct ticks if showSelectionBarFromValue is used and the model is on the right', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          showSelectionBarFromValue: 30
        }
      };
      helper.createSlider(sliderConf);
      var firstTick = angular.element(helper.element[0].querySelectorAll('.tick')[0]);
      expect(firstTick.hasClass('selected')).to.be.false;
      var thirdTick = angular.element(helper.element[0].querySelectorAll('.tick')[2]);
      expect(thirdTick.hasClass('selected')).to.be.false;
      var fourthTick = angular.element(helper.element[0].querySelectorAll('.tick')[3]);
      expect(fourthTick.hasClass('selected')).to.be.true;
      var fifthTick = angular.element(helper.element[0].querySelectorAll('.tick')[4]);
      expect(fifthTick.hasClass('selected')).to.be.true;
      var sixthTick = angular.element(helper.element[0].querySelectorAll('.tick')[5]);
      expect(sixthTick.hasClass('selected')).to.be.true;
      var seventhTick = angular.element(helper.element[0].querySelectorAll('.tick')[6]);
      expect(seventhTick.hasClass('selected')).to.be.false;
      var lastTick = angular.element(helper.element[0].querySelectorAll('.tick')[10]);
      expect(lastTick.hasClass('selected')).to.be.false;
    });
    it('should set selected class to correct ticks if showSelectionBarFromValue is used and the model is on the left', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          showSelectionBarFromValue: 70
        }
      };
      helper.createSlider(sliderConf);
      var firstTick = angular.element(helper.element[0].querySelectorAll('.tick')[0]);
      expect(firstTick.hasClass('selected')).to.be.false;
      var fifthTick = angular.element(helper.element[0].querySelectorAll('.tick')[4]);
      expect(fifthTick.hasClass('selected')).to.be.false;
      var sixthTick = angular.element(helper.element[0].querySelectorAll('.tick')[5]);
      expect(sixthTick.hasClass('selected')).to.be.true;
      var seventhTick = angular.element(helper.element[0].querySelectorAll('.tick')[6]);
      expect(seventhTick.hasClass('selected')).to.be.true;
      var eighthTick = angular.element(helper.element[0].querySelectorAll('.tick')[7]);
      expect(eighthTick.hasClass('selected')).to.be.true;
      var ninthTick = angular.element(helper.element[0].querySelectorAll('.tick')[8]);
      expect(ninthTick.hasClass('selected')).to.be.false;
      var lastTick = angular.element(helper.element[0].querySelectorAll('.tick')[10]);
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
      helper.createRangeSlider(sliderConf);
      var firstTick = angular.element(helper.element[0].querySelectorAll('.tick')[0]);
      expect(firstTick.hasClass('selected')).to.be.false;
      var sixthTick = angular.element(helper.element[0].querySelectorAll('.tick')[5]);
      expect(sixthTick.hasClass('selected')).to.be.true;
      var seventhTick = angular.element(helper.element[0].querySelectorAll('.tick')[6]);
      expect(seventhTick.hasClass('selected')).to.be.true;
      var lastTick = angular.element(helper.element[0].querySelectorAll('.tick')[10]);
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
      helper.createSlider(sliderConf);
      var firstTick = angular.element(helper.element[0].querySelectorAll('.tick')[0]);
      expect(firstTick.css('background-color')).to.equal('red');

      helper.scope.slider.value = 100;
      helper.scope.$digest();
      expect(firstTick.css('background-color')).to.equal('green');
    });

    it('should set correct tooltip attributes if ticksTooltip is defined for a horizontal slider', function() {
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
      helper.createSlider(sliderConf);
      var firstTick = angular.element(helper.element[0].querySelectorAll('.tick')[0]);
      expect(firstTick.attr('uib-tooltip')).to.equal('tooltip for 0');
      expect(firstTick.attr('tooltip-placement')).to.equal('top');
      var secondTick = angular.element(helper.element[0].querySelectorAll('.tick')[1]);
      expect(secondTick.attr('uib-tooltip')).to.equal('tooltip for 10');
    });

    it('should set correct tooltip attributes if ticksTooltip is defined for a vertical slider', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          vertical: true,
          showTicks: true,
          ticksTooltip: function(value) {
            return 'tooltip for ' + value;
          }
        }
      };
      helper.createSlider(sliderConf);
      var firstTick = angular.element(helper.element[0].querySelectorAll('.tick')[0]);
      expect(firstTick.attr('uib-tooltip')).to.equal('tooltip for 0');
      expect(firstTick.attr('tooltip-placement')).to.equal('right');
      var secondTick = angular.element(helper.element[0].querySelectorAll('.tick')[1]);
      expect(secondTick.attr('uib-tooltip')).to.equal('tooltip for 10');
    });

    it('should set correct tooltip attributes on tick-value if ticksValuesTooltip is defined for a horizontal slider', function() {
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
      helper.createSlider(sliderConf);
      var firstTick = angular.element(helper.element[0].querySelectorAll('.tick-value')[0]);
      expect(firstTick.attr('uib-tooltip')).to.equal('tooltip for 0');
      expect(firstTick.attr('tooltip-placement')).to.equal('top');
      var secondTick = angular.element(helper.element[0].querySelectorAll('.tick-value')[1]);
      expect(secondTick.attr('uib-tooltip')).to.equal('tooltip for 10');
    });

    it('should set correct tooltip attributes on tick-value if ticksValuesTooltip is defined for a vertical slider', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          vertical: true,
          showTicksValues: true,
          ticksValuesTooltip: function(value) {
            return 'tooltip for ' + value;
          }
        }
      };
      helper.createSlider(sliderConf);
      var firstTick = angular.element(helper.element[0].querySelectorAll('.tick-value')[0]);
      expect(firstTick.attr('uib-tooltip')).to.equal('tooltip for 0');
      expect(firstTick.attr('tooltip-placement')).to.equal('right');
      var secondTick = angular.element(helper.element[0].querySelectorAll('.tick-value')[1]);
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
      helper.createSlider(sliderConf);
    });

    it('should have a valid roundStep for integer values when floor is 0', function() {
      expect(helper.slider.roundStep(10)).to.equal(10);
      expect(helper.slider.roundStep(9)).to.equal(10);
      expect(helper.slider.roundStep(11)).to.equal(10);
      expect(helper.slider.roundStep(15)).to.equal(20);
      expect(helper.slider.roundStep(14)).to.equal(10);
      expect(helper.slider.roundStep(-10)).to.equal(-10);
      expect(helper.slider.roundStep(-9)).to.equal(-10);
      expect(helper.slider.roundStep(-11)).to.equal(-10);
      expect(helper.slider.roundStep(-16)).to.equal(-20);
      expect(helper.slider.roundStep(-15)).to.equal(-10);
      expect(helper.slider.roundStep(-14)).to.equal(-10);
    });

    it('should have a valid roundStep for integer values when floor is above 0', function() {
      helper.scope.slider.options.floor = 3;
      helper.scope.slider.options.ceil = 103;
      helper.scope.$digest();

      expect(helper.slider.roundStep(3)).to.equal(3);
      expect(helper.slider.roundStep(13)).to.equal(13);
      expect(helper.slider.roundStep(12)).to.equal(13);
      expect(helper.slider.roundStep(14)).to.equal(13);
      expect(helper.slider.roundStep(18)).to.equal(23);
      expect(helper.slider.roundStep(17)).to.equal(13);
    });

    it('should have a valid roundStep for integer values when floor is below 0', function() {
      helper.scope.slider.options.floor = -25;
      helper.scope.$digest();

      expect(helper.slider.roundStep(-5)).to.equal(-5);
      expect(helper.slider.roundStep(-15)).to.equal(-15);
      expect(helper.slider.roundStep(-16)).to.equal(-15);
      expect(helper.slider.roundStep(-14)).to.equal(-15);
      expect(helper.slider.roundStep(-21)).to.equal(-25);
      expect(helper.slider.roundStep(-20)).to.equal(-15);
      expect(helper.slider.roundStep(-19)).to.equal(-15);
    });

    it('should have a valid roundStep for floating values when floor is 0', function() {
      helper.scope.slider.options.precision = 1;
      helper.scope.slider.options.step = 0.1;
      helper.scope.$digest();

      expect(helper.slider.roundStep(10)).to.equal(10);
      expect(helper.slider.roundStep(1.1)).to.equal(1.1);
      expect(helper.slider.roundStep(1.09)).to.equal(1.1);
      expect(helper.slider.roundStep(1.11)).to.equal(1.1);
      expect(helper.slider.roundStep(1.15)).to.equal(1.2);
      expect(helper.slider.roundStep(1.14)).to.equal(1.1);

      expect(helper.slider.roundStep(-10)).to.equal(-10);
      expect(helper.slider.roundStep(-1.1)).to.equal(-1.1);
      expect(helper.slider.roundStep(-1.09)).to.equal(-1.1);
      expect(helper.slider.roundStep(-1.11)).to.equal(-1.1);
      expect(helper.slider.roundStep(-1.16)).to.equal(-1.2);
      expect(helper.slider.roundStep(-1.15)).to.equal(-1.1);
      expect(helper.slider.roundStep(-1.14)).to.equal(-1.1);
    });

    it('should have a valid roundStep for floating values when floor is above 0', function() {
      helper.scope.slider.options.floor = 3;
      helper.scope.slider.options.ceil = 103;
      helper.scope.slider.options.precision = 1;
      helper.scope.slider.options.step = 0.1;
      helper.scope.$digest();

      expect(helper.slider.roundStep(3)).to.equal(3);
      expect(helper.slider.roundStep(13)).to.equal(13);
      expect(helper.slider.roundStep(1.1)).to.equal(1.1);
      expect(helper.slider.roundStep(1.09)).to.equal(1.1);
      expect(helper.slider.roundStep(1.11)).to.equal(1.1);
      expect(helper.slider.roundStep(1.15)).to.equal(1.2);
      expect(helper.slider.roundStep(1.14)).to.equal(1.1);
    });

    it('should have a valid roundStep for floating values when floor is below 0', function() {
      helper.scope.slider.options.floor = -25;
      helper.scope.slider.options.ceil = 75;
      helper.scope.slider.options.precision = 1;
      helper.scope.slider.options.step = 0.1;
      helper.scope.$digest();

      expect(helper.slider.roundStep(-25)).to.equal(-25);
      expect(helper.slider.roundStep(-5)).to.equal(-5);
      expect(helper.slider.roundStep(-1.1)).to.equal(-1.1);
      expect(helper.slider.roundStep(-1.09)).to.equal(-1.1);
      expect(helper.slider.roundStep(-1.11)).to.equal(-1.1);
      expect(helper.slider.roundStep(-1.16)).to.equal(-1.2);
      expect(helper.slider.roundStep(-1.15)).to.equal(-1.1);
      expect(helper.slider.roundStep(-1.14)).to.equal(-1.1);
    });

    it('should have a valid hideEl', function() {
      var el = angular.element('<div></div>');
      helper.slider.hideEl(el);
      expect(el.css('opacity')).to.equal('0');
    });

    it('should have a valid showEl when not rzAlwaysHide', function() {
      var el = angular.element('<div></div>');
      helper.slider.showEl(el);
      expect(el.css('opacity')).to.equal('1');
    });

    it('should have a valid showEl when rzAlwaysHide', function() {
      var el = angular.element('<div></div>');
      el.css('opacity', 0);
      el.rzAlwaysHide = true;

      helper.slider.showEl(el);
      expect(el.css('opacity')).to.equal('0');
    });

    it('should have a valid setPosition for horizontal sliders', function() {
      var el = angular.element('<div></div>');
      helper.slider.setPosition(el, 12);
      expect(el.css('left')).to.equal('12px');
    });

    it('should have a valid setPosition for vertical sliders', function() {
      helper.scope.slider.options.vertical = true;
      helper.scope.$digest();
      var el = angular.element('<div></div>');
      helper.slider.setPosition(el, 12);
      expect(el.css('bottom')).to.equal('12px');
    });

    it('should have a valid getDimension for horizontal sliders', function() {
      expect(helper.slider.getDimension(helper.slider.sliderElem)).to.equal(1000);
    });

    it('should have a valid getDimension for horizontal sliders with custom scale', function() {
      helper.scope.slider.options.scale = 2;
      helper.scope.$digest();
      expect(helper.slider.getDimension(helper.slider.sliderElem)).to.equal(2000);
    });

    it('should have a valid getDimension for vertical sliders', function() {
      helper.scope.slider.options.vertical = true;
      helper.scope.$digest();
      expect(helper.slider.getDimension(helper.slider.sliderElem)).to.equal(1000);
    });

    it('should have a valid getDimension for vertical sliders with custom scale', function() {
      helper.scope.slider.options.scale = 2;
      helper.scope.slider.options.vertical = true;
      helper.scope.$digest();
      expect(helper.slider.getDimension(helper.slider.sliderElem)).to.equal(2000);
    });

    it('should have a valid setDimension for horizontal sliders', function() {
      var el = angular.element('<div></div>');
      helper.slider.setDimension(el, 12);
      expect(el.css('width')).to.equal('12px');
    });

    it('should have a valid setDimension for vertical sliders', function() {
      helper.scope.slider.options.vertical = true;
      helper.scope.$digest();
      var el = angular.element('<div></div>');
      helper.slider.setDimension(el, 12);
      expect(el.css('height')).to.equal('12px');
    });

    it('should have a valid valueToOffset for positive sliders', function() {
      helper.slider.maxPos = 1000;
      expect(helper.slider.valueToOffset(0)).to.equal(0);
      expect(helper.slider.valueToOffset(50)).to.equal(500);
      expect(helper.slider.valueToOffset(100)).to.equal(1000);
    });

    it('should have a valid valueToOffset for negative sliders', function() {
      helper.scope.slider.options.floor = -100;
      helper.scope.slider.options.ceil = 0;
      helper.scope.slider.value = -50;
      helper.scope.$digest();

      helper.slider.maxPos = 1000;
      expect(helper.slider.valueToOffset(0)).to.equal(1000);
      expect(helper.slider.valueToOffset(-50)).to.equal(500);
      expect(helper.slider.valueToOffset(-100)).to.equal(0);
    });

    it('should have a valid sanitizeValue', function() {
      expect(helper.slider.sanitizeValue(0)).to.equal(0);
      expect(helper.slider.sanitizeValue(50)).to.equal(50);
      expect(helper.slider.sanitizeValue(100)).to.equal(100);
      expect(helper.slider.sanitizeValue(-1)).to.equal(0);
      expect(helper.slider.sanitizeValue(-10)).to.equal(0);
      expect(helper.slider.sanitizeValue(101)).to.equal(100);
      expect(helper.slider.sanitizeValue(110)).to.equal(100);
    });

    it('should have a valid offsetToValue for positive sliders', function() {
      helper.slider.maxPos = 1000;
      expect(helper.slider.offsetToValue(0)).to.equal(0);
      expect(helper.slider.offsetToValue(1000)).to.equal(100);
      expect(helper.slider.offsetToValue(500)).to.equal(50);
    });

    it('should have a valid offsetToValue for for negative sliders', function() {
      helper.scope.slider.options.floor = -100;
      helper.scope.slider.options.ceil = 0;
      helper.scope.slider.value = -50;
      helper.scope.$digest();
      helper.slider.maxPos = 1000;

      expect(helper.slider.offsetToValue(0)).to.equal(-100);
      expect(helper.slider.offsetToValue(1000)).to.equal(0);
      expect(helper.slider.offsetToValue(500)).to.equal(-50);
    });

    it('should have a valid getEventXY for horizontal sliders on desktop browsers', function() {
      var event = {
        clientX: 12
      };
      expect(helper.slider.getEventXY(event)).to.equal(12);
    });

    it('should have a valid getEventXY for vertical sliders on desktop browsers', function() {
      helper.scope.slider.options.vertical = true;
      helper.scope.$digest();
      var event = {
        clientY: 12
      };
      expect(helper.slider.getEventXY(event)).to.equal(12);
    });

    it('should have a valid getEventXY for horizontal sliders on mobile browsers with no originalEvent', function() {
      var event = {
        touches: [{
          clientX: 12
        }]
      };
      expect(helper.slider.getEventXY(event)).to.equal(12);
    });

    it('should have a valid getEventXY for horizontal sliders on mobile browsers with originalEvent', function() {
      var event = {
        originalEvent: {
          touches: [{
            clientX: 12
          }]
        }
      };
      expect(helper.slider.getEventXY(event)).to.equal(12);
    });

    it('should have a valid getEventXY for vertical sliders on mobile browsers with no originalEvent', function() {
      helper.scope.slider.options.vertical = true;
      helper.scope.$digest();
      var event = {
        touches: [{
          clientY: 12
        }]
      };
      expect(helper.slider.getEventXY(event)).to.equal(12);
    });

    it('should have a valid getEventXY for vertical sliders on mobile browsers with originalEvent', function() {
      helper.scope.slider.options.vertical = true;
      helper.scope.$digest();
      var event = {
        originalEvent: {
          touches: [{
            clientY: 12
          }]
        }
      };
      expect(helper.slider.getEventXY(event)).to.equal(12);
    });

    it('should have a valid getEventPosition for horizontal sliders', function() {
      sinon.stub(helper.slider, 'getEventXY').returns(46);
      var event = {};

      //fake slider's dimension
      helper.slider.sliderElem.rzsp = 10;
      helper.slider.handleHalfDim = 16;

      expect(helper.slider.getEventPosition(event)).to.equal(20);
    });

    it('should have a valid getEventPosition for vertical sliders', function() {
      helper.scope.slider.options.vertical = true;
      helper.scope.$digest();
      sinon.stub(helper.slider, 'getEventXY').returns(46);
      var event = {};

      //fake slider's dimension
      helper.slider.sliderElem.rzsp = 10;
      helper.slider.handleHalfDim = 16;

      expect(helper.slider.getEventPosition(event)).to.equal(-52);
    });

    it('should have a valid getEventPosition for horizontal sliders with scale option', function() {
      helper.scope.slider.options.scale = 0.5;
      helper.scope.$digest();
      sinon.stub(helper.slider, 'getEventXY').returns(46);
      var event = {};

      //fake slider's dimension
      helper.slider.sliderElem.rzsp = 10;
      helper.slider.handleHalfDim = 16;

      expect(helper.slider.getEventPosition(event)).to.equal(10);
    });

    it('should have a valid getEventPosition for vertical sliders with scale option', function() {
      helper.scope.slider.options.scale = 0.5;
      helper.scope.slider.options.vertical = true;
      helper.scope.$digest();
      sinon.stub(helper.slider, 'getEventXY').returns(46);
      var event = {};

      //fake slider's dimension
      helper.slider.sliderElem.rzsp = 10;
      helper.slider.handleHalfDim = 16;

      expect(helper.slider.getEventPosition(event)).to.equal(-26);
    });

    it('should have a valid getEventNames for desktop', function() {
      var event = {
        clientX: 10,
        clientY: 100
      };
      var eventNames = helper.slider.getEventNames(event);
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
      var eventNames = helper.slider.getEventNames(event);
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
      var eventNames = helper.slider.getEventNames(event);
      expect(eventNames).to.deep.equal({
        moveEvent: 'touchmove',
        endEvent: 'touchend'
      });
    });

    it('should have a valid getNearestHandle for single sliders', function() {
      sinon.stub(helper.slider, 'getEventPosition').returns(46);
      var event = {};
      expect(helper.slider.getNearestHandle(event)).to.equal(helper.slider.minH);
    });

    it('should have a valid focusElement', function() {
      var el = [{
        focus: sinon.spy()
      }];
      helper.slider.focusElement(el);
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
    helper.createRangeSlider(sliderConf);
    sinon.stub(helper.slider, 'getEventPosition').returns(46);

    //fake slider's dimension
    helper.slider.minH.rzsp = 0;
    helper.slider.maxH.rzsp = 100;

    var event = {};
    expect(helper.slider.getNearestHandle(event)).to.equal(helper.slider.minH);
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
    helper.createRangeSlider(sliderConf);
    sinon.stub(helper.slider, 'getEventPosition').returns(66);

    //fake slider's dimension
    helper.slider.minH.rzsp = 0;
    helper.slider.maxH.rzsp = 100;

    var event = {};
    expect(helper.slider.getNearestHandle(event)).to.equal(helper.slider.maxH);
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
    helper.createSlider(sliderConf);
    helper.slider.onStart = sinon.spy();
    helper.slider.onMove = sinon.spy();
    helper.slider.onPointerFocus = sinon.spy();

    helper.slider.unbindEvents(); //remove previously bound events
    helper.slider.bindEvents();

    helper.slider.selBar.triggerHandler('mousedown');
    expect(helper.slider.onStart.callCount).to.equal(1);
    expect(helper.slider.onMove.callCount).to.equal(1);

    helper.slider.minH.triggerHandler('mousedown');
    expect(helper.slider.onStart.callCount).to.equal(2);
    expect(helper.slider.onMove.callCount).to.equal(1);

    helper.slider.maxH.triggerHandler('mousedown');
    expect(helper.slider.onStart.callCount).to.equal(2);
    expect(helper.slider.onMove.callCount).to.equal(1);

    helper.slider.fullBar.triggerHandler('mousedown');
    expect(helper.slider.onStart.callCount).to.equal(3);
    expect(helper.slider.onMove.callCount).to.equal(2);

    helper.slider.ticks.triggerHandler('mousedown');
    expect(helper.slider.onStart.callCount).to.equal(4);
    expect(helper.slider.onMove.callCount).to.equal(3);

    helper.slider.minH.triggerHandler('focus');
    expect(helper.slider.onPointerFocus.callCount).to.equal(1);
    helper.slider.maxH.triggerHandler('focus');
    expect(helper.slider.onPointerFocus.callCount).to.equal(1);
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
    helper.createSlider(sliderConf);
    helper.slider.onStart = sinon.spy();
    helper.slider.onMove = sinon.spy();
    helper.slider.onPointerFocus = sinon.spy();

    helper.slider.unbindEvents(); //remove previously bound events
    helper.slider.bindEvents();

    helper.slider.selBar.triggerHandler('touchstart');
    expect(helper.slider.onStart.callCount).to.equal(1);
    expect(helper.slider.onMove.callCount).to.equal(1);

    helper.slider.minH.triggerHandler('touchstart');
    expect(helper.slider.onStart.callCount).to.equal(2);
    expect(helper.slider.onMove.callCount).to.equal(1);

    helper.slider.maxH.triggerHandler('touchstart');
    expect(helper.slider.onStart.callCount).to.equal(2);
    expect(helper.slider.onMove.callCount).to.equal(1);

    helper.slider.fullBar.triggerHandler('touchstart');
    expect(helper.slider.onStart.callCount).to.equal(3);
    expect(helper.slider.onMove.callCount).to.equal(2);

    helper.slider.ticks.triggerHandler('touchstart');
    expect(helper.slider.onStart.callCount).to.equal(4);
    expect(helper.slider.onMove.callCount).to.equal(3);
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
    helper.createRangeSlider(sliderConf);
    helper.slider.onStart = sinon.spy();
    helper.slider.onMove = sinon.spy();
    helper.slider.onPointerFocus = sinon.spy();

    helper.slider.unbindEvents(); //remove previously bound events
    helper.slider.bindEvents();

    helper.slider.selBar.triggerHandler('mousedown');
    expect(helper.slider.onStart.callCount).to.equal(1);
    expect(helper.slider.onMove.callCount).to.equal(1);

    helper.slider.minH.triggerHandler('mousedown');
    expect(helper.slider.onStart.callCount).to.equal(2);
    expect(helper.slider.onMove.callCount).to.equal(1);

    helper.slider.maxH.triggerHandler('mousedown');
    expect(helper.slider.onStart.callCount).to.equal(3);
    expect(helper.slider.onMove.callCount).to.equal(1);

    helper.slider.fullBar.triggerHandler('mousedown');
    expect(helper.slider.onStart.callCount).to.equal(4);
    expect(helper.slider.onMove.callCount).to.equal(2);

    helper.slider.ticks.triggerHandler('mousedown');
    expect(helper.slider.onStart.callCount).to.equal(5);
    expect(helper.slider.onMove.callCount).to.equal(3);

    helper.slider.minH.triggerHandler('focus');
    expect(helper.slider.onPointerFocus.callCount).to.equal(1);
    helper.slider.maxH.triggerHandler('focus');
    expect(helper.slider.onPointerFocus.callCount).to.equal(2);
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
    helper.createRangeSlider(sliderConf);
    helper.slider.onStart = sinon.spy();
    helper.slider.onMove = sinon.spy();
    helper.slider.onPointerFocus = sinon.spy();

    helper.slider.unbindEvents(); //remove previously bound events
    helper.slider.bindEvents();

    helper.slider.selBar.triggerHandler('touchstart');
    expect(helper.slider.onStart.callCount).to.equal(1);
    expect(helper.slider.onMove.callCount).to.equal(1);

    helper.slider.minH.triggerHandler('touchstart');
    expect(helper.slider.onStart.callCount).to.equal(2);
    expect(helper.slider.onMove.callCount).to.equal(1);

    helper.slider.maxH.triggerHandler('touchstart');
    expect(helper.slider.onStart.callCount).to.equal(3);
    expect(helper.slider.onMove.callCount).to.equal(1);

    helper.slider.fullBar.triggerHandler('touchstart');
    expect(helper.slider.onStart.callCount).to.equal(4);
    expect(helper.slider.onMove.callCount).to.equal(2);

    helper.slider.ticks.triggerHandler('touchstart');
    expect(helper.slider.onStart.callCount).to.equal(5);
    expect(helper.slider.onMove.callCount).to.equal(3);
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
    helper.createRangeSlider(sliderConf);
    helper.slider.onStart = sinon.spy();
    helper.slider.onMove = sinon.spy();
    helper.slider.onPointerFocus = sinon.spy();

    helper.slider.unbindEvents(); //remove previously bound events
    helper.slider.bindEvents();
    helper.slider.unbindEvents();

    helper.slider.selBar.triggerHandler('mousedown');
    helper.slider.minH.triggerHandler('mousedown');
    helper.slider.maxH.triggerHandler('mousedown');
    helper.slider.fullBar.triggerHandler('mousedown');
    helper.slider.ticks.triggerHandler('mousedown');
    helper.slider.minH.triggerHandler('focus');
    expect(helper.slider.onStart.callCount).to.equal(0);
    expect(helper.slider.onMove.callCount).to.equal(0);
    expect(helper.slider.onPointerFocus.callCount).to.equal(0);
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
        helper.createSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        helper.fireMouseup();
      });

      it('should handle mousedown on minH correctly when keyboardSupport is true', function() {
        sinon.spy(helper.slider, 'calcViewDimensions');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'focusElement');

        var event = helper.fireMousedown(helper.slider.minH, 0);

        helper.slider.calcViewDimensions.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on minH correctly when keyboardSupport is false', function() {
        helper.scope.slider.options.keyboardSupport = false;
        helper.scope.$digest();

        sinon.spy(helper.slider, 'calcViewDimensions');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'focusElement');

        var event = helper.fireMousedown(helper.slider.minH, 0);

        helper.slider.calcViewDimensions.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.focusElement.called.should.be.false;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is on the middle', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnChange');
        var event = helper.fireMousedown(helper.slider.minH, 0);
        var expectedValue = 50,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.value).to.equal(expectedValue);
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is before the slider and previous value was different than 0', function() {
        helper.scope.slider.value = 50;
        helper.scope.$digest();

        sinon.spy(helper.slider, 'positionTrackingHandle');
        var event = helper.fireMousedown(helper.slider.minH, 0);
        helper.fireMousemove(-100);
        expect(helper.scope.slider.value).to.equal(0);
        helper.slider.positionTrackingHandle.called.should.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is after the slider and previous value was different than 100', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        var event = helper.fireMousedown(helper.slider.minH, 0);
        helper.fireMousemove(helper.slider.maxPos + 100);
        expect(helper.scope.slider.value).to.equal(100);
        helper.slider.positionTrackingHandle.called.should.be.true;
      });

      it('should call correct callbacks on slider end and keep handle focused when keyboardSupport is true', function() {
        var event = helper.fireMousedown(helper.slider.minH, 0);

        sinon.spy(helper.slider, 'callOnEnd');
        sinon.spy(helper.slider.scope, '$emit');
        helper.fireMouseup();

        expect(helper.slider.tracking).to.equal('rzSliderModel');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
        helper.slider.callOnEnd.called.should.be.true;
        helper.slider.scope.$emit.calledWith('slideEnded').should.be.true;
      });

      it('should call correct callbacks on slider end and not keep handle focused when keyboardSupport is false', function() {
        helper.scope.slider.options.keyboardSupport = false;
        helper.scope.$digest();
        var event = helper.fireMousedown(helper.slider.minH, 0);

        sinon.spy(helper.slider, 'callOnEnd');
        sinon.spy(helper.slider.scope, '$emit');

        helper.fireMouseup();

        expect(helper.slider.tracking).to.equal('');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.false;
        helper.slider.callOnEnd.called.should.be.true;
        helper.slider.scope.$emit.calledWith('slideEnded').should.be.true;
      });

      it('should handle click on fullbar and move minH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');

        var expectedValue = 12,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

        helper.fireMousedown(helper.slider.fullBar, offset);

        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move minH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');

        var expectedValue = 12,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

        var event = helper.fireMousedown(helper.slider.selBar, offset);

        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on ticks and move minH', function() {
        helper.scope.slider.options.step = 10;
        helper.scope.slider.options.showTicks = true;
        helper.scope.$digest();
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');

        var expectedValue = 10,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

        helper.fireMousedown(helper.slider.ticks, offset);

        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
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
        helper.createRangeSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        helper.fireMouseup();
      });

      it('should handle mousedown on minH correctly when keyboardSupport is true', function() {
        sinon.spy(helper.slider, 'calcViewDimensions');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'focusElement');

        var event = helper.fireMousedown(helper.slider.minH, 0);

        helper.slider.calcViewDimensions.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on minH correctly when keyboardSupport is false', function() {
        helper.scope.slider.options.keyboardSupport = false;
        helper.scope.$digest();

        sinon.spy(helper.slider, 'calcViewDimensions');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'focusElement');

        var event = helper.fireMousedown(helper.slider.minH, 0);

        helper.slider.calcViewDimensions.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.focusElement.called.should.be.false;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on maxH correctly when keyboardSupport is true', function() {
        sinon.spy(helper.slider, 'calcViewDimensions');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'focusElement');

        var event = helper.fireMousedown(helper.slider.maxH, 0);

        helper.slider.calcViewDimensions.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(helper.slider.tracking).to.equal('rzSliderHigh');
        expect(helper.slider.maxH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on maxH correctly when keyboardSupport is false', function() {
        helper.scope.slider.options.keyboardSupport = false;
        helper.scope.$digest();

        sinon.spy(helper.slider, 'calcViewDimensions');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'focusElement');

        var event = helper.fireMousedown(helper.slider.maxH, 0);

        helper.slider.calcViewDimensions.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.focusElement.called.should.be.false;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(helper.slider.tracking).to.equal('rzSliderHigh');
        expect(helper.slider.maxH.hasClass('rz-active')).to.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is on the middle', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnChange');
        var event = helper.fireMousedown(helper.slider.minH, 0);
        var expectedValue = 50,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.min).to.equal(expectedValue);
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on maxH correctly when mouse is on the middle', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnChange');
        helper.fireMousedown(helper.slider.maxH, 0);
        var expectedValue = 50,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.max).to.equal(expectedValue);
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on minH and switch min/max if needed', function() {
        helper.scope.slider.min = 40;
        helper.scope.slider.max = 60;
        helper.scope.$digest();

        sinon.spy(helper.slider, 'focusElement');
        helper.fireMousedown(helper.slider.minH, 0);
        var expectedValue = 80,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);

        expect(helper.scope.slider.min).to.equal(60);
        expect(helper.scope.slider.max).to.equal(80);
        helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
      });

      it('should handle click and drag on minH and switch min/max if needed when keyboardSupport is false', function() {
        helper.scope.slider.options.keyboardSupport = false;
        helper.scope.slider.min = 40;
        helper.scope.slider.max = 60;
        helper.scope.$digest();

        sinon.spy(helper.slider, 'focusElement');
        helper.fireMousedown(helper.slider.minH, 0);
        var expectedValue = 80,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);

        expect(helper.scope.slider.min).to.equal(60);
        expect(helper.scope.slider.max).to.equal(80);
        helper.slider.focusElement.called.should.be.false;
      });

      it('should handle click and drag on maxH and switch min/max if needed', function() {
        helper.scope.slider.min = 40;
        helper.scope.slider.max = 60;
        helper.scope.$digest();

        sinon.spy(helper.slider, 'focusElement');
        helper.fireMousedown(helper.slider.maxH, 0);
        var expectedValue = 20,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);

        expect(helper.scope.slider.min).to.equal(20);
        expect(helper.scope.slider.max).to.equal(40);
        helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
      });

      it('should handle click and drag on maxH and switch min/max if needed when keyboardSupport is false', function() {
        helper.scope.slider.options.keyboardSupport = false;
        helper.scope.slider.min = 40;
        helper.scope.slider.max = 60;
        helper.scope.$digest();

        sinon.spy(helper.slider, 'focusElement');
        helper.fireMousedown(helper.slider.maxH, 0);
        var expectedValue = 20,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);

        expect(helper.scope.slider.min).to.equal(20);
        expect(helper.scope.slider.max).to.equal(40);
        helper.slider.focusElement.called.should.be.false;
      });

      it('should handle click on fullbar and move minH when click pos is nearer to minH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');
        sinon.spy(helper.slider, 'focusElement');

        var expectedValue = 10,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

        var event = helper.fireMousedown(helper.slider.fullBar, offset);

        expect(helper.scope.slider.min).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on fullbar and move maxH when click pos is nearer to maxH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');
        sinon.spy(helper.slider, 'focusElement');

        var expectedValue = 90,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

        var event = helper.fireMousedown(helper.slider.fullBar, offset);

        expect(helper.scope.slider.max).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderHigh');
        helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move minH when click pos is nearer to minH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');
        sinon.spy(helper.slider, 'focusElement');

        var expectedValue = 10,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

        var event = helper.fireMousedown(helper.slider.selBar, offset);

        expect(helper.scope.slider.min).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move maxH when click pos is nearer to maxH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');
        sinon.spy(helper.slider, 'focusElement');

        var expectedValue = 90,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

        var event = helper.fireMousedown(helper.slider.selBar, offset);

        expect(helper.scope.slider.max).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderHigh');
        helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
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
        helper.createSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        helper.fireMouseup();
      });

      it('should handle mousedown on minH correctly when keyboardSupport is true', function() {
        sinon.spy(helper.slider, 'calcViewDimensions');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'focusElement');

        var event = helper.fireMousedown(helper.slider.minH, 0, true);

        helper.slider.calcViewDimensions.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on minH correctly when keyboardSupport is false', function() {
        helper.scope.slider.options.keyboardSupport = false;
        helper.scope.$digest();

        sinon.spy(helper.slider, 'calcViewDimensions');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'focusElement');

        var event = helper.fireMousedown(helper.slider.minH, 0, true);

        helper.slider.calcViewDimensions.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.focusElement.called.should.be.false;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is on the middle', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnChange');
        helper.fireMousedown(helper.slider.minH, 0, true);

        var expectedValue = 50,
          offset = helper.slider.sliderElem.rzsp - helper.slider.valueToOffset(expectedValue) - helper.slider.handleHalfDim;

        helper.fireMousemove(offset, true);
        expect(helper.scope.slider.value).to.equal(expectedValue);
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is before the slider and previous value was different than 0', function() {
        helper.scope.slider.value = 50;
        helper.scope.$digest();

        sinon.spy(helper.slider, 'positionTrackingHandle');
        var event = helper.fireMousedown(helper.slider.minH, 0, true);
        helper.fireMousemove(helper.slider.maxPos + 100, true);
        expect(helper.scope.slider.value).to.equal(0);
        helper.slider.positionTrackingHandle.called.should.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is after the slider and previous value was different than 100', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        var event = helper.fireMousedown(helper.slider.minH, 0, true);
        helper.fireMousemove(-100, true);
        expect(helper.scope.slider.value).to.equal(100);
        helper.slider.positionTrackingHandle.called.should.be.true;
      });

      it('should call correct callbacks on slider end and keep handle focused when keyboardSupport is true', function() {
        var event = helper.fireMousedown(helper.slider.minH, 0, true);

        sinon.spy(helper.slider, 'callOnEnd');
        sinon.spy(helper.slider.scope, '$emit');
        helper.fireMouseup();

        expect(helper.slider.tracking).to.equal('rzSliderModel');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
        helper.slider.callOnEnd.called.should.be.true;
        helper.slider.scope.$emit.calledWith('slideEnded').should.be.true;
      });

      it('should call correct callbacks on slider end and not keep handle focused when keyboardSupport is false', function() {
        helper.scope.slider.options.keyboardSupport = false;
        helper.scope.$digest();
        var event = helper.fireMousedown(helper.slider.minH, 0, true);

        sinon.spy(helper.slider, 'callOnEnd');
        sinon.spy(helper.slider.scope, '$emit');

        helper.fireMouseup();

        expect(helper.slider.tracking).to.equal('');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.false;
        helper.slider.callOnEnd.called.should.be.true;
        helper.slider.scope.$emit.calledWith('slideEnded').should.be.true;
      });

      it('should handle click on fullbar and move minH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');

        var expectedValue = 50,
          offset = helper.slider.sliderElem.rzsp - helper.slider.valueToOffset(expectedValue) - helper.slider.handleHalfDim;

        var event = helper.fireMousedown(helper.slider.fullBar, offset, true);

        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move minH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');

        var expectedValue = 12,
          offset = helper.slider.sliderElem.rzsp - helper.slider.valueToOffset(expectedValue) - helper.slider.handleHalfDim;

        var event = helper.fireMousedown(helper.slider.selBar, offset, true);

        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on ticks and move minH', function() {
        helper.scope.slider.options.step = 10;
        helper.scope.slider.options.showTicks = true;
        helper.scope.$digest();
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');

        var expectedValue = 10,
          offset = helper.slider.sliderElem.rzsp - helper.slider.valueToOffset(expectedValue) - helper.slider.handleHalfDim;

        helper.fireMousedown(helper.slider.ticks, offset, true);

        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
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
        helper.createRangeSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        helper.fireMouseup();
      });

      it('should handle mousedown on minH correctly when keyboardSupport is true', function() {
        sinon.spy(helper.slider, 'calcViewDimensions');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'focusElement');

        var event = helper.fireMousedown(helper.slider.minH, 0, true);

        helper.slider.calcViewDimensions.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on minH correctly when keyboardSupport is false', function() {
        helper.scope.slider.options.keyboardSupport = false;
        helper.scope.$digest();

        sinon.spy(helper.slider, 'calcViewDimensions');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'focusElement');

        var event = helper.fireMousedown(helper.slider.minH, 0, true);

        helper.slider.calcViewDimensions.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.focusElement.called.should.be.false;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on maxH correctly when keyboardSupport is true', function() {
        sinon.spy(helper.slider, 'calcViewDimensions');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'focusElement');

        var event = helper.fireMousedown(helper.slider.maxH, 0, true);

        helper.slider.calcViewDimensions.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(helper.slider.tracking).to.equal('rzSliderHigh');
        expect(helper.slider.maxH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on maxH correctly when keyboardSupport is false', function() {
        helper.scope.slider.options.keyboardSupport = false;
        helper.scope.$digest();

        sinon.spy(helper.slider, 'calcViewDimensions');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'focusElement');

        var event = helper.fireMousedown(helper.slider.maxH, 0, true);

        helper.slider.calcViewDimensions.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.focusElement.called.should.be.false;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(helper.slider.tracking).to.equal('rzSliderHigh');
        expect(helper.slider.maxH.hasClass('rz-active')).to.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is on the middle', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnChange');
        var event = helper.fireMousedown(helper.slider.minH, 0, true);
        var expectedValue = 50,
          offset = helper.slider.sliderElem.rzsp - helper.slider.valueToOffset(expectedValue) - helper.slider.handleHalfDim;
        helper.fireMousemove(offset, true);
        expect(helper.scope.slider.min).to.equal(expectedValue);
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on maxH correctly when mouse is on the middle', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnChange');
        var event = helper.fireMousedown(helper.slider.maxH, 0, true);
        var expectedValue = 50,
          offset = helper.slider.sliderElem.rzsp - helper.slider.valueToOffset(expectedValue) - helper.slider.handleHalfDim;
        helper.fireMousemove(offset, true);
        expect(helper.scope.slider.max).to.equal(expectedValue);
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on minH and switch min/max if needed', function() {
        helper.scope.slider.min = 40;
        helper.scope.slider.max = 60;
        helper.scope.$digest();

        var event = helper.fireMousedown(helper.slider.minH, 0, true);
        var expectedValue = 80,
          offset = helper.slider.sliderElem.rzsp - helper.slider.valueToOffset(expectedValue) - helper.slider.handleHalfDim;
        helper.fireMousemove(offset, true);

        expect(helper.scope.slider.min).to.equal(60);
        expect(helper.scope.slider.max).to.equal(80);
      });

      it('should handle click and drag on maxH and switch min/max if needed', function() {
        helper.scope.slider.min = 40;
        helper.scope.slider.max = 60;
        helper.scope.$digest();

        var event = helper.fireMousedown(helper.slider.maxH, 0, true);
        var expectedValue = 20,
          offset = helper.slider.sliderElem.rzsp - helper.slider.valueToOffset(expectedValue) - helper.slider.handleHalfDim;
        helper.fireMousemove(offset, true);

        expect(helper.scope.slider.min).to.equal(20);
        expect(helper.scope.slider.max).to.equal(40);
      });

      it('should handle click on fullbar and move minH when click pos is nearer to minH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');
        sinon.spy(helper.slider, 'focusElement');

        var expectedValue = 10,
          offset = helper.slider.sliderElem.rzsp - helper.slider.valueToOffset(expectedValue) - helper.slider.handleHalfDim;

        var event = helper.fireMousedown(helper.slider.fullBar, offset, true);

        expect(helper.scope.slider.min).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on fullbar and move maxH when click pos is nearer to maxH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');
        sinon.spy(helper.slider, 'focusElement');

        var expectedValue = 90,
          offset = helper.slider.sliderElem.rzsp - helper.slider.valueToOffset(expectedValue) - helper.slider.handleHalfDim;

        var event = helper.fireMousedown(helper.slider.fullBar, offset, true);

        expect(helper.scope.slider.max).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderHigh');
        helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move minH when click pos is nearer to minH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');
        sinon.spy(helper.slider, 'focusElement');

        var expectedValue = 10,
          offset = helper.slider.sliderElem.rzsp - helper.slider.valueToOffset(expectedValue) - helper.slider.handleHalfDim;

        var event = helper.fireMousedown(helper.slider.selBar, offset, true);

        expect(helper.scope.slider.min).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move maxH when click pos is nearer to maxH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');
        sinon.spy(helper.slider, 'focusElement');

        var expectedValue = 90,
          offset = helper.slider.sliderElem.rzsp - helper.slider.valueToOffset(expectedValue) - helper.slider.handleHalfDim;

        var event = helper.fireMousedown(helper.slider.selBar, offset, true);

        expect(helper.scope.slider.max).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderHigh');
        helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
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
        helper.createRangeSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        helper.fireMouseup();
      });

      it('should handle click and drag on minH correctly when mouse is on the middle', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnChange');
        var event = helper.fireMousedown(helper.slider.minH, 0);
        var expectedValue = 50,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.min).to.equal(expectedValue);
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on maxH correctly when mouse is on the middle', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnChange');
        var event = helper.fireMousedown(helper.slider.maxH, 0);
        var expectedValue = 50,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.max).to.equal(expectedValue);
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on minH and switch min/max if needed', function() {
        var event = helper.fireMousedown(helper.slider.minH, 0);
        var expectedValue = 80,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);

        expect(helper.scope.slider.min).to.equal(60);
        expect(helper.scope.slider.max).to.equal(80);
      });

      it('should handle click and drag on maxH and switch min/max if needed', function() {
        var event = helper.fireMousedown(helper.slider.maxH, 0);
        var expectedValue = 20,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);

        expect(helper.scope.slider.min).to.equal(20);
        expect(helper.scope.slider.max).to.equal(40);
      });

      it('should handle click on fullbar and move minH when click pos is nearer to minH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');
        sinon.spy(helper.slider, 'focusElement');

        var expectedValue = 10,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

        var event = helper.fireMousedown(helper.slider.fullBar, offset);

        expect(helper.scope.slider.min).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on fullbar and move maxH when click pos is nearer to maxH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');
        sinon.spy(helper.slider, 'focusElement');

        var expectedValue = 90,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

        var event = helper.fireMousedown(helper.slider.fullBar, offset);

        expect(helper.scope.slider.max).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderHigh');
        helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move whole range when moved within slider range', function() {
        sinon.spy(helper.slider, 'positionTrackingBar');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');
        sinon.spy(helper.slider, 'focusElement');

        helper.fireMousedown(helper.slider.selBar, 0);

        var moveValue = 10,
          offset = helper.slider.valueToOffset(moveValue);
        helper.fireMousemove(offset);

        expect(helper.scope.slider.min).to.equal(50);
        expect(helper.scope.slider.max).to.equal(70);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
        helper.slider.positionTrackingBar.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move move range when near 0 and moved left', function() {
        helper.scope.slider.min = 10;
        helper.scope.$digest();

        helper.fireMousedown(helper.slider.selBar, 0);
        helper.fireMousemove(-1000);

        expect(helper.scope.slider.min).to.equal(0);
        expect(helper.scope.slider.max).to.equal(50);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
      });

      it('should handle click on selbar and don\'t move range when already at 0 and moved left', function() {
        helper.scope.slider.min = 0;
        helper.scope.$digest();

        helper.fireMousedown(helper.slider.selBar, 0);
        helper.fireMousemove(-100);

        expect(helper.scope.slider.min).to.equal(0);
        expect(helper.scope.slider.max).to.equal(60);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
      });

      it('should handle click on selbar and move move range when near max and moved right', function() {
        helper.scope.slider.max = 90;
        helper.scope.$digest();

        helper.fireMousedown(helper.slider.selBar, 0);
        helper.fireMousemove(helper.slider.maxPos);

        expect(helper.scope.slider.min).to.equal(50);
        expect(helper.scope.slider.max).to.equal(100);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
      });

      it('should handle click on selbar and don\'t move range when already at max and moved right', function() {
        helper.scope.slider.max = 100;
        helper.scope.$digest();

        helper.fireMousedown(helper.slider.selBar, 0);
        helper.fireMousemove(helper.slider.maxPos);

        expect(helper.scope.slider.min).to.equal(40);
        expect(helper.scope.slider.max).to.equal(100);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
      });

      it('should a working positionTrackingBar', function() {
        var newMin = 50,
          newMax = 90,
          minOffset = helper.slider.valueToOffset(newMin),
          maxOffset = helper.slider.valueToOffset(newMax);
        helper.slider.positionTrackingBar(newMin, newMax, minOffset, maxOffset);

        expect(helper.scope.slider.min).to.equal(50);
        expect(helper.scope.slider.max).to.equal(90);
        expect(helper.slider.minH.css('left')).to.equal(minOffset + 'px');
        expect(helper.slider.maxH.css('left')).to.equal(maxOffset + 'px');
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
        helper.createRangeSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        helper.fireMouseup();
      });

      it('should handle click and drag on minH correctly', function() {
        sinon.spy(helper.slider, 'positionTrackingBar');
        sinon.spy(helper.slider, 'callOnChange');

        var event = helper.fireMousedown(helper.slider.minH, 0);
        var moveValue = 10,
          offset = helper.slider.valueToOffset(moveValue);
        helper.fireMousemove(offset);

        expect(helper.scope.slider.min).to.equal(50);
        expect(helper.scope.slider.max).to.equal(70);
        helper.slider.positionTrackingBar.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on maxH correctly', function() {
        sinon.spy(helper.slider, 'positionTrackingBar');
        sinon.spy(helper.slider, 'callOnChange');
        var event = helper.fireMousedown(helper.slider.maxH, 0);
        var moveValue = 10,
          offset = helper.slider.valueToOffset(moveValue);
        helper.fireMousemove(offset);
        expect(helper.scope.slider.min).to.equal(50);
        expect(helper.scope.slider.max).to.equal(70);
        helper.slider.positionTrackingBar.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should not handle click on fullbar', function() {
        sinon.spy(helper.slider, 'callOnStart');

        var moveValue = 10,
          offset = helper.slider.valueToOffset(moveValue);

        var event = helper.fireMousedown(helper.slider.fullBar, offset);

        expect(helper.scope.slider.min).to.equal(40);
        expect(helper.scope.slider.max).to.equal(60);
        expect(helper.slider.tracking).to.equal('');
        helper.slider.callOnStart.called.should.be.false;
      });

      it('should handle click on selbar and move whole range when moved within slider range', function() {
        sinon.spy(helper.slider, 'positionTrackingBar');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');
        sinon.spy(helper.slider, 'focusElement');

        helper.fireMousedown(helper.slider.selBar, 0);

        var moveValue = 10,
          offset = helper.slider.valueToOffset(moveValue);
        helper.fireMousemove(offset);

        expect(helper.scope.slider.min).to.equal(50);
        expect(helper.scope.slider.max).to.equal(70);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
        helper.slider.positionTrackingBar.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move move range when near 0 and moved left', function() {
        helper.scope.slider.min = 10;
        helper.scope.$digest();

        helper.fireMousedown(helper.slider.selBar, 0);
        helper.fireMousemove(-1000);

        expect(helper.scope.slider.min).to.equal(0);
        expect(helper.scope.slider.max).to.equal(50);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
      });

      it('should handle click on selbar and don\'t move range when already at 0 and moved left', function() {
        helper.scope.slider.min = 0;
        helper.scope.$digest();

        helper.fireMousedown(helper.slider.selBar, 0);
        helper.fireMousemove(-100);

        expect(helper.scope.slider.min).to.equal(0);
        expect(helper.scope.slider.max).to.equal(60);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
      });

      it('should handle click on selbar and move move range when near max and moved right', function() {
        helper.scope.slider.max = 90;
        helper.scope.$digest();

        helper.fireMousedown(helper.slider.selBar, 0);
        helper.fireMousemove(helper.slider.maxPos);

        expect(helper.scope.slider.min).to.equal(50);
        expect(helper.scope.slider.max).to.equal(100);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
      });

      it('should handle click on selbar and don\'t move range when already at max and moved right', function() {
        helper.scope.slider.max = 100;
        helper.scope.$digest();

        helper.fireMousedown(helper.slider.selBar, 0);
        helper.fireMousemove(helper.slider.maxPos);

        expect(helper.scope.slider.min).to.equal(40);
        expect(helper.scope.slider.max).to.equal(100);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
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
        helper.createSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        helper.fireMouseup();
      });

      it('should handle click and drag on minH correctly when mouse is on the middle', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnChange');
        var event = helper.fireMousedown(helper.slider.minH, 0);
        var expectedValue = 50,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.value).to.equal(expectedValue);
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should do nothing when a click happen on another element than the handle', function() {
        helper.scope.slider.value = 100;
        helper.scope.$digest();

        sinon.spy(helper.slider, 'positionTrackingHandle');
        helper.fireMousedown(helper.slider.selBar, 0);
        helper.fireMousedown(helper.slider.fullBar, 0);
        helper.fireMousedown(helper.slider.ticks, 0);

        expect(helper.scope.slider.value).to.equal(100);
        helper.slider.positionTrackingHandle.called.should.be.false;
      });
    });

    describe('range horizontal slider with minRange!=0 - ', function() {
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
        helper.createRangeSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        helper.fireMouseup();
      });

      it('should not modify any value if new range would be smaller than minRange when moving minH', function() {
        helper.fireMousedown(helper.slider.minH, 0);
        var expectedValue = 50,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.min).to.equal(45);
      });

      it('should not modify any value if new range would be smaller than minRange when moving maxH', function() {
        helper.fireMousedown(helper.slider.maxH, 0);
        var expectedValue = 50,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.max).to.equal(55);
      });

      it('should modify the min value if new range is larger than minRange when moving minH', function() {
        helper.fireMousedown(helper.slider.minH, 0);
        var expectedValue = 30,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.min).to.equal(expectedValue);
      });

      it('should modify the max value if new range is larger than than minRange when moving maxH', function() {
        helper.fireMousedown(helper.slider.maxH, 0);
        var expectedValue = 70,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.max).to.equal(expectedValue);
      });

      it('should modify the min value if switch min/max with a value large enough', function() {
        helper.fireMousedown(helper.slider.minH, 0);
        var expectedValue = 80,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.min).to.equal(55);
        expect(helper.scope.slider.max).to.equal(expectedValue);
      });

      it('should modify the max value if switch min/max with a value large enough', function() {
        helper.fireMousedown(helper.slider.maxH, 0);
        var expectedValue = 20,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.min).to.equal(expectedValue);
        expect(helper.scope.slider.max).to.equal(45);
      });
    });

    describe('range horizontal slider with noSwitching - ', function() {
      beforeEach(function() {
        var sliderConf = {
          min: 45,
          max: 55,
          options: {
            floor: 0,
            ceil: 100,
            noSwitching: true
          }
        };
        helper.createRangeSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        helper.fireMouseup();
      });

      it('should not switch min and max handles if minH is dragged after maxH', function() {
        helper.fireMousedown(helper.slider.minH, 0);
        var expectedValue = 60,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.min).to.equal(55);
      });

      it('should not switch min and max handles if maxH is dragged before minH', function() {
        helper.fireMousedown(helper.slider.maxH, 0);
        var expectedValue = 20,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.max).to.equal(45);
      });

      it('should move minH if minH==maxH and click is on the left side of the bar', function() {
        helper.scope.slider.min = helper.scope.slider.max = 50;
        helper.scope.$digest();

        var expectedValue = 30,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

        helper.fireMousedown(helper.slider.fullBar, offset);

        expect(helper.scope.slider.min).to.equal(30);
        expect(helper.scope.slider.max).to.equal(50);
      });

      it('should move maxH if minH==maxH and click is on the right side of the bar', function() {
        helper.scope.slider.min = helper.scope.slider.max = 50;
        helper.scope.$digest();

        var expectedValue = 70,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

        helper.fireMousedown(helper.slider.fullBar, offset);

        expect(helper.scope.slider.min).to.equal(50);
        expect(helper.scope.slider.max).to.equal(70);
      });
    });

    describe('range horizontal slider with minRange!=0 and noSwitching - ', function() {
      beforeEach(function() {
        var sliderConf = {
          min: 45,
          max: 55,
          options: {
            floor: 0,
            ceil: 100,
            minRange: 10,
            noSwitching: true
          }
        };
        helper.createRangeSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        helper.fireMouseup();
      });

      it('should not modify any value if new range would be smaller than minRange when moving minH', function() {
        helper.fireMousedown(helper.slider.minH, 0);
        var expectedValue = 50,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.min).to.equal(45);
      });

      it('should not modify any value if new range would be smaller than minRange when moving maxH', function() {
        helper.fireMousedown(helper.slider.maxH, 0);
        var expectedValue = 50,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.max).to.equal(55);
      });

      it('should modify the min value if new range is larger than minRange when moving minH', function() {
        helper.fireMousedown(helper.slider.minH, 0);
        var expectedValue = 30,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.min).to.equal(expectedValue);
      });

      it('should modify the max value if new range is larger than than minRange when moving maxH', function() {
        helper.fireMousedown(helper.slider.maxH, 0);
        var expectedValue = 70,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.max).to.equal(expectedValue);
      });

      it('should not switch min/max when moving minH even if the range is large enough', function() {
        helper.fireMousedown(helper.slider.minH, 0);
        var expectedValue = 80,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.min).to.equal(45);
        expect(helper.scope.slider.max).to.equal(55);
      });

      it('should not switch min/max when moving maxH even if the range is large enough', function() {
        helper.fireMousedown(helper.slider.maxH, 0);
        var expectedValue = 20,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.min).to.equal(45);
        expect(helper.scope.slider.max).to.equal(55);
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
        helper.createSlider(sliderConf);
      });

      it('should toggle active style when handle focused/blured', function() {
        helper.slider.minH.triggerHandler('focus');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
        helper.slider.minH.triggerHandler('blur');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.false;
      });

      it('should increment by 1 when RIGHT is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'RIGHT');
        expect(helper.scope.slider.value).to.equal(101);
      });

      it('should increment by 1 when RIGHT is pressed with oldAPI', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'RIGHT', true);
        expect(helper.scope.slider.value).to.equal(101);
      });

      it('should decrement by 1 when LEFT is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'LEFT');
        expect(helper.scope.slider.value).to.equal(99);
      });

      it('should increment by 1 when UP is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'UP');
        expect(helper.scope.slider.value).to.equal(101);
      });

      it('should decrement by 1 when DOWN is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'DOWN');
        expect(helper.scope.slider.value).to.equal(99);
      });

      it('should increment by 10% when PAGEUP is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'PAGEUP');
        expect(helper.scope.slider.value).to.equal(120);
      });

      it('should decrement by 10% when PAGEDOWN is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'PAGEDOWN');
        expect(helper.scope.slider.value).to.equal(80);
      });

      it('should set value to min when HOME is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'HOME');
        expect(helper.scope.slider.value).to.equal(0);
      });

      it('should  set value to max when END is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'END');
        expect(helper.scope.slider.value).to.equal(200);
      });

      it('should do nothing when SPACE is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'SPACE');
        expect(helper.scope.slider.value).to.equal(100);
      });

      it('should not modify when keypress but not focused', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'RIGHT');
        expect(helper.scope.slider.value).to.equal(101);
        helper.slider.minH.triggerHandler('blur');
        helper.pressKeydown(helper.slider.minH, 'RIGHT');
        expect(helper.scope.slider.value).to.equal(101);
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
        helper.createRangeSlider(sliderConf);
      });

      it('should toggle active style when handle focused/blured', function() {
        helper.slider.minH.triggerHandler('focus');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
        expect(helper.slider.maxH.hasClass('rz-active')).to.be.false;
        helper.slider.minH.triggerHandler('blur');
        helper.slider.maxH.triggerHandler('focus');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.false;
        expect(helper.slider.maxH.hasClass('rz-active')).to.be.true;
        helper.slider.maxH.triggerHandler('blur');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.false;
        expect(helper.slider.maxH.hasClass('rz-active')).to.be.false;
      });

      it('should increment minH by 1 when RIGHT is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'RIGHT');
        expect(helper.scope.slider.min).to.equal(51);
      });

      it('should increment maxH by 1 when RIGHT is pressed', function() {
        helper.slider.maxH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.maxH, 'RIGHT');
        expect(helper.scope.slider.max).to.equal(101);
      });

      it('should decrement minH by 1 when LEFT is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'LEFT');
        expect(helper.scope.slider.min).to.equal(49);
      });

      it('should decrement maxH by 1 when LEFT is pressed', function() {
        helper.slider.maxH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.maxH, 'LEFT');
        expect(helper.scope.slider.max).to.equal(99);
      });

      it('should increment minH by 10% when PAGEUP is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'PAGEUP');
        expect(helper.scope.slider.min).to.equal(70);
      });

      it('should increment maxH by 10% when PAGEUP is pressed', function() {
        helper.slider.maxH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.maxH, 'PAGEUP');
        expect(helper.scope.slider.max).to.equal(120);
      });

      it('should decrement minH by 10% when PAGEDOWN is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'PAGEDOWN');
        expect(helper.scope.slider.min).to.equal(30);
      });

      it('should decrement maxH by 10% when PAGEDOWN is pressed', function() {
        helper.slider.maxH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.maxH, 'PAGEDOWN');
        expect(helper.scope.slider.max).to.equal(80);
      });

      it('should set minH to min when HOME is pressed on minH', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'HOME');
        expect(helper.scope.slider.min).to.equal(0);
      });

      it('should set minH value to previous min and switch min/max when HOME is pressed on maxH', function() {
        helper.slider.maxH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.maxH, 'HOME');
        expect(helper.scope.slider.min).to.equal(0);
        expect(helper.scope.slider.max).to.equal(50);
      });

      it('should set minH value to previous max and switch min/max when END is pressed on minH', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'END');
        expect(helper.scope.slider.min).to.equal(100);
        expect(helper.scope.slider.max).to.equal(200);
      });

      it('should set maxH value to max when END is pressed on maxH', function() {
        helper.slider.maxH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.maxH, 'END');
        expect(helper.scope.slider.max).to.equal(200);
      });

      it('should do nothing when SPACE is pressed on minH', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'SPACE');
        expect(helper.scope.slider.min).to.equal(50);
      });

      it('should do nothing when SPACE is pressed on maxH', function() {
        helper.slider.maxH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.maxH, 'SPACE');
        expect(helper.scope.slider.max).to.equal(100);
      });

      it('should not modify minH when keypress but not focused', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'RIGHT');
        expect(helper.scope.slider.min).to.equal(51);
        helper.slider.minH.triggerHandler('blur');
        helper.pressKeydown(helper.slider.minH, 'RIGHT');
        expect(helper.scope.slider.min).to.equal(51);
      });

      it('should not modify maxH when keypress but not focused', function() {
        helper.slider.maxH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.maxH, 'RIGHT');
        expect(helper.scope.slider.max).to.equal(101);
        helper.slider.maxH.triggerHandler('blur');
        helper.pressKeydown(helper.slider.maxH, 'RIGHT');
        expect(helper.scope.slider.max).to.equal(101);
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
        helper.createRangeSlider(sliderConf);
      });

      it('should increment minH/maxH by 1 when RIGHT is pressed on minH', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'RIGHT');
        expect(helper.scope.slider.min).to.equal(91);
        expect(helper.scope.slider.max).to.equal(111);
      });

      it('should increment minH/maxH by 1 when RIGHT is pressed on maxH', function() {
        helper.slider.maxH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.maxH, 'RIGHT');
        expect(helper.scope.slider.min).to.equal(91);
        expect(helper.scope.slider.max).to.equal(111);
      });

      it('should increment minH/maxH by 1 when LEFT is pressed on minH', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'LEFT');
        expect(helper.scope.slider.min).to.equal(89);
        expect(helper.scope.slider.max).to.equal(109);
      });

      it('should increment minH/maxH by 1 when LEFT is pressed on maxH', function() {
        helper.slider.maxH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.maxH, 'LEFT');
        expect(helper.scope.slider.min).to.equal(89);
        expect(helper.scope.slider.max).to.equal(109);
      });

      it('should increment minH/maxH by 10% when PAGEUP is pressed on minH', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'PAGEUP');
        expect(helper.scope.slider.min).to.equal(110);
        expect(helper.scope.slider.max).to.equal(130);
      });

      it('should increment minH/maxH by 10% when PAGEUP is pressed on maxH', function() {
        helper.slider.maxH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.maxH, 'PAGEUP');
        expect(helper.scope.slider.min).to.equal(110);
        expect(helper.scope.slider.max).to.equal(130);
      });

      it('should decrement minH/maxH by 10% when PAGEDOWN is pressed on minH', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'PAGEDOWN');
        expect(helper.scope.slider.min).to.equal(70);
        expect(helper.scope.slider.max).to.equal(90);
      });

      it('should decrement minH/maxH by 10% when PAGEDOWN is pressed on maxH', function() {
        helper.slider.maxH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.maxH, 'PAGEDOWN');
        expect(helper.scope.slider.min).to.equal(70);
        expect(helper.scope.slider.max).to.equal(90);
      });

      it('should set minH to min when HOME is pressed on minH', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'HOME');
        expect(helper.scope.slider.min).to.equal(0);
        expect(helper.scope.slider.max).to.equal(20);
      });

      it('should set minH to min when HOME is pressed on maxH', function() {
        helper.slider.maxH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.maxH, 'HOME');
        expect(helper.scope.slider.min).to.equal(0);
        expect(helper.scope.slider.max).to.equal(20);
      });

      it('should set minH to min when END is pressed on minH', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'END');
        expect(helper.scope.slider.min).to.equal(180);
        expect(helper.scope.slider.max).to.equal(200);
      });

      it('should set minH to min when END is pressed on maxH', function() {
        helper.slider.maxH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.maxH, 'END');
        expect(helper.scope.slider.min).to.equal(180);
        expect(helper.scope.slider.max).to.equal(200);
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
        helper.createSlider(sliderConf);
      });

      it('should increment by 1 when RIGHT is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'RIGHT');
        expect(helper.scope.slider.value).to.equal(101);
      });

      it('should increment by 1 when UP is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'UP');
        expect(helper.scope.slider.value).to.equal(101);
      });

      it('should decrement by 1 when DOWN is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'DOWN');
        expect(helper.scope.slider.value).to.equal(99);
      });

      it('should decrement by 1 when LEFT is pressed', function() {
        helper.slider.minH.triggerHandler('focus');
        helper.pressKeydown(helper.slider.minH, 'LEFT');
        expect(helper.scope.slider.value).to.equal(99);
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
      helper.createSlider(sliderConf);
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'PAGEDOWN');
      expect(helper.scope.slider.value).to.equal(0);
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
      helper.createSlider(sliderConf);
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'PAGEUP');
      expect(helper.scope.slider.value).to.equal(1000);
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
      helper.createSlider(sliderConf);
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'LEFT');
      expect(helper.scope.slider.value).to.equal(10);
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
      helper.createSlider(sliderConf);
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'LEFT');
      expect(helper.scope.slider.value).to.equal(10);
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
      helper.createRangeSlider(sliderConf);
      //try to move minH right
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'RIGHT');
      expect(helper.scope.slider.min).to.equal(45);

      //try to move maxH left
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'LEFT');
      expect(helper.scope.slider.max).to.equal(55);
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
      helper.createRangeSlider(sliderConf);

      //try to move minH left
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'LEFT');
      expect(helper.scope.slider.min).to.equal(44);

      //try to move maxH right
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'RIGHT');
      expect(helper.scope.slider.max).to.equal(56);
    });
  });
});
