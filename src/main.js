var map;
var zoom;
var mx, my;
var paths = [];
var canvas;
var context;

function draw() {
	context.setTransform(1,0,0,1,0,0);
	context.clearRect(0, 0, canvas.width, canvas.height);
	map.apply(context);
	for (var i = 0; i < paths.length; ++i) {
		paths[i].draw(context);
	}
	//context.isPointInPath(heart.path, mx, my);
}

function main() {
	map = new Transformation();
	map.push([1,0,0,1,0,0]);
	map.push([1,0,0,1,0,0]);

	zoom = 0;
	mx = 0;
	my = 0;

	paths.push(
		new Path({
			points: [
				75, 40,
				75, 37, 70, 25, 50, 25,
				20, 25, 20, 62.5, 20, 62.5,
				20, 80, 40, 102, 75, 120,
				110, 102, 130, 80, 130, 62.5,
				130, 62.5, 130, 25, 100, 25,
				85, 25, 75, 37, 75, 40
			],
			fill: "#CC0000"
		})
	);

	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");

	canvas.onmousemove = function(e) {
		if(e.offsetX) {
			mx = e.offsetX;
			my = e.offsetY;
		} else if(e.layerX) {
			mx = e.layerX;
			my = e.layerY;
		}
		
		var elempos = document.getElementById("position");
		var pos = map.backward([mx,my]);
		elempos.innerHTML = "{"+Math.round(pos[0]*100)/100+","+Math.round(pos[1]*100)/100+"}";
		draw();
	}

	canvas.onwheel = function(e) {
		zoom -= e.deltaY;
		var f = Math.pow(1.2, zoom);
		var m = map.stack[1];
		m[0] = f;
		m[3] = f;
		map.update();

		var elemzoom = document.getElementById("zoom");
		elemzoom.innerHTML = Math.round(f*10000)/100+"%";
		draw();
	}

	var left = document.getElementById("left");
	var right = document.getElementById("right");
	var rw = left.offsetWidth, lw = right.offsetWidth;
	function resize() {
		var cnt = document.getElementById("canvas_container");
		var w = window.innerWidth - rw - lw;
		var h = window.innerHeight;
		canvas.width = w;
		canvas.height = h;
		console.log("resize{"+w+","+h+"}");
		draw();
	}
	window.onresize = resize;

	resize();
	draw();
}

window.onload = function() {
	main();
}
