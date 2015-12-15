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

  it('should exist compiled', function () {
    scope = $rootScope.$new();
    scope.minSlider = {
      value: 10
    };
    element = $compile("<rzslider rz-slider-model='minSlider.value'></rzslider>")($rootScope);
    $rootScope.$digest();
    expect(element.find('span')).to.have.length(11);
  });

});
