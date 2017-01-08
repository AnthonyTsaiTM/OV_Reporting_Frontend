jQuery(document).ready(function() {

  $('#datetimepicker_start').datetimepicker({
    format : 'YYYY-MM-DD'
  });
  $('#datetimepicker_end').datetimepicker({
    format : 'YYYY-MM-DD'
  });
  const APIURL = 'http://10.104.89.134:8080/api/v2/ov/_table/';
  const DATATABLEAPIURL = 'http://10.104.89.185:3000/data/';
  const EXCELAPIURL = 'http://10.104.89.185:3000/csv';
  const getReport = 'reportview?';
  const getLatestday = 'lastupdatedate?';
  const PHYSICALAPIURL = 'http://10.104.89.185:3000/';
  const physicalCPUandMem = 'physicaldata/reportviewPhysicalCPUandMem';
  //const getTable1URL='DailyViewTest?';
  const getSystemName = 'service?';
  const getDCName = 'datacenter?';
  const getStatus = 'status?';
  const APIKEY = '5ff9cf41dfad2bb96e4872e7defb59f871bfa8d322060ae3a7fec38e55b4fb72';
  const DFAPIKEY = 'X-DreamFactory-Api-Key'
  const HEADERKEY = 'X-HTTP-METHOD';
  const HEADERVALUE = 'GET';
  //const LASTDAYTABLENAME = 'dailymem?fields=datetime&limit=1&order=datetime%20desc&';

  var data = {
    options_DCNames:[],
    options_systemNames:[],
    options_statusNames:[]
  };

  var options_DC =[];
  var names =[];
  var statues = [];
  $.ajax({
    url: `${DATATABLEAPIURL}${getLatestday}`,
    method:'GET'
  }).done(function(response){

    $('#latest_day').html(response.datetime);
  }).fail(function(response){
    console.log("server error");
  }).always((res)=>{
     var default_end_date = moment(res.datetime).format("YYYY-MM-DD");
     var default_start_date = moment(default_end_date).subtract(6, 'days').format("YYYY-MM-DD");
     console.log(default_start_date);
     $("#datetimepicker_start").data("DateTimePicker").setDate(default_start_date);
     //datetimepicker({defaultDate:new Date('2016-11-11')});
     $("#datetimepicker_end").data("DateTimePicker").setDate(default_end_date);
  });
  $.when($.ajax(`${APIURL}${getSystemName}api_key=${APIKEY}`),
  $.ajax(`${APIURL}${getDCName}api_key=${APIKEY}`),
  $.ajax(`${APIURL}${getStatus}api_key=${APIKEY}`)).then(function(resSystemName,resDCName,resStatus){

    _.forEach(resSystemName[0].resource,function(v,k){
      if(!(_.includes(data.options_systemNames,v.SystemName))&&v.SystemName.length>0){
        data.options_systemNames.push(v.SystemName)
      }
    });
    _.forEach(resDCName[0].resource,function(v,k){
      if(!(_.includes(data.options_DCNames,v.datacenter))&&v.datacenter.length>0){
        data.options_DCNames.push(v.datacenter)
      }
    });
    _.forEach(resStatus[0].resource,function(v,k){
      if(!(_.includes(data.options_statusNames,v.status))&&v.status.length>0){
        data.options_statusNames.push(v.status)
      }

    });
    _.map(data.options_DCNames,function(v){
      $(".selectpicker-dc").append("<option>"+v+"</option>")}
    );
    _.map(data.options_systemNames,function(v){
        //check if empty array
        $(".selectpicker-system").append("<option>"+v+"</option>")}
      );
    _.map(data.options_statusNames,function(v){
          //check if empty array
        $(".selectpicker-status").append("<option>"+v+"</option>")}
      );
      $("select[class^='selectpicker']").selectpicker('refresh');

  }).fail(function(){
    console.log("Server Error");
  });
  //"select[class^='selectpicker']"
  $("#btnSubmit").on('click',function(){

    // $('#table1').DataTable().destroy();
    $('#table1').DataTable().clear().draw();
    var jsonData = collectUserInput2Json();

    console.log(jsonData);
    var tableName = getTableName();
    fillDataToTableByAjax(tableName,jsonData);

  });
  $(".btn-excel").on('click',function(e){
    e.preventDefault();
    var jsonData=collectUserInput2Json();
    var tableName = getTableName();
    console.log(jsonData);
    getExcelLink(jsonData,tableName);
  });
  $(".period").on('click','input',(e)=>{

    var selectedPeriod = $( "input:checked" ).val();
    if(selectedPeriod == "0")return ;
    var default_end_date = moment($("#latest_day").text()).format("YYYY-MM-DD");
    var default_start_date = moment(default_end_date).subtract(Number(selectedPeriod)-1, 'days').format("YYYY-MM-DD");

    $("#datetimepicker_start").data("DateTimePicker").setDate(default_start_date);

    $("#datetimepicker_end").data("DateTimePicker").setDate(default_end_date);
  });
  $(".selectpicker-type").on('change',(e)=>{
    var selectedtype = $('.selectpicker-type').selectpicker('val');
    if(selectedtype == "phy"){

      //$('#table1').html("");
      jQuery('#table1').DataTable().clear().draw();
      $('#tableForVM').css('display','none');
      $('#tableForPhy').css('display','block');
      $('.btn-excel').css('display','none');
      // $('#table1').append(`
      //   <thead>
      //      <tr>
      //        <th rowspan="2">Name</th>
      //        <th rowspan="2">CPU(#)</th>
      //        <th rowspan="2">Memory(MB)</th>
      //        <th rowspan="2">IP</th>
      //        <th rowspan="2">System Name</th>
      //        <th rowspan="2">Data Center</th>
      //        <th rowspan="2">Storage Type</th>
      //        <th rowspan="2">Status</th>
      //        <th colspan="7">CPU</th>
      //        <th colspan="6">Memory</th>
      //        <th colspan="5">Network (KB/s)</th>
      //        <th colspan="">Disk</th>
      //      </tr>
      //      <tr>
      //         <th>Numbers_of_Days</th>
      //         <th><25%</th>
      //         <th>25%~75%</th>
      //         <th>>75%</th>
      //         <th>Avg</th>
      //         <th>Max</th>
      //         <th>Min</th>
      //
      //         <th><25%</th>
      //         <th>25%~75%</th>
      //         <th>>75%</th>
      //
      //         <th>Avg</th>
      //         <th>Max</th>
      //         <th>Min</th>
      //
      //         <th>Avg</th>
      //         <th>Max</th>
      //         <th>Min</th>
      //         <th>Numbers_of_Days</th>
      //         <th>Accumulate</th>
      //
      //      </tr>
      //   </thead>
      //   <tfoot>
      //     <tr>
      //       <th>Name</th>
      //       <th>CPU(#)</th>
      //       <th>Memory(MB)</th>
      //       <th>IP</th>
      //       <th>System Name</th>
      //       <th>Data Center</th>
      //       <th>Storage Type</th>
      //       <th>Status</th>
      //
      //       <th>Number_of_Days_CPU</th>
      //       <th>CPU<25%</th>
      //       <th>CPU25%~75%</th>
      //       <th>CPU>75%</th>
      //       <th>CPU_Avg</th>
      //       <th>CPU_Max</th>
      //       <th>CPU_Min</th>
      //       <th>Mem<25%</th>
      //       <th>Mem25%~75%</th>
      //       <th>Mem>75%</th>
      //
      //       <th>Mem_Avg</th>
      //       <th>Mem_Max</th>
      //       <th>Mem_Min</th>
      //
      //       <th>Network_Avg</th>
      //       <th>Network_Max</th>
      //       <th>Network_Min</th>
      //       <th>#_of_days_NETWORK</th>
      //       <th>Accumulate_NETWORK</th>
      //
      //       <th>Disk_Avg</th>
      //       <th>Disk_Max</th>
      //       <th>Disk_Min</th>
      //
      //       <th>#_of_days_DISK</th>
      //       <th>Accumulate_DISK</th>
      //     </tr>
      //
      //   </tfoot>
      //   `);
    }else if(selectedtype == "vm"){
      //$('#table1').html("");
      // jQuery('#table_phy_cpuandmemory').DataTable().clear().draw();
      $('#tableForPhy').css('display','none');
      $('#tableForVM').css('display','block');
      $('.btn-excel').css('display','');
      // $('#table1').append(`
      // <thead>
      //    <tr>
      //      <th rowspan="2">Name</th>
      //      <th rowspan="2">CPU(#)</th>
      //      <th rowspan="2">Memory(MB)</th>
      //      <th rowspan="2">IP</th>
      //      <th rowspan="2">System Name</th>
      //      <th rowspan="2">Data Center</th>
      //     <th rowspan="2">Storage Type</th>
      //      <th rowspan="2">Status</th>
      //      <th colspan="7">CPU</th>
      //      <th colspan="6">Memory</th>
      //      <th colspan="5">Network (KB/s)</th>
      //    </tr>
      //    <tr>
      //       <th>Numbers_of_Days</th>
      //       <th><25%</th>
      //       <th>25%~75%</th>
      //       <th>>75%</th>
      //       <th>Avg</th>
      //       <th>Max</th>
      //       <th>Min</th>
      //
      //       <th><25%</th>
      //       <th>25%~75%</th>
      //       <th>>75%</th>
      //
      //       <th>Avg</th>
      //       <th>Max</th>
      //       <th>Min</th>
      //
      //       <th>Avg</th>
      //       <th>Max</th>
      //       <th>Min</th>
      //       <th>Numbers_of_Days</th>
      //       <th>Accumulate</th>
      //
      //    </tr>
      // </thead>
      // <tfoot>
      //   <tr>
      //     <th>Name</th>
      //     <th>CPU(#)</th>
      //     <th>Memory(MB)</th>
      //     <th>IP</th>
      //     <th>System Name</th>
      //     <th>Data Center</th>
      //     <th>Storage Type</th>
      //     <th>Status</th>
      //
      //     <th>Number_of_Days_CPU</th>
      //     <th>CPU<25%</th>
      //     <th>CPU25%~75%</th>
      //     <th>CPU>75%</th>
      //     <th>CPU_Avg</th>
      //     <th>CPU_Max</th>
      //     <th>CPU_Min</th>
      //     <th>Mem<25%</th>
      //     <th>Mem25%~75%</th>
      //     <th>Mem>75%</th>
      //
      //     <th>Mem_Avg</th>
      //     <th>Mem_Max</th>
      //     <th>Mem_Min</th>
      //     <!-- <th>Disk_Avg</th>
      //     <th>Disk_Max</th>
      //     <th>Disk_Min</th>
      //
      //     <th>#_of_days_DISK</th>
      //     <th>Accumulate_DISK</th> -->
      //     <th>Network_Avg</th>
      //     <th>Network_Max</th>
      //     <th>Network_Min</th>
      //     <th>#_of_days_NETWORK</th>
      //     <th>Accumulate_NETWORK</th>
      //
      //   </tr>
      //
      // </tfoot>
      // `);
    }
  });
  $(".input-daterange").on('click', '.form-control',(e)=>{
    $(".period").find('input:radio[name=period]').attr('checked',true);
  });
  function getExcelLink(jsonData,tableName){
    console.log('make file');
    console.log(jsonData);
    $.ajax({
      method:'POST',
      // headers:{ 'X-HTTP-METHOD':'GET',
      //           'X-DreamFactory-Api-Key':
      //           '5ff9cf41dfad2bb96e4872e7defb59f871bfa8d322060ae3a7fec38e55b4fb72'
      //
      //         },
      url : `${EXCELAPIURL}`,
      beforeSend:ajaxLoading(),
      data:JSON.stringify(jsonData),

      contentType: "application/json",
       //contentType: "application/x-www-form-urlencoded",

    }).done(function(response){
      console.log(response);
       var url = `http://10.104.89.185:3000${response}`;
       $("body").append("<iframe src='" + url+ "' style='display: none;' ></iframe>");

    }).fail(function(){
      console.log('Excel error');
    }).always(function(){
        ajaxFinished();
    });
  }
  function getTableName(){
    var tableNames = ['reportview7','reportview14','reportview21','reportview30'];
    var selectedDay = $('.selectpicker-period').val();
    return tableNames[selectedDay];
  }
  function collectUserInput2Json(){
    var selectedType = $('.selectpicker-type').selectpicker('val');
    var selectedDCs = $('.selectpicker-dc').selectpicker('val');
    var selectedSystems = $('.selectpicker-system').selectpicker('val');
    var selectedStatus = $('.selectpicker-status').selectpicker('val');
    var selectedPeriod = $('.selectpicker-period').selectpicker('val');
    var selected_start_date = $('#datetimepicker_start').data('date');
    var selected_end_date = $('#datetimepicker_end').data('date');

    //var selectedType = $('.selectpicker-vmtype').selectpicker('val');

    // var selectedDCs_json=_.join(_.map(selectedDCs,function(v){
    //     return `(datacenter=${v})`;
    // }), 'OR');
    // var selectedSystems_json=_.join(_.map(selectedSystems,function(v){
    //     return `(systemname=${v})`;
    // }), 'OR');
    // var selectedStatus_json=_.join(_.map(selectedStatus,function(v){
    //     return `(status=${v})`;
    // }), 'OR');


    selectedDCs_json = selectedDCs == null ? []:selectedDCs;
    selectedSystems_json = selectedSystems== null ? []: selectedSystems;
    selectedStatus_json = selectedStatus== null ? []: selectedStatus;
    // var dataArray = [selectedDCs_json,selectedSystems_json,selectedStatus_json];
    // //for the DF API , fuck
    // var needAnd1 = (dataArray[0].length>0 && dataArray[1].length>0)?"AND":"";
    // var needAnd2 = (dataArray[1].length>0 && dataArray[2].length>0)?"AND":"";



    var jsonData = {
      // "filter" : `${selectedDCs_json} ${needAnd1} ${selectedSystems_json} ${needAnd2} ${selectedStatus_json}`.trim(),
      // "params" : ["strings"]
      type : selectedType,
      system_names : selectedSystems_json,
      datacenters :  selectedDCs_json,
      statuses : selectedStatus_json,
      start_date : selected_start_date,
      end_date : selected_end_date
    };

    return jsonData;
  }
  function fillDataToTableByAjax(tableName,jsonData){
    console.log(`${DATATABLEAPIURL}${getReport}`);
    if(jsonData.type == 'phy'){
      $.ajax({
        method:'POST',
        // 'X-HTTP-METHOD':'GET',
        //           'X-DreamFactory-Api-Key':
        //           '5ff9cf41dfad2bb96e4872e7defb59f871bfa8d322060ae3a7fec38e55b4fb72',
        headers:{
                  'Content-Type' : 'application/json; charset=utf-8'
                },
        url : `${PHYSICALAPIURL}${physicalCPUandMem}`,
        beforeSend:ajaxLoading(),
        data:JSON.stringify(jsonData),
        contentType : 'application/json'
      }).done(function(response){
        jQuery('#table_phy_cpuandmemory').DataTable().destroy();
        var data = response;
        console.log(data);
        jQuery('#table_phy_cpuandmemory').DataTable({
            buttons: [
                'excel'
            ],
            data:data,
            "scrollX": true,
            "columnDefs":[
              {"className": "dt-center", "targets": "_all"},
              { "width": "20%", "targets": 8 }
            ],

            columns: [
                { "data": "FQDN"},
                { "data": "PHYSICALNAME" },
                  { "data": "SYSTEMNAME" },
                { "data": "ID"},
                { "data": "MEMORYGB" },

                { "data": "HOSTSTATUS" },
                { "data": "DATACENTER" },
                { "data": "DEFAULTIP" },
                { "data": "OS"},

                { "data": "STATUS" },




                { "data": "Number_of_Days_CPU" },
                { "data": "CPU_LESSTHAN25" },
                { "data": "CPU_BETWEEN25TO75" },
                { "data": "CPU_MORETHAN75" },
                { "data": "CPU_AVG" },
                { "data": "CPU_MAX"},
                { "data": "CPU_MIN" },


                { "data": "Mem_LESSTHAN_25" },
                { "data": "Mem_BETWEEN25TO75" },
                { "data": "Mem_MORETHAN75" },
                { "data": "MEM_AVG" },
                { "data": "MEM_MAX" },
                { "data": "MEM_MIN" },

                // { "data": "Disk_Avg" },
                // { "data": "Disk_Max" },
                // { "data": "Disk_Min"},
                // { "data": "Number_of_days_DISK" },
                // { "data": "Accumulate_DISK" },
                // { "data": "Network_Avg" },
                // { "data": "Network_Max" },
                // { "data": "Network_Min" },
                // { "data": "Number_of_days_NETWORK"},
                // { "data": "Accumulate_NETWORK" }

            ]
          });
      }).fail(function(xhr){
          alert(xhr.responseText);
      }).always(function(){
          ajaxFinished();
      });
    }else{
      $.ajax({
        method:'POST',
        // 'X-HTTP-METHOD':'GET',
        //           'X-DreamFactory-Api-Key':
        //           '5ff9cf41dfad2bb96e4872e7defb59f871bfa8d322060ae3a7fec38e55b4fb72',
        headers:{
                  'Content-Type' : 'application/json; charset=utf-8'
                },
        url : `${DATATABLEAPIURL}${getReport}`,
        beforeSend:ajaxLoading(),
        data:JSON.stringify(jsonData),
        contentType : 'application/json'
      }).done(function(response){
        jQuery('#table1').DataTable().destroy();
        var data = response;
        console.log(data);
        jQuery('#table1').DataTable({
            data:data,
            "scrollX": true,
            "columnDefs":[
              {"className": "dt-center", "targets": "_all"},
              { "width": "20%", "targets": 8 }
            ],

            columns: [
                { "data": "Name"},
                { "data": "NumCPUs" },
                { "data": "MemoryGB" },
                { "data": "DefaultIp" },
                { "data": "Systemname" },
                { "data": "DataCenter" },
                { "data": "StorageType"},
                { "data": "Status" },
                { "data": "Number_of_Days_CPU" },
                { "data": "CPU_LESSTHAN25" },
                { "data": "CPU_BETWEEN25TO75"},
                { "data": "CPU_MORETHAN75" },
                { "data": "CPU_Avg" },
                { "data": "CPU_Max" },
                { "data": "CPU_Min" },
                { "data": "Mem_LESSTHAN_25" },
                { "data": "Mem_BETWEEN25TO75" },
                { "data": "Mem_MORETHAN75" },
                { "data": "Mem_Avg"},
                { "data": "Mem_Max" },
                { "data": "Mem_Min" },
                // { "data": "Disk_Avg" },
                // { "data": "Disk_Max" },
                // { "data": "Disk_Min"},
                // { "data": "Number_of_days_DISK" },
                // { "data": "Accumulate_DISK" },
                { "data": "Network_Avg" },
                { "data": "Network_Max" },
                { "data": "Network_Min" },
                { "data": "Number_of_days_NETWORK"},
                { "data": "Accumulate_NETWORK" }

            ]
          });
      }).fail(function(xhr){
          alert(xhr.responseText);
      }).always(function(){
          ajaxFinished();
      });

    }


  }
  function ajaxLoading(){
    $.blockUI({
       message: '<h2 id="blockUI_msg">Loading…</h2>',
       css: {
           width: "500px",
           border: 'none',
           padding: '15px',
           backgroundColor: '#000',
           '-webkit-border-radius': '10px',
           '-moz-border-radius': '10px',
           'border-radius': '10px',
           opacity: .5,
           color: '#fff'
       }
     });
   }

   function ajaxFinished(){
       $.unblockUI();
   }

});
