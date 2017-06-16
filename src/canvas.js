function Canvas(id, paths) {
	var self = this;
	self.canvas = document.getElementById(id);
	self.context = self.canvas.getContext("2d");
	self.paths = paths;

	self.map = new Transformation();
	self.map.push([1,0,0,1,0,0]);
	self.map.push([1,0,0,1,0,0]);

	self.zoom = 0;
	self.mx = 0;
	self.my = 0;

	var modhl = {
		fill: function (col) {
			var ret = [0, 0, 0, 1.0];
			for (var i = 0; i < 3; ++i) {
				ret[i] = 1.1*col[i];
			}
			return ret;
		}
	}
	self.draw = function () {
		self.context.setTransform(1,0,0,1,0,0);
		self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
		self.map.apply(self.context);
		for (var i = 0; i < self.paths.length; ++i) {
			var mod = undefined;
			if (self.context.isPointInPath(self.paths[i].path, self.mx, self.my)) {
				mod = modhl;
			}
			self.paths[i].draw(self.context, mod);
		}
	}

	self.canvas.addEventListener("mousemove", function(e) {
		if(e.offsetX) {
			self.mx = e.offsetX;
			self.my = e.offsetY;
		} else if(e.layerX) {
			self.mx = e.layerX;
			self.my = e.layerY;
		}
		var elempos = document.getElementById("position");
		var pos = self.map.backward([self.mx,self.my]);
		elempos.innerHTML = "{"+Math.round(pos[0]*100)/100+","+Math.round(pos[1]*100)/100+"}";
		self.draw();
	});

	self.canvas.addEventListener("wheel", function(e) {
		var dz = (e.deltaY > 0) - (e.deltaY < 0);
		self.zoom -= dz;
		var f = Math.pow(1.6, self.zoom);
		var df = Math.pow(1.6, -dz);
		var m = self.map.stack[0];
		var p = mulimv(self.map.stack[1], [self.mx, self.my]);
		m[0] = f;
		m[3] = f;
		m[4] = (m[4] - p[0])*df + p[0];
		m[5] = (m[5] - p[1])*df + p[1];
		self.map.update();
		var elemzoom = document.getElementById("zoom");
		elemzoom.innerHTML = Math.round(f*10000)/100+"%";
		self.draw();
	});

	var left = document.getElementById("left");
	var right = document.getElementById("right");
	self.resize = function () {
		var rw = left.offsetWidth, lw = right.offsetWidth;
		var cnt = document.getElementById("canvas_container");
		var w = window.innerWidth - rw - lw;
		var h = window.innerHeight;
		self.canvas.width = w;
		self.canvas.height = h;
		var cm = self.map.stack[1];
		cm[4] = w/2;
		cm[5] = h/2;
		self.map.update();
		console.log("resize{"+w+","+h+"}");
		self.draw();
	}
	window.addEventListener("resize", self.resize);
}
