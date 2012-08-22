function isNumber (o) {
  return ! isNaN (o-0);
}

debug = function (){
	var level = 0;
	return {
		setLevel: function(l){ level = l;},
		log: function(l, msg){
			if (l<=level) console.log(msg);
		}
	};
}();