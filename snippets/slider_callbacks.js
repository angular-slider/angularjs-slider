$scope.slider = {
    value: 100,
    options: {
        id: 'slider-id',
        onStart: function(id) {
            console.log('on start ' + id); // logs 'on start slider-id'
        },
        onChange: function(id) {
            console.log('on change ' + id); // logs 'on change slider-id'
        },
        onEnd: function(id) {
            console.log('on end ' + id); // logs 'on end slider-id'
        }
    }
};
