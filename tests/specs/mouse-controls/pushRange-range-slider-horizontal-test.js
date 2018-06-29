;(function() {
  'use strict'

  describe('Mouse controls - pushRange Range Horizontal', function() {
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
          pushRange: true,
        },
      }
      helper.createRangeSlider(sliderConf)
    })
    afterEach(function() {
      // to clean document listener
      helper.fireMouseup()
    })

    it('should push maxH when moving minH above it', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      helper.moveMouseToValue(60)
      expect(helper.scope.slider.min).to.equal(60)
      expect(helper.scope.slider.max).to.equal(61)
    })

    it('should push minH when moving maxH below it', function() {
      helper.fireMousedown(helper.slider.maxH, 0)
      helper.moveMouseToValue(40)
      expect(helper.scope.slider.min).to.equal(39)
      expect(helper.scope.slider.max).to.equal(40)
    })

    it('should not move maxH above ceil when moving minH to ceil', function() {
      helper.fireMousedown(helper.slider.minH, 0)
      helper.moveMouseToValue(100)
      expect(helper.scope.slider.min).to.equal(99)
      expect(helper.scope.slider.max).to.equal(100)
    })

    it('should not move minH below floor when moving maxH to floor', function() {
      helper.fireMousedown(helper.slider.maxH, 0)
      helper.moveMouseToValue(0)
      expect(helper.scope.slider.min).to.equal(0)
      expect(helper.scope.slider.max).to.equal(1)
    })

    it('should push maxH according to step', function() {
      helper.scope.slider.options.step = 5
      helper.scope.$digest()

      helper.fireMousedown(helper.slider.minH, 0)
      helper.moveMouseToValue(60)
      expect(helper.scope.slider.min).to.equal(60)
      expect(helper.scope.slider.max).to.equal(65)
    })

    it('should push minH according to step', function() {
      helper.scope.slider.options.step = 5
      helper.scope.$digest()

      helper.fireMousedown(helper.slider.maxH, 0)
      helper.moveMouseToValue(40)
      expect(helper.scope.slider.min).to.equal(35)
      expect(helper.scope.slider.max).to.equal(40)
    })

    it('should push maxH according to minRange when both step and minRange are defined', function() {
      helper.scope.slider.options.step = 5
      helper.scope.slider.options.minRange = 10
      helper.scope.$digest()

      helper.fireMousedown(helper.slider.minH, 0)
      helper.moveMouseToValue(60)
      expect(helper.scope.slider.min).to.equal(60)
      expect(helper.scope.slider.max).to.equal(70)
    })

    it('should push minH according to minRange when both step and minRange are defined', function() {
      helper.scope.slider.options.step = 5
      helper.scope.slider.options.minRange = 10
      helper.scope.$digest()

      helper.fireMousedown(helper.slider.maxH, 0)
      helper.moveMouseToValue(40)
      expect(helper.scope.slider.min).to.equal(30)
      expect(helper.scope.slider.max).to.equal(40)
    })

    it('should push maxH according to minRange when minRange is 0', function() {
      helper.scope.slider.options.step = 5
      helper.scope.slider.options.minRange = 0
      helper.scope.$digest()

      helper.fireMousedown(helper.slider.minH, 0)
      helper.moveMouseToValue(60)
      expect(helper.scope.slider.min).to.equal(60)
      expect(helper.scope.slider.max).to.equal(60)
    })

    it('should push minH according to minRange when minRange is 0', function() {
      helper.scope.slider.options.step = 5
      helper.scope.slider.options.minRange = 0
      helper.scope.$digest()

      helper.fireMousedown(helper.slider.maxH, 0)
      helper.moveMouseToValue(40)
      expect(helper.scope.slider.min).to.equal(40)
      expect(helper.scope.slider.max).to.equal(40)
    })

    it('should pull minH when moving maxH above maxRange', function() {
      helper.scope.slider.options.maxRange = 15
      helper.scope.$digest()

      helper.fireMousedown(helper.slider.maxH, 0)
      helper.moveMouseToValue(80)
      expect(helper.scope.slider.min).to.equal(65)
      expect(helper.scope.slider.max).to.equal(80)
    })

    it('should pull maxH when moving minH above maxRange', function() {
      helper.scope.slider.options.maxRange = 15
      helper.scope.$digest()

      helper.fireMousedown(helper.slider.minH, 0)
      helper.moveMouseToValue(20)
      expect(helper.scope.slider.min).to.equal(20)
      expect(helper.scope.slider.max).to.equal(35)
    })
  })
})()
