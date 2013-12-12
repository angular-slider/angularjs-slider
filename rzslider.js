/**
 * Angular JS slider directive
 *
 * (c) Rafal Zajac <rzajac@gmail.com>
 * http://github.com/rzajac/angularjs-slider
 *
 * Licensed under the MIT license
 */

/* global angular: false */

angular.module('rzModule', [])

.value('throttle',
// Taken from underscore project
function throttle(func, wait, options) {
  var getTime = (Date.now || function() {
    return new Date().getTime();
  });
  var context, args, result;
  var timeout = null;
  var previous = 0;
  options || (options = {});
  var later = function() {
    previous = options.leading === false ? 0 : getTime();
    timeout = null;
    result = func.apply(context, args);
    context = args = null;
  };
  return function() {
    var now = getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
      context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  }
})

.factory('Slider', ['$timeout', '$document', 'throttle', function($timeout, $document, throttle)
{
  /**
   * Slider
   *
   * @param {*} scope         The AngularJS scope
   * @param {Element} element The slider directive element wrapped in jqLite
   * @param {*} attributes    The slider directive attributes
   * @constructor
   */
  var Slider = function(scope, element, attributes)
  {
    /**
     * The slider's scope
     *
     * @type {*}
     */
    this.scope = scope;

    /**
     * The slider attributes
     *
     * @type {*}
     */
    this.attributes = attributes;

    /**
     * Slider element wrapped in jqLite
     *
     * @type {jqLite}
     */
    this.element = element;

    /**
     * Slider type
     *
     * @type {string}
     */
    this.range = (attributes.rzSliderModel === undefined) && ((attributes.rzSliderLow !== undefined) && (attributes.rzSliderHigh !== undefined));

    /**
     * Name of the low value model
     *
     * @type {string}
     */
    this.refLow = this.range ? 'rzSliderLow' : 'rzSliderModel';

    /**
     * Name of the high value model
     *
     * @type {string}
     */
    this.refHigh = 'rzSliderHigh';

    /**
     * The total width of slider bar
     *
     * @type {number}
     */
    this.barWidth = 0;

    /**
     * Half of the width of the slider handles
     *
     * @type {number}
     */
    this.ptrHalfWidth = 0;

    /**
     * Minimum left offset the slider handle can have
     *
     * @type {number}
     */
    this.minOffset = 0;

    /**
     * Maximum left offset the slider handle can have
     *
     * @type {number}
     */
    this.maxOffset = 0;

    /**
     * Minimum value (floor) of the model
     *
     * @type {number}
     */
    this.minValue = 0;

    /**
     * Maximum value (ceiling) of the model
     *
     * @type {number}
     */
    this.maxValue = 0;

    /**
     * High value handle offset in percentages
     *
     * @type {number}
     */
    this.highValOffsetPerc = 0;

    /**
     * Low value handle offset in percentages
     *
     * @type {number}
     */
    this.lowValOffsetPerc = 0;

    /**
     * The delta between min and max value
     *
     * @type {number}
     */
    this.valueRange = 0;

    /**
     * The delta between min and max left offset
     *
     * @type {number}
     */
    this.offsetRange = 0;

    /**
     * Precision
     *
     * @type {number}
     */
    this.precision = 0;

    /**
     * Step
     *
     * @type {number}
     */
    this.step = 0;

    /**
     * The name of the handle we are currently tracking
     *
     * @type {string}
     */
    this.tracking = '';

    // Slider DOM elements wrapped in jqLite
    this.fullBar = null; // The whole slider bar
    this.selBar = null;  // Highlight between two handles
    this.minPtr = null;  // Left slider handle
    this.maxPtr = null;  // Right slider handle
    this.selLab = null;  // Range label
    this.flrLab = null;  // Floor label
    this.ceilLab = null; // Ceiling label
    this.lowLab =  null; // Label above the low value
    this.highLab = null; // Label above the high value
    this.cmbLab = null;  // Combined label

    // Initialize slider
    this.init();
  };

  // Add instance methods
  Slider.prototype = {

    /**
     * Initialize slider
     *
     * @returns {undefined}
     */
    init: function()
    {
      var self = this;

      // Provide default translate function if needed
      if (this.attributes.rzSliderTranslate === undefined)
      {
        this.scope.rzSliderTranslate = function (value)
        {
          return value.value;
        };
      }

      this.setMinAndMax();
      this.valueRange = this.maxValue - this.minValue;
      this.precision = this.scope.rzSliderPrecision === undefined ? 0 : +this.scope.rzSliderPrecision;
      this.step = this.scope.rzSliderStep === undefined ? 1 : +this.scope.rzSliderStep;

      this.cacheElemHandles();
      this.calcViewDimensions();

      $timeout(function()
      {
        self.updateHandles('both');
        self.adjustLabels('timeout');
        self.bindToInputEvents();
      });

      // Recalculate stuff if view port dimensions have changed
      angular.element(window).on('resize', angular.bind(this, this.calcViewDimensions));

      // Watch for changes to the model
      this.scope.$watch(this.refLow, function()
      {
        self.updateHandles('low');
        self.adjustLabels('refLow');
      });

      if(this.range)
      {
        // We have to watch it only for range slider
        this.scope.$watch(this.refHigh, function()
        {
          self.updateHandles('high');
          self.adjustLabels('refHigh');
        });
      }

      // We do not have to watch it if it was not defined
      if(this.scope.rzSliderFloor !== undefined)
      {
        this.scope.$watch('rzSliderFloor', function()
        {
          self.setMinAndMax();
          self.updateHandles('both');
          self.adjustLabels('floor');
        });
      }

      // We do not have to watch it if it was not defined
      if(this.scope.rzSliderCeil !== undefined)
      {
        this.scope.$watch('rzSliderCeil', function()
        {
          self.setMinAndMax();
          self.updateHandles('both');
          self.adjustLabels('ceil');
        });
      }
    },

    /**
     * Set maximum and minimum values for the slider
     *
     * @returns {undefined}
     */
    setMinAndMax: function()
    {
      this.minValue = this.scope.rzSliderFloor === undefined ? 0 : +this.scope.rzSliderFloor;

      if(this.scope.rzSliderCeil === undefined)
      {
        this.maxValue = this.range ? this.scope[this.refHigh] : this.scope[this.refLow];
      }
      else
      {
        this.maxValue = +this.scope.rzSliderCeil;
      }
    },

    /**
     * Set the slider children to variables for easy access
     *
     * @returns {undefined}
     */
    cacheElemHandles: function()
    {
      angular.forEach(this.element.children(), function(elem, index)
      {
        var _elem = angular.element(elem);

        switch(index)
        {
          case 0: this.fullBar = _elem; break;
          case 1: this.selBar = _elem; break;
          case 2: this.minPtr = _elem; break;
          case 3: this.maxPtr = _elem; break;
          case 4: this.selLab = _elem; break;
          case 5: this.flrLab = _elem; break;
          case 6: this.ceilLab = _elem; break;
          case 7: this.lowLab = _elem; break;
          case 8: this.highLab = _elem; break;
          case 9: this.cmbLab = _elem; break;
        }

      }, this);

      // Remove stuff not needed in single slider
      if( ! this.range)
      {
        this.cmbLab.remove();
        this.highLab.remove();
        this.maxPtr.remove();
        this.selBar.remove();
        this.selLab.remove();
      }
    },

    /**
     * Calculate dimensions that are dependent on window size
     *
     * @returns {undefined}
     */
    calcViewDimensions: function ()
    {
      var pointerWidth = this.offsetWidth(this.minPtr);

      this.ptrHalfWidth = pointerWidth / 2;
      this.barWidth = this.offsetWidth(this.fullBar);
      this.minOffset = 0;
      this.maxOffset = this.barWidth - pointerWidth;
      this.offsetRange = this.maxOffset - this.minOffset;
      this.setLeft(this.ceilLab, this.barWidth - this.offsetWidth(this.ceilLab));
    },

    /**
     * Update slider handles and label positions
     *
     * @param {string} which
     */
    updateHandles: function(which)
    {
      if(which === 'low')
      {
        this.updateLowHandle();
        if(this.range) { this.updateSelectionBar(); }
        return;
      }

      if(which === 'high')
      {
        this.updateHighHandle();
        if(this.range) { this.updateSelectionBar(); }
        return;
      }

      // Update both
      this.updateLowHandle();
      this.updateHighHandle();
      this.updateSelectionBar();
    },

    /**
     * Update low slider handle position and label
     *
     * @returns {undefined}
     */
    updateLowHandle: function()
    {
      var minPtrOL;

      this.lowValOffsetPerc = this.percentValue(this.scope[this.refLow]);
      // Set low value slider handle position
      minPtrOL = this.setLeft(this.minPtr, this.percentToOffset(this.lowValOffsetPerc));

      // Set low value label position
      this.setLeft(this.lowLab, minPtrOL - this.halfOffsetWidth(this.lowLab) + this.ptrHalfWidth);
    },

    /**
     * Update high slider handle position and label
     *
     * @returns {undefined}
     */
    updateHighHandle: function()
    {
      var maxPtrOL;

      this.highValOffsetPerc = this.percentValue(this.scope[this.refHigh]);
      // Set high value slider handle position
      maxPtrOL = this.setLeft(this.maxPtr, this.percentToOffset(this.highValOffsetPerc));
      // Set high value slider handle label position
      this.setLeft(this.highLab, maxPtrOL - (this.halfOffsetWidth(this.highLab)) + this.ptrHalfWidth);
    },

    /**
     * Update slider selection bar, combined label and range label
     */
    updateSelectionBar: function()
    {
      var selBarOL, selBarWidth;

      // Set selection bar position
      selBarOL = this.setLeft(this.selBar, this.percentToOffset(this.lowValOffsetPerc) + this.ptrHalfWidth);
      selBarWidth = this.percentToOffset(this.highValOffsetPerc - this.lowValOffsetPerc);
      this.selBar.css({width: selBarWidth + 'px'});

      // Set combined label position
      this.setLeft(this.cmbLab, selBarOL + selBarWidth / 2 - this.halfOffsetWidth(this.cmbLab) + 1);

      // Set range label position
      this.setLeft(this.selLab, selBarOL + selBarWidth / 2 - this.halfOffsetWidth(this.selLab) + 1);
      this.scope.rzSliderDiff = this.roundStep(this.scope[this.refHigh] - this.scope[this.refLow]);
    },

    /**
     * Adjust label positions and visibility
     *
     * @returns {undefined}
     */
    adjustLabels: function (origin)
    {
//      console.log('al', this.scope.$id + ' ' + arguments[0]);
      var bubToAdjust = this.highLab;

      this.fitToBar(this.lowLab);

      if (this.range)
      {
        this.fitToBar(this.highLab);
        this.fitToBar(this.selLab);

        if (this.gap(this.lowLab, this.highLab) < 10)
        {
          this.hideEl(this.lowLab);
          this.hideEl(this.highLab);
          this.fitToBar(this.cmbLab);
          this.showEl(this.cmbLab);
          bubToAdjust = this.cmbLab;
        }
        else
        {
          this.showEl(this.lowLab);
          this.showEl(this.highLab);
          this.hideEl(this.cmbLab);
          bubToAdjust = this.highLab;
        }
      }

      if (this.gap(this.flrLab, this.lowLab) < 5)
      {
        this.hideEl(this.flrLab);
      }
      else
      {
        if (this.range)
        {
          if (this.gap(this.flrLab, bubToAdjust) < 5)
          {
            this.hideEl(this.flrLab);
          }
          else
          {
            this.showEl(this.flrLab);
          }
        }
        else
        {
          this.showEl(this.flrLab);
        }
      }

      if (this.gap(this.lowLab, this.ceilLab) < 5)
      {
        this.hideEl(this.ceilLab);
      }
      else
      {
        if (this.range)
        {
          if (this.gap(bubToAdjust, this.ceilLab) < 5)
          {
            this.hideEl(this.ceilLab);
          }
          else
          {
            this.showEl(this.ceilLab);
          }
        }
        else
        {
          this.showEl(this.ceilLab);
        }
      }

      // TODO:
      if(arguments[0] === 'timeout')
      {
        Slider.prototype.adjustLabels = throttle(Slider.prototype.adjustLabels, 350);
      }
    },

    /**
     * Round value to step and precision
     *
     * @param {number} value
     * @returns {number}
     */
    roundStep: function(value)
    {
      var step = this.step,
        decimals = Math.pow(10, this.precision),
        remainder = (value - this.minValue) % step,
        steppedValue = remainder > (step / 2) ? value + step - remainder : value - remainder;

      return +(steppedValue * decimals / decimals).toFixed(this.precision);
    },

    /**
     * Hide element
     *
     * @param element
     * @returns {jqLite} The jqLite
     */
    hideEl: function (element)
    {
      return element.css({opacity: 0});
    },

    /**
     * Show element
     *
     * @param element The jqLite wrapped DOM element
     * @returns {jqLite} The jqLite
     */
    showEl: function (element)
    {
      return element.css({opacity: 1});
    },

    /**
     * Get element's offsetLeft
     *
     * @param element The jqLite wrapped DOM element
     * @returns {number}
     */
    offsetLeft: function (element)
    {
      return element[0].offsetLeft;
    },

    /**
     * Get element's offsetWidth
     *
     * @param element The jqLite wrapped DOM element
     * @returns {number}
     */
    offsetWidth: function (element)
    {
      return element[0].offsetWidth;
    },

    /**
     * Get element's offsetWidth / 2
     *
     * @param element The jqLite wrapped DOM element
     * @returns {number}
     */
    halfOffsetWidth: function (element)
    {
      return element[0].offsetWidth / 2;
    },

    /**
     * Set element left offset
     *
     * @param element        The jqLite wrapped DOM element
     * @param {number} left
     * @returns {number}
     */
    setLeft: function (element, left)
    {
      element.css({left: left + 'px'});
      return left;
    },

    /**
     * Fit element into slider bar
     *
     * @param element The jqLite wrapped DOM element
     */
    fitToBar: function (element)
    {
      this.setLeft(element, Math.min(Math.max(0, this.offsetLeft(element)), this.barWidth - this.offsetWidth(element)));
    },

    /**
     * Get gap in pixels between two elements accounting for elements widths
     *
     * @param element1  The jqLite wrapped DOM element
     * @param element2  The jqLite wrapped DOM element
     * @returns {number}
     */
    gap: function (element1, element2)
    {
      return this.offsetLeft(element2) - this.offsetLeft(element1) - this.offsetWidth(element1);
    },

    /**
     * Translate value to percent (between min and max value)
     *
     * @param value
     * @returns {number}
     */
    percentValue: function (value)
    {
      return ((value - this.minValue) / this.valueRange) * 100;
    },

    /**
     * Translate left offset in pixels to percentages
     *
     * @param {number} offset The left offset
     * @returns {number}
     */
    percentOffset: function (offset)
    {
      return ((offset - this.minOffset) / this.offsetRange) * 100;
    },

    /**
     * Translate left offset in percentages to pixels
     *
     * @param {number} percent The value in percentages
     * @returns {number}       The left offset
     */
    percentToOffset: function (percent)
    {
      return percent * this.offsetRange / 100;
    },

    // Events

    /**
     * Bind mouse and touch events to slider handles
     *
     * @returns {undefined}
     */
    bindToInputEvents: function()
    {
      this.minPtr.on('mousedown', angular.bind(this, this.onStart, this.minPtr, this.refLow));
      if(this.range) { this.maxPtr.on('mousedown', angular.bind(this, this.onStart, this.maxPtr, this.refHigh)) }

      this.minPtr.on('touchstart', angular.bind(this, this.onStart, this.minPtr, this.refLow));
      if(this.range) { this.maxPtr.on('touchstart', angular.bind(this, this.onStart, this.maxPtr, this.refHigh)) }
    },

    /**
     * onStart event handler
     *
     * @param {Object} pointer The jqLite wrapped DOM element
     * @param {string} ref     One of the refLow, refHigh
     * @param {Event}  event   The event
     * @returns {undefined}
     */
    onStart: function (pointer, ref, event)
    {
      var which;

      if(this.tracking !== '') { return }

      this.tracking = ref;

      switch (ref)
      {
        case 'rzSliderModel':
        case 'rzSliderLow':
          which = 'low';
        break;

        case 'rzSliderHigh':
          which = 'high';
        break;
      }

      pointer.addClass('active');

      event.stopPropagation();
      event.preventDefault();

      if(event.touches)
      {
        $document.on('touchmove', angular.bind(this, this.onMove, which));
        $document.on('touchend', angular.bind(this, this.onEnd, pointer));
      }
      else
      {
        $document.on('mousemove', angular.bind(this, this.onMove, which));
        $document.on('mouseup', angular.bind(this, this.onEnd, pointer));
      }
    },

    /**
     * onMove event handler
     *
     * @param {string} ref
     * @param {Event}  event The event
     * @returns {undefined}
     */
    onMove: function (ref, event)
    {
      var eventX = event.clientX || event.touches[0].clientX,
        newOffset, newPercent, newValue;

      newOffset = eventX - this.element[0].getBoundingClientRect().left - this.ptrHalfWidth;
      newOffset = Math.max(Math.min(newOffset, this.maxOffset), this.minOffset);

      newPercent = this.percentOffset(newOffset);
      newValue = this.minValue + (this.valueRange * newPercent / 100.0);

      if (this.range)
      {
        if (this.tracking === this.refLow && newValue >= this.scope[this.refHigh])
        {
          this.scope[this.tracking] = this.scope[this.refHigh];
          this.tracking = this.refHigh;
          this.minPtr.removeClass('active');
          this.maxPtr.addClass('active');
        }
        else if(newValue <= this.scope[this.refLow])
        {
          this.scope[this.tracking] = this.scope[this.refLow];
          this.tracking = this.refLow;
          this.maxPtr.removeClass('active');
          this.minPtr.addClass('active');
        }
      }

      this.scope[this.tracking] = this.roundStep(newValue);
      this.updateHandles(ref);
      this.adjustLabels('onMove');
      this.scope.$apply();
    },

    /**
     * onEnd event handler
     *
     * @param {Object} pointer The jqLite wrapped DOM element
     * @param {Event} event    The event
     * @returns {undefined}
     */
    onEnd: function(pointer, event)
    {
      pointer.removeClass('active');

      if(event.touches)
      {
        $document.unbind('touchmove');
        $document.unbind('touchend');
      }
      else
      {
        $document.unbind('mousemove');
        $document.unbind('mouseup');
      }

      this.tracking = '';
    }
  };

  return Slider;
}])

.directive('rzslider', ['Slider', function(Slider)
{
  return {
    restrict: 'E',
    scope: {
      rzSliderFloor: '=?',
      rzSliderCeil: '=?',
      rzSliderStep: '@',
      rzSliderPrecision: '@',
      rzSliderModel: '=?',
      rzSliderLow: '=?',
      rzSliderHigh: '=?',
      rzSliderTranslate: '&'
    },
    template:   '<span class="bar"></span>' + // 0 The slider bar
                '<span class="bar selection"></span>' + // 1 Highlight between two handles
                '<span class="pointer"></span>' + // 2 Left slider handle
                '<span class="pointer"></span>' + // 3 Right slider handle
                '<span class="bubble selection"></span>' + // 4 Range label
                '<span class="bubble limit" ng-bind="rzSliderTranslate({value: rzSliderFloor})"></span>' + // 5 Floor label
                '<span class="bubble limit" ng-bind="rzSliderTranslate({value: rzSliderCeil})" class="bubble limit"></span>' + // 6 Ceiling label
                '<span class="bubble"></span>' + // 7 Label above left slider handle
                '<span class="bubble"></span>' + // 8 Label above right slider handle
                '<span class="bubble"></span>', // 9 Range label when the slider handles are close ex. 15 - 17

    compile: function (element, attributes)
    {
      var
        // The slider child elements
        children = element.children(),
        range = (attributes.rzSliderModel === undefined) && ((attributes.rzSliderLow !== undefined) && (attributes.rzSliderHigh !== undefined)),
        refLow = range ? 'rzSliderLow' : 'rzSliderModel',
        refHigh = 'rzSliderHigh';

      // Set attribute value to function call
      if (attributes.rzSliderTranslate)
      {
        attributes.$set('rzSliderTranslate', '' + attributes.rzSliderTranslate + '(value)');
      }

      // Range label
      angular.element(children[4]).attr('ng-bind', 'rzSliderTranslate({value: rzSliderDiff})');
      // Label above low slider
      angular.element(children[7]).attr('ng-bind', 'rzSliderTranslate({value: ' + refLow + '})');
      // Label above high slider
      angular.element(children[8]).attr('ng-bind', 'rzSliderTranslate({value: ' + refHigh + '})');
      // Combined label for low and high
      angular.element(children[9]).attr('ng-bind-html',  'rzSliderTranslate({value: ' + refLow + '}) + " - " + rzSliderTranslate({value: ' + refHigh + '})');

      return {
        post: function(scope, elem, attr)
        {
          return new Slider(scope, elem, attr);
        }
      };
    }
  };
}]);

// IDE assist

/**
 * @name jqLite
 */

/**
 * @name Event
 * @property {Array} touches
 */
