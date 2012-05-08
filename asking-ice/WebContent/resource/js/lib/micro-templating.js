//micro template based on John Resg code
function tmpl(tmpl_id,data){
	try {
		if ( typeof tmpl.cache == 'undefined' ) {
			tmpl.cache = new Array();
	    }
		if( tmpl.cache[tmpl_id]!=null ){
			var fn = tmpl.cache[tmpl_id];
			return fn(data);		
		}
		str = document.getElementById(tmpl_id).innerHTML;
		str = str.replace(/\\/g, "@SPC@");
		str = str.replace(/'/g, "&apos;");
		fnStr = "var p=[],print=function(){p.push.apply(p,arguments);};" +
	    
	    // Introduce the data as local variables using with(){}
	    "with(obj){p.push('" +
	    
	    // Convert the template into pure JavaScript
	    str
	      .replace(/[\r\t\n]/g, " ")
	      .split("<%").join("\t")
	      .replace(/((^|%>)[^\t]*)'/g, "$1\r")
	      .replace(/\t=(.*?)%>/g, "',$1,'")
	      .split("\t").join("');")
	      .split("%>").join("p.push('")
	      .split("\r").join("\\'")
	  + "');}return p.join('');";
		fnStr = fnStr.replace(/@SPC@/g, "\\");
		var fn = new Function("obj", fnStr);
		tmpl.cache[tmpl_id] = fn;
		return fn(data);
	} catch (e) {
		log(e+":"+tmpl_id, 'rendering');
	}
}
