package module;

import inc.SendMail;

import java.lang.reflect.Method;
import java.util.ArrayList;

import model.system.Newsletter;
import model.system.Subscription;

import org.ice.Config;
import org.ice.exception.AccessDeniedException;
import org.ice.view.ScriptView;

public class AdminModule extends BaseAjaxModule {
	
	public void preDispatch(Method method) throws Exception {
		super.preDispatch(method);
		System.out.println(viewer.id);
		if (viewer.role == null || !viewer.role.equals("admin"))	{
			throw new AccessDeniedException("You are not allowed to take this action");
		}
	}

	public void sendNewsletterTask() throws Exception {
		ScriptView view = new ScriptView();
		view.setTemplate(Config.get("resourceUrl")+"/mail/newsletter.htm");
		getRequest().setAttribute("title", getParam("title"));
		getRequest().setAttribute("content", getParam("content"));
		getRequest().setAttribute("baseUrl", this.getBaseUrl());
		getRequest().setAttribute("resourceUrl", this.getResourceUrl());
		
		Subscription subscription = new Subscription();
		int current = 0;
		while (true)	{
			ArrayList<Subscription> emails = subscription.fetchSubscriptions(current, 500);
			if (emails.isEmpty())
				break;
			for(Subscription s: emails)	{
				getRequest().setAttribute("email", s.email);
				getRequest().setAttribute("unsubscribeCode", s.encodeEmail());
				view.render(getRequest(), getResponse());
				SendMail.sendNoTemplate(s.email, getParam("title"), getParam("title"), getResponse().getBody(), null);
			}
			current += 500;
		}
		
		Newsletter newsletter = new Newsletter();
		newsletter.userId = viewer.id;
		newsletter.title = getParam("title");
		newsletter.content = getParam("content");
		newsletter.add();
	}
}
