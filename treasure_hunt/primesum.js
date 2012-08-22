if (typeof require === "function") require("./utils.js");

function getPrimes(p, n){
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

// h-l > 1
function get_mp(p, ll, hh, mv){
	debug.log(5, "!! get_mp():");
	debug.log(7, arguments);
	var i, h = hh, l=ll;
	for (;;){
		i=Math.floor((h+l)/2);
		if (p[i]<=mv){
			if (p[i+1]>=mv){
				return i;
			} else{
				l = i;
			}
		} else { h = i;}
	}
}

// input: k>=2, p has up to idx+1 prime numbers;
function getSubPrimes(p, idx, k){
	debug.log(5, "!! getSubPrimes():");
	debug.log(7, arguments);
	getPrimes(p, idx+2);
	
	var sum = 0;
	var mp = get_mp(p, 0, idx, Math.floor(p[idx]/k));
	var i = mp - Math.floor(k/2) < 0 ? 0 : mp - Math.floor(k/2);
	for (var j=i; j<i+k; j++){ sum += p[j];}
	debug.log(6, "i: "+i+", p["+idx+"]: "+p[idx]+", sum: "+sum);
	debug.log(8, "getSubPrimes(): p["+i+"] ("+p[i]+") * "+k+
		" ("+p[i]*k+") < p["+idx+"] ("+p[idx]);
	debug.log(8, "getSubPrimes(): p["+(i+k-1)+"] ("+p[i+k-1]+") * "+k+
		" ("+p[i+k-1]*k+") > p["+idx+"] ("+p[idx]);

	if (sum < p[idx]){
		while (sum < p[idx] && i<=mp){
			i++;
			sum += p[i+k-1]-p[i-1];
			debug.log(6, "new i: "+i+", new sum: "+sum);
		}
	} else if (sum > p[idx]){
		while(sum > p[idx] && i>0 && i+k>mp){
			i--;
			sum -= p[i+k]-p[i];
			debug.log(6, "new i: "+i+", new sum: "+sum);
		}
	}

	if (sum === p[idx]){return i;}
	return -1; // else

	while (p[i+k-1]*k < p[idx]) {i++;}
	debug.log(4, "getSubPrimes(): p["+(i+k-1)+"] ("+p[i+k-1]+") * "+k+
		" ("+p[i+k-1]*k+") > p["+idx+"] ("+p[idx]);
	while (p[i]*k < p[idx]){
		if (sum === 0){
			for (var j=i; j<i+k; j++){ sum += p[j];}
		} else{
			sum += p[i+k]-p[i];
		}
		debug.log(4, "sum: "+sum+", i: "+i);
		if (sum === p[idx]){
			return i;
		}
		i++;
	}
	return -1;
}

// start > k;
function find_smallest_idx(p, start, k){
	debug.log(5, "!! find_smallest_idx():");
	debug.log(7, arguments);
	for (var i=start; ; i++){
		//getPrimes(p, i+1);
		var j = getSubPrimes(p, i, k);
		if (j>=0) return i;
	}
}

// tests;
debug.setLevel(2);

var p=[2, 3];
var k=[515, 9, 7, 3];
//var k=[9, 7, 3];
//var k=[6, 3];

//debug.log(1, find_smallest_idx(p, 6, 6));
//debug.log(2, "getPrimes("+n+"): ");
//p = getPrimes(p, 10);
//getPrimes(p, k[0]);
//debug.log(2, p);

var found = false;
var start = k[0];

debug.log(4, "start: "+start);
while (!found){
	start = find_smallest_idx(p, start+1, k[0]);
	debug.log(2, "==== start: "+start);
	found = true;
	//break;
	for (var i=1; i<k.length; i++){
		var idx = getSubPrimes(p, start, k[i]);
		debug.log(5, "idx: " + idx);
		if (idx<0){
			found = false;
			break;
		}

		debug.log(5, "!! k["+i+"]: "+k[i]);
	}
}

debug.log(1, "res: p["+start+"]: "+p[start]);