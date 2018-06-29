;(function() {
  'use strict'

  describe('Keyboard controls - draggableRangeOnly range slider', function() {
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
        min: 90,
        max: 110,
        options: {
          floor: 0,
          ceil: 200,
          draggableRangeOnly: true,
        },
      }
      helper.createRangeSlider(sliderConf)
    })

    it('should increment minH/maxH by 1 when RIGHT is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'RIGHT')
      expect(helper.scope.slider.min).to.equal(91)
      expect(helper.scope.slider.max).to.equal(111)
    })

    it('should increment minH/maxH by 1 when RIGHT is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'RIGHT')
      expect(helper.scope.slider.min).to.equal(91)
      expect(helper.scope.slider.max).to.equal(111)
    })

    it('should increment minH/maxH by 1 when LEFT is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'LEFT')
      expect(helper.scope.slider.min).to.equal(89)
      expect(helper.scope.slider.max).to.equal(109)
    })

    it('should increment minH/maxH by 1 when LEFT is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'LEFT')
      expect(helper.scope.slider.min).to.equal(89)
      expect(helper.scope.slider.max).to.equal(109)
    })

    it('should increment minH/maxH by 10% when PAGEUP is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'PAGEUP')
      expect(helper.scope.slider.min).to.equal(110)
      expect(helper.scope.slider.max).to.equal(130)
    })

    it('should increment minH/maxH by 10% when PAGEUP is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'PAGEUP')
      expect(helper.scope.slider.min).to.equal(110)
      expect(helper.scope.slider.max).to.equal(130)
    })

    it('should decrement minH/maxH by 10% when PAGEDOWN is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'PAGEDOWN')
      expect(helper.scope.slider.min).to.equal(70)
      expect(helper.scope.slider.max).to.equal(90)
    })

    it('should decrement minH/maxH by 10% when PAGEDOWN is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'PAGEDOWN')
      expect(helper.scope.slider.min).to.equal(70)
      expect(helper.scope.slider.max).to.equal(90)
    })

    it('should set minH to min when HOME is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'HOME')
      expect(helper.scope.slider.min).to.equal(0)
      expect(helper.scope.slider.max).to.equal(20)
    })

    it('should set minH to min when HOME is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'HOME')
      expect(helper.scope.slider.min).to.equal(0)
      expect(helper.scope.slider.max).to.equal(20)
    })

    it('should set minH to min when END is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'END')
      expect(helper.scope.slider.min).to.equal(180)
      expect(helper.scope.slider.max).to.equal(200)
    })

    it('should set minH to min when END is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'END')
      expect(helper.scope.slider.min).to.equal(180)
      expect(helper.scope.slider.max).to.equal(200)
    })
  })

  describe('Right to left Keyboard controls - draggableRangeOnly range slider', function() {
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
        min: 90,
        max: 110,
        options: {
          floor: 0,
          ceil: 200,
          draggableRangeOnly: true,
          rightToLeft: true,
        },
      }
      helper.createRangeSlider(sliderConf)
    })

    it('should decrement minH/maxH by 1 when RIGHT is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'RIGHT')
      expect(helper.scope.slider.min).to.equal(89)
      expect(helper.scope.slider.max).to.equal(109)
    })

    it('should decrement minH/maxH by 1 when RIGHT is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'RIGHT')
      expect(helper.scope.slider.min).to.equal(89)
      expect(helper.scope.slider.max).to.equal(109)
    })

    it('should increment minH/maxH by 1 when LEFT is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'LEFT')
      expect(helper.scope.slider.min).to.equal(91)
      expect(helper.scope.slider.max).to.equal(111)
    })

    it('should increment minH/maxH by 1 when LEFT is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'LEFT')
      expect(helper.scope.slider.min).to.equal(91)
      expect(helper.scope.slider.max).to.equal(111)
    })

    it('should increment minH/maxH by 10% when PAGEUP is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'PAGEUP')
      expect(helper.scope.slider.min).to.equal(110)
      expect(helper.scope.slider.max).to.equal(130)
    })

    it('should increment minH/maxH by 10% when PAGEUP is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'PAGEUP')
      expect(helper.scope.slider.min).to.equal(110)
      expect(helper.scope.slider.max).to.equal(130)
    })

    it('should decrement minH/maxH by 10% when PAGEDOWN is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'PAGEDOWN')
      expect(helper.scope.slider.min).to.equal(70)
      expect(helper.scope.slider.max).to.equal(90)
    })

    it('should decrement minH/maxH by 10% when PAGEDOWN is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'PAGEDOWN')
      expect(helper.scope.slider.min).to.equal(70)
      expect(helper.scope.slider.max).to.equal(90)
    })

    it('should set minH to min when HOME is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'HOME')
      expect(helper.scope.slider.min).to.equal(0)
      expect(helper.scope.slider.max).to.equal(20)
    })

    it('should set minH to min when HOME is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'HOME')
      expect(helper.scope.slider.min).to.equal(0)
      expect(helper.scope.slider.max).to.equal(20)
    })

    it('should set minH to min when END is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'END')
      expect(helper.scope.slider.min).to.equal(180)
      expect(helper.scope.slider.max).to.equal(200)
    })

    it('should set minH to min when END is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'END')
      expect(helper.scope.slider.min).to.equal(180)
      expect(helper.scope.slider.max).to.equal(200)
    })
  })
})()
