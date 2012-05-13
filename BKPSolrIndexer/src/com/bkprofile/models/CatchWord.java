package com.bkprofile.models;

import java.util.ArrayList;

import org.ice.db.Table;

public class CatchWord extends Table {

	public long id;
	public String catchWord;
	public String avatar;
	
	public CatchWord() {
		this.key = "id";
		this.table = "catchwords";
	}
	
	public ArrayList<CatchWord> listCatchWord() throws Exception {
		return this.select(null);
	}
	
}
