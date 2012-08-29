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
		load_buffer(g, b, m, n, i, true);
		// now b[n-1]'s value is based on updated g[i-1][0] (sum[2]);
		// so let's take the saved b[n];
		
	}
	if (m>1) { g[m-1] = b.slice(0);}
	g[0] = b0.slice(0);
}

function print_field(name, g, m, n){
	debug.log(1, name+" =");
	debug.log(1, g);
}

// test functions
function setup_test(f, h, g, m, n){
	for (var i=0; i<m; i++){
		f[i] = g[i].slice(0);
		h[i] = [];
	}
}

function update_wo_buffer(seq_pair){
	var f = seq_pair.f, h = seq_pair.h;
	for (var i=0; i<m; i++){
		for (var j=0; j<n; j++){
			var sum = 0;
			for (var k=-1; k<2; k++){
				for (var l=-1; l<2; l++){
					sum += f[(i+m+k)%m][(j+n+l)%n];
				}
			}
			sum -= f[i][j];
			if (sum>2) { h[i][j] = 1;}
			else if (sum<2) { h[i][j] = 0;}
			else { h[i][j] = f[i][j]; }
		}
	}

	// swap h & f for next update;
	seq_pair.h = f;
	seq_pair.f = h;
}

function compare_fields(f, g, m, n){
	for (var i=0; i<m; i++){
		for (var j=0; j<n; j++){
			if (f[i][j] !== g[i][j]){
				debug.log(4, "Err: i: %1, j: %2, f[i][j]: %3, g[i][j]: %4", i, j, f[i][j], g[i][j]);
				return false;
			}
		}
	}
	return true;
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
var f = [], h = [];

setup_test(f, h, g, m, n);
debug.log(4, compare_fields(f, g, m, n));
print_field("g", g, m, n);
print_field("f", f, m, n);

var seq_pair = {f: f, h: h};

for (var i=0; i<c; i++){	
	update_field(g, m, n);
	update_wo_buffer(seq_pair);
	debug.log(4, compare_fields(seq_pair.f, g, m, n));
	print_field("g", g, m, n);
	print_field("f", seq_pair.f, m, n);
}
