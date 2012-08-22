// Given a list of N coins, their values (V1, V2, ... , VN), 
// and the total sum S. Find the minimum number of coins the sum of which is S
// (we can use as many coins of one type as we want), 
// or report that it's not possible to select coins in such a way that they sum up to S. 

if (typeof require === "function") require("./utils.js");

debug.setLevel(4);

function getCoinCombo(v, s, c){
	if (undefined !== c[s] && null !== c[s]) {return c[s].length;}
	
	var min = 0;
	var mint = 0;
	for (var i=0; i<v.length; i++ ){
		var t = v[i];
		var st = s-t;
		
		if (st>0){
			var mt = getCoinCombo(v, st, c);
			if (mt === 0) {continue; }
			if (0 === min || mt < min){
				min = mt;
				mint = t;
			}
		}
	}

	if (min === 0 ){
		c[s] = null;
		return 0;
	}

	//c[s] = [];
	c[s] = c[s-mint].slice(0);
	c[s].push(mint);

	return (min+1);
}

function getCoinComboByLoop(v, s, c){
	if (s<=0) {c[s] = null; return 0;}
	//c[0] = []; // we already have c[v[i]] = [v[i]], for 0<=i< v.length;
	for (var i=1; i<=s; i++){
		for (var j=0; j<v.length; j++){
			var st = i-v[j];
			if (st<=0){ continue;}
			if (!c[st]){ throw format("c[%1] is %2!", st, c[st]);}

			if (!c[i] || c[i].length>c[st].length+1){
				c[i] = c[st].slice(0);
				c[i].push(v[j]);
			}
		}
	}
	return c[s].length;
}

// tests
var v = [1, 5, 10, 25, 50, 100];

//var ss = [86];
var ss = [-1, 0, 2, 5, 7, 10, 15, 20, 28, 98, 102, 21238]; // stackoverflow for recursion.
//var ss = [-1, 0, 2, 5, 7, 10, 15, 20, 28, 98, 102, 1238];
//var ss = [-1, 0, 2, 5, 7, 10, 15];
var c=[];
//c[84] = [50, 25, 5, 1, 1, 1, 1];
for (var i=0; i<v.length; i++ ){
	c[v[i]] = [v[i]];
}

// for (i = 0; i<ss.length; i++){
// 	var s=ss[i];
// 	debug.log(1, "min for s: %1: %2; c[%3]:", s, getCoinCombo(v, s, c), s);
// 	debug.log(1, c[s]);
// }

for (i=0; i<ss.length; i++){
	var s=ss[i];
	debug.log(1, "min for s: %1: %2; c[%3]:", s, getCoinComboByLoop(v, s, c), s);
	debug.log(1, c[s]);
	
}

//debug.log(1, c[85]);


// debug.log(1, "--- c[] -----");
// for (i=0; i<c.length; i++){
// 	if(c[i]){
// 		debug.log(1, "c[%1]:", i);
// 		debug.log(1, c[i]);
// 	}
// }

