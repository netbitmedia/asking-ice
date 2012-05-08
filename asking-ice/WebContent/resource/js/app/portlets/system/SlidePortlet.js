SlidePortlet = Class.extend({
	init: function()	{
		this.name = "SlidePortlet";
	},
	
	run: function()	{
		var list = Array();
		list.push({img: 'resource/images/spring/register.png', title: 'Đăng ký thành viên', desc: 'Đăng ký thành viên để tham gia chia sẻ tri thức'});
		list.push({img: 'resource/images/spring/qa.png', title: 'Hỏi - Đáp', desc: 'Đặt câu hỏi và trả lời những vấn đề quan tâm'});
		list.push({img: 'resource/images/spring/follow.png', title: 'Follow', desc: 'Follow những thành viên mình quan tâm'});
//		list.push({img: 'resource/images/spring/register.png', title: 'Kết nối', desc: 'Gửi tin nhắn cho thành viên khác'});
		this.model = {list: list};
		this.getPortletPlaceholder().paintCanvas(this.render());
		this.slideshow();
	},
	
	slideshow: function() {
		this.current = 0;
		this.show();
		this.startInterval(5000, this.show);
	},
	
	show: function() {
		$('.box_skitter li').hide();
		var cur = $('.box_skitter ul li')[this.current];
		$(cur).fadeIn(3000);
		this.current++;
		if (this.current >= $('.box_skitter li').length)
            this.current = 0;
	},
	
	onEnd: function() {
		this.stopInterval();
	}
}).implement(PortletInterface).implement(RenderInterface).implement(IntervalTimerInterface);