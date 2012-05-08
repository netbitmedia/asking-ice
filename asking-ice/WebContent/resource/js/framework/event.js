EventBinder = Class.extend	({
	fireEvent: function(jObject, event)	{
		jObject.trigger(event);
	},

	bindEvent: function(jObject, handlers)	{
		jObject.access().bind(handlers.getEventName(), function(e)	{
			handlers.onEvent(e, jObject);
		});
	}
});