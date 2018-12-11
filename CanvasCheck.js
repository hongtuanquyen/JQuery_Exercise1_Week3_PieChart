$( window ).on("load", eventWindowLoaded );

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
          width: 500,
          height: 500,
          canvas:theCanvas,
          data:myVinyls,
          colors:["#fde23e","#f16e23", "#57d9ff","#937e88"]
      }
  );
   
  myPiechart.draw();
}