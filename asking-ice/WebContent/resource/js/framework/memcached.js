/**
 * A wrapper of the system properties.
 * Used for accessing the memcached namespace
 * @augments Class
 * @author griever
 */
Memcached = Class.extend({
	
	/**
	 * Initialize fields
	 * @constructor
	 */
	init: function()	{
		this.properties = SingletonFactory.getInstance(Application).getSystemProperties();
	},
	
	/**
	 * Private function.
	 * Get the actual entry name for the the specified key
	 */
	getEntryName: function(key)	{
		return 'memcached.'+key;
	},
	
	/**
	 * Store a value in the specified key
	 * @function
	 * @param {key} the key
	 * @param {value} the new value
	 */
	store: function(key, value)	{
		var entry = this.getEntryName(key);
		this.properties.set(entry, value);
	},
	
	/**
	 * Retrieve the value of the specified key
	 * @function
	 * @param {key} the key
	 * @returns {mixed} the value of the key
	 */
	retrieve: function(key)	{
		var entry = this.getEntryName(key);
		return this.properties.get(entry);
	},
	
	/**
	 * Clear the content of the specified key
	 * @function
	 * @param {key} the key
	 */
	clear: function(key)	{
		var entry = this.getEntryName(key);
		this.properties.set(entry, undefined);
	}
});