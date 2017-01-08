$(function(){
  drawVMutilizationBar()


  $(".selectpicker").on('change',function(){
    var state = $(this).val();
    if(state == 'pie'){
      $('#container').empty();
      console.log("PIE MODE");
      drawVMutilizationPieChart()
    }else{
      $('#container').empty();
      drawVMutilizationBar()
    }
  });
  function drawVMutilizationBar(){
    var data = {};
    var APIKEY = 'api_key=5ff9cf41dfad2bb96e4872e7defb59f871bfa8d322060ae3a7fec38e55b4fb72';
    var containerID = 'container';
    $.ajax({
      method:'GET',
      url:'http://10.104.89.134:8080/api/v2/omnibus_reduce/_table/omnibusr.cpu_infos_2016_11_1month?'+APIKEY,
      type:'json'
    }).done(function(responseData){

      data = responseData.resource;

      var date = data[0].datetime.substring(0,10);
      var avgs =[];
      var maxs =[];
      var mins =[];
      var vmnames =[];
      _.forEach(data,function(v){
        avgs.push(v.average);
        maxs.push(v.max);
        mins.push(v.min);
        vmnames.push(v.vmname);
      });

      var series = [{
        name : 'max',
        data : maxs
      },{
        name : 'average',
        data : avgs
      },{
        name : 'min',
        data : mins
      }
    ];
      drawBarChart(containerID,'VM utilization '+date,vmnames,series);
    }).fail(function(){
      console.log("Server Error")
    });
  }
  function drawVMutilizationPieChart(){
    var data = {};
    var APIKEY = 'api_key=5ff9cf41dfad2bb96e4872e7defb59f871bfa8d322060ae3a7fec38e55b4fb72';
    var containerID = 'container';
    $.ajax({
      method:'GET',
      url:'http://10.104.89.134:8080/api/v2/omnibus_reduce/_table/omnibusr.cpu_infos_2016_11_1month?'+APIKEY,
      type:'json'
    }).done(function(responseData){

      data = responseData.resource;

      var date = data[0].datetime.substring(0,10);
      var avgs =[];
      var maxs =[];
      var mins =[];
      var vmnames =[];
      var seriesData = [];
      var names = 'VM'
      _.forEach(data,function(v){
        avgs.push(v.average);
        maxs.push(v.max);
        mins.push(v.min);
        vmnames.push(v.vmname);
        seriesData.push({name:v.vmname,y:v.average});
      });


      var series = [{
        name : name,
        colorByPoint: true,
        data:seriesData
      }];
      console.log(series);
      drawPieChart(containerID,'VM utilization '+date,series);
    });
  }
});
