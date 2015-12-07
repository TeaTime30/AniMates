/**********************GLOBAL VARIABLES*********************/
var curColour = "#000000";
var curThickness = 5;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickColour = new Array();
var clickThick = new Array();
var clickXBuff = new Array();
var clickYBuff = new Array();
var clickDragBuff = new Array();
var clickColourBuff = new Array();
var clickThickBuff = new Array();
var paint;
var undoVar = 0;
var undoVars = new Array();
var redoVars = new Array();
var keys = [];

window.blockMenuHeaderScroll = false;
window.onload = function() {
	$("#thickmenu").addClass("hide");
	context = document.getElementById('canvas1').getContext("2d");
	
	/***********************SELECTING A COLOUR*************************/
	var clr = $("#colour");
    clr.mouseover(function(e) {
		$("#thickmenu").addClass("hide");
	    var colourTiles = $(".colours");
	    for(var i = 0; i<colourTiles.length; i++){
	    	colourTiles[i].addEventListener('click', function(e){
	    		curColour = this.id;
	    	});
	    }
	});

	/***********************ERASER FUNCTION************************/
	var erase = document.getElementById("erase");
	erase.addEventListener("click", function(e) {
		curColour = "#ffffff";
	});

	/***********************LINE THICKNESS************************/
	var thickness = document.getElementById("thickness");
	thickness.addEventListener("click", function(e) {
		$("#thickmenu").removeClass("hide");
		var thickTiles = $(".thick");
		for(var i = 0; i<thickTiles.length; i++){
			thickTiles[i].addEventListener('click', function(e) {
				curThickness = parseInt(this.id);
			});
		}
	});

    /***********************PRESSING ON THE CANVAS***********************/
	var cnvs = $("canvas");
	var canvs = document.getElementById("canvas");
	cnvs.mousedown(function(e) {
		$("#thickmenu").addClass("hide");
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		undoVar = 0;
		paint = true;
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		redraw();
	});

	cnvs.on("touchstart", function(e) {
		$("#thickmenu").addClass("hide");
		var mouseX = e.originalEvent.touches[0].pageX - this.offsetLeft;
		var mouseY = e.originalEvent.touches[0].pageY - this.offsetTop;
		undoVar = 0;
		blockMenuHeaderScroll = true;
		paint = true;
		addClick(mouseX, mouseY);
		redraw();
	});

	/***********************DRAGGING ALONG THE CANVAS***********************/
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

	/***********************STOP PAINTING***********************/
	cnvs.mouseup(function(e){
	  paint = false;
	  undoVars.push(undoVar);
	  frameDraw();
	});

	canvs.addEventListener("touchend", function(e) {
		paint = false;
	    undoVars.push(undoVar);
		blockMenuHeaderScroll = false;
	});

	/************************UNDO***********************/
	$(document).keydown(function (event) {
	    if (event.ctrlKey && event.keyCode == 90) {
	        undo1();
	    }
	});

	var undo = document.getElementById("undo");
	undo.addEventListener("click", undo1);

	function undo1(e) {
		$("#thickmenu").addClass("hide");
	  for(var i = 0; i<undoVars[undoVars.length-1]+1; i++){
		  clickXBuff.push(clickX[clickX.length-1]);
		  clickX = clickX.splice(0,clickX.length-1);
		  clickYBuff.push(clickY[clickY.length-1]);
		  clickY = clickY.splice(0,clickY.length-1);
		  clickDragBuff.push(clickDrag[clickDrag.length-1]);
		  clickDrag = clickDrag.splice(0,clickDrag.length-1);
		  clickColourBuff.push(clickColour[clickColour.length-1]);
		  clickColour = clickColour.splice(0,clickColour.length-1);
		  clickThickBuff.push(clickThick[clickThick.length-1]);
		  clickThick = clickThick.splice(0,clickThick.length-1);
	  }
	  redoVars.push(undoVars[undoVars.length-1]);
	  undoVars = undoVars.splice(0, undoVars.length-1);
	  redraw();
   	  undoVar = 0;
	}

	/*************************REDO************************/
	$(document).keydown(function (event) {
	    if (event.ctrlKey && event.keyCode == 89) {
	        redo1();
	    }
	});

	var redo = document.getElementById("redo");
	redo.addEventListener("click", redo1);

	function redo1(e) {
		$("#thickmenu").addClass("hide");
	  for(var i = 0; i<redoVars[redoVars.length-1]+1; i++){
		  clickX.push(clickXBuff[clickXBuff.length-1]);
		  clickXBuff = clickXBuff.splice(0,clickXBuff.length-1);
		  clickY.push(clickYBuff[clickYBuff.length-1]);
		  clickYBuff = clickYBuff.splice(0,clickYBuff.length-1);
		  clickDrag.push(clickDragBuff[clickDragBuff.length-1]);
		  clickDragBuff = clickDragBuff.splice(0,clickDragBuff.length-1);
		  clickColour.push(clickColourBuff[clickColourBuff.length-1]);
		  clickColourBuff = clickColourBuff.splice(0,clickColourBuff.length-1);
		  clickThick.push(clickThickBuff[clickThickBuff.length-1]);
		  clickThickBuff = clickThickBuff.splice(0,clickThickBuff.length-1);
	  }
	  undoVars.push(redoVars[redoVars.length-1]);
	  redoVars = redoVars.splice(0, redoVars.length-1);
	  redraw();

	}


	/****************************DRAWING FUNCTIONS*************************/
	function addClick(x, y, dragging)
	{
	  clickX.push(x);
	  clickY.push(y);
	  clickDrag.push(dragging);
	  clickColour.push(curColour);
	  clickThick.push(curThickness);
	}

	function redraw(){
	  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	  
	  context.lineJoin = "round";
				
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
	  	 context.lineWidth = clickThick[i];
	     context.stroke();
	  }
	}


	/*************************DRAW LINE***********************/
	var line = document.getElementById("line");
	line.addEventListener("click", function(e){
	context.beginPath();
	context.moveTo(100, 150);
	context.lineTo(clickX,clickY);
	context.stroke();

	});
	

	/*************************CREATE FRAME***********************/
	var cnvs1 = document.getElementById("canvas1");
	//var addframe = document.getElementById("addframe");
	//addframe.addEventListener("click", 
	function frameDraw() {
		console.log("Frames");
		var image = new Image();
		var image = cnvs1.toDataURL("image/png");
		var frameimg = document.getElementById("frmimg");
		frameimg.src = image;
		
	};

}

