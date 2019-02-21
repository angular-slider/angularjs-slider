;(function() {
  'use strict'

  describe('Ticks - ', function() {
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

    it('should not create any tick if showTicks is false (default)', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.element[0].querySelectorAll('.rz-tick')).to.have.length(0)
    })

    it('should create the correct number of ticks when showTicks is true', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.element[0].querySelectorAll('.rz-tick')).to.have.length(11)
    })

    it('should create the correct number of ticks when showTicks is an integer', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: 20,
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.element[0].querySelectorAll('.rz-tick')).to.have.length(6)
    })

    it('should create the correct number of ticks when showTicksValues is true', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicksValues: true,
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.element[0].querySelectorAll('.rz-tick')).to.have.length(11)
      expect(
        helper.element[0].querySelectorAll('.rz-tick-value')
      ).to.have.length(11)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[0]
      )
      expect(firstTick.text()).to.equal('0')
      var secondTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[1]
      )
      expect(secondTick.text()).to.equal('10')
    })

    it('should create the correct number of ticks when showTicksValues is true and used with stepsArray', function() {
      var sliderConf = {
        value: 'C',
        options: {
          stepsArray: ['A', 'B', 'C', 'D', 'E'],
          showTicksValues: true,
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.element[0].querySelectorAll('.rz-tick')).to.have.length(5)
      expect(
        helper.element[0].querySelectorAll('.rz-tick-value')
      ).to.have.length(5)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[0]
      )
      expect(firstTick.text()).to.equal('A')
      var secondTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[1]
      )
      expect(secondTick.text()).to.equal('B')
      var lasTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[4]
      )
      expect(lasTick.text()).to.equal('E')
    })

    it('should create the correct number of ticks when showTicksValues is true and used with stepsArray and bindIndexForStepsArray is true', function() {
      var sliderConf = {
        value: 2,
        options: {
          stepsArray: ['A', 'B', 'C', 'D', 'E'],
          bindIndexForStepsArray: true,
          showTicksValues: true,
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.element[0].querySelectorAll('.rz-tick')).to.have.length(5)
      expect(
        helper.element[0].querySelectorAll('.rz-tick-value')
      ).to.have.length(5)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[0]
      )
      expect(firstTick.text()).to.equal('A')
      var secondTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[1]
      )
      expect(secondTick.text()).to.equal('B')
      var lasTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[4]
      )
      expect(lasTick.text()).to.equal('E')
    })

    it('should create the correct number of ticks when showTicksValues is an integer', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicksValues: 20,
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.slider.ticks.hasClass('rz-ticks-values-under')).to.be.true
      expect(helper.element[0].querySelectorAll('.rz-tick')).to.have.length(6)
      expect(
        helper.element[0].querySelectorAll('.rz-tick-value')
      ).to.have.length(6)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[0]
      )
      expect(firstTick.text()).to.equal('0')
      var secondTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[1]
      )
      expect(secondTick.text()).to.equal('20')
      var lastTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[5]
      )
      expect(lastTick.text()).to.equal('100')
    })

    it(
      'should create the correct number of ticks/values when showTick and showTicksValues' +
        ' are integers with different values',
      function() {
        var sliderConf = {
          value: 50,
          options: {
            floor: 0,
            ceil: 100,
            step: 10,
            showTicksValues: 20,
            showTicks: 10,
          },
        }
        helper.createSlider(sliderConf)
        expect(helper.slider.ticks.hasClass('rz-ticks-values-under')).to.be.true
        expect(helper.element[0].querySelectorAll('.rz-tick')).to.have.length(
          11
        )
        expect(
          helper.element[0].querySelectorAll('.rz-tick-value')
        ).to.have.length(6)
        var firstTick = angular.element(
          helper.element[0].querySelectorAll('.rz-tick-value')[0]
        )
        expect(firstTick.text()).to.equal('0')
        var secondTick = angular.element(
          helper.element[0].querySelectorAll('.rz-tick-value')[1]
        )
        expect(secondTick.text()).to.equal('20')
        var lastTick = angular.element(
          helper.element[0].querySelectorAll('.rz-tick-value')[5]
        )
        expect(lastTick.text()).to.equal('100')
      }
    )

    it('should create the correct number of ticks when ticksArray is used', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          ticksArray: [0, 25, 50, 100],
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.slider.ticks.hasClass('rz-ticks-values-under')).to.be.false
      expect(helper.element[0].querySelectorAll('.rz-tick')).to.have.length(4)
      expect(
        helper.element[0].querySelectorAll('.rz-tick-value')
      ).to.have.length(0)
    })

    it('should create the correct number of ticks when ticksArray is used along with showTicksValues', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          ticksArray: [0, 25, 50, 100],
          showTicksValues: true,
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.slider.ticks.hasClass('rz-ticks-values-under')).to.be.true
      expect(helper.element[0].querySelectorAll('.rz-tick')).to.have.length(4)
      expect(
        helper.element[0].querySelectorAll('.rz-tick-value')
      ).to.have.length(4)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[0]
      )
      expect(firstTick.text()).to.equal('0')
      var secondTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[1]
      )
      expect(secondTick.text()).to.equal('25')
      var thirdTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[2]
      )
      expect(thirdTick.text()).to.equal('50')
      var lastTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[3]
      )
      expect(lastTick.text()).to.equal('100')
    })

    it('should create the correct number of ticks when ticksArray is used as array of objects', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          ticksArray: [
            { value: 0, legend: 'Bad' },
            { value: 50, legend: 'Average' },
            { value: 100, legend: 'Excellent' },
          ],
        },
      }
      helper.createSlider(sliderConf)
      expect(helper.element[0].querySelectorAll('.rz-tick')).to.have.length(3)
      expect(
        helper.element[0].querySelectorAll('.rz-tick-value')
      ).to.have.length(0)

      expect(
        helper.element[0].querySelectorAll('.rz-tick-legend')
      ).to.have.length(3)
      var firstLegend = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-legend')[0]
      )
      expect(firstLegend.text()).to.equal('Bad')
      var lastLegend = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-legend')[2]
      )
      expect(lastLegend.text()).to.equal('Excellent')
    })

    it('should create the correct number of legend items when getLegend is defined', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          getLegend: function(value) {
            return 'Legend for ' + value
          },
        },
      }
      helper.createSlider(sliderConf)
      expect(
        helper.element[0].querySelectorAll('.rz-tick-legend')
      ).to.have.length(11)
      var firstLegend = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-legend')[0]
      )
      expect(firstLegend.text()).to.equal('Legend for 0')
      var lastLegend = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-legend')[10]
      )
      expect(lastLegend.text()).to.equal('Legend for 100')
    })

    it('should create the correct number of legend items when getLegend is defined and only some legend are displayed', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          getLegend: function(value) {
            if (value % 20 === 0) return 'Legend for ' + value
            return null
          },
        },
      }
      helper.createSlider(sliderConf)
      expect(
        helper.element[0].querySelectorAll('.rz-tick-legend')
      ).to.have.length(6)
      var firstLegend = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-legend')[0]
      )
      expect(firstLegend.text()).to.equal('Legend for 0')
      var lastLegend = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-legend')[5]
      )
      expect(lastLegend.text()).to.equal('Legend for 100')
    })

    it('should set rz-selected class to ticks below the model value if showSelectionBar is true', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          showSelectionBar: true,
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[0]
      )
      expect(firstTick.hasClass('rz-selected')).to.be.true
      var sixthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[5]
      )
      expect(sixthTick.hasClass('rz-selected')).to.be.true
      var seventhTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[6]
      )
      expect(seventhTick.hasClass('rz-selected')).to.be.false
      var lastTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[10]
      )
      expect(lastTick.hasClass('rz-selected')).to.be.false
    })

    it('should set rz-selected class to ticks above the model value if showSelectionBarEnd is true', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          showSelectionBarEnd: true,
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[0]
      )
      expect(firstTick.hasClass('rz-selected')).to.be.false
      var fifthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[4]
      )
      expect(fifthTick.hasClass('rz-selected')).to.be.false
      var sixthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[5]
      )
      expect(sixthTick.hasClass('rz-selected')).to.be.true
      var seventhTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[6]
      )
      expect(seventhTick.hasClass('rz-selected')).to.be.true
      var lastTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[10]
      )
      expect(lastTick.hasClass('rz-selected')).to.be.true
    })

    it('should set rz-selected class to correct ticks if showSelectionBarFromValue is used and the model is on the right', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          showSelectionBarFromValue: 30,
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[0]
      )
      expect(firstTick.hasClass('rz-selected')).to.be.false
      var thirdTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[2]
      )
      expect(thirdTick.hasClass('rz-selected')).to.be.false
      var fourthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[3]
      )
      expect(fourthTick.hasClass('rz-selected')).to.be.true
      var fifthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[4]
      )
      expect(fifthTick.hasClass('rz-selected')).to.be.true
      var sixthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[5]
      )
      expect(sixthTick.hasClass('rz-selected')).to.be.true
      var seventhTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[6]
      )
      expect(seventhTick.hasClass('rz-selected')).to.be.false
      var lastTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[10]
      )
      expect(lastTick.hasClass('rz-selected')).to.be.false
    })
    it('should set rz-selected class to correct ticks if showSelectionBarFromValue is used and the model is on the left', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          showSelectionBarFromValue: 70,
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[0]
      )
      expect(firstTick.hasClass('rz-selected')).to.be.false
      var fifthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[4]
      )
      expect(fifthTick.hasClass('rz-selected')).to.be.false
      var sixthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[5]
      )
      expect(sixthTick.hasClass('rz-selected')).to.be.true
      var seventhTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[6]
      )
      expect(seventhTick.hasClass('rz-selected')).to.be.true
      var eighthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[7]
      )
      expect(eighthTick.hasClass('rz-selected')).to.be.true
      var ninthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[8]
      )
      expect(ninthTick.hasClass('rz-selected')).to.be.false
      var lastTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[10]
      )
      expect(lastTick.hasClass('rz-selected')).to.be.false
    })

    it('should set rz-selected class to ticks between min/max if showSelectionBar is true on range slider', function() {
      var sliderConf = {
        min: 40,
        max: 60,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
        },
      }
      helper.createRangeSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[0]
      )
      expect(firstTick.hasClass('rz-selected')).to.be.false
      var sixthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[5]
      )
      expect(sixthTick.hasClass('rz-selected')).to.be.true
      var seventhTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[6]
      )
      expect(seventhTick.hasClass('rz-selected')).to.be.true
      var lastTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[10]
      )
      expect(lastTick.hasClass('rz-selected')).to.be.false
    })

    it('should set the correct color to ticks when getSelectionBarColor is defined', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          showSelectionBar: true,
          getSelectionBarColor: function(value) {
            if (value <= 50) return 'red'
            else return 'green'
          },
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[0]
      )
      expect(firstTick.css('background-color')).to.equal('red')

      helper.scope.slider.value = 100
      helper.scope.$digest()
      expect(firstTick.css('background-color')).to.equal('green')
    })

    it('should set correct tooltip attributes if ticksTooltip is defined for a horizontal slider', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          ticksTooltip: function(value) {
            return 'tooltip for ' + value
          },
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[0]
      )
      expect(firstTick.attr('uib-tooltip')).to.equal('tooltip for 0')
      expect(firstTick.attr('tooltip-placement')).to.equal('top')
      var secondTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[1]
      )
      expect(secondTick.attr('uib-tooltip')).to.equal('tooltip for 10')
    })

    it('should set correct tooltip attributes if ticksTooltip is defined for a vertical slider', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          vertical: true,
          showTicks: true,
          ticksTooltip: function(value) {
            return 'tooltip for ' + value
          },
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[0]
      )
      expect(firstTick.attr('uib-tooltip')).to.equal('tooltip for 0')
      expect(firstTick.attr('tooltip-placement')).to.equal('right')
      var secondTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[1]
      )
      expect(secondTick.attr('uib-tooltip')).to.equal('tooltip for 10')
    })

    it('should set correct tooltip attributes on rz-tick-value if ticksValuesTooltip is defined for a horizontal slider', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicksValues: true,
          ticksValuesTooltip: function(value) {
            return 'tooltip for ' + value
          },
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[0]
      )
      expect(firstTick.attr('uib-tooltip')).to.equal('tooltip for 0')
      expect(firstTick.attr('tooltip-placement')).to.equal('top')
      var secondTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[1]
      )
      expect(secondTick.attr('uib-tooltip')).to.equal('tooltip for 10')
    })

    it('should set correct tooltip attributes on rz-tick-value if ticksValuesTooltip is defined for a vertical slider', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          vertical: true,
          showTicksValues: true,
          ticksValuesTooltip: function(value) {
            return 'tooltip for ' + value
          },
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[0]
      )
      expect(firstTick.attr('uib-tooltip')).to.equal('tooltip for 0')
      expect(firstTick.attr('tooltip-placement')).to.equal('right')
      var secondTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[1]
      )
      expect(secondTick.attr('uib-tooltip')).to.equal('tooltip for 10')
    })
  })

  describe('Right to left Ticks - ', function() {
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

    it('should set rz-selected class to ticks below the model value if showSelectionBar is true', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          showSelectionBar: true,
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[0]
      )
      expect(firstTick.hasClass('rz-selected')).to.be.false
      var sixthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[5]
      )
      expect(sixthTick.hasClass('rz-selected')).to.be.true
      var seventhTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[6]
      )
      expect(seventhTick.hasClass('rz-selected')).to.be.true
      var lastTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[10]
      )
      expect(lastTick.hasClass('rz-selected')).to.be.true
    })

    it('should set rz-selected class to ticks above the model value if showSelectionBarEnd is true', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          showSelectionBarEnd: true,
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[0]
      )
      expect(firstTick.hasClass('rz-selected')).to.be.true
      var fifthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[4]
      )
      expect(fifthTick.hasClass('rz-selected')).to.be.true
      var sixthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[5]
      )
      expect(sixthTick.hasClass('rz-selected')).to.be.true
      var seventhTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[6]
      )
      expect(seventhTick.hasClass('rz-selected')).to.be.false
      var lastTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[10]
      )
      expect(lastTick.hasClass('rz-selected')).to.be.false
    })

    it('should set rz-selected class to correct ticks if showSelectionBarFromValue is used and the model is on the right', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          showSelectionBarFromValue: 30,
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[0]
      )
      expect(firstTick.hasClass('rz-selected')).to.be.false
      var thirdTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[2]
      )
      expect(thirdTick.hasClass('rz-selected')).to.be.false
      var fourthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[3]
      )
      expect(fourthTick.hasClass('rz-selected')).to.be.false
      var fifthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[4]
      )
      expect(fifthTick.hasClass('rz-selected')).to.be.false
      var sixthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[5]
      )
      expect(sixthTick.hasClass('rz-selected')).to.be.true
      var seventhTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[6]
      )
      expect(seventhTick.hasClass('rz-selected')).to.be.true
      var lastTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[10]
      )
      expect(lastTick.hasClass('rz-selected')).to.be.false
    })
    it('should set rz-selected class to correct ticks if showSelectionBarFromValue is used and the model is on the left', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          showSelectionBarFromValue: 70,
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[0]
      )
      expect(firstTick.hasClass('rz-selected')).to.be.false
      var fifthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[4]
      )
      expect(fifthTick.hasClass('rz-selected')).to.be.true
      var sixthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[5]
      )
      expect(sixthTick.hasClass('rz-selected')).to.be.true
      var seventhTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[6]
      )
      expect(seventhTick.hasClass('rz-selected')).to.be.false
      var eighthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[7]
      )
      expect(eighthTick.hasClass('rz-selected')).to.be.false
      var ninthTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[8]
      )
      expect(ninthTick.hasClass('rz-selected')).to.be.false
      var lastTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[10]
      )
      expect(lastTick.hasClass('rz-selected')).to.be.false
    })

    it('should set the correct color to ticks when getSelectionBarColor is defined', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          showSelectionBar: true,
          getSelectionBarColor: function(value) {
            if (value <= 50) return 'red'
            else return 'green'
          },
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[9]
      )
      expect(firstTick.css('background-color')).to.equal('red')

      helper.scope.slider.value = 100
      helper.scope.$digest()
      expect(firstTick.css('background-color')).to.equal('green')
    })

    it('should set correct tooltip attributes if ticksTooltip is defined for a horizontal slider', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicks: true,
          ticksTooltip: function(value) {
            return 'tooltip for ' + value
          },
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[0]
      )
      expect(firstTick.attr('uib-tooltip')).to.equal('tooltip for 100')
      expect(firstTick.attr('tooltip-placement')).to.equal('top')
      var secondTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[1]
      )
      expect(secondTick.attr('uib-tooltip')).to.equal('tooltip for 90')
    })

    it('should set correct tooltip attributes if ticksTooltip is defined for a vertical slider', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          vertical: true,
          showTicks: true,
          ticksTooltip: function(value) {
            return 'tooltip for ' + value
          },
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[0]
      )
      expect(firstTick.attr('uib-tooltip')).to.equal('tooltip for 100')
      expect(firstTick.attr('tooltip-placement')).to.equal('right')
      var secondTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick')[1]
      )
      expect(secondTick.attr('uib-tooltip')).to.equal('tooltip for 90')
    })

    it('should set correct tooltip attributes on rz-tick-value if ticksValuesTooltip is defined for a horizontal slider', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          showTicksValues: true,
          ticksValuesTooltip: function(value) {
            return 'tooltip for ' + value
          },
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[0]
      )
      expect(firstTick.attr('uib-tooltip')).to.equal('tooltip for 100')
      expect(firstTick.attr('tooltip-placement')).to.equal('top')
      var secondTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[1]
      )
      expect(secondTick.attr('uib-tooltip')).to.equal('tooltip for 90')
    })

    it('should set correct tooltip attributes on rz-tick-value if ticksValuesTooltip is defined for a vertical slider', function() {
      var sliderConf = {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          step: 10,
          vertical: true,
          showTicksValues: true,
          ticksValuesTooltip: function(value) {
            return 'tooltip for ' + value
          },
          rightToLeft: true,
        },
      }
      helper.createSlider(sliderConf)
      var firstTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[0]
      )
      expect(firstTick.attr('uib-tooltip')).to.equal('tooltip for 100')
      expect(firstTick.attr('tooltip-placement')).to.equal('right')
      var secondTick = angular.element(
        helper.element[0].querySelectorAll('.rz-tick-value')[1]
      )
      expect(secondTick.attr('uib-tooltip')).to.equal('tooltip for 90')
    })
  })
})()
