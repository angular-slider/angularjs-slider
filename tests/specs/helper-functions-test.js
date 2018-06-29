;(function() {
  'use strict'

  describe('Helper functions - ', function() {
    var helper, RzSliderOptions, $rootScope, $timeout

    beforeEach(module('test-helper'))

    beforeEach(inject(function(
      TestHelper,
      _RzSliderOptions_,
      _$rootScope_,
      _$timeout_
    ) {
      helper = TestHelper
      RzSliderOptions = _RzSliderOptions_
      $rootScope = _$rootScope_
      $timeout = _$timeout_
    }))

    afterEach(function() {
      helper.clean()
    })

    describe('tests with same config', function() {
      beforeEach(function() {
        var sliderConf = {
          value: 50,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
          },
        }
        helper.createSlider(sliderConf)
      })

      it('should have a valid roundStep for integer values when floor is 0', function() {
        expect(helper.slider.roundStep(10)).to.equal(10)
        expect(helper.slider.roundStep(9)).to.equal(10)
        expect(helper.slider.roundStep(11)).to.equal(10)
        expect(helper.slider.roundStep(15)).to.equal(20)
        expect(helper.slider.roundStep(14)).to.equal(10)
        expect(helper.slider.roundStep(-10)).to.equal(-10)
        expect(helper.slider.roundStep(-9)).to.equal(-10)
        expect(helper.slider.roundStep(-11)).to.equal(-10)
        expect(helper.slider.roundStep(-16)).to.equal(-20)
        expect(helper.slider.roundStep(-15)).to.equal(-10)
        expect(helper.slider.roundStep(-14)).to.equal(-10)
      })

      it('should have a valid roundStep for integer values when floor is above 0', function() {
        helper.scope.slider.options.floor = 3
        helper.scope.slider.options.ceil = 103
        helper.scope.$digest()

        expect(helper.slider.roundStep(3)).to.equal(3)
        expect(helper.slider.roundStep(13)).to.equal(13)
        expect(helper.slider.roundStep(12)).to.equal(13)
        expect(helper.slider.roundStep(14)).to.equal(13)
        expect(helper.slider.roundStep(18)).to.equal(23)
        expect(helper.slider.roundStep(17)).to.equal(13)
      })

      it('should have a valid roundStep for integer values when floor is below 0', function() {
        helper.scope.slider.options.floor = -25
        helper.scope.$digest()

        expect(helper.slider.roundStep(-5)).to.equal(-5)
        expect(helper.slider.roundStep(-15)).to.equal(-15)
        expect(helper.slider.roundStep(-16)).to.equal(-15)
        expect(helper.slider.roundStep(-14)).to.equal(-15)
        expect(helper.slider.roundStep(-21)).to.equal(-25)
        expect(helper.slider.roundStep(-20)).to.equal(-15)
        expect(helper.slider.roundStep(-19)).to.equal(-15)
      })

      it('should have a valid roundStep for floating values when floor is 0', function() {
        helper.scope.slider.options.precision = 1
        helper.scope.slider.options.step = 0.1
        helper.scope.$digest()

        expect(helper.slider.roundStep(10)).to.equal(10)
        expect(helper.slider.roundStep(1.1)).to.equal(1.1)
        expect(helper.slider.roundStep(1.09)).to.equal(1.1)
        expect(helper.slider.roundStep(1.11)).to.equal(1.1)
        expect(helper.slider.roundStep(1.15)).to.equal(1.2)
        expect(helper.slider.roundStep(1.14)).to.equal(1.1)

        expect(helper.slider.roundStep(-10)).to.equal(-10)
        expect(helper.slider.roundStep(-1.1)).to.equal(-1.1)
        expect(helper.slider.roundStep(-1.09)).to.equal(-1.1)
        expect(helper.slider.roundStep(-1.11)).to.equal(-1.1)
        expect(helper.slider.roundStep(-1.16)).to.equal(-1.2)
        expect(helper.slider.roundStep(-1.15)).to.equal(-1.1)
        expect(helper.slider.roundStep(-1.14)).to.equal(-1.1)
      })

      it('should have a valid roundStep for floating values when floor is above 0', function() {
        helper.scope.slider.options.floor = 3
        helper.scope.slider.options.ceil = 103
        helper.scope.slider.options.precision = 1
        helper.scope.slider.options.step = 0.1
        helper.scope.$digest()

        expect(helper.slider.roundStep(3)).to.equal(3)
        expect(helper.slider.roundStep(13)).to.equal(13)
        expect(helper.slider.roundStep(1.1)).to.equal(1.1)
        expect(helper.slider.roundStep(1.09)).to.equal(1.1)
        expect(helper.slider.roundStep(1.11)).to.equal(1.1)
        expect(helper.slider.roundStep(1.15)).to.equal(1.2)
        expect(helper.slider.roundStep(1.14)).to.equal(1.1)
      })

      it('should have a valid roundStep for floating values when floor is below 0', function() {
        helper.scope.slider.options.floor = -25
        helper.scope.slider.options.ceil = 75
        helper.scope.slider.options.precision = 1
        helper.scope.slider.options.step = 0.1
        helper.scope.$digest()

        expect(helper.slider.roundStep(-25)).to.equal(-25)
        expect(helper.slider.roundStep(-5)).to.equal(-5)
        expect(helper.slider.roundStep(-1.1)).to.equal(-1.1)
        expect(helper.slider.roundStep(-1.09)).to.equal(-1.1)
        expect(helper.slider.roundStep(-1.11)).to.equal(-1.1)
        expect(helper.slider.roundStep(-1.16)).to.equal(-1.2)
        expect(helper.slider.roundStep(-1.15)).to.equal(-1.1)
        expect(helper.slider.roundStep(-1.14)).to.equal(-1.1)
      })

      it('should have a valid hideEl', function() {
        var el = angular.element('<div></div>')
        helper.slider.hideEl(el)
        expect(el.css('visibility')).to.equal('hidden')
      })

      it('should have a valid showEl when not rzAlwaysHide', function() {
        var el = angular.element('<div></div>')
        helper.slider.showEl(el)
        expect(el.css('visibility')).to.equal('visible')
      })

      it('should have a valid showEl when rzAlwaysHide', function() {
        var el = angular.element('<div></div>')
        el.css('visibility', 'hidden')
        el.rzAlwaysHide = true

        helper.slider.showEl(el)
        expect(el.css('visibility')).to.equal('hidden')
      })

      it('should have a valid setPosition for horizontal sliders', function() {
        var el = angular.element('<div></div>')
        helper.slider.setPosition(el, 12)
        expect(el.css('left')).to.equal('12px')
      })

      it('should have a valid setPosition for vertical sliders', function() {
        helper.scope.slider.options.vertical = true
        helper.scope.$digest()
        var el = angular.element('<div></div>')
        helper.slider.setPosition(el, 12)
        expect(el.css('bottom')).to.equal('12px')
      })

      it('should have a valid getDimension for horizontal sliders', function() {
        expect(helper.slider.getDimension(helper.slider.sliderElem)).to.equal(
          1000
        )
      })

      it('should have a valid getDimension for horizontal sliders with custom scale', function() {
        helper.scope.slider.options.scale = 2
        helper.scope.$digest()
        expect(helper.slider.getDimension(helper.slider.sliderElem)).to.equal(
          2000
        )
      })

      it('should have a valid getDimension for vertical sliders', function() {
        helper.scope.slider.options.vertical = true
        helper.scope.$digest()
        expect(helper.slider.getDimension(helper.slider.sliderElem)).to.equal(
          1000
        )
      })

      it('should have a valid getDimension for vertical sliders with custom scale', function() {
        helper.scope.slider.options.scale = 2
        helper.scope.slider.options.vertical = true
        helper.scope.$digest()
        expect(helper.slider.getDimension(helper.slider.sliderElem)).to.equal(
          2000
        )
      })

      it('should have a valid setDimension for horizontal sliders', function() {
        var el = angular.element('<div></div>')
        helper.slider.setDimension(el, 12)
        expect(el.css('width')).to.equal('12px')
      })

      it('should have a valid setDimension for vertical sliders', function() {
        helper.scope.slider.options.vertical = true
        helper.scope.$digest()
        var el = angular.element('<div></div>')
        helper.slider.setDimension(el, 12)
        expect(el.css('height')).to.equal('12px')
      })

      it('should have a valid valueToPosition for positive sliders', function() {
        helper.slider.maxPos = 1000
        expect(helper.slider.valueToPosition(0)).to.equal(0)
        expect(helper.slider.valueToPosition(50)).to.equal(500)
        expect(helper.slider.valueToPosition(100)).to.equal(1000)
      })

      it('should have a valid valueToPosition for negative sliders', function() {
        helper.scope.slider.options.floor = -100
        helper.scope.slider.options.ceil = 0
        helper.scope.slider.value = -50
        helper.scope.$digest()

        helper.slider.maxPos = 1000
        expect(helper.slider.valueToPosition(0)).to.equal(1000)
        expect(helper.slider.valueToPosition(-50)).to.equal(500)
        expect(helper.slider.valueToPosition(-100)).to.equal(0)
      })

      it('should have a valid sanitizeValue', function() {
        expect(helper.slider.sanitizeValue(0)).to.equal(0)
        expect(helper.slider.sanitizeValue(50)).to.equal(50)
        expect(helper.slider.sanitizeValue(100)).to.equal(100)
        expect(helper.slider.sanitizeValue(-1)).to.equal(0)
        expect(helper.slider.sanitizeValue(-10)).to.equal(0)
        expect(helper.slider.sanitizeValue(101)).to.equal(100)
        expect(helper.slider.sanitizeValue(110)).to.equal(100)
      })

      it('should have a valid positionToValue for positive sliders', function() {
        helper.slider.maxPos = 1000
        expect(helper.slider.positionToValue(0)).to.equal(0)
        expect(helper.slider.positionToValue(1000)).to.equal(100)
        expect(helper.slider.positionToValue(500)).to.equal(50)
      })

      it('should have a valid positionToValue for for negative sliders', function() {
        helper.scope.slider.options.floor = -100
        helper.scope.slider.options.ceil = 0
        helper.scope.slider.value = -50
        helper.scope.$digest()
        helper.slider.maxPos = 1000

        expect(helper.slider.positionToValue(0)).to.equal(-100)
        expect(helper.slider.positionToValue(1000)).to.equal(0)
        expect(helper.slider.positionToValue(500)).to.equal(-50)
      })

      it('should have a valid getEventXY for horizontal sliders on desktop browsers', function() {
        var event = {
          clientX: 12,
        }
        expect(helper.slider.getEventXY(event)).to.equal(12)
      })

      it('should have a valid getEventXY for vertical sliders on desktop browsers', function() {
        helper.scope.slider.options.vertical = true
        helper.scope.$digest()
        var event = {
          clientY: 12,
        }
        expect(helper.slider.getEventXY(event)).to.equal(12)
      })

      it('should have a valid getEventXY for horizontal sliders on mobile browsers with no originalEvent', function() {
        var event = {
          touches: [
            {
              clientX: 12,
            },
          ],
        }
        expect(helper.slider.getEventXY(event)).to.equal(12)
      })

      it('should have a valid getEventXY for horizontal sliders on mobile browsers with originalEvent', function() {
        var event = {
          originalEvent: {
            touches: [
              {
                clientX: 12,
              },
            ],
          },
        }
        expect(helper.slider.getEventXY(event)).to.equal(12)
      })

      it('should have a valid getEventXY for vertical sliders on mobile browsers with no originalEvent', function() {
        helper.scope.slider.options.vertical = true
        helper.scope.$digest()
        var event = {
          touches: [
            {
              clientY: 12,
            },
          ],
        }
        expect(helper.slider.getEventXY(event)).to.equal(12)
      })

      it('should have a valid getEventXY for vertical sliders on mobile browsers with originalEvent', function() {
        helper.scope.slider.options.vertical = true
        helper.scope.$digest()
        var event = {
          originalEvent: {
            touches: [
              {
                clientY: 12,
              },
            ],
          },
        }
        expect(helper.slider.getEventXY(event)).to.equal(12)
      })

      it('should have a valid getEventPosition for horizontal sliders', function() {
        sinon.stub(helper.slider, 'getEventXY').returns(46)
        var event = {}

        //fake slider's dimension
        helper.slider.sliderElem.rzsp = 10
        helper.slider.handleHalfDim = 16

        expect(helper.slider.getEventPosition(event)).to.equal(20)
      })

      it('should have a valid getEventPosition for vertical sliders', function() {
        helper.scope.slider.options.vertical = true
        helper.scope.$digest()
        sinon.stub(helper.slider, 'getEventXY').returns(46)
        var event = {}

        //fake slider's dimension
        helper.slider.sliderElem.rzsp = 10
        helper.slider.handleHalfDim = 16

        expect(helper.slider.getEventPosition(event)).to.equal(-52)
      })

      it('should have a valid getEventPosition for horizontal sliders with scale option', function() {
        helper.scope.slider.options.scale = 0.5
        helper.scope.$digest()
        sinon.stub(helper.slider, 'getEventXY').returns(46)
        var event = {}

        //fake slider's dimension
        helper.slider.sliderElem.rzsp = 10
        helper.slider.handleHalfDim = 16

        expect(helper.slider.getEventPosition(event)).to.equal(2)
      })

      it('should have a valid getEventPosition for vertical sliders with scale option', function() {
        helper.scope.slider.options.scale = 0.5
        helper.scope.slider.options.vertical = true
        helper.scope.$digest()
        sinon.stub(helper.slider, 'getEventXY').returns(46)
        var event = {}

        //fake slider's dimension
        helper.slider.sliderElem.rzsp = 10
        helper.slider.handleHalfDim = 16

        expect(helper.slider.getEventPosition(event)).to.equal(-34)
      })

      it('should have a valid getEventNames for desktop', function() {
        var event = {
          clientX: 10,
          clientY: 100,
        }
        var eventNames = helper.slider.getEventNames(event)
        expect(eventNames).to.deep.equal({
          moveEvent: 'mousemove',
          endEvent: 'mouseup',
        })
      })

      it('should have a valid getEventNames for mobile with new API', function() {
        var event = {
          touches: [
            {
              clientX: 10,
              clientY: 100,
            },
          ],
        }
        var eventNames = helper.slider.getEventNames(event)
        expect(eventNames).to.deep.equal({
          moveEvent: 'touchmove',
          endEvent: 'touchend',
        })
      })

      it('should have a valid getEventNames for mobile with old API', function() {
        var event = {
          originalEvent: {
            touches: [
              {
                clientX: 10,
                clientY: 100,
              },
            ],
          },
        }
        var eventNames = helper.slider.getEventNames(event)
        expect(eventNames).to.deep.equal({
          moveEvent: 'touchmove',
          endEvent: 'touchend',
        })
      })

      it('should have a valid getNearestHandle for single sliders', function() {
        sinon.stub(helper.slider, 'getEventPosition').returns(46)
        var event = {}
        expect(helper.slider.getNearestHandle(event)).to.equal(
          helper.slider.minH
        )
      })

      it('should have a valid focusElement', function() {
        var el = [
          {
            focus: sinon.spy(),
          },
        ]
        helper.slider.focusElement(el)
        el[0].focus.called.should.be.true
      })
    })

    describe('Tests with specific config', function() {
      it('should have a valid getNearestHandle for range sliders when click is near minH', function() {
        var sliderConf = {
          min: 20,
          max: 80,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
          },
        }
        helper.createRangeSlider(sliderConf)
        sinon.stub(helper.slider, 'getEventPosition').returns(46)

        //fake slider's dimension
        helper.slider.minH.rzsp = 0
        helper.slider.maxH.rzsp = 100

        var event = {}
        expect(helper.slider.getNearestHandle(event)).to.equal(
          helper.slider.minH
        )
      })

      it('should have a valid getNearestHandle for range sliders when click is near maxH', function() {
        var sliderConf = {
          min: 20,
          max: 80,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
          },
        }
        helper.createRangeSlider(sliderConf)
        sinon.stub(helper.slider, 'getEventPosition').returns(66)

        //fake slider's dimension
        helper.slider.minH.rzsp = 0
        helper.slider.maxH.rzsp = 100

        var event = {}
        expect(helper.slider.getNearestHandle(event)).to.equal(
          helper.slider.maxH
        )
      })

      it('should have a bindEvents that bind correct events for single sliders on desktop', function() {
        var sliderConf = {
          value: 50,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
          },
        }
        helper.createSlider(sliderConf)
        helper.slider.onStart = sinon.spy()
        helper.slider.onMove = sinon.spy()
        helper.slider.onPointerFocus = sinon.spy()

        helper.slider.unbindEvents() //remove previously bound events
        helper.slider.bindEvents()

        helper.slider.selBar.triggerHandler('mousedown')
        expect(helper.slider.onStart.callCount).to.equal(1)
        expect(helper.slider.onMove.callCount).to.equal(1)

        helper.slider.minH.triggerHandler('mousedown')
        expect(helper.slider.onStart.callCount).to.equal(2)
        expect(helper.slider.onMove.callCount).to.equal(1)

        helper.slider.maxH.triggerHandler('mousedown')
        expect(helper.slider.onStart.callCount).to.equal(2)
        expect(helper.slider.onMove.callCount).to.equal(1)

        helper.slider.fullBar.triggerHandler('mousedown')
        expect(helper.slider.onStart.callCount).to.equal(3)
        expect(helper.slider.onMove.callCount).to.equal(2)

        helper.slider.ticks.triggerHandler('mousedown')
        expect(helper.slider.onStart.callCount).to.equal(4)
        expect(helper.slider.onMove.callCount).to.equal(3)

        helper.slider.minH.triggerHandler('focus')
        expect(helper.slider.onPointerFocus.callCount).to.equal(1)
        helper.slider.maxH.triggerHandler('focus')
        expect(helper.slider.onPointerFocus.callCount).to.equal(1)
      })

      it('should have a bindEvents that bind correct events for single sliders on mobile', function() {
        var sliderConf = {
          value: 50,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
          },
        }
        helper.createSlider(sliderConf)
        helper.slider.onStart = sinon.spy()
        helper.slider.onMove = sinon.spy()
        helper.slider.onPointerFocus = sinon.spy()

        helper.slider.unbindEvents() //remove previously bound events
        helper.slider.bindEvents()

        helper.slider.selBar.triggerHandler('touchstart')
        expect(helper.slider.onStart.callCount).to.equal(1)
        expect(helper.slider.onMove.callCount).to.equal(1)

        helper.slider.minH.triggerHandler('touchstart')
        expect(helper.slider.onStart.callCount).to.equal(2)
        expect(helper.slider.onMove.callCount).to.equal(1)

        helper.slider.maxH.triggerHandler('touchstart')
        expect(helper.slider.onStart.callCount).to.equal(2)
        expect(helper.slider.onMove.callCount).to.equal(1)

        helper.slider.fullBar.triggerHandler('touchstart')
        expect(helper.slider.onStart.callCount).to.equal(3)
        expect(helper.slider.onMove.callCount).to.equal(2)

        helper.slider.ticks.triggerHandler('touchstart')
        expect(helper.slider.onStart.callCount).to.equal(4)
        expect(helper.slider.onMove.callCount).to.equal(3)
      })

      it('should have a bindEvents that bind correct events for range sliders on desktop', function() {
        var sliderConf = {
          min: 20,
          max: 80,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
          },
        }
        helper.createRangeSlider(sliderConf)
        helper.slider.onStart = sinon.spy()
        helper.slider.onMove = sinon.spy()
        helper.slider.onPointerFocus = sinon.spy()

        helper.slider.unbindEvents() //remove previously bound events
        helper.slider.bindEvents()

        helper.slider.selBar.triggerHandler('mousedown')
        expect(helper.slider.onStart.callCount).to.equal(1)
        expect(helper.slider.onMove.callCount).to.equal(1)

        helper.slider.minH.triggerHandler('mousedown')
        expect(helper.slider.onStart.callCount).to.equal(2)
        expect(helper.slider.onMove.callCount).to.equal(1)

        helper.slider.maxH.triggerHandler('mousedown')
        expect(helper.slider.onStart.callCount).to.equal(3)
        expect(helper.slider.onMove.callCount).to.equal(1)

        helper.slider.fullBar.triggerHandler('mousedown')
        expect(helper.slider.onStart.callCount).to.equal(4)
        expect(helper.slider.onMove.callCount).to.equal(2)

        helper.slider.ticks.triggerHandler('mousedown')
        expect(helper.slider.onStart.callCount).to.equal(5)
        expect(helper.slider.onMove.callCount).to.equal(3)

        helper.slider.minH.triggerHandler('focus')
        expect(helper.slider.onPointerFocus.callCount).to.equal(1)
        helper.slider.maxH.triggerHandler('focus')
        expect(helper.slider.onPointerFocus.callCount).to.equal(2)
      })

      it('should have a bindEvents that bind correct events for range sliders on mobile', function() {
        var sliderConf = {
          min: 20,
          max: 80,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
          },
        }
        helper.createRangeSlider(sliderConf)
        helper.slider.onStart = sinon.spy()
        helper.slider.onMove = sinon.spy()
        helper.slider.onPointerFocus = sinon.spy()

        helper.slider.unbindEvents() //remove previously bound events
        helper.slider.bindEvents()

        helper.slider.selBar.triggerHandler('touchstart')
        expect(helper.slider.onStart.callCount).to.equal(1)
        expect(helper.slider.onMove.callCount).to.equal(1)

        helper.slider.minH.triggerHandler('touchstart')
        expect(helper.slider.onStart.callCount).to.equal(2)
        expect(helper.slider.onMove.callCount).to.equal(1)

        helper.slider.maxH.triggerHandler('touchstart')
        expect(helper.slider.onStart.callCount).to.equal(3)
        expect(helper.slider.onMove.callCount).to.equal(1)

        helper.slider.fullBar.triggerHandler('touchstart')
        expect(helper.slider.onStart.callCount).to.equal(4)
        expect(helper.slider.onMove.callCount).to.equal(2)

        helper.slider.ticks.triggerHandler('touchstart')
        expect(helper.slider.onStart.callCount).to.equal(5)
        expect(helper.slider.onMove.callCount).to.equal(3)
      })

      it('should have a unbindEvents that unbind all events', function() {
        var sliderConf = {
          min: 20,
          max: 80,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
          },
        }
        helper.createRangeSlider(sliderConf)
        helper.slider.onStart = sinon.spy()
        helper.slider.onMove = sinon.spy()
        helper.slider.onPointerFocus = sinon.spy()

        helper.slider.unbindEvents() //remove previously bound events
        helper.slider.bindEvents()
        helper.slider.unbindEvents()

        helper.slider.selBar.triggerHandler('mousedown')
        helper.slider.minH.triggerHandler('mousedown')
        helper.slider.maxH.triggerHandler('mousedown')
        helper.slider.fullBar.triggerHandler('mousedown')
        helper.slider.ticks.triggerHandler('mousedown')
        helper.slider.minH.triggerHandler('focus')
        expect(helper.slider.onStart.callCount).to.equal(0)
        expect(helper.slider.onMove.callCount).to.equal(0)
        expect(helper.slider.onPointerFocus.callCount).to.equal(0)
      })
    })

    describe('RTL tests with same config', function() {
      beforeEach(function() {
        var sliderConf = {
          value: 50,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
            rightToLeft: true,
          },
        }
        helper.createSlider(sliderConf)
      })

      it('should have a valid valueToPosition for positive sliders', function() {
        helper.slider.maxPos = 1000
        expect(helper.slider.valueToPosition(0)).to.equal(1000)
        expect(helper.slider.valueToPosition(50)).to.equal(500)
        expect(helper.slider.valueToPosition(100)).to.equal(0)
      })

      it('should have a valid valueToPosition for negative sliders', function() {
        helper.scope.slider.options.floor = -100
        helper.scope.slider.options.ceil = 0
        helper.scope.slider.value = -50
        helper.scope.$digest()

        helper.slider.maxPos = 1000
        expect(helper.slider.valueToPosition(0)).to.equal(0)
        expect(helper.slider.valueToPosition(-50)).to.equal(500)
        expect(helper.slider.valueToPosition(-100)).to.equal(1000)
      })

      it('should have a valid positionToValue for positive sliders', function() {
        helper.slider.maxPos = 1000
        expect(helper.slider.positionToValue(0)).to.equal(100)
        expect(helper.slider.positionToValue(1000)).to.equal(0)
        expect(helper.slider.positionToValue(500)).to.equal(50)
      })

      it('should have a valid positionToValue for for negative sliders', function() {
        helper.scope.slider.options.floor = -100
        helper.scope.slider.options.ceil = 0
        helper.scope.slider.value = -50
        helper.scope.$digest()
        helper.slider.maxPos = 1000

        expect(helper.slider.positionToValue(0)).to.equal(0)
        expect(helper.slider.positionToValue(1000)).to.equal(-100)
        expect(helper.slider.positionToValue(500)).to.equal(-50)
      })
      it('should conditionally call callOnChange in applyModel', function() {
        sinon.spy(helper.slider, 'callOnChange')

        helper.slider.applyModel(false)
        helper.slider.callOnChange.called.should.be.false

        helper.slider.applyModel(true)
        expect(helper.slider.callOnChange.callCount).to.equal(1)
      })
    })
  })
})()
