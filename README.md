## AngularJS slider directive with no external dependencies

Slider directive implementation for AngularJS, without any dependencies.

- Mobile friendly
- Fast
- Well documented
- Customizable
- Simple to use

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

## Plunker example

[http://embed.plnkr.co/EqGIlU/preview](http://embed.plnkr.co/EqGIlU/preview)

## Project integration

```html
    <script src="/path/to/angularjs/angular.min.js"></script>
    <script src="/path/to/slider/rzslider.min.js"></script>

    <script>
        var YourApp = angular.module('myapp', ['rzModule']);
    </script>
```

## Changelog

**v0.0.1**

    Original rewrite to JavaScript

**v0.1.0**

    Bug fixes
    Performance improvements
    Reduce number of angular bindings
    Reduce number of function calls in event handlers
    Avoid recalculate style
    Hit 60fps
    LESS variables for easier slider color customization

## Disclaimer

This project is based on [https://github.com/prajwalkman/angular-slider](https://github.com/prajwalkman/angular-slider). It has been rewritten from scratch in JavaScript
 (the original source was written in CoffeeScript).

## License

Licensed under the MIT license
