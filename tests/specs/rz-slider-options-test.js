;(function() {
  'use strict'

  describe('RzSliderOptions - ', function() {
    var helper, RzSliderOptions, $rootScope, $timeout

    beforeEach(module('test-helper'))

    beforeEach(inject(function(
      TestHelper,
      _RzSliderOptions_,
      _$rootScope_,
      _$timeout_
    ) {
      helper = TestHelper
      RzSliderOptions = _RzSliderOptions_
      $rootScope = _$rootScope_
      $timeout = _$timeout_
    }))

    afterEach(function() {
      helper.clean()
    })

    it('should have a correct getOptions method that apply custom options', function() {
      var defaultOpts = RzSliderOptions.getOptions()
      var customOpts = {
        showTicks: true,
      }

      var expectedOpts = angular.extend({}, defaultOpts, customOpts)
      var options = RzSliderOptions.getOptions(customOpts)
      expect(options).to.deep.equal(expectedOpts)
    })

    it('should have a correct options method to update the global options', function() {
      var defaultOpts = RzSliderOptions.getOptions()
      var globalOpts = {
        showTicks: true,
      }
      RzSliderOptions.options(globalOpts)

      var expectedOpts = angular.extend({}, defaultOpts, globalOpts)
      var options = RzSliderOptions.getOptions()
      expect(options).to.deep.equal(expectedOpts)
    })
  })
})()
