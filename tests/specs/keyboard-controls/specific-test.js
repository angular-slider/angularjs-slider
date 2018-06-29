;(function() {
  'use strict'

  describe('Keyboard controls - specific tests', function() {
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

    it('should not go below floor', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 1000,
          step: 10,
        },
      }
      helper.createSlider(sliderConf)
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'PAGEDOWN')
      expect(helper.scope.slider.value).to.equal(0)
    })

    it('should not go above ceil', function() {
      var sliderConf = {
        value: 990,
        options: {
          floor: 0,
          ceil: 1000,
          step: 10,
        },
      }
      helper.createSlider(sliderConf)
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'PAGEUP')
      expect(helper.scope.slider.value).to.equal(1000)
    })

    it('should not be modified by keyboard if disabled=true', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          disabled: true,
        },
      }
      helper.createSlider(sliderConf)
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'LEFT')
      expect(helper.scope.slider.value).to.equal(10)
    })

    it('should not be modified by keyboard if readOnly=true', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          readOnly: true,
        },
      }
      helper.createSlider(sliderConf)
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'LEFT')
      expect(helper.scope.slider.value).to.equal(10)
    })

    it('should not be modified by keyboard if new range is below minRange', function() {
      var sliderConf = {
        min: 45,
        max: 55,
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
          minRange: 10,
        },
      }
      helper.createRangeSlider(sliderConf)
      //try to move minH right
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'RIGHT')
      expect(helper.scope.slider.min).to.equal(45)

      //try to move maxH left
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'LEFT')
      expect(helper.scope.slider.max).to.equal(55)
    })

    it('should be modified by keyboard if new range is above minRange', function() {
      var sliderConf = {
        min: 45,
        max: 55,
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
          minRange: 10,
        },
      }
      helper.createRangeSlider(sliderConf)

      //try to move minH left
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'LEFT')
      expect(helper.scope.slider.min).to.equal(44)

      //try to move maxH right
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'RIGHT')
      expect(helper.scope.slider.max).to.equal(56)
    })

    it('should not be modified by keyboard if new range is above maxRange', function() {
      var sliderConf = {
        min: 45,
        max: 55,
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
          maxRange: 10,
        },
      }
      helper.createRangeSlider(sliderConf)
      //try to move minH left
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'LEFT')
      expect(helper.scope.slider.min).to.equal(45)

      //try to move maxH right
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'RIGHT')
      expect(helper.scope.slider.max).to.equal(55)
    })

    it('should be modified by keyboard if new range is below maxRange', function() {
      var sliderConf = {
        min: 45,
        max: 55,
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
          maxRange: 10,
        },
      }
      helper.createRangeSlider(sliderConf)

      //try to move minH right
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'RIGHT')
      expect(helper.scope.slider.min).to.equal(46)

      //try to move maxH left
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'LEFT')
      expect(helper.scope.slider.max).to.equal(54)
    })

    it('should be modified by keyboard if new value is above minLimit', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
          minLimit: 10,
        },
      }
      helper.createSlider(sliderConf)
      //try to move minH right
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'RIGHT')
      expect(helper.scope.slider.value).to.equal(11)
    })

    it('should not be modified by keyboard if new value is below minLimit', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
          minLimit: 10,
        },
      }
      helper.createSlider(sliderConf)
      //try to move minH left
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'LEFT')
      expect(helper.scope.slider.value).to.equal(10)
    })

    it('should be modified by keyboard if new value is below maxLimit', function() {
      var sliderConf = {
        value: 90,
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
          maxLimit: 90,
        },
      }
      helper.createSlider(sliderConf)
      //try to move minH left
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'LEFT')
      expect(helper.scope.slider.value).to.equal(89)
    })

    it('should not be modified by keyboard if new value is above maxLimit', function() {
      var sliderConf = {
        value: 90,
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
          maxLimit: 90,
        },
      }
      helper.createSlider(sliderConf)
      //try to move minH right
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'RIGHT')
      expect(helper.scope.slider.value).to.equal(90)
    })

    it('should refocus the slider after a reset if needed and still handle keyboard', function() {
      var sliderConf = {
        value: 90,
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
        },
      }
      helper.createSlider(sliderConf)
      //try to move minH right
      helper.slider.minH.triggerHandler('focus')

      helper.slider.resetSlider()

      helper.pressKeydown(helper.slider.minH, 'RIGHT')
      expect(document.activeElement).to.equal(helper.slider.minH[0])
      expect(helper.scope.slider.value).to.equal(91)
    })
  })

  describe('Right to left Keyboard controls - specific tests', function() {
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

    it('should not go below floor', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 1000,
          step: 10,
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'PAGEDOWN')
      expect(helper.scope.slider.value).to.equal(0)
    })

    it('should not go above ceil', function() {
      var sliderConf = {
        value: 990,
        options: {
          floor: 0,
          ceil: 1000,
          step: 10,
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'PAGEUP')
      expect(helper.scope.slider.value).to.equal(1000)
    })

    it('should not be modified by keyboard if disabled=true', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          disabled: true,
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'LEFT')
      expect(helper.scope.slider.value).to.equal(10)
    })

    it('should not be modified by keyboard if readOnly=true', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          readOnly: true,
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'LEFT')
      expect(helper.scope.slider.value).to.equal(10)
    })

    it('should not be modified by keyboard if new range is below minRange', function() {
      var sliderConf = {
        min: 45,
        max: 55,
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
          minRange: 10,
          rightToLeft: true,
        },
      }
      helper.createRangeSlider(sliderConf)
      //try to move minH left ( increase in rtl )
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'LEFT')
      expect(helper.scope.slider.min).to.equal(45)

      //try to move maxH right (decrease in rtl )
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'RIGHT')
      expect(helper.scope.slider.max).to.equal(55)
    })

    it('should be modified by keyboard if new range is above minRange', function() {
      var sliderConf = {
        min: 45,
        max: 55,
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
          minRange: 10,
          rightToLeft: true,
        },
      }
      helper.createRangeSlider(sliderConf)

      //try to move minH RIGHT
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'RIGHT')
      expect(helper.scope.slider.min).to.equal(44)

      //try to move maxH LEFT
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'LEFT')
      expect(helper.scope.slider.max).to.equal(56)
    })

    it('should not be modified by keyboard if new range is above maxRange', function() {
      var sliderConf = {
        min: 45,
        max: 55,
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
          maxRange: 10,
          rightToLeft: true,
        },
      }
      helper.createRangeSlider(sliderConf)
      //try to move minH right ( increase in rtl )
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'RIGHT')
      expect(helper.scope.slider.min).to.equal(45)

      //try to move maxH left (decrease in rtl )
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'LEFT')
      expect(helper.scope.slider.max).to.equal(55)
    })

    it('should be modified by keyboard if new range is below maxRange', function() {
      var sliderConf = {
        min: 45,
        max: 55,
        options: {
          floor: 0,
          ceil: 100,
          step: 1,
          maxRange: 10,
          rightToLeft: true,
        },
      }
      helper.createRangeSlider(sliderConf)

      //try to move minH LEFT
      helper.slider.minH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.minH, 'LEFT')
      expect(helper.scope.slider.min).to.equal(46)

      //try to move maxH RIGHT
      helper.slider.maxH.triggerHandler('focus')
      helper.pressKeydown(helper.slider.maxH, 'RIGHT')
      expect(helper.scope.slider.max).to.equal(54)
    })
  })
})()
