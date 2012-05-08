package model.user;

import java.util.ArrayList;

import org.ice.db.Table;

public class ExpertRank extends Table {
	
	public long id;
	public long expertiseId;
	public String catchWord;
	public long userId;
	public String name;
	public String avatar;
	public long rank;
	public double expertRank;
	public double normalizedExpertRank;
	
	public long point;
	
	public ExpertRank() {
		this.table = "expertrank";
		this.key = "id";
	}
	
	public double getExpertRankPoint(String tagsList) throws Exception {
		ArrayList<ExpertRank> list = this.select("userId = ?userId AND expertiseId IN ("+tagsList+")", "MAX(normalizedExpertRank)*50 AS point", null, null, 0, 1);
		if (list.isEmpty())
			return 0;
		return list.get(0).point;
	}

	public Object fetchTopRank() throws Exception {
		return this.select("rank = 1", "name, userId, catchWord, expertiseId, avatar", null, null, 0, 12);
	}
}
