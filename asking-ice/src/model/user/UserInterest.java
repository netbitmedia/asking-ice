package model.user;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import model.Base;
import model.topic.CatchWord;

public class UserInterest extends Base {
	
	public long id;
	public long userId;
	public long catchWordId;
	public String catchWord;
	
	public long totalUser;
	
	public UserInterest() {
		super();
		this.table = "userinterest";
		this.key = "id";
	}
	
	public long countUsersByTopic() throws Exception {
		ArrayList<UserInterest> list = this.select("catchWordId = ?catchWordId", "COUNT(id) AS totalUser", null, null);
		return list.get(0).totalUser;
	}
	
	public Object fetchBriefByUser() throws Exception {
		CatchWord catchword = new CatchWord();
		Map<Long, CatchWord> map = catchword.fetchAllCatchWords();
		
		ArrayList<UserInterest> list = this.select("userId = ?userId", "catchWordId", null, null, 0, 5);
		for(int i=0;i<list.size();i++)	{
			list.get(i).catchWord = map.get(list.get(i).catchWordId).catchWord;
		}
		return this.view(list, "catchWord, catchWordId");
	}
	
	public Object fetchByUser() throws Exception {
		ArrayList<UserInterest> list = this.select("userId = ?userId", "catchWordId", null, null);
		
		CatchWord catchword = new CatchWord();
		Map<Long, CatchWord> map = catchword.fetchAllCatchWords();
		
		Map<String, ArrayList<Object>> contextMap = new HashMap<String, ArrayList<Object>>();
		for(int i=0;i<list.size();i++)	{
			CatchWord cw = map.get(list.get(i).catchWordId);
			String context = cw.context;
			if (!contextMap.containsKey(context))	{
				contextMap.put(context, new ArrayList<Object>());
			}
			contextMap.get(context).add(cw.view("id, catchWord"));
		}
		return contextMap;
	}

	public void remove() throws Exception {
		this.delete("userId = ?userId AND catchWordId = ?catchWordId");
	}

	public void add() throws Exception {
		this.insert("userId, catchWordId");
	}

	public boolean hasInterest() throws Exception {
		return !this.select("userId = ?userId AND catchWordId = ?catchWordId", "id", null, null).isEmpty();
	}

	public ArrayList<? extends UserInterest> fetchTotalUsers() throws Exception {
		return this.select(null, "catchWordId, COUNT(userId) AS totalUser", "totalUser DESC", "catchWordId");
	}
	
	public boolean hasFillCatch() throws Exception {
		return !this.select("userId = ?userId", "id", null, null, 0, 1).isEmpty();
	}

	public String fetchIdByUsers() throws Exception {
		String id = "";
		ArrayList<UserInterest> list = this.select("userId = ?userId");
		for(UserInterest ui: list) {
			id += ui.catchWordId+",";
		}
		if (!id.isEmpty())
			id = id.substring(0, id.length()-1);
		return id;
	}
}
