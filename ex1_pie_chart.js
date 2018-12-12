function calculateAngle(data, totalValue) {
    var sliceAngle = [];
    var i = 0;
    var val;
    for (var categ in data){
        val = data[categ];
        sliceAngle[i] = 2 * Math.PI * val / totalValue; 
        i++;
    }
    return sliceAngle;
}

function drawCurve(ctx, i, centerX, centerY, radiusX, radiusY, startAngle, endAngle, color1, color2) {
    ctx.fillStyle = color1;
    if(i === 99) {
        ctx.fillStyle = color2;
    }
    ctx.beginPath();
    ctx.ellipse(centerX, centerY-i, radiusX, radiusY, 0, startAngle, endAngle);
    ctx.lineTo(centerX, centerY-i);
    ctx.fill();    
}

function isFailValueHigher(data) {
    if( data["Fail"] > data["Pass"] ) {
        return true;
    }
    return false;
}

var Piechart = function(options){
    this.options = options;
    this.canvas = options.canvas;
    this.canvas.width = 600;
    this.canvas.height = 500;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;
    var that = this;
    var sliceAngle = [];
    var centerX = this.canvas.width/2;
    var centerY = this.canvas.height/2;
    var radiusX = 250;
    var radiusY = 100;
    
    this.drawChart = function(){
        var total_value = 0;
        var color_index = 0;
        for (var categ in this.options.data){
            var val = this.options.data[categ];
            total_value += val;
        }

         
        endAngle = calculateAngle(this.options.data, total_value);
        var endAnglePass = endAngle[0];
        var endAngleFail = endAngle[0] + endAngle[1];
        var deltaX;
        var deltaY;
        for(var i = 0; i < 100; i++) {
            if(isFailValueHigher(this.options.data)) { 
                deltaX = -15 ;
                deltaY = -3;
            }
            else {
                deltaX = 15;
                deltaY = -5;  
            }
            // Draw pass curve
            drawCurve(this.ctx, i, centerX, centerY, radiusX, radiusY, 0, endAnglePass, "#456aa4", this.colors[0]);
            // Draw fail curve
            drawCurve(this.ctx, i, centerX + deltaX, centerY + deltaY, radiusX, radiusY, endAnglePass, endAngleFail, "#a65344", this.colors[1]);   
        }
    }
}