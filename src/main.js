function main() {
	var heart = new Path({
		points: [
			75, 40,
			75, 37, 70, 25, 50, 25,
			20, 25, 20, 62.5, 20, 62.5,
			20, 80, 40, 102, 75, 120,
			110, 102, 130, 80, 130, 62.5,
			130, 62.5, 130, 25, 100, 25,
			85, 25, 75, 37, 75, 40
		],
		fill: "#CC0000",
		stroke: {
			color: "#FF0000",
			width: 4
		}
	});
	heart.stroke = null;

	var cnv = document.getElementById('cnv');
	var ctx = cnv.getContext('2d');

	function draw(x, y) {
		ctx.setTransform(1,0,0,1,0,0);
		ctx.clearRect(0, 0, cnv.width, cnv.height);
		for (var iy = 0; iy < 4; ++iy) {
			for (var ix = 0; ix < 4; ++ix) {
				ctx.setTransform(1,0,0,1,120*ix,100*iy);
				if (ctx.isPointInPath(heart.path, x, y)) {
					heart.fill = "#FF4400";
				} else {
					heart.fill = "#CC0000";
				}
				heart.draw(ctx);
			}
		}
	}

	cnv.onmousemove = function(e) {
		var x, y;
		if(e.offsetX) {
			x = e.offsetX;
			y = e.offsetY;
		} else if(e.layerX) {
			x = e.layerX;
			y = e.layerY;
		}
		
		draw(x, y);
	}

	draw();
}

window.onload = function() {
	main();
}
