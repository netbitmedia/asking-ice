package model.user;

import java.util.ArrayList;

import model.Base;

public class UserProfile extends Base implements IProfile {
	
	public long id;
	public long userId;
	public String about;
	public String school;
	public String profession;
	public String gender;
	public String hometown;
	public String company;
	public String major;

	public UserProfile()	{
		super();
		this.table = "userprofiles";
		this.key = "id";
	}

	public Object fetchInfo() throws Exception {
		ArrayList<UserProfile> list = this.select("userId = ?userId");
		if (list.isEmpty())
			return null;
		return list.get(0);
	}

	@Override
	public void setUserId(long userId) {
		this.userId = userId;
	}

	@Override
	public String getTemplate(String template) {
		return "person";
	}

	@Override
	public void edit(String f) throws Exception {
		if (f.matches("[a-zA-Z0-9]*")) {
			ArrayList<UserProfile> list = this.select("userId = ?userId", null, null, null, 0, 1);
			if (list.isEmpty()) {
				this.insert(f+",userId");
			} else {
				this.update(f, "userId = ?userId");
			}
		} else {
			throw new Exception("Invalid field: "+f);
		}
	}
	
}
