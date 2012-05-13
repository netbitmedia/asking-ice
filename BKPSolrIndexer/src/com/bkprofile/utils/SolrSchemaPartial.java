package com.bkprofile.utils;

public class SolrSchemaPartial {
	private String name = null;
	private String type = null;
	private boolean stored = false;
	private boolean indexed = false;
	private boolean multiValued = false;

	public SolrSchemaPartial(String name, String type, boolean stored,
			boolean indexed, boolean multiValued) {
		this.name = name;
		this.type = type;
		this.stored = stored;
		this.indexed = indexed;
		this.multiValued = multiValued;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public boolean isStored() {
		return this.stored;
	}

	public void setStored(boolean stored) {
		this.stored = stored;
	}

	public boolean isIndexed() {
		return this.indexed;
	}

	public void setIndexed(boolean indexed) {
		this.indexed = indexed;
	}

	public boolean isMultiValued() {
		return this.multiValued;
	}

	public void setMultiValued(boolean multiValued) {
		this.multiValued = multiValued;
	}
}