package com.bkprofile.dataaccesslayer;

public class PersonSameInterestExpertiseTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new PersonSameInterestExpertiseTbl();
		}
		return instance;
	}

	private PersonSameInterestExpertiseTbl() throws Exception {
	}

	public String getSQL() {
		return "SELECT a.userId AS source, b.userId AS destination FROM `usercatch` as a INNER JOIN usercatch as b on a.catchwordId = b.catchwordId AND a.userId <> b.userId order by a.userId ASC";
	}
}
