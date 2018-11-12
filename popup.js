var stationid = '';
var destinationid = '';
var name = '';
var callid = '';
//$(checkStatus()); 

chrome.storage.local.get({
    stationid:'',
    destinationid:'',
    name:''
}, function(items) {
    $('#stationid').val(items.stationid);
    $('#destinationid').val(items.destinationid);
    $('#name').val(items.name);
    checkStatus(); //一啟動就執行checkStatus
});

$(document).ready(function () {
    $('#makecall').click(function () { //撥出電話
        if ($('#name').val() != '' && $('#stationid').val() != '' && $('#destinationid').val() != '') {
            /*var data = {
                "stationid": $('#stationid').val(),
                "destinationid": $('#destinationid').val(),
                "name": $('#name').val()
            }*/
            var stationid = $('#stationid').val();
            var destinationid = $('#destinationid').val();
            var name = $('#name').val();
            /*$.post('https://tstiticctcstest.herokuapp.com/phone/makecall', data, function (reg) {
            //$.post('http://127.0.0.1:1337/phone/makecall', data, function (reg) {
                alert(reg.callid);
            })*/
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": 'https://tstiticctcstest.herokuapp.com/phone/makecall',
                "method": "POST",
                headers:{
                    'accept': 'application/json',
                    'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQwNDM0NzI0LCJleHAiOjE1NDMwMjY3MjR9.WGpw02tW_1beq-CWnaF1QhkFcg5PJbWTvcV2t6Cpe5A',
                    'Content-Type': 'application/json',
                    "cache-control": "no-cache"
                },
                "processData": false,
                "data":JSON.stringify({
                    "stationid": stationid,
                    "destinationid": destinationid,
                    "name": name
                }),
                success: function (reg) {
                    //alert(JSON.stringify(reg));
                    if(reg.success === false){
                        $('#showtext').text("撥號失敗");
                    }else{
                        $('#showtext').text("正在撥號請等候...");
                        //$('#holdcall').toggle();
                        //$('#showtext').text("撥號中...");
                        //$('#endcall').show();
                        //$('#makecall').hide();
                        //checkStatus();
                        //setTimeout------------------------>>>>>>>>>>>>>>>>>>>>>checkStatus()
                        setTimeout(checkStatus,1000);
                        //延遲一秒function checkStatus()，因為直接跑會出現結束通話，延遲一秒後才會出現撥號中
                        callid  = reg.callid;
                        return callid;
                    }
                }
            });
        } else {
            $('#showtext').text("請全部輸入");
        }
    })
})

$(document).ready(function () {
    $('#holdcall').click(function () { //保留電話
        var stationid = $('#stationid').val();
        var name = $('#name').val();
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": 'https://tstiticctcstest.herokuapp.com/phone/holdcall',
            "method": "POST",
            headers:{
                'accept': 'application/json',
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQwNDM0NzI0LCJleHAiOjE1NDMwMjY3MjR9.WGpw02tW_1beq-CWnaF1QhkFcg5PJbWTvcV2t6Cpe5A',
                'Content-Type': 'application/json',
                "cache-control": "no-cache"
            },
            "processData": false,
            "data":JSON.stringify({
                "stationid": stationid,
                "callid": callid,
                "name": name
            }),
            success: function (reg) {
                if(reg.success === false){
                    $('#showtext').text("保留失敗");
                    $('#holdcall').show();
                }else{
                    //$('#retrievecall').show();
                    //$('#holdcall').hide();
                    //$('#showtext').text("保留中...");
                    setTimeout(checkStatus,1000);
                }
                /*
                reg.success
                reg.callid
                reg.stationid
                reg.user
                */ 
            }
        });
    });
});

$(document).ready(function () {
    $('#retrievecall').click(function () { //恢復電話
        var stationid = $('#stationid').val();
        var name = $('#name').val();
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": 'https://tstiticctcstest.herokuapp.com/phone/retrievecall',
            "method": "POST",
            headers:{
                'accept': 'application/json',
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQwNDM0NzI0LCJleHAiOjE1NDMwMjY3MjR9.WGpw02tW_1beq-CWnaF1QhkFcg5PJbWTvcV2t6Cpe5A',
                'Content-Type': 'application/json',
                "cache-control": "no-cache"
            },
            "processData": false,
            "data":JSON.stringify({
                "stationid": stationid,
                "callid": callid,
                "name": name
            }),
            success: function (reg) {
                if(reg.success === false){
                    $('#showtext').text("恢復失敗");
                    $('#retrievecall').show();
                    $('#endcall').show();
                }else{
                    //$('#holdcall').hide();
                    //$('#retrievecall').show();
                    setTimeout(checkStatus,1000);
                }
                /*
                reg.success
                reg.callid
                reg.stationid
                reg.user
                */ 
            }
        });
    });
});


$(document).ready(function () {
    $('#endcall').click(function () { //結束電話
        var stationid = $('#stationid').val();
        var name = $('#name').val();
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": 'https://tstiticctcstest.herokuapp.com/phone/endcall',
            "method": "POST",
            headers:{
                'accept': 'application/json',
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQwNDM0NzI0LCJleHAiOjE1NDMwMjY3MjR9.WGpw02tW_1beq-CWnaF1QhkFcg5PJbWTvcV2t6Cpe5A',
                'Content-Type': 'application/json',
                "cache-control": "no-cache"
            },
            "processData": false,
            "data":JSON.stringify({
                "stationid": stationid,
                "callid": callid,
                "name": name
            }),
            success: function (reg) {
                if(reg.success === false){
                    $('#showtext').text("掛斷失敗");
                    $('#endcall').show();
                }else{
                    //$('#showtext').text("結束通話請等候...");
                    //$('#holdcall').hide();
                    //$('#retrievecall').hide();
                    //$('#makecall').show();
                    //$('#holdcall').hide();
                    //$('#endcall').hide();
                    //$('#showtext').text("");
                    //$('#makecall').toggle();
                    //$('#showtext').text("");
                    //setTimeout(checkStatus,1000);
                    checkStatus();
                }
            }
        }); //end post ajax
    });
});

function checkStatus(){
    var stationid = $('#stationid').val();
    var name = $('#name').val();
    /*setTimeout(
        
    );*/
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": 'https://tstiticctcstest.herokuapp.com/phone/status/'+name+'?stationid='+stationid,
        "method": "GET",
        headers:{
            'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQwNDM0NzI0LCJleHAiOjE1NDMwMjY3MjR9.WGpw02tW_1beq-CWnaF1QhkFcg5PJbWTvcV2t6Cpe5A',
            "cache-control": "no-cache"
        },
        success: function (reg) {
            /*{
                "success": true,
                "status": {
                    "status": "oncallend",
                    "callid": "320181108879",
                    "stationid": "6302"
                }
            }*/
            if(reg.success === false){
                //$('#showtext').text("撥號失敗");
                //setTimeout
            }else{
                var callstatus = reg.status.status;
                callid = reg.status.callid;
                //alert(stationid);
                //alert(name);
                switch(callstatus){
                    case "oncallconnect": //通話中
                        $('#makecall').hide();
                        $('#holdcall').show();
                        $('#retrievecall').hide();
                        $('#endcall').show();
                        $('#showtext').text("通話中~");
                        setTimeout(checkStatus,1000);
                        break;
                    case "oncallcreate": //撥號中
                        $('#endcall').show();
                        $('#makecall').hide();
                        $('#showtext').text("撥號中.").text("撥號中..").text("撥號中...");
                        //$('#showtext').text("撥號中..");
                        //$('#showtext').text("撥號中...");
                        setTimeout(checkStatus,1000);
                        //checkStatus();
                        break;
                    case "oncallend": //結束
                        //checkStatus();
                        $('#makecall').show();
                        $('#holdcall').hide();
                        $('#retrievecall').hide();
                        $('#endcall').hide();
                        $('#showtext').text("");
                        break;
                    case "oncallhold": //保留中
                        $('#retrievecall').show();
                        $('#holdcall').hide();
                        $('#endcall').show();
                        $('#showtext').text("保留中.").text("保留中..").text("保留中...");
                        //$('#showtext').text("保留中..");
                        //$('#showtext').text("保留中...");
                        setTimeout(checkStatus,1000);
                        break;
                    case "oncallring": //響鈴中
                        //do
                        break;
                    default:
                        //do
                    
                }
            }
        }
    });
};

/*'Access-Control-Allow-Origin': "*" ,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type'*/

/*chrome.storage.local.get({
    stationid:'',
    destinationid:'',
    name:''
}, function(items) {
    $('#stationid').val(items.stationid);
    $('#destinationid').val(items.destinationid);
    $('#name').val(items.name);
    checkStatus();
});*/

/*,
                'Access-Control-Allow-Origin': "*" ,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type',
                'Access-Control-Allow-Headers': 'api-key,content-type',
                'Access-Control-Allow-Credentials': true*/