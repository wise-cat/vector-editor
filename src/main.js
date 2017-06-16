function main() {
	var paths = [
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
			fill: [0.8, 0.2, 0.2, 1.0],
		})
	];

	var canvas = new Canvas("canvas", paths);

	canvas.resize();
	canvas.draw();
}

window.onload = function() {
	main();
}
