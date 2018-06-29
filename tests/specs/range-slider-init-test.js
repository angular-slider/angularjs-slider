;(function() {
  'use strict'

  describe('Range slider initialisation - ', function() {
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

    it('should exist compiled and with correct config', function() {
      expect(helper.element.find('span')).to.have.length(17)
      expect(helper.slider.range).to.be.true
      expect(helper.slider.valueRange).to.equal(100)
      expect(helper.slider.maxH.css('display')).to.equal('')
    })

    it('should watch rzSliderHigh and reflow the slider accordingly', function() {
      sinon.spy(helper.slider, 'onHighHandleChange')
      helper.scope.slider.max = 95
      helper.scope.$digest()
      helper.slider.onHighHandleChange.called.should.be.true
    })

    it('should switch to a single slider when rzSliderHigh is unset after init', function() {
      sinon.spy(helper.slider, 'onHighHandleChange')
      sinon.spy(helper.slider, 'applyOptions')
      sinon.spy(helper.slider, 'resetSlider')
      helper.scope.slider.max = undefined
      helper.scope.$digest()
      helper.slider.onHighHandleChange.called.should.be.false
      helper.slider.applyOptions.called.should.be.true
      helper.slider.resetSlider.called.should.be.true
    })

    it('should switch to a range slider when rzSliderHigh is set after init', function() {
      helper.scope.slider.max = undefined
      helper.scope.$digest()
      sinon.spy(helper.slider, 'onHighHandleChange')
      sinon.spy(helper.slider, 'applyOptions')
      sinon.spy(helper.slider, 'resetSlider')
      helper.scope.slider.max = 100
      helper.scope.$digest()
      helper.slider.onHighHandleChange.called.should.be.true
      helper.slider.applyOptions.called.should.be.true
      helper.slider.resetSlider.called.should.be.true
    })

    it('should round the model value to the step', function() {
      helper.scope.slider.min = 23
      helper.scope.slider.max = 84
      helper.scope.$digest()
      expect(helper.scope.slider.min).to.equal(20)
      expect(helper.scope.slider.max).to.equal(80)

      helper.scope.slider.min = 25
      helper.scope.slider.max = 95
      helper.scope.$digest()
      $timeout.flush() //to flush the throttle function
      expect(helper.scope.slider.min).to.equal(30)
      expect(helper.scope.slider.max).to.equal(100)
    })

    it('should reset everything on rzSliderForceRender', function() {
      sinon.spy(helper.slider, 'resetLabelsValue')
      sinon.spy(helper.slider, 'resetSlider')
      sinon.spy(helper.slider, 'onLowHandleChange')
      sinon.spy(helper.slider, 'onHighHandleChange')

      helper.scope.$broadcast('rzSliderForceRender')

      helper.slider.resetLabelsValue.called.should.be.true
      helper.slider.resetSlider.called.should.be.true
      helper.slider.onLowHandleChange.called.should.be.true
      helper.slider.onHighHandleChange.called.should.be.true
    })
  })
})()
