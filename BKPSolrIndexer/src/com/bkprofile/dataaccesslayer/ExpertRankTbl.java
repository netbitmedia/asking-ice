package com.bkprofile.dataaccesslayer;

public class ExpertRankTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new ExpertRankTbl();
		}
		return instance;
	}

	private ExpertRankTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT * FROM `expertrank` INNER JOIN catchwords ON catchwords.id = expertrank.expertiseId WHERE userId =?";
	}
}
