package com.bkprofile.entities;

import java.util.ArrayList;

public class Doc {
	private ArrayList<DocPartial> params = new ArrayList<DocPartial>();
	private String id = null;

	public Doc(String id) {
		this.id = id;
	}

	public Doc(ArrayList<DocPartial> params, String id) {
		this.params = params;
		this.id = id;
	}

	public void add(DocPartial d) {
		this.params.add(d);
	}

	public void setParams(ArrayList<DocPartial> params) {
		this.params = params;
	}

	public ArrayList<DocPartial> getParams() {
		return this.params;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getId() {
		return this.id;
	}
}
