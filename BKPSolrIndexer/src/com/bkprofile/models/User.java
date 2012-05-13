package com.bkprofile.models;

import java.util.ArrayList;

import org.ice.db.Table;

public class User extends Table {

	public long id;
	public String name;
	public String avatar;

	public User() {
		this.key = "id";
		this.table = "users";
	}
	
	public ArrayList<User> listUsers() throws Exception {
		return this.select(null);
	}
	
}
