function Canvas(id, paths) {
	var self = this;
	self.canvas = document.getElementById(id);
	self.context = self.canvas.getContext("2d");
	self.paths = paths;

	self.map = new Transformation();
	self.map.push([1,0,0,1,0,0]);
	self.map.push([1,0,0,1,0,0]);

	self.zoom = 0;
	self.mouse = new tools.Mouse(self.canvas);

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
			if (self.context.isPointInPath(self.paths[i].path, self.mouse.pos[0], self.mouse.pos[1])) {
				mod = modhl;
			}
			self.paths[i].draw(self.context, mod);
		}
	}

	self.mouse.move = function(pos) {
		var elempos = document.getElementById("position");
		var pos = self.map.backward(pos);
		elempos.innerHTML = "{"+Math.round(pos[0]*100)/100+","+Math.round(pos[1]*100)/100+"}";
		self.draw();
	};

	self.mouse.wheel = function(dz) {
		self.zoom -= dz;
		var f = Math.pow(1.6, self.zoom);
		var df = Math.pow(1.6, -dz);
		var m = self.map.stack[0];
		var p = mulimv(self.map.stack[1], self.mouse.pos);
		m[0] = f;
		m[3] = f;
		m[4] = (m[4] - p[0])*df + p[0];
		m[5] = (m[5] - p[1])*df + p[1];
		self.map.update();
		var elemzoom = document.getElementById("zoom");
		elemzoom.innerHTML = Math.round(f*10000)/100+"%";
		self.draw();
	};

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
