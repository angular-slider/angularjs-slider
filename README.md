## AngularJS slider directive with no external dependencies

> Improvements over v1.1.0 for back compatibility

Slider directive implementation for AngularJS, without any dependencies.

- Mobile friendly
- Fast
- Well documented
- Customizable
- Simple to use
- Compatibility with jQuery Lite, ie. with full jQuery ( Thanks Jusas! https://github.com/Jusas)

## Examples

- **Various examples:** [http://rzajac.github.io/angularjs-slider/](http://rzajac.github.io/angularjs-slider/index.html)
- **Slider inside Angular UI tabs:** http://jsfiddle.net/7w755fLv/

## Reporting issues
Make sure the report is accompanied by a reproducible demo. The ideal demo is created by forking [our standard jsFiddle](http://jsfiddle.net/1ruqgnhk/), adding your own code and stripping it down to an absolute minimum needed to demonstrate the bug.

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
### Build
```
npm run build
```

### Module
```javascript
angular.module('', ['rzModule']);
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

Above example would render a slider from 0 to 150. If you need floor and ceiling values use `rz-slider-floor` and `rz-slider-ceil` attributes.

```html
<div>
    <rzslider
         rz-slider-model="priceSlider"
         rz-slider-ceil="450"></rzslider>

    <!-- OR -->

    <rzslider
         rz-slider-model="priceSlider"
         rz-slider-floor="0"
         rz-slider-ceil="450"></rzslider>

</div>
```

### Range slider

```javascript
// In your controller
$scope.priceSlider = {
    min: 100,
    max: 180,
    ceil: 500,
    floor: 0
};
```

```html
<rzslider
    rz-slider-floor="priceSlider.floor"
    rz-slider-ceil="priceSlider.ceil"
    rz-slider-model="priceSlider.min"
    rz-slider-high="priceSlider.max"></rzslider>
```

## Directive attributes

**rz-slider-model**

> Model for low value slider. If only _rz-slider-model_ is provided single slider will be rendered.

**rz-slider-high**

> Model for high value slider. Providing both _rz-slider-high_ and _rz-slider-model_ will render range slider.

**rz-slider-floor**

> Minimum value for a slider.

**rz-slider-ceil**

> Maximum value for a slider.

**rz-slider-step**

> slider step.

**rz-slider-precision**

> The precision to display values with. The `toFixed()` is used internally for this.

**rz-slider-hide-limit-labels**

> Set to true to hide min / max labels

**rz-slider-always-show-bar**

> Set to true to always show selection bar

**rz-slider-present-only**

> When set to true slider is used in presentation mode. No handle dragging. 

**rz-slider-draggable-range**

> When set to true and using a range slider, the range can be dragged by the selection bar.

**rz-slider-translate**

> Custom translate function. Use this if you want to translate values displayed on the slider. For example if you want to display dollar amounts instead of just numbers do this:

**rz-slider-on-start**

> Function to be called when a slider update is started.

**rz-slider-on-change**

> Function to be called when rz-slider-model or rz-slider-high change.

**rz-slider-on-end**

> Function to be called when a slider update is ended.

**rz-slider-show-ticks**

> Display a tick for each value.

**rz-slider-show-ticks-value**

> Display a tick for each value and the value of the tick.

**rz-slider-disabled**

> Disable the slider (apply a special style and unbind events)

**rz-slider-interval**

> The interval (in ms) at which the slider DOM element updates when rz-slider-model or rz-slider-high change from outside the slider. Defaults to 350.

```javascript
// In your controller

$scope.priceSlider = {
    min: 100,
    max: 180,
    ceil: 500,
    floor: 0
};

$scope.translate = function(value)
{
    return '$' + value;
}

$scope.onSliderChange = function()
{
    console.log('changed', $scope.priceSlider);
}
```

```html
<rzslider
    rz-slider-floor="priceSlider.floor"
    rz-slider-ceil="priceSlider.ceil"
    rz-slider-model="priceSlider.min"
    rz-slider-high="priceSlider.max"
    rz-slider-translate="translate"
    rz-slider-on-change="onSliderChange()"
    rz-slider-show-ticks="true"></rzslider>
```

## Slider events

To force slider to recalculate dimensions broadcast **reCalcViewDimensions** event from parent scope. This is useful for example when you use slider inside a widget where the content is hidden at start - see the "Sliders into modal" example [on the demo site](http://rzajac.github.io/angularjs-slider/).

You can also force redraw with **rzSliderForceRender** event.

At the end of each "slide" slider emits `slideEnded` event. 

```javascript
$scope.$on("slideEnded", function() {
     // user finished sliding a handle 
});
```

## Project integration

```html
    <script src="/path/to/angularjs/angular.min.js"></script>
    <script src="/path/to/slider/rzslider.min.js"></script>

    <script>
        var YourApp = angular.module('myapp', ['rzModule']);
    </script>
```

## Browser support

I use Slider on couple of my projects and it's being tested on desktop versions of Chrome, Firefox, Safari, IE 9/10.
Slider is also tested on Android and iPhone using all browsers available on those platforms.

## Disclaimer

This project is based on [https://github.com/prajwalkman/angular-slider](https://github.com/prajwalkman/angular-slider). It has been rewritten from scratch in JavaScript
 (the original source was written in CoffeeScript).

## License

Licensed under the MIT license
