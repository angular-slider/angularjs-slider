(function() {
  "use strict";

  describe('Mouse controls - minLimit!=null && maxLimit!=null Range Horizontal', function() {
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
        min: 45,
        max: 55,
        options: {
          floor: 0,
          ceil: 100,
          minLimit: 40,
          maxLimit: 60
        }
      };
      helper.createRangeSlider(sliderConf);
    });
    afterEach(function() {
      // to clean document listener
      helper.fireMouseup();
    });

    it('should be able to modify minH above minLimit', function() {
      helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 42,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(42);
    });

    it('should not be able to modify minH below minLimit', function() {
      helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 30,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(40);
    });

    it('should be able to modify maxH below maxLimit', function() {
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 58,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.max).to.equal(58);
    });

    it('should not be able to modify maxH above maxLimit', function() {
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 70,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.max).to.equal(60);
    });
  });

  describe('Right to left Mouse controls - minLimit!=null && maxLimit!=null Range Horizontal', function() {
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
        min: 45,
        max: 55,
        options: {
          floor: 0,
          ceil: 100,
          minLimit: 40,
          maxLimit: 60,
          rightToLeft: true
        }
      };
      helper.createRangeSlider(sliderConf);
    });
    afterEach(function() {
      // to clean document listener
      helper.fireMouseup();
    });

    it('should be able to modify minH above minLimit', function() {
      helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 42,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(42);
    });

    it('should not be able to modify minH below minLimit', function() {
      helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 30,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(40);
    });

    it('should be able to modify maxH below maxLimit', function() {
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 58,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.max).to.equal(58);
    });

    it('should not be able to modify maxH above maxLimit', function() {
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 70,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.max).to.equal(60);
    });
  });
}());

