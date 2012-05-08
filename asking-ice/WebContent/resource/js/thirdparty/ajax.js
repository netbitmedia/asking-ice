/**
 * An interface for all ajax-based portlets or plugins
 * Provide the following methods:
 *  - onAjax(controller, action, params, type, callback)
 */
AjaxInterface = InterfaceImplementor.extend({
	implement: function(obj)	{
		var interfacePrivate = function(ret, success, fail, url)	{
			var result = ret.data;
			if (ret.status)	{
				if (success != undefined)	{
					try {
						success.call(undefined, result);
					} catch (err)	{
						log(err+" - "+url);
					}
				}
			} else if (result == 'exception.PrivilegeException') {
				var subject = SingletonFactory.getInstance(Subject);
				subject.notifyEvent('NotifyError', ret.msg);
			} else {
				if (fail != undefined)	{
					try {
						fail.call(undefined, ret.msg, ret.data);
					} catch (err)	{
						log(err);
					}
				}
			}
		};
		obj.prototype.onAjax = obj.prototype.onAjax || function(controller, action, params, type, callbacks, cache, cacheTime)	{
			if (type == undefined)
				type = 'GET';
			var success = callbacks.onSuccess;
			var fail = callbacks.onFailure;
			var accessDenied = callbacks.onAccessDenied;
			
			var memcacheKey = 'ajax.'+controller+'.'+action;
			for(var k in params)	{
				var v = params[k];
				memcacheKey += '.'+k+'.'+v;
			}

			var root = SingletonFactory.getInstance(Application).getSystemProperties().get('host.root');
			var url = root+'/'+controller+'/'+action;
			//try to get from mem cached
			if (type == 'GET' && cache == true)	{
				var memcache = SingletonFactory.getInstance(Memcached);
				var value = memcache.retrieve(memcacheKey);
				if (value != undefined)	{
					var now = new Date();
					var cacheTimestamp = value.timestamp;
					if ((now.getTime() - cacheTimestamp) < cacheTime)	{
						var subject = SingletonFactory.getInstance(Subject);
						subject.notifyEvent('AjaxQueryFetched', {result: value.ret, url: url});
						interfacePrivate(value.ret, success, fail, url);
						return;
					} else {
						memcache.clear(memcacheKey);
					}
				}
			}
			
			var subject = SingletonFactory.getInstance(Subject);
			$.ajax({
				dataType: 'json',
				url: url,
				type: type,
				data: params,
				success: function(ret)	{
					subject.notifyEvent('AjaxFinished');
					if (ret != null)	{
						if (type == 'GET' && cache == true)	{
							//cache the result
							var memcache = SingletonFactory.getInstance(Memcached);
							var now = new Date();
							memcache.store(memcacheKey, {'ret': ret, 'timestamp': now.getTime()});
						}
						subject.notifyEvent('AjaxQueryFetched', {result: ret, url: url});
						interfacePrivate(ret, success, fail, url);
					}
				},
				error: function(ret, textStatus)	{
					subject.notifyEvent('AjaxFinished');
				},
				statusCode: {
					403: function()	{
						//console.log('access denied at '+url);
						if (accessDenied != undefined)
							accessDenied.call(undefined);
					}
				}
			});
		};
	}
});