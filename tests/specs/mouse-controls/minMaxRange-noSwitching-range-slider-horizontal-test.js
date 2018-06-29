;(function() {
  'use strict'

  describe('Mouse controls - minRange and noSwitching Range Horizontal', function() {
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
          minRange: 10,
          maxRange: 50,
          noSwitching: true,
        },
      }
      helper.createRangeSlider(sliderConf)
    })
    afterEach(function() {
      // to clean document listener
      helper.fireMouseup()
    })

    it('should not modify any value if new range would be smaller than minRange when moving minH', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 50
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.min).to.equal(45)
    })

    it('should not modify any value if new range would be smaller than minRange when moving maxH', function() {
      helper.fireMousedown(helper.slider.maxH, 0)
      var expectedValue = 50
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.max).to.equal(55)
    })

    it('should modify the min value if new range is larger than minRange when moving minH', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 30
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.min).to.equal(expectedValue)
    })

    it('should modify the max value if new range is larger than than minRange when moving maxH', function() {
      helper.fireMousedown(helper.slider.maxH, 0)
      var expectedValue = 70
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.max).to.equal(expectedValue)
    })

    it('should not switch min/max when moving minH even if the range is large enough', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 80
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.min).to.equal(45)
      expect(helper.scope.slider.max).to.equal(55)
    })

    it('should not switch min/max when moving maxH even if the range is large enough', function() {
      helper.fireMousedown(helper.slider.maxH, 0)
      var expectedValue = 20
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.min).to.equal(45)
      expect(helper.scope.slider.max).to.equal(55)
    })

    it('should not modify any value if new range would be larger than maxRange when moving minH', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 0
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.min).to.equal(5)
    })

    it('should not modify any value if new range would be larger than maxRange when moving maxH', function() {
      helper.fireMousedown(helper.slider.maxH, 0)
      var expectedValue = 100
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.max).to.equal(95)
    })

    it('should not switch min/max when moving minH far higher than maxH (issue #377)', function() {
      helper.scope.slider.min = 0
      helper.scope.slider.max = 10
      helper.scope.$digest()

      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 100
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.min).to.equal(0)
      expect(helper.scope.slider.max).to.equal(10)
    })

    it('should not switch min/max when moving maxH far lower than minH (issue #377)', function() {
      helper.scope.slider.min = 90
      helper.scope.slider.max = 100
      helper.scope.$digest()

      helper.fireMousedown(helper.slider.maxH, 0)
      var expectedValue = 0
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.min).to.equal(90)
      expect(helper.scope.slider.max).to.equal(100)
    })
  })

  describe('Right to left Mouse controls - minRange and noSwitching Range Horizontal', function() {
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
          minRange: 10,
          noSwitching: true,
          rightToLeft: true,
        },
      }
      helper.createRangeSlider(sliderConf)
    })
    afterEach(function() {
      // to clean document listener
      helper.fireMouseup()
    })

    it('should not modify any value if new range would be smaller than minRange when moving minH', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 50,
        position = helper.getMousePosition(expectedValue)
      helper.fireMousemove(-position)
      expect(helper.scope.slider.min).to.equal(45)
    })

    it('should not modify any value if new range would be smaller than minRange when moving maxH', function() {
      helper.fireMousedown(helper.slider.maxH, 0)
      var expectedValue = 50,
        position = helper.slider.maxPos - helper.getMousePosition(expectedValue)
      helper.fireMousemove(position)
      expect(helper.scope.slider.max).to.equal(55)
    })

    it('should modify the min value if new range is larger than minRange when moving minH', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 30
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.min).to.equal(expectedValue)
    })

    it('should modify the max value if new range is larger than than minRange when moving maxH', function() {
      helper.fireMousedown(helper.slider.maxH, 0)
      var expectedValue = 70
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.max).to.equal(expectedValue)
    })

    it('should not switch min/max when moving minH even if the range is large enough', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 80,
        position = helper.getMousePosition(expectedValue)
      helper.fireMousemove(-position)
      expect(helper.scope.slider.min).to.equal(45)
      expect(helper.scope.slider.max).to.equal(55)
    })

    it('should not switch min/max when moving maxH even if the range is large enough', function() {
      helper.fireMousedown(helper.slider.maxH, 0)
      var expectedValue = 20
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.min).to.equal(45)
      expect(helper.scope.slider.max).to.equal(55)
    })
  })
})()
