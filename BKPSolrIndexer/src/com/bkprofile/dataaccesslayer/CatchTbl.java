package com.bkprofile.dataaccesslayer;

public class CatchTbl extends Table implements ITable {
	public static ITable instance;

	public static ITable getInstance() throws Exception {
		if (instance == null) {
			instance = new CatchTbl();
		}
		return instance;
	}

	private CatchTbl() throws Exception {
	}

	public String getSQL() {
		return "select catchWord,catchwordId,count(uid) as follow from ((select catchWord,catchWordId as catchwordId,userID as uid from userinterest, catchwords WHERE userinterest.catchwordId = catchwords.id) UNION DISTINCT (select catchWord,catchwordId, userId as uid  from usercatch, catchwords WHERE usercatch.catchwordId = catchwords.id)) as tnl group by catchwordId";
	}
}
