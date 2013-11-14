var x;
var y;

const zoomMax = 4;
const zoomMin = 1;
const zoomStep = 1;

var zoom = zoomMin;

function zoomIn(event) {
    zoom += zoomStep;
    if(zoom >= zoomMax) {
        hideZoomIn();
    }
    showZoomOut();
    resizeImage();
}

function zoomOut(event) {
    zoom -= zoomStep;
    if(zoom <= zoomMin) {
        hideZoomOut();
    }
    showZoomIn();
    resizeImage();
}

function mouseMove(event) {
    x = event.clientX;
    y = event.clientY;

    $('#myCircle').attr("cx", x);
    $('#myCircle').attr("cy",y);
    $('#Frame').attr("cx", x);
    $('#Frame').attr("cy", y);
    $('#FrameShade').attr("cx", x);
    $('#FrameShade').attr("cy", y);

    resizeImage();
}

function resizeImage() {
    var newx = x - zoom*x;
    var newy = y - zoom*y;

    var tx = "translate(" + newx + "," + newy
        + "),scale(" + zoom + "," + zoom +")";
    $('#clippedI').attr("transform", tx);
}

function hideZoomIn() {
    $('#ZoomIn').attr("display", "none");
}

function hideZoomOut() {
    $('#ZoomOut').attr("display", "none");
}

function showZoomIn() {
    $('#ZoomIn').attr("display", "");
}

function showZoomOut() {
    $('#ZoomOut').attr("display", "");
}
