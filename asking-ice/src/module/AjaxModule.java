package module;

import inc.Encode;
import inc.SendMail;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;

import model.article.Article;
import model.question.Answer;
import model.question.Question;
import model.system.Feedback;
import model.system.Privilege;
import model.system.Subscription;
import model.topic.CatchWord;
import model.user.ExpertRank;
import model.user.IProfile;
import model.user.News;
import model.user.ProfileFactory;
import model.user.User;

import org.ice.Config;
import org.ice.db.Result;
import org.ice.db.Viewer;
import org.ice.view.ScriptProcessor;

import exception.InputException;
import exception.RegisterError;

public class AjaxModule extends BaseAjaxModule {

	public void indexTask()	{
		result = new Result(true, null, null);
	}
	
	public void checkUserStatusTask() throws Exception	{
		if (viewer.id == -1)	{
			checkCookie();
			if (viewer == null) {
				viewer = new User();
				viewer.id = -1;
			}
		}
		
		if (viewer.id == -1)	{
			result = new Result(true, null, false);
		} else {
			result = new Result(true, null, viewer.fetchInfo());
			viewer.lastActiveIP = getRequestIP();
			viewer.lastActive = new Date().getTime();
			viewer.updateSession();
		}
	}
	
	public void getProfileInfoTask() throws Exception {
		long userId = viewer.id;
		String template = viewer.type;
		try {
			userId = Long.parseLong(getParam("id"));
		} catch (Exception ex) {}
		if (userId != viewer.id) {
			User u = new User();
			u.id = userId;
			u.load();
			template = u.type;
		}

		IProfile p = ProfileFactory.getProfile(template);
		p.setUserId(userId);
		result = new Result(true, null, p.fetchInfo());
	}
	
	public void getExpertsTask() throws Exception	{
		User user = new User();
		result = new Result(true, null, user.fetchExperts());
	}
	
	public void countStatsTask() throws Exception {
		Viewer viewer = new Viewer(null, null);
		viewer.put("user", new User().countTotal());
		viewer.put("question", new Question().countTotal());
		viewer.put("answer", new Answer().countTotal());
		viewer.put("catchword", new CatchWord().fetchAllCatchWords().size());
		
		result = new Result(true, null, viewer.getMap());
	}
	
	public void getFeaturedNewsTask() throws Exception {
		News news = new News();
		result = new Result(true, null, news.listLatest());
	}
	
	public void getLatestArticlesTask() throws Exception {
		Article article = new Article();
		article.selected = 1;
		result = new Result(true, null, article.fetchLatest());
	}
	
	public void getMostVotedArticlesTask() throws Exception {
		Article article = new Article();
		article.selected = 1;
		result = new Result(true, null, article.fetchMostVoted());
	}
	
	public void getMaxScoreUsersTask() throws Exception {
		User user = new User();
		result = new Result(true, null, user.fetchTopScore());
	}
	
	public void getLatestUsersTask() throws Exception {
		User user = new User();
		result = new Result(true, null, user.fetchLatest());
	}
	
	public void getByTopRankTask() throws Exception {
		ExpertRank er = new ExpertRank();
		result = new Result(true, null, er.fetchTopRank());
	}
	
	public void getAllPrivilegesTask() throws Exception {
		Viewer v = new Viewer();
		Privilege priv = new Privilege();
		Map<String, Privilege> map = priv.fetchAllPrivileges();
		v.put("privs", map);
		v.put("current", viewer.score);
		result = new Result(true, null, v.getMap());
	}
	
	public void registerTask() throws Exception {
		ArrayList<RegisterError> errors = new ArrayList<RegisterError>();
		User user = new User();
		try {
			user.setPassword(getParam("password"));
		} catch (Exception ex)	{
			errors.add(new RegisterError("password", ex.getMessage()));
		}
		
		try {
			user.setEmail(getParam("email"));
		} catch (Exception ex)	{
			errors.add(new RegisterError("email", ex.getMessage()));
		}
		
		try {
			user.setName(getParam("fullname"));
		} catch (Exception ex)	{
			errors.add(new RegisterError("fullname", ex.getMessage()));
		}
		
		if (errors.isEmpty())	{
			user.add();
			
			if (getParam("receive") != null && getParam("receive").equals("1"))	{
				Subscription subscription = new Subscription();
				subscription.email = user.email;
				subscription.userId = user.id;
				try {
					subscription.add();
				} catch (Exception ex) {}
			}
			
			getRequest().setSession("viewer", user);
			
			ScriptProcessor processor = new ScriptProcessor();
			HashMap<String, Object> view = new HashMap<String, Object>();
			String template = Config.get("resourceUrl")+"/mail/welcome.htm";
			view.put("name", user.name);
			SendMail.send(this, "Asking.vn Team <bkprofile@bkprofile.com>", user.email, "Chào mừng bạn đến với Asking.vn", "Chào mừng bạn đến với Asking.vn - Mạng chia sẻ tri thức Việt Nam", processor.process(template, view), null);
		} else {
			result = new Result(false, null, errors);
		}
	}
	
	public void loginTask() throws Exception {
		if (getParam("username") != null && getParam("password") != null) {
			String username = getParam("username");
			String password = getParam("password");
			String persistent = getParam("persistent");
			
			if (username.isEmpty())
				throw new InputException("Tên đăng nhập/Email không được để trống");
			if (password.isEmpty())
				throw new InputException("Mật khẩu không được để trống");
			
			User user = User.login(username, password);
			if (user == null)
				throw new InputException("Tên đăng nhập hoặc mật khẩu không tồn tại");
			
			if (persistent != null) {
				String ck = Encode.random();
				Cookie cookie = new Cookie("pst", user.id + "_" + ck);
				cookie.setMaxAge(30 * 24 * 3600);
				cookie.setPath("/");
				getResponse().addCookie(cookie);
				
				user.cookie = ck;
				user.updateCookie();
			}
			
			getRequest().setSession("viewer", user);
			result = new Result(true, null, user.fetchInfo());
		} else {
			throw new InputException("Bạn phải nhập tên đăng nhập và mật khẩu");
		}
	}
	
	public void logoutTask() throws Exception {
		this.getRequest().destroySession();
		Cookie ck = new Cookie("pst", "");
		ck.setPath("/");
		ck.setMaxAge(0);
		getResponse().addCookie(ck);
	}
	
	public void sendFeedbackTask() throws Exception {
		if (getParam("content") != null)	{
			Feedback feedback = new Feedback();
			feedback.setContent(getParam("content"));
			feedback.userId = viewer.id;
			if (getParam("email") != null && !getParam("email").isEmpty())
				feedback.setEmail(getParam("email"));
			feedback.add();
		}
	}
	
	public void getFeedbackListTask() throws Exception {
		Feedback feedback = new Feedback();
		result = new Result(true, null, feedback.listAll(0, 5));
	}
	
	public void isUnsubscribeCodeValidTask() throws Exception {
		Subscription subscription = new Subscription();
		subscription.email = getParam("email");
		subscription.checkEmailCode(getParam("code"));
	}
	
	public void unsubscribeUserTask() throws Exception {
		Subscription subscription = new Subscription();
		subscription.userId = viewer.id;
		subscription.removeUser();
	}
	
	public void unsubscribeTask() throws Exception {
		Subscription subscription = new Subscription();
		subscription.email = getParam("email");
		subscription.checkEmailCode(getParam("code"));
		subscription.remove();
	}
	
	public void subscribeTask() throws Exception {
		Subscription subscription = new Subscription();
		subscription.email = getParam("email");
		if (viewer.id != -1)
			subscription.userId = viewer.id;
		try {
			subscription.add();
		} catch(Exception ex)	{
			throw new InputException("Email này đã được đăng ký nhận tin rồi");
		}
	}
	
	public void sendUnsubscribeEmailTask() throws Exception {
		Subscription subscription = new Subscription();
		subscription.setEmail(getParam("email"));
		subscription = subscription.instanceByEmail();

		if (subscription == null)
			throw new InputException("Email không tồn tại trong hệ thống");
		
		ScriptProcessor processor = new ScriptProcessor();
		HashMap<String, Object> view = new HashMap<String, Object>();
		String template = Config.get("resourceUrl")+"/mail/unsubscribe.htm";
		view.put("email", subscription.email);
		view.put("code", subscription.encodeEmail());
		SendMail.send(this, "Asking.vn Team <bkprofile@bkprofile.com>", subscription.email, "Ngừng nhận tin từ hệ thống Asking.vn", "Ngừng nhận tin từ hệ thống Asking.vn", processor.process(template, view), null);
	}
	
	public void getOnlineNumberTask() throws Exception {
		result = new Result(true, null, Config.online);
	}
	
	public void whoOnlineTask() throws Exception {
		User user = new User();
		user.lastActive = new Date().getTime() - 600000;
		result = new Result(true, null, user.getActiveSince());
	}
	
	private void checkCookie() {
		Cookie[] cookies = getRequest().getCookies();
		if(cookies == null){
			return;
		}
		for (Cookie cookie : cookies) {
			if(cookie.getName().equals("pst")) {
				String[] ck = cookie.getValue().split("_");
				User user = new User();
				try{
					user.id = Integer.parseInt(ck[0]);
					user.cookie = ck[1];
					viewer = user.loginViaCookie();
					getRequest().setSession("viewer", viewer);
					if (viewer == null) throw new Exception();
				} catch(Exception ex){
					cookie.setMaxAge(0);
					getResponse().addCookie(cookie);
				}
				break;
			}
		}
	}
}
