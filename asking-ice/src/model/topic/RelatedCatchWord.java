package model.topic;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import model.Base;

public class RelatedCatchWord extends Base {

	private static Map<Long, ArrayList<Long>> catchwords;
	
	public long id;
	public long catchWordId;
	public long relatedId;

	public RelatedCatchWord()	{
		super();
		this.table = "relatedcatchword";
		this.key = "id";
	}
	
	public Map<Long, ArrayList<Long>> fetchAllRelations() throws Exception {
		if (catchwords != null)
			return catchwords;
		ArrayList<RelatedCatchWord> cws = this.select(null);
		catchwords = new HashMap<Long, ArrayList<Long>>();
		for(RelatedCatchWord cw: cws) {
			if (!catchwords.containsKey(cw.catchWordId))
				catchwords.put(cw.catchWordId, new ArrayList<Long>());
			catchwords.get(cw.catchWordId).add(cw.relatedId);
			
			if (!catchwords.containsKey(cw.relatedId))
				catchwords.put(cw.relatedId, new ArrayList<Long>());
			catchwords.get(cw.relatedId).add(cw.catchWordId);
		}
		return catchwords;
	}
}
