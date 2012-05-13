package com.bkprofile.dataaccesslayer;

public class ExpertRankMaxTopicTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new ExpertRankMaxTopicTbl();
		}
		return instance;
	}

	private ExpertRankMaxTopicTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT expertiseID, MAX(expertRank) as max FROM `expertRank` GROUP BY expertiseID";
	}
}
