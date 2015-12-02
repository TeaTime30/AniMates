var curColour = "#000000";
var clickColour = new Array();
var undoVar = 0;
var undoVars = new Array();

window.blockMenuHeaderScroll = false;
window.onload = function() {
	context = document.getElementById('canvas1').getContext("2d");
	
	var clr = $("#colour");
    clr.mouseover(function(e) {
	    var colourTiles = $(".colours");
	    for(var i = 0; i<colourTiles.length; i++){
	    	colourTiles[i].addEventListener('click', function(e){
	    		curColour = this.id;
	    	});
	    }
	});

	var cnvs = $("canvas");
	var canvs = document.getElementById("canvas");
	//console.log("got stuff");

	cnvs.mousedown(function(e) {
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		undoVar = 0;
		paint = true;
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		redraw();
	});

	cnvs.on("touchstart", function(e) {
		var mouseX = e.originalEvent.touches[0].pageX - this.offsetLeft;
		var mouseY = e.originalEvent.touches[0].pageY - this.offsetTop;
		undoVar = 0;
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
	    undoVar += 1;
	    redraw();
	  }
	});

	cnvs.on("touchmove", function(e) {
		var mouseX = e.originalEvent.touches[0].pageX - this.offsetLeft;
		var mouseY = e.originalEvent.touches[0].pageY - this.offsetTop;
	    undoVar += 1;
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
	  undoVars.push(undoVar);
	});

	canvs.addEventListener("touchend", function(e) {
		paint = false;
	    undoVars.push(undoVar);
		blockMenuHeaderScroll = false;
	});

	var clickX = new Array();
	var clickY = new Array();
	var clickDrag = new Array();
	var paint;

	var undo = document.getElementById("undo");
	undo.addEventListener("click", function(e) {
	  //console.log("Hi");
	  for(var i = 0; i<undoVars[undoVars.length-1]+1; i++){
		  clickX = clickX.splice(0,clickX.length-1);
		  clickY = clickY.splice(0,clickY.length-1);
		  clickDrag = clickDrag.splice(0,clickDrag.length-1);
		  clickColour = clickColour.splice(0,clickColour.length-1);
	  }
	  undoVars.splice(0, undoVars.length-1);
	  redraw();
   	  undoVar = 0;
	});

	function addClick(x, y, dragging)
	{
	  clickX.push(x);
	  clickY.push(y);
	  clickDrag.push(dragging);
	  clickColour.push(curColour);
	}

	function redraw(){
		//console.log("Hello World!");
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
	     context.closePath();
	  	context.strokeStyle = clickColour[i];
	     context.stroke();
	  }
	}
}

