(function() {
  "use strict";

  describe('Mouse controls - Range Horizontal', function() {
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
        min: 0,
        max: 100,
        options: {
          floor: 0,
          ceil: 100
        }
      };
      helper.createRangeSlider(sliderConf);
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
      expect(helper.slider.tracking).to.equal('lowValue');
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
      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
    });

    it('should handle mousedown on maxH correctly when keyboardSupport is true', function() {
      sinon.spy(helper.slider, 'calcViewDimensions');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'focusElement');

      var event = helper.fireMousedown(helper.slider.maxH, 0);

      helper.slider.calcViewDimensions.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
      event.preventDefault.called.should.be.true;
      event.stopPropagation.called.should.be.true;
      expect(helper.slider.tracking).to.equal('highValue');
      expect(helper.slider.maxH.hasClass('rz-active')).to.be.true;
    });

    it('should handle mousedown on maxH correctly when keyboardSupport is false', function() {
      helper.scope.slider.options.keyboardSupport = false;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'calcViewDimensions');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'focusElement');

      var event = helper.fireMousedown(helper.slider.maxH, 0);

      helper.slider.calcViewDimensions.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.focusElement.called.should.be.false;
      event.preventDefault.called.should.be.true;
      event.stopPropagation.called.should.be.true;
      expect(helper.slider.tracking).to.equal('highValue');
      expect(helper.slider.maxH.hasClass('rz-active')).to.be.true;
    });

    it('should handle click and drag on minH correctly when mouse is on the middle', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnChange');
      var event = helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 50;
      helper.moveMouseToValue(expectedValue);
      expect(helper.scope.slider.min).to.equal(expectedValue);
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click and drag on maxH correctly when mouse is on the middle', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnChange');
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 50;
      helper.moveMouseToValue(expectedValue);
      expect(helper.scope.slider.max).to.equal(expectedValue);
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click and drag on minH and switch min/max if needed', function() {
      helper.scope.slider.min = 40;
      helper.scope.slider.max = 60;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'focusElement');
      helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 80;
      helper.moveMouseToValue(expectedValue);

      expect(helper.scope.slider.min).to.equal(60);
      expect(helper.scope.slider.max).to.equal(80);
      helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
    });

    it('should handle click and drag on minH and switch min/max if needed when keyboardSupport is false', function() {
      helper.scope.slider.options.keyboardSupport = false;
      helper.scope.slider.min = 40;
      helper.scope.slider.max = 60;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'focusElement');
      helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 80;
      helper.moveMouseToValue(expectedValue);

      expect(helper.scope.slider.min).to.equal(60);
      expect(helper.scope.slider.max).to.equal(80);
      helper.slider.focusElement.called.should.be.false;
    });

    it('should handle click and drag on maxH and switch min/max if needed', function() {
      helper.scope.slider.min = 40;
      helper.scope.slider.max = 60;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'focusElement');
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 20;
      helper.moveMouseToValue(expectedValue);

      expect(helper.scope.slider.min).to.equal(20);
      expect(helper.scope.slider.max).to.equal(40);
      helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
    });

    it('should handle click and drag on maxH and switch min/max if needed when keyboardSupport is false', function() {
      helper.scope.slider.options.keyboardSupport = false;
      helper.scope.slider.min = 40;
      helper.scope.slider.max = 60;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'focusElement');
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 20;
      helper.moveMouseToValue(expectedValue);

      expect(helper.scope.slider.min).to.equal(20);
      expect(helper.scope.slider.max).to.equal(40);
      helper.slider.focusElement.called.should.be.false;
    });

    it('should handle click on fullbar and move minH when click pos is nearer to minH', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');
      sinon.spy(helper.slider, 'focusElement');

      var expectedValue = 10,
        position = helper.getMousePosition(expectedValue);

      var event = helper.fireMousedown(helper.slider.fullBar, position);

      expect(helper.scope.slider.min).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('lowValue');
      helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click on fullbar and move maxH when click pos is nearer to maxH', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');
      sinon.spy(helper.slider, 'focusElement');

      var expectedValue = 90,
        position = helper.getMousePosition(expectedValue);

      var event = helper.fireMousedown(helper.slider.fullBar, position);

      expect(helper.scope.slider.max).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('highValue');
      helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click on selbar and move minH when click pos is nearer to minH', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');
      sinon.spy(helper.slider, 'focusElement');

      var expectedValue = 10,
        position = helper.getMousePosition(expectedValue);

      var event = helper.fireMousedown(helper.slider.selBar, position);

      expect(helper.scope.slider.min).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('lowValue');
      helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click on selbar and move maxH when click pos is nearer to maxH', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');
      sinon.spy(helper.slider, 'focusElement');

      var expectedValue = 90,
        position = helper.getMousePosition(expectedValue);

      var event = helper.fireMousedown(helper.slider.selBar, position);

      expect(helper.scope.slider.max).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('highValue');
      helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });
  });

  describe('Right to left Mouse controls - Range Horizontal', function() {
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
        min: 0,
        max: 100,
        options: {
          floor: 0,
          ceil: 100,
          rightToLeft: true
        }
      };
      helper.createRangeSlider(sliderConf);
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
      expect(helper.slider.tracking).to.equal('lowValue');
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
      expect(helper.slider.tracking).to.equal('lowValue');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
    });

    it('should handle mousedown on maxH correctly when keyboardSupport is true', function() {
      sinon.spy(helper.slider, 'calcViewDimensions');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'focusElement');

      var event = helper.fireMousedown(helper.slider.maxH, 0);

      helper.slider.calcViewDimensions.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
      event.preventDefault.called.should.be.true;
      event.stopPropagation.called.should.be.true;
      expect(helper.slider.tracking).to.equal('highValue');
      expect(helper.slider.maxH.hasClass('rz-active')).to.be.true;
    });

    it('should handle mousedown on maxH correctly when keyboardSupport is false', function() {
      helper.scope.slider.options.keyboardSupport = false;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'calcViewDimensions');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'focusElement');

      var event = helper.fireMousedown(helper.slider.maxH, 0);

      helper.slider.calcViewDimensions.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.focusElement.called.should.be.false;
      event.preventDefault.called.should.be.true;
      event.stopPropagation.called.should.be.true;
      expect(helper.slider.tracking).to.equal('highValue');
      expect(helper.slider.maxH.hasClass('rz-active')).to.be.true;
    });

    it('should handle click and drag on minH correctly when mouse is on the middle', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnChange');
      var event = helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 50;
      helper.moveMouseToValue(expectedValue);
      expect(helper.scope.slider.min).to.equal(expectedValue);
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click and drag on maxH correctly when mouse is on the middle', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnChange');
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 50;
      helper.moveMouseToValue(expectedValue);
      expect(helper.scope.slider.max).to.equal(expectedValue);
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click and drag on minH and switch min/max if needed', function() {
      helper.scope.slider.min = 40;
      helper.scope.slider.max = 60;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'focusElement');
      helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 80;
      helper.moveMouseToValue(expectedValue);

      expect(helper.scope.slider.min).to.equal(60);
      expect(helper.scope.slider.max).to.equal(80);
      helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
    });

    it('should handle click and drag on minH and switch min/max if needed when keyboardSupport is false', function() {
      helper.scope.slider.options.keyboardSupport = false;
      helper.scope.slider.min = 40;
      helper.scope.slider.max = 60;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'focusElement');
      helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 80;
      helper.moveMouseToValue(expectedValue);

      expect(helper.scope.slider.min).to.equal(60);
      expect(helper.scope.slider.max).to.equal(80);
      helper.slider.focusElement.called.should.be.false;
    });

    it('should handle click and drag on maxH and switch min/max if needed', function() {
      helper.scope.slider.min = 40;
      helper.scope.slider.max = 60;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'focusElement');
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 20;
      helper.moveMouseToValue(expectedValue);

      expect(helper.scope.slider.min).to.equal(20);
      expect(helper.scope.slider.max).to.equal(40);
      helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
    });

    it('should handle click and drag on maxH and switch min/max if needed when keyboardSupport is false', function() {
      helper.scope.slider.options.keyboardSupport = false;
      helper.scope.slider.min = 40;
      helper.scope.slider.max = 60;
      helper.scope.$digest();

      sinon.spy(helper.slider, 'focusElement');
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 20;
      helper.moveMouseToValue(expectedValue);

      expect(helper.scope.slider.min).to.equal(20);
      expect(helper.scope.slider.max).to.equal(40);
      helper.slider.focusElement.called.should.be.false;
    });

    it('should handle click on fullbar and move minH when click pos is nearer to minH', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');
      sinon.spy(helper.slider, 'focusElement');

      var expectedValue = 10,
        position = helper.getMousePosition(expectedValue);

      var event = helper.fireMousedown(helper.slider.fullBar, position);

      expect(helper.scope.slider.min).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('lowValue');
      helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click on fullbar and move maxH when click pos is nearer to maxH', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');
      sinon.spy(helper.slider, 'focusElement');

      var expectedValue = 90,
        position = helper.getMousePosition(expectedValue);

      var event = helper.fireMousedown(helper.slider.fullBar, position);

      expect(helper.scope.slider.max).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('highValue');
      helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click on selbar and move minH when click pos is nearer to minH', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');
      sinon.spy(helper.slider, 'focusElement');

      var expectedValue = 10,
        position = helper.getMousePosition(expectedValue);

      var event = helper.fireMousedown(helper.slider.selBar, position);

      expect(helper.scope.slider.min).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('lowValue');
      helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });

    it('should handle click on selbar and move maxH when click pos is nearer to maxH', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');
      sinon.spy(helper.slider, 'focusElement');

      var expectedValue = 90,
        position = helper.getMousePosition(expectedValue);

      var event = helper.fireMousedown(helper.slider.selBar, position);

      expect(helper.scope.slider.max).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('highValue');
      helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
      expect(helper.slider.positionTrackingHandle.callCount).to.equal(1);
      expect(helper.slider.callOnStart.callCount).to.equal(1);
      expect(helper.slider.callOnChange.callCount).to.equal(1);
    });
  });
}());
