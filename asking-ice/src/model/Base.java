package model;

import inc.message.Subject;

import java.util.ArrayList;

import org.ice.db.Table;

public class Base extends Table {

	public long totalRows;
	public long customCount;
	
	protected void setupAdapter() {
		super.setupAdapter();
	}
	
	public long countTotal() throws Exception {
		ArrayList<? extends Base> list = this.select(null, "COUNT("+key+") AS totalRows", null, null);
		return list.get(0).totalRows;
	}
	
	public long countByCustom(String where) throws Exception {
		ArrayList<? extends Base> list = this.select(where, "COUNT("+key+") AS customCount", null, null);
		return list.get(0).customCount;
	}
	
	public boolean isExist(String field) throws Exception {
		ArrayList<? extends Base> list = this.select(field+" = ?"+field, key, null, null, 0, 1);
		return !list.isEmpty();
	}
	
	public String where(String field)	{
		return this.table+"."+field+" = ?"+this.table+"."+field;
	}
	
	public String where()	{
		return this.table+"."+key;
	}
	
	public boolean insert(String fields) throws Exception	{
		Subject subject = Subject.getInstance();
		subject.notifyMessage("db.preinsert", this);
		boolean result = super.insert(fields);
		subject.notifyMessage("db.postinsert", this);
		return result;
	}
	
	public ArrayList<? extends Base> fetchAll() throws Exception {
		return this.select(null, null, this.key+" DESC", null);
	}
}
