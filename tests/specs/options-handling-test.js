(function() {
  "use strict";

  describe('Options handling - ', function() {
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
        expect(helper.slider.sliderElem.hasClass('rz-vertical')).to.be.false;
      });

      it('vertical slider should take the full height and get correct position/dimension properties', function() {
        helper.scope.$digest();
        helper.scope.slider.options.vertical = true;
        helper.scope.$digest();
        expect(helper.element[0].getBoundingClientRect().height).to.equal(1000);
        expect(helper.slider.positionProperty).to.equal('bottom');
        expect(helper.slider.dimensionProperty).to.equal('height');
        expect(helper.slider.sliderElem.hasClass('rz-vertical')).to.be.true;
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

      it('should set correct step/floor/ceil and translate function when stepsArray is used with values', function() {
        helper.scope.slider.options.stepsArray = ['A', 'B', 'C', 'D', 'E'];
        helper.scope.$digest();
        expect(helper.slider.options.step).to.equal(1);
        expect(helper.slider.options.floor).to.equal(0);
        expect(helper.slider.options.ceil).to.equal(4);

        expect(helper.slider.customTrFn(0)).to.equal('A');
        expect(helper.slider.customTrFn(2)).to.equal('C');
      });

      it('should set correct step/floor/ceil and translate function when stepsArray is used with values and ticks', function() {
        helper.scope.slider.options.stepsArray = ['A', 'B', 'C', 'D', 'E'];
        helper.scope.slider.options.showTicks = true;
        helper.scope.$digest();
        expect(helper.slider.options.step).to.equal(1);
        expect(helper.slider.options.floor).to.equal(0);
        expect(helper.slider.options.ceil).to.equal(4);

        expect(helper.slider.customTrFn(0)).to.equal('A');
        expect(helper.slider.customTrFn(2)).to.equal('C');
      });

      it('should set correct step/floor/ceil and translate function when stepsArray is used with objects', function() {
        helper.scope.slider.options.stepsArray = [
          {value: 'A'},
          {value: 'B'},
          {value: 'C'},
          {value: 'D'},
          {value: 'E'}
        ];
        helper.scope.$digest();
        expect(helper.slider.options.step).to.equal(1);
        expect(helper.slider.options.floor).to.equal(0);
        expect(helper.slider.options.ceil).to.equal(4);

        expect(helper.slider.customTrFn(0)).to.equal('A');
        expect(helper.slider.customTrFn(2)).to.equal('C');
      });


      it('should set correct step/floor/ceil and translate function when stepsArray is used with objects containing legends', function() {
        helper.scope.slider.options.stepsArray = [
          {value: 'A'},
          {value: 'B', legend: 'Legend B'},
          {value: 'C'},
          {value: 'D', legend: 'Legend D'},
          {value: 'E'}
        ];
        helper.scope.slider.options.showTicks = true;
        helper.scope.$digest();

        expect(helper.slider.options.step).to.equal(1);
        expect(helper.slider.options.floor).to.equal(0);
        expect(helper.slider.options.ceil).to.equal(4);

        expect(helper.slider.customTrFn(0)).to.equal('A');
        expect(helper.slider.customTrFn(2)).to.equal('C');

        expect(helper.slider.getLegend(1)).to.equal('Legend B');
        expect(helper.slider.getLegend(3)).to.equal('Legend D');

        expect(helper.element[0].querySelectorAll('.rz-tick-legend')).to.have.length(2);
      });

      it('should allow a custom translate function when stepsArray is used', function() {
        helper.scope.slider.options.stepsArray = [{'foo': 'barA'}, {'foo': 'barB'}, {'foo': 'barC'}];
        helper.scope.slider.options.translate = function(value, sliderId, label) {
          if (value >= 0 && value < helper.scope.slider.options.stepsArray.length) {
            return helper.scope.slider.options.stepsArray[value]['foo'];
          } else {
            return ""
          }
        };
        helper.scope.$digest();
        expect(helper.slider.options.step).to.equal(1);
        expect(helper.slider.options.floor).to.equal(0);
        expect(helper.slider.options.ceil).to.equal(2);

        expect(helper.slider.customTrFn(0)).to.equal('barA');
        expect(helper.slider.customTrFn(2)).to.equal('barC');
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

      it('should set alwaysHide on floor/ceil when hideLimitLabels is set to true', function() {
        var sliderConf = {
          value: 10,
          options: {
            hideLimitLabels: true
          }
        };
        helper.createSlider(sliderConf);
        expect(helper.slider.flrLab.rzAlwaysHide).to.be.true;
        expect(helper.slider.ceilLab.rzAlwaysHide).to.be.true;
      });

      it('should set alwaysHide on minLab when hidePointerLabels is set to true on a single slider', function() {
        var sliderConf = {
          value: 10,
          options: {
            hidePointerLabels: true
          }
        };
        helper.createSlider(sliderConf);
        expect(helper.slider.minLab.rzAlwaysHide).to.be.true;
      });

      it('should set alwaysHide on minLab when hidePointerLabels is set to true on a single slider', function() {
        var sliderConf = {
          min: 10,
          max: 100,
          options: {
            hidePointerLabels: true
          }
        };
        helper.createRangeSlider(sliderConf);
        expect(helper.slider.minLab.rzAlwaysHide).to.be.true;
        expect(helper.slider.maxLab.rzAlwaysHide).to.be.true;
        expect(helper.slider.cmbLab.rzAlwaysHide).to.be.true;
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
              if (type === 'min') {
                if (v < 5) return 'red';
                return 'green';
              }

              if (type === 'max') {
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
              if (type === 'min') {
                if (v < 5) return 'red';
                return 'green';
              }

              if (type === 'max') {
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

    describe('range slider specific - ', function() {
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

    describe('options expression specific - ', function() {
      it('should safely handle null expressions', function() {
        var sliderConf = {
          value: 10,
          optionsExpression: 'thisDoesntExist'
        };

        helper.createSlider(sliderConf);
        helper.scope.$digest();
        expect(helper.slider.step).to.equal(1);
      });

      it('should not cause an infinite $digest loop with an expression that always returns a new object', function() {
        var sliderConf = {
          value: 10,
          options: function() {
            return {
              floor: 1,
              ceil: 1000
            };
          },
          optionsExpression: 'slider.options()'
        };

        helper.createSlider(sliderConf);
        helper.scope.$digest();
        expect(helper.slider.minValue).to.equal(1);
        expect(helper.slider.maxValue).to.equal(1000);
      });
    });
  });

  describe('Right to left Options handling - ', function() {
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

    describe('tests with same config', function() {
      beforeEach(function() {
        var sliderConf = {
          value: 10,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
            rightToLeft: true
          }
        };
        helper.createSlider(sliderConf);
      });

      it('horizontal slider should take the full width and get correct position/dimension properties', function() {
        helper.scope.$digest();
        expect(helper.element[0].getBoundingClientRect().width).to.equal(1000);
        expect(helper.slider.positionProperty).to.equal('left');
        expect(helper.slider.dimensionProperty).to.equal('width');
        expect(helper.slider.sliderElem.hasClass('rz-vertical')).to.be.false;
      });

      it('vertical slider should take the full height and get correct position/dimension properties', function() {
        helper.scope.$digest();
        helper.scope.slider.options.vertical = true;
        helper.scope.$digest();
        expect(helper.element[0].getBoundingClientRect().height).to.equal(1000);
        expect(helper.slider.positionProperty).to.equal('bottom');
        expect(helper.slider.dimensionProperty).to.equal('height');
        expect(helper.slider.sliderElem.hasClass('rz-vertical')).to.be.true;
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

      it('should set the intermediateTicks flag to true when showTicks is an integer', function() {
        helper.scope.slider.options.showTicks = 10;
        helper.scope.$digest();
        expect(helper.slider.intermediateTicks).to.be.true;
      });

      it('should set the intermediateTicks flag to true when showTicksValues is an integer', function() {
        helper.scope.slider.options.showTicksValues = 10;
        helper.scope.$digest();
        expect(helper.slider.intermediateTicks).to.be.true;
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
            },
            rightToLeft: true
          }
        };
        helper.createSlider(sliderConf);
        expect(helper.slider.customTrFn(0)).to.equal('custom value');
        expect(helper.slider.customTrFn(100)).to.equal('custom value');
      });

      it('should set maxValue to rzSliderModel if no ceil is set for a single slider', function() {
        var sliderConf = {
          value: 10,
          rightToLeft: true
        };
        helper.createSlider(sliderConf);
        expect(helper.slider.maxValue).to.equal(10);
      });

      it('should set maxValue to rzSliderHigh if no ceil is set for a range slider', function() {
        var sliderConf = {
          min: 10,
          max: 100,
          rightToLeft: true
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
            showSelectionBar: true,
            rightToLeft: true
          }
        };
        helper.createSlider(sliderConf);
        var expectedDimension = Math.floor(helper.slider.valueToOffset(8) + helper.slider.handleHalfDim);
        expect(helper.slider.selBar[0].getBoundingClientRect().width).to.equal(expectedDimension);
        expect(helper.slider.selBar.css('left')).to.equal(helper.slider.valueToOffset(2) + helper.slider.handleHalfDim + 'px');
      });

      it('should set the correct dimension/position for selection bar for single slider with showSelectionBarEnd=true', function() {
        var sliderConf = {
          value: 2,
          options: {
            floor: 0,
            ceil: 10,
            showSelectionBarEnd: true,
            rightToLeft: true
          }
        };
        helper.createSlider(sliderConf);
        var expectedDimension = helper.slider.valueToOffset(2) + helper.slider.handleHalfDim;
        expect(helper.slider.selBar.css('width')).to.equal(expectedDimension + 'px');
        expect(helper.slider.selBar.css('left')).to.equal('0px');
      });

      it('should set the correct dimension/position for selection bar for single slider with showSelectionBarFromValue is used with a value on the left', function() {
        var sliderConf = {
          value: 15,
          options: {
            floor: 0,
            ceil: 20,
            showSelectionBarFromValue: 10,
            rightToLeft: true
          }
        };
        helper.createSlider(sliderConf);
        var expectedDimension = helper.slider.valueToOffset(15),
          expectedPosition = helper.slider.valueToOffset(15) + helper.slider.handleHalfDim;
        expect(helper.slider.selBar.css('width')).to.equal(expectedDimension + 'px');
        expect(helper.slider.selBar.css('left')).to.equal(expectedPosition + 'px');
      });

      it('should set the correct dimension/position for selection bar for single slider with showSelectionBarFromValue is used with a value on the right', function() {
        var sliderConf = {
          value: 3,
          options: {
            floor: 0,
            ceil: 20,
            showSelectionBarFromValue: 10,
            rightToLeft: true
          }
        };
        helper.createSlider(sliderConf);
        var expectedDimension = Math.floor(helper.slider.valueToOffset(13)),
          expectedPosition = helper.slider.valueToOffset(10) + helper.slider.handleHalfDim;
        expect(helper.slider.selBar[0].getBoundingClientRect().width).to.equal(expectedDimension);
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
            },
            rightToLeft: true
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
          },
          rightToLeft: true
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
            },
            rightToLeft: true
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
            onStart: sinon.spy(),
            rightToLeft: true
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
            onChange: sinon.spy(),
            rightToLeft: true
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
            onEnd: sinon.spy(),
            rightToLeft: true
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
            },
            rightToLeft: true
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
            },
            rightToLeft: true
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
              if (type === 'min') {
                if (v < 5) return 'red';
                return 'green';
              }

              if (type === 'max') {
                if (v < 5) return 'blue';
                return 'orange';
              }
            },
            rightToLeft: true
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
              if (type === 'min') {
                if (v < 5) return 'red';
                return 'green';
              }

              if (type === 'max') {
                if (v < 5) return 'blue';
                return 'orange';
              }
            },
            rightToLeft: true
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

    describe('range slider spcific - ', function() {
      beforeEach(function() {
        var sliderConf = {
          min: 10,
          max: 90,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
            rightToLeft: true
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

    describe('options expression specific - ', function() {
      it('should safely handle null expressions', function() {
        var sliderConf = {
          value: 10,
          optionsExpression: 'thisDoesntExist'
        };

        helper.createSlider(sliderConf);
        helper.scope.$digest();
        expect(helper.slider.step).to.equal(1);
      });

      it('should not cause an infinite $digest loop with an expression that always returns a new object', function() {
        var sliderConf = {
          value: 10,
          options: function() {
            return {
              floor: 1,
              ceil: 1000
            };
          },
          optionsExpression: 'slider.options()'
        };

        helper.createSlider(sliderConf);
        helper.scope.$digest();
        expect(helper.slider.minValue).to.equal(1);
        expect(helper.slider.maxValue).to.equal(1000);
      });
    });
  });

}());
