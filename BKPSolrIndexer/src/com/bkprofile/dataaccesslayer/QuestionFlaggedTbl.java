package com.bkprofile.dataaccesslayer;

public class QuestionFlaggedTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new QuestionFlaggedTbl();
		}
		return instance;
	}

	private QuestionFlaggedTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT questionId, type, COUNT(type) as number, SUM(point) as point FROM `questionflagged` GROUP BY type, questionId HAVING questionId = ?";
	}
}
