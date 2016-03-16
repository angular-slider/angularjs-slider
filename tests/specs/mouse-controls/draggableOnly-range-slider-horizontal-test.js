(function() {
  "use strict";

  describe('Mouse controls - draggableRangeOnly Horizontal', function() {
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
          draggableRangeOnly: true
        }
      };
      helper.createRangeSlider(sliderConf);
    });
    afterEach(function() {
      // to clean document listener
      helper.fireMouseup();
    });

    it('should handle click and drag on minH correctly', function() {
      sinon.spy(helper.slider, 'positionTrackingBar');
      sinon.spy(helper.slider, 'callOnChange');

      var event = helper.fireMousedown(helper.slider.minH, 0);
      var moveValue = 10,
        offset = helper.slider.valueToOffset(moveValue);
      helper.fireMousemove(offset);

      expect(helper.scope.slider.min).to.equal(50);
      expect(helper.scope.slider.max).to.equal(70);
      helper.slider.positionTrackingBar.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click and drag on maxH correctly', function() {
      sinon.spy(helper.slider, 'positionTrackingBar');
      sinon.spy(helper.slider, 'callOnChange');
      var event = helper.fireMousedown(helper.slider.maxH, 0);
      var moveValue = 10,
        offset = helper.slider.valueToOffset(moveValue);
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(50);
      expect(helper.scope.slider.max).to.equal(70);
      helper.slider.positionTrackingBar.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should not handle click on fullbar', function() {
      sinon.spy(helper.slider, 'callOnStart');

      var moveValue = 10,
        offset = helper.slider.valueToOffset(moveValue);

      var event = helper.fireMousedown(helper.slider.fullBar, offset);

      expect(helper.scope.slider.min).to.equal(40);
      expect(helper.scope.slider.max).to.equal(60);
      expect(helper.slider.tracking).to.equal('');
      helper.slider.callOnStart.called.should.be.false;
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

    it('should handle click on selbar and move range when near 0 and moved left', function() {
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

    it('should handle click on selbar and move range when near max and moved right', function() {
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

    it('should handle click on selbar and move range when floor is not 0 and handle is dragged below limit', function() {
      helper.scope.slider.min = 1050;
      helper.scope.slider.max = 1550;
      helper.scope.slider.options.floor = 1000;
      helper.scope.slider.options.ceil = 5000;
      helper.scope.$digest();

      helper.fireMousedown(helper.slider.selBar, 0);
      helper.fireMousemove(-1000);

      expect(helper.scope.slider.min).to.equal(1000);
      expect(helper.scope.slider.max).to.equal(1500);
      expect(helper.slider.tracking).to.equal('rzSliderModel');
    });
  });

  describe('Right to left Mouse controls - draggableRangeOnly Horizontal', function() {
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
          draggableRangeOnly: true,
          leftToRight: true
        }
      };
      helper.createRangeSlider(sliderConf);
    });
    afterEach(function() {
      // to clean document listener
      helper.fireMouseup();
    });

    it('should handle click and drag on minH correctly', function() {
      sinon.spy(helper.slider, 'positionTrackingBar');
      sinon.spy(helper.slider, 'callOnChange');

      var event = helper.fireMousedown(helper.slider.minH, 0);
      var moveValue = 10,
          offset = helper.slider.valueToOffset(moveValue);
      helper.fireMousemove(offset);

      expect(helper.scope.slider.min).to.equal(50);
      expect(helper.scope.slider.max).to.equal(70);
      helper.slider.positionTrackingBar.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should handle click and drag on maxH correctly', function() {
      sinon.spy(helper.slider, 'positionTrackingBar');
      sinon.spy(helper.slider, 'callOnChange');
      var event = helper.fireMousedown(helper.slider.maxH, 0);
      var moveValue = 10,
          offset = helper.slider.valueToOffset(moveValue);
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(50);
      expect(helper.scope.slider.max).to.equal(70);
      helper.slider.positionTrackingBar.called.should.be.true;
      helper.slider.callOnChange.called.should.be.true;
    });

    it('should not handle click on fullbar', function() {
      sinon.spy(helper.slider, 'callOnStart');

      var moveValue = 10,
          offset = helper.slider.valueToOffset(moveValue);

      var event = helper.fireMousedown(helper.slider.fullBar, offset);

      expect(helper.scope.slider.min).to.equal(40);
      expect(helper.scope.slider.max).to.equal(60);
      expect(helper.slider.tracking).to.equal('');
      helper.slider.callOnStart.called.should.be.false;
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

    it('should handle click on selbar and move range when near 0 and moved left', function() {
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

    it('should handle click on selbar and move range when near max and moved right', function() {
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

    it('should handle click on selbar and move range when floor is not 0 and handle is dragged below limit', function() {
      helper.scope.slider.min = 1050;
      helper.scope.slider.max = 1550;
      helper.scope.slider.options.floor = 1000;
      helper.scope.slider.options.ceil = 5000;
      helper.scope.$digest();

      helper.fireMousedown(helper.slider.selBar, 0);
      helper.fireMousemove(-1000);

      expect(helper.scope.slider.min).to.equal(1000);
      expect(helper.scope.slider.max).to.equal(1500);
      expect(helper.slider.tracking).to.equal('rzSliderModel');
    });
  });
}());

