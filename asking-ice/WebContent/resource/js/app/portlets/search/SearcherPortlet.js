SearcherPortlet = Class.extend({
	init:function() {
		this.name = "SearcherPortlet";
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	onSearchInputKeyup: function(event)	{
		var keyup = event.keyCode;
		var subject = SingletonFactory.getInstance(Subject);
		if (this.getRequest().getParam('page') == 'Search')	{
			subject.notifyEvent('SearchButtonClick');
		}
		if (keyup == 13)	{
			subject.notifyEvent('SearchButtonClick');
		}
	},
	
	onSearchButtonClick: function(eventData)	{
		$('ul.ui-autocomplete').hide();
		
		var input = this.requestForEffectiveResource('Input');
		if (input.val().trim() == '')	{
			return;
		}
		var txt = input.val().trim();
		
		//knowledge or profile?
		var selected = $('input[name=rd_search]:checked');
		var id = selected.val();
		var request = undefined;
		if (id == 1)	{
			request = new Request('Search', undefined, {type: 'person-search', query: txt});
		} else {
			request = new Request('Search', undefined, {type: 'question-search', query: txt});
		}
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('RequestRoute', request);
	},
	
	onSearcherTypeChange: function(eventData)	{
		var selected = $('input[name=rd_search]:checked');
		var id = selected.val();
		var subject = SingletonFactory.getInstance(Subject);
		$('.customStyleSelectBoxInner').html(selected.html());
		
		if (id == 1)	{
			subject.notifyEvent('ChangeAutocompleteType', {type: 'person', target: this.requestForEffectiveResource('Input')});
		} else {
			subject.notifyEvent('ChangeAutocompleteType', {type: 'question', target: this.requestForEffectiveResource('Input')});
		}
	},
	
	onDisplayHeaderHelp:function(eventData){
		jQuery("#headerhelp").slideToggle();
        var closetimer = undefined;
        $("#headerhelp").mouseleave(function() {
            closetimer = setTimeout("jQuery(\"#homehelp\").fadeOut(); jQuery(\"#maphelp\").fadeOut();jQuery(\"#nearplace-help\").fadeOut();",8000);
        });
        $("#headerhelp").mouseover(function() {
            window.clearTimeout(closetimer);
            closetimer = undefined;
        });
	},
	
	onSystemPropertyChanged: function(eventData) {
		if (eventData == 'user.login')
			this.run();
	},
	
	run: function() {
		var logged = SingletonFactory.getInstance(Application).getSystemProperties().get('user.login');
		if (logged == 1) {
			this.getPortletPlaceholder().paintCanvas(this.render());
		} else {
			this.getPortletPlaceholder().paintCanvas('');
		}
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}
}).implement(RenderInterface).implement(PortletInterface).implement(ObserverInterface);