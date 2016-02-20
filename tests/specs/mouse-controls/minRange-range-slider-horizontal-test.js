(function() {
  "use strict";

  describe('Mouse controls - minRange!=0 Range Horizontal', function() {
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
          minRange: 10
        }
      };
      helper.createRangeSlider(sliderConf);
    });
    afterEach(function() {
      // to clean document listener
      helper.fireMouseup();
    });

    it('should not modify any value if new range would be smaller than minRange when moving minH', function() {
      helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 50,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(45);
    });

    it('should not modify any value if new range would be smaller than minRange when moving maxH', function() {
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 50,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.max).to.equal(55);
    });

    it('should modify the min value if new range is larger than minRange when moving minH', function() {
      helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 30,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(expectedValue);
    });

    it('should modify the max value if new range is larger than than minRange when moving maxH', function() {
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 70,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.max).to.equal(expectedValue);
    });

    it('should modify the min value if switch min/max with a value large enough', function() {
      helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 80,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(55);
      expect(helper.scope.slider.max).to.equal(expectedValue);
    });

    it('should modify the max value if switch min/max with a value large enough', function() {
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 20,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(expectedValue);
      expect(helper.scope.slider.max).to.equal(45);
    });
  });

  describe('Right to left Mouse controls - minRange!=0 Range Horizontal', function() {
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
          minRange: 10,
          rightToLeft: true
        }

      };
      helper.createRangeSlider(sliderConf);
    });
    afterEach(function() {
      // to clean document listener
      helper.fireMouseup();
    });

    it('should not modify any value if new range would be smaller than minRange when moving minH', function() {
      helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 50,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(45);
    });

    it('should not modify any value if new range would be smaller than minRange when moving maxH', function() {
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 50,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.max).to.equal(55);
    });

    it('should modify the min value if new range is larger than minRange when moving minH', function() {
      helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 30,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(expectedValue);
    });

    it('should modify the max value if new range is larger than than minRange when moving maxH', function() {
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 70,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.max).to.equal(expectedValue);
    });

    it('should modify the min value if switch min/max with a value large enough', function() {
      helper.fireMousedown(helper.slider.minH, 0);
      var expectedValue = 80,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(55);
      expect(helper.scope.slider.max).to.equal(expectedValue);
    });

    it('should modify the max value if switch min/max with a value large enough', function() {
      helper.fireMousedown(helper.slider.maxH, 0);
      var expectedValue = 20,
        offset = helper.slider.valueToOffset(expectedValue) + helper.slider.handleHalfDim + helper.slider.sliderElem.rzsp;
      helper.fireMousemove(offset);
      expect(helper.scope.slider.min).to.equal(expectedValue);
      expect(helper.scope.slider.max).to.equal(45);
    });
  });
}());

