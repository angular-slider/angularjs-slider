;(function() {
  'use strict'

  describe('Mouse controls - noSwitching Range Horizontal', function() {
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
          noSwitching: true,
        },
      }
      helper.createRangeSlider(sliderConf)
    })
    afterEach(function() {
      // to clean document listener
      helper.fireMouseup()
    })

    it('should not switch min and max handles if minH is dragged after maxH', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 60
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.min).to.equal(55)
    })

    it('should not switch min and max handles if maxH is dragged before minH', function() {
      helper.fireMousedown(helper.slider.maxH, 0)
      var expectedValue = 20
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.max).to.equal(45)
    })

    it('should move minH if minH==maxH and click is on the left side of the bar', function() {
      helper.scope.slider.min = helper.scope.slider.max = 50
      helper.scope.$digest()

      var expectedValue = 30,
        position = helper.getMousePosition(expectedValue)

      helper.fireMousedown(helper.slider.fullBar, position)

      expect(helper.scope.slider.min).to.equal(30)
      expect(helper.scope.slider.max).to.equal(50)
    })

    it('should move maxH if minH==maxH and click is on the right side of the bar', function() {
      helper.scope.slider.min = helper.scope.slider.max = 50
      helper.scope.$digest()

      var expectedValue = 70,
        position = helper.getMousePosition(expectedValue)

      helper.fireMousedown(helper.slider.fullBar, position)

      expect(helper.scope.slider.min).to.equal(50)
      expect(helper.scope.slider.max).to.equal(70)
    })
  })

  describe('Right to left Mouse controls - noSwitching Range Horizontal', function() {
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

    it('should not switch min and max handles if minH is dragged after maxH', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      var expectedValue = 60
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.min).to.equal(55)
    })

    it('should not switch min and max handles if maxH is dragged before minH', function() {
      helper.fireMousedown(helper.slider.maxH, 0)
      var expectedValue = 20
      helper.moveMouseToValue(expectedValue)
      expect(helper.scope.slider.max).to.equal(45)
    })

    it('should move minH if minH==maxH and click is on the left side of the bar', function() {
      helper.scope.slider.min = helper.scope.slider.max = 50
      helper.scope.$digest()

      var expectedValue = 30,
        position = helper.getMousePosition(expectedValue)

      helper.fireMousedown(helper.slider.fullBar, position)

      expect(helper.scope.slider.min).to.equal(30)
      expect(helper.scope.slider.max).to.equal(50)
    })

    it('should move maxH if minH==maxH and click is on the right side of the bar', function() {
      helper.scope.slider.min = helper.scope.slider.max = 50
      helper.scope.$digest()

      var expectedValue = 70,
        position = helper.getMousePosition(expectedValue)

      helper.fireMousedown(helper.slider.fullBar, position)

      expect(helper.scope.slider.min).to.equal(50)
      expect(helper.scope.slider.max).to.equal(70)
    })
  })
})()
