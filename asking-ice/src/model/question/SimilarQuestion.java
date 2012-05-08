package model.question;

import java.util.ArrayList;

import model.Base;

public class SimilarQuestion extends Base {
	
	public long id;
	public long questionId;
	public long similarId;
	
	public String title;

	public SimilarQuestion()	{
		super();
		this.table = "similarquestions";
		this.key = "id";
	}
	
	public Object getSimilarQuestions(int index, int size) throws Exception {
		Question q = new Question();
		ArrayList<SimilarQuestion> list = this.foreignJoin(q, null, "("+where("similarId")+" AND questionId = "+q.where()+" ) OR ("+where("questionId")+" AND similarId = "+q.where()+" )", "questions.id, title", "", "since DESC", null, index, size);
		return this.view(list, "id, title");
	}

	public void add() throws Exception {
		ArrayList<SimilarQuestion> list = this.select("questionId = ?similarId AND similarId = ?questionId");
		if (list.isEmpty())
			this.insert("questionId, similarId");
	}
}
