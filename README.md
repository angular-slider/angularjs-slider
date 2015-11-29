## AngularJS slider directive with no external dependencies

Status:
[![npm version](https://img.shields.io/npm/v/angularjs-slider.svg?style=flat-square)](https://www.npmjs.com/package/angularjs-slider)
[![npm downloads](https://img.shields.io/npm/dm/angularjs-slider.svg?style=flat-square)](http://npm-stat.com/charts.html?package=angularjs-slider&from=2015-01-01)

Links:
[![Join the chat at https://gitter.im/rzajac/angularjs-slider](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/rzajac/angularjs-slider?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Slider directive implementation for AngularJS, without any dependencies.

- Mobile friendly
- Fast
- Well documented
- Customizable
- Simple to use
- Compatibility with jQuery Lite, ie. with full jQuery ( Thanks Jusas! https://github.com/Jusas)

**Horizontal**

![image](https://cloud.githubusercontent.com/assets/2678610/11419158/d51cee88-9425-11e5-9d3f-3f7d97a31c6f.png)

**Vertical**

![image](https://cloud.githubusercontent.com/assets/2678610/11419099/7f4c0e76-9425-11e5-98c6-615412291df1.png)

## Examples

- **Various examples:** [http://rzajac.github.io/angularjs-slider/](http://rzajac.github.io/angularjs-slider/index.html)
- **Same examples with code:** https://jsfiddle.net/nrdmtzjm/

## Reporting issues
Make sure the report is accompanied by a reproducible demo. The ideal demo is created by forking [our standard jsFiddle](http://jsfiddle.net/cwhgLcjv/), adding your own code and stripping it down to an absolute minimum needed to demonstrate the bug.

## Installation

### NPM
```
npm i angularjs-slider
```
or
### Bower
```
$ bower install --save angularjs-slider
```

### Module
```javascript
angular.module('yourApp', ['rzModule']);
```

### Single slider

```javascript
// In your controller
$scope.priceSlider = 150;
```

```html
<div>
    <rzslider rz-slider-model="priceSlider"></rzslider>
</div>
```

Above example would render a slider from 0 to 150. If you need floor and ceiling values use `rz-slider-options` attribute and provide an object with `floor`and `ceil`.

```html
<div>
    <rzslider
         rz-slider-model="slider.value"
         rz-slider-options="slider.options"></rzslider>
</div>
```
```js
$scope.slider = {
  value: 150,
  options: {
    floor: 0,
    ceil: 450
  }
};
```

If you don't want to bother with an object set in your javascript file, you can pass an anonymous object literal to the slider options:
```html
<div>
    <rzslider
         rz-slider-model="value"
         rz-slider-options="{floor: 0, ceil: 450}"></rzslider>
</div>
```
```js
$scope.value = 150;
```

### Range slider

```javascript
// In your controller
$scope.slider = {
  min: 100,
  max: 180,
  options: {
    floor: 0,
    ceil: 450
  }
};
```

```html
<rzslider
    rz-slider-model="slider.min"
    rz-slider-high="slider.max"
    rz-slider-options="slider.options"></rzslider>
```

## Directive attributes

**rz-slider-model**

> Model for low value slider. If only _rz-slider-model_ is provided single slider will be rendered.

**rz-slider-high**

> Model for high value slider. Providing both _rz-slider-model_ and _rz-slider-high_ will render range slider.

**rz-slider-options**

> An object with all the other options of the slider. Each option can be updated at runtime and the slider will automatically be re-rendered.

The default options are:
```js
{
    floor: 0,
    ceil: null, //defaults to rz-slider-model
    step: 1,
    precision: 0,
    translate: null,
    id: null,
    stepsArray: null,
    draggableRange: false,
    showSelectionBar: false,
    hideLimitLabels: false,
    readOnly: false,
    disabled: false,
    interval: 350,
    showTicks: false,
    showTicksValues: false,
    vertical: false,
    scale: 1,
    onStart: null,
    onChange: null,
    onEnd: null
}
````

**floor** - _Number (defaults to 0)_: Minimum value for a slider.

**ceil** - _Number (defaults to `rz-slider-model`value)_: Maximum value for a slider.

**step** - _Number (defaults to 1)_: Step between each value.

**precision** - _Number (defaults to 0)_: The precision to display values with. The `toFixed()` is used internally for this.

**translate** - _Function(value, sliderId)_: Custom translate function. Use this if you want to translate values displayed on the slider. For example if you want to display dollar amounts instead of just numbers:
```html
<div>
    <rzslider
         rz-slider-model="slider.value"
         rz-slider-options="slider.options"></rzslider>
</div>
```
```js
$scope.slider = {
  value: 0,
  options: {
    floor: 0,
    ceil: 100,
    translate: function(value) {
      return '$' + value;
    }
  }
};
```

**id** - _Any (defaults to null)_: If you want to use the same `translate` function for several sliders, just set the `id` to anything you want, and it will be passed to the `translate(value, sliderId)` function as a second argument.

**stepsArray** - _Array_: If you want to display a slider with non linear/number steps. Just pass an array with each slider value and that's it; the floor, ceil and step settings of the slider will be computed automatically. The `rz-slider-model` value will be the index of the selected item in the stepsArray.

**draggableRange** - _Boolean (defaults to false)_: When set to true and using a range slider, the range can be dragged by the selection bar. _This doesn't work when ticks are shown._

**showSelectionBar** - _Boolean (defaults to false)_: Set to true to always show the selection bar.

**hideLimitLabels** - _Boolean (defaults to false)_: Set to true to hide min / max labels

**readOnly** - _Boolean (defaults to false)_: Set to true to make the slider read-only.

**disabled** - _Boolean (defaults to false)_: Set to true to disable the slider.

**interval** - _Number in ms (defaults to 350)_: Internally, a `throttle` function (See http://underscorejs.org/#throttle) is used when the model or high values of the slider are changed from outside the slider. This is to prevent from re-rendering the slider too many times in a row. `interval` is the number of milliseconds to wait between two updates of the slider.

**showTicks** - _Boolean (defaults to false)_: Set to true to display a tick for each step of the slider.

**showTicksValues** - _Boolean (defaults to false)_: Set to true to display a tick and  the step value for each step of the slider.

**ticksValuesTooltip** - _Function(value) (defaults to null)_: (requires angular-ui bootstrap) Used to display a tooltip when a tick value is hovered. Set to a function that returns the tooltip content for a given value.

**scale** - _Number (defaults to 1)_: If you display the slider in an element that uses `transform: scale(0.5)`, set the `scale` value to 2 so that the slider is rendered properly and the events are handled correctly.

**onStart** - _Function(sliderId)_: Function to be called when a slider update is started. If an id was set in the options, then it's passed to this callback.

**onChange** - _Function(sliderId)_: Function to be called when rz-slider-model or rz-slider-high change. If an id was set in the options, then it's passed to this callback.

**onEnd** - _Function(sliderId)_: Function to be called when a slider update is ended. If an id was set in the options, then it's passed to this callback.

**vertical** - _Boolean (defaults to false)_: Set to true to display the slider vertically. The slider will take the full height of its parent.
_Changing this value at runtime is not currently supported._

## Change default options
If you want the change the default options for all the sliders displayed in your application, you can set them using the `RzSliderOptions.options()` method:
```js
angular.module('App', ['rzModule'])
	.run(function( RzSliderOptions ) {
		// show ticks for all sliders
		RzSliderOptions.options( { showTicks: true } );
	});
```

## Slider events

To force slider to recalculate dimensions, broadcast **reCalcViewDimensions** event from parent scope. This is useful for example when you use slider inside a widget where the content is hidden at start - see the "Sliders into modal" example [on the demo site](http://rzajac.github.io/angularjs-slider/).

You can also force redraw with **rzSliderForceRender** event.

At the end of each "slide" slider emits `slideEnded` event.

```javascript
$scope.$on("slideEnded", function() {
     // user finished sliding a handle
});
```

## Project integration

```html
    <link rel="stylesheet" type="text/css" href="/path/to/slider/rzslider.css"/>
    <script src="/path/to/angularjs/angular.min.js"></script>
    <script src="/path/to/slider/rzslider.min.js"></script>

    <script>
        var YourApp = angular.module('myapp', ['rzModule']);
    </script>
```

## Browser support

I use Slider on couple of my projects and it's being tested on desktop versions of Chrome, Firefox, Safari, IE 9/10 (Ticks are displayed using flex display so they don't work on IE9).
Slider is also tested on Android and iPhone using all browsers available on those platforms.

## Disclaimer

This project is based on [https://github.com/prajwalkman/angular-slider](https://github.com/prajwalkman/angular-slider). It has been rewritten from scratch in JavaScript (the original source was written in CoffeeScript).

## License

Licensed under the MIT license
