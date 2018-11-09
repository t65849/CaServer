var stationid = $('#stationid').val();
var destinationid = $('#destinationid').val();
var name = $('#name').val();
var callid = '';

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
                        //$('#holdcall').toggle();
                        $('#endcall').toggle();
                        $('#makecall').toggle();
                        
                        //setTimeout------------------------>>>>>>>>>>>>>>>>>>>>>checkStatus()
                        setTimeout('checkStatus()',2000);
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
                    $('#endcall').show();
                }else{
                    $('#retrievecall').toggle();
                    $('#holdcall').toggle();
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
                    $('#endcall').show();
                }else{
                    $('#holdcall').toggle();
                    $('#retrievecall').toggle();
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
                    $('#holdcall').hide();
                    $('#retrievecall').hide();
                    $('#endcall').toggle();
                    $('#makecall').toggle();
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

function checkStatus(){
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
                switch(callstatus){
                    case "oncallconnect": //通話中
                        //do
                        break;
                    case "oncallcreate": //撥號中
                        //do
                        break;
                    case "oncallend": //結束
                        //do
                        break;
                    case "oncallhold": //保留中
                        //do
                        break;
                    case "oncallring": //響鈴中
                        //do
                        break;
                    
                }
            }
        }
    });
};

/*'Access-Control-Allow-Origin': "*" ,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type'*/

chrome.storage.local.get({
    stationid:'',
    destinationid:'',
    name:''
}, function(items) {
    $('#stationid').val(items.stationid);
    $('#destinationid').val(items.destinationid);
    $('#name').val(items.name);
});

/*,
                'Access-Control-Allow-Origin': "*" ,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type',
                'Access-Control-Allow-Headers': 'api-key,content-type',
                'Access-Control-Allow-Credentials': true*/