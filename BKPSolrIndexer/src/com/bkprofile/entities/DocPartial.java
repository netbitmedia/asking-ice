package com.bkprofile.entities;

public class DocPartial {
	private static final int DEFAULT_BOOST = -1;
	private String field;
	private float boost = DEFAULT_BOOST;
	private String value;
	private int isIndexed = 0;

	public int getIsIndexed() {
		return this.isIndexed;
	}

	public void setIsIndexed(int isIndexed) {
		this.isIndexed = isIndexed;
	}

	public DocPartial(String field, float boost, String value, int isIndexed) {
		this.field = field;
		this.boost = boost;
		this.value = value;
		this.isIndexed = isIndexed;
	}

	public DocPartial(String field, String value, int isIndexed) {
		this.field = field;
		this.value = value;
		this.isIndexed = isIndexed;
	}

	public DocPartial(String field, String value) {
		this.field = field;
		this.value = value;
	}

	public String getField() {
		return this.field;
	}

	public String getValue() {
		return this.value;
	}

	public void setField(String field) {
		this.field = field;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public void setBoost(float boost) {
		this.boost = boost;
	}

	public float getBoost() {
		return this.boost;
	}

	public boolean isBoostSpecific() {
		return this.boost > DEFAULT_BOOST;
	}
}
