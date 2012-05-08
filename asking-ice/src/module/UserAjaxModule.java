package module;

import java.util.HashMap;

import inc.Encode;
import inc.SendMail;

import model.system.Subscription;
import model.user.Contact;
import model.user.FollowRecommend;
import model.user.IProfile;
import model.user.NotificationObserver;
import model.user.ProfileFactory;
import model.user.SystemMessage;
import model.user.User;
import model.user.UserCatch;
import model.user.UserFollow;
import model.user.UserInterest;

import org.ice.Config;
import org.ice.db.Result;
import org.ice.db.Viewer;
import org.ice.utils.FieldUtils;
import org.ice.utils.UploadFile;
import org.ice.validate.file.FileExtValidator;
import org.ice.validate.file.FileSizeValidator;
import org.ice.view.ScriptProcessor;

import exception.InputException;

public class UserAjaxModule extends BaseAjaxModule {
	
	public void updateProfileTask() throws Exception {
		IProfile p = ProfileFactory.getProfile(viewer.type);
		if (p != null) {
			p.setUserId(viewer.id);
			FieldUtils.setValue(p, getParam("field"), getParam("value"));
			p.edit(getParam("field"));
		} else {
			throw new Exception("Unknown type: "+viewer.type);
		}
	}
	
	public void getAllNotificationTask() throws Exception {
		NotificationObserver notification = new NotificationObserver();
		notification.userId = viewer.id;
		int pageIndex = 0;
		try {
			pageIndex = Integer.parseInt(getParam("page"));
		} catch (Exception ex) {}
		result = new Result(true, null, notification.fetchFullNotification(pageIndex, 20));
	}
	
	public void requestNewPasswordTask() throws Exception {
		String email = this.getParam("email");
		User user = User.instanceByEmail(email);
		if (user == null)	{
			throw new InputException("Email "+email+" nhập không có trên hệ thống");
		}
		
		String token = Encode.random();
		user.recoverToken = token;
		user.updateToken();

		//sending email
		ScriptProcessor processor = new ScriptProcessor();
		HashMap<String, Object> view = new HashMap<String, Object>();
		String template = Config.get("resourceUrl")+"/mail/resetpass.htm";
		view.put("name", user.name);
		view.put("token", token);
		view.put("email", email);
		SendMail.send(this, "Asking.vn Team <bkprofile@bkprofile.com>", email, "Hướng dẫn khôi phục mật khẩu tại Asking", "Hướng dẫn khôi phục mật khẩu tại Asking", processor.process(template, view), null);
	}
	
	public void resetPasswordTask() throws Exception {
		User user = new User();
		user.recoverToken = getParam("token");
		user.setPassword(getParam("passwd"));
		user.resetPassword();
	}
	
	public void isTokenValidTask() throws Exception {
		User user = new User();
		user.recoverToken = getParam("token");
		user.checkToken();
	}
	
	public void getFullNotificationTask() throws Exception {
		NotificationObserver notification = new NotificationObserver();
		notification.userId = viewer.id;
		result = new Result(true, null, notification.fetchFullNotification(0, 5));
	}
	
	public void getLiveNotificationTask() throws Exception	{
		NotificationObserver notification = new NotificationObserver();
		notification.userId = viewer.id;
		result = new Result(true, null, notification.countUnchecked());
	}

	public void getUserEmailTask() {
		result = new Result(true, null, viewer.email);
	}
	
	public void getUserEditInfoTask() throws Exception {
		Subscription subs = new Subscription();
		subs.userId = viewer.id;
		
		Viewer view = new Viewer();
		view.put("email", viewer.email);
		view.put("subscribe", subs.instanceByUser());
		result = new Result(true, null, view.getMap());
	}
	
	public void editNameTask() throws Exception {
		viewer.setName(getParam("name"));
		viewer.editName();
	}

	public void editEmailPasswordTask() throws Exception {
		String pwd = getParam("currentPasswd");
		if (pwd != null && !pwd.isEmpty()) {
			if (Encode.sha1(pwd).equals(viewer.password))	{
				if (getParam("email") != null && !getParam("email").isEmpty()) {
					viewer.setEmail(getParam("email"));
				}
				if (getParam("passwd") != null && !getParam("passwd").isEmpty()) {
					viewer.setPassword(getParam("passwd"));
				}
				viewer.editCredentials();
				return;
			}
			throw new InputException("Mật khẩu cũ sai");
		}
		throw new InputException("Bạn cần nhập mật khẩu cũ");
	}
	
	public void getBriefInfoTask() throws Exception {
		User user = viewer;
		if (getParam("id") != null)	{
			user = new User();
			long id = Long.parseLong(getParam("id"));
			user.id = id;
			user.load();
		}
		result = new Result(true, null, user.briefInfo());
	}
	
	public void isUserFollowingUserTask() throws Exception {
		UserFollow follow = new UserFollow();
		follow.sourceId = viewer.id;
		follow.targetId = Long.parseLong(getParam("uid"));
		result = new Result(true, null, follow.isFollowing());
	}
	
	public void followPeopleTask() throws Exception {
		String []ids = getParam("ids").split(",");
		UserFollow follow = new UserFollow();
		follow.sourceId = viewer.id;
		for(String id: ids)	{
			try {
				follow.targetId = Long.parseLong(id.trim());
				follow.add();
			} catch (Exception ex)	{}
		}
	}
	
	public void followUserTask() throws Exception {
		UserFollow follow = new UserFollow();
		follow.sourceId = viewer.id;
		follow.targetId = Long.parseLong(getParam("uid"));
		follow.add();
	}
	
	public void unfollowUserTask() throws Exception {
		UserFollow follow = new UserFollow();
		follow.sourceId = viewer.id;
		follow.targetId = Long.parseLong(getParam("uid"));
		follow.remove();
	}
	
	public void getFollowersTask() throws Exception {
		UserFollow follow = new UserFollow();
		follow.targetId = Long.parseLong(getParam("uid", viewer.id+""));
		result = new Result(true, null, follow.fetchFollowers());
	}
	
	public void getFollowingTask() throws Exception {
		UserFollow follow = new UserFollow();
		follow.sourceId = Long.parseLong(getParam("uid", viewer.id+""));
		result = new Result(true, null, follow.fetchFollowing());
	}
	
	public void getFollowingTopicIdTask() throws Exception {
		String ids = "";
		UserInterest ui = new UserInterest();
		ui.userId = viewer.id;
		ids += ui.fetchIdByUsers();
		UserCatch uc = new UserCatch();
		uc.userId = viewer.id;
		if (!ids.isEmpty())
			ids += ",";
		ids += uc.fetchIdByUsers();
		result = new Result(true, null, ids);
	}
	
	public void getAllInterestsTask() throws Exception	{
		UserInterest ui = new UserInterest();
		ui.userId = Long.parseLong(getParam("id", viewer.id+""));
		result = new Result(true, null, ui.fetchByUser());
	}
	
	public void getAllExpertisesTask() throws Exception	{
		UserCatch userCatch = new UserCatch();
		userCatch.userId = Long.parseLong(getParam("id", viewer.id+""));
		result = new Result(true, null, userCatch.fetchByUser());
	}
	
	public void updateSingleExpertiseTask() throws Exception {
		UserCatch userCatch = new UserCatch();
		userCatch.catchWordId = Long.parseLong(getParam("id"));
		userCatch.userId = viewer.id;
		userCatch.setExplanation(getParam("explanation"));
		userCatch.edit();
	}
	
	public void addSingleExpertiseTask() throws Exception {
		UserCatch userCatch = new UserCatch();
		userCatch.catchWordId = Long.parseLong(getParam("id"));
		userCatch.userId = viewer.id;
		userCatch.setExplanation(getParam("explanation"));
		userCatch.add();
	}
	
	public void removeSingleExpertiseTask() throws Exception {
		UserCatch userCatch = new UserCatch();
		userCatch.catchWordId = Long.parseLong(getParam("id"));
		userCatch.userId = viewer.id;
		userCatch.remove();
	}
	
	public void addSingleInterestTask() throws Exception {
		UserInterest userInterest = new UserInterest();
		userInterest.catchWordId = Long.parseLong(getParam("id"));
		userInterest.userId = viewer.id;
		userInterest.add();
	}
	
	public void removeSingleInterestTask() throws Exception {
		UserInterest userInterest = new UserInterest();
		userInterest.catchWordId = Long.parseLong(getParam("id"));
		userInterest.userId = viewer.id;
		userInterest.remove();
	}
	
	public void addExpertiseTask() throws Exception {
		String experts = getParam("experts");
		String interests = getParam("interests");
		
		if (experts != null && !experts.isEmpty())	{
			UserCatch userCatch = new UserCatch();
			userCatch.userId = viewer.id;
			
			String[] expertArr = experts.split(",");
			for(String expert: expertArr)	{
				try {
					userCatch.explanation = "";
					userCatch.catchWordId = Long.parseLong(expert);
					userCatch.add();
				} catch (Exception ex) {}
			}
		}
		
		if (interests != null && !interests.isEmpty())	{
			UserInterest userInterest = new UserInterest();
			userInterest.userId = viewer.id;
			
			String[] interestArr = interests.split(",");
			for(String interest: interestArr)	{
				try {
					userInterest.catchWordId = Long.parseLong(interest);
					userInterest.add();
				} catch (Exception ex) {}
			}
		}
	}
	
	public void checkFinishProfileTask() throws Exception {
		result = new Result(true, null, viewer.checkFinishProfile());
	}
	
	public void changeAvatarTask() throws Exception {
		setContentType("text/html");
		
		UploadFile file = this.getUploadFile("uploader");
		file.addValidator(new FileExtValidator("png,jpg,jpeg"));
		file.addValidator(new FileSizeValidator(-1, 512*1024));
		file.preparePath("/avatar", Encode.random(32));
		while (file.getFile().exists())	{
			file.preparePath("/avatar", Encode.random(32));
		}
		try {
			file.upload();
		} catch (Exception ex)	{
			if (ex.getMessage().equals("org.ice.validate.file.FileExtValidator"))	{
				throw new InputException("File bạn chọn không phải ảnh hợp lệ");
			} else if (ex.getMessage().equals("org.ice.validate.file.FileSizeValidator")) {
				throw new InputException("File bạn chọn quá lớn.");
			}
		}
		
		viewer.avatar = file.getName();
		viewer.editAvatar();
		
		result = new Result(true, null, viewer.avatar);
	}
	
	public void isSubscribeTask() throws Exception {
		Subscription subscription = new Subscription();
		subscription.userId = viewer.id;
		result = new Result(true, null, subscription.instanceByUser() != null);
	}
	
	public void fetchContactsToInviteTask() throws Exception {
		Contact contact = new Contact();
		contact.userId = viewer.id;
		result = new Result(true, null, contact.fetchToInvite());
	}
	
	public void getContactsTask() throws Exception {
		Contact contact = new Contact();
		contact.userId = viewer.id;
		int page = 0;
		try {
			page = Integer.parseInt(getParam("page"));
		} catch (Exception ex) {}
		result = new Result(true, null, contact.fetchContacts(page));
	}
	
	public void getSystemMessageTask() throws Exception {
		SystemMessage msg = new SystemMessage();
		msg.userId = viewer.id;
		SystemMessage response = msg.getMessage();
		if (response != null)	{
			msg.removeByUser();
		}
		result = new Result(true, null, response);
	}
	
	public void getFollowRecommendTask() throws Exception {
		FollowRecommend recommend = new FollowRecommend();
		recommend.userId = this.viewer.id;
		result = new Result(true, null, recommend.listByUser());
	}
}