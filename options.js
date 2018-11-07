// Saves options to chrome.storage
function save_options() {
    var stationid = document.getElementById('stationid').value;
    var destinationid = document.getElementById('destinationid').value;
    var name = document.getElementById('name').value;
    if(stationid !== '' && destinationid !== '' && name !==''){
        chrome.storage.local.set({
            stationid: stationid,
            destinationid: destinationid,
            name: name
        }, function() {
            // Update status to let user know options were saved.
            var status = document.getElementById('status');
            status.textContent = '已儲存';
            setTimeout(function() {
                status.textContent = '';
            }, 1500);
        });
    }else{
        alert('請填寫全部資料');
    }
}
// Restores select box and checkbox state using the preferences stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.local.get({
        stationid:'',
        destinationid:'',
        name:''
    }, function(items) {
        document.getElementById('stationid').value = items.stationid;
        document.getElementById('destinationid').value = items.destinationid;
        document.getElementById('name').value = items.name;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);