/**
 * The bootstrap class.
 * The application's flow is defined here
 * Implement ObserverInterface
 * @augments Class
 */
Bootstrap = Class.extend({
	/**
	 * Called when the application start running
	 * Subclass can override this method to change the default flow
	 * @function
	 */
	run: function()	{
		this.registerObserver();
		this.setupRequestHandler();
		this.executeRequest();
	},

	/**
	 * Event-hooked function.
	 * @function
	 */
	onRequestRoute: function(eventData)	{
		this.requestHandler.handleRequest(eventData);
	},
	
	/**
	 * Event-hooked function.
	 * @function
	 */
	onNeedAssembleRequest: function(eventData)	{
		this.executeRequest();
	},

	/**
	 * Initialize the request handler
	 * @function
	 */
	setupRequestHandler: function()	{
		this.requestHandler = new RequestHandler();
	},
	
	/**
	 * Execute the current request
	 * @function
	 */
	executeRequest: function()	{
		this.requestHandler.prepareForRequest();
		var request = this.requestHandler.assembleRequest();
		if (request != undefined)	{
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('RequestRoute', request);
		}
	}
}).implement(ObserverInterface);