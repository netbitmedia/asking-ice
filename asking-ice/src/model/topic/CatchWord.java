package model.topic;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import exception.InputException;

import model.Base;
import model.question.QuestionCatch;
import model.user.UserCatch;
import model.user.UserInterest;

public class CatchWord extends Base {

	private static Map<Long, CatchWord> catchwords;
	
	public long id;
	public String catchWord;
	public long contextId;
	public String avatar;
	public String detail;
	public String context;
	
	public long totalQuestions;
	public long totalExperts;
	public long totalFollowers;
	public long totalAnswers;
	
	public CatchWord()	{
		super();
		this.table = "catchwords";
		this.key = "id";
	}
	
	public Map<Long, CatchWord> fetchAllCatchWords() throws Exception {
		if (catchwords != null)
			return catchwords;
		ArrayList<CatchWord> cws = this.foreignJoin(new CatchWordContext(), "contextId", null, "context", null, null, null, -1, -1);
		catchwords = new HashMap<Long, CatchWord>();
		for(CatchWord cw: cws) {
			catchwords.put(cw.id, cw);
		}
	
		ArrayList<QuestionCatch> _question = new QuestionCatch().fetchTotalQuestions();
		for(QuestionCatch questionCatch: _question) {
			if (catchwords.containsKey(questionCatch.catchWordId)) {
				catchwords.get(questionCatch.catchWordId).totalQuestions = questionCatch.totalQuestion;
			}
		}
		
		ArrayList<? extends UserInterest> _expert = new UserCatch().fetchTotalUsers();
		for(UserInterest questionCatch: _expert) {
			if (catchwords.containsKey(questionCatch.catchWordId)) {
				catchwords.get(questionCatch.catchWordId).totalExperts = questionCatch.totalUser;
			}
		}
		
		ArrayList<? extends UserInterest> _interest = new UserInterest().fetchTotalUsers();
		for(UserInterest questionCatch: _interest) {
			if (catchwords.containsKey(questionCatch.catchWordId)) {
				catchwords.get(questionCatch.catchWordId).totalFollowers = questionCatch.totalUser;
			}
		}
		
		return catchwords;
	}
	
	public Map<Long, CatchWord> browseCatchWords() throws Exception {
		return this.fetchAllCatchWords();
	}
	
	public Object fetchCatchWordDetail() throws Exception {
		return this.fetchAllCatchWords().get(id);
	}

	public void add() throws Exception {
		this.avatar = "";
		this.contextId = 22;
		this.context = "Chưa phân loại";
		this.insert("contextId, avatar, detail, catchWord");
		
		try {
			synchronized (catchwords) {
				System.out.println("putting "+id+" into catchword cache");
				catchwords.put(id, this);
			}
		} catch (Exception ex)	{
			System.out.println(ex.toString());
		}
	}

	public void setCatchWord(String catchWord) throws InputException {
		if (catchWord == null || catchWord.isEmpty())	{
			throw new InputException("Tên chủ đề không được để trống");
		}
		this.catchWord = catchWord;
	}
}
