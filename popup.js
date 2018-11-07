var stationid = $('#stationid').val();
var destinationid = $('#destinationid').val();
var name = $('#name').val();
var callid = '';

$(document).ready(function () {
    $('#makecall').click(function () {
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
                        $('#endcall').toggle();
                        $('#makecall').toggle();
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
    $('#endcall').click(function () {
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