/**
 * Angular JS slider directive
 *
 * (c) Rafal Zajac <rzajac@gmail.com>
 * http://github.com/rzajac/angularjs-slider
 *
 * Version: v0.1.21
 *
 * Licensed under the MIT license
 */

/*jslint unparam: true */
/*global angular: false, console: false */

angular.module('rzModule', [])

.run(['$templateCache', function($templateCache) {
  'use strict';
  var template = '<span class="rz-bar-wrapper"><span class="rz-bar"></span></span>' + // 0 The slider bar
              '<span class="rz-bar rz-selection"></span>' + // 1 Highlight between two handles
              '<span class="rz-pointer"></span>' + // 2 Left slider handle
              '<span class="rz-pointer"></span>' + // 3 Right slider handle
              '<span class="rz-bubble rz-limit"></span>' + // 4 Floor label
              '<span class="rz-bubble rz-limit"></span>' + // 5 Ceiling label
              '<span class="rz-bubble"></span>' + // 6 Label above left slider handle
              '<span class="rz-bubble"></span>' + // 7 Label above right slider handle
              '<span class="rz-bubble"></span>' + // 8 Range label when the slider handles are close ex. 15 - 17
              '<table class="rz-ticks"></table>' + // 9 the ticks
              '<span class="rz-click-bar"></span>' +
              '';
  $templateCache.put('rzSliderTpl.html', template);
}])

.value('throttle',
  /**
   * throttle
   *
   * Taken from underscore project
   *
   * @param {Function} func
   * @param {number} wait
   * @param {ThrottleOptions} options
   * @returns {Function}
   */
function throttle(func, wait, options) {
  'use strict';
  var getTime = (Date.now || function() {
    return new Date().getTime();
  });
  var context, args, result;
  var timeout = null;
  var previous = 0;
  options = options || {};
  var later = function() {
    previous = options.leading === false ? 0 : getTime();
    timeout = null;
    result = func.apply(context, args);
    context = args = null;
  };
  return function() {
    var now = getTime();
    if (!previous && options.leading === false) { previous = now; }
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
  };
})

.factory('RzSlider', ['$timeout', '$document', '$window', 'throttle', function($timeout, $document, $window, throttle)
{
  'use strict';

  /**
   * Slider
   *
   * @param {ngScope} scope            The AngularJS scope
   * @param {Element} sliderElem The slider directive element wrapped in jqLite
   * @param {*} attributes       The slider directive attributes
   * @constructor
   */
  var Slider = function(scope, sliderElem, attributes)
  {
    /**
     * The slider's scope
     *
     * @type {ngScope}
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
    this.sliderElem = sliderElem;

    /**
     * Slider type
     *
     * @type {boolean} Set to true for range slider
     */
    this.range = attributes.rzSliderHigh !== undefined && attributes.rzSliderModel !== undefined;

    /**
     * Half of the width of the slider handles
     *
     * @type {number}
     */
    this.handleHalfWidth = 0;

    /**
     * Always show selection bar
     *
     * @type {boolean}
     */
    this.alwaysShowBar = !!attributes.rzSliderAlwaysShowBar;

    /**
     * Maximum left the slider handle can have
     *
     * @type {number}
     */
    this.maxLeft = 0;

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
     * Hide limit labels
     *
     * @type {boolean}
     */
    this.hideLimitLabels = !!attributes.rzSliderHideLimitLabels;

    /**
     * Only present model values
     *
     * Do not allow to change values
     *
     * @type {boolean}
     */
    this.presentOnly = attributes.rzSliderPresentOnly === 'true';

    /**
     * Display ticks on each possible value.
     *
     * @type {boolean}
     */
    this.showTicks = attributes.rzSliderShowTicks === 'true';

    /**
     * The delta between min and max value
     *
     * @type {number}
     */
    this.valueRange = 0;

    /**
     * Set to true if init method already executed
     *
     * @type {boolean}
     */
    this.initHasRun = false;

    /**
     * Custom translate function
     *
     * @type {function}
     */
    this.customTrFn = this.scope.rzSliderTranslate() || function(value) { return String(value); };

    /**
     * Array of de-registration functions to call on $destroy
     *
     * @type {Array.<Function>}
     */
    this.deRegFuncs = [];

    // Slider DOM elements wrapped in jqLite
    this.fullBar = null; // The whole slider bar
    this.selBar = null;  // Highlight between two handles
    this.minH = null;  // Left slider handle
    this.maxH = null;  // Right slider handle
    this.flrLab = null;  // Floor label
    this.ceilLab = null; // Ceiling label
    this.minLab =  null; // Label above the low value
    this.maxLab = null; // Label above the high value
    this.cmbLab = null;  // Combined label
    this.ticks = null;  // The ticks
    this.clickBar = null;

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
      var thrLow, thrHigh, unRegFn,
        calcDimFn = angular.bind(this, this.calcViewDimensions),
        self = this;

      this.initElemHandles();
      this.calcViewDimensions();
      this.setMinAndMax();

      this.precision = this.scope.rzSliderPrecision === undefined ? 0 : +this.scope.rzSliderPrecision;
      this.step = this.scope.rzSliderStep === undefined ? 1 : +this.scope.rzSliderStep;

      $timeout(function()
      {
        self.updateCeilLab();
        self.updateFloorLab();
        self.initHandles();
        if (!self.presentOnly) { self.bindEvents(); }
        if(self.showTicks)
          self.updateTicksScale();
      });

      // Recalculate slider view dimensions
      unRegFn = this.scope.$on('reCalcViewDimensions', calcDimFn);
      this.deRegFuncs.push(unRegFn);

      // Recalculate stuff if view port dimensions have changed
      angular.element($window).on('resize', calcDimFn);

      this.initHasRun = true;

      // Watch for changes to the model

      thrLow = throttle(function()
      {
        self.setMinAndMax();
        self.updateLowHandle(self.valueToOffset(self.scope.rzSliderModel));
        self.updateSelectionBar();

        if(self.range)
        {
          self.updateCmbLabel();
        }

      }, 350, { leading: false });

      thrHigh = throttle(function()
      {
        self.setMinAndMax();
        self.updateHighHandle(self.valueToOffset(self.scope.rzSliderHigh));
        self.updateSelectionBar();
        self.updateCmbLabel();
      }, 350, { leading: false });

      this.scope.$on('rzSliderForceRender', function()
      {
        self.resetLabelsValue();
        thrLow();
        if(self.range) { thrHigh(); }
        self.resetSlider();
      });

      // Watchers

      unRegFn = this.scope.$watch('rzSliderModel', function(newValue, oldValue)
      {
        if(newValue === oldValue) { return; }
        thrLow();
      });
      this.deRegFuncs.push(unRegFn);

      unRegFn = this.scope.$watch('rzSliderHigh', function(newValue, oldValue)
      {
        if(newValue === oldValue) { return; }
        thrHigh();
      });
      this.deRegFuncs.push(unRegFn);

      this.scope.$watch('rzSliderFloor', function(newValue, oldValue)
      {
        if(newValue === oldValue) { return; }
        self.resetSlider();
      });
      this.deRegFuncs.push(unRegFn);

      unRegFn = this.scope.$watch('rzSliderCeil', function(newValue, oldValue)
      {
        if(newValue === oldValue) { return; }
        self.resetSlider();
      });
      this.deRegFuncs.push(unRegFn);

      this.scope.$on('$destroy', function()
      {
        self.minH.off();
        self.maxH.off();
        angular.element($window).off('resize', calcDimFn);
        self.deRegFuncs.map(function(unbind) { unbind(); });
      });
    },

    /**
     * Resets slider
     *
     * @returns {undefined}
     */
    resetSlider: function()
    {
      this.setMinAndMax();
      this.calcViewDimensions();
      this.updateCeilLab();
      this.updateFloorLab();
    },

    /**
     * Reset label values
     *
     * @return {undefined}
     */
    resetLabelsValue: function()
    {
      this.minLab.rzsv = undefined;
      this.maxLab.rzsv = undefined;
    },

    /**
     * Initialize slider handles positions and labels
     *
     * Run only once during initialization and every time view port changes size
     *
     * @returns {undefined}
     */
    initHandles: function()
    {
      this.updateLowHandle(this.valueToOffset(this.scope.rzSliderModel));

      if(this.range)
      {
        this.updateHighHandle(this.valueToOffset(this.scope.rzSliderHigh));
        this.updateCmbLabel();
      }

      this.updateSelectionBar();
    },

    /**
     * Translate value to human readable format
     *
     * @param {number|string} value
     * @param {jqLite} label
     * @param {bool?} useCustomTr
     * @returns {undefined}
     */
    translateFn: function(value, label, useCustomTr)
    {
      useCustomTr = useCustomTr === undefined ? true : useCustomTr;

      var valStr = String(useCustomTr ? this.customTrFn(value) : value),
          getWidth = false;

      if(label.rzsv === undefined || label.rzsv.length !== valStr.length || (label.rzsv.length > 0 && label.rzsw === 0))
      {
        getWidth = true;
        label.rzsv = valStr;
      }

      label.text(valStr);

      // Update width only when length of the label have changed
      if(getWidth) { this.getWidth(label); }
    },

    /**
     * Set maximum and minimum values for the slider
     *
     * @returns {undefined}
     */
    setMinAndMax: function()
    {
      if(this.scope.rzSliderFloor)
      {
        this.minValue = +this.scope.rzSliderFloor;
      }
      else
      {
        this.minValue = this.scope.rzSliderFloor = 0;
      }

      if(this.scope.rzSliderCeil)
      {
        this.maxValue = +this.scope.rzSliderCeil;
      }
      else
      {
        this.scope.rzSliderCeil = this.maxValue = this.range ? this.scope.rzSliderHigh : this.scope.rzSliderModel;
      }

      if(this.scope.rzSliderStep)
      {
        this.step = +this.scope.rzSliderStep;
      }

      this.valueRange = this.maxValue - this.minValue;
    },

    /**
     * Set the slider children to variables for easy access
     *
     * Run only once during initialization
     *
     * @returns {undefined}
     */
    initElemHandles: function()
    {
      // Assign all slider elements to object properties for easy access
      angular.forEach(this.sliderElem.children(), function(elem, index)
      {
        var jElem = angular.element(elem);

        switch(index)
        {
          case 0: this.fullBar = jElem; break;
          case 1: this.selBar = jElem; break;
          case 2: this.minH = jElem; break;
          case 3: this.maxH = jElem; break;
          case 4: this.flrLab = jElem; break;
          case 5: this.ceilLab = jElem; break;
          case 6: this.minLab = jElem; break;
          case 7: this.maxLab = jElem; break;
          case 8: this.cmbLab = jElem; break;
          case 9: this.ticks = jElem; break;
          case 10: this.clickBar = jElem; break;
        }

      }, this);

      // Initialize offset cache properties
      this.fullBar.rzsl = 0;
      this.selBar.rzsl = 0;
      this.minH.rzsl = 0;
      this.maxH.rzsl = 0;
      this.flrLab.rzsl = 0;
      this.ceilLab.rzsl = 0;
      this.minLab.rzsl = 0;
      this.maxLab.rzsl = 0;
      this.cmbLab.rzsl = 0;
      this.ticks.rzsl = 0;
      this.clickBar.rzsl = 0;

      // Hide limit labels
      if(this.hideLimitLabels)
      {
        this.flrLab.rzAlwaysHide = true;
        this.ceilLab.rzAlwaysHide = true;
        this.hideEl(this.flrLab);
        this.hideEl(this.ceilLab);
      }

      // Remove stuff not needed in single slider
      if(this.range === false)
      {
        this.cmbLab.remove();
        this.maxLab.remove();

        // Hide max handle
        this.maxH.rzAlwaysHide = true;
        this.maxH[0].style.zIndex = '-1000';
        this.hideEl(this.maxH);
      }

      // Show selection bar for single slider or not
      if(this.range === false && this.alwaysShowBar === false)
      {
        this.maxH.remove();
        this.selBar.remove();
      }
    },

    /**
     * Calculate dimensions that are dependent on view port size
     *
     * Run once during initialization and every time view port changes size.
     *
     * @returns {undefined}
     */
    calcViewDimensions: function ()
    {
      var handleWidth = this.getWidth(this.minH);

      this.handleHalfWidth = handleWidth / 2;
      this.barWidth = this.getWidth(this.fullBar);

      this.maxLeft = this.barWidth - handleWidth;

      this.getWidth(this.sliderElem);
      this.sliderElem.rzsl = this.sliderElem[0].getBoundingClientRect().left;
      if(this.showTicks)
        this.updateTicksScale();

      if(this.initHasRun)
      {
        this.updateCeilLab();
        this.initHandles();
      }
    },

    /**
     * Update the ticks position
     *
     * @returns {undefined}
     */
    updateTicksScale: function() {
        var positions = '<tr>'
        for (var i = this.minValue; i < this.maxValue; i += this.step) {
            positions += '<td></td>';
        }
        positions += '</tr>';
        this.ticks.html(positions);
        this.ticks.css({
          width: (this.barWidth - 2 * this.handleHalfWidth) + 'px',
          left: this.handleHalfWidth + 'px'
        });
    },

    /**
     * Update position of the ceiling label
     *
     * @returns {undefined}
     */
    updateCeilLab: function()
    {
      this.translateFn(this.scope.rzSliderCeil, this.ceilLab);
      this.setLeft(this.ceilLab, this.barWidth - this.ceilLab.rzsw);
      this.getWidth(this.ceilLab);
    },

    /**
     * Update position of the floor label
     *
     * @returns {undefined}
     */
    updateFloorLab: function()
    {
      this.translateFn(this.scope.rzSliderFloor, this.flrLab);
      this.getWidth(this.flrLab);
    },

    /**
     * Update slider handles and label positions
     *
     * @param {string} which
     * @param {number} newOffset
     */
    updateHandles: function(which, newOffset)
    {
      if(which === 'rzSliderModel')
      {
        this.updateLowHandle(newOffset);
        this.updateSelectionBar();

        if(this.range)
        {
          this.updateCmbLabel();
        }
        return;
      }

      if(which === 'rzSliderHigh')
      {
        this.updateHighHandle(newOffset);
        this.updateSelectionBar();

        if(this.range)
        {
          this.updateCmbLabel();
        }
        return;
      }

      // Update both
      this.updateLowHandle(newOffset);
      this.updateHighHandle(newOffset);
      this.updateSelectionBar();
      this.updateCmbLabel();
    },

    /**
     * Update low slider handle position and label
     *
     * @param {number} newOffset
     * @returns {undefined}
     */
    updateLowHandle: function(newOffset)
    {
      var delta = Math.abs(this.minH.rzsl - newOffset);

      if(delta <= 0 && delta < 1) { return; }

      this.setLeft(this.minH, newOffset);
      this.translateFn(this.scope.rzSliderModel, this.minLab);
      this.setLeft(this.minLab, newOffset - this.minLab.rzsw / 2 + this.handleHalfWidth);

      this.shFloorCeil();
    },

    /**
     * Update high slider handle position and label
     *
     * @param {number} newOffset
     * @returns {undefined}
     */
    updateHighHandle: function(newOffset)
    {
      this.setLeft(this.maxH, newOffset);
      this.translateFn(this.scope.rzSliderHigh, this.maxLab);
      this.setLeft(this.maxLab, newOffset - this.maxLab.rzsw / 2 + this.handleHalfWidth);

      this.shFloorCeil();
    },

    /**
     * Show / hide floor / ceiling label
     *
     * @returns {undefined}
     */
    shFloorCeil: function()
    {
      var flHidden = false, clHidden = false;

      if(this.minLab.rzsl <= this.flrLab.rzsl + this.flrLab.rzsw + 5)
      {
        flHidden = true;
        this.hideEl(this.flrLab);
      }
      else
      {
        flHidden = false;
        this.showEl(this.flrLab);
      }

      if(this.minLab.rzsl + this.minLab.rzsw >= this.ceilLab.rzsl - this.handleHalfWidth - 10)
      {
        clHidden = true;
        this.hideEl(this.ceilLab);
      }
      else
      {
        clHidden = false;
        this.showEl(this.ceilLab);
      }

      if(this.range)
      {
        if(this.maxLab.rzsl + this.maxLab.rzsw >= this.ceilLab.rzsl - 10)
        {
          this.hideEl(this.ceilLab);
        }
        else if( ! clHidden)
        {
          this.showEl(this.ceilLab);
        }

        // Hide or show floor label
        if(this.maxLab.rzsl <= this.flrLab.rzsl + this.flrLab.rzsw + this.handleHalfWidth)
        {
          this.hideEl(this.flrLab);
        }
        else if( ! flHidden)
        {
          this.showEl(this.flrLab);
        }
      }
    },

    /**
     * Update slider selection bar, combined label and range label
     *
     * @returns {undefined}
     */
    updateSelectionBar: function()
    {
      this.setWidth(this.selBar, Math.abs(this.maxH.rzsl - this.minH.rzsl));
      this.setLeft(this.selBar, this.range ? this.minH.rzsl + this.handleHalfWidth : 0);
    },

    /**
     * Update combined label position and value
     *
     * @returns {undefined}
     */
    updateCmbLabel: function()
    {
      var lowTr, highTr;

      if(this.minLab.rzsl + this.minLab.rzsw + 10 >= this.maxLab.rzsl)
      {
        if(this.customTrFn)
        {
          lowTr = this.customTrFn(this.scope.rzSliderModel);
          highTr = this.customTrFn(this.scope.rzSliderHigh);
        }
        else
        {
          lowTr = this.scope.rzSliderModel;
          highTr = this.scope.rzSliderHigh;
        }

        this.translateFn(lowTr + ' - ' + highTr, this.cmbLab, false);
        this.setLeft(this.cmbLab, this.selBar.rzsl + this.selBar.rzsw / 2 - this.cmbLab.rzsw / 2);
        this.hideEl(this.minLab);
        this.hideEl(this.maxLab);
        this.showEl(this.cmbLab);
      }
      else
      {
        this.showEl(this.maxLab);
        this.showEl(this.minLab);
        this.hideEl(this.cmbLab);
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
          remainder = +((value - this.minValue) % step).toFixed(3),
          steppedValue = remainder > (step / 2) ? value + step - remainder : value - remainder;

      steppedValue = steppedValue.toFixed(this.precision);
      return +steppedValue;
    },

    /**
     * Hide element
     *
     * @param element
     * @returns {jqLite} The jqLite wrapped DOM element
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
      if(!!element.rzAlwaysHide) { return element; }

      return element.css({opacity: 1});
    },

    /**
     * Set element left offset
     *
     * @param {jqLite} elem The jqLite wrapped DOM element
     * @param {number} left
     * @returns {number}
     */
    setLeft: function (elem, left)
    {
      elem.rzsl = left;
      elem.css({left: left + 'px'});
      return left;
    },

    /**
     * Get element width
     *
     * @param {jqLite} elem The jqLite wrapped DOM element
     * @returns {number}
     */
    getWidth: function(elem)
    {
      var val = elem[0].getBoundingClientRect();
      elem.rzsw = val.right - val.left;
      return elem.rzsw;
    },

    /**
     * Set element width
     *
     * @param {jqLite} elem  The jqLite wrapped DOM element
     * @param {number} width
     * @returns {*}
     */
    setWidth: function(elem, width)
    {
      elem.rzsw = width;
      elem.css({width: width + 'px'});
      return width;
    },

    /**
     * Translate value to pixel offset
     *
     * @param {number} val
     * @returns {number}
     */
    valueToOffset: function(val)
    {
      return (val - this.minValue) * this.maxLeft / this.valueRange;
    },

    /**
     * Translate offset to model value
     *
     * @param {number} offset
     * @returns {number}
     */
    offsetToValue: function(offset)
    {
      return (offset / this.maxLeft) * this.valueRange + this.minValue;
    },

    // Events

    /**
     * Bind mouse and touch events to slider handles
     *
     * @returns {undefined}
     */
    bindEvents: function()
    {
      this.minH.on('mousedown touchstart', angular.bind(this, this.onStart, this.minH, 'rzSliderModel'));
      if(this.range) { this.maxH.on('mousedown touchstart', angular.bind(this, this.onStart, this.maxH, 'rzSliderHigh')); }

      this.clickBar.on('mousedown touchstart', angular.bind(this, this.range ? this.onStartRange : this.onStart, this.minH, 'rzSliderModel'));
      this.clickBar.on('mousedown touchstart', angular.bind(this, this.onMove, this.minH));
    },

    /**
     * onStartRange event handler
     *
     * @param {Object} pointer The jqLite wrapped DOM element
     * @param {string} ref     One of the refLow, refHigh values
     * @param {Event}  event   The event
     * @returns {undefined}
     */
    onStartRange: function (pointer, ref, event) {
      var clickLeft = isFinite(event.offsetX) ? event.offsetX : (event.touches[0].clientX - jQuery(event.srcElement).offset().left);

      var minHandleLeft = this.minH.rzsl;
      var maxHandleLeft = this.maxH.rzsl;
      var minDelta      = Math.abs(minHandleLeft - clickLeft);
      var maxDelta      = Math.abs(maxHandleLeft - clickLeft);

      /**
       * If mouse start near maxH, use it instead of minH
       */
      if (minDelta > maxDelta) {
        pointer = this.maxH;
        ref     = 'rzSliderHigh';
      }

      this.onStart.apply(this, [pointer, ref, event]);
    },

    /**
     * onStart event handler
     *
     * @param {Object} pointer The jqLite wrapped DOM element
     * @param {string} ref     One of the refLow, refHigh values
     * @param {Event}  event   The event
     * @returns {undefined}
     */
    onStart: function (pointer, ref, event)
    {
      var ehMove, ehEnd,
          eventNames = this.getEventNames(event);

      event.stopPropagation();
      event.preventDefault();

      if(this.tracking !== '') { return; }

      // We have to do this in case the HTML where the sliders are on
      // have been animated into view.
      this.calcViewDimensions();
      this.tracking = ref;

      pointer.addClass('rz-active');

      ehMove = angular.bind(this, this.onMove, pointer);
      ehEnd = angular.bind(this, this.onEnd, ehMove);

      $document.on(eventNames.moveEvent, ehMove);
      $document.one(eventNames.endEvent, ehEnd);
    },

    /**
     * onMove event handler
     *
     * @param {jqLite} pointer
     * @param {Event}  event The event
     * @returns {undefined}
     */
    onMove: function (pointer, event)
    {
      var eventX, sliderLO, newOffset, newValue;

      /* http://stackoverflow.com/a/12336075/282882 */
      //noinspection JSLint
      if('clientX' in event)
      {
        eventX = event.clientX;
      }
      else
      {
        eventX = event.originalEvent === undefined ?
          event.touches[0].clientX
          : event.originalEvent.touches[0].clientX;
      }

      sliderLO = this.sliderElem.rzsl;
      newOffset = eventX - sliderLO - this.handleHalfWidth;

      if(newOffset <= 0)
      {
        if(pointer.rzsl !== 0)
        {
          this.scope[this.tracking] = this.minValue;
          this.updateHandles(this.tracking, 0);
          this.scope.$apply();
        }

        return;
      }

      if(newOffset >= this.maxLeft)
      {
        if(pointer.rzsl !== this.maxLeft)
        {
          this.scope[this.tracking] = this.maxValue;
          this.updateHandles(this.tracking, this.maxLeft);
          this.scope.$apply();
        }

        return;
      }

      newValue = this.offsetToValue(newOffset);
      newValue = this.roundStep(newValue);
      newOffset = this.valueToOffset(newValue);

      if (this.range)
      {
        if (this.tracking === 'rzSliderModel' && newValue >= this.scope.rzSliderHigh)
        {
          this.scope[this.tracking] = this.scope.rzSliderHigh;
          this.updateHandles(this.tracking, this.maxH.rzsl);
          this.tracking = 'rzSliderHigh';
          this.minH.removeClass('rz-active');
          this.maxH.addClass('rz-active');
        }
        else if(this.tracking === 'rzSliderHigh' && newValue <= this.scope.rzSliderModel)
        {
          this.scope[this.tracking] = this.scope.rzSliderModel;
          this.updateHandles(this.tracking, this.minH.rzsl);
          this.tracking = 'rzSliderModel';
          this.maxH.removeClass('rz-active');
          this.minH.addClass('rz-active');
        }
      }

      if(this.scope[this.tracking] !== newValue)
      {
        this.scope[this.tracking] = newValue;
        this.updateHandles(this.tracking, newOffset);
        this.scope.$apply();
      }
    },

    /**
     * onEnd event handler
     *
     * @param {Event}    event    The event
     * @param {Function} ehMove   The the bound move event handler
     * @returns {undefined}
     */
    onEnd: function(ehMove, event)
    {
      var moveEventName = this.getEventNames(event).moveEvent;

      this.minH.removeClass('rz-active');
      this.maxH.removeClass('rz-active');

      $document.off(moveEventName, ehMove);

      this.scope.$emit('slideEnded');
      this.tracking = '';
    },

    /**
     * Get event names for move and event end
     *
     * @param {Event}    event    The event
     *
     * @return {{moveEvent: string, endEvent: string}}
     */
    getEventNames: function(event)
    {
      var eventNames = {moveEvent: '', endEvent: ''};

      if(event.touches || (event.originalEvent !== undefined && event.originalEvent.touches))
      {
        eventNames.moveEvent = 'touchmove';
        eventNames.endEvent = 'touchend';
      }
      else
      {
        eventNames.moveEvent = 'mousemove';
        eventNames.endEvent = 'mouseup';
      }

      return eventNames;
    }
  };

  return Slider;
}])

.directive('rzslider', ['RzSlider', function(Slider)
{
  'use strict';

  return {
    restrict: 'E',
    scope: {
      rzSliderFloor: '=?',
      rzSliderCeil: '=?',
      rzSliderStep: '@',
      rzSliderPrecision: '@',
      rzSliderModel: '=?',
      rzSliderHigh: '=?',
      rzSliderTranslate: '&',
      rzSliderHideLimitLabels: '=?',
      rzSliderAlwaysShowBar: '=?',
      rzSliderPresentOnly: '@',
      rzSliderShowTicks: '@'
    },

    /**
     * Return template URL
     *
     * @param {*} elem
     * @param {*} attrs
     * @return {string}
     */
    templateUrl: function(elem, attrs) {
      //noinspection JSUnresolvedVariable
      return attrs.rzSliderTplUrl || 'rzSliderTpl.html';
    },

    link: function(scope, elem, attr)
    {
      return new Slider(scope, elem, attr);
    }
  };
}]);

// IDE assist

/**
 * @name ngScope
 *
 * @property {number} rzSliderModel
 * @property {number} rzSliderHigh
 * @property {number} rzSliderCeil
 */

/**
 * @name jqLite
 *
 * @property {number|undefined} rzsl
 * @property {number|undefined} rzsw
 * @property {string|undefined} rzsv
 * @property {Function} css
 * @property {Function} text
 */

/**
 * @name Event
 * @property {Array} touches
 * @property {Event} originalEvent
 */

/**
 * @name ThrottleOptions
 *
 * @property {bool} leading
 * @property {bool} trailing
 */
