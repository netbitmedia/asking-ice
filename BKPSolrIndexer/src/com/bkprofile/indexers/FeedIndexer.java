package com.bkprofile.indexers;

import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

import org.ice.Config;
import org.ice.db.AdapterFactory;

import com.bkprofile.entities.Doc;
import com.bkprofile.entities.DocPartial;
import com.bkprofile.models.Answer;
import com.bkprofile.models.CatchWord;
import com.bkprofile.models.Question;
import com.bkprofile.models.QuestionCatch;
import com.bkprofile.models.User;
import com.bkprofile.models.UserCatch;
import com.bkprofile.models.UserFollow;
import com.bkprofile.models.UserInterest;
import com.bkprofile.utils.ConfigLoader;

public class FeedIndexer extends AbstractIndexer {
	private static final int MAX_DOC_UPDATE = configLoader.getMaxDocCommit();
	private static FeedIndexer instance = null;
	
	private Map<Long, User> userMap = new HashMap<Long, User>();
	private Map<Long, Question> questionMap = new HashMap<Long, Question>();
	private Map<Long, Long> answerCountMap = new HashMap<Long, Long>();
	private Map<Long, Answer> answerMaxVoteMap = new HashMap<Long, Answer>();
	private Map<Long, User> answerMaxVoteUserMap = new HashMap<Long, User>();
	private Map<Long, CatchWord> catchWordMap = new HashMap<Long, CatchWord>();
	
	private Map<Long, ArrayList<Long>> userCatchMap = new HashMap<Long, ArrayList<Long>>();
	private Map<Long, ArrayList<Long>> questionCatchMap = new HashMap<Long, ArrayList<Long>>();
	private Map<Long, ArrayList<Long>> userFollowMap = new HashMap<Long, ArrayList<Long>>();

	public static FeedIndexer getInstance() {
		if (instance == null) {
			instance = new FeedIndexer();
		}
		return instance;
	}

	public static void main(String[] args) throws Exception {
		ConfigLoader.getInstance();
		int min = -1;
		int max = Integer.MAX_VALUE;
		for (int i = 0; i < args.length; i++) {
			if (args[i].equalsIgnoreCase("-c")) {
				ConfigLoader.getInstance().setCore(args[(i + 1)]);
			}
			if (args[i].equalsIgnoreCase("-u")) {
				ConfigLoader.getInstance().setUser(args[(i + 1)]);
			}
			if (args[i].equalsIgnoreCase("-p")) {
				ConfigLoader.getInstance().setPassword(args[(i + 1)]);
			}
			if (args[i].equalsIgnoreCase("--min")) {
				min = Integer.parseInt(args[(i + 1)]);
			}
			if (args[i].equalsIgnoreCase("--max")) {
				max = Integer.parseInt(args[(i + 1)]);
			}
		}
		
		Config.debugMode = true;
		AdapterFactory.setupAdapter("org.ice.db.MySqlAdapter", "joolist.com", null, "bkprofile", "YNcn3SnSw8", "bkprofile");

		FeedIndexer obj = getInstance();
		obj.setRange(min, max);
		System.out.println("Indexing "
				+ ConfigLoader.getInstance().getCoreSolr());
		obj.index();
		System.exit(0);
	}

	public String getIdField() {
		return "feed_id";
	}

	public boolean index() {
		try {
			Question q = new Question();
			Answer a = new Answer();
			User u = new User();
			CatchWord cw = new CatchWord();
			UserCatch uc = new UserCatch();
			UserInterest ui = new UserInterest();
			QuestionCatch qc = new QuestionCatch();
			UserFollow uf = new UserFollow();
			
			ArrayList<Question> questions = q.listQuestions();
			ArrayList<Answer> answers = a.listAnswers();
			ArrayList<User> users = u.listUsers();
			ArrayList<CatchWord> catches = cw.listCatchWord();
			ArrayList<UserCatch> userCatches = uc.listExpertise();
			ArrayList<UserInterest> userInterestes = ui.listInterest();
			ArrayList<QuestionCatch> questionCatches = qc.listQuestionCatch();
			ArrayList<UserFollow> userFollowes = uf.listUserFollow();
			
			for(User user: users) {
				userMap.put(user.id, user);
			}
			
			for(Question question: questions) {
				questionMap.put(question.id, question);
			}
			
			for(CatchWord catchWord: catches) {
				catchWordMap.put(catchWord.id, catchWord);
			}
			
			for(UserCatch userCatch: userCatches) {
				if (!userCatchMap.containsKey(userCatch.catchWordId)) {
					userCatchMap.put(userCatch.catchWordId, new ArrayList<Long>());
				}
				userCatchMap.get(userCatch.catchWordId).add(userCatch.userId);
			}
			
			for(UserInterest userCatch: userInterestes) {
				if (!userCatchMap.containsKey(userCatch.catchWordId)) {
					userCatchMap.put(userCatch.catchWordId, new ArrayList<Long>());
				}
				userCatchMap.get(userCatch.catchWordId).add(userCatch.userId);
			}
			
			for(QuestionCatch questionCatch: questionCatches) {
				if (!questionCatchMap.containsKey(questionCatch.questionId)) {
					questionCatchMap.put(questionCatch.questionId, new ArrayList<Long>());
				}
				questionCatchMap.get(questionCatch.questionId).add(questionCatch.catchWordId);
			}
			
			for(UserFollow userFollow: userFollowes) {
				if (!userFollowMap.containsKey(userFollow.targetId)) {
					userFollowMap.put(userFollow.targetId, new ArrayList<Long>());
				}
				userFollowMap.get(userFollow.targetId).add(userFollow.sourceId);
			}
			
			for(Answer answer: answers) {
				if (!answerCountMap.containsKey(answer.questionId)) {
					answerCountMap.put(answer.questionId, 1L);
				} else {
					answerCountMap.put(answer.questionId, answerCountMap.get(answer.questionId)+1);
				}
				
				if (!answerMaxVoteMap.containsKey(answer.questionId)) {
					if (userMap.containsKey(answer.userId)) {
						answerMaxVoteUserMap.put(answer.questionId, userMap.get(answer.userId));
					}
					answerMaxVoteMap.put(answer.questionId, answer);
				} else {
					int vote = answerMaxVoteMap.get(answer.questionId).vote;
					if (vote < answer.vote) {
						if (userMap.containsKey(answer.userId)) {
							answerMaxVoteUserMap.put(answer.questionId, userMap.get(answer.userId));
						}
						answerMaxVoteMap.put(answer.questionId, answer);
					}
				}
			}
			
			ArrayList<Doc> docs = new ArrayList<Doc>();
			Doc doc = null;
			int count = 0;
			int id = 0;
			
			//Feed for followers
			for(Question question: questions) {
				if (!userMap.containsKey(question.userId)) {
					System.out.println("User not exist for question: "+question.id);
					continue;
				}
				
				User qUser = userMap.get(question.userId);
				
				Date date = new Date(question.since.getTime());
				Time time = new Time(question.since.getTime());
				String strTime = buildSolrDate(date, time);
				
				doc = new Doc(id+"");
				id ++;
				this.addQuestionDoc(doc, question);
				
				doc.add(new DocPartial("feed_user_id", qUser.id + ""));
				doc.add(new DocPartial("feed_user_name", qUser.name));
				doc.add(new DocPartial("feed_type", "PersonAsked"));
				doc.add(new DocPartial("user_name", qUser.name));
				doc.add(new DocPartial("user_id", qUser.id + ""));
				doc.add(new DocPartial("date", strTime));
				doc.add(new DocPartial("feed_avatar", qUser.avatar));
				if (userFollowMap.containsKey(qUser.id)) {
					ArrayList<Long> followers = userFollowMap.get(qUser.id);
					for(Long follower: followers) {
						doc.add(new DocPartial("followers", follower+""));
					}
				}
				
				docs.add(doc);
				if (count++ > MAX_DOC_UPDATE) {
					updateDocuments(docs);
					optimiseUpdate();
					docs.clear();
					count = 0;
				}
			}
			
			for(Question question: questions) {
				if (!questionCatchMap.containsKey(question.id)) {
					continue;
				}
				if (!userMap.containsKey(question.userId)) {
					System.out.println("User not exist for question: "+question.id);
					continue;
				}
				
				ArrayList<Long> qcs = questionCatchMap.get(question.id);
				
				User qUser = userMap.get(question.userId);
				
				Date date = new Date(question.since.getTime());
				Time time = new Time(question.since.getTime());
				String strTime = buildSolrDate(date, time);

				for(Long qci: qcs) {
					if (!catchWordMap.containsKey(qci))
						continue;
					
					doc = new Doc(id+"");
					id ++;
					this.addQuestionDoc(doc, question);
					
					CatchWord catchword = catchWordMap.get(qci);
					
					doc.add(new DocPartial("feed_user_id", qUser.id + ""));
					doc.add(new DocPartial("feed_user_name", qUser.name));
					doc.add(new DocPartial("feed_content", catchword.catchWord));
					doc.add(new DocPartial("feed_content_id", catchword.id + ""));
					doc.add(new DocPartial("feed_type", "QuestionAsked"));
					doc.add(new DocPartial("user_name", qUser.name));
					doc.add(new DocPartial("user_id", qUser.id + ""));
					doc.add(new DocPartial("date", strTime));
					doc.add(new DocPartial("feed_avatar", catchword.avatar));
					if (userCatchMap.containsKey(catchword.id)) {
						ArrayList<Long> followers = userCatchMap.get(catchword.id);
						for(Long follower: followers) {
							doc.add(new DocPartial("followers", follower+""));
						}
					}
					
					docs.add(doc);
					if (count++ > MAX_DOC_UPDATE) {
						updateDocuments(docs);
						optimiseUpdate();
						docs.clear();
						count = 0;
					}
				}
			}
			
			for(Answer answer: answers) {
				if (!userMap.containsKey(answer.userId)) {
					System.out.println("User not exist for answer: "+answer.id+"; "+answer.userId);
					continue;
				}
				
				User aUser = userMap.get(answer.userId);
				Question aQuestion = questionMap.get(answer.questionId);
				if (!userMap.containsKey(aQuestion.userId)) {
					System.out.println("User not exist for answer-question: "+aQuestion.userId+"; "+aQuestion.userId);
					continue;
				}
				User qUser = userMap.get(aQuestion.userId);
				
				Date date = new Date(answer.since.getTime());
				Time time = new Time(answer.since.getTime());
				String strTime = buildSolrDate(date, time);
				
				doc = new Doc(answer.id+"");
				
				this.addQuestionDoc(doc, aQuestion);
				
				doc.add(new DocPartial("feed_user_id", aUser.id + ""));
				doc.add(new DocPartial("feed_user_name", aUser.name));
				doc.add(new DocPartial("feed_content_id", answer.id + ""));
				doc.add(new DocPartial("feed_type", "PersonAnswered"));
				doc.add(new DocPartial("user_name", qUser.name));
				doc.add(new DocPartial("user_id", qUser.id + ""));
				doc.add(new DocPartial("date", strTime));
				doc.add(new DocPartial("feed_avatar", aUser.avatar));
				if (userFollowMap.containsKey(aUser.id)) {
					ArrayList<Long> followers = userFollowMap.get(aUser.id);
					for(Long follower: followers) {
						doc.add(new DocPartial("followers", follower+""));
					}
				}
				
				docs.add(doc);
				if (count++ > MAX_DOC_UPDATE) {
					updateDocuments(docs);
					optimiseUpdate();
					docs.clear();
					count = 0;
				}
			}
			
			for(Answer answer: answers) {
				if (!userMap.containsKey(answer.userId)) {
					System.out.println("User not exist for answer: "+answer.id+"; "+answer.userId);
					continue;
				}
				
				User aUser = userMap.get(answer.userId);
				Question aQuestion = questionMap.get(answer.questionId);
				if (!userMap.containsKey(aQuestion.userId)) {
					System.out.println("User not exist for answer-question: "+aQuestion.userId);
					continue;
				}
				User qUser = userMap.get(aQuestion.userId);
				
				if (!questionCatchMap.containsKey(aQuestion.id)) {
					continue;
				}
				
				ArrayList<Long> qcs = questionCatchMap.get(aQuestion.id);
				
				Date date = new Date(aQuestion.since.getTime());
				Time time = new Time(aQuestion.since.getTime());
				String strTime = buildSolrDate(date, time);

				for(Long qci: qcs) {
					if (!catchWordMap.containsKey(qci))
						continue;
					
					doc = new Doc(id+"");
					id ++;
					this.addQuestionDoc(doc, aQuestion);
					
					CatchWord catchword = catchWordMap.get(qci);
					
					doc.add(new DocPartial("feed_user_id", aUser.id + ""));
					doc.add(new DocPartial("feed_user_name", aUser.name));
					doc.add(new DocPartial("feed_content", catchword.catchWord));
					doc.add(new DocPartial("feed_content_id", catchword.id + ""));
					doc.add(new DocPartial("feed_type", "QuestionAnswered"));
					doc.add(new DocPartial("user_name", qUser.name));
					doc.add(new DocPartial("user_id", qUser.id + ""));
					doc.add(new DocPartial("date", strTime));
					doc.add(new DocPartial("feed_avatar", catchword.avatar));
					if (userCatchMap.containsKey(catchword.id)) {
						ArrayList<Long> followers = userCatchMap.get(catchword.id);
						for(Long follower: followers) {
							doc.add(new DocPartial("followers", follower+""));
						}
					}
					
					docs.add(doc);
					if (count++ > MAX_DOC_UPDATE) {
						updateDocuments(docs);
						optimiseUpdate();
						docs.clear();
						count = 0;
					}
				}
			}
			
			if (count > 0) {
				updateDocuments(docs);
				optimiseUpdate();
			}
			docs.clear();
			docs = null;
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			
		}
		return true;
	}

	public void indexRange() {
		int step = configLoader.getStep();

		if (this.rangeStart == -1) {
			this.rangeStart = 0;
		}
		if (this.rangeStop == -1) {
			this.rangeStop = Integer.MAX_VALUE;
		}
		int end = this.rangeStop;

		this.rangeStop = this.rangeStart;
		boolean ok = true;
		while (ok) {
			this.rangeStart = this.rangeStop;
			int tmp = this.rangeStart + step;
			this.rangeStop = (tmp > end ? end : tmp);
			System.out.println("");
			System.out.print("Index from ");
			System.out.print(this.rangeStart + " to ");
			System.out.println(this.rangeStop);
			if (index())
				ok = true;
			else
				ok = false;
		}
	}
	
	private String buildSolrDate(Date date, Time time) {
		Calendar cal = new GregorianCalendar();
		cal.setTimeZone(TimeZone.getTimeZone("GMT+7:00"));
		cal.setTime(date);
		String strTime = "";
		strTime = strTime + cal.get(Calendar.YEAR);
		strTime = strTime + "-";
		strTime = strTime + (cal.get(Calendar.MONTH) + 1);
		strTime = strTime + "-";
		strTime = strTime + cal.get(Calendar.DAY_OF_MONTH);
		strTime = strTime + "T";
		strTime = strTime + time.toString();
		strTime = strTime + "Z";
		return strTime;
	}
	
	private void addQuestionDoc(Doc doc, Question question) {
		doc.add(new DocPartial("content", question.title));
		doc.add(new DocPartial("best_source", question.bestSource));
		doc.add(new DocPartial("is_best_source", question.bestSource != null ? "1" : "0"));
		doc.add(new DocPartial("question_id", question.id + ""));
		if (answerCountMap.containsKey(question.id)) {
			doc.add(new DocPartial("answers_count", answerCountMap.get(question.id) + ""));
		} else {
			doc.add(new DocPartial("answers_count", 0 + ""));
		}
		
		if (answerMaxVoteMap.containsKey(question.id)) {
			Date date = new Date(answerMaxVoteMap.get(question.id).since.getTime());
			Time time = new Time(answerMaxVoteMap.get(question.id).since.getTime());
			
			doc.add(new DocPartial("answers_max_vote_vote", answerMaxVoteMap.get(question.id).vote + ""));
			doc.add(new DocPartial("answers_max_vote_user_name", answerMaxVoteUserMap.get(question.id).name));
			doc.add(new DocPartial("answers_max_vote_user_id", answerMaxVoteUserMap.get(question.id).id + ""));
			doc.add(new DocPartial("answers_max_vote_time", this.buildSolrDate(date, time)));
		}
		
		doc.add(new DocPartial("vote", question.vote + ""));
		doc.add(new DocPartial("anonymous", question.anonymous + ""));
	}
}