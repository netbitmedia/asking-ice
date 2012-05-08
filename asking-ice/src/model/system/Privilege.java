package model.system;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import exception.PrivilegeException;

import model.Base;
import model.user.User;

public class Privilege extends Base {
	
	private static Map<String, Privilege> privileges;
	
	public long id;
	public String controller;
	public String action;
	public String title;
	public int requiredScore;

	public Privilege()	{
		super();
		this.table = "privilege";
		this.key = "id";
	}
	
	public Map<String, Privilege> fetchAllPrivileges() throws Exception	{
		if (privileges != null)
			return privileges;
		ArrayList<Privilege> list = this.select(null);
		privileges = new HashMap<String, Privilege>();
		for(Privilege priv: list)	{
			privileges.put(priv.controller+"."+priv.action, priv);
		}
		return privileges;
	}
	
	public void enforce(User user, String controller, String action) throws Exception	{
		if (privileges.containsKey(controller+"."+action))	{
			int score = privileges.get(controller+"."+action).requiredScore;
			if (user.score < score)	{
				throw new PrivilegeException("Bạn chưa thể sử dụng tính năng này. Để sử dụng, bạn cần đạt độ nổi bật là "+score+". Hiện tại độ nổi bật của bạn là "+user.score);
			}
		}
	}
}
