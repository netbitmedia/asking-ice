package module;

import javax.naming.OperationNotSupportedException;

import model.question.QuestionCatch;
import model.system.StatsWeek;
import model.topic.CatchWord;
import model.topic.CatchWordContext;
import model.user.UserCatch;
import model.user.UserInterest;

import org.ice.db.Result;
import org.ice.db.Viewer;

public class CatchwordModule extends BaseAjaxModule {

	public void browseCatchWordTask() throws Exception {
		result = new Result(true, null, new QuestionCatch().browseCatchWord());
	}
	
	public void getTopicDetailsTask() throws Exception {
		long id = Long.parseLong(this.getParam("id"));
		CatchWord catchword = new CatchWord();
		catchword.id = id;
		result = new Result(true, null, catchword.fetchCatchWordDetail());
	}
	
	public void getTopicStatsTask() throws Exception {
		long id = Long.parseLong(this.getParam("id"));
		
		QuestionCatch questionCatch = new QuestionCatch();
		questionCatch.catchWordId = id;
		UserCatch userCatch = new UserCatch();
		userCatch.catchWordId = id;
		UserInterest userInterest = new UserInterest();
		userInterest.catchWordId = id;
		
		Viewer viewer = new Viewer(null, null);
		viewer.put("question", questionCatch.countQuestionsByTopic());
//		viewer.put("answer", questionCatch.countQuestionsByTopic());
		viewer.put("expert", userCatch.countUsersByTopic());
		viewer.put("follow", userInterest.countUsersByTopic());
		
		result = new Result(true, null, viewer.getMap());
	}
	
	public void getAllCatchwordsTask() throws Exception {
		CatchWord catchword = new CatchWord();
		result = new Result(true, null, catchword.browseCatchWords());
	}
	
	public void getAllContextsTask() throws Exception {
		CatchWordContext context = new CatchWordContext();
		result = new Result(true, null, context.browseContexts());
	}
	
	public void userHasInterestTask() throws Exception {
		UserInterest userInterest = new UserInterest();
		userInterest.catchWordId = Long.parseLong(getParam("id"));
		userInterest.userId = viewer.id;
		result = new Result(true, null, userInterest.hasInterest() ? 1 : 0);
	}
	
	public void addNewTopicTask() throws Exception {
		CatchWord catchword = new CatchWord();
		catchword.setCatchWord(getParam("topicName"));
		catchword.detail = getParam("topicDes");
		catchword.add();
		result = new Result(true, null, catchword.id);
	}
	
	public void getSingleStatsTask() throws Exception {
		int from = Integer.parseInt(getParam("from"));
		int to = Integer.parseInt(getParam("to"));
		long id = Long.parseLong(getParam("id"));
		String type = getParam("type");
		
		Viewer view = new Viewer();
		view.put("topic", new CatchWord().browseCatchWords().get(id).catchWord);
		
		if (type.equals("week"))	{
			StatsWeek sw = new StatsWeek();
			sw.catchWordId = id;
			view.put("data", sw.fetchWeeklyData(from, to));
		} else if (type.equals("month"))	{
			throw new OperationNotSupportedException();
		}
		result = new Result(true, null, view.getMap());
	}
}
