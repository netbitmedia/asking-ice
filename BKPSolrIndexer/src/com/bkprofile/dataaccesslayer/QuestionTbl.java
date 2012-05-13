package com.bkprofile.dataaccesslayer;

public class QuestionTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new QuestionTbl();
		}
		return instance;
	}

	private QuestionTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT * FROM `questions` as q, `users` as u WHERE (q.userId = u.id) AND (q.id >= ?) AND (q.id < ?) order by since desc";
	}
}