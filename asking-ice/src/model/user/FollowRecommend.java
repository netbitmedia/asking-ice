package model.user;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.ice.db.Table;

public class FollowRecommend extends Table {
	
	public long id;
	public long userId;
	public String targetId;

	public FollowRecommend() {
		this.table = "followrecommend";
		this.key = "id";
	}
	
	public ArrayList<User> listByUser() throws Exception {
		ArrayList<FollowRecommend> list = this.select("userId = ?userId");
		if (list.isEmpty())
			return new ArrayList<User>();
		
		UserFollow follow = new UserFollow();
		follow.sourceId = this.userId;
		ArrayList<UserFollow> follows = follow.select("sourceId = ?sourceId");
		
		Map<Long, Boolean> maps = new HashMap<Long, Boolean>();
		for (UserFollow userFollow : follows) {
			maps.put(userFollow.targetId, true);
		}
		
		String[] targets = list.get(0).targetId.split(",");
		StringBuilder builder = new StringBuilder("-1");
		int count = 0;
		for(int i=0; i<targets.length && count<10; i++) {
			if (!maps.containsKey(Long.parseLong(targets[i]))) {
				count ++;
				builder.append(","+targets[i]);
			}
		}
		return new User().select("id IN ("+builder.toString()+")", "id,name,avatar", null, null);
	}
	
	public void add() throws Exception {
		this.insert("userId, targetId");
	}
}
