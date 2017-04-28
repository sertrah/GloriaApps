$(document).ready(function () {
    $(document).delegate('.openn', 'click', function (event) {
        $(this).addClass('oppenned');
        event.stopPropagation();
    })
    $(document).delegate('body', 'click', function (event) {
        $('.openn').removeClass('oppenned');
    })
    $(document).delegate('.cls', 'click', function (event) {
        $('.openn').removeClass('oppenned');
        event.stopPropagation();
    });

});


