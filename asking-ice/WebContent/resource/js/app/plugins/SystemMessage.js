SystemMessagePlugin = Class.extend({
	init: function()	{
		this.name = "SystemMessagePlugin";
		this.fetched = false;
	},
	
	onSystemPropertyChanged: function(eventData)	{
		if (eventData == 'user.login')	{
			this.fetch();
		}
	},
	
	onPageBegan: function() {
		this.fetch();
	},
	
	fetch: function() {
		if (this.fetched) return;
		this.fetched = true;
//		var subject = SingletonFactory.getInstance(Subject);
//		subject.notifyEvent('NotifyMessage', "Hiện tại hệ thống Asking.vn & BKProfile.com đang gặp 1 số vấn đề kĩ thuật nên tạm thời gián đoạn phục vụ. Chúng tôi đã tiến hành tìm hiểu nguyên nhân và sẽ thông báo lại cho bạn trong thời gian sớm nhất. <br />Nếu bạn không phiền hệ thống sẽ gửi mail active tài khoản cũ tới các bạn.Rất mong bạn thông cảm với sự cố này.<br />Xin chân thành cảm ơn!");
		
		var systemProperties = SingletonFactory.getInstance(Application).getSystemProperties();
		var loggedIn = systemProperties.get('user.login');
		if (loggedIn != 1) return;
		
		this.onAjax('user-ajax', 'get-system-message', {}, 'GET', {
			onSuccess: function(ret) {
				if (ret != null)	{
					var subject = SingletonFactory.getInstance(Subject);
					subject.notifyEvent('NotifyMessage', ret.msg);
				}
			}
		});
	}
}).implement(PluginInterface).implement(AjaxInterface);