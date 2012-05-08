package module;

import inc.annotations.AccessControl;

import org.ice.db.Result;

import model.question.Answer;
import model.question.Bookmark;
import model.question.EmailRecommend;
import model.question.Question;
import model.question.QuestionCatch;
import model.question.QuestionComment;
import model.question.QuestionVote;
import model.question.Recommend;
import model.question.SimilarQuestion;
import model.user.NotificationRegister;

public class QuestionModule extends BaseAjaxModule {
	
	public void getLatestQuestionsTask() throws Exception {
		Question q = new Question();
		q.id = Long.parseLong(getParam("qid"));
		result = new Result(true, null, q.getExtraQuestions());
	}
	
	@AccessControl
	public void addTask() throws Exception {
		this.addQuestion();
	}
	
	public void attachSimilarQuestionsTask() throws Exception {
		SimilarQuestion similar = new SimilarQuestion();
		String[] ids = getParam("ids").split(",");
		similar.questionId = Long.parseLong(getParam("id"));
		for(String id: ids)	{
			try {
				similar.similarId = Long.parseLong(id);
				similar.add();
			} catch (Exception ex) {}
		}
	}
	
	@AccessControl
	public void addSimilarQuestionTask() throws Exception {
		long similarId = Long.parseLong(getParam("similarId"));
		Question q = this.addQuestion();
		SimilarQuestion similar = new SimilarQuestion();
		similar.questionId = q.id;
		similar.similarId = similarId;
		similar.add();
	}
	
	private Question addQuestion() throws Exception {
		Question q = new Question();
		q.setTitle(getParam("title"));
		q.setContent(getParam("content"));
		q.userId = viewer.id;
		try {
			q.targetId = Long.parseLong(getParam("target_id"));
		} catch (Exception ex)	{}
		try {
			q.targetNextId = Long.parseLong(getParam("target_next_id"));
		} catch (Exception ex)	{}
		try {
			q.anonymous = Integer.parseInt(getParam("anonymous"));
		} catch (Exception ex) {}
		q.add();
		
		String catches = getParam("catch");
		if (catches != null && !catches.isEmpty())	{
			String []catArr = catches.split(",");
			for(String cat: catArr)	{
				try {
					Long id = Long.parseLong(cat.trim());
					QuestionCatch questionCatch = new QuestionCatch();
					questionCatch.catchWordId = id;
					questionCatch.questionId = q.id;
					questionCatch.add();
				} catch (Exception ex)	{}
			}
		}
		result = new Result(true, null, q.id);
		return q;
	}

	public void getQuestionDetailTask() throws Exception {
		Question question = new Question();
		question.id = Long.parseLong(getParam("qid"));
		result = new Result(true, null, question.fetchDetail());
	}
	
	public void getAnswersTask() throws Exception	{
		Answer answers = new Answer();
		answers.questionId = Long.parseLong(getParam("qid"));
		int page = 0;
		try {
			page = Integer.parseInt("page");
		} catch (Exception ex)	{}
		result = new Result(true, null, answers.fetchByQuestion(page));
	}
	
	public void getAllCatchwordsQuestionTask() throws Exception {
		QuestionCatch questionCatch = new QuestionCatch();
		questionCatch.questionId = Long.parseLong(getParam("qid"));
		result = new Result(true, null, questionCatch.fetchByQuestion());
	}
	
	public void changeAnonymousTask() throws Exception {
		Question question = new Question();
		question.id = Long.parseLong(getParam("id"));
		question.anonymous = Integer.parseInt(getParam("anonymous"));
		question.userId = viewer.id;
		question.editAnonymous();
		result = new Result(true, null, 1-question.anonymous);
	}
	
	public void editQuestionTask() throws Exception {
		Question question = new Question();
		question.id = Long.parseLong(getParam("id"));
		question.userId = viewer.id;
		question.setContent(getParam("content"));
		if (viewer.role.equals("admin") || viewer.role.equals("manager") || viewer.role.equals("question-verifier"))
			question.adminEdit();
		else
			question.edit();
	}
	
	@AccessControl
	public void updateVoteTask() throws Exception {
		QuestionVote vote = new QuestionVote();
		vote.questionId = Long.parseLong(getParam("qid"));
		vote.userId = viewer.id;
		vote.add();
	}
	
	public void getShuffleQuestionsTask() throws Exception {
		Question question = new Question();
		result = new Result(true, null, question.getShuffleQuestions(10));
	}
	
	public void getSimilarQuestionsTask() throws Exception {
		int all = 0;
		try {
			all = Integer.parseInt(getParam("all"));
		} catch (Exception ex) {}
		SimilarQuestion similar = new SimilarQuestion();
		similar.questionId = similar.similarId = Long.parseLong(getParam("qid"));
		if (all == 1)
			result = new Result(true, null, similar.getSimilarQuestions(-1, -1));
		else
			result = new Result(true, null, similar.getSimilarQuestions(0, 5));
	}
	
	public void forwardQuestionTask()	{
		long qid = Long.parseLong(getParam("qid"));
		String targets = getParam("target_id");
		if (targets != null)	{
			String[] targetIds = targets.split(",");
			Recommend recommend = new Recommend();
			recommend.userId = viewer.id;
			recommend.questionId = qid;
			for(String targetId: targetIds)	{
				try {
					recommend.targetId = Long.parseLong(targetId);
					recommend.add();
				} catch (Exception ex) {
					ex.printStackTrace();
				}
			}
		}
	}
	
	@AccessControl
	public void addRecommendEmailTask() throws Exception {
		EmailRecommend recommend = new EmailRecommend();
		recommend.userId = viewer.id;
		recommend.setEmail(getParam("email"));
		recommend.questionId = Long.parseLong(getParam("question_id"));
		recommend.msg = getParam("msg");
		try {
			recommend.add();
		} catch (Exception ex) {}
	}
	
	public void getForwardedAnswerersTask() throws Exception	{
		Recommend recommend = new Recommend();
		recommend.questionId = Long.parseLong(getParam("qid"));
		result = new Result(true, null, recommend.listByQuestion());
	}
	
	public void getFollowersTask() throws Exception {
		NotificationRegister notifReg = new NotificationRegister();
		notifReg.objId = Long.parseLong(getParam("uid"));
		result = new Result(true, null, notifReg.listQuestionFollowers());
	}

	public void isUserFollowingTask() throws Exception {
		NotificationRegister notifReg = new NotificationRegister();
		notifReg.userId = viewer.id;
		notifReg.objId = Long.parseLong(getParam("id"));
		int i = notifReg.isUserFollowQuestion() ? 1 : 0;
		result = new Result(true, null, i);
	}
	
	public void followQuestionTask() throws Exception {
		NotificationRegister notifReg = new NotificationRegister();
		notifReg.userId = viewer.id;
		notifReg.objId = Long.parseLong(getParam("id"));
		notifReg.registerQuestion();
	}
	
	public void unfollowQuestionTask() throws Exception {
		NotificationRegister notifReg = new NotificationRegister();
		notifReg.userId = viewer.id;
		notifReg.objId = Long.parseLong(getParam("id"));
		notifReg.unregisterQuestion();
	}
	
	public void removeTagTask() throws Exception {
		QuestionCatch q = new QuestionCatch();
		q.questionId = Long.parseLong(getParam("id"));
		q.catchWordId = Long.parseLong(getParam("tagId"));
		q.remove();
	}
	
	public void addTagTask() throws Exception {
		QuestionCatch q = new QuestionCatch();
		q.questionId = Long.parseLong(getParam("id"));
		q.catchWordId = Long.parseLong(getParam("tagId"));
		q.add();
	}
	
	public void bookmarkTask() throws Exception {
		Bookmark bookmark = new Bookmark();
		bookmark.userId = viewer.id;
		bookmark.questionId = Long.parseLong(getParam("id"));
		bookmark.add();
	}
	
	public void removeBookmarkTask() throws Exception {
		Bookmark bookmark = new Bookmark();
		bookmark.userId = viewer.id;
		bookmark.questionId = Long.parseLong(getParam("id"));
		bookmark.remove();
	}
	
	public void isBookmarkedTask() throws Exception {
		Bookmark bookmark = new Bookmark();
		bookmark.userId = viewer.id;
		bookmark.questionId = Long.parseLong(getParam("id"));
		result = new Result(true, null, bookmark.isBookmarked());
	}
	
	public void getBookmarkQuestionsTask() throws Exception {
		Bookmark bookmark = new Bookmark();
		bookmark.userId = viewer.id;
		try {
			bookmark.userId = Long.parseLong(getParam("id"));
		} catch (Exception ex) {}
		int pageIndex = 0;
		try {
			pageIndex = Integer.parseInt(getParam("page"));
		} catch (Exception ex) {}
		result = new Result(true, null, bookmark.getQuestions(pageIndex, 10));
	}
	
	public void markBestSourceTask() throws Exception {
		Question question = new Question();
		question.id = Long.parseLong(getParam("id"));
		question.setBestSource(getParam("reason"));
		question.updateBestSource();
	}
	
	public void removeBestSourceTask() throws Exception {
		Question question = new Question();
		question.id = Long.parseLong(getParam("id"));
		question.bestSource = null;
		question.updateBestSource();
	}
	
	public void getNoCommentTask() throws Exception {
		QuestionComment qc = new QuestionComment();
		qc.questionId = Long.parseLong(getParam("id"));
		result = new Result(true, null, qc.countByQuestion());
	}
}