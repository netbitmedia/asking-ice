function Popup(){
	this.popup_count = 0;
	
    this.add = function(id, title, content){
    	$('body').append('<div class="popup" id="'+id+'">\
    	        <div class="popup-outer">\
                <div class="popup-title">'+title+'<a onclick="generateEvent(\'PopupRemove\', {id: \''+id+'\'})" class="close-popup">x</a></div>\
                <div class="popup-content">'+content+'</div>\
            </div>\
    	</div>');
        this.popup_count++;
        $('#shadow').fadeIn();
        $('#'+id).fadeIn();
        $('#'+id).css('margin-left',-($('#'+id+' .popup-content').width()/2+18));
        $('#'+id).css('margin-top',-($('#'+id+' .popup-content').height()/2+50));
    }
    
    this.remove = function(id){
    	this.popup_count--;
    	$('#'+id).fadeOut();
    	$('#'+id).remove();
    	if($('.popup:visible').length == 0){
    		$('#shadow').fadeOut();
    	}
    }
	 
    this.error = function(msg){
    	this.add('popup-error', 'Có lỗi', '<div class="popup-error">'+msg+'</div>\
			<div class="popup-toolbar-msg"><a class="button" onclick="generateEvent(\'PopupRemove\', {id: \'popup-error\'})">Đồng ý</a></div>\
    	');
    }
    
    this.msg = function(msg){
    	this.add('popup-msg', 'Thông báo', '<div class="popup-msg">'+msg+'</div>\
			<div class="popup-toolbar-msg"><a class="button" onclick="generateEvent(\'PopupRemove\', {id: \'popup-msg\'})">Đồng ý</a></div>\
    	');
    }
}