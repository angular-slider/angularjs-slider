/**
 * Angular JS slider directive
 *
 * (c) Rafal Zajac <rzajac@gmail.com>
 * http://github.com/rzajac/angularjs-slider
 *
 * Version: v0.1.15
 *
 * Licensed under the MIT license
 */

/* global angular: false */

angular.module('rzModule', [])

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

.factory('RzSlider', ['$timeout', '$document', '$window', 'throttle', function($timeout, $document, $window, throttle)
{
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
    this.customTrFn = this.scope.rzSliderTranslate() || function(value) { return '' + value; };

    this.unbinders = [];

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
        self.bindEvents();
      });

      // Recalculate slider view dimensions
      this.scope.$on('reCalcViewDimensions', angular.bind(this, this.calcViewDimensions));

      // Recalculate stuff if view port dimensions have changed
      angular.element($window).on('resize', angular.bind(this, this.calcViewDimensions));

      this.initHasRun = true;

      // Watch for changes to the model

      var thrLow = throttle(function()
      {
        self.setMinAndMax();
        self.updateLowHandle(self.valueToOffset(self.scope.rzSliderModel));
        self.updateSelectionBar();

        if(self.range)
        {
          self.updateCmbLabel();
        }

      }, 350, { leading: false });

      var thrHigh = throttle(function()
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
        thrHigh();
        self.resetSlider();
      });

      // Watchers

      this.unbinders.push(this.scope.$watch('rzSliderModel', function(newValue, oldValue)
      {
        if(newValue === oldValue) return;
        thrLow();
      }));

      this.unbinders.push(this.scope.$watch('rzSliderHigh', function(newValue, oldValue)
      {
        if(newValue === oldValue) return;
        thrHigh();
      }));

      this.unbinders.push(this.scope.$watch('rzSliderFloor', function(newValue, oldValue)
      {
        if(newValue === oldValue) return;
        self.resetSlider();
      }));

      this.unbinders.push(this.scope.$watch('rzSliderCeil', function(newValue, oldValue)
      {
        if(newValue === oldValue) return;
        self.resetSlider();
      }));

      this.sliderElem.on('$destroy', function()
      {
        self.minH.off('.rzslider');
        self.maxH.off('.rzslider');
        $document.off('.rzslider');
        angular.element($window).off('.rzslider');
      });

      this.scope.$on('$destroy', function()
      {
        self.unbinders.map(function(unbind)
        {
          unbind();
        });
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

      var valStr = useCustomTr ? '' + this.customTrFn(value) : '' + value,
          getWidth = false;

      if(label.rzsv === undefined || label.rzsv.length != valStr.length || (label.rzsv.length > 0 && label.rzsw == 0))
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
        var _elem = angular.element(elem);

        switch(index)
        {
          case 0: this.fullBar = _elem; break;
          case 1: this.selBar = _elem; break;
          case 2: this.minH = _elem; break;
          case 3: this.maxH = _elem; break;
          case 4: this.flrLab = _elem; break;
          case 5: this.ceilLab = _elem; break;
          case 6: this.minLab = _elem; break;
          case 7: this.maxLab = _elem; break;
          case 8: this.cmbLab = _elem; break;
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

      if(this.initHasRun)
      {
        this.updateCeilLab();
        this.initHandles();
      }
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
      if(delta === 0 || delta === 1) return;

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
      var step = this.step / Math.pow(10,this.precision),
          remainder = (value - this.minValue) % step,
          steppedValue = remainder > (step / 2) ? value + step - remainder : value - remainder;

      return +(steppedValue).toFixed(this.precision);
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
      if(!!element.rzAlwaysHide) return element;

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
      return Math.round((Math.ceil(val) - this.minValue) * this.maxLeft / this.valueRange);
    },

    /**
     * Translate offset to model value
     *
     * @param {number} offset
     * @returns {number}
     */
    offsetToValue: function(offset)
    {
      return Math.ceil( (offset / this.maxLeft) * this.valueRange + this.minValue );
    },

    // Events

    /**
     * Bind mouse and touch events to slider handles
     *
     * @returns {undefined}
     */
    bindEvents: function()
    {
      this.minH.on('mousedown', angular.bind(this, this.onStart, this.minH, 'rzSliderModel'));
      if(this.range) { this.maxH.on('mousedown', angular.bind(this, this.onStart, this.maxH, 'rzSliderHigh')) }

      this.minH.on('touchstart', angular.bind(this, this.onStart, this.minH, 'rzSliderModel'));
      if(this.range) { this.maxH.on('touchstart', angular.bind(this, this.onStart, this.maxH, 'rzSliderHigh')) }
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
      event.stopPropagation();
      event.preventDefault();

      if(this.tracking !== '') { return }

      // We have to do this in case the HTML where the sliders are on
      // have been animated into view.
      this.calcViewDimensions();
      this.tracking = ref;

      pointer.addClass('rz-active');

      if(event.touches || (typeof(event.originalEvent) != 'undefined' && event.originalEvent.touches))
      {
        this.sliderElem.on('touchmove', angular.bind(this, this.onMove, pointer));
        $document.one('touchend', angular.bind(this, this.onEnd));
      }
      else
      {
        this.sliderElem.on('mousemove', angular.bind(this, this.onMove, pointer));
        $document.one('mouseup', angular.bind(this, this.onEnd));
      }
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

      if('clientX' in event)
      {
        eventX = event.clientX;
      }
      else
      {
        eventX = typeof event.originalEvent !== 'undefined' ? event.originalEvent.touches[0].clientX : event.touches[0].clientX;
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
     * @param {Event} event    The event
     * @returns {undefined}
     */
    onEnd: function(event)
    {
      this.minH.removeClass('rz-active');
      this.maxH.removeClass('rz-active');

      if(event.touches || (typeof(event.originalEvent) != 'undefined' && event.originalEvent.touches))
      {
      	this.sliderElem.off('touchmove');
      }
      else
      {
      	this.sliderElem.off('mousemove');
      }

      this.scope.$emit('slideEnded');

      this.tracking = '';
    }
  };

  return Slider;
}])

.directive('rzslider', ['RzSlider', function(Slider)
{
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
      rzSliderAlwaysShowBar: '=?'
    },
    template:   '<span class="rz-bar"></span>' + // 0 The slider bar
                '<span class="rz-bar rz-selection"></span>' + // 1 Highlight between two handles
                '<span class="rz-pointer"></span>' + // 2 Left slider handle
                '<span class="rz-pointer"></span>' + // 3 Right slider handle
                '<span class="rz-bubble rz-limit"></span>' + // 4 Floor label
                '<span class="rz-bubble rz-limit"></span>' + // 5 Ceiling label
                '<span class="rz-bubble"></span>' + // 6 Label above left slider handle
                '<span class="rz-bubble"></span>' + // 7 Label above right slider handle
                '<span class="rz-bubble"></span>', // 8 Range label when the slider handles are close ex. 15 - 17

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
