$(function () {
    var data = {
        "resource":[
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 01:10:00","value":34.53},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 01:15:00","value":36.63},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 01:20:00","value":25.83},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 01:25:00","value":30.21},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 01:30:00","value":40.27},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 01:35:00","value":50.25},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 01:40:00","value":60.31},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 01:45:00","value":72.68},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 01:50:00","value":10.23},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 01:55:00","value":20.91},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 02:00:00","value":30.25},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 02:05:00","value":42.54},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 02:10:00","value":50.22},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 02:15:00","value":62.67},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 02:20:00","value":70.26},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 02:25:00","value":80.23},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 02:30:00","value":10.91},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 02:35:00","value":10.25},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 02:40:00","value":12.54},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 02:45:00","value":20.22},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 02:50:00","value":32.67},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 02:55:00","value":40.26},
          {"vmname":"dcs-vmdisco4.sjdc","datetime":"2016-09-14 03:00:00","value":50.26}
        ]};

    var name = data.resource[0].vmname;
    var date = data.resource[0].datetime.substring(0,10);
    data.resource = _.forEach(data.resource,function(v){
      v.datetime = _.trim(v.datetime,date);
      v.datetime = _.trimEnd(v.datetime,':');
      v.datetime = _.trim(v.datetime);
    });
    var times = [];
    var values = [];
     _.forEach(data.resource,function(v){
       times.push(v.datetime);
       values.push(v.value);
    });
    drawChart(times,values);
    function drawChart(pTimes,pValues){
      Highcharts.chart('container2', {
          chart: {
              type: 'line'
          },
          title: {
              text: 'CPU UTILIZATION'
          },
          subtitle: {
              text: 'Source:'+name
          },
          xAxis: {
              categories: pTimes
          },
          yAxis: {
              title: {
                  text: 'utilization'
              }
          },
          plotOptions: {
              line: {
                  dataLabels: {
                      enabled: true
                  },
                  enableMouseTracking: false
              }
          },
          series: [{
              name: name,
              data: pValues
          }]
      });
    }

    $('#btnSelectedMins2').find('button').on('click',function(){
      $('#container2').empty();
      $(this).removeClass('btn-default').addClass('btn-maroon');
      $(this).siblings().removeClass('btn-maroon').addClass('btn-default');
      var mins = parseInt($(this).val());
      var name = data.resource[0].vmname;
      var date = data.resource[0].datetime.substring(0,10);

      var times = [];
      var values = [];

       _.forEach(data.resource,function(v){

         var dateTimeMins = parseInt(v.datetime.substring(3));

         if(dateTimeMins % mins == 0){

            times.push(v.datetime);
            values.push(v.value);
         }
      });
      drawChart(times,values);
    });
});
