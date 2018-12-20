var stationid = '';
var destinationid = '';
var name = '';
var callid = '';
var caserverurl = '';
var password = '';
var secondcount = 0;
var Mytoken = '';
var changeevent;
var ua = window.navigator.userAgent;
var isIE = window.ActiveXObject != undefined && ua.indexOf("MSIE") != -1; //判斷Edge
var isFirefox = ua.indexOf("Firefox") != -1; //判斷FireFox
var isOpera = window.opr != undefined;
var isChrome = ua.indexOf("Chrome") && window.chrome; //判斷Chrome
var isSafari = ua.indexOf("Safari") != -1 && ua.indexOf("Version") != -1;

if (!isChrome) {
    chrome = browser;
}
chrome.storage.local.get({
    stationid: '',
    destinationid: '',
    name: '',
    caserverurl: '',
    password: '',
    token: ''
}, function (items) {
    stationid = items.stationid;
    $('#destinationid').val(items.destinationid);
    name = items.name;
    caserverurl = items.caserverurl;
    password = items.password;
    Mytoken = items.token;
    checkStatus(); //一啟動就執行checkStatus
});


if (isFirefox) { //判斷FireFox
    $('#bootstrapcss').attr('href', 'assets_Firefox/bootstrap/css/bootstrap.css');
    $('#fontcss').attr('href', 'assets_Firefox/font-awesome/css/font-awesome.min.css');
    $('#formelement').attr('href', 'assets_Firefox/css/form-elements.css');
    $('#stylecss').attr('href', 'assets_Firefox/css/style.css');
    $('#popupCss').attr('href', '/pages/css_Firefox/popup.css');
    console.log('firefox')
} else if (isIE) { //判斷Edge
    $('#bootstrapcss').attr('href', 'assets_Edge/bootstrap/css/bootstrap.css');
    $('#fontcss').attr('href', 'assets_Edge/font-awesome/css/font-awesome.min.css');
    $('#formelement').attr('href', 'assets_Edge/css/form-elements.css');
    $('#stylecss').attr('href', 'assets_Edge/css/style.css');
    $('#popupCss').attr('href', '/pages/css_Edge/popup.css');
    console.log('edge')
} else if (isChrome) { //判斷Chrome
    console.log('Chrome')
    $('#bootstrapcss').attr('href', 'assets_Chrome/bootstrap/css/bootstrap.min.css');
    $('#fontcss').attr('href', 'assets_Chrome/font-awesome/css/font-awesome.min.css');
    $('#formelement').attr('href', 'assets_Chrome/css/form-elements.css');
    $('#stylecss').attr('href', 'assets_Chrome/css/style.css');
    $('#popupCss').attr('href', '/pages/css_Chrome/popup.css');
} else {
    alert('僅支援Crome、Firefox和Edge');
}

function getToken(name, password, callback) {
    $.ajax({
        url: String(caserverurl).split('/phone')[0] + '/authenticate/login', //https://tstiticctcstest.herokuapp.com/phone
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
            'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type'
        },
        type: 'POST',
        data: JSON.stringify({
            "name": name,
            "password": password
        }),
        dataType: 'json',
        success: function (reg) {
            console.log("token資訊: " + JSON.stringify(reg));
            callback(reg);
        },
        error: function (reg) {
            alert("伺服器錯誤..........")
            //return callout(destination);
        }
    });
}
$(document).ready(function () {
    $('#makecall').click(function () { //撥出電話
        if ($('#destinationid').val() != '') {
            if (name === '' || stationid === '' || caserverurl === '' || password === '') {
                alert('你未設定撥號話機，請設定撥號話機');
                chrome.tabs.create({
                    url: chrome.extension.getURL('options.html')
                });


            } else {
                getToken(name, password, function (reg) {
                    if (reg.success) {
                        var destinationid = $('#destinationid').val();
                        Mytoken = reg.token;

                            chrome.storage.local.set({
                                destinationid: destinationid,
                                token: Mytoken
                            }, function () {
                                // Update status to let user know options were saved.
                                $.ajax({
                                    "async": true,
                                    "crossDomain": true,
                                    "url": caserverurl + '/makecall',
                                    /*https://tstiticctcstest.herokuapp.com/phone*/
                                    "method": "POST",
                                    headers: {
                                        'accept': 'application/json',
                                        'x-access-token': Mytoken,
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
                                        checkStatus();
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
                                    },
                                    error: function (reg) {
                                        if (secondcount < 1) {
                                            secondcount++;
                                            $('#showtext').text("連線失敗...");
                                            setTimeout(function () {
                                                return checkStatus()
                                            }, 200);
                                        }
                                        //$('#makecall').trigger('click');
                                    }
                                });

                            });           
                    } else {
                        alert(reg.message + "........");
                    }
                })
            }
        } else {
            $('#showtext').text("請輸入號碼");
        }
    })
})
$(document).ready(function () {
    $('#holdcall').click(function () { //保留電話
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": caserverurl + '/holdcall',
            "method": "POST",
            headers: {
                'accept': 'application/json',
                'x-access-token': Mytoken,
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
                    $('#showtext').text("保留失敗");
                    $('#holdcall').show();
                } else {
                    setTimeout(checkStatus, 1000);
                }
            }
        });
    });
});
$(document).ready(function () {
    $('#retrievecall').click(function () { //接回電話
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": caserverurl + '/retrievecall',
            "method": "POST",
            headers: {
                'accept': 'application/json',
                'x-access-token': Mytoken,
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
                    $('#showtext').text("接回失敗");
                    $('#retrievecall').show();
                    $('#endcall').show();
                } else {
                    setTimeout(checkStatus, 1000);
                }
            }
        });
    });
});
$(document).ready(function () {
    $('#endcall').click(function () { //結束電話
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": caserverurl + '/endcall',
            "method": "POST",
            headers: {
                'accept': 'application/json',
                'x-access-token': Mytoken,
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

function checkStatus() {
    console.log("checkStatus >......")
        chrome.storage.local.get({
            stationid: '',
            destinationid: '',
            name: '',
            caserverurl: '',
            password: '',
            token: ''
        }, function (items) {
            stationid = items.stationid;
            $('#destinationid').val(items.destinationid);
            name = items.name;
            caserverurl = items.caserverurl;
            password = items.password;
            Mytoken = items.token;
            $.ajax({
                "async": true,
                "crossDomain": true,
                "url": caserverurl + '/status/' + name + '?stationid=' + stationid,
                "method": "GET",
                headers: {
                    'x-access-token': Mytoken,
                    "cache-control": "no-cache"
                },
                success: function (reg) {
                    if (reg.success === false) {
                        if (reg.message === 'Can not find station status: ' + stationid) {
                            while (secondcount < 1) {
                                secondcount++;
                                setTimeout(function () {
                                    return checkStatus()
                                }, 1000);
                                $('#showtext').text("");
                            } //end while
                        } else {
                            if (secondcount < 1) {
                                secondcount++;
                                $('#showtext').text("檢查連線中...");
                                //setTimeout(checkStatus,1000);
                                setTimeout(function () {
                                    return checkStatus()
                                }, 200);
                            } else {
                                $('#showtext').text("連線失敗!......");
                            }
                        }
                    } else {
                        var callstatus = reg.status.status;
                        callid = reg.status.callid;
                        switch (callstatus) {
                            case "oncallconnect": //通話中
                                $('#makecall').hide();
                                $('#tstimakecall').hide();
                                $('#holdcall').show();
                                $('#retrievecall').hide();
                                $('#endcall').show();
                                $('#tstiendcall').show();
                                $('#showtext').text("通話中~");
                                setTimeout(checkStatus, 1000);
                                break;
                            case "oncallcreate": //撥號中
                                $('#endcall').show();
                                $('#tstiendcall').show();
                                $('#makecall').hide();
                                $('#tstimakecall').hide();
                                $('#showtext').text("撥號中...");
                                setTimeout(checkStatus, 1000);
                                break;
                            case "oncallend": //結束
                                $('#makecall').show();
                                $('#tstimakecall').show();
                                $('#holdcall').hide();
                                $('#retrievecall').hide();
                                $('#endcall').hide();
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
                },
                error: function (reg) {
                    if (name == '' || stationid == '' || caserverurl == '') {
                        //$('#showtext').text("請檢查撥號話機和使用者帳號!");
                    } else {
                        if (secondcount < 1) {
                            secondcount++;
                            //$('#showtext').text("連線錯誤!..........");
                            setTimeout(function () {
                                return checkStatus()
                            }, 200);
                        }
                    }
                }
            });
        });
};