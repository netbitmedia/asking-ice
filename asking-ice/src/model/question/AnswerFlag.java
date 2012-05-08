package model.question;

import java.util.ArrayList;

import model.Base;
import model.user.ExpertRank;
import model.user.User;

public class AnswerFlag extends Base {

	public long answerId;
	public long userId;
	public int type;
	public double point;
	
	public AnswerFlag()	{
		super();
		this.table = "answerflag";
		this.key = "id";
	}

	public ArrayList<AnswerFlag> getByAnswers(String ids) throws Exception {
		return this.select("answerId IN ("+ids+")");
	}

	public int isFlagged() throws Exception {
		return this.select("answerId = ?answerId AND userId = ?userId", null, null, null, 0, 1).size();
	}

	public void add(User user, Answer answer) throws Exception {
		double reputPoint = user.calcReputationPoint();
		
		QuestionCatch qc = new QuestionCatch();
		qc.questionId = answer.questionId;
		String tags = qc.fetchIdsByQuestion();
		ExpertRank er = new ExpertRank();
		er.userId = user.id;
		double erPoint = er.getExpertRankPoint(tags);
		
		point = reputPoint*0.7+erPoint*0.3;
		
		userId = user.id;
		answerId = answer.id;
		this.insert("answerId, userId, type, point");
		
		answer.downVote += (int)Math.floor(point);
		answer.updateDownVote();
	}

	public void clearFlag() throws Exception {
		this.delete("answerId = ?answerId");
	}
}
