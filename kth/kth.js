// for execution with node.js;
// for running/debugging in browser, put utils.js and this file in <script> elements,
// and comment this line out.
require("./utils.js");

// Find K largest numbers in two sorted arrays.
function k_largest(a, b, c, k) {
    var sa = a.length;
    var sb = b.length;
    if (sa + sb < k) return -1;
    var i = 0;
    var j = sa - 1;
    var m = sb - 1;
    while (i < k && j >= 0 && m >= 0) {
        if (a[j] > b[m]) {
            c[i] = a[j];
            i++;
            j--;
        } else {
            c[i] = b[m];
            i++;
            m--;
        }
    }
    debug.log(2, "i: "+ i + ", j: " + j + ", m: " + m);
    if (i === k) {
        return 0;
    } else if (j < 0) {
        while (i < k) {
            c[i++] = b[m--];
        }
    } else {
        while (i < k) c[i++] = a[j--];
    }
    return 0;
}

// find k-th largest or smallest number in 2 sorted arrays.
function kth(a, b, kd, dir){
    sa = a.length; sb = b.length;
    if (kd<1 || sa+sb < kd){
        throw "Mission Impossible! I quit!";
    }

    var k;
    //finding the kd_th largest == finding the smallest k_th;
    if (dir === 1){ k = kd;
    } else if (dir === -1){ k = sa + sb - kd + 1;}
    else throw "Direction has to be 1 (smallest) or -1 (largest).";

    return find_kth(a, b, k, sa-1, 0, sb-1, 0);
}

// find k-th smallest number in 2 sorted arrays;
function find_kth(c, d, k, cmax, cmin, dmax, dmin){
    
    sc = cmax-cmin+1; sd = dmax-dmin+1; k0 = k; cmin0 = cmin; dmin0 = dmin;
    debug.log(2, "=k: " + k +", sc: " + sc + ", cmax: " + cmax +", cmin: " + cmin + ", sd: " + sd +", dmax: " + dmax + ", dmin: " + dmin);

    c_comp = k0-sc;
    if (c_comp <= 0){
        cmax = cmin0 + k0-1;
    } else {
        dmin = dmin0 + c_comp-1;
        k -= c_comp-1;
    }

    d_comp = k0-sd;
    if (d_comp <= 0){
        dmax = dmin0 + k0-1;
    } else {
        cmin = cmin0 + d_comp-1;
        k -= d_comp-1;
    }
    sc = cmax-cmin+1; sd = dmax-dmin+1;

    debug.log(2, "#k: " + k +", sc: " + sc + ", cmax: " + cmax +", cmin: " + cmin + ", sd: " + sd +", dmax: " + dmax + ", dmin: " + dmin + ", c_comp: " + c_comp + ", d_comp: " + d_comp);
    
    if (k===1) return (c[cmin]<d[dmin] ? c[cmin] : d[dmin]);
    if (k === sc+sd) return (c[cmax]>d[dmax] ? c[cmax] : d[dmax]);

    m = Math.floor((cmax+cmin)/2);
    n = Math.floor((dmax+dmin)/2);

    debug.log(2, "m: " + m + ", n: "+n+", c[m]: "+c[m]+", d[n]: "+d[n]);
    
    if (c[m]<d[n]){
        if (m === cmax){ // only 1 element in c;
            return d[dmin+k-1];
        }

        k_next = k-(m-cmin+1);
        return find_kth(c, d, k_next, cmax, m+1, dmax, dmin);
    } else {
        if (n === dmax){
            return c[cmin+k-1];
        }

        k_next = k-(n-dmin+1);
        return find_kth(c, d, k_next, cmax, cmin, dmax, n+1);
    }
}

function traverse_at(a, ae, h, l, k, at, worker, wp){
    var n = ae ? ae.length : 0;
    var get_node;
    switch (at){
        case "k": get_node = function(idx){
                var node = {};
                var pos = l[idx] + Math.floor(k/n) - 1;
                if (pos<l[idx]){ node.pos = l[idx]; }
                else if (pos > h[idx]){ node.pos = h[idx];}
                else{ node.pos = pos; }

                node.idx = idx;
                node.val = a[idx][node.pos];
                debug.log(6, "pos: "+pos+"\nnode =");
                debug.log(6, node);
                return node;
            };
            break;
        case "l": get_node = function(idx){
                debug.log(6, "a["+idx+"][l["+idx+"]]: "+a[idx][l[idx]]);
                return a[idx][l[idx]];
            };
            break;
        case "h": get_node = function(idx){
                debug.log(6, "a["+idx+"][h["+idx+"]]: "+a[idx][h[idx]]);
                return a[idx][h[idx]];
            };
            break;
        case "s": get_node = function(idx){
                debug.log(6, "h["+idx+"]-l["+idx+"]+1: "+(h[idx] - l[idx] + 1));
                return h[idx] - l[idx] + 1;
            };
            break;
        default: get_node = function(){
                debug.log(1, "!!! Exception: get_node() returns null.");
                return null;
            };
            break;
    }

    worker.init();

    debug.log(6, "--* traverse_at() *--");

    var i;
    if (!wp){
        for (i=0; i<n; i++){
            worker.work(get_node(ae[i]));
        }    
    } else {
        for (i=0; i<n; i++){
            worker.work(get_node(ae[i]), wp);
        }
    }

    return worker.getResult();
}

sumKeeper = function(){
    var res = 0;
    return {
        init     : function(){ res = 0;},
        getResult: function(){
                debug.log(5, "@@ sumKeeper.getResult: returning: "+res);
                return res;
            },
        work     : function(node){ if (node!==null) res += node;}
    };
}();

maxPicker = function(){
    var res = null;
    return {
        init     : function(){ res = null;},
        getResult: function(){
                debug.log(5, "@@ maxPicker.getResult: returning: "+res);
                return res;
            },
        work     : function(node){
            if (res === null){ res = node;}
            else if (node!==null && node > res){ res = node;}
        }
    };    
}();

minPicker = function(){
    var res = null;
    return {
        init     : function(){ res = null;},
        getResult: function(){
                debug.log(5, "@@ minPicker.getResult: returning: ");
                debug.log(5, res);
                return res;
            },
        work     : function(node){
            if (res === null && node !== null){ res = node;}
            else if (node!==null &&
                node.val !==undefined &&
                node.val < res.val){ res = node; }
            else if (node!==null && node < res){ res = node;}
        }
    };  
}();

// find k-th smallest number in n sorted arrays;
// need to consider the case where some of the subarrays are taken out of the selection;
function kth_n(a, ae, k, h, l){
    var n = ae.length;
    debug.log(2, "------**  kth_n()  **-------");
    debug.log(2, "n: " +n+", k: " + k);
    debug.log(2, "ae: ["+ae+"],  len: "+ae.length);
    debug.log(2, "h: [" + h + "]");
    debug.log(2, "l: [" + l + "]");
    
    for (var i=0; i<n; i++){
        if (h[ae[i]]-l[ae[i]]+1>k) h[ae[i]]=l[ae[i]]+k-1;
    }
    debug.log(3, "--after reduction --");
    debug.log(3, "h: [" + h + "]");
    debug.log(3, "l: [" + l + "]");

    if (n === 1)
        return a[ae[0]][k-1]; 
    if (k === 1)
        return traverse_at(a, ae, h, l, k, "l", minPicker);
    if (k === traverse_at(a, ae, h, l, k, "s", sumKeeper))
        return traverse_at(a, ae, h, l, k, "h", maxPicker);

    var kn = traverse_at(a, ae, h, l, k, "k", minPicker);
    debug.log(3, "kn: ");
    debug.log(3, kn);

    var idx = kn.idx;
    debug.log(3, "last: k: "+k+", l["+kn.idx+"]: "+l[idx]);
    k -= kn.pos - l[idx] + 1;
    l[idx] = kn.pos + 1;
    debug.log(3, "next: "+"k: "+k+", l["+kn.idx+"]: "+l[idx]);
    if (h[idx]<l[idx]){ // all elements in a[idx] selected;
        //remove a[idx] from the arrays.
        debug.log(4, "All elements selected in a["+idx+"].");
        debug.log(5, "last ae: ["+ae+"]");
        ae.splice(ae.indexOf(idx), 1);
        h[idx] = l[idx] = "_"; // For display purpose only.
        debug.log(5, "next ae: ["+ae+"]");
    }

    return kth_n(a, ae, k, h, l);
}

function find_kth_in_arrays(a, k){

    if (!a || a.length<1 || k<1) throw "Mission Impossible!";

    var ae=[], h=[], l=[], n=0, s, ts=0;
    for (var i=0; i<a.length; i++){
        s = a[i] && a[i].length;
        if (s>0){
            ae.push(i); h.push(s-1); l.push(0);
            ts+=s;
        }
    }

    if (k>ts) throw "Too few elements to choose from!";

    return kth_n(a, ae, k, h, l);
}

/////////////////////////////////////////////////////
// tests
// To show everything: use 6.
debug.setLevel(1);

var a = [2, 3, 5, 7, 89, 223, 225, 667];
var b = [323, 555, 655, 673];
//var b = [99];
var c = [];

debug.log(1, "a = (len: " + a.length + ")");
debug.log(1, a);
debug.log(1, "b = (len: " + b.length + ")");
debug.log(1, b);

for (var k=1; k<a.length+b.length+1; k++){
    debug.log(1, "================== k: " + k + "=====================");

    if (k_largest(a, b, c, k) === 0 ){
      debug.log(1, "c = (len: "+c.length+")");
      debug.log(1, c);
    }

    try{
        result = kth(a, b, k, -1);
        debug.log(1, "===== The " + k + "-th largest number: " + result);
    } catch (e) {
        debug.log(0, "Error message from kth(): " + e);
    }
    debug.log("==================================================");
}

debug.log(1, "################# Now for the n sorted arrays ######################");
debug.log(1, "####################################################################");

x = [[1, 3, 5, 7, 9],
     [-2, 4, 6, 8, 10, 12],
     [8, 20, 33, 212, 310, 311, 623],
     [8],
     [0, 100, 700],
     [300],
     [],
     null];

debug.log(1, "x = (len: "+x.length+")");
debug.log(1, x);

for (var i=0, num=0; i<x.length; i++){
    if (x[i]!== null) num += x[i].length;
}
debug.log(1, "totoal number of elements: "+num);

// to test k in specific ranges:
var start = 0, end = 25;
for (k=start; k<end; k++){
    debug.log(1, "=========================== k: " + k + "===========================");

    try{
        result = find_kth_in_arrays(x, k);
        debug.log(1, "====== The " + k + "-th smallest number: " + result);
    } catch (e) {
        debug.log(1, "Error message from find_kth_in_arrays: " + e);
    }
    debug.log(1, "=================================================================");
}
debug.log(1, "x = (len: "+x.length+")");
debug.log(1, x);
debug.log(1, "totoal number of elements: "+num);
