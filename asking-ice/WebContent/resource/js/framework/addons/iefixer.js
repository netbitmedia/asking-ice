//Fix bug in IE
if (typeof String.prototype.trim !== 'function') {   
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, "");   
	} 
}
if(typeof Array.prototype.indexOf !== 'function'){
	Array.prototype.indexOf = function(obj){
		for(var i=0; i<this.length; i++){
    		if(this[i]==obj){
        		return i;
    		}
		}
		return -1;
	}
}