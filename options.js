function getBroswer() {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/edge\/([\d.]+)/)) ? Sys.edge = s[1]:
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

    if (Sys.edge) return {
        broswer: "Edge",
        version: Sys.edge
    };
    if (Sys.ie) return {
        broswer: "IE",
        version: Sys.ie
    };
    if (Sys.firefox) return {
        broswer: "Firefox",
        version: Sys.firefox
    };
    if (Sys.chrome) return {
        broswer: "Chrome",
        version: Sys.chrome
    };
    if (Sys.opera) return {
        broswer: "Opera",
        version: Sys.opera
    };
    if (Sys.safari) return {
        broswer: "Safari",
        version: Sys.safari
    };

    return {
        broswer: "",
        version: "0"
    };
}
var myBrowser = getBroswer();
if (myBrowser.broswer == "Firefox") { //判斷FireFox
    $('#bootstrapcss').attr('href', 'assets_Firefox/bootstrap/css/bootstrap.css');
    $('#fontcss').attr('href', 'assets_Firefox/font-awesome/css/font-awesome.min.css');
    $('#formelement').attr('href', 'assets_Firefox/css/form-elements.css');
    $('#stylecss').attr('href', 'assets_Firefox/css/style.css');
    console.log('firefox')
} else if (myBrowser.broswer == "Edge") { //判斷Edge
    $('#bootstrapcss').attr('href', 'assets_Edge/bootstrap/css/bootstrap.css');
    $('#fontcss').attr('href', 'assets_Edge/font-awesome/css/font-awesome.min.css');
    $('#formelement').attr('href', 'assets_Edge/css/form-elements.css');
    $('#stylecss').attr('href', 'assets_Edge/css/style.css');
    console.log('edge')
} else if (myBrowser.broswer == "Chrome") { //判斷Chrome
    console.log('Chrome')
    $('#bootstrapcss').attr('href', 'assets_Chrome/bootstrap/css/bootstrap.css');
    $('#fontcss').attr('href', 'assets_Chrome/font-awesome/css/font-awesome.min.css');
    $('#formelement').attr('href', 'assets_Chrome/css/form-elements.css');
    $('#stylecss').attr('href', 'assets_Chrome/css/style.css');
} else {
    alert('僅支援Crome、Firefox和Edge');
}

if (myBrowser.broswer == "Chrome") {
    console.log("browser = chrome")
    var browser = chrome;
}

function save_options() {
    var stationid = document.getElementById('stationid').value;
    var caserverurl = document.getElementById('caserverurl').value;
    var name = document.getElementById('name').value;
    var password = document.getElementById('password').value;
    if (caserverurl.slice(-1) == '/') { //取得最後面的'/'
        var urllength = caserverurl.length;
        caserverurl = caserverurl.slice(0, urllength - 1); //去掉url最後面的'/'
        document.getElementById('caserverurl').value = caserverurl;
    }
    if (stationid !== '' && name !== '' && caserverurl !== '' && password !== '') {
        getToken(name, password, caserverurl, function (reg) {
            if (reg.success) {
                browser.storage.local.set({
                    stationid: stationid,
                    caserverurl: caserverurl,
                    name: name,
                    password: password,
                    token: reg.token
                }, function () {
                    // Update status to let user know options were saved.
                    alert('已儲存成功');
                    window.open('', '_self', '');
                    window.close();
                    /*var status = document.getElementById('status');
                    status.textContent = '已儲存';
                    setTimeout(function() {
                        status.textContent = '';
                    }, 1500);*/
                });
            } else
                alert(reg.message + "........");
        })
    } else {
        alert('請填寫全部資料');
    }
}

// Restores select box and checkbox state using the preferences stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    browser.storage.local.get({
        stationid: '',
        caserverurl: '',
        name: '',
        password: ''
    }, function (items) {
        document.getElementById('stationid').value = items.stationid;
        document.getElementById('caserverurl').value = items.caserverurl;
        document.getElementById('name').value = items.name;
        document.getElementById('password').value = items.password;
    });
}

function getToken(name, password, caserverurl, callback) {
    $.ajax({
        url: String(caserverurl).split('/phone')[0] + '/authenticate', //https://tstiticctcstest.herokuapp.com/phone
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
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);