// big Combination numbers;
if (typeof require === "function"){
	require("./utils.js");
	//require("./primesum.js").getPrimes;
}

function getPrimes(p, n){
	//debug.setLevel(7);
	while (p.length<n){
		for (var found = false, t = p[p.length-1]+2; !found; t+=2){
			for (var i=0; i<p.length && p[i]<Math.sqrt(t); i++){
				if (t/p[i] === Math.floor(t/p[i])){
					break;
				}
			}
			if (i>=p.length || p[i]>Math.sqrt(t)){
				found = true;
				debug.log(7, t);
				p.push(t);
			}
		} 
	}
	debug.log(7, "getPrimes(): p["+(p.length-1)+"]: "+p[p.length-1]);
	return p;
}

function getFactors(n, x){
	//debug.setLevel(7);
	var p = [2, 3];
	for (var i=2; p[i-1]<n+1; i++){
		getPrimes(p, i+1);
		debug.log(7, p, i, n);
	}
	debug.log(6, p, n);
	for (var j=0; j<i; j++){
		while (n/p[j] === Math.floor(n/p[j])){
			x.push(p[j]);
			n /= p[j];
		}
	}
	debug.log(5, "x =");
	debug.log(5, x);
	return x;
}

// The representation of 0 is [0];
function getRep(r, n, d){
	var t=n; var i;
	for (i=0; t>0; i++){
			r[i] = t % d;
			t = Math.floor(t/d);
	}
	if (n === 0){ r[0] = 0; i=1;}
	r.splice(i, r.length-i);
	return r;
}

function addR(r, m, n, d){
	var a, b;
	if (m.length<=n.length){ a=m; b=n;}
	else { a=n; b=m; }

	var s = [0, 0];
	for (var i=0; i<a.length; i++){
		if (undefined === s[1]){ s[1] = 0;}
		getRep(s, a[i]+b[i]+s[1], d);
		r[i] = s[0];
	}
	for (i=a.length; i<b.length; i++){
		if (undefined == s[1]){ s[1] = 0;}
		getRep(s, b[i]+s[1], d);
		r[i] = s[0];
	}
	// add the last s[1];
	if (undefined !== s[1]) {r[b.length] = s[1];}
	for (i=r.length-1; i>0 && r[i]===0; i--){
		r.splice(i, 1);
	}

	return r; 
}

function multiR(r, m, x, d){
	var s=[0, 0];
	for (var i=0; i<m.length; i++){
		if (undefined === s[1]){ s[1] = 0;}
		getRep(s, m[i]*x+s[1], d);
		r[i] = s[0];
	}
	if (undefined !== s[1]) {r[m.length] = s[1];}
	for (i=r.length-1; i>0 && r[i]===0; i--){
		r.splice(i, 1);
	}

	return r;
}

function bigM(f, d){
	var r = [1];
	//var t = [], s = [];
	for (var i=0; i<f.length; i++){
		if (f[i] === 1) {continue;}
		var m = [];
		getRep(m, f[i], d);
		var s = [];
		var t;
		for (var j=m.length-1; j>0; j--){
			t=[];
			multiR(t, r, m[j], d);
			debug.log(7, "t=");
			debug.log(7, t);
			addR(s, s, t, d);
			debug.log(7, "s=");
			debug.log(7, s);
			s.unshift(0); // s = s*d;
		}
		t = [];
		multiR(t, r, m[0], d);
		debug.log(7, "t=");
		debug.log(7, t);
		addR(r, s, t, d);
		debug.log(6, "r=");
		debug.log(6, r);
	}
	return r.reverse().join("");
}

function bigC(n, r){
	var f = [], x;
	var m = Math.min(r, n-r);
	for (var i=0; i<m; i++){
		f[i] = n+i-m+1;
	}
	debug.log(5, "f.1 =")
	debug.log(5, f);
	for (i=2; i<m+1; i++){
		x = [];
		getFactors(i, x);
		while (x.length > 0){
			var d = x.shift();
			for (var j=0; j<m; j++){
				if (f[j]/d === Math.floor(f[j]/d)){
					f[j] /= d;
					break;
				}		
			}
		}	
	}
	debug.log(5, "f.2 =");
	debug.log(5, f);

	return bigM(f, 10);
}

//tests;
debug.setLevel(5);
// var x = [];
// debug.log(5, getFactors(18, x))
var d = 10;
debug.log(1, "res: "+bigC(43+49,43));
var f=[9, 8, 7, 6, 5, 4, 3, 2];
debug.log(1, "P(9,8): "+bigM(f, d));
// var r = [1];
// var n = 1553234, o = 999999343;
// // // var n = 11, o = 88;
// // var n = 0, o = 88;
// var d = 10;
// // var m = [], l=[];
// //   debug.log(5, m = getRep(r,n,d));
// // l = getRep(l, o, d);
// // // debug.log(5, l)
// //  r = [];
// // // debug.log(5, n+o);
// // // debug.log(5, addR(r, m, l, d));
// // //debug.log(5, n*9);
// // //debug.log(5, multiR(r, m, 9, d));
// debug.log(5, n*o);
// debug.log(5, bigM([n, o], d));
