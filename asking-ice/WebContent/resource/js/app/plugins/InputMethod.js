InputMethodPlugin = Class.extend({
	init: function() {
		this.name = "InputMethodPlugin";
	},
	
	onInitInputMethod: function() {
		var AVIMObj = new AVIM();
		//function AVIMAJAXFix() {
		//	var a = 50;
		//	while(a < 5000) {
		//		setTimeout("AVIMInit(AVIMObj)", a);
		//		a += 50;
		//	}
		//}
		//AVIMAJAXFix();
		AVIMInit(AVIMObj);
		//AVIMObj.attachEvt(document, "mousedown", AVIMAJAXFix, false);
		AVIMObj.attachEvt(document, "keydown", AVIMObj.keyDownHandler, true);
		AVIMObj.attachEvt(document, "keypress", function(e) {
			var a = AVIMObj.keyPressHandler(e);
			if (a == false) {
				if (AVIMObj.is_ie) window.event.returnValue = false;
				else e.preventDefault();
			}
		}, true);
		if (!AVIMObj.support || AVIMObj.isKHTML) {
			$('#AVIMControl').addClass('disable');
			$('#AVIMControl a').addClass('disable');
			$('#AVIMControl input').attr('disabled', 'disabled');
			$('#AVIMControl').attr('title', 'Trình duyệt của bạn không hỗ trợ bộ gõ tiếng Việt');
			$('#AVIMControl-Button').hide();
		}
	}
}).implement(PluginInterface);