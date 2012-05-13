package com.bkprofile.models;

import java.sql.Timestamp;
import java.util.ArrayList;

import org.ice.db.Table;

public class Answer extends Table {

	public long id;
	public long questionId;
	public long userId;
	public Timestamp since;
	
	public int vote;

	public Answer() {
		this.key = "id";
		this.table = "answers";
	}
	
	public ArrayList<Answer> listAnswers() throws Exception {
		return this.select(null);
	}
	
}
