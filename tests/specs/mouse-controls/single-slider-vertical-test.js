(function() {
  "use strict";

  describe('Mouse controls - Single Vertical', function() {
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
          vertical: true
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

      var event = helper.fireMousedown(helper.slider.minH, 0, true);

      helper.slider.calcViewDimensions.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
      event.preventDefault.called.should.be.true;
      event.stopPropagation.called.should.be.true;
      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
    });

    it('should handle mousedown on minH correctly when keyboardSupport is false', function() {
      helper.scope.slider.options.keyboardSupport = false;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'calcViewDimensions');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'focusElement');

      var event = helper.fireMousedown(helper.slider.minH, 0, true);

      helper.slider.calcViewDimensions.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.focusElement.called.should.be.false;
      event.preventDefault.called.should.be.true;
      event.stopPropagation.called.should.be.true;
      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
    });

    it('should handle click and drag on minH correctly when mouse is on the middle', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnChange');
      helper.fireMousedown(helper.slider.minH, 0, true);

      var expectedValue = 50,
        position = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(expectedValue) - helper.slider.handleHalfDim;

      helper.fireMousemove(position, true);
      expect(helper.scope.slider.value).to.equal(expectedValue);
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click and drag on minH correctly when mouse is before the slider and previous value was different than 0', function() {
      helper.scope.slider.value = 50;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'positionTrackingHandle');
      var event = helper.fireMousedown(helper.slider.minH, 0, true);
      helper.fireMousemove(helper.slider.maxPos + 100, true);
      expect(helper.scope.slider.value).to.equal(0);
      helper.slider.positionTrackingHandle.called.should.be.true;
    });

    it('should handle click and drag on minH correctly when mouse is after the slider and previous value was different than 100', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      var event = helper.fireMousedown(helper.slider.minH, 0, true);
      helper.fireMousemove(-100, true);
      expect(helper.scope.slider.value).to.equal(100);
      helper.slider.positionTrackingHandle.called.should.be.true;
    });

    it('should call correct callbacks on slider end and keep handle focused when keyboardSupport is true', function() {
      var event = helper.fireMousedown(helper.slider.minH, 0, true);

      sinon.spy(helper.slider, 'callOnEnd');
      sinon.spy(helper.slider.scope, '$emit');
      helper.fireMouseup();

      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      helper.slider.callOnEnd.called.should.be.true;
      helper.slider.scope.$emit.calledWith('slideEnded').should.be.true;
    });

    it('should call correct callbacks on slider end and not keep handle focused when keyboardSupport is false', function() {
      helper.scope.slider.options.keyboardSupport = false;
      helper.scope.$digest();
      var event = helper.fireMousedown(helper.slider.minH, 0, true);

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

      var expectedValue = 50,
        position = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(expectedValue) - helper.slider.handleHalfDim;

      var event = helper.fireMousedown(helper.slider.fullBar, position, true);

      expect(helper.scope.slider.value).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click on selbar and move minH', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');

      var expectedValue = 12,
        position = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(expectedValue) - helper.slider.handleHalfDim;

      helper.fireMousedown(helper.slider.selBar, position, true);

      expect(helper.scope.slider.value).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click on ticks and move minH', function() {
      helper.scope.slider.options.step = 10;
      helper.scope.slider.options.showTicks = true;
      helper.scope.$digest();
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');

      var expectedValue = 10,
        position = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(expectedValue) - helper.slider.handleHalfDim;

      helper.fireMousedown(helper.slider.ticks, position, true);

      expect(helper.scope.slider.value).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click on ticks when showTicks is an integer and move minH', function() {
      helper.scope.slider.options.step = 1;
      helper.scope.slider.options.showTicks = 10;
      helper.scope.$digest();
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');

      var expectedValue = 10,
        position = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(expectedValue) - helper.slider.handleHalfDim;

      helper.fireMousedown(helper.slider.ticks, position, true);

      expect(helper.scope.slider.value).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });
  });

  describe('Right to left Mouse controls - Single Vertical', function() {
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
          vertical: true,
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

      var event = helper.fireMousedown(helper.slider.minH, 0, true);

      helper.slider.calcViewDimensions.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
      event.preventDefault.called.should.be.true;
      event.stopPropagation.called.should.be.true;
      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
    });

    it('should handle mousedown on minH correctly when keyboardSupport is false', function() {
      helper.scope.slider.options.keyboardSupport = false;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'calcViewDimensions');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'focusElement');

      var event = helper.fireMousedown(helper.slider.minH, 0, true);

      helper.slider.calcViewDimensions.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.focusElement.called.should.be.false;
      event.preventDefault.called.should.be.true;
      event.stopPropagation.called.should.be.true;
      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
    });

    it('should handle click and drag on minH correctly when mouse is on the middle', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnChange');
      helper.fireMousedown(helper.slider.minH, 0, true);

      var expectedValue = 50,
        position = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(expectedValue) - helper.slider.handleHalfDim;

      helper.fireMousemove(position, true);
      expect(helper.scope.slider.value).to.equal(expectedValue);
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click and drag on minH correctly when mouse is before the slider and previous value was different than 0', function() {
      helper.scope.slider.value = 50;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'positionTrackingHandle');
      var event = helper.fireMousedown(helper.slider.minH, 0, true);
      helper.fireMousemove(-100, true);
      expect(helper.scope.slider.value).to.equal(0);
      helper.slider.positionTrackingHandle.called.should.be.true;
    });

    it('should handle click and drag on minH correctly when mouse is after the slider and previous value was different than 100', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      var event = helper.fireMousedown(helper.slider.minH, 0, true);
      helper.fireMousemove(helper.slider.maxPos + 100, true);
      expect(helper.scope.slider.value).to.equal(100);
      helper.slider.positionTrackingHandle.called.should.be.true;
    });

    it('should call correct callbacks on slider end and keep handle focused when keyboardSupport is true', function() {
      var event = helper.fireMousedown(helper.slider.minH, 0, true);

      sinon.spy(helper.slider, 'callOnEnd');
      sinon.spy(helper.slider.scope, '$emit');
      helper.fireMouseup();

      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      helper.slider.callOnEnd.called.should.be.true;
      helper.slider.scope.$emit.calledWith('slideEnded').should.be.true;
    });

    it('should call correct callbacks on slider end and not keep handle focused when keyboardSupport is false', function() {
      helper.scope.slider.options.keyboardSupport = false;
      helper.scope.$digest();
      var event = helper.fireMousedown(helper.slider.minH, 0, true);

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

      var expectedValue = 50,
        position = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(expectedValue) - helper.slider.handleHalfDim;

      var event = helper.fireMousedown(helper.slider.fullBar, position, true);

      expect(helper.scope.slider.value).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click on selbar and move minH', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');

      var expectedValue = 12,
        position = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(expectedValue) - helper.slider.handleHalfDim;

      helper.fireMousedown(helper.slider.selBar, position, true);

      expect(helper.scope.slider.value).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click on ticks and move minH', function() {
      helper.scope.slider.options.step = 10;
      helper.scope.slider.options.showTicks = true;
      helper.scope.$digest();
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');

      var expectedValue = 10,
        position = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(expectedValue) - helper.slider.handleHalfDim;

      helper.fireMousedown(helper.slider.ticks, position, true);

      expect(helper.scope.slider.value).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click on ticks when showTicks is an integer and move minH', function() {
      helper.scope.slider.options.step = 1;
      helper.scope.slider.options.showTicks = 10;
      helper.scope.$digest();
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');

      var expectedValue = 10,
        position = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(expectedValue) - helper.slider.handleHalfDim;

      helper.fireMousedown(helper.slider.ticks, position, true);

      expect(helper.scope.slider.value).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });
    
    it('should handle touch start, touch move and touch end correctly when multitouch with originalEvent', function() {
    	sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnChange');
        // Touch start for the slider
        var eventOnSlider = helper.fireTouchstartWithOriginalEvent(helper.slider.minH, 0, 0, [0], true);
        
        var expectedValue = 50;
        var touchPositionForSlider = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(expectedValue) - helper.slider.handleHalfDim;
        
        // Touch move for the slider
        helper.fireTouchmoveWithOriginalEvent(touchPositionForSlider, 0, [0, 1], true);
        
        // Simultaneous touch move but not on slider
        var otherTouchPosition = touchPositionForSlider + 100;
        helper.fireTouchmoveWithOriginalEvent(otherTouchPosition, 1, [0, 1], true);
        
        // The slider does not react
        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
        expect(helper.slider.callOnChange.callCount).to.equal(1);
        
        // The other simultaneous touch ends
        helper.fireTouchendWithOriginalEvent(1, [0,1], true);
        
        var expectedValue = 60;
        var touchPositionForSlider = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(expectedValue) - helper.slider.handleHalfDim;
        // Touch move for the slider
        helper.fireTouchmoveWithOriginalEvent(touchPositionForSlider, 0, [0, 1], true);
        
        // Can still drag the slider
        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.positionTrackingHandle.callCount).to.equal(2);
        expect(helper.slider.callOnChange.callCount).to.equal(2);
        
        // Slider touch ends
        helper.fireTouchendWithOriginalEvent(0, [0,1], true);
        
        // Touch move for the slider
        var touchPositionForSlider = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(70) - helper.slider.handleHalfDim;
        helper.fireTouchmoveWithOriginalEvent(touchPositionForSlider, 0, [0, 1], true);
        
        //Can not drag the slider anymore
        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.positionTrackingHandle.callCount).to.equal(2);
        expect(helper.slider.callOnChange.callCount).to.equal(2);
    });
    
    it('should handle touch start, touch move and touch end correctly when multitouch without originalEvent', function() {
    	sinon.spy(helper.slider, 'positionTrackingHandle');
        sinon.spy(helper.slider, 'callOnChange');
        
        // Touch start for the slider
        var eventOnSlider = helper.fireTouchstartWithoutOriginalEvent(helper.slider.minH, 0, 0, [0], true);
        var expectedValue = 50;
        var touchPositionForSlider = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(expectedValue) - helper.slider.handleHalfDim;
        
        // Touch move for slider
        helper.fireTouchmoveWithoutOriginalEvent(touchPositionForSlider, 0, [0, 1], true);
        
        // Simultaneous touch move but not on slider
        var otherTouchPosition = touchPositionForSlider + 100;
        helper.fireTouchmoveWithoutOriginalEvent(otherTouchPosition, 1, [0, 1], true);
        
        // The slider does not react
        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
        expect(helper.slider.callOnChange.callCount).to.equal(1);
        
        // The other simultaneous touch ends
        helper.fireTouchendWithoutOriginalEvent(1, [0,1], true);
        
        var expectedValue = 60;
        var touchPositionForSlider = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(expectedValue) - helper.slider.handleHalfDim;
        // Touch move for slider
        helper.fireTouchmoveWithoutOriginalEvent(touchPositionForSlider, 0, [0, 1], true);
        
        // Can still drag the slider
        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.positionTrackingHandle.callCount).to.equal(2);
        expect(helper.slider.callOnChange.callCount).to.equal(2);
        
        // Slider touch ends
        helper.fireTouchendWithoutOriginalEvent(0, [0,1], true);
        
        // Touch move for the slider
        var touchPositionForSlider = helper.slider.sliderElem.rzsp - helper.slider.valueToPosition(70) - helper.slider.handleHalfDim;
        
        // Can not drag the slider anymore
        helper.fireTouchmoveWithoutOriginalEvent(touchPositionForSlider, 0, [0, 1], true);
        
        expect(helper.scope.slider.value).to.equal(expectedValue);
        expect(helper.slider.positionTrackingHandle.callCount).to.equal(2);
        expect(helper.slider.callOnChange.callCount).to.equal(2);
    });
  });

}());
