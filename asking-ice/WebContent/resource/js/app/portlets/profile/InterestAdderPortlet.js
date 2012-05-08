InterestAdderPortlet = Class.extend({
	init: function()	{
		this.name = "InterestAdderPortlet";
	},
	
	onBegin: function()	{
		this.registerObserver();
	},
	
	onSubmitInterestAdderButtonClick: function()	{
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('SubmitInterestForward', {callback: function()	{
			subject.notifyEvent('NotifyGlobal', 'Đã thêm thành công');
		}, namespace: this.name});
	},
	
	run: function()	{
		this.getPortletPlaceholder().paintCanvas(this.render());
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('RenderInterestEditor', {placeholder:this.requestForEffectiveResource('ExpertisePlaceholder'), namespace: this.name});
	},
	
	onEnd: function()	{
		this.unregisterObserver();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(ObserverInterface);