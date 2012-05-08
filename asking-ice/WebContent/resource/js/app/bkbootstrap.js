BKBootstrap = Bootstrap.extend({
	setupRequestHandler: function()	{
		this.requestHandler = new RequestHandler();
		this.requestHandler.setErrorHandler(new BKErrorHandler());
	}
}).implement(ObserverInterface);

BKErrorHandler = DefaultErrorHandler.extend({
	handle: function(err, event)	{
		log(err+" - "+event);
		if (typeof err == 'object')	{
			if (err.Exception == 'NotFound')	{
				var request = new Request("ErrorPage", null, {'code': 404});
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent("RequestRoute", request);
			} else if (err.Exception == 'RequestInterrupted')	{
				return;
			}
		}
	}
});