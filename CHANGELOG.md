- Allow more steps than ticks. Assign number to rzSliderShowTick

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
