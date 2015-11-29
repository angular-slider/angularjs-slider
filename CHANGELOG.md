# 2.1.0 (2015-11-29)
## Features
- Add a `vertical` options to display vertical sliders (#185).
- Pass the options.id to the onStart, onChange and onEnd callbacks (#182).
- Force labels to stay contained within element containing slider (#175).

## Bug fixes
- add vendor-prefix to `display: flex` used by ticks (#160).

# 2.0.0 (2015-11-12)
## Breaking changes
- All attributes except `rzSliderModel` and `rzSliderHigh` are moved to `rzSliderOptions`. (See the new documentation in ReadMe)

## Features
- Add a `rzSliderOptions` attribute to pass options to the slider.
- Add a `RzSliderOptions.options()` method to set global options.
- Add a `scale` option to fix sliders displayed in an element that uses `transform: scale(0.5)`.
- Add a `stepsArray` option (#163)
- Add an `id` option that is passed to the translate function as second arg (#161)
- Add a `ticksValuesTooltip` option that is used to display a tooltip on the ticks values (requires angular-ui bootstrap).

# 1.1.0 (2015-11-07)
## Features
- Configurable update interval (#153)

## Bug fixes
- Update floor label so that it hides correctly when using single slider. (#155)
- Fix ticks values when step is a float.
- Remove the delta checking in updateLowHandle because it leads to hard-to-debug bugs.

# 1.0.0 (2015-10-13)
- Rename the NPM package from jusas-angularjs-slider to angularjs-slider because jusas was added by mistake during a PR.- Start to use semantic versioning.

# 0.1.36 (2015-10-12)

## Features

* Separate the LESS variables from the main file to ease versioning of local customisations.


# 0.1.35 (2015-10-08)

## Features

* Add enabled/disabled option for slider: `rz-slider-disabled="boolean"`


# 0.1.34 (2015-10-03)

## Features

* Support ticks for range sliders and slider with always visible bars.


# 0.1.33 (2015-10-02)

## Features

* Add a `rzSliderShowTicks` to show a tick on each step.
* Add a `rzSliderShowTicksValue ` to show a tick and its value on each step.
