'use strict';

$(document).ready(function(){
  var Chart = function(){
    this.dataWeekly = [];
    this.dataMonthly = [];
    this.dataQuarterly = [];
    this.dataYearly = [];
  };

  Chart.prototype.graph = function(){
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
        data: this.dataWeekly.reverse()
      },
      {
        name: 'Monthly',
        data: this.dataMonthly.reverse()
      },
      {
        name: 'Quarterly',
        data: this.dataQuarterly.reverse()
      },
      {
        name: 'Yearly',
        data: this.dataYearly.reverse()
      }]
    });
  };

  Chart.prototype.calcSMA = function(dataWeekly, dataStorage, days){
    var sum = 0;

    for (var i = 0; i < dataWeekly.length; i++) {   
      if (i <= dataWeekly.length - days){
        for (var j = 0; j < days; j++){
          sum += dataWeekly[i+j].y;
        }

        dataStorage.push({ x: dataWeekly[i].x, y: sum / days })
        sum = 0;
      }
    }
  };

  Chart.prototype.getPrice = function(url){
    $.ajax({
      context: this,
      type: 'GET',
      url: url,
      dataType: 'JSON',
      success: function(response){
        response.data.forEach(function(datum){
          this.dataWeekly.push({ x: new Date(datum[0]), y: datum[1] });
        }, this);

        this.calcSMA(this.dataWeekly, this.dataMonthly, 4);
        this.calcSMA(this.dataWeekly, this.dataQuarterly, 13);
        this.calcSMA(this.dataWeekly, this.dataYearly, 52);

        this.graph();
      },
      error: function(){
        alert("cannot connect");
      }
    });
  }

  var chart = new Chart();

  var url = 'https://www.quandl.com/api/v1/datasets/BTS_MM/RETAILGAS.json?trim_start=1995-01-02&trim_end=2012-10-15&auth_token=E6kNzExHjay2DNP8pKvB';
  chart.getPrice(url);
});