/**
 * 
 */

utils_items = {};

/**
 * Generate an unique ID
 * 
 * @param type
 *            String
 * @returns
 */
function generateId(type)	{
	if (!isPropertySet(utils_items, type))	{
		setProperty(utils_items, type, 0);
	}
	setProperty(utils_items, type, getProperty(utils_items, type)+1);
	return type+"-"+getProperty(utils_items, type);
}

function generateEvent(eventName, eventData){
    var subject = SingletonFactory.getInstance(Subject);
    subject.notifyEvent(eventName, eventData);
}

function setProperty(obj, prop, val)	{
	obj.prop = val;
}

function getProperty(obj, prop)	{
	return obj.prop;
}

function isPropertySet(obj, prop)	{
	if (typeof obj.prop != 'undefined')	{
		return true;
	}
	return false;
}


Array.max = function( array ){
    return Math.max.apply( Math, array );
};
Array.min = function( array ){
    return Math.min.apply( Math, array );
};

Array.nextBigger = function( array,val ){
	var result = Number.MAX_VALUE;
	for(var i=0; i < array.length; i++){
		if(array[i] > val && array[i] < result){
			result = array[i];
		}
	}
	return result;
};

Array.nextLess = function( array,val ){
	var result = Number.MIN_VALUE;
	for(var i=0; i < array.length; i++){
		if(array[i] < val && array[i] > result){
			result = array[i];
		}
	}
	return result;
};

function dialog ( title,msg,controls ){
	var id = Math.floor(Math.random()*101);
	var dialog_div = document.createElement("div");
	var dialog_header = document.createElement("div");
	var dialog_content = document.createElement("div");
	var dialog_control = document.createElement("div");
	var dialog_lbl = document.createElement("label");
	var btnClose = new Image("images/close.png");
	dialog_content.appendChild(dialog_lbl);
	dialog_div.appendChild(dialog_header);
	dialog_div.appendChild(dialog_content);
	dialog_div.appendChild(dialog_control);
	dialog_div.setAttribute('id','dialog_div_'+id);
	dialog_header.setAttribute('id','dialog_header_'+id);
	dialog_content.setAttribute('id','dialog_content_'+id);
	dialog_control.setAttribute('id','dialog_control_'+id);
	dialog_lbl.setAttribute('id','dialog_lbl_'+id);
	document.getElementsByTagName("body")[0].appendChild(dialog_div);
	$('#dialog_lbl_'+id).html(msg);
	$('#dialog_header_'+id).html(title+btnClose.toHtml());
	if(controls != null){
		var str = "";
		for(var i=0;i<controls.length;i++){
			str += controls[i].toHtml();
		}
		$('#dialog_control_'+id).html(str);
	}
	$('#dialog_div_'+id).addClass('alert_div');
	$('#dialog_header_'+id).addClass('alert_header');
	$('#dialog_content_'+id).addClass('alert_content');
	$('#dialog_control_'+id).addClass('alert_content');
	btnClose.setStyle("float","right");
	btnClose.setStyle("margin-right","5px");
	var _width = $(window).width();
	var _height = $(window).height();	
	var _top = (_height - $("#dialog_div_"+id).height())/2;
	var _left = (_width - $("#dialog_div_"+id).width())/2;
	$("#dialog_div_"+id).css('top',_top);
	$("#dialog_div_"+id).css('left',_left);	
	$("#dialog_div_"+id).draggable();
	$("#dialog_div_"+id).css('zIndex','1000');
	btnClose.implement(new CloseDialog(id));
	return id;
}

function alertMsg(title,msg) {
	var alert_div = document.createElement("div");
	var alert_header = document.createElement("div");
	var alert_content = document.createElement("div");
	var alert_control = document.createElement("div");
	var alert_btn = document.createElement("button");
	var alert_lbl = document.createElement("label");
	alert_content.appendChild(alert_lbl);
	alert_control.appendChild(alert_btn);	
	alert_div.appendChild(alert_header);
	alert_div.appendChild(alert_content);
	alert_div.appendChild(alert_control);
	alert_div.setAttribute('id','alert_div');
	alert_header.setAttribute('id','alert_header');
	alert_content.setAttribute('id','alert_content');
	alert_control.setAttribute('id','alert_control');
	alert_btn.setAttribute('id','alert_btn');
	alert_lbl.setAttribute('id','alert_lbl');
	document.getElementsByTagName("body")[0].appendChild(alert_div);
	$('#alert_lbl').html(msg);
	$('#alert_header').html(title);
	$('#alert_btn').html('OK');
	$('#alert_div').addClass('alert_div');
	$('#alert_header').addClass('alert_header');
	$('#alert_content').addClass('alert_content');
	$('#alert_control').addClass('alert_content');
	var _width = $(window).width();
	var _height = $(window).height();	
	var _top = (_height - $("#alert_div").height())/2;
	var _left = (_width - $("#alert_div").width())/2;
	$("#alert_div").css('top',_top);
	$("#alert_div").css('left',_left);	
	$("#alert_div").draggable();
	$("#alert_div").css('zIndex','1000');
	$("#alert_btn").addClass('ij-button');
	$("#alert_btn").bind('click',function(){
		$("#alert_div").remove();
	});
}

function trimOff(txt, maxLen)	{
	txt = txt.trim();
	if (txt.length > maxLen)	{
		txt = txt.substr(0, maxLen);
		var lastIndexOf = txt.lastIndexOf(' ');
		if (lastIndexOf != -1)
			txt = txt.substr(0, lastIndexOf)+'...';
	}
	return txt;
}

function log(msg)	{
	if (window["console"] != undefined)	{
		console.log(msg);
		console.log(arguments.callee.caller);
	}
}