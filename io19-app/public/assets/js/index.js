let includeDiv = $("#content-replace");
let pathName = window.location.pathname;

$(window).scroll(function() {
    if ($(window).scrollTop() > 10) {
        $('#navBar').addClass('floatingNav');
    } else {
        $('#navBar').removeClass('floatingNav');
    }
});

switch (pathName) {
    case "/home":
        includeDiv.load("includes/home.html");
        $("#navbar-item-home").addClass("active");
        document.title = "Home - MAT I/O 2019";
        break;
    case "/":
        includeDiv.load("includes/home.html");
        $("#navbar-item-home").addClass("active");
        document.title = "Home - MAT I/O 2019";
        break;
    case "/schedule":
        includeDiv.load("includes/schedule.html");
        $("#navbar-item-schedule").addClass("active");
        document.title = "Schedule - MAT I/O 2019";
        break;
    case "/reservation":
        includeDiv.load("includes/reservation.html");
        document.title = "Reservation - MAT I/O 2019";
        break;
    case "/page-not-found":
        includeDiv.load("includes/notfound.html");
        document.title = "Page Not Found - MAT I/O 2019";
        break;
    default:
        includeDiv.load("includes/home.html");
        $("#navbar-item-home").addClass("active");
        document.title = "Home - MAT I/O 2019";
        break;
}

// Loading spinner
// Wait for window load
$(window).on('load', function(){
    // Animate loader off screen
    $("#loader").fadeOut("slow");
});

jQuery.ajaxSetup({
  beforeSend: function() {
     $('#loader').show();
  },
  complete: function(){
     $('#loader').fadeOut("slow");
  },
  success: function() {}
});