;(function() {
  'use strict'

  describe('Mouse controls - minLimit!=null && maxLimit!=null Single Horizontal', function() {
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
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          minLimit: 40,
          maxLimit: 60,
        },
      }
      helper.createSlider(sliderConf)
    })
    afterEach(function() {
      // to clean document listener
      helper.fireMouseup()
    })

    it('should be able to modify minH above minLimit', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 42
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.value).to.equal(42)
    })

    it('should not be able to modify minH below minLimit', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 30
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.value).to.equal(40)
    })

    it('should be able to modify minH below maxLimit', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 58
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.value).to.equal(58)
    })

    it('should not be able to modify minH above maxLimit', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 70
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.value).to.equal(60)
    })
  })

  describe('Right to left Mouse controls - minLimit!=null && maxLimit!=null Single Horizontal', function() {
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
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          minLimit: 40,
          maxLimit: 60,
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
    })
    afterEach(function() {
      // to clean document listener
      helper.fireMouseup()
    })

    it('should be able to modify minH above minLimit', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 42
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.value).to.equal(42)
    })

    it('should not be able to modify minH below minLimit', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 30
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.value).to.equal(40)
    })

    it('should be able to modify minH below maxLimit', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 58
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.value).to.equal(58)
    })

    it('should not be able to modify minH above maxLimit', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 70
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.value).to.equal(60)
    })
  })
})()
