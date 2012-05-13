package com.bkprofile.models;

import java.util.ArrayList;

import org.ice.db.Table;

public class QuestionCatch extends Table {

	public long id;
	public long questionId;
	public long catchWordId;
	
	public QuestionCatch() {
		this.key = "id";
		this.table = "questioncatch";
	}
	
	public ArrayList<QuestionCatch> listQuestionCatch() throws Exception {
		return this.select(null);
	}
	
}
