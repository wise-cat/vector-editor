function Canvas(id, paths) {
	var self = this;
	self.canvas = document.getElementById(id);
	self.context = self.canvas.getContext("2d");
	self.paths = paths;

	self.map = new Transformation();
	self.map.push([1,0,0,1,0,0]);
	self.map.push([1,0,0,-1,0,0]);

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
		var bpos = self.map.backward(self.mouse.pos);
		document.getElementById("position").innerHTML = "{"+Math.round(bpos[0]*100)/100+","+Math.round(bpos[1]*100)/100+"}";
		document.getElementById("zoom").innerHTML = Math.round(Math.pow(1.6, self.zoom)*10000)/100+"%";
	}

	self.mouse.move = function(pos) {
		self.draw();
	};

	self.mouse.wheel = function(dz) {
		self.zoom = Math.round(self.zoom) - dz;
		var f = Math.pow(1.6, self.zoom);
		var df = Math.pow(1.6, -dz);
		var m = self.map.stack[0];
		var p = mulimv(self.map.stack[1], self.mouse.pos);
		m[0] = f;
		m[3] = f;
		m[4] = (m[4] - p[0])*df + p[0];
		m[5] = (m[5] - p[1])*df + p[1];
		self.map.update();
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

	self.fit = function () {
		if (self.paths.length < 1) { return; }
		var b = self.paths[0].bounds;
		var l = b[0], r = b[2], u = b[1], d = b[3];
		for (var i = 0; i < self.paths.length; ++i) {
			b = self.paths[i].bounds;
			if (b[0] < l) { l = b[0]; }
			if (b[1] > u) { u = b[1]; }
			if (b[2] > r) { r = b[2]; }
			if (b[3] < d) { d = b[3]; }
		}
		var m = self.map.stack[0];
		var w = 1.0*self.canvas.width, h = 1.0*self.canvas.height;
		var f = 1.0;
		if ((r - l)/(u - d) > w/h) {
			f = w/(r - l);
		} else {
			f = h/(u - d);
		}
		m[0] = f;
		m[3] = f;
		m[4] = -0.5*(r + l)*f;
		m[5] = -0.5*(u + d)*f;
		
		self.zoom = Math.log(f)/Math.log(1.6);
		self.map.update();
		self.draw();
	};
	document.getElementById("fit").addEventListener("click", self.fit);
}
