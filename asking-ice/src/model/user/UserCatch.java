package model.user;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import model.topic.CatchWord;

import exception.InputException;

public class UserCatch extends UserInterest {
	
	public long vote;
	public String explanation;
	
	public String context;
	
	public UserCatch() {
		super();
		this.table = "usercatch";
		this.key = "id";
	}
	
	public Object fetchBriefByUser() throws Exception {
		CatchWord catchword = new CatchWord();
		Map<Long, CatchWord> map = catchword.fetchAllCatchWords();
		
		ArrayList<UserInterest> list = this.select("userId = ?userId", "catchWordId,vote", "vote DESC", null, 0, 5);
		for(int i=0;i<list.size();i++)	{
			list.get(i).catchWord = map.get(list.get(i).catchWordId).catchWord;
		}
		return this.view(list, "catchWord, catchWordId, vote");
	}
	
	public Object fetchByUser() throws Exception {
		ArrayList<UserCatch> list = this.select("userId = ?userId", "catchWordId,vote,explanation", null, null);
		
		CatchWord catchword = new CatchWord();
		Map<Long, CatchWord> map = catchword.fetchAllCatchWords();
		
		Map<String, ArrayList<Object>> contextMap = new HashMap<String, ArrayList<Object>>();
		for(int i=0;i<list.size();i++)	{
			CatchWord cw = map.get(list.get(i).catchWordId);
			list.get(i).catchWord = cw.catchWord;
			list.get(i).context = cw.context;
			if (!contextMap.containsKey(cw.context))	{
				contextMap.put(cw.context, new ArrayList<Object>());
			}
			contextMap.get(cw.context).add(list.get(i).view("catchWordId, catchWord, explanation, vote"));
		}
		return contextMap;
	}

	public void edit() throws Exception {
		this.update("explanation", "userId = ?userId AND catchWordId = ?catchWordId");
	}

	public void setExplanation(String param) throws InputException {
		if (param == null || param.isEmpty())
			throw new InputException("Mô tả không được để trống");
		this.explanation = param;
	}

	public void add() throws Exception {
		this.vote = 0;
		this.insert("userId, catchWordId, explanation, vote");
	}
}
