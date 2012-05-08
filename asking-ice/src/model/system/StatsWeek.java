package model.system;

import java.util.ArrayList;

import org.ice.db.Table;

public class StatsWeek extends Table {

	public long id;
	public long catchWordId;
	public int answers;
	public int questions;
	public int vote;
	public double delay;
	public int week;
	
	public StatsWeek()	{
		this.table = "stats_week";
		this.key = "id";
	}
	
	public ArrayList<StatsWeek> fetchWeeklyData(int from, int to) throws Exception	{
		return this.select("catchWordId = ?catchWordId AND week BETWEEN "+from+" AND "+to);
	}
}