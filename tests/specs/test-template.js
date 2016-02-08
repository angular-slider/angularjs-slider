(function() {
  "use strict";

  /**
   * Your test file should end with "-test.js" to be executed.
   * Don't modify this file but copy it to create a new test group
   */

  describe('Test group description - ', function() {
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

    /*
     The slider that will be used for each test.
     If you want to create a specific one for each test, then create it directly in the "it" blocks
     */
    beforeEach(function() {
      var sliderConf = {
        value: 10,
        options: {
          floor: 0,
          ceil: 100,
          step: 10
        }
      };
      helper.createSlider(sliderConf);
    });

    it('should be true', function() {

    });
  });
}());

