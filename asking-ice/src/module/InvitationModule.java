package module;

import inc.InputValidator;
import inc.SendMail;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.ice.Config;
import org.ice.db.Result;
import org.ice.db.Viewer;
import org.ice.logger.Logger;
import org.ice.view.ScriptProcessor;

import model.system.Invitation;
import model.user.Contact;
import model.user.User;

public class InvitationModule extends BaseAjaxModule {

	public void getInviteUsersFromEmailsTask() throws Exception {
		Contact contact = new Contact();
		contact.userId = viewer.id;
		String[] emails = getParam("emails").split(",");
		String[] names = getParam("names").split(",");
		ArrayList<User> users = new ArrayList<User>();
		for (int i=0;i<emails.length;i++) {
			User user = User.instanceByEmail(emails[i]);
			if (user != null)	{
				users.add(user);
				contact.targetId = user.id;
			} else {
				contact.targetId = 0;
			}
			contact.name = names[i].trim();
			contact.email = emails[i];
			contact.followed = 0;
			try {
				contact.add();
			} catch (Exception ex) {}
		}
		Viewer viewer = new Viewer();
		viewer.put("existing", users);
		result = new Result(true, null, viewer.getMap());
	}
	
	@SuppressWarnings("unchecked")
	public void sendInvitationTask() throws Exception {
		String name = viewer.name;
		if (name == null || name.isEmpty())	{
			name = viewer.username;
		}
		String email = this.getParam("email");
		InputValidator.validateEmail(email);
		
		Invitation invitation = new Invitation();
		invitation.targetEmail = email;
//		if (invitation.emailExist())	{
//			throw new Exception("Email already invited");
//		}

		String subject = name+" mời bạn tham gia Asking.vn!";
		
		viewer.briefInfo();
		ArrayList<Map<String, Object>> interests = (ArrayList<Map<String, Object>>) viewer.interests;
		ArrayList<Map<String, Object>> experts = (ArrayList<Map<String, Object>>) viewer.catches;
		
		String strInterests = "";
		if (interests.isEmpty())
			strInterests = "Chưa cập nhật";
		else {
			for(int i=0;i<interests.size();i++)	{
				strInterests += interests.get(i).get("catchWord");
				if (i<interests.size()-1)	{
					strInterests += ", ";
				} else {
					strInterests += "...";
				}
			}
		}
		
		String strExperts = "";
		if (experts.isEmpty())
			strExperts = "Chưa cập nhật";
		else {
			for(int i=0;i<experts.size();i++)	{
				strExperts += experts.get(i).get("catchWord");
				if (i<experts.size()-1)	{
					strExperts += ", ";
				} else {
					strExperts += "...";
				}
			}
		}
		
		String template = Config.get("resourceUrl")+"/mail/invite.htm";

		ScriptProcessor processor = new ScriptProcessor();
		HashMap<String, Object> view = new HashMap<String, Object>();
		view.put("name", name);
		view.put("email", viewer.email);
		view.put("avatar", viewer.avatar);
		view.put("numQuestion", viewer.questionCount);
		view.put("numAnswer", viewer.answerCount);
		view.put("following", strInterests);
		view.put("expert", strExperts);
		
		try {
			SendMail.send(this, email, subject, subject, processor.process(template, view), null);
			invitation.senderId = viewer.id;
			invitation.targetEmail = email;
			invitation.add();
		} catch (Exception ex)	{
			Logger.getLogger().log("", Logger.LEVEL_WARNING);
			result = new Result(false, "Email sent failed", null);
		}
	}
}
