(function() {
  "use strict";

  describe('Single slider initialisation - ', function() {
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

    it('should display floor and ceil labels when handle is at the middle', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100
        }
      };
      helper.createSlider(sliderConf);
      expect(helper.slider.flrLab.css('opacity')).to.equal('1');
      expect(helper.slider.ceilLab.css('opacity')).to.equal('1');
    });

    it('should hide floor and display ceil labels when handle is at min', function() {
      var sliderConf = {
        value: 0,
        options: {
          floor: 0,
          ceil: 100
        }
      };
      helper.createSlider(sliderConf);
      expect(helper.slider.flrLab.css('opacity')).to.equal('0');
      expect(helper.slider.ceilLab.css('opacity')).to.equal('1');
    });

    it('should show floor and hide ceil labels when handle is at max', function() {
      var sliderConf = {
        value: 100,
        options: {
          floor: 0,
          ceil: 100
        }
      };
      helper.createSlider(sliderConf);
      expect(helper.slider.flrLab.css('opacity')).to.equal('1');
      expect(helper.slider.ceilLab.css('opacity')).to.equal('0');
    });

    it('should display floor and ceil labels when handle is at the middle for RTL slider', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          rightToLeft: true
        }
      };
      helper.createSlider(sliderConf);
      expect(helper.slider.flrLab.css('opacity')).to.equal('1');
      expect(helper.slider.ceilLab.css('opacity')).to.equal('1');
    });

    it('should hide floor and display ceil labels when handle is at min for RTL slider', function() {
      var sliderConf = {
        value: 0,
        options: {
          floor: 0,
          ceil: 100,
          rightToLeft: true
        }
      };
      helper.createSlider(sliderConf);
      expect(helper.slider.flrLab.css('opacity')).to.equal('0');
      expect(helper.slider.ceilLab.css('opacity')).to.equal('1');
    });

    it('should show floor and hide ceil labels when handle is at max for RTL slider', function() {
      var sliderConf = {
        value: 100,
        options: {
          floor: 0,
          ceil: 100,
          rightToLeft: true
        }
      };
      helper.createSlider(sliderConf);
      expect(helper.slider.flrLab.css('opacity')).to.equal('1');
      expect(helper.slider.ceilLab.css('opacity')).to.equal('0');
    });

    it('should hide floor and ceil labels when minHandle is at min and maxHandle at max for range slider', function() {
      var sliderConf = {
        min: 0,
        max: 100,
        options: {
          floor: 0,
          ceil: 100
        }
      };
      helper.createRangeSlider(sliderConf);
      expect(helper.slider.flrLab.css('opacity')).to.equal('0');
      expect(helper.slider.ceilLab.css('opacity')).to.equal('0');
    });

    it('should hide floor and ceil labels when minHandle is at min and maxHandle at max for range RTL slider', function() {
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
      expect(helper.slider.flrLab.css('opacity')).to.equal('0');
      expect(helper.slider.ceilLab.css('opacity')).to.equal('0');
    });
  });
}());

