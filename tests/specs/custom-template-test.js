(function() {
  "use strict";

  describe('Custom templates - ', function() {
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

    var url = 'tests/specs/custom-tpl.html';

    it('should render ceil/floor labels', function() {
      var sliderConf = {
        min: 10,
        max: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10
        }
      };
      helper.createRangeSliderWithCustomTemplate(sliderConf, url);
      expect(helper.slider.flrLab.text()).to.equal('test- 0');
      expect(helper.slider.ceilLab.text()).to.equal('test- 100');
    });

    it('should render min/max labels', function() {
      var sliderConf = {
        min: 10,
        max: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10
        }
      };
      helper.createRangeSliderWithCustomTemplate(sliderConf, url);
      expect(helper.slider.minLab.text()).to.equal('test- 10');
      expect(helper.slider.maxLab.text()).to.equal('test- 50');
    });

    it('should render min/max labels', function() {
      var sliderConf = {
        min: 50,
        max: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10
        }
      };
      helper.createRangeSliderWithCustomTemplate(sliderConf, url);
      expect(helper.slider.cmbLab.text()).to.equal('test- 50 - 50');
    });

  });
}());
