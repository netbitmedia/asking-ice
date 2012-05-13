package com.bkprofile.dataaccesslayer;

public class QuestionCatchTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new QuestionCatchTbl();
		}
		return instance;
	}

	private QuestionCatchTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT * FROM `questions` as q, `questioncatch` as qc, `catchwords` as k WHERE qc.catchWordId = k.id AND qc.questionId = q.id";
	}
}
