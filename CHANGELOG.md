# 2.10.3 (2016-03-14)
## Fix
- Prefix all CSS classes with rz- to prevent conflicts.

# 2.10.2 (2016-03-01)
## Bug fixes
- Remove the dist folder from gitignore.

# 2.10.1 (2016-03-01)
## Bug fixes
- Republish the npm module since dist files were missing.

# 2.10.0 (2016-02-29)
## Features
- Added `rightToLeft` option for RTL support (#270). Thanks @Liam-Ryan :).

# 2.9.0 (2016-02-18)
## Features
- Change `rzSliderOptions` to use expression binding (#266).

# 2.8.0 (2016-02-08)
## Features
- Add a `getPointerColor` option to dynamically change the pointers color (#253).

# 2.7.1 (2016-02-06)
## Fix
- Fix high label positioning when size is different than the ceil one.

# 2.7.0 (2016-02-06)
## Features
- Add an `enforceStep` option (defaults to true) (#246).
- Add a `showSelectionBarFromValue` options (#250).
- Use jqLite html() method to display label values so the translate function can return formated content (#251).
- Pass a label string as third arg to the `translate` function to differentiate the labels (#252).

## Fix
- Improve combined label position and show only one value if min==max (#245).

# 2.6.0 (2016-01-31)
## Features
- Add a `noSwitching` option to prevent the user from switching the min and max handles (#233).

## Bug fixes
- Refactor the internal `roundStep` function that was too strict (5d130f09d).

# 2.5.0 (2016-01-24)
## Features
- Add a `minRange` option to set a minimal range (#231).
- Pass the slider values to the `onStart`, `onChange` and `onEnd` callbacks.
- Rollback and improve the callback changes brought with 2.4.1 that were no applying the last update to the scope anymore.

# 2.4.1 (2016-01-15)
## Performance improvements
- Remove the $timeout call in the init method (#223).
- Remove the $timeout call in the onStart callback.
- Remove the $timeout call in the onChange callback (#229).

# 2.4.0 (2015-12-30)
## Features
- Add an `enforceRange` options to round the `rzSliderModel` and `rzSliderHigh` to the slider range even when modified from outside the slider.(#208).
- Add a `ticksTooltip` option used to display a tooltip when a tick is hovered (#209).
- Add an `onlyBindHandles` option to only bind events on slider handles (#212).
- Add a `showSelectionBarEnd` option to display the selection bar after the value (#214).

## Bug fixes
- Fix reset of maxH element (#204).
- Change the watchers order to prevent unwanted model modifications (#207).

# 2.3.0 (2015-12-22)
## Features
- Add keyboard support (activated by default with `keyboardSupport` set to true) (#191).
- Add a `draggableRangeOnly` options (#203).

# 2.2.0 (2015-12-17)
## Features
- Add a `getSelectionBarColor` option to dynamically change the selection bar color (#197).

## Bug fixes
- Fix negative float values rendering (#190).

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
