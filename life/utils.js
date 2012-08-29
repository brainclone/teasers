function isNumber (o) {
  return ! isNaN (o-0);
}

function format(string) {  
	var args = arguments;

	if (arguments.length<2) return (string);
	  
	var pattern = RegExp("%([1-" + (arguments.length-1) + "])", "g");

	return string.replace(pattern, function(match, index) {  
		return args[index];  
	});  
}

debug = function (){
	var level = 0;
	return {
		setLevel: function(l){ level = l;},
		log: function(l, msg){
			if (l<level+1){
				var s = format.apply(this, Array.prototype.slice.call(arguments, 1));
				console.log(s);
			}
		}
	};
}();
