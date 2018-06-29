;(function() {
  'use strict'

  describe('Scale test - ', function() {
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

    describe('Linear scale - ', function() {
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

      it('should have a correct linearValueToPosition', function() {
        var actual = helper.slider.linearValueToPosition(0, 0, 50)
        expect(actual).to.equal(0)
        actual = helper.slider.linearValueToPosition(25, 0, 50)
        expect(actual.toFixed(2)).to.equal('0.50')
        actual = helper.slider.linearValueToPosition(50, 0, 50)
        expect(actual).to.equal(1)
      })

      it('should have a correct linearPositionToValue', function() {
        var actual = helper.slider.linearPositionToValue(0, 0, 50)
        expect(actual).to.equal(0)
        actual = helper.slider.linearPositionToValue(0.5, 0, 50)
        expect(actual).to.equal(25)
        actual = Math.round(helper.slider.linearPositionToValue(1, 0, 50))
        expect(actual).to.equal(50)
      })
    })

    describe('Logarithm scale - ', function() {
      beforeEach(function() {
        var sliderConf = {
          value: 10,
          options: {
            floor: 1,
            ceil: 100,
            step: 10,
            logScale: true,
          },
        }
        helper.createSlider(sliderConf)
      })

      it('should throw an error if floor is 0', function() {
        var testFn = function() {
          helper.scope.slider.options.floor = 0
          helper.scope.$digest()
        }
        expect(testFn).to.throw("Can't use floor=0 with logarithmic scale")
      })

      it('should have a correct logValueToPosition', function() {
        var actual = helper.slider.logValueToPosition(1, 1, 50)
        expect(actual).to.equal(0)
        actual = helper.slider.logValueToPosition(25, 1, 50)
        expect(actual.toFixed(2)).to.equal('0.82')
        actual = helper.slider.logValueToPosition(50, 1, 50)
        expect(actual).to.equal(1)
      })

      it('should have a correct logPositionToValue', function() {
        var actual = helper.slider.logPositionToValue(0, 1, 50)
        expect(actual).to.equal(1)
        actual = helper.slider.logPositionToValue(0.5, 1, 50)
        expect(actual.toFixed(2)).to.equal('7.07')
        actual = Math.round(helper.slider.logPositionToValue(1, 1, 50))
        expect(actual).to.equal(50)
      })

      it('should handle click and drag on minH correctly', function() {
        helper.fireMousedown(helper.slider.minH, 0)
        var expectedValue = 50,
          position = helper.getMousePosition(expectedValue)
        helper.fireMousemove(position)
        expect(helper.scope.slider.value).to.equal(expectedValue + 1) // + 1 because we start at 1
      })
    })

    describe('Custom scale (here a x^2 scale)- ', function() {
      beforeEach(function() {
        var sliderConf = {
          value: 50,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
            customValueToPosition: function(val, minVal, maxVal) {
              val = Math.sqrt(val)
              minVal = Math.sqrt(minVal)
              maxVal = Math.sqrt(maxVal)
              var range = maxVal - minVal
              return (val - minVal) / range
            },
            customPositionToValue: function(percent, minVal, maxVal) {
              minVal = Math.sqrt(minVal)
              maxVal = Math.sqrt(maxVal)
              var value = percent * (maxVal - minVal) + minVal
              return Math.pow(value, 2)
            },
          },
        }
        helper.createSlider(sliderConf)
      })
      ;-it('should have a correct valueToPosition', function() {
        var actual = helper.slider.valueToPosition(0)
        expect(actual).to.equal(0)
        actual = helper.slider.valueToPosition(25)
        expect(actual).to.equal(helper.slider.maxPos / 2)
        actual = helper.slider.valueToPosition(100)
        expect(actual).to.equal(helper.slider.maxPos)
      })

      it('should have a correct positionToValue', function() {
        var actual = helper.slider.positionToValue(0)
        expect(actual).to.equal(0)
        actual = helper.slider.positionToValue(helper.slider.maxPos / 2)
        expect(actual).to.equal(25)
        actual = Math.round(helper.slider.positionToValue(helper.slider.maxPos))
        expect(actual).to.equal(100)
      })

      it('should handle click and drag on minH correctly', function() {
        helper.fireMousedown(helper.slider.minH, 0)
        var expectedValue = 50,
          position = helper.getMousePosition(expectedValue)
        helper.fireMousemove(position)
        expect(helper.scope.slider.value).to.equal(expectedValue)
      })
    })
  })
})()
