;(function() {
  'use strict'

  describe('Options handling - ', function() {
    var helper, RzSliderOptions, $rootScope, $timeout

    beforeEach(module('test-helper'))

    beforeEach(inject(function(
      TestHelper,
      _RzSliderOptions_,
      _$rootScope_,
      _$timeout_
    ) {
      helper = TestHelper
      RzSliderOptions = _RzSliderOptions_
      $rootScope = _$rootScope_
      $timeout = _$timeout_
    }))

    afterEach(function() {
      helper.clean()
    })

    describe('tests with same config', function() {
      beforeEach(function() {
        var sliderConf = {
          value: 10,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
          },
        }
        helper.createSlider(sliderConf)
      })

      it('horizontal slider should take the full width and get correct position/dimension properties', function() {
        helper.scope.$digest()
        expect(helper.element[0].getBoundingClientRect().width).to.equal(1000)
        expect(helper.slider.positionProperty).to.equal('left')
        expect(helper.slider.dimensionProperty).to.equal('width')
        expect(helper.slider.sliderElem.hasClass('rz-vertical')).to.be.false
      })

      it('vertical slider should take the full height and get correct position/dimension properties', function() {
        helper.scope.$digest()
        helper.scope.slider.options.vertical = true
        helper.scope.$digest()
        expect(helper.element[0].getBoundingClientRect().height).to.equal(1000)
        expect(helper.slider.positionProperty).to.equal('bottom')
        expect(helper.slider.dimensionProperty).to.equal('height')
        expect(helper.slider.sliderElem.hasClass('rz-vertical')).to.be.true
      })

      it('should prevent invalid step', function() {
        helper.scope.slider.options.step = 0
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)

        helper.scope.slider.options.step = -1
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
      })

      it('should not round value to step if enforceStep is false', function() {
        helper.scope.slider.options.enforceStep = false
        helper.scope.$digest()

        helper.scope.slider.value = 14
        helper.scope.$digest()
        expect(helper.scope.slider.value).to.equal(14)
      })

      it('should round value to step if enforceStep is true', function() {
        helper.scope.slider.options.enforceStep = true
        helper.scope.$digest()

        helper.scope.slider.value = 14
        helper.scope.$digest()
        expect(helper.scope.slider.value).to.equal(10)
      })

      it('should set the showTicks scope flag to true when showTicks is true', function() {
        helper.scope.slider.options.showTicks = true
        helper.scope.$digest()
        expect(helper.slider.scope.showTicks).to.be.true
      })

      it('should set the showTicks scope flag to true when showTicksValues is true', function() {
        helper.scope.slider.options.showTicksValues = true
        helper.scope.$digest()
        expect(helper.slider.scope.showTicks).to.be.true
      })

      it('should set not accept draggableRange to true when slider is a single one', function() {
        helper.scope.slider.options.draggableRange = true
        helper.scope.$digest()
        expect(helper.slider.options.draggableRange).to.be.false
      })

      it('should set not accept draggableRangeOnly to true when slider is a single one', function() {
        helper.scope.slider.options.draggableRangeOnly = true
        helper.scope.$digest()
        expect(helper.slider.options.draggableRange).to.be.false
        expect(helper.slider.options.draggableRangeOnly).to.be.false
      })

      it('should set correct step/floor/ceil and translate function when stepsArray is used with values', function() {
        helper.scope.slider.value = 'C'
        helper.scope.slider.options.stepsArray = ['A', 'B', 'C', 'D', 'E']
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(4)
        expect(helper.slider.lowValue).to.equal(2)
      })

      it('should set correct step/floor/ceil and translate function when stepsArray is used with values and bindIndexForStepsArray is true', function() {
        helper.scope.slider.value = 2
        helper.scope.slider.options.stepsArray = ['A', 'B', 'C', 'D', 'E']
        helper.scope.slider.options.bindIndexForStepsArray = true
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(4)
        expect(helper.slider.lowValue).to.equal(2)
      })

      it('should set correct step/floor/ceil when stepsArray is used with values and ticks', function() {
        helper.scope.slider.value = 'C'
        helper.scope.slider.options.stepsArray = ['A', 'B', 'C', 'D', 'E']
        helper.scope.slider.options.showTicks = true
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(4)
        expect(helper.slider.lowValue).to.equal(2)
      })

      it('should set correct step/floor/ceil when stepsArray is used with objects', function() {
        helper.scope.slider.value = 'D'
        helper.scope.slider.options.stepsArray = [
          { value: 'A' },
          { value: 'B' },
          { value: 'C' },
          { value: 'D' },
          { value: 'E' },
        ]
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(4)
        expect(helper.slider.lowValue).to.equal(3)
      })

      it('should set correct step/floor/ceil when stepsArray is used with objects and bindIndexForStepsArray is true', function() {
        helper.scope.slider.value = 3
        helper.scope.slider.options.stepsArray = [
          { value: 'A' },
          { value: 'B' },
          { value: 'C' },
          { value: 'D' },
          { value: 'E' },
        ]
        helper.scope.slider.options.bindIndexForStepsArray = true
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(4)
        expect(helper.slider.lowValue).to.equal(3)
      })

      it('should set correct step/floor/ceil function when stepsArray is used with objects containing legends', function() {
        helper.scope.slider.value = 'D'
        helper.scope.slider.options.stepsArray = [
          { value: 'A' },
          { value: 'B', legend: 'Legend B' },
          { value: 'C' },
          { value: 'D', legend: 'Legend D' },
          { value: 'E' },
        ]
        helper.scope.slider.options.showTicks = true
        helper.scope.$digest()

        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(4)
        expect(helper.slider.lowValue).to.equal(3)

        expect(helper.slider.getLegend(1)).to.equal('Legend B')
        expect(helper.slider.getLegend(3)).to.equal('Legend D')

        expect(
          helper.element[0].querySelectorAll('.rz-tick-legend')
        ).to.have.length(2)
      })

      it('should set correct step/floor/ceil function when stepsArray is used with objects containing legends and bindIndexForStepsArray is true', function() {
        helper.scope.slider.value = 3
        helper.scope.slider.options.stepsArray = [
          { value: 'A' },
          { value: 'B', legend: 'Legend B' },
          { value: 'C' },
          { value: 'D', legend: 'Legend D' },
          { value: 'E' },
        ]
        helper.scope.slider.options.bindIndexForStepsArray = true
        helper.scope.slider.options.showTicks = true
        helper.scope.$digest()

        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(4)
        expect(helper.slider.lowValue).to.equal(3)

        expect(helper.slider.getLegend(1)).to.equal('Legend B')
        expect(helper.slider.getLegend(3)).to.equal('Legend D')

        expect(
          helper.element[0].querySelectorAll('.rz-tick-legend')
        ).to.have.length(2)
      })

      it('should set correct step/floor/ceil when stepsArray is used with Date using same instances', function() {
        var dates = []
        for (var i = 1; i <= 7; i++) {
          dates.push(new Date(2016, 7, i))
        }
        helper.scope.slider.value = dates[3]
        helper.scope.slider.options.stepsArray = dates
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(6)
        expect(helper.slider.lowValue).to.equal(3)
      })

      it('should set correct step/floor/ceil when stepsArray is used with Date using different instances', function() {
        var dates = []
        for (var i = 1; i <= 7; i++) {
          dates.push(new Date(2016, 7, i))
        }
        helper.scope.slider.value = new Date(2016, 7, 4)
        helper.scope.slider.options.stepsArray = dates
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(6)
        expect(helper.slider.lowValue).to.equal(3)
      })

      it('should set correct step/floor/ceil when stepsArray is used with Object with Date values using different instances', function() {
        var dates = []
        for (var i = 1; i <= 7; i++) {
          dates.push(new Date(2016, 7, i))
        }
        helper.scope.slider.value = new Date(2016, 7, 4)
        helper.scope.slider.options.stepsArray = dates.map(function(val) {
          return { value: val }
        })
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(6)
        expect(helper.slider.lowValue).to.equal(3)
      })

      it('should allow a custom translate function when stepsArray is used', function() {
        helper.scope.slider.options.stepsArray = [
          { value: 'A', foo: 'barA' },
          { value: 'B', foo: 'barB' },
          { value: 'C', foo: 'barC' },
        ]
        helper.scope.slider.options.translate = function(
          value,
          sliderId,
          label
        ) {
          return 'value: ' + value
        }
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(2)

        expect(helper.slider.customTrFn('A')).to.equal('value: A')
        expect(helper.slider.customTrFn('C')).to.equal('value: C')
      })

      it('should allow a custom translate function when stepsArray is used and bindIndexForStepsArray is true', function() {
        helper.scope.slider.options.stepsArray = [
          { foo: 'barA' },
          { foo: 'barB' },
          { foo: 'barC' },
        ]
        helper.scope.slider.options.bindIndexForStepsArray = true
        helper.scope.slider.options.translate = function(
          value,
          sliderId,
          label
        ) {
          if (
            value >= 0 &&
            value < helper.scope.slider.options.stepsArray.length
          ) {
            return helper.scope.slider.options.stepsArray[value]['foo']
          } else {
            return ''
          }
        }
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(2)

        expect(helper.slider.customTrFn(0)).to.equal('barA')
        expect(helper.slider.customTrFn(2)).to.equal('barC')
      })

      it('should sanitize rzSliderModel between floor and ceil', function() {
        helper.scope.slider.options.enforceRange = true
        helper.scope.slider.value = 1000
        helper.scope.$digest()
        expect(helper.scope.slider.value).to.equal(100)

        helper.scope.slider.value = -1000
        helper.scope.$digest()
        $timeout.flush() //to flush the throttle function
        expect(helper.scope.slider.value).to.equal(0)
      })
    })

    describe('tests with specific config', function() {
      it('should accept custom translate function', function() {
        var sliderConf = {
          value: 10,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
            translate: function(v) {
              return 'custom value'
            },
          },
        }
        helper.createSlider(sliderConf)
        expect(helper.slider.customTrFn(0)).to.equal('custom value')
        expect(helper.slider.customTrFn(100)).to.equal('custom value')
      })

      it('should set maxValue to rzSliderModel if no ceil is set for a single slider', function() {
        var sliderConf = {
          value: 10,
        }
        helper.createSlider(sliderConf)
        expect(helper.slider.maxValue).to.equal(10)
      })

      it('should set maxValue to rzSliderHigh if no ceil is set for a range slider', function() {
        var sliderConf = {
          min: 10,
          max: 100,
        }
        helper.createRangeSlider(sliderConf)
        expect(helper.slider.maxValue).to.equal(100)
      })

      it('should set the correct dimension/position for selection bar for single slider with showSelectionBar=true', function() {
        var sliderConf = {
          value: 2,
          options: {
            floor: 0,
            ceil: 10,
            showSelectionBar: true,
          },
        }
        helper.createSlider(sliderConf)
        var expectedDimension =
          Math.round(helper.slider.valueToPosition(2)) +
          helper.slider.handleHalfDim
        expect(helper.slider.selBar.css('width')).to.equal(
          expectedDimension + 'px'
        )
        expect(helper.slider.selBar.css('left')).to.equal('0px')
      })

      it('should set the correct dimension/position for selection bar for single slider with showSelectionBarEnd=true', function() {
        var sliderConf = {
          value: 2,
          options: {
            floor: 0,
            ceil: 10,
            showSelectionBarEnd: true,
          },
        }
        helper.createSlider(sliderConf)
        var expectedDimension = Math.floor(
            helper.slider.valueToPosition(8) + helper.slider.handleHalfDim
          ),
          actualDimension = Math.floor(
            helper.slider.selBar[0].getBoundingClientRect().width
          )
        expect(actualDimension).to.equal(expectedDimension)

        var expectedPosition =
          Math.round(helper.slider.valueToPosition(2)) +
          helper.slider.handleHalfDim
        expect(helper.slider.selBar.css('left')).to.equal(
          expectedPosition + 'px'
        )
      })

      it('should set the correct dimension/position for selection bar for single slider with showSelectionBarFromValue is used with a value on the right', function() {
        var sliderConf = {
          value: 15,
          options: {
            floor: 0,
            ceil: 20,
            showSelectionBarFromValue: 10,
          },
        }
        helper.createSlider(sliderConf)
        var expectedDimension = Math.round(helper.slider.valueToPosition(5)),
          expectedPosition =
            Math.round(helper.slider.valueToPosition(10)) +
            helper.slider.handleHalfDim
        expect(helper.slider.selBar.css('width')).to.equal(
          expectedDimension + 'px'
        )
        expect(helper.slider.selBar.css('left')).to.equal(
          expectedPosition + 'px'
        )
      })

      it('should set the correct dimension/position for selection bar for single slider with showSelectionBarFromValue is used with a value on the left', function() {
        var sliderConf = {
          value: 3,
          options: {
            floor: 0,
            ceil: 20,
            showSelectionBarFromValue: 10,
          },
        }
        helper.createSlider(sliderConf)
        var expectedDimension = Math.round(helper.slider.valueToPosition(7)),
          actualDimension = Math.round(
            helper.slider.selBar[0].getBoundingClientRect().width
          )
        expect(actualDimension).to.equal(expectedDimension)

        var expectedPosition =
          Math.round(helper.slider.valueToPosition(3)) +
          helper.slider.handleHalfDim
        expect(helper.slider.selBar.css('left')).to.equal(
          expectedPosition + 'px'
        )
      })

      it('should set the correct background position for selection bar for range slider when selectionBarGradient is used with a value {from: "white"; to:"blue"}', function() {
        var sliderConf = {
          min: 5,
          max: 10,
          options: {
            floor: 0,
            ceil: 20,
            selectionBarGradient: {
              from: 'white',
              to: 'blue',
            },
          },
        }

        helper.createRangeSlider(sliderConf)

        var expectedPosition =
            -(
              Math.round(helper.slider.valueToPosition(5)) +
              helper.slider.handleHalfDim
            ) + 'px center',
          actualPosition = helper.slider.scope.barStyle.backgroundPosition
        expect(actualPosition).to.equal(expectedPosition)
      })

      it('should set the correct gradient for selection bar for slider when selectionBarGradient is used with a value {from: "white"; to:"blue"} and vertical is used with a value true', function() {
        var sliderConf = {
          value: 5,
          options: {
            floor: 0,
            ceil: 20,
            vertical: true,
            showSelectionBar: true,
            selectionBarGradient: {
              from: 'white',
              to: 'blue',
            },
          },
        }

        helper.createSlider(sliderConf)

        var expectedGradient = 'linear-gradient(to top, white 0%,blue 100%)',
          actualGradient = helper.slider.scope.barStyle.backgroundImage
        expect(actualGradient).to.equal(expectedGradient)
      })

      it('should set alwaysHide on floor/ceil when hideLimitLabels is set to true', function() {
        var sliderConf = {
          value: 10,
          options: {
            hideLimitLabels: true,
          },
        }
        helper.createSlider(sliderConf)
        expect(helper.slider.flrLab.rzAlwaysHide).to.be.true
        expect(helper.slider.ceilLab.rzAlwaysHide).to.be.true
      })

      it('should set alwaysHide on minLab when hidePointerLabels is set to true on a single slider', function() {
        var sliderConf = {
          value: 10,
          options: {
            hidePointerLabels: true,
          },
        }
        helper.createSlider(sliderConf)
        expect(helper.slider.minLab.rzAlwaysHide).to.be.true
      })

      it('should set alwaysHide on minLab when hidePointerLabels is set to true on a single slider', function() {
        var sliderConf = {
          min: 10,
          max: 100,
          options: {
            hidePointerLabels: true,
          },
        }
        helper.createRangeSlider(sliderConf)
        expect(helper.slider.minLab.rzAlwaysHide).to.be.true
        expect(helper.slider.maxLab.rzAlwaysHide).to.be.true
        expect(helper.slider.cmbLab.rzAlwaysHide).to.be.true
      })

      it('should show floor and ceil labels when hidePointerLabels is true', function() {
        var sliderConf = {
          value: 100,
          options: {
            floor: 0,
            ceil: 100,
            hidePointerLabels: true,
          },
        }
        helper.createSlider(sliderConf)
        expect(helper.slider.flrLab.css('visibility')).to.equal('visible')
        expect(helper.slider.ceilLab.css('visibility')).to.equal('visible')
      })

      it('should show floor and ceil labels when hidePointerLabels is true, for range slider', function() {
        var sliderConf = {
          minValue: 0,
          maxValue: 100,
          options: {
            floor: 0,
            ceil: 100,
            hidePointerLabels: true,
          },
        }
        helper.createRangeSlider(sliderConf)
        expect(helper.slider.flrLab.css('visibility')).to.equal('visible')
        expect(helper.slider.ceilLab.css('visibility')).to.equal('visible')
      })

      it('should set the correct background-color on selection bar for single slider', function() {
        var sliderConf = {
          value: 10,
          options: {
            floor: 0,
            ceil: 10,
            showSelectionBar: true,
            getSelectionBarColor: function(v) {
              if (v < 5) return 'red'
              return 'green'
            },
          },
        }
        helper.createSlider(sliderConf)
        var selBarChild = angular.element(
          helper.slider.selBar[0].querySelector('.rz-selection')
        )
        expect(selBarChild.css('background-color')).to.equal('green')

        helper.scope.slider.value = 2
        helper.scope.$digest()
        expect(selBarChild.css('background-color')).to.equal('red')
      })

      it('should set the correct dimension/position for selection bar for range slider', function() {
        var sliderConf = {
          min: 2,
          max: 8,
          options: {
            floor: 0,
            ceil: 10,
          },
        }
        helper.createRangeSlider(sliderConf)

        var expectedDimension = Math.round(helper.slider.valueToPosition(6)),
          actualDimension = helper.slider.selBar[0].getBoundingClientRect()
            .width
        expect(actualDimension).to.equal(expectedDimension)

        var expectedPosition =
          Math.round(helper.slider.valueToPosition(2)) +
          helper.slider.handleHalfDim
        expect(helper.slider.selBar.css('left')).to.equal(
          expectedPosition + 'px'
        )
      })

      it('should set the correct background-color on selection bar for range slider', function() {
        var sliderConf = {
          min: 2,
          max: 8,
          options: {
            floor: 0,
            ceil: 10,
            getSelectionBarColor: function(min, max) {
              if (max - min < 5) return 'red'
              return 'green'
            },
          },
        }
        helper.createRangeSlider(sliderConf)
        var selBarChild = angular.element(
          helper.slider.selBar[0].querySelector('.rz-selection')
        )
        expect(selBarChild.css('background-color')).to.equal('green')

        helper.scope.slider.min = 4
        helper.scope.slider.max = 6
        helper.scope.$digest()
        expect(selBarChild.css('background-color')).to.equal('red')
      })

      it('should call the correct callback for onStart', function() {
        var sliderConf = {
          value: 10,
          options: {
            id: 'test',
            onStart: sinon.spy(),
          },
        }
        helper.createSlider(sliderConf)

        helper.slider.tracking = 'lowValue'
        helper.slider.callOnStart()
        $timeout.flush()
        sliderConf.options.onStart.calledWith('test', 10, undefined, 'min')
          .should.be.true
      })

      it('should call the correct callback for onStart called on high handle', function() {
        var sliderConf = {
          value: 10,
          options: {
            id: 'test',
            onStart: sinon.spy(),
          },
        }
        helper.createSlider(sliderConf)

        helper.slider.tracking = 'highValue'
        helper.slider.callOnStart()
        $timeout.flush()
        sliderConf.options.onStart.calledWith('test', 10, undefined, 'max')
          .should.be.true
      })

      it('should call the correct callback for onChange', function() {
        var sliderConf = {
          value: 10,
          options: {
            id: 'test',
            onChange: sinon.spy(),
          },
        }
        helper.createSlider(sliderConf)

        helper.slider.tracking = 'lowValue'
        helper.slider.callOnChange()
        $timeout.flush()
        sliderConf.options.onChange.calledWith('test', 10, undefined, 'min')
          .should.be.true
      })

      it('should call the correct callback for onEnd', function() {
        var sliderConf = {
          value: 10,
          options: {
            id: 'test',
            onEnd: sinon.spy(),
          },
        }
        helper.createSlider(sliderConf)

        helper.slider.tracking = 'lowValue'
        helper.slider.callOnEnd()
        $timeout.flush()
        sliderConf.options.onEnd.calledWith('test', 10, undefined, 'min').should
          .be.true
      })

      it('should set the correct background-color on pointer for single slider', function() {
        var sliderConf = {
          value: 10,
          options: {
            floor: 0,
            ceil: 10,
            showSelectionBar: true,
            getPointerColor: function(v) {
              if (v < 5) return 'red'
              return 'green'
            },
          },
        }
        helper.createSlider(sliderConf)
        var minHChild = angular.element(helper.slider.minH[0])
        expect(minHChild.css('background-color')).to.equal('green')

        helper.scope.slider.value = 2
        helper.scope.$digest()
        expect(minHChild.css('background-color')).to.equal('red')
      })

      it('should set the correct background-color on pointer for range slider (simple rule)', function() {
        var sliderConf = {
          min: 2,
          max: 8,
          options: {
            floor: 0,
            ceil: 10,
            getPointerColor: function(v) {
              if (v < 5) return 'red'
              return 'green'
            },
          },
        }
        helper.createRangeSlider(sliderConf)
        var minHChild = angular.element(helper.slider.minH[0]),
          maxHChild = angular.element(helper.slider.maxH[0])
        expect(minHChild.css('background-color')).to.equal('red')
        expect(maxHChild.css('background-color')).to.equal('green')

        helper.scope.slider.min = 6
        helper.scope.slider.max = 7
        helper.scope.$digest()
        expect(minHChild.css('background-color')).to.equal('green')
        expect(maxHChild.css('background-color')).to.equal('green')
      })

      it('should set the correct background-color on pointer for range slider (min/high independent rule 1)', function() {
        var sliderConf = {
          min: 2,
          max: 8,
          options: {
            floor: 0,
            ceil: 10,
            getPointerColor: function(v, type) {
              if (type === 'min') {
                if (v < 5) return 'red'
                return 'green'
              }

              if (type === 'max') {
                if (v < 5) return 'blue'
                return 'orange'
              }
            },
          },
        }
        helper.createRangeSlider(sliderConf)
        var minHChild = angular.element(helper.slider.minH[0]),
          maxHChild = angular.element(helper.slider.maxH[0])
        expect(minHChild.css('background-color')).to.equal('red')
        expect(maxHChild.css('background-color')).to.equal('orange')

        helper.scope.slider.min = 6
        helper.scope.$digest()
        expect(minHChild.css('background-color')).to.equal('green')
      })

      it('should set the correct background-color on pointer for range slider (min/high independent rule 2)', function() {
        var sliderConf = {
          min: 2,
          max: 8,
          options: {
            floor: 0,
            ceil: 10,
            getPointerColor: function(v, type) {
              if (type === 'min') {
                if (v < 5) return 'red'
                return 'green'
              }

              if (type === 'max') {
                if (v < 5) return 'blue'
                return 'orange'
              }
            },
          },
        }
        helper.createRangeSlider(sliderConf)
        var minHChild = angular.element(helper.slider.minH[0]),
          maxHChild = angular.element(helper.slider.maxH[0])
        expect(minHChild.css('background-color')).to.equal('red')
        expect(maxHChild.css('background-color')).to.equal('orange')

        helper.scope.slider.max = 3
        helper.scope.$digest()
        expect(minHChild.css('background-color')).to.equal('red')
        expect(maxHChild.css('background-color')).to.equal('blue')
      })

      it('should set the correct background-color on tick', function() {
        var sliderConf = {
          value: 3,
          options: {
            floor: 0,
            ceil: 10,
            showTicks: true,
            getTickColor: function(v) {
              if (v < 5) return 'red'
              return 'green'
            },
          },
        }
        helper.createRangeSlider(sliderConf)
        expect(helper.element[0].querySelectorAll('.rz-tick')).to.have.length(
          11
        )
        var firstTick = angular.element(
          helper.element[0].querySelectorAll('.rz-tick')[0]
        )
        var lastTick = angular.element(
          helper.element[0].querySelectorAll('.rz-tick')[10]
        )
        expect(firstTick[0].style['background-color']).to.equal('red')
        expect(lastTick[0].style['background-color']).to.equal('green')
      })

      it('should set the correct position for labels for single slider with boundPointerLabels=false', function() {
        var sliderConf = {
          min: 100000000,
          max: 100001000,
          options: {
            floor: 100000000,
            ceil: 100001000,
            boundPointerLabels: false,
          },
        }

        helper.createRangeSlider(sliderConf)
        expect(helper.slider.minLab.css('left')).to.equal(
          '-' +
            Math.round(
              helper.slider.minLab.rzsd / 2 - helper.slider.handleHalfDim
            ) +
            'px'
        )
        expect(helper.slider.maxLab.css('left')).to.equal(
          Math.round(
            helper.slider.barDimension -
              (helper.slider.maxLab.rzsd / 2 + helper.slider.handleHalfDim)
          ) + 'px'
        )

        sliderConf.max = 100000001
        helper.createRangeSlider(sliderConf)

        expect(parseInt(helper.slider.cmbLab.css('left'))).to.be.below(0)
      })
    })

    describe('range slider specific - ', function() {
      beforeEach(function() {
        var sliderConf = {
          min: 10,
          max: 90,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
          },
        }
        helper.createRangeSlider(sliderConf)
      })

      it('should set the correct class to true when draggableRange is true', function() {
        helper.scope.slider.options.draggableRange = true
        helper.scope.$digest()
        expect(helper.slider.selBar.hasClass('rz-draggable')).to.be.true
      })

      it('should set draggableRange to true when draggableRangeOnly is true', function() {
        helper.scope.slider.options.draggableRangeOnly = true
        helper.scope.$digest()
        expect(helper.slider.options.draggableRange).to.be.true
        expect(helper.slider.selBar.hasClass('rz-draggable')).to.be.true
      })

      it('should sanitize rzSliderModel and rzSliderHigh between floor and ceil', function() {
        helper.scope.slider.options.enforceRange = true
        helper.scope.slider.min = -1000
        helper.scope.slider.max = 1000
        helper.scope.$digest()
        expect(helper.scope.slider.min).to.equal(0)
        expect(helper.scope.slider.max).to.equal(100)
      })

      it('should set correct step/floor/ceil and translate function when stepsArray is used with values', function() {
        helper.scope.slider.min = 'B'
        helper.scope.slider.max = 'D'
        helper.scope.slider.options.stepsArray = ['A', 'B', 'C', 'D', 'E']
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(4)
        expect(helper.slider.lowValue).to.equal(1)
        expect(helper.slider.highValue).to.equal(3)
      })

      it('should set correct step/floor/ceil and translate function when stepsArray is used with values and bindIndexForStepsArray is true', function() {
        helper.scope.slider.min = 1
        helper.scope.slider.max = 3
        helper.scope.slider.options.stepsArray = ['A', 'B', 'C', 'D', 'E']
        helper.scope.slider.options.bindIndexForStepsArray = true
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(4)
        expect(helper.slider.lowValue).to.equal(1)
        expect(helper.slider.highValue).to.equal(3)
      })

      it('should set correct step/floor/ceil when stepsArray is used with values and ticks', function() {
        helper.scope.slider.min = 'B'
        helper.scope.slider.max = 'D'
        helper.scope.slider.options.stepsArray = ['A', 'B', 'C', 'D', 'E']
        helper.scope.slider.options.showTicks = true
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(4)
        expect(helper.slider.lowValue).to.equal(1)
        expect(helper.slider.highValue).to.equal(3)
      })

      it('should set correct step/floor/ceil when stepsArray is used with values and ticks and bindIndexForStepsArray is true', function() {
        helper.scope.slider.min = 1
        helper.scope.slider.max = 3
        helper.scope.slider.options.stepsArray = ['A', 'B', 'C', 'D', 'E']
        helper.scope.slider.options.bindIndexForStepsArray = true
        helper.scope.slider.options.showTicks = true
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(4)
        expect(helper.slider.lowValue).to.equal(1)
        expect(helper.slider.highValue).to.equal(3)
      })

      it('should set correct step/floor/ceil when stepsArray is used with objects', function() {
        helper.scope.slider.min = 'B'
        helper.scope.slider.max = 'D'
        helper.scope.slider.options.stepsArray = [
          { value: 'A' },
          { value: 'B' },
          { value: 'C' },
          { value: 'D' },
          { value: 'E' },
        ]
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(4)
        expect(helper.slider.lowValue).to.equal(1)
        expect(helper.slider.highValue).to.equal(3)
      })

      it('should set correct step/floor/ceil when stepsArray is used with objects and bindIndexForStepsArray is true', function() {
        helper.scope.slider.min = 1
        helper.scope.slider.max = 3
        helper.scope.slider.options.stepsArray = [
          { value: 'A' },
          { value: 'B' },
          { value: 'C' },
          { value: 'D' },
          { value: 'E' },
        ]
        helper.scope.slider.options.bindIndexForStepsArray = true
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(4)
        expect(helper.slider.lowValue).to.equal(1)
        expect(helper.slider.highValue).to.equal(3)
      })

      it('should set the correct combined label when range values are the same and mergeRangeLabelsIfSame option is false', function() {
        helper.scope.slider.options.mergeRangeLabelsIfSame = false
        helper.scope.slider.min = 50
        helper.scope.slider.max = 50
        helper.scope.$digest()
        expect(helper.slider.cmbLab.text()).to.equal('50 - 50')
      })

      it('should set the correct combined label when range values are the same and mergeRangeLabelsIfSame option is true', function() {
        helper.scope.slider.options.mergeRangeLabelsIfSame = true
        helper.scope.slider.min = 50
        helper.scope.slider.max = 50
        helper.scope.$digest()
        expect(helper.slider.cmbLab.text()).to.equal('50')
      })
    })

    describe('options expression specific - ', function() {
      it('should safely handle null expressions', function() {
        var sliderConf = {
          value: 10,
          optionsExpression: 'thisDoesntExist',
        }

        helper.createSlider(sliderConf)
        helper.scope.$digest()
        expect(helper.slider.step).to.equal(1)
      })

      it('should not cause an infinite $digest loop with an expression that always returns a new object', function() {
        var sliderConf = {
          value: 10,
          options: function() {
            return {
              floor: 1,
              ceil: 1000,
            }
          },
          optionsExpression: 'slider.options()',
        }

        helper.createSlider(sliderConf)
        helper.scope.$digest()
        expect(helper.slider.minValue).to.equal(1)
        expect(helper.slider.maxValue).to.equal(1000)
      })
    })
  })

  describe('Right to left Options handling - ', function() {
    var helper, RzSliderOptions, $rootScope, $timeout

    beforeEach(module('test-helper'))

    beforeEach(inject(function(
      TestHelper,
      _RzSliderOptions_,
      _$rootScope_,
      _$timeout_
    ) {
      helper = TestHelper
      RzSliderOptions = _RzSliderOptions_
      $rootScope = _$rootScope_
      $timeout = _$timeout_
    }))

    afterEach(function() {
      helper.clean()
    })

    describe('tests with same config', function() {
      beforeEach(function() {
        var sliderConf = {
          value: 10,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
            rightToLeft: true,
          },
        }
        helper.createSlider(sliderConf)
      })

      it('horizontal slider should take the full width and get correct position/dimension properties', function() {
        helper.scope.$digest()
        expect(helper.element[0].getBoundingClientRect().width).to.equal(1000)
        expect(helper.slider.positionProperty).to.equal('left')
        expect(helper.slider.dimensionProperty).to.equal('width')
        expect(helper.slider.sliderElem.hasClass('rz-vertical')).to.be.false
      })

      it('vertical slider should take the full height and get correct position/dimension properties', function() {
        helper.scope.$digest()
        helper.scope.slider.options.vertical = true
        helper.scope.$digest()
        expect(helper.element[0].getBoundingClientRect().height).to.equal(1000)
        expect(helper.slider.positionProperty).to.equal('bottom')
        expect(helper.slider.dimensionProperty).to.equal('height')
        expect(helper.slider.sliderElem.hasClass('rz-vertical')).to.be.true
      })

      it('should prevent invalid step', function() {
        helper.scope.slider.options.step = 0
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)

        helper.scope.slider.options.step = -1
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
      })

      it('should not round value to step if enforceStep is false', function() {
        helper.scope.slider.options.enforceStep = false
        helper.scope.$digest()

        helper.scope.slider.value = 14
        helper.scope.$digest()
        expect(helper.scope.slider.value).to.equal(14)
      })

      it('should round value to step if enforceStep is true', function() {
        helper.scope.slider.options.enforceStep = true
        helper.scope.$digest()

        helper.scope.slider.value = 14
        helper.scope.$digest()
        expect(helper.scope.slider.value).to.equal(10)
      })

      it('should set the showTicks scope flag to true when showTicks is true', function() {
        helper.scope.slider.options.showTicks = true
        helper.scope.$digest()
        expect(helper.slider.scope.showTicks).to.be.true
      })

      it('should set the showTicks scope flag to true when showTicksValues is true', function() {
        helper.scope.slider.options.showTicksValues = true
        helper.scope.$digest()
        expect(helper.slider.scope.showTicks).to.be.true
      })

      it('should set the intermediateTicks flag to true when showTicks is an integer', function() {
        helper.scope.slider.options.showTicks = 10
        helper.scope.$digest()
        expect(helper.slider.intermediateTicks).to.be.true
      })

      it('should set the intermediateTicks flag to true when showTicksValues is an integer', function() {
        helper.scope.slider.options.showTicksValues = 10
        helper.scope.$digest()
        expect(helper.slider.intermediateTicks).to.be.true
      })

      it('should set not accept draggableRange to true when slider is a single one', function() {
        helper.scope.slider.options.draggableRange = true
        helper.scope.$digest()
        expect(helper.slider.options.draggableRange).to.be.false
      })

      it('should set not accept draggableRangeOnly to true when slider is a single one', function() {
        helper.scope.slider.options.draggableRangeOnly = true
        helper.scope.$digest()
        expect(helper.slider.options.draggableRange).to.be.false
        expect(helper.slider.options.draggableRangeOnly).to.be.false
      })

      it('should set correct step/floor/ceil and translate function when stepsArray is used', function() {
        helper.scope.slider.value = 'C'
        helper.scope.slider.options.stepsArray = ['A', 'B', 'C', 'D', 'E']
        helper.scope.$digest()
        expect(helper.slider.options.step).to.equal(1)
        expect(helper.slider.options.floor).to.equal(0)
        expect(helper.slider.options.ceil).to.equal(4)
        expect(helper.slider.lowValue).to.equal(2)
      })

      it('should sanitize rzSliderModel between floor and ceil', function() {
        helper.scope.slider.options.enforceRange = true
        helper.scope.slider.value = 1000
        helper.scope.$digest()
        expect(helper.scope.slider.value).to.equal(100)

        helper.scope.slider.value = -1000
        helper.scope.$digest()
        $timeout.flush() //to flush the throttle function
        expect(helper.scope.slider.value).to.equal(0)
      })
    })

    describe('tests with specific config', function() {
      it('should accept custom translate function', function() {
        var sliderConf = {
          value: 10,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
            translate: function(v) {
              return 'custom value'
            },
            rightToLeft: true,
          },
        }
        helper.createSlider(sliderConf)
        expect(helper.slider.customTrFn(0)).to.equal('custom value')
        expect(helper.slider.customTrFn(100)).to.equal('custom value')
      })

      it('should set maxValue to rzSliderModel if no ceil is set for a single slider', function() {
        var sliderConf = {
          value: 10,
          rightToLeft: true,
        }
        helper.createSlider(sliderConf)
        expect(helper.slider.maxValue).to.equal(10)
      })

      it('should set maxValue to rzSliderHigh if no ceil is set for a range slider', function() {
        var sliderConf = {
          min: 10,
          max: 100,
          rightToLeft: true,
        }
        helper.createRangeSlider(sliderConf)
        expect(helper.slider.maxValue).to.equal(100)
      })

      it('should set the correct dimension/position for selection bar for single slider with showSelectionBar=true', function() {
        var sliderConf = {
          value: 2,
          options: {
            floor: 0,
            ceil: 10,
            showSelectionBar: true,
            rightToLeft: true,
          },
        }
        helper.createSlider(sliderConf)
        var expectedDimension = Math.round(
            helper.slider.valueToPosition(8) + helper.slider.handleHalfDim
          ),
          actualDimension = Math.round(
            helper.slider.selBar[0].getBoundingClientRect().width
          )
        expect(actualDimension).to.equal(expectedDimension)
        expect(helper.slider.selBar.css('left')).to.equal(
          Math.round(helper.slider.valueToPosition(2)) +
            helper.slider.handleHalfDim +
            'px'
        )
      })

      it('should set the correct dimension/position for selection bar for single slider with showSelectionBarEnd=true', function() {
        var sliderConf = {
          value: 2,
          options: {
            floor: 0,
            ceil: 10,
            showSelectionBarEnd: true,
            rightToLeft: true,
          },
        }
        helper.createSlider(sliderConf)
        var expectedDimension = Math.floor(
            helper.slider.valueToPosition(2) + helper.slider.handleHalfDim
          ),
          actualDimension = Math.floor(
            helper.slider.selBar[0].getBoundingClientRect().width
          )
        expect(actualDimension).to.equal(expectedDimension)
        expect(helper.slider.selBar.css('left')).to.equal('0px')
      })

      it('should set the correct dimension/position for selection bar for single slider with showSelectionBarFromValue is used with a value on the left', function() {
        var sliderConf = {
          value: 15,
          options: {
            floor: 0,
            ceil: 20,
            showSelectionBarFromValue: 10,
            rightToLeft: true,
          },
        }
        helper.createSlider(sliderConf)
        var expectedDimension = Math.round(helper.slider.valueToPosition(15)),
          expectedPosition =
            Math.round(helper.slider.valueToPosition(15)) +
            helper.slider.handleHalfDim
        expect(helper.slider.selBar.css('width')).to.equal(
          expectedDimension + 'px'
        )
        expect(helper.slider.selBar.css('left')).to.equal(
          expectedPosition + 'px'
        )
      })

      it('should set the correct dimension/position for selection bar for single slider with showSelectionBarFromValue is used with a value on the right', function() {
        var sliderConf = {
          value: 3,
          options: {
            floor: 0,
            ceil: 20,
            showSelectionBarFromValue: 10,
            rightToLeft: true,
          },
        }
        helper.createSlider(sliderConf)
        var expectedDimension = Math.round(helper.slider.valueToPosition(13)),
          actualDimension = helper.slider.selBar[0].getBoundingClientRect()
            .width,
          expectedPosition =
            Math.round(helper.slider.valueToPosition(10)) +
            helper.slider.handleHalfDim
        expect(actualDimension).to.equal(expectedDimension)
        expect(helper.slider.selBar.css('left')).to.equal(
          expectedPosition + 'px'
        )
      })

      it('should set the correct background-color on selection bar for single slider', function() {
        var sliderConf = {
          value: 10,
          options: {
            floor: 0,
            ceil: 10,
            showSelectionBar: true,
            getSelectionBarColor: function(v) {
              if (v < 5) return 'red'
              return 'green'
            },
            rightToLeft: true,
          },
        }
        helper.createSlider(sliderConf)
        var selBarChild = angular.element(
          helper.slider.selBar[0].querySelector('.rz-selection')
        )
        expect(selBarChild.css('background-color')).to.equal('green')

        helper.scope.slider.value = 2
        helper.scope.$digest()
        expect(selBarChild.css('background-color')).to.equal('red')
      })

      it('should set the correct dimension/position for selection bar for range slider', function() {
        var sliderConf = {
          min: 2,
          max: 8,
          options: {
            floor: 0,
            ceil: 10,
          },
          rightToLeft: true,
        }
        helper.createRangeSlider(sliderConf)

        var expectedDimension = Math.round(helper.slider.valueToPosition(6)),
          actualDimension = helper.slider.selBar[0].getBoundingClientRect()
            .width
        expect(actualDimension).to.equal(expectedDimension)

        var expectedPosition =
          Math.round(helper.slider.valueToPosition(2)) +
          helper.slider.handleHalfDim
        expect(helper.slider.selBar.css('left')).to.equal(
          expectedPosition + 'px'
        )
      })

      it('should set the correct background-color on selection bar for range slider', function() {
        var sliderConf = {
          min: 2,
          max: 8,
          options: {
            floor: 0,
            ceil: 10,
            getSelectionBarColor: function(min, max) {
              if (max - min < 5) return 'red'
              return 'green'
            },
            rightToLeft: true,
          },
        }
        helper.createRangeSlider(sliderConf)
        var selBarChild = angular.element(
          helper.slider.selBar[0].querySelector('.rz-selection')
        )
        expect(selBarChild.css('background-color')).to.equal('green')

        helper.scope.slider.min = 4
        helper.scope.slider.max = 6
        helper.scope.$digest()
        expect(selBarChild.css('background-color')).to.equal('red')
      })

      it('should call the correct callback for onStart', function() {
        var sliderConf = {
          value: 10,
          options: {
            id: 'test',
            onStart: sinon.spy(),
            rightToLeft: true,
          },
        }
        helper.createSlider(sliderConf)

        helper.slider.callOnStart()
        $timeout.flush()
        sliderConf.options.onStart.calledWith('test').should.be.true
      })

      it('should call the correct callback for onChange', function() {
        var sliderConf = {
          value: 10,
          options: {
            id: 'test',
            onChange: sinon.spy(),
            rightToLeft: true,
          },
        }
        helper.createSlider(sliderConf)

        helper.slider.callOnChange()
        $timeout.flush()
        sliderConf.options.onChange.calledWith('test').should.be.true
      })

      it('should call the correct callback for onEnd', function() {
        var sliderConf = {
          value: 10,
          options: {
            id: 'test',
            onEnd: sinon.spy(),
            rightToLeft: true,
          },
        }
        helper.createSlider(sliderConf)

        helper.slider.callOnEnd()
        $timeout.flush()
        sliderConf.options.onEnd.calledWith('test').should.be.true
      })

      it('should set the correct background-color on pointer for single slider', function() {
        var sliderConf = {
          value: 10,
          options: {
            floor: 0,
            ceil: 10,
            showSelectionBar: true,
            getPointerColor: function(v) {
              if (v < 5) return 'red'
              return 'green'
            },
            rightToLeft: true,
          },
        }
        helper.createSlider(sliderConf)
        var minHChild = angular.element(helper.slider.minH[0])
        expect(minHChild.css('background-color')).to.equal('green')

        helper.scope.slider.value = 2
        helper.scope.$digest()
        expect(minHChild.css('background-color')).to.equal('red')
      })

      it('should set the correct background-color on pointer for range slider (simple rule)', function() {
        var sliderConf = {
          min: 2,
          max: 8,
          options: {
            floor: 0,
            ceil: 10,
            getPointerColor: function(v) {
              if (v < 5) return 'red'
              return 'green'
            },
            rightToLeft: true,
          },
        }
        helper.createRangeSlider(sliderConf)
        var minHChild = angular.element(helper.slider.minH[0]),
          maxHChild = angular.element(helper.slider.maxH[0])
        expect(minHChild.css('background-color')).to.equal('red')
        expect(maxHChild.css('background-color')).to.equal('green')

        helper.scope.slider.min = 6
        helper.scope.slider.max = 7
        helper.scope.$digest()
        expect(minHChild.css('background-color')).to.equal('green')
        expect(maxHChild.css('background-color')).to.equal('green')
      })

      it('should set the correct background-color on pointer for range slider (min/high independent rule 1)', function() {
        var sliderConf = {
          min: 2,
          max: 8,
          options: {
            floor: 0,
            ceil: 10,
            getPointerColor: function(v, type) {
              if (type === 'min') {
                if (v < 5) return 'red'
                return 'green'
              }

              if (type === 'max') {
                if (v < 5) return 'blue'
                return 'orange'
              }
            },
            rightToLeft: true,
          },
        }
        helper.createRangeSlider(sliderConf)
        var minHChild = angular.element(helper.slider.minH[0]),
          maxHChild = angular.element(helper.slider.maxH[0])
        expect(minHChild.css('background-color')).to.equal('red')
        expect(maxHChild.css('background-color')).to.equal('orange')

        helper.scope.slider.min = 6
        helper.scope.$digest()
        expect(minHChild.css('background-color')).to.equal('green')
      })

      it('should set the correct background-color on pointer for range slider (min/high independent rule 2)', function() {
        var sliderConf = {
          min: 2,
          max: 8,
          options: {
            floor: 0,
            ceil: 10,
            getPointerColor: function(v, type) {
              if (type === 'min') {
                if (v < 5) return 'red'
                return 'green'
              }

              if (type === 'max') {
                if (v < 5) return 'blue'
                return 'orange'
              }
            },
            rightToLeft: true,
          },
        }
        helper.createRangeSlider(sliderConf)
        var minHChild = angular.element(helper.slider.minH[0]),
          maxHChild = angular.element(helper.slider.maxH[0])
        expect(minHChild.css('background-color')).to.equal('red')
        expect(maxHChild.css('background-color')).to.equal('orange')

        helper.scope.slider.max = 3
        helper.scope.$digest()
        expect(minHChild.css('background-color')).to.equal('red')
        expect(maxHChild.css('background-color')).to.equal('blue')
      })

      it('should correctly link the customTemplateScope properties on slider scope', function() {
        var sliderConf = {
          value: 10,
          options: {
            customTemplateScope: {
              a: 1,
              b: 'test',
            },
          },
        }
        helper.createSlider(sliderConf)
        expect(helper.slider.scope.custom.a).to.equal(1)
        expect(helper.slider.scope.custom.b).to.equal('test')
      })
    })

    describe('range slider specific - ', function() {
      beforeEach(function() {
        var sliderConf = {
          min: 10,
          max: 90,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
            rightToLeft: true,
          },
        }
        helper.createRangeSlider(sliderConf)
      })

      it('should set the correct class to true when draggableRange is true', function() {
        helper.scope.slider.options.draggableRange = true
        helper.scope.$digest()
        expect(helper.slider.selBar.hasClass('rz-draggable')).to.be.true
      })

      it('should set draggableRange to true when draggableRangeOnly is true', function() {
        helper.scope.slider.options.draggableRangeOnly = true
        helper.scope.$digest()
        expect(helper.slider.options.draggableRange).to.be.true
        expect(helper.slider.selBar.hasClass('rz-draggable')).to.be.true
      })

      it('should sanitize rzSliderModel and rzSliderHigh between floor and ceil', function() {
        helper.scope.slider.options.enforceRange = true
        helper.scope.slider.min = -1000
        helper.scope.slider.max = 1000
        helper.scope.$digest()
        expect(helper.scope.slider.min).to.equal(0)
        expect(helper.scope.slider.max).to.equal(100)
      })

      it('should visualize left/right outer selection', function() {
        helper.scope.slider.min = 30
        helper.scope.slider.max = 70
        helper.scope.slider.options.showOuterSelectionBars = true
        helper.scope.slider.options.rightToLeft = false
        helper.scope.$digest()
        expect(helper.slider.leftOutSelBar.css('visibility')).to.equal(
          'visible'
        )
        expect(helper.slider.rightOutSelBar.css('visibility')).to.equal(
          'visible'
        )
        expect(helper.slider.fullBar.hasClass('rz-transparent')).to.be.true
      })

      it('should swap left/right outer selection in rightToLeft mode', function() {
        helper.scope.slider.min = 30
        helper.scope.slider.max = 70
        helper.scope.slider.options.showOuterSelectionBars = true
        helper.scope.slider.options.rightToLeft = true
        helper.scope.$digest()
        expect(helper.slider.leftOutSelBar.css('visibility')).to.equal(
          'visible'
        )
        expect(helper.slider.rightOutSelBar.css('visibility')).to.equal(
          'visible'
        )
        expect(helper.slider.fullBar.hasClass('rz-transparent')).to.be.true
        // rightToLeft checking
        expect(parseInt(helper.slider.rightOutSelBar.css('left'))).to.be.below(
          parseInt(helper.slider.leftOutSelBar.css('left'))
        )
      })

      it('should use the default separator when labels overlap', function() {
        helper.scope.slider.min = -1
        helper.scope.slider.max = 1
        helper.scope.slider.options.floor = -100
        helper.scope.slider.options.ceil = +100
        helper.scope.slider.options.step = 1
        helper.scope.slider.options.rightToLeft = false
        helper.scope.$digest()
        expect(helper.slider.cmbLab.text()).to.equal('-1 - 1')
      })

      it('should use the custom separator when labels overlap, and labelOverlapSeparator is set', function() {
        helper.scope.slider.min = -1
        helper.scope.slider.max = 1
        helper.scope.slider.options.floor = -100
        helper.scope.slider.options.ceil = +100
        helper.scope.slider.options.step = 1
        helper.scope.slider.options.rightToLeft = false
        helper.scope.slider.options.labelOverlapSeparator = ' .. '
        helper.scope.$digest()
        expect(helper.slider.cmbLab.text()).to.equal('-1 .. 1')
      })
      it('should use the custom separator when labels overlap, and labelOverlapSeparator is set, in RTL mode', function() {
        helper.scope.slider.min = -1
        helper.scope.slider.max = 1
        helper.scope.slider.options.floor = -100
        helper.scope.slider.options.ceil = +100
        helper.scope.slider.options.step = 1
        helper.scope.slider.options.labelOverlapSeparator = ' .. '
        helper.scope.$digest()
        expect(helper.slider.cmbLab.text()).to.equal('1 .. -1')
      })
    })

    describe('options expression specific - ', function() {
      it('should safely handle null expressions', function() {
        var sliderConf = {
          value: 10,
          optionsExpression: 'thisDoesntExist',
        }

        helper.createSlider(sliderConf)
        helper.scope.$digest()
        expect(helper.slider.step).to.equal(1)
      })

      it('should not cause an infinite $digest loop with an expression that always returns a new object', function() {
        var sliderConf = {
          value: 10,
          options: function() {
            return {
              floor: 1,
              ceil: 1000,
            }
          },
          optionsExpression: 'slider.options()',
        }

        helper.createSlider(sliderConf)
        helper.scope.$digest()
        expect(helper.slider.minValue).to.equal(1)
        expect(helper.slider.maxValue).to.equal(1000)
      })
    })

    describe('reacting to changes - ', function() {
      beforeEach(function() {
        var sliderConf = {
          value: 10,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
            translate: function(val) {
              return val + '%'
            },
          },
        }
        helper.createSlider(sliderConf)
      })

      it('should react to changes of options which are functions', function() {
        helper.scope.slider.options.translate = function(val) {
          return val + '$'
        }
        helper.scope.$digest()
        expect(helper.slider.customTrFn(100)).to.equal('100$')
      })
    })
  })
})()
