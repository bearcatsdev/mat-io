let includeDiv = $("#content-replace");
let pathName = window.location.pathname;

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
    default:
        includeDiv.load("includes/home.html");
        $("#navbar-item-home").addClass("active");
        document.title = "Home - MAT I/O 2019";
        break;
}