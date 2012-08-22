// See coinline.cpp for the Problem and iterative solution in c++;

if (typeof require === "function") require("./utils.js");
debug.setLevel(4);

//assert 0<=i<=j<a.length
function printMoves(a, p, i, j){
	var whose = ["Your", "My"];
	var score = [0, 0];
	var myTurn = 1;
	
	for (var k=i, l=j; k<l;){
		if (findP(a, p, k+1, l) < findP(a, p, k, l-1)){
			score[myTurn] += a[k]; k++;
			debug.log(1, whose[myTurn]+" move: left");
		} else{
			score[myTurn] += a[l]; l--;
			debug.log(1, whose[myTurn]+" move: right");
		}
		debug.log(1, "score: "+score[myTurn]);
		myTurn = 1 - myTurn; 
	}
	score[myTurn] += a[l]; ;
	debug.log(1, whose[myTurn]+" move: right");
	debug.log(1, "score: "+score[myTurn]);
}

// assert: 0=<i<=j<a.length;
function findP(a, p, i, j){
	debug.log(5, "----------------------------")
	debug.log(5, "i: "+i + ", j: "+j+", p =");
	debug.log(5, p);
	if (p[i] !== undefined && p[i][j] !== undefined) return p[i][j];
	if (i === j){
		if (p[i] === undefined) p[i] = [];
		p[i][i] = a[i];
		return a[i];
	}
	if (i === j-1) {
		if (p[i] === undefined) p[i] = [];
		p[i][j] = Math.max(a[i], a[j]);
		return p[i][j];
	}

	var m = findP(a, p, i+2, j);
	var n = findP(a, p, i+1, j-1);
	var o = findP(a, p, i, j-2);
	p[i][j] = Math.max(a[i]+Math.min(m, n), a[j]+Math.min(n, o));
	debug.log(4, "m: "+m+", n: "+n+", o: "+o+", p["+i+"]["+j+"]: "+p[i][j]);
	return p[i][j];
}

function findPByLoop(a, p, i, j){
	debug.log(5, "----------------------------")
	debug.log(5, "i: "+i + ", j: "+j+", p =");
	debug.log(5, p);

	for (var k=0; k<j; k++){
		if (p[k] === undefined) p[k] = [];
		p[k][k] = a[k];
		p[k][k+1] = Math.max(a[k], a[k+1]);
	}
	if (p[j] === undefined) p[j] = [];
	p[j][j] = a[j];
	debug.log(5, p);

	for (k=2; k<j+1; k++){
		for (var l=0; l<j-k+1; l++){
			var m = p[l+2][l+k];
			var n = p[l+1][l+k-1];
			var o = p[l][l+k-2];
			p[l][l+k] = Math.max(a[l]+Math.min(m, n), a[l+k]+Math.min(n, o));
			debug.log(4, "m: "+m+", n: "+n+", o: "+o+", p["+l+"]["+(l+k)+"]: "+p[l][l+k]);
		}
	}
}

// tests;
var a = [10, 25, 50, 5, 10, 5, 5, 10, 25, 50, 100];
//var a = [10, 25, 50, 5, 10, 5];
var p = [];
//for (var i=0; i<a.length; i++){ p[i]=[];}
debug.log(1, "####### res: " + findP(a, p, 0, a.length-1));
debug.setLevel(6);
findPByLoop(a, p, 0, a.length-1);
//printMoves(a, p, 0, a.length-1);
