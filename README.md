## AngularJS slider directive with no external dependencies

Slider directive implementation for AngularJS, without any dependencies.

- Mobile friendly
- Fast
- Well documented
- Customizable
- Simple to use
- Compatibility with jQuery Lite, ie. with full jQuery ( Thanks Jusas! https://github.com/Jusas)

## Examples

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

**rz-slider-progressive-step**

> Step will be calculated automatically `step` will be taken as a minimal step value.

**rz-slider-precision**

> The precision to display values with. The `toFixed()` is used internally for this.

**rz-slider-translate**

> Custom translate function. Use this if you want to translate values displayed on the slider. For example if you want to display dollar amounts instead of just numbers do this:

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
```

```html
<rzslider
    rz-slider-floor="priceSlider.floor"
    rz-slider-ceil="priceSlider.ceil"
    rz-slider-model="priceSlider.min"
    rz-slider-high="priceSlider.max"
    rz-slider-translate="translate"></rzslider>
```

## Slider events

To force slider to recalculate dimensions broadcast **reCalcViewDimensions** event from parent scope. This is useful for example when you use slider with tabs - see *demo/tabs.html* example.

You can also force redraw with **rzSliderForceRender** event.


## Plunker example

[http://embed.plnkr.co/53AUdB/preview](http://embed.plnkr.co/53AUdB/preview)

## Project integration

```html
    <script src="/path/to/angularjs/angular.min.js"></script>
    <script src="/path/to/slider/rzslider.min.js"></script>

    <script>
        var YourApp = angular.module('myapp', ['rzModule']);
    </script>
```

## Changelog

**v0.1.3**

    Forked from this version.

**v0.1.4**

    Touch events were broken if jQuery was used with Angular instead of jQuery lite. This version fixes them (Jusas).

**v0.1.5**

    Added 'slideEnded' event emitted on slider knob dragging ended (Jusas).

## Disclaimer

This project is based on [https://github.com/prajwalkman/angular-slider](https://github.com/prajwalkman/angular-slider). It has been rewritten from scratch in JavaScript
 (the original source was written in CoffeeScript).

## License

Licensed under the MIT license
