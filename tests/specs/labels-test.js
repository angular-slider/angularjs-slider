;(function() {
  'use strict'

  describe('Single slider initialisation - ', function() {
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

    it('should display floor and ceil labels when handle is at the middle', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.slider.flrLab.css('visibility')).to.equal('visible')
      expect(helper.slider.ceilLab.css('visibility')).to.equal('visible')
    })

    it('should hide floor and display ceil labels when handle is at min', function() {
      var sliderConf = {
        value: 0,
        options: {
          floor: 0,
          ceil: 100,
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.slider.flrLab.css('visibility')).to.equal('hidden')
      expect(helper.slider.ceilLab.css('visibility')).to.equal('visible')
    })

    it('should show floor and hide ceil labels when handle is at max', function() {
      var sliderConf = {
        value: 100,
        options: {
          floor: 0,
          ceil: 100,
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.slider.flrLab.css('visibility')).to.equal('visible')
      expect(helper.slider.ceilLab.css('visibility')).to.equal('hidden')
    })

    it('should display floor and ceil labels when handle is at the middle for RTL slider', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.slider.flrLab.css('visibility')).to.equal('visible')
      expect(helper.slider.ceilLab.css('visibility')).to.equal('visible')
    })

    it('should hide floor and display ceil labels when handle is at min for RTL slider', function() {
      var sliderConf = {
        value: 0,
        options: {
          floor: 0,
          ceil: 100,
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.slider.flrLab.css('visibility')).to.equal('hidden')
      expect(helper.slider.ceilLab.css('visibility')).to.equal('visible')
    })

    it('should show floor and hide ceil labels when handle is at max for RTL slider', function() {
      var sliderConf = {
        value: 100,
        options: {
          floor: 0,
          ceil: 100,
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.slider.flrLab.css('visibility')).to.equal('visible')
      expect(helper.slider.ceilLab.css('visibility')).to.equal('hidden')
    })

    it('should hide floor and ceil labels when minHandle is at min and maxHandle at max for range slider', function() {
      var sliderConf = {
        min: 0,
        max: 100,
        options: {
          floor: 0,
          ceil: 100,
        },
      }
      helper.createRangeSlider(sliderConf)
      expect(helper.slider.flrLab.css('visibility')).to.equal('hidden')
      expect(helper.slider.ceilLab.css('visibility')).to.equal('hidden')
    })

    it('should hide floor and ceil labels when minHandle is at min and maxHandle at max for range RTL slider', function() {
      var sliderConf = {
        min: 0,
        max: 100,
        options: {
          floor: 0,
          ceil: 100,
          rightToLeft: true,
        },
      }
      helper.createRangeSlider(sliderConf)
      expect(helper.slider.flrLab.css('visibility')).to.equal('hidden')
      expect(helper.slider.ceilLab.css('visibility')).to.equal('hidden')
    })

    it('should hide floor and ceil labels when cmb label is overlapping, for range slider', function() {
      var sliderConf = {
        minValue: 50,
        maxValue: 50,
        options: {
          floor: 0,
          ceil: 100,
          translate: function(v, _, which) {
            if (which != 'model' && which != 'high') return v
            return "I'm whatever long text ==============================================================================================================================================================="
          },
        },
      }

      helper.createRangeSlider(sliderConf)
      expect(helper.slider.flrLab.css('visibility')).to.equal('hidden')
      expect(helper.slider.ceilLab.css('visibility')).to.equal('hidden')
    })

    it('should hide floor and ceil labels when cmb label is overlapping, for range RTL slider', function() {
      var sliderConf = {
        minValue: 50,
        maxValue: 50,
        options: {
          floor: 0,
          ceil: 100,
          translate: function(v, _, which) {
            if (which != 'model' && which != 'high') return v
            return "I'm whatever long text ==============================================================================================================================================================="
          },
        },
        rightToLeft: true,
      }
      helper.createRangeSlider(sliderConf)
      expect(helper.slider.flrLab.css('visibility')).to.equal('hidden')
      expect(helper.slider.ceilLab.css('visibility')).to.equal('hidden')
    })
  })
})()
