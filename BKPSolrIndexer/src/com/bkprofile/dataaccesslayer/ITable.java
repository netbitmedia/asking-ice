package com.bkprofile.dataaccesslayer;

import java.sql.ResultSet;
import java.util.ArrayList;

public abstract interface ITable {
	public abstract ResultSet getDataSet();

	public abstract String getSQL();

	public abstract ArrayList<Object> getParams();

	public abstract void addParam(Object paramObject);

	public abstract boolean run();

	public abstract void dispose();

	public abstract void clearParams();
}
