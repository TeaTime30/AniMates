var curColour = "#000000";
var clickColour = new Array();

window.blockMenuHeaderScroll = false;
window.onload = function() {
	context = document.getElementById('canvas1').getContext("2d");
	
	var clr = $("#colour");
    console.log(clr.value);
    clr.mouseover(function(e) {
    	console.log("mouseover");
	    var colourTiles = $(".colours");
	    for(var i = 0; i<colourTiles.length; i++){
	    	colourTiles[i].addEventListener('click', function(e){
	    		console.log(this.id);
	    		curColour = this.id;
	    	});
	    }
	});

	var cnvs = $("canvas");
	var canvs = document.getElementById("canvas");
	//console.log("got stuff");

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

	cnvs.on("touchstart", function(e) {
		console.log("touchstart");
		var mouseX = e.originalEvent.touches[0].pageX - this.offsetLeft;
		var mouseY = e.originalEvent.touches[0].pageY - this.offsetTop;
		/*console.log(e.originalEvent.touches[0].pageX + "-" + this.offsetLeft + "=" + (e.pageX - this.offsetLeft));*/
		/*console.log(e.pageY + "-" + this.offsetTop + "=" + (e.pageY - this.offsetTop));*/
		blockMenuHeaderScroll = true;
		paint = true;
		addClick(mouseX, mouseY);
		redraw();
	});

	cnvs.mousemove(function(e){
	  if(paint){
	    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
	    redraw();
	  }
	});

	cnvs.on("touchmove", function(e) {
		var mouseX = e.originalEvent.touches[0].pageX - this.offsetLeft;
		var mouseY = e.originalEvent.touches[0].pageY - this.offsetTop;
	  	if(paint){
	    addClick(mouseX, mouseY, true);
	    redraw();
	  	}
	  	if (blockMenuHeaderScroll)
    	{
        	e.preventDefault();
    	}
	});

	cnvs.mouseup(function(e){
	  paint = false;
	});

	canvs.addEventListener("touchend", function(e) {
		paint = false;
		blockMenuHeaderScroll = false;
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
	  clickColour.push(curColour);
	}

	function redraw(){
	  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	  
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
	  	context.strokeStyle = clickColour[i];
	     context.stroke();
	  }
	}
}

