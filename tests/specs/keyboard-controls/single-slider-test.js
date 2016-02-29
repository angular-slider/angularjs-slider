(function() {
  "use strict";

  describe('Keyboard controls - single slider', function() {
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
          ceil: 200
        }
      };
      helper.createSlider(sliderConf);
    });

    it('should toggle active style when handle focused/blured', function() {
      helper.slider.minH.triggerHandler('focus');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      helper.slider.minH.triggerHandler('blur');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.false;
    });

    it('should increment by 1 when RIGHT is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'RIGHT');
      expect(helper.scope.slider.value).to.equal(101);
    });

    it('should increment by 1 when RIGHT is pressed with oldAPI', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'RIGHT', true);
      expect(helper.scope.slider.value).to.equal(101);
    });

    it('should decrement by 1 when LEFT is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'LEFT');
      expect(helper.scope.slider.value).to.equal(99);
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

    it('should increment by 10% when PAGEUP is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'PAGEUP');
      expect(helper.scope.slider.value).to.equal(120);
    });

    it('should decrement by 10% when PAGEDOWN is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'PAGEDOWN');
      expect(helper.scope.slider.value).to.equal(80);
    });

    it('should set value to min when HOME is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'HOME');
      expect(helper.scope.slider.value).to.equal(0);
    });

    it('should  set value to max when END is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'END');
      expect(helper.scope.slider.value).to.equal(200);
    });

    it('should do nothing when SPACE is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'SPACE');
      expect(helper.scope.slider.value).to.equal(100);
    });

    it('should not modify when keypress but not focused', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'RIGHT');
      expect(helper.scope.slider.value).to.equal(101);
      helper.slider.minH.triggerHandler('blur');
      helper.pressKeydown(helper.slider.minH, 'RIGHT');
      expect(helper.scope.slider.value).to.equal(101);
    });
  });

  describe('Right to left Keyboard controls - single slider', function() {
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
        value: 100,
        options: {
          floor: 0,
          ceil: 200,
          rightToLeft: true
        }
      };
      helper.createSlider(sliderConf);
    });

    it('should toggle active style when handle focused/blured', function() {
      helper.slider.minH.triggerHandler('focus');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      helper.slider.minH.triggerHandler('blur');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.false;
    });

    it('should decrement by 1 when RIGHT is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'RIGHT');
      expect(helper.scope.slider.value).to.equal(99);
    });

    it('should decrement by 1 when RIGHT is pressed with oldAPI', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'RIGHT', true);
      expect(helper.scope.slider.value).to.equal(99);
    });

    it('should increment by 1 when LEFT is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'LEFT');
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

    it('should increment by 10% when PAGEUP is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'PAGEUP');
      expect(helper.scope.slider.value).to.equal(120);
    });

    it('should decrement by 10% when PAGEDOWN is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'PAGEDOWN');
      expect(helper.scope.slider.value).to.equal(80);
    });

    it('should set value to min when HOME is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'HOME');
      expect(helper.scope.slider.value).to.equal(0);
    });

    it('should  set value to max when END is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'END');
      expect(helper.scope.slider.value).to.equal(200);
    });

    it('should do nothing when SPACE is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'SPACE');
      expect(helper.scope.slider.value).to.equal(100);
    });

    it('should not modify when keypress but not focused', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'RIGHT');
      expect(helper.scope.slider.value).to.equal(99);
      helper.slider.minH.triggerHandler('blur');
      helper.pressKeydown(helper.slider.minH, 'RIGHT');
      expect(helper.scope.slider.value).to.equal(99);
    });
  });
}());

