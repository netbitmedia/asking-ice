package model.question;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import model.Base;
import model.user.User;

import exception.InputException;

public class Answer extends Base {
	
	public long id;
	public long userId;
	public long questionId;
	public String content;
	public int vote;
	public int downVote;
	public Timestamp since;
	public Timestamp lastEdited;
	
	public ArrayList<Integer> negativeTypes = new ArrayList<Integer>();
	public String name;
	public String avatar;
	public int hidden;
	public String oldContent;

	public Answer()	{
		super();
		this.table = "answers";
		this.key = "id";
	}

	public long countByUser() throws Exception {
		return countByCustom("userId = ?userId");
	}
	
	public Object fetchByQuestion(int page) throws Exception	{
		//FIXME: Procedure OR SELECT IN
		ArrayList<Answer> list = this.foreignJoin(new User(), "userId", this.where("questionId"), "name, avatar", null, null, null, page, 10);
		if (list.isEmpty()) return list;
		
		Map<Long, Answer> map = new HashMap<Long, Answer>();
		String ids = "-1";
		for(Answer a: list)	{
			ids += ","+a.id;
			if (a.downVote >= 65)	{
				a.hidden = 1;
			}
			map.put(a.id, a);
		}
		
		AnswerFlag flag = new AnswerFlag();
		ArrayList<AnswerFlag> flags = flag.getByAnswers(ids);
		for(AnswerFlag f: flags)	{
			Answer a = map.get(f.answerId);
			if (a.negativeTypes == null)	{
				a.negativeTypes = new ArrayList<Integer>();
			}
			a.negativeTypes.add(f.type);
		}
		return map;
	}

	public void setContent(String content) throws Exception {
		if (content == null || content.isEmpty())
			throw new InputException("Nội dung bài trả lời không được để trống");
		if (content.length() > 30000)
			throw new InputException("Nội dung bài trả lời không được quá 30.000 kí tự");
		this.content = content;
	}

	public void add() throws Exception {
		this.downVote = this.vote = 0;
		this.insert("userId, questionId, content, vote, downVote");
	}

	public void edit() throws Exception {
		if (downVote != 0)	{
			downVote = 0;
			AnswerFlag flag = new AnswerFlag();
			flag.answerId = id;
			flag.clearFlag();
		}
		this.lastEdited = new Timestamp(new Date().getTime());
		this.update("content, downVote, lastEdited", "userId = ?userId AND id = ?id");
	}

	public void addVote() throws Exception {
		this.update("vote = vote + 1");
	}

	public void updateDownVote() throws Exception {
		this.update("downVote");
	}
}
