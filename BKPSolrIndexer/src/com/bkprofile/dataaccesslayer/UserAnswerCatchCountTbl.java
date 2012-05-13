package com.bkprofile.dataaccesslayer;

public class UserAnswerCatchCountTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new UserAnswerCatchCountTbl();
		}
		return instance;
	}

	private UserAnswerCatchCountTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT aqc.catchwordId, count(*) AS numbers FROM `answers` AS a INNER JOIN questions AS aq ON a.questionId = aq.id INNER JOIN questioncatch AS aqc ON aqc.questionId = a.questionId WHERE a.userId = ? GROUP BY aqc.catchwordId";
	}
}
