;(function() {
  'use strict'

  describe('Mouse controls - Restricted Range', function() {
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

    beforeEach(function() {
      var sliderConf = {
        min: 25,
        max: 85,
        options: {
          floor: 0,
          ceil: 100,
          restrictedRange: {
            from: 30,
            to: 70,
          },
        },
      }
      helper.createRangeSlider(sliderConf)
    })

    afterEach(function() {
      // to clean document listener
      helper.fireMouseup()
    })

    it('should be able to modify minH below restrictedRange.from', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var attemptedValue = 25
      helper.moveMouseToValue(attemptedValue)
      expect(helper.scope.slider.min).to.equal(25)
    })

    it('should not be able to modify minH above restrictedRange.from', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var attemptedValue = 40
      helper.moveMouseToValue(attemptedValue)
      expect(helper.scope.slider.min).to.equal(30)
    })

    it('should be able to modify maxH above restrictedRange.to', function() {
      helper.fireMousedown(helper.slider.maxH, 0)
      var attemptedValue = 78
      helper.moveMouseToValue(attemptedValue)
      expect(helper.scope.slider.max).to.equal(78)
    })

    it('should not be able to modify maxH below restrictedRange.to', function() {
      helper.fireMousedown(helper.slider.maxH, 0)
      var attemptedValue = 50
      helper.moveMouseToValue(attemptedValue)
      expect(helper.scope.slider.max).to.equal(70)
    })
  })

  describe('Right to left Mouse controls - minLimit!=null && maxLimit!=null Range Horizontal', function() {
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

    beforeEach(function() {
      var sliderConf = {
        min: 45,
        max: 55,
        options: {
          floor: 0,
          ceil: 100,
          restrictedRange: {
            from: 30,
            to: 70,
          },
          rightToLeft: true,
        },
      }
      helper.createRangeSlider(sliderConf)
    })
    afterEach(function() {
      // to clean document listener
      helper.fireMouseup()
    })

    it('should be able to modify minH below restrictedRange.from', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var attemptedValue = 25
      helper.moveMouseToValue(attemptedValue)
      expect(helper.scope.slider.min).to.equal(25)
    })

    it('should not be able to modify minH above restrictedRange.from', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var attemptedValue = 40
      helper.moveMouseToValue(attemptedValue)
      expect(helper.scope.slider.min).to.equal(30)
    })

    it('should be able to modify maxH above restrictedRange.to', function() {
      helper.fireMousedown(helper.slider.maxH, 0)
      var attemptedValue = 78
      helper.moveMouseToValue(attemptedValue)
      expect(helper.scope.slider.max).to.equal(78)
    })

    it('should not be able to modify maxH below restrictedRange.to', function() {
      helper.fireMousedown(helper.slider.maxH, 0)
      var attemptedValue = 50
      helper.moveMouseToValue(attemptedValue)
      expect(helper.scope.slider.max).to.equal(70)
    })
  })
})()
