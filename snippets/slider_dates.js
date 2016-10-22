var dates = [];
for (var i = 1; i <= 31; i++) {
  dates.push(new Date(2016, 7, i));
}
$scope.slider = {
  value: dates[0], // or new Date(2016, 7, 10) is you want to use different instances
  options: {
    stepsArray: dates,
    translate: function(date) {
      if (date != null)
        return date.toDateString();
      return '';
    }
  }
};
