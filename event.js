$(document).mouseup(function () {
    getselecttext();
});

var stationid = '';
var destinationid = '';
var name = '';
var callid = '';
var caserverurl = '';
var callid = '';
chrome.storage.local.get({
    stationid: '',
    destinationid: '',
    name: '',
    caserverurl: ''
}, function (items) {
    stationid = items.stationid;
    name = items.name;
    caserverurl = items.caserverurl;
    checkStatus(); //一啟動就執行checkStatus
});
$(document).ready(function(){
    $('#tstimakecall').click(function(){ //撥出電話
        var destinationid = $(this).val();
        if (name === '' || stationid === '' || caserverurl ==='') {
            alert('你未設定撥號話機，請設定撥號話機');
        } else {
            chrome.storage.local.set({
                destinationid: destinationid,
            }, function () {
                // Update status to let user know options were saved.
                checkStatus();
            });
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": caserverurl + '/makecall', /*https://tstiticctcstest.herokuapp.com/phone*/
                "method": "POST",
                headers: {
                    'accept': 'application/json',
                    'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQzMjAzNDg4LCJleHAiOjE1NDU3OTU0ODh9.IBfRibqo1heFBT93Vz-mFIMlEBvycwpML4rBnC3k8rg',
                    'Content-Type': 'application/json',
                    "cache-control": "no-cache"
                },
                "processData": false,
                "data": JSON.stringify({
                    "stationid": stationid,
                    "destinationid": destinationid,
                    "name": name
                }),
                success: function (reg) {
                    if (reg.success === false) {
                        $('#showtext').text("撥號失敗");
                        setTimeout(checkStatus, 1000);
                    } else {
                        $('#showtext').text("正在撥號請等候...");
                        //延遲一秒function checkStatus()，因為直接跑會出現結束通話狀態，延遲一秒後才會出現撥號中
                        setTimeout(checkStatus, 1000);
                        callid = reg.callid;
                        return callid;
                    }
                }, error: function(reg){
                    $('#showtext').text("連線失敗!");
                    //$('#makecall').trigger('click');
                }
            });
        }
    })
})

$(document).ready(function () {
    $('#tstiendcall').click(function () { //結束電話
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": caserverurl + '/endcall',
            "method": "POST",
            headers: {
                'accept': 'application/json',
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQzMjAzNDg4LCJleHAiOjE1NDU3OTU0ODh9.IBfRibqo1heFBT93Vz-mFIMlEBvycwpML4rBnC3k8rg',
                'Content-Type': 'application/json',
                "cache-control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify({
                "stationid": stationid,
                "callid": callid,
                "name": name
            }),
            success: function (reg) {
                if (reg.success === false) {
                    $('#showtext').text("掛斷失敗");
                    $('#endcall').show();
                } else {
                    checkStatus();
                }
            }
        }); //end post ajax
    });
});


function getselecttext() {
    var t = '';
    if (window.getSelection) {
        t = window.getSelection();
    } else if (document.getSelection) {
        t = document.getSelection();
    } else if (window.document.selection) {
        t = window.document.selection.createRange().text;
    }

    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;

    chrome.runtime.sendMessage({
        text: String(t)
    }, function (response) {
        console.log(response.farewell);
    });


}

function checkStatus() {
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": caserverurl + '/status/' + name + '?stationid=' + stationid,
        "method": "GET",
        headers: {
            'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQzMjAzNDg4LCJleHAiOjE1NDU3OTU0ODh9.IBfRibqo1heFBT93Vz-mFIMlEBvycwpML4rBnC3k8rg',
            "cache-control": "no-cache"
        },
        success: function (reg) {
            if (reg.success === false) {
                if(reg.message === 'Can not find station status: '+stationid){
                    setTimeout(function(){
                        return checkStatus()
                    },1000);
                    $('#showtext').text("");
                } else {
                    if(secondcount<=10){
                        secondcount++;
                        $('#showtext').text("檢查連線中...");
                        //setTimeout(checkStatus,1000);
                        setTimeout(function(){
                            return checkStatus()
                        },1000);
                    }else{
                        $('#showtext').text("連線失敗!......");
                    }
                }
            } else {
                var callstatus = reg.status.status;
                callid = reg.status.callid;
                switch (callstatus) {
                    case "oncallconnect": //通話中
                        $('#tstimakecall').hide();
                        $('#holdcall').show();
                        $('#retrievecall').hide();
                        $('#tstiendcall').show();
                        $('#showtext').text("通話中~");
                        setTimeout(checkStatus, 1000);
                        break;
                    case "oncallcreate": //撥號中
                        $('#tstiendcall').show();
                        $('#tstimakecall').hide();
                        $('#showtext').text("撥號中...");
                        setTimeout(checkStatus, 1000);
                        break;
                    case "oncallend": //結束
                        $('#tstimakecall').show();
                        $('#holdcall').hide();
                        $('#retrievecall').hide();
                        $('#tstiendcall').hide();
                        $('#showtext').text("");
                        break;
                    case "oncallhold": //保留中
                        $('#retrievecall').show();
                        $('#holdcall').hide();
                        $('#endcall').show();
                        $('#showtext').text("保留中...");
                        setTimeout(checkStatus, 1000);
                        break;
                    case "oncallring": //響鈴中
                        //do
                        break;
                    default:
                    //do
                }
            }
        }, error: function(reg){
            if(name =='' || stationid == '' || caserverurl == ''){
                //$('#showtext').text("請檢查撥號話機和使用者帳號!");
            }else{
                $('#showtext').text("連線失敗!..........");
                return checkStatus();
            }
        }
    });
};