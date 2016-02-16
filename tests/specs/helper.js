(function() {
  "use strict";
  var helperModule = angular.module('test-helper', ['rzModule', 'appTemplates']);

  helperModule.factory('TestHelper', function(RzSlider, RzSliderOptions, $rootScope, $compile, $timeout, $window, $document) {
    var h = {
      element: null,
      scope: null,
      parent: null
    };

    h.createSlider = function(sliderObj) {
      var template = '';
      var optionsExpression = sliderObj.optionsExpression || 'slider.options';
      if (sliderObj.options || sliderObj.optionsExpression)
        template = '<rzslider rz-slider-model="slider.value" rz-slider-options="' +
        optionsExpression + '"></rzslider>';
      else
        template = '<rzslider rz-slider-model="slider.value"></rzslider>';
      h.initSlider(sliderObj, template);
    };

    h.createRangeSlider = function(sliderObj) {
      var template = '';
      var optionsExpression = sliderObj.optionsExpression || 'slider.options';
      if (sliderObj.options || sliderObj.optionsExpression)
        template = '<rzslider rz-slider-model="slider.min" rz-slider-high="slider.max"' +
        'rz-slider-options="' + optionsExpression + '"></rzslider>';
      else
        template = '<rzslider rz-slider-model="slider.min" rz-slider-high="slider.max"></rzslider>';
      h.initSlider(sliderObj, template);
    };

    h.initSlider = function(sliderObj, template) {
      h.scope = $rootScope.$new();
      h.scope.slider = sliderObj;
      h.parent = angular.element('<div style="width: 1000px; height:1000px;"></div>');
      h.element = $compile(template)(h.scope);
      h.parent.append(h.element);
      angular.element(document).find('body').append(h.parent);
      h.scope.$digest();
      h.slider = h.element.isolateScope().slider;
    };

    h.clean = function() {
      //simulate to $destroy event to clean everything
      if (h.scope)
        h.scope.$broadcast('$destroy');
      //clean the element we append at each test
      if (h.parent)
        h.parent.remove();
    };


    h.fireMousedown = function(element, position, vertical) {
      var positionProp = vertical ? 'clientY' : 'clientX';
      var event = {
        type: 'mousedown',
        preventDefault: sinon.stub(),
        stopPropagation: sinon.stub()
      };
      event[positionProp] = position;

      element.triggerHandler(event);
      return event;
    };

    h.fireMousemove = function(position, vertical) {
      var positionProp = vertical ? 'clientY' : 'clientX';
      var event = {
        type: 'mousemove'
      };
      event[positionProp] = position;

      $document.triggerHandler(event);
    };

    h.fireMouseup = function() {
      var event = {
        type: 'mouseup'
      };
      $document.triggerHandler(event);
    };

    h.pressKeydown = function(element, key, oldAPI) {
      key = key.toUpperCase();
      var event = {
        type: 'keydown'
      };
      var keys = {
        'UP': 38,
        'DOWN': 40,
        'LEFT': 37,
        'RIGHT': 39,
        'PAGEUP': 33,
        'PAGEDOWN': 34,
        'HOME': 36,
        'END': 35,
        'SPACE': 32
      };
      var keyCode = keys[key];
      if (oldAPI)
        event.which = keyCode;
      else event.keyCode = keyCode;
      element.triggerHandler(event);
    };

    return h;
  });
}());
