function drawPieSlice(ctx,centerX, centerY, radiusX, radiusY, startAngle, endAngle, color){
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);      
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, startAngle, endAngle); 
    ctx.closePath();
    ctx.stroke();
    ctx.fill(); 
}

var Center = function(options){
  this.ptx;
  this.pty;  
}

var Piechart = function(options){
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;
    var that = this;
    var endAndgle_pass_bottom = 0;
    var endAndgle_pass_top = 0;
    var startAndgle_fail = 0;
    var endAndgle_fail_bottom = 0;
    var line_more = 70;
    var isStrokeRadius = true;
    var elip_halfwidth = 250;
    var elip_halfheight = 70;
    var elip_center = new Center();
  

    this.draw = function(){
        var total_value = 0;
        var color_index = 0;
        for (var categ in this.options.data){
            var val = this.options.data[categ];
            total_value += val;
        }
        
        // Set canvas size
        this.canvas.width = 600;
        this.canvas.height = 500;
        
        elip_center.ptx = this.canvas.width/2;
        elip_center.pty = this.canvas.height/2;  
        
        // Draw graph
        var start_angle = 0;
        for (categ in this.options.data){
            val = this.options.data[categ];
            var slice_angle = 2 * Math.PI * val / total_value;
            
          //  if(categ === "Khong dat") {
              drawPieSlice(
                  this.ctx,
                  elip_center.ptx,
                  elip_center.pty,
                  elip_halfwidth,
                  elip_halfheight,
                  start_angle,
                  start_angle+slice_angle,
                  this.colors[color_index%this.colors.length],
              );
          //  }
            if(categ === "Dat") {
                endAndgle_pass_bottom = start_angle+slice_angle;
                endAndgle_pass_top = start_angle+slice_angle;
            }
            else if(categ === "Khong dat") {
                startAndgle_fail = start_angle;
                endAndgle_fail_bottom = start_angle+slice_angle;
            }         
            
            start_angle += slice_angle;
            color_index++;  
        }
        
        if(endAndgle_pass_bottom > Math.PI) {
            endAndgle_pass_bottom = Math.PI;
        }
        
        else if(endAndgle_fail_bottom > Math.PI) {
            endAndgle_fail_bottom = Math.PI;
        }
        

        //Blue
        if(endAndgle_pass_top > 1.5*Math.PI) {
            var x1 = elip_center.ptx + elip_halfwidth*Math.cos(endAndgle_pass_top);
            var y1 = elip_center.pty + elip_halfheight*Math.sin(endAndgle_pass_top);
            this.ctx.lineWidth = 2;
            this.ctx.fillStyle = "#456aa4";
            this.ctx.beginPath();
            this.ctx.globalCompositeOperation = "destination-over";
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x1, y1 + line_more);
            this.ctx.lineTo(elip_center.ptx, elip_center.pty);
            this.ctx.closePath();
            this.ctx.stroke();    
            this.ctx.fill();
        }

        
        var x1 = elip_center.ptx + elip_halfwidth*Math.cos(endAndgle_pass_bottom);
        var y1 = elip_center.pty + line_more + elip_halfheight*Math.sin(endAndgle_pass_bottom);
        this.ctx.fillStyle = "#456aa4";
        this.ctx.strokeStyle = "#456aa4";
        this.ctx.beginPath();
        this.ctx.globalCompositeOperation = "destination-over";
        this.ctx.moveTo(elip_center.ptx + elip_halfwidth, elip_center.pty);
        this.ctx.lineTo(elip_center.ptx + elip_halfwidth, elip_center.pty + line_more);
        this.ctx.ellipse(elip_center.ptx, elip_center.pty + line_more, elip_halfwidth, elip_halfheight, 0, 0, endAndgle_pass_bottom);
        if(endAndgle_pass_top <= Math.PI * 0.5) {
            this.ctx.lineTo(elip_center.ptx, elip_center.pty + line_more);
            this.ctx.lineTo(elip_center.ptx, elip_center.pty);
        }
        if(endAndgle_pass_top > Math.PI * 0.5) {
            this.ctx.lineTo(x1,y1 - line_more); 
        }
        this.ctx.closePath(); 
        this.ctx.stroke()
        this.ctx.fill(); 
        
        //Red
        if(startAndgle_fail <= 0.5*Math.PI) {
            var x2 = elip_center.ptx + elip_halfwidth*Math.cos(startAndgle_fail);
            var y2 = elip_center.pty + elip_halfheight*Math.sin(startAndgle_fail);
            this.ctx.fillStyle = "#a65344";
            this.ctx.strokeStyle = "#a65344";
            this.ctx.globalCompositeOperation = "destination-over";      
   
            this.ctx.beginPath();
            this.ctx.moveTo(elip_center.ptx + elip_halfwidth, elip_center.pty);
            this.ctx.lineTo(elip_center.ptx + elip_halfwidth, elip_center.pty + line_more);
            this.ctx.lineTo(elip_center.ptx, elip_center.pty + line_more);
            this.ctx.lineTo(elip_center.ptx, elip_center.pty);
            this.ctx.closePath(); 
            this.ctx.stroke();
            this.ctx.fill(); 
            
            this.ctx.beginPath();
            this.ctx.moveTo(x2, y2);
            this.ctx.lineTo(x2, y2 + line_more);
            this.ctx.ellipse(elip_center.ptx, elip_center.pty + line_more, elip_halfwidth, elip_halfheight, 0, startAndgle_fail, endAndgle_fail_bottom);
            this.ctx.lineTo(50, elip_center.pty); // 50 là từ cạnh trái canvas đến gragh
            this.ctx.closePath(); 
            this.ctx.stroke();
            this.ctx.fill();  
        }
        
         /////////////////   
        if(startAndgle_fail < Math.PI && startAndgle_fail > 0.5*Math.PI) {
            var x2 = elip_center.ptx + elip_halfwidth*Math.cos(startAndgle_fail);
            var y2 = elip_center.pty + elip_halfheight*Math.sin(startAndgle_fail);
            this.ctx.fillStyle = "#a65344";
            this.ctx.strokeStyle = "#a65344";
            this.ctx.beginPath();
            this.ctx.globalCompositeOperation = "destination-over";

            this.ctx.moveTo(elip_center.ptx + elip_halfwidth, elip_center.pty);
            this.ctx.lineTo(elip_center.ptx + elip_halfwidth, elip_center.pty + line_more);
            this.ctx.lineTo(elip_center.ptx, elip_center.pty + line_more);
            this.ctx.lineTo(x2, y2 + line_more);
            this.ctx.ellipse(elip_center.ptx, elip_center.pty + line_more, elip_halfwidth, elip_halfheight, 0, startAndgle_fail, endAndgle_fail_bottom);
            this.ctx.lineTo(50, elip_center.pty); // 50 là từ cạnh trái canvas đến gragh
            this.ctx.closePath(); 
            this.ctx.stroke();
            this.ctx.fill();  
        } 
        
        /////////////
        if(startAndgle_fail > Math.PI && startAndgle_fail < 1.5*Math.PI) {
            var x2 = elip_center.ptx + elip_halfwidth*Math.cos(startAndgle_fail);
            var y2 = elip_center.pty + elip_halfheight*Math.sin(startAndgle_fail);
            this.ctx.fillStyle = "#a65344";
            this.ctx.strokeStyle = "#a65344";
            this.ctx.beginPath();
            this.ctx.globalCompositeOperation = "destination-over";
            
            this.ctx.moveTo(elip_center.ptx + elip_halfwidth, elip_center.pty);
            this.ctx.lineTo(elip_center.ptx + elip_halfwidth, elip_center.pty + line_more);  
            this.ctx.lineTo(elip_center.ptx , elip_center.pty + line_more);  
            this.ctx.lineTo(x2 , y2 + line_more);   
            this.ctx.lineTo(x2 , y2);   
            this.ctx.stroke();
            this.ctx.fill();
        }
        /////////////
        if(startAndgle_fail >  1.5*Math.PI) {
            this.ctx.fillStyle = "#a65344";
            this.ctx.strokeStyle = "#a65344";
            this.ctx.beginPath();
            this.ctx.globalCompositeOperation = "destination-over";
            
            this.ctx.moveTo(elip_center.ptx + elip_halfwidth, elip_center.pty);
            this.ctx.lineTo(elip_center.ptx + elip_halfwidth, elip_center.pty + line_more);  
            this.ctx.lineTo(elip_center.ptx , elip_center.pty + line_more);  
            this.ctx.lineTo(elip_center.ptx , elip_center.pty);     
            this.ctx.stroke();
            this.ctx.fill();              
        }

    }
}