(function() {
  "use strict";

  describe('Accessibility - ', function() {
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

    it('should have accessible horizontal single slider', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          step: 10
        }
      };
      helper.createSlider(sliderConf);
      expect(helper.slider.minH.attr('role')).to.equal('slider');
      expect(helper.slider.minH.attr('tabindex')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuemax')).to.equal('100');

      helper.scope.slider.value = 20;
      helper.scope.$digest();
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('20');
    });

    it('should have accessible vertical single slider', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          vertical: true
        }
      };
      helper.createSlider(sliderConf);
      expect(helper.slider.minH.attr('role')).to.equal('slider');
      expect(helper.slider.minH.attr('tabindex')).to.equal('0');
      expect(helper.slider.minH.attr('aria-orientation')).to.equal('vertical');
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuemax')).to.equal('100');

      helper.scope.slider.value = 20;
      helper.scope.$digest();
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('20');
    });

    it('should have accessible horizontal range slider', function() {
      var sliderConf = {
        min: 10,
        max: 90,
        options: {
          floor: 0,
          ceil: 100,
          step: 10
        }
      };
      helper.createRangeSlider(sliderConf);
      expect(helper.slider.minH.attr('role')).to.equal('slider');
      expect(helper.slider.minH.attr('tabindex')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuemax')).to.equal('100');
      expect(helper.slider.maxH.attr('role')).to.equal('slider');
      expect(helper.slider.maxH.attr('tabindex')).to.equal('0');
      expect(helper.slider.maxH.attr('aria-valuenow')).to.equal('90');
      expect(helper.slider.maxH.attr('aria-valuetext')).to.equal('90');
      expect(helper.slider.maxH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.maxH.attr('aria-valuemax')).to.equal('100');

      helper.scope.slider.min = 20;
      helper.scope.$digest();
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('20');

      helper.scope.slider.max = 80;
      helper.scope.$digest();
      expect(helper.slider.maxH.attr('aria-valuenow')).to.equal('80');
      expect(helper.slider.maxH.attr('aria-valuetext')).to.equal('80');
    });

    it('should have accessible vertical range slider', function() {
      var sliderConf = {
        min: 10,
        max: 90,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          vertical: true
        }
      };
      helper.createRangeSlider(sliderConf);
      expect(helper.slider.minH.attr('role')).to.equal('slider');
      expect(helper.slider.minH.attr('tabindex')).to.equal('0');
      expect(helper.slider.minH.attr('aria-orientation')).to.equal('vertical');
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuemax')).to.equal('100');
      expect(helper.slider.maxH.attr('role')).to.equal('slider');
      expect(helper.slider.maxH.attr('tabindex')).to.equal('0');
      expect(helper.slider.maxH.attr('aria-orientation')).to.equal('vertical');
      expect(helper.slider.maxH.attr('aria-valuenow')).to.equal('90');
      expect(helper.slider.maxH.attr('aria-valuetext')).to.equal('90');
      expect(helper.slider.maxH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.maxH.attr('aria-valuemax')).to.equal('100');

      helper.scope.slider.min = 20;
      helper.scope.$digest();
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('20');

      helper.scope.slider.max = 80;
      helper.scope.$digest();
      expect(helper.slider.maxH.attr('aria-valuenow')).to.equal('80');
      expect(helper.slider.maxH.attr('aria-valuetext')).to.equal('80');
    });

    it('should have accessible horizontal single slider when keyboardSupport is false', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          keyboardSupport: false
        }
      };
      helper.createSlider(sliderConf);
      expect(helper.slider.minH.attr('role')).to.equal('slider');
      expect(helper.slider.minH.attr('tabindex')).to.equal('');
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuemax')).to.equal('100');

      helper.scope.slider.value = 20;
      helper.scope.$digest();
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('20');
    });

    it('should have accessible horizontal range slider when keyboardSupport is false', function() {
      var sliderConf = {
        min: 10,
        max: 90,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          keyboardSupport: false
        }
      };
      helper.createRangeSlider(sliderConf);
      expect(helper.slider.minH.attr('role')).to.equal('slider');
      expect(helper.slider.minH.attr('tabindex')).to.equal('');
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('10');
      expect(helper.slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuemax')).to.equal('100');
      expect(helper.slider.maxH.attr('role')).to.equal('slider');
      expect(helper.slider.maxH.attr('tabindex')).to.equal('');
      expect(helper.slider.maxH.attr('aria-valuenow')).to.equal('90');
      expect(helper.slider.maxH.attr('aria-valuetext')).to.equal('90');
      expect(helper.slider.maxH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.maxH.attr('aria-valuemax')).to.equal('100');

      helper.scope.slider.min = 20;
      helper.scope.$digest();
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('20');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('20');

      helper.scope.slider.max = 80;
      helper.scope.$digest();
      expect(helper.slider.maxH.attr('aria-valuenow')).to.equal('80');
      expect(helper.slider.maxH.attr('aria-valuetext')).to.equal('80');
    });

    it('should have accessible slider when values are text', function() {
      var sliderConf = {
        value: 'B',
        options: {
          stepsArray: ['A', 'B', 'C']
        }
      };
      helper.createSlider(sliderConf);
      expect(helper.slider.minH.attr('role')).to.equal('slider');
      expect(helper.slider.minH.attr('tabindex')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('B');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('B');
      expect(helper.slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuemax')).to.equal('2');

      helper.scope.slider.value = 'C';
      helper.scope.$digest();
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('C');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('C');
    });

    it('should have accessible slider when values are text but bindIndexForStepsArray is true', function() {
      var sliderConf = {
        value: 1,
        options: {
          stepsArray: ['A', 'B', 'C'],
          bindIndexForStepsArray: true
        }
      };
      helper.createSlider(sliderConf);
      expect(helper.slider.minH.attr('role')).to.equal('slider');
      expect(helper.slider.minH.attr('tabindex')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('1');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('B');
      expect(helper.slider.minH.attr('aria-valuemin')).to.equal('0');
      expect(helper.slider.minH.attr('aria-valuemax')).to.equal('2');

      helper.scope.slider.value = 2;
      helper.scope.$digest();
      expect(helper.slider.minH.attr('aria-valuenow')).to.equal('2');
      expect(helper.slider.minH.attr('aria-valuetext')).to.equal('C');
    });

    it('should have labelled single slider when option is set', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          ariaLabel: "test label"
        }
      };
      helper.createSlider(sliderConf);
      expect(helper.slider.minH.attr('aria-label')).to.equal('test label');
    });

    it('should have labelled range slider when option is set', function() {
      var sliderConf = {
        min: 10,
        max: 90,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          ariaLabel: "test label",
          ariaLabelHigh: "test label high"
        }
      };
      helper.createRangeSlider(sliderConf);
      expect(helper.slider.minH.attr('aria-label')).to.equal('test label');
      expect(helper.slider.maxH.attr('aria-label')).to.equal('test label high');
    });

    it('should have labelled by id on single slider when option is set', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          ariaLabelledBy: "testId"
        }
      };
      helper.createSlider(sliderConf);
      expect(helper.slider.minH.attr('aria-labelledby')).to.equal('testId');
    });

    it('should have labelled by id on range slider when option is set', function() {
      var sliderConf = {
        min: 10,
        max: 90,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          ariaLabelledBy: "testId",
          ariaLabelledByHigh: "testIdHigh"
        }
      };
      helper.createRangeSlider(sliderConf);
      expect(helper.slider.minH.attr('aria-labelledby')).to.equal('testId');
      expect(helper.slider.maxH.attr('aria-labelledby')).to.equal('testIdHigh');
    });

    it('should not have labelled by id on single slider when both options set', function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          ariaLabel: "test label",
          ariaLabelledBy: "testId"
        }
      };
      helper.createSlider(sliderConf);
      expect(helper.slider.minH.attr('aria-label')).to.equal('test label');
      expect(helper.slider.minH.attr('aria-labelledby')).to.equal(undefined);
    });

    it('should not have labelled by id on range slider when both options set', function() {
      var sliderConf = {
        min: 10,
        max: 90,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          ariaLabel: "test label",
          ariaLabelHigh: "test label high",
          ariaLabelledBy: "testId",
          ariaLabelledByHigh: "testIdHigh"
        }
      };
      helper.createRangeSlider(sliderConf);
      expect(helper.slider.minH.attr('aria-label')).to.equal('test label');
      expect(helper.slider.maxH.attr('aria-label')).to.equal('test label high');
      expect(helper.slider.minH.attr('aria-labelledby')).to.equal(undefined);
      expect(helper.slider.maxH.attr('aria-labelledby')).to.equal(undefined);
    });
  });
}());

