window.onload = function() {
	context = document.getElementById('canvas1').getContext("2d");

	var cnvs = $("canvas");
	console.log("got stuff");
	cnvs.mousedown(function(e) {
		console.log("Mouse down handler");
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		console.log(e.pageX + "-" + this.offsetLeft + "=" + (e.pageX - this.offsetLeft));
		console.log(e.pageY + "-" + this.offsetTop + "=" + (e.pageY - this.offsetTop));

		paint = true;
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		redraw();
	});

	cnvs.mousemove(function(e){
	  if(paint){
	    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
	    redraw();
	  }
	});

	cnvs.mouseup(function(e){
	  paint = false;
	});

	var clickX = new Array();
	var clickY = new Array();
	var clickDrag = new Array();
	var paint;

	function addClick(x, y, dragging)
	{
	  clickX.push(x);
	  clickY.push(y);
	  clickDrag.push(dragging);
	}

	function redraw(){
	  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	  
	  context.strokeStyle = "#df4b26";
	  context.lineJoin = "round";
	  context.lineWidth = 5;
				
	  for(var i=0; i < clickX.length; i++) {		
	    context.beginPath();
	    if(clickDrag[i] && i){
	       context.moveTo(clickX[i-1], clickY[i-1]);
	     }else{
	       context.moveTo(clickX[i]-1, clickY[i]);
	     }
	     context.lineTo(clickX[i], clickY[i]);
	     console.log("(" + clickX[i] + "," + clickY[i] + ")");
	     context.closePath();
	     context.stroke();
	  }
	}
}
