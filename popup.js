$(document).ready(function () {
    $('#cancelAlarm').click(function () {
        if ($('#name').val() != '' && $('#stationid').val() != '' && $('#destinationid').val() != '') {
            var data = {
                "stationid": $('#stationid').val(),
                "destinationid": $('#destinationid').val(),
                "name": $('#name').val()
            }
            //$.post('https://tstiticctcstest.herokuapp.com/phone/makecall', data, function (reg) {
            $.post('http://127.0.0.1:1337/phone/makecall', data, function (reg) {
                alert(reg);
            })
        } else {
            alert("請全部輸入");
        }
    })
})