$(document).ready(function() {
        $(document).delegate('.openn', 'click', function(event){
            $(this).addClass('oppenned');
            event.stopPropagation();
        })
        $(document).delegate('body', 'click', function(event) {
            $('.openn').removeClass('oppenned');
        })
        $(document).delegate('.cls', 'click', function(event){
            $('.openn').removeClass('oppenned');
            event.stopPropagation();
        });

    });

 $(document).ready(function(){

    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal({
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        },
        complete: function() { } // Callback for Modal close
    
    });
  });

  document.addEventListener("DOMContentLoaded", function(event) {
           $('.product').each(function() {
            var imgURL = $(this).find(".card-image").find('img').attr('src');
            $(this).find(".card-image").css('background-image', 'url(' + imgURL + ')');
        });
      
  });