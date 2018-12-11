function drawPieSlice(ctx,centerX, centerY, radiusX, radiusY, startAngle, endAngle, color ){
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, startAngle, endAngle);   
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

var Piechart = function(options){
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;
    var that = this;
    var endAndgle_pass = 0;
    this.draw = function(){
        var total_value = 0;
        var color_index = 0;
        for (var categ in this.options.data){
            var val = this.options.data[categ];
            total_value += val;
        }

        this.canvas.width = 400;
        this.canvas.height = 500;
        var start_angle = 0;
        for (categ in this.options.data){
            val = this.options.data[categ];
            var slice_angle = 2 * Math.PI * val / total_value;
 
            drawPieSlice(
                this.ctx,
                this.canvas.width/2,
                this.canvas.height/2,
                150,
                50,
                start_angle,
                start_angle+slice_angle,
                this.colors[color_index%this.colors.length]
            );
            
            if(categ === "Dat") {
                endAndgle_pass = start_angle+slice_angle;
            }            
            start_angle += slice_angle;
            color_index++;
           
        }
        var line_more = 50;
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = this.colors[0];
        this.ctx.beginPath();
        this.ctx.globalCompositeOperation = "destination-over";
        this.ctx.moveTo(this.canvas.width/2 + 150, this.canvas.height/2);
        this.ctx.lineTo(this.canvas.width/2 + 150, this.canvas.height/2 + line_more);
        
        this.ctx.ellipse(this.canvas.width/2, this.canvas.height/2 + line_more, 150, 50, 0, 0, endAndgle_pass);
        var x = this.canvas.width/2 + 150*Math.cos(endAndgle_pass);
        var y = this.canvas.height/2 + line_more + 50*Math.sin(endAndgle_pass);
        this.ctx.lineTo(x,y - line_more);
        this.ctx.closePath(); 
        this.ctx.stroke();
        this.ctx.fill();
        
        
        
    }
}