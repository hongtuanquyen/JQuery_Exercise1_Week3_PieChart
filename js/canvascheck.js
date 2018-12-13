window.onload = eventWindowLoaded;
function eventWindowLoaded() {
    canvasApp();
}

function canvasSupport () {
    return Modernizr.canvas;
}

function canvasApp(){
    if (!canvasSupport()) {
        return;
    }else{
        var theCanvas = document.getElementById('graphDiv');
        var context = theCanvas.getContext('2d');
    }
  
    var myPiechart = new Piechart(
        {
            context,
            width: 900,
            height: 600,
            canvas: theCanvas,
            data: myVinyls,
            colors:["#009ed5","#e4322b"]
        }
    );
    myPiechart.drawChart();
}