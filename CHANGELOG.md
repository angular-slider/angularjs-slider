# 6.2.3 (2017-07-08)
## Tooling
- Add Typescript definition file.

# 6.2.2 (2017-05-16)
## Fixes
- Fix (again) onEnd event de-registration.

# 6.2.1 (2017-05-15)
## Fixes
- Fix onEnd event being sent several times on non-mobiles devices (#536)

# 6.2.0 (2017-05-25)
## New Feature
- Handle multi touch events on separate sliders (#535). Thanks @daniela-mateescu :)

# 6.1.2 (2017-05-15)
## Fixes
- Fix ticks and values at intermediate positions on IE (#531)

# 6.1.1 (2017-03-29)
## Fixes
- Add vendor prefixes for transform property in JS code (#518)

# 6.1.0 (2017-03-06)
## Features
- Add labelling options for a11y (#505)

# 6.0.2 (2017-03-02)
## Fixes
- Update the combined labels on separation (#502)

# 6.0.1 (2017-02-14)
## Fixes
- Ensure model value is current when custom translate function runs for tick values

# 6.0.0 (2017-01-02)
## Refactoring
- Refactor/simplify the css rules to ease the customisation.

**You might want to check that all your custom styles are still correctly applied...**

# 5.9.0 (2016-12-12)
## Features
- Add selectionBarGradient option to customize the selection bar (#473)

# 5.8.9 (2016-12-11)
## Improvement
- Add autoprefixer for CSS builds (#472)

# 5.8.8 (2016-12-11)
## Fix
- Prevent angular being loaded twice when using with browserify (#474)

# 5.8.7 (2016-11-09)
## Fix
- Add Math.round for positions and dimensions - thanks to @DmitryKrekota (#454)

# 5.8.6 (2016-11-08)
## Fix
- Apply the pushRange with maxRange - thanks to @GuilloOme (#456)

# 5.8.5 (2016-11-05)
## Fix
- Fix overlapping max and ceil labels in some cases (#396)

# 5.8.4 (2016-11-05)
## Improvement
- Refactor autoHiding algorithm for labels (fix #446)

# 5.8.3 (2016-11-03)
## Improvement
- Generate a SCSS file (simple copy of the css file) in the dist folder so it can be imported (#449)

# 5.8.2 (2016-11-03)
## Fix
- Fix ceil label positioning (#448)

# 5.8.1 (2016-10-27)
## Fix
- Enable using with Browserify (#436)

# 5.8.0 (2016-10-22)
## Features
- Handle Date object in stepsArray (#424 )

## Fixes
- Fix style for disabled range slider and ticks (#394)
- Fix slider goes back when moved and scaled (#346)

# 5.7.0 (2016-10-16)
## Features
- Add a `logScale` option to display the slider using a logarithmic scale (#280).
- Add `customValueToPosition` and `customPositionToValue` options to display the slider using a custom scale (#280).

# 5.6.0 (2016-10-16)
## Features
- Add a `ticksArray` option to display ticks at specific positions (#426).

To enable this new feature, the way the ticks are rendered has been changed. Now each tick is positioned absolutely using a `transform: translate()` instruction.

# 5.5.1 (2016-09-22)
## Fix
- Prevent losing focus when slider is rerendered (#415).

# 5.5.0 (2016-09-06)
## Features
- Add an `autoHideLimitLabels` to disable the auto-hiding of limit labels (#405).

# 5.4.3 (2016-08-07)
## Fix
- Fix minLimit/maxLimit bugged for draggableRange (#384).

# 5.4.2 (2016-08-02)
## Fix
- Fix minimum value goes below floor when using maxRange (#377).

# 5.4.1 (2016-07-17)
## Fix
- Fix showing limit labels when pointer labels are always hidden (#373).

# 5.4.0 (2016-07-13)
## Features
- Add function to customize color of ticks (#372).

# 5.3.0 (2016-07-11)
## Features
- Expose labels on scope in template (#358).

# 5.2.0 (2016-07-07)
## Features
- Add a `customTemplateScope` option (#354).

# 5.1.1 (2016-07-06)
## Fix
- Fix the way to check when event properties are undefined (#365).

# 5.1.0 (2016-07-02)
## Features
- Add a `pushRange` option (#341).

# 5.0.1 (2016-07-01)
## Fix
- Switch from using opacity to visibility to show/hide elements (#362).

# 5.0.0 (2016-06-30)
## Fix
- AMD/CommonJS exported module: export module name instead of module (#360).

## Breaking change
Code that relies on the module object to be exported (accessing the name via .name for example) will break, since the name is now directly returned.

# 4.1.0 (2016-06-30)
## Improvement
- Add a `bindIndexForStepsArray` option that enable to use `stepsArray` with the same behavior as before 4.0 (#345).

## Fix
- Hide floor/ceil label when overlapped on combo label (#357).
- Fix switching from steps array to regular steps (#361).

# 4.0.2 (2016-06-07)
## Improvement
- Add a `mergeRangeLabelsIfSame` option (#245).

# 4.0.1 (2016-06-04)
## Improvement
- Add a pointerType arg for the callbacks (onStart, onChange and onEnd) to identify which handle is used (#339).

# 4.0.0 (2016-06-04)
## Improvement
- `stepsArray`: Bind rzSliderModel and rzSliderHigh to the actual value (#335).

## Breaking changes
- From now on, when using the `stepsArray` feature, you should directly provide the actual value to rzSliderModel and rzSliderHigh instead of passing the index of this value.
Thus, you need to update your config like in the following example:
```js
/* before 4.0 version */
vm.slider = {
    value: 4, // index of the 'E' value in the array
    options: {
        stepsArray: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    }
}

/* from 4.0 version */
vm.slider = {
    value: 'E',
    options: {
        stepsArray: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    }
}
```

# 3.0.0 (2016-06-02)
## Features
- Add IE8 support (#314).
- Consolidate onStart, onChange and onEnd for keyboard (#319).
- Added `rz-floor` and `rz-ceil` classes to floor and ceil label to allow styling (#337).

## Breaking changes
- From now on, to allow the IE8 support, the directive is configured with `replace: true`. Thus, you need to update your custom CSS rules like in the following example:
```css
/* before 3.0 version */
rzslider {
  color: red;
}

/* from 3.0 version */
.rzslider {
  color: red;
}
```

# 2.14.0 (2016-05-22)
## Features
- Add `minLimit` and `maxLimit` options (#332).
- Add a `maxRange` option (#333).
- Add `boundPointerLabels` option (#323).

# 2.13.0 (2016-04-24)
## Features
- Add a `getLegend` option  (#318).
- Handle objects in `stepsArray` that can contain `value` and `legend` properties.

# 2.12.0 (2016-04-22)
## Features
- Accept numbers for showTicks/showTicksValues to display ticks at intermediate positions (#264).

# 2.11.0 (2016-04-01)
## Features
- Add a hidePointerLabels option (#273).

## Fix
- Position long labels on vertical sliders correctly (#306).

# 2.10.4 (2016-03-16)
## Fix
- Fix the floor limit when floor is different than 0 (#293).

# 2.10.3 (2016-03-14)
## Fix
- Prefix all CSS classes with rz- to prevent conflicts (#292).

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
