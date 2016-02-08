(function() {
  "use strict";

  describe('Single slider initialisation - ', function() {
    var helper,
      RzSliderOptions,
      $rootScope,
      $timeout;

    beforeEach(module('test-helper'));

    beforeEach(inject(function(TestHelper, _RzSliderOptions_, _$rootScope_, _$timeout_) {
      helper = TestHelper;
      RzSliderOptions = _RzSliderOptions_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
    }));

    afterEach(function() {
      helper.clean();
    });

    beforeEach(function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          step: 10
        }
      };
      helper.createSlider(sliderConf);
    });

    it('should exist compiled and with correct config', function() {
      expect(helper.element.find('span')).to.have.length(11);
      expect(helper.slider.range).to.be.false;
      expect(helper.slider.valueRange).to.equal(100);
      expect(helper.slider.maxH.css('display')).to.equal('none');
    });

    it('should watch rzSliderModel and reflow the slider accordingly', function() {
      sinon.spy(helper.slider, 'onLowHandleChange');
      helper.scope.slider.value = 54;
      helper.scope.$digest();
      helper.slider.onLowHandleChange.called.should.be.true;
    });

    it('should watch rzSliderOptions and reset the slider accordingly', function() {
      sinon.spy(helper.slider, 'applyOptions');
      sinon.spy(helper.slider, 'resetSlider');
      helper.scope.slider.options.showTicks = true;
      helper.scope.$digest();
      helper.slider.applyOptions.called.should.be.true;
      helper.slider.resetSlider.called.should.be.true;
    });

    it('should round the model value to the step by default', function() {
      helper.scope.slider.value = 54;
      helper.scope.$digest();
      expect(helper.scope.slider.value).to.equal(50);

      helper.scope.slider.value = 55;
      helper.scope.$digest();
      $timeout.flush(); //to flush the throttle function since we modify twice in a row
      expect(helper.scope.slider.value).to.equal(60);
    });

    it('should call calcViewDimensions() on reCalcViewDimensions', function() {
      sinon.spy(helper.slider, 'calcViewDimensions');
      helper.scope.$broadcast('reCalcViewDimensions');
      helper.slider.calcViewDimensions.called.should.be.true;
    });

    it('should reset everything on rzSliderForceRender', function() {
      sinon.spy(helper.slider, 'resetLabelsValue');
      sinon.spy(helper.slider, 'resetSlider');
      sinon.spy(helper.slider, 'onLowHandleChange');

      helper.scope.$broadcast('rzSliderForceRender');

      helper.slider.resetLabelsValue.called.should.be.true;
      helper.slider.resetSlider.called.should.be.true;
      helper.slider.onLowHandleChange.called.should.be.true;
    });

    it('should call calcViewDimensions() on window resize event', inject(function($window) {
      sinon.spy(helper.slider, 'calcViewDimensions');
      angular.element($window).triggerHandler('resize');
      helper.slider.calcViewDimensions.called.should.be.true;
    }));

    it('should unregister all dom events on $destroy', inject(function($window) {
      sinon.spy(helper.slider, 'calcViewDimensions');
      sinon.spy(helper.slider, 'unbindEvents');

      helper.scope.$broadcast('$destroy');
      angular.element($window).triggerHandler('resize');

      helper.slider.calcViewDimensions.called.should.be.false;
      helper.slider.unbindEvents.called.should.be.true;
    }));
  });
}());

