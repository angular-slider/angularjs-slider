'use strict';

describe('rzslider api', function () {
  var RzSlider;
  var $rootScope;
  var scope;
  var $compile;
  var element;
  var $httpBackend;
  beforeEach(module('rzModule'));
  beforeEach(module('appTemplates'));

  beforeEach(inject(function (_RzSlider_, _$rootScope_, _$compile_, _$httpBackend_) {
    RzSlider = _RzSlider_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
  }));

  beforeEach(function () {
    scope = $rootScope.$new();
    scope.minSlider = {value: 10};
    scope.rzSliderModel = scope.minSlider.value;
    scope.options = {
      floor: 0,
      ceil: 1000, //defaults to rz-slider-model
      step: 100
    };
    compileHtml();
  });

  it('should exist compiled', function () {
    expect(element.find('span')).to.have.length(11);
  });

  it('should trigger a left arrow respecting step values and not go below 0', function (done) {
    var service = new RzSlider(scope, element);
    service.step = 100;
    var event = pressLeftArrow();
    service.onPointerFocus(element, 'rzSliderModel', event);
    service.onKeyboardEvent(event);
    expect(scope.rzSliderModel).to.equal(0);
    done();
  });

  function pressLeftArrow() {
    var evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
    evt.initCustomEvent('keydown', false, false, null);
    evt.which = 37;
    return evt;
  }

  function compileHtml() {
    element = $compile("<rzslider rz-slider-model='minSlider.value' rz-slider-options='options'></rzslider>")(scope);
    scope.$apply();
  }


});
