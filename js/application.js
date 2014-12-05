$(document).ready(function(){

  // data is an array
  var dataWeekly = [];
  var dataMonthly = [];
  var dataQuarterly = [];
  var dataYearly = [];
  var url = 'https://www.quandl.com/api/v1/datasets/BTS_MM/RETAILGAS.json?trim_start=1995-01-02&trim_end=2012-10-15&auth_token=E6kNzExHjay2DNP8pKvB';

  function getTemp(url){
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'JSON',
      success: function(response){
        $(response.data).each(function(){
          var dataPoint = {};
          dataPoint.y = this[1];

          var date = moment(this[0], "YYYY-MM-DD")
          dataPoint.x = Date.UTC(date.year(), date.month(), date.date());

          dataWeekly.push(dataPoint);
        })

        // convert to chronological order
        dataWeekly = dataWeekly.reverse()

        console.log(dataWeekly);

        var monthlySum = 0;
        var quarterlySum = 0;
        var yearlySum = 0;

        for (var i = 0; i < dataWeekly.length; i++) {
            monthlySum += dataWeekly[i].y;
            quarterlySum += dataWeekly[i].y;
            yearlySum += dataWeekly[i].y;

            if(i % 4 === 0) { // mod(4) = 0
                dataMonthly.push({x: dataWeekly[i].x, y: monthlySum / 4});
                monthlySum = 0;
            }
            if(i % 13 === 0) { // mod(13) = 0
                dataQuarterly.push({x: dataWeekly[i].x, y: quarterlySum / 13});
                quarterlySum = 0;
            }
            if(i % 52 === 0) { // mod(52) = 0
                dataYearly.push({x: dataWeekly[i].x, y: yearlySum / 52});
                yearlySum = 0;
            }
        }

        initializeHighChart();
      },
      error: function(){
        alert("cannot connect");
      }
    });
  }

  getTemp(url);

  function initializeHighChart(){
    $('#chart').highcharts({
      title: {
        text: 'Historical Gasoline Prices'
      },
      subtitle: {
        text: 'quandl'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        min: 0.5,
        max: 4.5,
        title: {
            text: 'Temperature (°K)'
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      series: [{
        name: 'Weekly',
        data: dataWeekly
      },
      {
        name: 'Monthly',
        data: dataMonthly
      },
      {
        name: 'Quarterly',
        data: dataQuarterly
      },
      {
        name: 'Yearly',
        data: dataYearly
      }]
    });
  }

});