$(document).ready(function(){

  // data is an array
  var dataWeekly = [];
  var dataMonthly = [];
  var dataQuarterly = [];
  var dataYearly = [];
  var monthlySum = 0;
  var quarterlySum = 0;
  var yearlySum = 0;
  var url = 'https://www.quandl.com/api/v1/datasets/BTS_MM/RETAILGAS.json?trim_start=1995-01-02&trim_end=2012-10-15&auth_token=E6kNzExHjay2DNP8pKvB';

  function calcSMA(dataWeekly, data, sum, days, i){
    if (i < dataWeekly.length - days){
      for (var j = 0; j < days; j++){
        sum += dataWeekly[i+j].y;
      }
      data.push({ x: dataWeekly[i].x, y: sum / days })
      sum = 0;
    }
  }

  function getPrice(url){
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

        for (var i = 0; i < dataWeekly.length; i++) {   
            calcSMA(dataWeekly, dataMonthly, monthlySum, 4, i);
            calcSMA(dataWeekly, dataQuarterly, monthlySum, 13, i);
            calcSMA(dataWeekly, dataYearly, monthlySum, 52, i);
        }

        initializeHighChart();
      },
      error: function(){
        alert("cannot connect");
      }
    });
  }

  getPrice(url);

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
            text: 'US Dollar ($)'
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
        data: dataWeekly.reverse()
      },
      {
        name: 'Monthly',
        data: dataMonthly.reverse()
      },
      {
        name: 'Quarterly',
        data: dataQuarterly.reverse()
      },
      {
        name: 'Yearly',
        data: dataYearly.reverse()
      }]
    });
  }

});