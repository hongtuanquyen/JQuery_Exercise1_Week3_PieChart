var Piechart = function(options){
    this.options = options;
    this.canvas = options.canvas;
    this.canvas.width = 900;
    this.canvas.height = 500;
    this.ctx = options.context;
    this.colors = options.colors;
    var sliceAngle = [];
    var centerX = this.canvas.width/2;
    var centerY = this.canvas.height/2 + 100;
    var radiusX = 250;
    var radiusY = 100;
    
    this.drawChart = function(){
        var total_value = 0;
        var color_index = 0;
        for (var categ in this.options.data){
            var val = this.options.data[categ];
            total_value += val;
        }

         
        endAngle = this.calculateAngle(this.options.data, total_value);
        var endAnglePass = endAngle[0];
        var endAngleFail = endAngle[0] + endAngle[1];
        var deltaX;
        var deltaY;
        for(var i = 0; i < 100; i++) {
            if(this.isFailValueHigher(this.options.data)) { 
                deltaX = -15 ;
                deltaY = -3;
            }
            else {
                deltaX = 15;
                deltaY = -5;  
            }
            // Draw pass curve
            this.drawCurve(this.ctx, i, centerX, centerY, radiusX, radiusY, 0, endAnglePass, "#456aa4", this.colors[0]);
            // Draw fail curve
            this.drawCurve(this.ctx, i, centerX + deltaX, centerY + deltaY, radiusX, radiusY, endAnglePass, endAngleFail, "#a65344", this.colors[1]);   
        }
    }
    
    this.drawLine = function(){
        // var ptxPass = centerX + (radiusX-20)*Math.cos(endAngle[0]);
        // var ptyPass = (centerY - 99) + (radiusY-20)*Math.sin(endAngle[0]);
        // this.ctx.strokeStyle = this.colors[0];
        // this.ctx.lineWidth = 5;
        // this.ctx.beginPath();
        // if(endAngle[0] <= Math.PI*0.5) {
            // this.ctx.moveTo(centerX + radiusX - 2 , centerY - 99 + 2);  
            // this.ctx.lineTo(centerX + radiusX + 100, (centerY - 99) -100);  
        // }
        // this.ctx.stroke();  
    }
    
    this.calculateAngle = function(data, totalValue) {
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

    this.drawCurve = function(ctx, i, centerX, centerY, radiusX, radiusY, startAngle, endAngle, color1, color2) {
        ctx.fillStyle = color1;
        if(i === 99) {
            ctx.fillStyle = color2;
        }
        ctx.beginPath();
        ctx.ellipse(centerX, centerY-i, radiusX, radiusY, 0, startAngle, endAngle);
        ctx.lineTo(centerX, centerY-i);
        ctx.fill();    
    }

    this.isFailValueHigher = function(data) {
        if( data["Fail"] > data["Pass"] ) {
            return true;
        }
        return false;
    }
}