package com.bkprofile.dataaccesslayer;

public class AnswerTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new AnswerTbl();
		}
		return instance;
	}

	private AnswerTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT * FROM `answers` as a, `users` as u WHERE (a.userId = u.id) AND (questionId = ?)";
	}
}
