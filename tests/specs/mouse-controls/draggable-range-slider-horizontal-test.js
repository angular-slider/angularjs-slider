(function() {
  "use strict";

  describe('Mouse controls - draggableRange Horizontal', function() {
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
        min: 40,
        max: 60,
        options: {
          floor: 0,
          ceil: 100,
          draggableRange: true
        }
      };
      helper.createRangeSlider(sliderConf);
    });
    afterEach(function() {
      // to clean document listener
      helper.fireMouseup();
    });

    it('should handle click and drag on minH correctly when mouse is on the middle', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnChange');
      var event = helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 50,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(expectedValue);
      helper.slider.positionTrackingHandle.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click and drag on maxH correctly when mouse is on the middle', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnChange');
      var event = helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 50,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.max).to.equal(expectedValue);
      helper.slider.positionTrackingHandle.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click and drag on minH and switch min/max if needed', function() {
      var event = helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 80,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);

      expect(helper.scope.slider.min).to.equal(60);
      expect(helper.scope.slider.max).to.equal(80);
    });

    it('should handle click and drag on maxH and switch min/max if needed', function() {
      var event = helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 20,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);

      expect(helper.scope.slider.min).to.equal(20);
      expect(helper.scope.slider.max).to.equal(40);
    });

    it('should handle click on fullbar and move minH when click pos is nearer to minH', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');
      sinon.spy(helper.slider, 'focusElement');

      var expectedValue = 10,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

      var event = helper.fireMousedown(helper.slider.fullBar, offset);

      expect(helper.scope.slider.min).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('rzSliderModel');
      helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
      helper.slider.positionTrackingHandle.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click on fullbar and move maxH when click pos is nearer to maxH', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');
      sinon.spy(helper.slider, 'focusElement');

      var expectedValue = 90,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

      var event = helper.fireMousedown(helper.slider.fullBar, offset);

      expect(helper.scope.slider.max).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('rzSliderHigh');
      helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
      helper.slider.positionTrackingHandle.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click on selbar and move whole range when moved within slider range', function() {
      sinon.spy(helper.slider, 'positionTrackingBar');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');
      sinon.spy(helper.slider, 'focusElement');

      helper.fireMousedown(helper.slider.selBar, 0);

      var moveValue = 10,
        offset = helper.slider.valueToOffset(moveValue);
      helper.fireMousemove(offset);

      expect(helper.scope.slider.min).to.equal(50);
      expect(helper.scope.slider.max).to.equal(70);
      expect(helper.slider.tracking).to.equal('rzSliderModel');
      helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
      helper.slider.positionTrackingBar.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click on selbar and move move range when near 0 and moved left', function() {
      helper.scope.slider.min = 10;
      helper.scope.$digest();

      helper.fireMousedown(helper.slider.selBar, 0);
      helper.fireMousemove(-1000);

      expect(helper.scope.slider.min).to.equal(0);
      expect(helper.scope.slider.max).to.equal(50);
      expect(helper.slider.tracking).to.equal('rzSliderModel');
    });

    it('should handle click on selbar and don\'t move range when already at 0 and moved left', function() {
      helper.scope.slider.min = 0;
      helper.scope.$digest();

      helper.fireMousedown(helper.slider.selBar, 0);
      helper.fireMousemove(-100);

      expect(helper.scope.slider.min).to.equal(0);
      expect(helper.scope.slider.max).to.equal(60);
      expect(helper.slider.tracking).to.equal('rzSliderModel');
    });

    it('should handle click on selbar and move move range when near max and moved right', function() {
      helper.scope.slider.max = 90;
      helper.scope.$digest();

      helper.fireMousedown(helper.slider.selBar, 0);
      helper.fireMousemove(helper.slider.maxPos);

      expect(helper.scope.slider.min).to.equal(50);
      expect(helper.scope.slider.max).to.equal(100);
      expect(helper.slider.tracking).to.equal('rzSliderModel');
    });

    it('should handle click on selbar and don\'t move range when already at max and moved right', function() {
      helper.scope.slider.max = 100;
      helper.scope.$digest();

      helper.fireMousedown(helper.slider.selBar, 0);
      helper.fireMousemove(helper.slider.maxPos);

      expect(helper.scope.slider.min).to.equal(40);
      expect(helper.scope.slider.max).to.equal(100);
      expect(helper.slider.tracking).to.equal('rzSliderModel');
    });

    it('should a working positionTrackingBar', function() {
      var newMin = 50,
        newMax = 90,
        minOffset = helper.slider.valueToOffset(newMin),
        maxOffset = helper.slider.valueToOffset(newMax);
      helper.slider.positionTrackingBar(newMin, newMax, minOffset, maxOffset);

      expect(helper.scope.slider.min).to.equal(50);
      expect(helper.scope.slider.max).to.equal(90);
      expect(helper.slider.minH.css('left')).to.equal(minOffset + 'px');
      expect(helper.slider.maxH.css('left')).to.equal(maxOffset + 'px');
    });
  });

  describe('Right to left Mouse controls - draggableRange Horizontal', function() {
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
        min: 40,
        max: 60,
        options: {
          floor: 0,
          ceil: 100,
          draggableRange: true,
          rightToLeft: true
        }
      };
      helper.createRangeSlider(sliderConf);
    });
    afterEach(function() {
      // to clean document listener
      helper.fireMouseup();
    });

    it('should handle click and drag on minH correctly when mouse is on the middle', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnChange');
      var event = helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 50,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(expectedValue);
      helper.slider.positionTrackingHandle.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click and drag on maxH correctly when mouse is on the middle', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnChange');
      var event = helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 50,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.max).to.equal(expectedValue);
      helper.slider.positionTrackingHandle.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click and drag on minH and switch min/max if needed', function() {
      var event = helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 80,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);

      expect(helper.scope.slider.min).to.equal(60);
      expect(helper.scope.slider.max).to.equal(80);
    });

    it('should handle click and drag on maxH and switch min/max if needed', function() {
      var event = helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 20,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);

      expect(helper.scope.slider.min).to.equal(20);
      expect(helper.scope.slider.max).to.equal(40);
    });

    it('should handle click on fullbar and move minH when click pos is nearer to minH', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');
      sinon.spy(helper.slider, 'focusElement');

      var expectedValue = 10,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

      var event = helper.fireMousedown(helper.slider.fullBar, offset);

      expect(helper.scope.slider.min).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('rzSliderModel');
      helper.slider.focusElement.calledWith(helper.slider.minH).should.be.true;
      helper.slider.positionTrackingHandle.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click on fullbar and move maxH when click pos is nearer to maxH', function() {
      sinon.spy(helper.slider, 'positionTrackingHandle');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');
      sinon.spy(helper.slider, 'focusElement');

      var expectedValue = 90,
          offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;

      var event = helper.fireMousedown(helper.slider.fullBar, offset);

      expect(helper.scope.slider.max).to.equal(expectedValue);
      expect(helper.slider.tracking).to.equal('rzSliderHigh');
      helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
      helper.slider.positionTrackingHandle.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click on selbar and move whole range when moved within slider range', function() {
      sinon.spy(helper.slider, 'positionTrackingBar');
      sinon.spy(helper.slider, 'callOnStart');
      sinon.spy(helper.slider, 'callOnChange');
      sinon.spy(helper.slider, 'focusElement');

      helper.fireMousedown(helper.slider.selBar, 0);

      var moveValue = 10,
          offset = helper.slider.maxPos - helper.slider.valueToOffset(moveValue);
      helper.fireMousemove(offset);

      expect(helper.scope.slider.min).to.equal(30);
      expect(helper.scope.slider.max).to.equal(50);
      expect(helper.slider.tracking).to.equal('rzSliderHigh');
      helper.slider.focusElement.calledWith(helper.slider.maxH).should.be.true;
      helper.slider.positionTrackingBar.called.should.be.true;
      helper.slider.callOnStart.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click on selbar and move move range when near 0 and moved right', function() {
      helper.scope.slider.min = 10;
      helper.scope.$digest();

      helper.fireMousedown(helper.slider.selBar, 0);
      helper.fireMousemove(1000);

      expect(helper.scope.slider.min).to.equal(0);
      expect(helper.scope.slider.max).to.equal(50);
      expect(helper.slider.tracking).to.equal('rzSliderHigh');
    });

    it('should handle click on selbar and don\'t move range when already at 0 and moved right', function() {
      helper.scope.slider.min = 0;
      helper.scope.$digest();

      helper.fireMousedown(helper.slider.selBar, 0);
      helper.fireMousemove(100);

      expect(helper.scope.slider.min).to.equal(0);
      expect(helper.scope.slider.max).to.equal(60);
      expect(helper.slider.tracking).to.equal('rzSliderHigh');
    });

    it('should handle click on selbar and move range when near max and moved left', function() {
      helper.scope.slider.max = 90;
      helper.scope.$digest();

      helper.fireMousedown(helper.slider.selBar, 0);
      helper.fireMousemove(-1000);

      expect(helper.scope.slider.min).to.equal(50);
      expect(helper.scope.slider.max).to.equal(100);
      expect(helper.slider.tracking).to.equal('rzSliderHigh');
    });

    it('should handle click on selbar and don\'t move range when already at max and moved left', function() {
      helper.scope.slider.max = 100;
      helper.scope.$digest();

      helper.fireMousedown(helper.slider.selBar, 0);
      helper.fireMousemove(-1000);

      expect(helper.scope.slider.min).to.equal(40);
      expect(helper.scope.slider.max).to.equal(100);
      expect(helper.slider.tracking).to.equal('rzSliderHigh');
    });

    it('should a working positionTrackingBar', function() {
      var newMin = 50,
          newMax = 90,
          minOffset = helper.slider.valueToOffset(newMin),
          maxOffset = helper.slider.valueToOffset(newMax);
      helper.slider.positionTrackingBar(newMin, newMax, minOffset, maxOffset);

      expect(helper.scope.slider.min).to.equal(50);
      expect(helper.scope.slider.max).to.equal(90);
      expect(helper.slider.minH.css('left')).to.equal(minOffset + 'px');
      expect(helper.slider.maxH.css('left')).to.equal(maxOffset + 'px');
    });
  });
}());

