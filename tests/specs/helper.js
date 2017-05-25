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

    h.createRangeSliderWithCustomTemplate = function(sliderObj, templateUrl) {
      var template = '';
      var optionsExpression = sliderObj.optionsExpression || 'slider.options';
      if (sliderObj.options || sliderObj.optionsExpression)
        template = '<rzslider rz-slider-model="slider.min"' +
          ' rz-slider-high="slider.max"' +
          ' rz-slider-options="' + optionsExpression +
          '" rz-slider-tpl-url="' + templateUrl +
          '"></rzslider>';
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
    
    h.fireTouchstartWithOriginalEvent = function(element, position, touchIdentifier, touchesIds, vertical) {
    	var event = {type:'touchstart', originalEvent: this.getTouchEvent('touchstart', position, vertical, touchIdentifier, touchesIds, sinon.stub())};

        element.triggerHandler(event);
        return event;
      };
      
    h.fireTouchstartWithoutOriginalEvent = function(element, position, touchIdentifier, touchesIds, vertical) {
    	var event = this.getTouchEvent('touchstart', position, vertical, touchIdentifier, touchesIds, sinon.stub());

        element.triggerHandler(event);
        return event;
    }; 
    
    h.fireTouchmoveWithOriginalEvent = function(position, touchIdentifier, touchesIds, vertical) {
    	var event = {type:'touchmove', originalEvent: this.getTouchEvent('touchmove', position, vertical, touchIdentifier, touchesIds)};

    	$document.triggerHandler(event);
        return event;
    }; 
    
    h.fireTouchmoveWithoutOriginalEvent = function(position, touchIdentifier, touchesIds, vertical) {
    	var event = this.getTouchEvent('touchmove', position, vertical, touchIdentifier, touchesIds);

    	$document.triggerHandler(event);
        return event;
    }; 
      
    h.fireTouchendWithOriginalEvent = function(touchIdentifier, touchesIds, vertical) {
    	var event = {type:'touchend', originalEvent: this.getTouchEvent('touchend', 0, vertical, touchIdentifier, touchesIds)};

    	$document.triggerHandler(event);
        return event;
    }; 
    
    h.fireTouchendWithoutOriginalEvent = function(touchIdentifier, touchesIds, vertical) {
    	var event = this.getTouchEvent('touchend', 0, vertical, touchIdentifier, touchesIds);

    	$document.triggerHandler(event);
        return event;
    }; 
    
    h.getTouchEvent = function(type, position, vertical, changedTouchId, touchesIds, preventDefaultAndStopPropagation) {
    	var positionProp = vertical ? 'clientY' : 'clientX';
    	
    	var changedTouches = [{identifier:changedTouchId}];
    	changedTouches[0][positionProp] = position;
    	
    	var touches = [];
    	for (var i = 0; i < touchesIds.length; i++) {
    		var touch = {identifier: touchesIds[i]};
    		if (touch.identifier == changedTouchId) {
    			touch[positionProp] = position;
    		}
    		touches.push(touch);
    	}
    	
        var originalEvent = {
          type: type,
          preventDefault: preventDefaultAndStopPropagation,
          stopPropagation: preventDefaultAndStopPropagation,
          changedTouches: changedTouches,
          touches: touches
        };
        return originalEvent;
    }  
    
    h.pressKeydown = function(element, key, options) {
      options = options || {};
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
      if (options.oldAPI)
        event.which = keyCode;
      else event.keyCode = keyCode;
      element.triggerHandler(event);
      if (options.timeout !== false)
        $timeout.flush();
    };

    h.getMousePosition = function(value) {
      return h.slider.valueToPosition(value) + h.slider.handleHalfDim + h.slider.sliderElem.rzsp;
    };

    h.moveMouseToValue = function(value) {
      h.fireMousemove(h.getMousePosition(value));
    };
    
    return h;
  });
}());
