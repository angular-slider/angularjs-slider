$scope.slider = {
    value: 12,
    options: {
        showSelectionBar: true,
        getSelectionBarColor: function(value) {
            if (value <= 3)
                return 'red';
            if (value <= 6)
                return 'orange';
            if (value <= 9)
                return 'yellow';
            return '#2AE02A';
        }
    }
};