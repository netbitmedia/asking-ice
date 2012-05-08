ExpertiseAdderPortlet = Class.extend({
	init: function()	{
		this.name = "ExpertiseAdderPortlet";
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	onSubmitExpertiseAdderButtonClick: function()	{
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('SubmitExpertiseForward', {callback: function()	{
			subject.notifyEvent('NotifyGlobal', 'Đã thêm thành công');
		}, namespace: this.name});
	},
	
	run: function()	{
		this.getPortletPlaceholder().paintCanvas(this.render());
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('RenderExpertiseEditor', {placeholder:this.requestForEffectiveResource('ExpertisePlaceholder'), namespace: this.name});
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(ObserverInterface);