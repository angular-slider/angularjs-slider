(function() {
  "use strict";

  describe('Keyboard controls - range slider', function() {
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
        min: 50,
        max: 100,
        options: {
          floor: 0,
          ceil: 200
        }
      };
      helper.createRangeSlider(sliderConf);
    });

    it('should toggle active style when handle focused/blured', function() {
      helper.slider.minH.triggerHandler('focus');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.true;
      expect(helper.slider.maxH.hasClass('rz-active')).to.be.false;
      helper.slider.minH.triggerHandler('blur');
      helper.slider.maxH.triggerHandler('focus');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.false;
      expect(helper.slider.maxH.hasClass('rz-active')).to.be.true;
      helper.slider.maxH.triggerHandler('blur');
      expect(helper.slider.minH.hasClass('rz-active')).to.be.false;
      expect(helper.slider.maxH.hasClass('rz-active')).to.be.false;
    });

    it('should increment minH by 1 when RIGHT is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'RIGHT');
      expect(helper.scope.slider.min).to.equal(51);
    });

    it('should increment maxH by 1 when RIGHT is pressed', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'RIGHT');
      expect(helper.scope.slider.max).to.equal(101);
    });

    it('should decrement minH by 1 when LEFT is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'LEFT');
      expect(helper.scope.slider.min).to.equal(49);
    });

    it('should decrement maxH by 1 when LEFT is pressed', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'LEFT');
      expect(helper.scope.slider.max).to.equal(99);
    });

    it('should increment minH by 10% when PAGEUP is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'PAGEUP');
      expect(helper.scope.slider.min).to.equal(70);
    });

    it('should increment maxH by 10% when PAGEUP is pressed', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'PAGEUP');
      expect(helper.scope.slider.max).to.equal(120);
    });

    it('should decrement minH by 10% when PAGEDOWN is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'PAGEDOWN');
      expect(helper.scope.slider.min).to.equal(30);
    });

    it('should decrement maxH by 10% when PAGEDOWN is pressed', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'PAGEDOWN');
      expect(helper.scope.slider.max).to.equal(80);
    });

    it('should set minH to min when HOME is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'HOME');
      expect(helper.scope.slider.min).to.equal(0);
    });

    it('should set minH value to previous min and switch min/max when HOME is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'HOME');
      expect(helper.scope.slider.min).to.equal(0);
      expect(helper.scope.slider.max).to.equal(50);
    });

    it('should set minH value to previous max and switch min/max when END is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'END');
      expect(helper.scope.slider.min).to.equal(100);
      expect(helper.scope.slider.max).to.equal(200);
    });

    it('should set maxH value to max when END is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'END');
      expect(helper.scope.slider.max).to.equal(200);
    });

    it('should do nothing when SPACE is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'SPACE');
      expect(helper.scope.slider.min).to.equal(50);
    });

    it('should do nothing when SPACE is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'SPACE');
      expect(helper.scope.slider.max).to.equal(100);
    });

    it('should not modify minH when keypress but not focused', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'RIGHT');
      expect(helper.scope.slider.min).to.equal(51);
      helper.slider.minH.triggerHandler('blur');
      helper.pressKeydown(helper.slider.minH, 'RIGHT', {timeout: false});
      expect(helper.scope.slider.min).to.equal(51);
    });

    it('should not modify maxH when keypress but not focused', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'RIGHT');
      expect(helper.scope.slider.max).to.equal(101);
      helper.slider.maxH.triggerHandler('blur');
      helper.pressKeydown(helper.slider.maxH, 'RIGHT', {timeout: false});
      expect(helper.scope.slider.max).to.equal(101);
    });
  });

  describe('Right to left Keyboard controls - range slider', function() {
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
        min: 50,
        max: 100,
        options: {
          floor: 0,
          ceil: 200,
          rightToLeft: true
        }
      };
      helper.createRangeSlider(sliderConf);
    });

    it('should decrement minH by 1 when RIGHT is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'RIGHT');
      expect(helper.scope.slider.min).to.equal(49);
    });

    it('should decrement maxH by 1 when RIGHT is pressed', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'RIGHT');
      expect(helper.scope.slider.max).to.equal(99);
    });

    it('should increment minH by 1 when LEFT is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'LEFT');
      expect(helper.scope.slider.min).to.equal(51);
    });

    it('should increment maxH by 1 when LEFT is pressed', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'LEFT');
      expect(helper.scope.slider.max).to.equal(101);
    });

    it('should increment minH by 10% when PAGEUP is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'PAGEUP');
      expect(helper.scope.slider.min).to.equal(70);
    });

    it('should increment maxH by 10% when PAGEUP is pressed', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'PAGEUP');
      expect(helper.scope.slider.max).to.equal(120);
    });

    it('should decrement minH by 10% when PAGEDOWN is pressed', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'PAGEDOWN');
      expect(helper.scope.slider.min).to.equal(30);
    });

    it('should decrement maxH by 10% when PAGEDOWN is pressed', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'PAGEDOWN');
      expect(helper.scope.slider.max).to.equal(80);
    });

    it('should set minH to min when HOME is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'HOME');
      expect(helper.scope.slider.min).to.equal(0);
    });

    it('should set minH value to previous min and switch min/max when HOME is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'HOME');
      expect(helper.scope.slider.min).to.equal(0);
      expect(helper.scope.slider.max).to.equal(50);
    });

    it('should set minH value to previous max and switch min/max when END is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'END');
      expect(helper.scope.slider.min).to.equal(100);
      expect(helper.scope.slider.max).to.equal(200);
    });

    it('should set maxH value to max when END is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'END');
      expect(helper.scope.slider.max).to.equal(200);
    });

    it('should do nothing when SPACE is pressed on minH', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'SPACE');
      expect(helper.scope.slider.min).to.equal(50);
    });

    it('should do nothing when SPACE is pressed on maxH', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'SPACE');
      expect(helper.scope.slider.max).to.equal(100);
    });

    it('should not modify minH when keypress but not focused', function() {
      helper.slider.minH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.minH, 'RIGHT');
      expect(helper.scope.slider.min).to.equal(49);
      helper.slider.minH.triggerHandler('blur');
      helper.pressKeydown(helper.slider.minH, 'RIGHT', {timeout: false});
      expect(helper.scope.slider.min).to.equal(49);
    });

    it('should not modify maxH when keypress but not focused', function() {
      helper.slider.maxH.triggerHandler('focus');
      helper.pressKeydown(helper.slider.maxH, 'RIGHT');
      expect(helper.scope.slider.max).to.equal(99);
      helper.slider.maxH.triggerHandler('blur');
      helper.pressKeydown(helper.slider.maxH, 'RIGHT', {timeout: false});
      expect(helper.scope.slider.max).to.equal(99);
    });

  });
}());

