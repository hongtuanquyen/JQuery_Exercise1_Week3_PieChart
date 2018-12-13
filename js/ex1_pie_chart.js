var Point = function(centerX, centerY) {
    this.pointX = centerX;
    this.pointY = centerY;    
}

var Piechart = function(options){
    this.options = options;
    this.canvas = options.canvas;
    this.canvas.width = 900;
    this.canvas.height = 500;
    this.ctx = options.context;
    this.colors = options.colors;
    var sliceAngle = [];
    var radiusX = 250;
    var radiusY = 100;
  
    
    this.drawChart = function(){
        var total_value = 0;
        var color_index = 0;
        var deltaX;
        var deltaY;
        var centerPass;
        var centerFail; 
        
        // Calculate the total value of data
        for (var categ in this.options.data){
            var val = this.options.data[categ];
            total_value += val;
        }

        // Calculate the endAngle for each data
        endAngle = this.calculateAngle(this.options.data, total_value);
        var endAnglePass = endAngle[0];
        var endAngleFail = endAngle[0] + endAngle[1];
        
        // Calculate shift point of fail curve 
        if(this.isFailValueHigher(this.options.data)) { 
            deltaX = -15 ;
            deltaY = -3;
        }
        else {
            deltaX = 15;
            deltaY = -1;  
        }
        
        // Calculate the center point of each curve
        centerPass = new Point(this.canvas.width/2, this.canvas.height/2 + 100);
        centerFail = new Point(this.canvas.width/2 + deltaX, this.canvas.height/2 + 100 + deltaY);
        
        // 
        var middlePointCurvePass = new Point(centerPass.pointX + radiusX*Math.cos(endAnglePass/2), 
              (centerPass.pointY-99) + radiusY*Math.sin(endAnglePass/2));
        var middleRadiusPass = new Point( (middlePointCurvePass.pointX + centerPass.pointX) / 2, (middlePointCurvePass.pointY + (centerPass.pointY-99)) / 2 );    
        
        var middlePointCurveFail = new Point(centerFail.pointX + radiusX*Math.cos((endAngleFail + endAnglePass)/2), 
            (centerFail.pointY-99) + radiusY*Math.sin((endAngleFail + endAnglePass)/2));
        var middleRadiusFail = new Point( (middlePointCurveFail.pointX + centerFail.pointX) / 2, (middlePointCurveFail.pointY + (centerFail.pointY-99)) / 2 );   
        
        // Draw chart
        for(var i = 0; i < 100; i++) {
            // Draw pass curve
            this.drawCurve(this.ctx, i, centerPass.pointX, centerPass.pointY, radiusX, radiusY, 0, endAnglePass, "#456aa4", this.colors[0]);
            // Draw fail curve
            this.drawCurve(this.ctx, i, centerFail.pointX, centerFail.pointY, radiusX, radiusY, endAnglePass, endAngleFail, "#a65344", this.colors[1]);   
        }
        
        this.drawLine(this.ctx, centerPass, endAnglePass, centerFail, endAngleFail,
                middlePointCurvePass, middleRadiusPass, middlePointCurveFail, middleRadiusFail);
        this.drawText(this.ctx, middleRadiusFail, middleRadiusPass, endAngle);
    }
    
    this.drawLine = function(ctx, centerPass, endAnglePass, centerFail, endAngleFail, 
            middlePointCurvePass, middleRadiusPass, middlePointCurveFail, middleRadiusFail){

        ctx.strokeStyle = "#456aa4";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(middleRadiusPass.pointX, middleRadiusPass.pointY);
        if(this.isFailValueHigher(this.options.data)) {
            ctx.lineTo(middleRadiusPass.pointX + 60, middleRadiusPass.pointY - 180);
            ctx.lineTo(middleRadiusPass.pointX + 250, middleRadiusPass.pointY - 180);         
        }
        else {
            ctx.lineTo(middleRadiusPass.pointX - 70, middleRadiusPass.pointY - 180);
            ctx.lineTo(middleRadiusPass.pointX - 200, middleRadiusPass.pointY - 180);  
        }
        ctx.stroke(); 
        
        ctx.strokeStyle = "#a65344";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(middleRadiusFail.pointX, middleRadiusFail.pointY);
        if(this.isFailValueHigher(this.options.data)) {
            ctx.lineTo(middleRadiusFail.pointX - 40, middleRadiusFail.pointY - 120);
            ctx.lineTo(middleRadiusFail.pointX - 200, middleRadiusFail.pointY - 120);            
        }
        else {
            ctx.lineTo(middleRadiusFail.pointX + 60, middleRadiusFail.pointY - 80);
            ctx.lineTo(middleRadiusFail.pointX + 250, middleRadiusFail.pointY - 80);          
        }
        ctx.stroke();
    }
    
    this.drawText = function(ctx, middleRadiusFail, middleRadiusPass, endAngle ) {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        if(this.isFailValueHigher(this.options.data)){
            ctx.fillText(Math.round(endAngle[0]/(2*Math.PI)*100) + "% ĐÃ ĐẠT", middleRadiusPass.pointX + 60, middleRadiusPass.pointY - 190);  
        }
        else{
            ctx.fillText(Math.round(endAngle[0]/(2*Math.PI)*100) + "% ĐÃ ĐẠT", middleRadiusPass.pointX - 200, middleRadiusPass.pointY - 190);          
        }


        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        if(this.isFailValueHigher(this.options.data)){
            ctx.fillText(100 - Math.round(endAngle[0]/(2*Math.PI)*100) + "% CHƯA ĐẠT", middleRadiusFail.pointX - 200, middleRadiusFail.pointY - 130);  
        }
        else{
            ctx.fillText(100 - Math.round(endAngle[0]/(2*Math.PI)*100) + "% CHƯA ĐẠT", middleRadiusFail.pointX +60, middleRadiusFail.pointY - 90);          
        } 
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