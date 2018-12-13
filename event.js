var text = "";
var stationid = '';
var destinationid = '';
var name = '';
var callid = '';
var caserverurl = '';
var password = '';
var secondcount = 0;
var Mytoken = '';
var inIcon = false;
$(document).click(function () {
    getselecttext();
});
$(document).mousedown(function () {
    if (!inIcon)
        $("#gtx-call").remove();
});
$(document).mouseup(function () {
    if (inIcon)
        $("#gtx-call").remove();
});
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
    //checkStatus(); //一啟動就執行checkStatus
});
$(document).ready(function () {
    $('#tstimakecall').click(function () { //撥出電話
        //checkStatus(); //一啟動就執行checkStatus
        if ($('#destinationid').val() != '') {
            if (name === '' || stationid === '' || caserverurl === '' || password === '') {
                alert('你未設定撥號話機，請設定撥號話機');
                chrome.runtime.sendMessage({
                    noset: 'noset'
                }, function (response) {
                    console.log(response.farewell);
                });
            } else {
                getToken(name, password, function (reg) {
                    if (reg.success) {
                        var destinationid = $('#tstimakecall').val();
                        Mytoken = reg.token;
                        chrome.storage.local.set({
                            destinationid: destinationid,
                            token: Mytoken
                        }, function () {
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
    });
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

function getselecttext() {

    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;

    setTimeout(function () {
        var t;
        if (window.getSelection) {
            t = window.getSelection();
        } else if (document.getSelection) {
            t = document.getSelection();
        } else if (window.document.selection) {
            t = window.document.selection.createRange().text;
        }
        text = String(t).trim().replace('-', '');
        text = text.replace('-', '');
        text = text.replace('(', '');
        text = text.replace(')', '');
        text = text.replace('#', ',');
        if (isMobile(text) || isTel(text) || hasExtension(text) || localnumber(text)) {
            chrome.runtime.sendMessage({
                text: String(text)
            }, function (response) {
                console.log(response.farewell);
                var imgURL = chrome.runtime.getURL("images/images24.png");
                console.log(imgURL)


                $('body').append(
                    $(document.createElement('div')) //on
                    .attr('id', "gtx-call")
                    .attr('style', "position: absolute; left: " + x + "px; top: " + y + "px;")
                    .append(
                        $(document.createElement('div')) //on
                        .attr('id', "gtx-call-icon")
                        .append("<img src=" + imgURL + ">")
                        .hover(function () {
                            inIcon = true;
                            console.log('in')
                        }, function () {
                            inIcon = false;
                            console.log('out')
                        })
                        .mouseup(function () {
                            //if (text != "" && (isMobile(text) || isTel(text) || hasExtension(text) || localnumber(text))) {
                            chrome.storage.local.get({
                                stationid: '',
                                name: '',
                                caserverurl: '',
                                token: ''
                            }, function (items) {
                                console.log(items.stationid);
                                console.log(items.destinationid);
                                console.log(items.name);
                                stationid = items.stationid;
                                destinationid = text;
                                name = items.name;
                                caserverurl = items.caserverurl;
                                Mytoken = items.token;
                                if (stationid !== '' && name !== '' && caserverurl !== '') {
                                    $.ajax({
                                        url: caserverurl + '/makecall', //https://tstiticctcstest.herokuapp.com/phone
                                        headers: {
                                            'accept': 'application/json',
                                            'x-access-token': Mytoken,
                                            'Content-Type': 'application/json',
                                            'Access-Control-Allow-Origin': "*",
                                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                                            'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type'
                                        },
                                        type: 'POST',
                                        data: JSON.stringify({
                                            stationid: stationid,
                                            destinationid: destinationid,
                                            name: name
                                        }),
                                        dataType: 'json',
                                        success: function (reg) {
                                            console.log(JSON.stringify(reg));
                                            chrome.storage.local.set({ //若成功撥出，儲存選取的號碼
                                                destinationid: destinationid,
                                            }, function () {
                                                // Update status to let user know options were saved.
                                            });
                                        },
                                        error: function (reg) {

                                        }
                                    });
                                } else {

                                    alert('你未設定撥號話機，請設定撥號話機');
                                    chrome.runtime.sendMessage({
                                        noset: 'noset'
                                    }, function (response) {});
                                }
                            });
                            //}
                        })

                    )
                )

            });
        } else {
            chrome.runtime.sendMessage({
                text: ""
            })
        }
    }, 50);

}

function isMobile(text) {
    var pattern = new RegExp(/^09\d{8}$/);
    //alert('isMobile: '+text.match(pattern))
    return text.match(pattern)
}

function isTel(text) {
    var pattern = new RegExp(/^0(2|3|37|4|49|5|6|7|8|82|89|826|836)\d{7,8}$/);
    //alert('isTel: '+text.match(pattern))
    return text.match(pattern)
}

function hasExtension(text) {
    var pattern = new RegExp(/^0(2|3|37|4|49|5|6|7|8|82|89|826|836)\d{7,8},\d{3,4}$/);
    //alert('hasExtension: '+text.match(pattern))
    return text.match(pattern)
}

function localnumber(text) {
    var pattern = new RegExp(/\d{4}$/);
    //alert('hasExtension: '+text.match(pattern))
    return text.match(pattern)
}

function checkStatus() {
    console.log("checkStatus");
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
        //Mytoken = items.token;
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
                        setTimeout(function () {
                            return checkStatus()
                        }, 1000);
                        $('#showtext').text("");
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
/*chrome.windows.onRemoved.addListener(function(windowid) {
    alert("window closed")
})*/