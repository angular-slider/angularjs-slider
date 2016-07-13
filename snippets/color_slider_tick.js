$scope.slider = {
    value: 0,
    options: {
        ceil: 12,
        floor: 0,
        showSelectionBar: true,
        showTicks: true,
        getTickColor: function (value) {
            if (value < 3)
              return 'red';
            if (value < 6)
              return 'orange';
            if (value < 9)
              return 'yellow';
            return '#2AE02A';
        }
    }
};
