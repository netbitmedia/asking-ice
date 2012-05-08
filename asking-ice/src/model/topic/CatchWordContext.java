package model.topic;

import java.util.ArrayList;

import model.Base;

public class CatchWordContext extends Base {

	public long id;
	public String context;
	public String description;
	
	private static ArrayList<CatchWordContext> list;

	public CatchWordContext()	{
		super();
		this.table = "catchwordcontext";
		this.key = "id";
	}

	public ArrayList<CatchWordContext> browseContexts() throws Exception {
		if (list != null)
			return list;
		return (list = this.select(""));
	}
}
