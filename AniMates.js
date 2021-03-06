/**********************GLOBAL VARIABLES*********************/
var curColour = "#000000";
var curThickness = 5;
var curFrame = 1;
var images = new Array();
var undoindex = -1;
var undoArr = new Array();

if(window.addEventListener) {
	window.addEventListener('load', function () {

		/********************** INITIALISE CANVAS AND CONTEXT *********************/

		$("#thickmenu").addClass("hide");
		var canvas = document.querySelector('#canvas1');
  		var context = canvas.getContext('2d');

 		var container = document.querySelector('#canvas');
  		var container_style = getComputedStyle(container);  
 		canvas.width = parseInt(container_style.getPropertyValue('width'));
  		canvas.height = parseInt(container_style.getPropertyValue('height'));


 		/********************** INITIALISE TEMPORARY CANVAS AND CONTEXT *********************/

  		var temp_canvas = document.createElement('canvas');
  		var temp_context = temp_canvas.getContext('2d');
  		temp_canvas.id = 'temp_canvas';
  		temp_canvas.width = canvas.width;
  		temp_canvas.height = canvas.height;

  		container.appendChild(temp_canvas);

 		/********************** INITIALISE TEXT CANVAS AND CONTEXT *********************/

  		var textarea = document.createElement('textarea');
  		textarea.id = 'text_tool';
  		container.appendChild(textarea);

  		var temp_txt_context = document.createElement('div');
  		temp_txt_context.style.display = 'none';
  		container.appendChild(temp_txt_context);

  		textarea.addEventListener('mouseup', function(e){
			temp_canvas.removeEventListener('mousemove', onText,false);
  		},false);
	

		/********************** CAPTURE MOUSE MOVEMENT *********************/

  		var mouse = {x: 0, y: 0};
  		var start_mouse = {x: 0, y:0};
  		var last_mouse = {x: 0, y: 0};
  		var points = [];


  		temp_canvas.addEventListener('mousemove', function(e){
  			mouse.x = typeof e.offsetX !== 'undefine' ? e.offsetX : e.layerX;
  			mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	  	}, false);


		/********************** DRAWING ON CONTEXT *********************/

		temp_canvas.addEventListener('mousedown', function(e){

	  		temp_context.lineWidth = curThickness;
	  		temp_context.lineJoin = 'round';
	  		temp_context.lineCap = 'round';
	  		temp_context.strokeStyle = curColour;
	  		temp_context.fillstyle =curColour;
	  		uPush();
			$("#thickmenu").addClass("hide");
			mouse.x = typeof e.offsetX !== 'undefine' ? e.offsetX : e.layerX;
  			mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
  	
  			start_mouse.x = mouse.x;
  			start_mouse.y = mouse.y;

  			points.push({x:mouse.x, y:mouse.y});

  			if(tool == 'line'){
  				temp_canvas.addEventListener('mousemove', onLine, false);
  				onLine();
  			}

  			else if(tool == 'rect') {
  				temp_canvas.addEventListener('mousemove', onRect, false);
  				onRect();
  			
  			}

  			else if(tool == 'brush'){
  				temp_canvas.addEventListener('mousemove', onBrush, false);
  				onBrush();
  			
  			}

  			else if (tool == 'pencil'){
  				temp_canvas.addEventListener('mousemove', onPencil, false);
  				onPencil();
  			
  			}

  			else if(tool == 'erase'){
  				temp_canvas.addEventListener('mousemove', onErase, false);
  				onErase();
  			
  			}

  			else if(tool == 'circle'){
  				temp_canvas.addEventListener('mousemove', onCircle, false);
  				onCircle();
  				
  			}

  			else if (tool == 'oval'){
  				temp_canvas.addEventListener('mousemove', onOval, false);
  				onOval();
  			
  			}

  			else if (tool == 'square'){
  				temp_canvas.addEventListener('mousemove', onSquare, false);
  				onSquare();
  			
  			}

  			else if( tool == 'cline'){
  				temp_canvas.addEventListener('mousemove', onCLine, false);
  				onCLine();
  			
  			}

  			else if (tool == 'triangle'){
  				temp_canvas.addEventListener('mousemove', onTriangle, false);
  				onTriangle();
  			
  			}

  			else if (tool == 'diam'){
  				temp_canvas.addEventListener('mousemove', onDiam, false);
  				onDiam();
  				
  			}

  			else if (tool == 'heart'){
  				temp_canvas.addEventListener('mousemove',onHeart, false);
  				onHeart();
  				
  			}

  			else if (tool == 'text'){
  				temp_canvas.addEventListener('mousemove', onText, false);
  				onText();
  			
  			}

  		}, false);

		temp_canvas.addEventListener('mouseup', function(){
			
			temp_canvas.removeEventListener('mousemove', onLine, false);
			temp_canvas.removeEventListener('mousemove',onCLine, false);
			temp_canvas.removeEventListener('mousemove', onRect, false);
			temp_canvas.removeEventListener('mousemove', onBrush, false);
			temp_canvas.removeEventListener('mousemove', onErase,false);
			temp_canvas.removeEventListener('mousemove',onCircle, false);
			temp_canvas.removeEventListener('mousemove', onOval, false);
			temp_canvas.removeEventListener('mousemove', onSquare, false);
			temp_canvas.removeEventListener('mousemove', onTriangle,false);
			temp_canvas.removeEventListener('mousemove', onDiam, false);
			temp_canvas.removeEventListener('mousemove',onHeart, false);
			temp_canvas.removeEventListener('mousemove', onText,false);
			temp_canvas.removeEventListener('mousemove', onPencil, false);

    		if (tool == 'text'){

    			var lines = textarea.value.split('\n');
				var processed_lines= [];

				for (var i = 0; i< lines.length; i++){
					var chars = lines[i].length;

					for(var j; j< chars; j++){
						var text_node = document.createTextNode(lines[i][j]);
						temp_txt_context.appendChild(text_node);

						temp_txt_context.style.position = 'absolute';
						temp_txt_context.style.visibility = 'hidden';
						temp_txt_context.style.display = 'block';

						var width = temp_txt_context.offsetWidth;
						var height = temp_txt_context.offsetHeight;

						temp_txt_context.style.position = '';
						temp_txt_context.style.visibility = '';
						temp_txt_context.style.display = 'none';

						if (width > parseInt(textarea.style.width)) {
    		           		 break;
    		        	}
    	   			}
    	     
    	  	 		processed_lines.push(temp_txt_context.textContent);
    	  		  	temp_txt_context.innerHTML = '';
    			}
    	 
   				var ta_comp_style = getComputedStyle(textarea);
    			var fs = ta_comp_style.getPropertyValue('font-size');
    			var ff = ta_comp_style.getPropertyValue('font-family');
    	 	
    			temp_context.font = fs + ' ' + ff;
    			temp_context.textBaseline = 'top';
    		 
    			for (var n = 0; n < processed_lines.length; n++) {
    		    	var processed_line = processed_lines[n];
    		    	 
   			     	temp_context.fillText(processed_line,  parseInt(textarea.style.left), parseInt(textarea.style.top) + n*parseInt(fs) );
   			 	}
   	      
   				context.drawImage(temp_canvas, 0, 0);

    			temp_context.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
    	 
    			textarea.style.display = 'none';
    			textarea.value = '';

    		}

    		context.drawImage(temp_canvas,0,0);
    		temp_context.clearRect(0,0,temp_canvas.width,temp_canvas.height);

    		points = [];

    		uPush();

    		frameDraw();

		}, false);
	

	
		/**********************INITIALISE DEFAULT TOOL - BRUSH *********************/

 	 	var tool = 'brush';
 	 	$('#tools div').on('click', function(){
 	 		tool = $(this).attr('id');
 	 		console.log("Tool selected: " + tool);
 		})

 		$('#shapes div').on('click', function(){
  			tool = $(this).attr('id');
  			console.log("Tool selected: " + tool);
 		})

		/***********************SELECTING A COLOUR*************************/
 		var clr = $("#colour");
 		clr.mouseover(function(e){
 			var colourTiles = $(".colours");
 			for( var i = 0; i< colourTiles.length; i++){
 				colourTiles[i].addEventListener('click', function(e){
 					curColour = this.id; 				
 				});
 			}
 		});

 	
		/***********************SELECTING LINE WEIGHT *************************/
		var thickness = document.getElementById("thickness");
		thickness.addEventListener("click", function(e) {
			$("#thickmenu").removeClass("hide");
			var thickTiles = $(".thick");
			for(var i = 0; i<thickTiles.length; i++){
				thickTiles[i].addEventListener('click', function(e) {
					curThickness = parseInt(this.id);
					temp_context.lineWidth = curThickness;

				});
			}
		});
	

		/*********************** UNDO ARRAY FUNCTION*************************/
		function uPush(){
		undoindex++;
		if (undoindex < undoArr.length){
			undoArr.length = undoindex;
		}
		undoArr.push(canvas.toDataURL());

		}


 		/*********************** UNDO FUNCTION*************************/
		$(document).keydown(function (event) {
		    if (event.ctrlKey && event.keyCode == 90) {
		        undo1();
		    }
		});

		var undo = document.getElementById("undo");
		undo.addEventListener("click", undo1);

		 function undo1 (e){
		 	if (undoindex > 0){
		 		undoindex--;
		 		var undo_img = new Image();
		 		undo_img.src = undoArr[undoindex];
		 		context.clearRect(0,0,temp_canvas.width, temp_canvas.height);
		 		context.drawImage(undo_img,0,0);
		 		frameDraw(); 		
		 		console.log("undo");
		 	}
		}


	 /*********************** REDO FUNCTION*************************/

		$(document).keydown(function (event) {
		    if (event.ctrlKey && event.keyCode == 89) {
		        redo1();
		    }
		});

		var redo = document.getElementById("redo");
		redo.addEventListener("click", redo1);

		function redo1(e){
			if (undoindex < undoArr.length-1){		
				undoindex++;
	 			var undo_img = new Image();
	 			undo_img.src = undoArr[undoindex];
	 			context.drawImage(undo_img,0,0);
	 			frameDraw();
	 			console.log("redo");
			}
		}


		/*********************** NEW ANIMATES FILE FUNCTION*************************/



		/*********************** OPEN ANIMATES FILE FUNCTION*************************/



		/*********************** SAVE ANIMATES FUNCTION*************************/



		/*********************** IMPORT FILE FUNCTION*************************/



 		/*********************** CUT FUNCTION*************************/



  		/*********************** COPY FUNCTION*************************/




   		/*********************** PASTE FUNCTION*************************/



   		/*********************** SELECT FUNCTION*************************/



   		/*********************** PAINT FILL FUNCTION*************************/



		/********************** TEXT FUNCTION *********************/
		var onText = function(){

			temp_context.clearRect(0,0, temp_canvas.width, temp_canvas.height);

			var x = Math.min(mouse.x,start_mouse.x);
			var y = Math.min(mouse.y, start_mouse.y);
			var width = Math.abs(mouse.x - start_mouse.x);
			var height = Math.abs(mouse.y - start_mouse.y);

			textarea.style.left = x + 'px';
			textarea.style.top = y + 'px';
			textarea.style.width = width + 'px';
			textarea.style.height = height + 'px';
			textarea.style.display = 'block';
	
		};


		/********************** STRAIGHT LINE FUNCTION *********************/

		var onLine = function() {

			temp_context.clearRect(0,0, temp_canvas.width,temp_canvas.height);

			temp_context.beginPath();
			temp_context.moveTo(start_mouse.x, start_mouse.y);
			temp_context.lineTo(mouse.x, mouse.y);
			temp_context.stroke();
			temp_context.closePath();
		};


		/********************** CURVED LINE FUNCTION *********************/
		var cpoints = [];

		var onCLine = function() {

			//Save all points in array
			cpoints.push({x:mouse.x, y:mouse.y});

			if(cpoints.length <5){
				var b = cpoints[0];
				temp_context.beginPath();
				temp_context.arc(b.x, b.y, temp_context.lineWidth / 2, 0, Math.PI * 2, !0 );
				temp_context.fill();
				temp_context.closePath();
				return;
			}

			temp_context.clearRect(0,0, temp_canvas.width,temp_canvas.height);

			temp_context.beginPath();
			temp_context.moveTo(cpoints[0].x, cpoints[0].y);

			for(var i = 1; i< cpoints.length - 2; i++){
				var xc = (cpoints[i].x + cpoints[i+1].x)/2;
				var yc = (cpoints[i].y + cpoints[i+1].y)/2;
				temp_context.quadraticCurveTo(cpoints[i].x, cpoints[i].y, xc, yc);
			}
			temp_context.quadraticCurveTo(cpoints[i].x, cpoints[i].y, cpoints[i+1].x, cpoints[i+1].y);
			temp_context.stroke();
			temp_context.closePath();
		};


		/********************** RECTANGLE FUNCTION *********************/
		var onTriangle = function(){
			temp_context.clearRect(0,0, temp_canvas.width,temp_canvas.height);

			var x = Math.min(mouse.x, start_mouse.x);
			var y = Math.min(mouse.y, start_mouse.y);
			var width = Math.abs(mouse.x - start_mouse.x);
			var height = Math.abs(mouse.y - start_mouse.y);

			temp_context.beginPath();
			temp_context.moveTo(x,y);
			temp_context.lineTo(x + width / 2, y + height);
			temp_context.lineTo(x - width / 2, y + height);
			temp_context.lineTo(x,y);
			temp_context.stroke();
			temp_context.closePath();
		};


		/********************** DIAMOND FUNCTION *********************/
		var onDiam = function(){

			temp_context.clearRect(0,0, temp_canvas.width,temp_canvas.height);

			var x = Math.min(mouse.x, start_mouse.x);
			var y = Math.min(mouse.y, start_mouse.y);
			var width = Math.abs(mouse.x - start_mouse.x);
			var height = Math.abs(mouse.y - start_mouse.y);

			temp_context.beginPath();
			temp_context.moveTo(x,y);
			temp_context.lineTo(x + width / 2, y + height);
			temp_context.lineTo(x, y + height +width);
			temp_context.lineTo(x-width/2, y + height);
			temp_context.lineTo(x,y);
			temp_context.stroke();
			temp_context.closePath();

		};


		/********************** HEART FUNCTION *********************/
		var onHeart = function(){

			temp_context.clearRect(0,0, temp_canvas.width,temp_canvas.height);

			temp_context.beginPath();

			var x = Math.min(mouse.x, start_mouse.x);
			var y = Math.min(mouse.y, start_mouse.y);
			var width = Math.abs(mouse.x - start_mouse.x);
			var height = Math.abs(mouse.y - start_mouse.y);

			temp_context.beginPath();
    		temp_context.moveTo(75,40);
               
    		temp_context.bezierCurveTo(75,37,70,25,50,25);
    		temp_context.bezierCurveTo(20,25,20,62.5,20,62.5);
          
    		temp_context.bezierCurveTo(20,80,40,102,75,120);
    		temp_context.bezierCurveTo(110,102,130,80,130,62.5);
        	    
   			temp_context.bezierCurveTo(130,62.5,130,25,100,25);
   			temp_context.bezierCurveTo(85,25,75,37,75,40);

    		temp_context.stroke();
    		temp_context.closePath();

		};


		/********************** RECTANGLE FUNCTION *********************/

		var onRect = function(){
			temp_context.clearRect(0,0, temp_canvas.width,temp_canvas.height);

			var x = Math.min(mouse.x, start_mouse.x);
			var y = Math.min(mouse.y, start_mouse.y);
			var width = Math.abs(mouse.x - start_mouse.x);
			var height = Math.abs(mouse.y - start_mouse.y);
			temp_context.strokeRect(x,y, width, height);
		};


		/********************** SQUARE FUNCTION *********************/
		var onSquare = function(){
			temp_context.clearRect(0,0, temp_canvas.width,temp_canvas.height);

			var x = Math.min(mouse.x, start_mouse.x);
			var y = Math.min(mouse.y, start_mouse.y);
			var width = Math.abs(mouse.x - start_mouse.x);
			var height = width;
			temp_context.strokeRect(x,y, width, height);
		};


		/********************** CIRCLE FUNCTION *********************/

		var onCircle = function(){
			temp_context.clearRect(0,0, temp_canvas.width, temp_canvas.height);

			var x = (mouse.x + start_mouse.x) / 2;
			var y = (mouse.y + start_mouse.y) / 2;

			var radius = Math.max(Math.abs(mouse.x - start_mouse.x), Math.abs(mouse.y - start_mouse.y)) / 2;

			temp_context.beginPath();
			temp_context.arc(x,y,radius,0, Math.PI*2, false);
			temp_context.stroke();
			temp_context.closePath();
		};


		/********************** OVAL FUNCTION *********************/

		var onOval = function(){
			temp_context.clearRect(0,0, temp_canvas.width, temp_canvas.height);

			var x = Math.min(mouse.x, start_mouse.x);
			var y = Math.min(mouse.y, start_mouse.y);
			var w = Math.abs(mouse.x - start_mouse.x);
			var h = Math.abs(mouse.y - start_mouse.y);
			drawOval(temp_context, x,y,w,h);
		};

		function drawOval(ctx, x, y, w, h){
			var kappa = .5522848;
    	 	ox = (w / 2) * kappa, // control point offset horizontal
     		oy = (h / 2) * kappa, // control point offset vertical
      		xe = x + w,           // x-end
      		ye = y + h,           // y-end
      		xm = x + w / 2,       // x-middle
      		ym = y + h / 2;       // y-middle
 
  			temp_context.beginPath();
  			temp_context.moveTo(x, ym);
  			temp_context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  			temp_context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  			temp_context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  			temp_context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  			temp_context.closePath();
  			temp_context.stroke();
		}


		/********************** BRUSH FUNCTION *********************/
		var points = [];

		var onPencil = function(){
			temp_context.lineWidth = 1;
			temp_context.lineJoin = 'square';
			points.push({x:mouse.x, y:mouse.y});

			if(points.length <3){
				var b = points[0];
				temp_context.beginPath();
				temp_context.arc(b.x, b.y, temp_context.lineWidth / 2, 0, Math.PI * 2, !0 );
				temp_context.fill();
				temp_context.closePath();
				return;
			}

			temp_context.clearRect(0,0, temp_canvas.width, temp_canvas.height);

			temp_context.beginPath();
			temp_context.moveTo(points[0].x, points[0].y);

			for( var i = 1; i < points.length - 2; i++){
				var c = (points[i].x + points[i+1].x) / 2;
				var d = (points[i].y + points[i+1].y) / 2;
				temp_context.quadraticCurveTo(points[i].x, points[i].y,c,d);
			}

			temp_context.quadraticCurveTo( points[i].x, points[i].y, points[i+1].x, points[i+1].y);
			temp_context.stroke();
		
		}

		/********************** BRUSH FUNCTION *********************/
		var points = [];

		var onBrush = function(){
			//Save all points in array
			points.push({x:mouse.x, y:mouse.y});

			if(points.length <3){
				var b = points[0];
				temp_context.beginPath();
				temp_context.arc(b.x, b.y, temp_context.lineWidth / 2, 0, Math.PI * 2, !0 );
				temp_context.fill();
				temp_context.closePath();
				return;
			}

			temp_context.clearRect(0,0, temp_canvas.width, temp_canvas.height);

			temp_context.beginPath();
			temp_context.moveTo(points[0].x, points[0].y);

			for( var i = 1; i < points.length - 2; i++){
				var c = (points[i].x + points[i+1].x) / 2;
				var d = (points[i].y + points[i+1].y) / 2;
				temp_context.quadraticCurveTo(points[i].x, points[i].y,c,d);
			}

			temp_context.quadraticCurveTo( points[i].x, points[i].y, points[i+1].x, points[i+1].y);
			temp_context.stroke();
		
		};


		/********************** ERASE FUNCTION *********************/
		var onErase = function(){
			curColour = 'white';	
  			temp_context.strokeStyle = curColour;
  			temp_context.fillstyle =curColour;
			onBrush();
		}

 		/********************** FRAME SELECT *********************/
		
 		var frame_select = "frmimg"+curFrame;
  		$("#img div").on('click', function(){
  			frame_select = $(this).attr('id');
  			console.log("frame selected: "+frame_select);
 		})


		/*************************DRAW FRAME***********************/
		var cnvs1 = document.getElementById("canvas1");
		function frameDraw() {
			var frame = new Image();
			frame = cnvs1.toDataURL("image/png");

			if ((curFrame == 1) && (images.length == 0)){
				images.push(frame);
			}

			else if( curFrame == images.length){
				images[curFrame-1] = frame;
			}

			else if (curFrame > images.length){
				images.push(frame);
			}
			console.log("Length of frame array: " + images.length);
		
			var val = "frmimg"+curFrame;
			var frameimg = document.getElementById(val);
			frameimg.src = frame;	
		};


		/*************************NEW FRAME************************/
		var addFrame = document.getElementById("addframe");
		addFrame.addEventListener("click", function(e){
			temp_context.clearRect(0,0, temp_canvas.width, temp_canvas.height);
			context.clearRect(0,0,canvas.width, canvas.height);

			var frame = new Image();
			frame = cnvs1.toDataURL("image/png");		

			var img = document.createElement("img");
			img.className = "frame";
			img.setAttribute("id", "frmimg"+(curFrame+1));
			$("#frmimg"+curFrame).after(img);
			reset1();
			curFrame++;
			frameDraw();
		});

		function reset1(){
			undoArr = [];
			undoindex= -1;
		}


		/*************************COPY FRAME************************/
		var copyFrame = document.getElementById("copyframe");
		copyFrame.addEventListener("click", function(e){
			temp_context.clearRect(0,0, temp_canvas.width, temp_canvas.height);
			context.clearRect(0,0,canvas.width, canvas.height);

			var cimg = new Image();
			cimg.src = images[images.length -1];
			context.drawImage(cimg,0,0);
			frameDraw();

			var frame = new Image();
			frame = cnvs1.toDataURL("image/png");

			var img = document.createElement("img");
			img.className = "frame";
			img.setAttribute("id", "frmimg" + (curFrame+1));
			$("#frmimg"+curFrame).after(img);
			reset1();
			curFrame++;
			frameDraw();

		});


		/*************************DELETE FRAME************************/
		var delFrame = document.getElementById("delframe");
		delFrame.addEventListener("click", function(e){
			if(curFrame > 1){
				temp_context.clearRect(0,0, temp_canvas.width, temp_canvas.height);
				context.clearRect(0,0,canvas.width, canvas.height);

				$("#frmimg"+curFrame).remove();
				images.pop();
				curFrame--;

				var curImg = new Image();
				curImg.src = images[images.length-1];
				context.drawImage(curImg,0,0);
				reset1();
			}		

		});


		/***********************PLAY ANIMATION*********************/
		var play = document.getElementById("play");
		var j = 0;
		var id;
		play.addEventListener("click", function(e){
			var time = parseInt(document.getElementById('frms').value);
			var sec = 60/time;
			var msec = sec*1000;
			for(var i=0; i<images.length; i++){
				var playScreen = document.createElement("img");
				playScreen.setAttribute("id", "playDiv");
				playScreen.src = images[i];
				$("#canvas").prepend(playScreen);
				$("#playDiv").delay(msec*(i+1)).fadeIn(msec-100).fadeOut(100);
				console.log("Frame played:" + i);
			}
			$("#playDiv").remove();
		});
	

}, false); }
