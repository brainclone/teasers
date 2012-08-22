function isNumber (o) {
  return ! isNaN (o-0);
}

function format(string) {  
	var args = arguments;

	// console.log("string: " + string);
	// console.log(args);
	if (arguments.length<2) return (string);

	var pattern = RegExp("%([1-" + (arguments.length-1) + "])", "g");

	return string.replace(pattern, function(match, index) {
		return args[index];  
	});  
}

var self = this;

debug = function (){
	var level = 0;
	
	return {
		setLevel: function(l){ level = l;},
		log: function(l, msg){
			//if ( !isNumber(l)){ l = 0;}
			//if (l<level+1) console.log(self["format"].apply(this, 

			if (l<level+1){
				var s = format.apply(self, Array.prototype.slice.call(arguments, 1));
				console.log(s);
			}
		}
	};
}();
