// NEW: to save memory, we need 2 line buffers:
// so now g[][] could be just the current status of each cell;
if (typeof require === "function") require("./utils.js");

function load_buffer(g, b, m, n, i, writeback){
	function get_sum_at(j, l){
		var sum = 0;
		for (var k=-1; k<2; k++){
				sum += g[(i+k+m)%m][(j+l+n)%n];
		}
		return sum;
	}

	var sum = [];
	// initialize sum[0] and sum[1];
	for (var l=-1; l<1; l++){
		sum[l+1] = get_sum_at(0, l);
	}
	
	var t;
	for (var j=0; j<n; j++){
		if (writeback){
			if (j>0){ g[(i-1+m)%m][j] = b[j];}
			else { t = b[0];} // save b[0] for later writeback;
		}
		
		// calc new b[j];
		sum[2] = get_sum_at(j, 1);
		var s = sum[0] + sum[1] + sum[2] - g[i][j];
		if (s>2) { b[j] = 1;}
		else if (s<2) { b[j] = 0;}
		else { b[j] = g[i][j]; }

		sum[0] = sum[1]; sum[1] = sum[2];
	}
	if (writeback) {g[(i-1+m)%m][0] = t;}
}

function update_field(g, m, n){
	var b = []; // buffer of length n: storing next generation g[i] and g[i-1] values;
	var t;
	var b0 = []; // save for wrtie back to g[0];

	// load up buffer with g[0][j];
	load_buffer(g, b0, m, n, 0, false);
	if (m>1) {load_buffer(g, b, m, n, 1, false);}
				
	for (var i = 2; i<m; i++){
		//b[n] = load_buffer(g, b, m, n, i, n-1, n-1, false);
		//load_buffer(g, b, m, n, i, n-1, n-1, false);
		load_buffer(g, b, m, n, i, true);
		// now b[n-1]'s value is based on updated g[i-1][0] (sum[2]);
		// so let's take the saved b[n];
		
	}
	if (m>1) { g[m-1] = b.slice(0);}
	g[0] = b0.slice(0);
}

function print_g(g, m, n){
	debug.log(1, "g=");
	debug.log(1, g);
}
// tests

debug.setLevel(4);

// var g = [
// 	[1, 0, 0, 1, 0, 0],
// 	[1, 1, 0, 0, 1, 0],
// 	[0, 0, 0, 0, 0, 0],
// 	[1, 0, 0, 0, 1, 0],
// 	[0, 0, 0, 1, 0, 1],
// ];

var g = [
	[1, 0, 0, 1, 0, 0],
	[1, 1, 0, 0, 1, 0],
	[0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 0, 1],
];

var m = g.length; var n = g[0].length;
var c = 5;
print_g(g, m, n);
for (var i=0; i<c; i++){	
	update_field(g, m, n);
	print_g(g, m, n);
}