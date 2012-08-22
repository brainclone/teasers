// NEW: to save memory, we need 2 line buffers:
// so now g[][] could be just the current status of each cell;
if (typeof require === "function") require("./utils.js");

function update_row (n, b, b1, b2){
	for (var j=0; j<n; j++){
		var sum = 0; var bs = [b1, b, b2];
		for (var l=0; l<3; l++){
			for (var k=-1; k<2; k++){
				sum +=bs[l][(j+k+n)%n];
			}
		}
		sum -= b[j];
		if (sum>2) {b[j] = 1;}
		else if (sum <2) {b[j] = 0;}
	}
}

function update_field(g, m, n){
	var b1, b, b2, b0; // b0 is for saving the first row
	
	b1 = g[m-1].slice(0);
	for (var i = 0; i<m; i++){
		var l1 = (i+m-1)%m; var l2 = (i+1)%m;
		b = g[i].slice(0); b2 = g[l2];
		update_row(n, b, b1, b2);
		// swap (via copy) b and g[i];
		b1 = g[i].slice(0);
		if (i !== 0) {g[i] = b.slice(0);}
		else b0 = b.slice(0);
	}
	g[0] = b0.slice(0);
}

function print_g(g, m, n){
	debug.log(1, "g=");
	debug.log(1, g);
}
// tests

debug.setLevel(4);

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




