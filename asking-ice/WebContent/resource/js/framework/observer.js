/**
 * Observer interface. 
 * Used for formalizing the observer design pattern,
 * especially in an event-based application
 * Provide the following methods:
 *  - notify(eventName, eventData): called when an arbitrary event is triggered
 *  - registerObserver(): register the current object to be an observer
 *  - unregisterObserver(): unregister the current object, and it's no longer an observer
 *  @augments InterfaceImplementor
 *  @author griever
 */
ObserverInterface = InterfaceImplementor.extend({
	
	implement: function(obj)	{
		obj.prototype.notify = obj.prototype.notify || function(eventName, eventData)	{
			var methodName = "on"+eventName;
			if (typeof this[methodName] != 'undefined')	{
				var method = this[methodName];
				method.call(this, eventData);
				return true;
			}
			return false;
		};
		
		obj.prototype.registerObserver = obj.prototype.registerObserver || function()	{
			var subject = SingletonFactory.getInstance(Subject);
			subject.attachObserver(this);
		};
		
		obj.prototype.unregisterObserver = obj.prototype.unregisterObserver || function()	{
			var subject = SingletonFactory.getInstance(Subject);
			subject.detachObserver(this);
		};
	}
});

/**
 * Event Subject (mediator or notifier)
 * @augments Class
 * @author griever
 */
Subject = Class.extend({
	
	/**
	 * Initialize fields
	 * @constructor
	 */
	init: function()	{
		this.observers = Array();
	},
	
	/**
	 * Attach an observer
	 * @function
	 * @param {observer} the observer
	 */
	attachObserver: function(observer)	{
		this.observers.push(observer);
	},
	
	/**
	 * Detach an observer
	 * @function
	 * @param {observer} the observer
	 */
	detachObserver: function(observer)	{
		if (observer == undefined)
			return;
		var index = this.observers.indexOf(observer);
		if (index > 0)	{
			this.observers.splice(index, 1);
		}
	},
	
	/**
	 * Notify an event to all observers
	 * @function
	 * @param {eventName} the name of the event which should contains characters only
	 * @param {eventData} the data associated with the event
	 */
	notifyEvent: function(eventName, eventData)	{
		var count = 0;
		for(var i=0;i<this.observers.length;i++)	{
			try {
				var result = this.observers[i].notify(eventName, eventData);
				if (result == true)	{
					count++;
				}
			} catch (err)	{
				log(err);
			}
		}
	}
});