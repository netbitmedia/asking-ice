package model.question;

import java.util.ArrayList;
import java.util.Map;

import model.Base;
import model.topic.CatchWord;

public class QuestionCatch extends Base {
	
	private static Object catches;
	
	public long id;
	public long questionId;
	public long catchWordId;
	public String catchWord;
	public long totalQuestion;
	
	public QuestionCatch() {
		super();
		this.table = "questioncatch";
		this.key = "id";
	}
	
	public Object browseCatchWord() throws Exception {
		if (catches != null)
			return catches;
		Map<Long, CatchWord> list = new CatchWord().fetchAllCatchWords();
		ArrayList<QuestionCatch> _catches = this.select(null, "catchWordId, COUNT(questionId) AS totalQuestion", "totalQuestion DESC", "catchWordId", 0, 35);
		for(QuestionCatch questionCatch: _catches) {
			questionCatch.id = questionCatch.catchWordId;
			if (list.containsKey(questionCatch.catchWordId)) {
				questionCatch.catchWord = list.get(questionCatch.catchWordId).catchWord;
			}
		}
		return (catches = this.view(_catches, "id, catchWord, totalQuestion"));
	}
	
	public long countQuestionsByTopic() throws Exception {
		ArrayList<QuestionCatch> list = this.select("catchWordId = ?catchWordId", "COUNT(id) AS totalQuestion", null, null);
		return list.get(0).totalQuestion;
	}
	
	public String fetchIdsByQuestion() throws Exception {
		ArrayList<QuestionCatch> catches = this.select("questionId = ?questionId");
		String ids = "-1";
		for(QuestionCatch c: catches) {
			ids += ","+c.catchWordId;
		}
		return ids;
	}

	public Object fetchByQuestion() throws Exception {
		CatchWord cw = new CatchWord();
		Map<Long, CatchWord> map = cw.fetchAllCatchWords();
		
		ArrayList<QuestionCatch> list = this.select("questionId = ?questionId");
		for(QuestionCatch questionCatch: list) {
			questionCatch.id = questionCatch.catchWordId;
			if (map.containsKey(questionCatch.catchWordId)) {
				questionCatch.catchWord = map.get(questionCatch.catchWordId).catchWord;
			}
		}
		return list;
	}

	public void add() throws Exception {
		this.insert("catchWordId, questionId");
	}

	public ArrayList<QuestionCatch> fetchTotalQuestions() throws Exception {
		return this.select(null, "catchWordId, COUNT(questionId) AS totalQuestion", "totalQuestion DESC", "catchWordId");
	}

	public void remove() throws Exception {
		this.delete("catchWordId = ?catchWordId AND questionId = ?questionId");
	}
}
