//createMenus();
var testt = false;

function genericOnClick(info, tab) {
    var number_destinationid = (info.selectionText ? info.selectionText : ""); //滑鼠選起來的號碼
    number_destinationid = number_destinationid.trim();
    number_destinationid = number_destinationid.replace('(', '').replace(')', '').replace('(', '').replace(')', '').replace('-', '').replace('-', '').replace('#', ',');
    callout(number_destinationid);
}

function createMenus() {
    var parent = chrome.contextMenus.create({
        "title": "使用分機撥打電話給%s", //撥打分機給Chrome Extension
        "contexts": ['all'],
        "onclick": genericOnClick
    });
    // 使用chrome.contextMenus.create的方法回傳值是項目的id
    console.log(parent);
}

function callout(destination) {
    chrome.storage.local.get({
        stationid: '',
        destinationid: '',
        name: '',
        caserverurl: '',
        token: ''
    }, function (items) {
        console.log(items.stationid);
        console.log(items.destinationid);
        console.log(items.name);
        var stationid = items.stationid;
        var destinationid = destination;
        var name = items.name;
        var caserverurl = items.caserverurl;
        var Mytoken = items.token;
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
                    $('#endcall').toggle();
                    chrome.storage.local.set({ //若成功撥出，儲存選取的號碼
                        destinationid: destinationid,
                    }, function () {
                        // Update status to let user know options were saved.
                    });
                },
                error: function (reg) {
                    $('#showtext').text("連線失敗!");
                    //return callout(destination);
                }
            });
        } else {
            alert('你未設定撥號話機，請設定撥號話機');
            chrome.tabs.create({
                url: chrome.extension.getURL('options.html')
            });
        }
    });
};

chrome.runtime.onInstalled.addListener(function () {
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            /*chrome.storage.sync.set({
                text: request.text
            }, function () {

            });*/
            console.log("The color is green.");
            console.log(sender.tab ?
                "来自内容脚本：" + sender.tab.url :
                "来自扩展程序");
            console.log(request.text);

            if (request.noset == 'noset') {
                chrome.tabs.create({
                    url: chrome.extension.getURL('options.html')
                });
            }
            if (request.text!="") {
                //createMenus();
                if (testt == false) {
                    createMenus();
                    testt = true;
                    text = "";
                }
            } else
                chrome.contextMenus.removeAll(function () {
                    testt = false
                });

            sendResponse({
                farewell: "已收到: "+ request.text
            });
        });
});
