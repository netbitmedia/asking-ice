package com.bkprofile.models;

import java.sql.Timestamp;
import java.util.ArrayList;

import org.ice.db.Table;

public class Question extends Table {

	public long id;
	public long userId;
	public Timestamp since;
	
	public String title;
	public String bestSource;
	
	public int vote;
	public int anonymous;

	public Question() {
		this.key = "id";
		this.table = "questions";
	}
	
	public ArrayList<Question> listQuestions() throws Exception {
		return this.select(null);
	}
	
}
