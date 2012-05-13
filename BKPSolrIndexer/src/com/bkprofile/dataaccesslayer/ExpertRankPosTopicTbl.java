package com.bkprofile.dataaccesslayer;

public class ExpertRankPosTopicTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new ExpertRankPosTopicTbl();
		}
		return instance;
	}

	private ExpertRankPosTopicTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT COUNT(*) + 1 AS rank FROM `expertRank` WHERE expertiseID = ? AND expertRank > ?";
	}
}
