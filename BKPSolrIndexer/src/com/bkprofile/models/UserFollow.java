package com.bkprofile.models;

import java.util.ArrayList;

import org.ice.db.Table;

public class UserFollow extends Table {

	public long id;
	public long sourceId;
	public long targetId;
	
	public UserFollow() {
		this.key = "id";
		this.table = "userfollow";
	}
	
	public ArrayList<UserFollow> listUserFollow() throws Exception {
		return this.select(null);
	}
	
}
