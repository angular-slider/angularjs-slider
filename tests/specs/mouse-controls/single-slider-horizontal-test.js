(function() {
  "use strict";

  describe('Mouse controls - Single Horizontal', function() {
    var helper,
      RzSliderOptions,
      $rootScope,
      $timeout;

    beforeEach(module('test-helper'));

    beforeEach(inject(function (TestHelper, _RzSliderOptions_, _$rootScope_, _$timeout_) {
      helper = TestHelper;
      RzSliderOptions = _RzSliderOptions_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
    }));

    afterEach(function () {
      helper.clean();
    });

    beforeEach(function () {
      var sliderConf = {
        value: 0,
        options: {
          floor: 0,
          ceil: 100
        }
      };
      helper.createSlider(sliderConf);
    });
    afterEach(function () {
      // to clean document listener
      helper.fireMouseup();
    });

    it('should handle mousedown on minH correctly when keyboardSupport is true', function () {
      sinon.spy(helper.slider, 'calcViewDimensions');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'focusElement');

      var event = helper.fireMousedown(helper.slider.minH, 0);

      helper.slider.calcViewDimensions.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
      event.preventDefault.called.should.be.true;
      event.stopPropagation.called.should.be.true;
      expect(helper.slider.tracking).to.equal('rzSliderModel');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
    });

    it('should handle mousedown on minH correctly when keyboardSupport is false', function () {
      helper.scope.slider.options.keyboardSupport = false;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'calcViewDimensions');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'focusElement');

      var event = helper.fireMousedown(helper.slider.minH, 0);

      helper.slider.calcViewDimensions.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.focusElement.called.should.be.false;
      event.preventDefault.called.should.be.true;
      event.stopPropagation.called.should.be.true;
      expect(helper.slider.tracking).to.equal('rzSliderModel');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
    });

    it('should handle click and drag on minH correctly when mouse is on the middle', function () {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnChange');
      var event = helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 50,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.value).to.equal(expectedValue);
      helper.slider.positionTrackingHandle.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click and drag on minH correctly when mouse is before the slider and previous value was different than 0', function () {
      helper.scope.slider.value = 50;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'positionTrackingHandle');
      var event = helper.fireMousedown(helper.slider.minH, 0);
      helper.fireMousemove(-100);
      expect(helper.scope.slider.value).to.equal(0);
      helper.slider.positionTrackingHandle.called.should.be.true;
    });

    it('should handle click and drag on minH correctly when mouse is after the slider and previous value was different than 100', function () {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      var event = helper.fireMousedown(helper.slider.minH, 0);
      helper.fireMousemove(helper.slider.maxPos + 100);
      expect(helper.scope.slider.value).to.equal(100);
      helper.slider.positionTrackingHandle.called.should.be.true;
    });

    it('should call correct callbacks on slider end and keep handle focused when keyboardSupport is true', function () {
      var event = helper.fireMousedown(helper.slider.minH, 0);

      sinon.spy(helper.slider, 'callOnEnd');
      sinon.spy(helper.slider.scope, '$emit');
      helper.fireMouseup();

      expect(helper.slider.tracking).to.equal('rzSliderModel');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      helper.slider.callOnEnd.called.should.be.true;
      helper.slider.scope.$emit.calledWith('slideEnded').should.be.true;
    });

    it('should call correct callbacks on slider end and not keep handle focused when keyboardSupport is false', function () {
      helper.scope.slider.options.keyboardSupport = false;
      helper.scope.$digest();
      var event = helper.fireMousedown(helper.slider.minH, 0);

      sinon.spy(helper.slider, 'callOnEnd');
      sinon.spy(helper.slider.scope, '$emit');

      helper.fireMouseup();

      expect(helper.slider.tracking).to.equal('');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.false;
      helper.slider.callOnEnd.called.should.be.true;
      helper.slider.scope.$emit.calledWith('slideEnded').should.be.true;
    });

    it('should handle click on fullbar and move minH', function () {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');

      var expectedValue = 12,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

      helper.fireMousedown(helper.slider.fullBar, offset);

      expect(helper.scope.slider.value).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('rzSliderModel');
      helper.slider.positionTrackingHandle.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click on selbar and move minH', function () {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');

      var expectedValue = 12,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

      var event = helper.fireMousedown(helper.slider.selBar, offset);

      expect(helper.scope.slider.value).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('rzSliderModel');
      helper.slider.positionTrackingHandle.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click on ticks and move minH', function () {
      helper.scope.slider.options.step = 10;
      helper.scope.slider.options.showTicks = true;
      helper.scope.$digest();
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');

      var expectedValue = 10,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

      helper.fireMousedown(helper.slider.ticks, offset);

      expect(helper.scope.slider.value).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('rzSliderModel');
      helper.slider.positionTrackingHandle.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click on ticks when showTicks is an integer and move minH', function () {
      helper.scope.slider.options.step = 1;
      helper.scope.slider.options.showTicks = 10;
      helper.scope.$digest();
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');

      var expectedValue = 10,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

      helper.fireMousedown(helper.slider.ticks, offset);

      expect(helper.scope.slider.value).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('rzSliderModel');
      helper.slider.positionTrackingHandle.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });
  });

    describe('Right to left Mouse controls - Single Horizontal', function() {
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
          value: 0,
          options: {
            floor: 0,
            ceil: 100,
            rightToLeft: true
          }
        };
        helper.createSlider(sliderConf);
      });
      afterEach(function() {
        // to clean document listener
        helper.fireMouseup();
      });

      it('should handle mousedown on minH correctly when keyboardSupport is true', function() {
        sinon.spy(helper.slider, 'calcViewDimensions');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'focusElement');

        var event = helper.fireMousedown(helper.slider.minH, 0);

        helper.slider.calcViewDimensions.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle mousedown on minH correctly when keyboardSupport is false', function() {
        helper.scope.slider.options.keyboardSupport = false;
        helper.scope.$digest();

        sinon.spy(helper.slider, 'calcViewDimensions');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'focusElement');

        var event = helper.fireMousedown(helper.slider.minH, 0);

        helper.slider.calcViewDimensions.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.focusElement.called.should.be.false;
        event.preventDefault.called.should.be.true;
        event.stopPropagation.called.should.be.true;
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is on the middle', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnChange');
        var event = helper.fireMousedown(helper.slider.minH, 0);
        var expectedValue = 50,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
        helper.fireMousemove(offset);
        expect(helper.scope.slider.value).to.equal(expectedValue);
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is before the slider and previous value was different than 0', function() {
        helper.scope.slider.value = 50;
        helper.scope.$digest();
        sinon.spy(helper.slider, 'positionTrackingHandle');
        var event = helper.fireMousedown(helper.slider.minH, 0);
        helper.fireMousemove(helper.slider.maxPos + 100);
        expect(helper.scope.slider.value).to.equal(0);
        helper.slider.positionTrackingHandle.called.should.be.true;
      });

      it('should handle click and drag on minH correctly when mouse is after the slider and previous value was different than 100', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        var event = helper.fireMousedown(helper.slider.minH, 0);
        helper.fireMousemove(-100);
        expect(helper.scope.slider.value).to.equal(100);
        helper.slider.positionTrackingHandle.called.should.be.true;
      });

      it('should call correct callbacks on slider end and keep handle focused when keyboardSupport is true', function() {
        var event = helper.fireMousedown(helper.slider.minH, 0);

        sinon.spy(helper.slider, 'callOnEnd');
        sinon.spy(helper.slider.scope, '$emit');
        helper.fireMouseup();

        expect(helper.slider.tracking).to.equal('rzSliderModel');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
        helper.slider.callOnEnd.called.should.be.true;
        helper.slider.scope.$emit.calledWith('slideEnded').should.be.true;
      });

      it('should call correct callbacks on slider end and not keep handle focused when keyboardSupport is false', function() {
        helper.scope.slider.options.keyboardSupport = false;
        helper.scope.$digest();
        var event = helper.fireMousedown(helper.slider.minH, 0);

        sinon.spy(helper.slider, 'callOnEnd');
        sinon.spy(helper.slider.scope, '$emit');

        helper.fireMouseup();

        expect(helper.slider.tracking).to.equal('');
        expect(helper.slider.minH.hasClass('rz-active')).to.be.false;
        helper.slider.callOnEnd.called.should.be.true;
        helper.slider.scope.$emit.calledWith('slideEnded').should.be.true;
      });

      it('should handle click on fullbar and move minH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');

        var expectedValue = 12,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

        helper.fireMousedown(helper.slider.fullBar, offset);

        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on selbar and move minH', function() {
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');

        var expectedValue = 12,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

        var event = helper.fireMousedown(helper.slider.selBar, offset);

        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on ticks and move minH', function() {
        helper.scope.slider.options.step = 10;
        helper.scope.slider.options.showTicks = true;
        helper.scope.$digest();
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');

        var expectedValue = 10,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

        helper.fireMousedown(helper.slider.ticks, offset);

        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });

      it('should handle click on ticks when showTicks is an integer and move minH', function() {
        helper.scope.slider.options.step = 1;
        helper.scope.slider.options.showTicks = 10;
        helper.scope.$digest();
        sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnStart');
        sinon.spy(helper.slider, 'callOnChange');

        var expectedValue = 10,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

        helper.fireMousedown(helper.slider.ticks, offset);

        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.tracking).to.equal('rzSliderModel');
        helper.slider.positionTrackingHandle.called.should.be.true;
        helper.slider.callOnStart.called.should.be.true;
        helper.slider.callOnChange.called.should.be.true;
      });
  });
}());

