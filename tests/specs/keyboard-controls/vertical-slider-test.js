(function() {
  "use strict";

  describe('Keyboard controls - vertical slider', function() {
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
        value: 100,
        options: {
          floor: 0,
          ceil: 200,
          vertical: true
        }
      };
      helper.createSlider(sliderConf);
    });

    it('should increment by 1 when RIGHT is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'RIGHT');
      expect(helper.scope.slider.value).to.equal(101);
    });

    it('should increment by 1 when UP is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'UP');
      expect(helper.scope.slider.value).to.equal(101);
    });

    it('should decrement by 1 when DOWN is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'DOWN');
      expect(helper.scope.slider.value).to.equal(99);
    });

    it('should decrement by 1 when LEFT is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'LEFT');
      expect(helper.scope.slider.value).to.equal(99);
    });
  });

  describe('Right to left Keyboard controls - vertical slider', function() {
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
        value: 100,
        options: {
          floor: 0,
          ceil: 200,
          vertical: true,
          rightToLeft: true
        }
      };
      helper.createSlider(sliderConf);
    });

    it('should decrement by 1 when RIGHT is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'RIGHT');
      expect(helper.scope.slider.value).to.equal(99);
    });

    it('should decrement by 1 when UP is pressed', function() {
      //while not strictly left to right this does allow also reversing vertical bars
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'UP');
      expect(helper.scope.slider.value).to.equal(99);
    });

    it('should increment by 1 when DOWN is pressed', function() {
      //while not strictly left to right this does allow also reversing vertical bars
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'DOWN');
      expect(helper.scope.slider.value).to.equal(101);
    });

    it('should increment by 1 when LEFT is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'LEFT');
      expect(helper.scope.slider.value).to.equal(101);
    });
  });
}());

