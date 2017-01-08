$(function () {
    var data={};
    $.ajax({
      method:'GET',
      url:'http://10.104.89.134:8080/api/v2/omnibus_reduce/_table/omnibusr.vmdisco_sjc1_11_1day?api_key=5ff9cf41dfad2bb96e4872e7defb59f871bfa8d322060ae3a7fec38e55b4fb72',
      type:'json'
    }).done(function(responeData){
      data=responeData;
      var name = data.resource[0].vmname;
      //var date = data.resource[0].datetime.substring(0,10);
      data.resource = _.forEach(data.resource,function(v){
        v.datetime = v.datetime.substring(0,10);
      });

      var times = [];
      var values = [];
       _.forEach(data.resource,function(v){
         times.push(v.datetime);
         values.push(v.average);
      });
      drawChart(times,values);
    });
  


    function drawChart(pTimes,pValues){
      Highcharts.chart('container2', {
          chart: {
              type: 'line'
          },
          title: {
              text: 'CPU UTILIZATION - day avg.'
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

    // $('#btnSelectedMins2').find('button').on('click',function(){
    //   $('#container2').empty();
    //   $(this).removeClass('btn-default').addClass('btn-maroon');
    //   $(this).siblings().removeClass('btn-maroon').addClass('btn-default');
    //   var mins = parseInt($(this).val());
    //   var name = data.resource[0].vmname;
    //   var date = data.resource[0].datetime.substring(0,10);
    //
    //   var times = [];
    //   var values = [];
    //
    //    _.forEach(data.resource,function(v){
    //
    //      var dateTimeMins = parseInt(v.datetime.substring(3));
    //
    //      if(dateTimeMins % mins == 0){
    //
    //         times.push(v.datetime);
    //         values.push(v.value);
    //      }
    //   });
    //   drawChart(times,values);
    // });
});
