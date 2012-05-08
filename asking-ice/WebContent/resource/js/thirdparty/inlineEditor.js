/**
 * Editor interface. 
 * Provide the following methods:
 *  - unregisterObserver(): unregister the current object, and it's no longer an observer
 *  @augments InterfaceImplementor
 *  @author longpham
 */
InlineEditorInterface = InterfaceImplementor.extend({
	
	implement: function(obj)	{
		
		obj.prototype.design = obj.prototype.design || function(obj) {
			obj.find(".dynamic-edit-content-button-fix").click(function(eventData){
				var parent = $(this).parent();
				var sibs = parent.siblings('.dynamic-edit-form'); 
				parent.hide(); 
				sibs.show();
				var tmp = $.trim(parent.find(".dynamic-edit-content-value").html());
				sibs.children('input').focus();
				sibs.children('input').val(tmp);
			});
			
			obj.find(".dynamic-edit-content-button-cancel").click(function(eventData){
				var parent = $(this).parent();
				var sibs = parent.siblings('.dynamic-edit-content');
				parent.children('input').val(""); 
				parent.hide();
				sibs.show();
			});
			// var x = obj.find(".dynamic-edit-main .row:last");
			// x.hide();
			obj.find("[level]").each(function(){
				var lev = $(this).attr("level");
				$(this).find(".dynamic-edit-main").css('margin-left', 30);
			});
			$('.dynamic-edit-content-value').filter(function() { return $(this).text() == ""; }).each(function(){
				var parent = $(this).parent();
				parent.hide();
				parent.siblings(".dynamic-edit-form").show();
			});
		};
		
		obj.prototype.encapData = obj.prototype.encapData || function(arr, tblName, id, level){
			for (var i in arr){
				arr[i]={'tbl':tblName, 'id':id, 'val':arr[i], 'level':level};
			};
		}
	}
});