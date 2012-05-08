package inc;

import java.util.HashMap;

import org.ice.Config;
import org.ice.logger.Logger;
import org.ice.module.HttpModule;
import org.ice.service.Mail;
import org.ice.view.ScriptProcessor;

public class SendMail {
	
	public static void send(HttpModule module, String to, String subject, String title, String content, String replyTo)	{
		SendMail.send(module, "BKProfile Team <bkprofile@bkprofile.com>", to, subject, title, content, replyTo);
	}

	public static void send(HttpModule module, String from, String to, String subject, String title, String content, String replyTo)	{
		Mail mail = (Mail) Config.get("mail");
		if (mail == null)	{
			Logger.getLogger().log("Mail service has not been setup", Logger.LEVEL_NOTICE);
			return;
		}
		try {
			ScriptProcessor processor = new ScriptProcessor();
			HashMap<String, Object> view = new HashMap<String, Object>();
			String template = Config.get("resourceUrl")+"/mail/template.htm";
			if (module != null)	{
				view.put("baseUrl", module.getBaseUrl());
				view.put("resourceUrl", module.getResourceUrl());
			} else {
				view.put("baseUrl", "http://asking.vn");
				view.put("resourceUrl", "http://asking.vn/resource");
			}
			view.put("title", title);
			view.put("content", content);
			mail.send(from, to, subject, processor.process(template, view), replyTo);
			Logger.getLogger().log("Mail sent", Logger.LEVEL_DEBUG);
		} catch (Exception ex)	{
			ex.printStackTrace();
			Logger.getLogger().log("Cannot send email to ["+to+"]", Logger.LEVEL_ERROR);
		}
	}
	
	public static void sendNoTemplate(String to, String subject, String title, String content, String replyTo)	{
		Mail mail = (Mail) Config.get("mail");
		if (mail == null)	{
			Logger.getLogger().log("Mail service has not been setup", Logger.LEVEL_NOTICE);
			return;
		}
		try {
			mail.send("BKProfile Team <bkprofile@bkprofile.com>", to, subject, content, replyTo);
		} catch (Exception ex)	{
			ex.printStackTrace();
			Logger.getLogger().log("Cannot send email to ["+to+"]", Logger.LEVEL_ERROR);
		}
	}
}
