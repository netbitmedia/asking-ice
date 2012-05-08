package listener;

import inc.message.Subject;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import model.question.QuestionCatch;
import model.system.Privilege;
import model.topic.CatchWord;
import model.user.NotificationObserver;

import org.ice.Config;
import org.ice.logger.Logger;

public class Listener implements ServletContextListener {

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		Config.unload(sce.getServletContext());
	}

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		Config.load(sce.getServletContext());
		initializeMessageObservers();
		initializeCacheData();
	}

	private void initializeCacheData() {
		try {
			new CatchWord().fetchAllCatchWords();
			new Privilege().fetchAllPrivileges();
			new QuestionCatch().browseCatchWord();
		} catch (Exception ex)	{
			Logger.getLogger().log("Cannot initialize cache data: "+ex.toString(), Logger.LEVEL_WARNING);
		}
	}

	private void initializeMessageObservers() {
		Subject subject = Subject.getInstance();
		subject.register("db.postinsert", new NotificationObserver());
//		subject.register("db.postinsert", new FeedObserver());
	}
}
