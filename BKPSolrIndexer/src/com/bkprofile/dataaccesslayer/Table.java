package com.bkprofile.dataaccesslayer;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

public abstract class Table extends AbstractConnectBase implements ITable {
	ArrayList<Object> params = new ArrayList<Object>();

	private ResultSet rs = null;

	private PreparedStatement pstmt = null;

	protected Table() throws Exception {
	}

	public boolean run() {
		boolean ok = false;
		try {
			this.pstmt = normalConn.prepareStatement(getSQL());
			//System.out.println(getSQL());
			for (int i = 0; i < getParams().size(); i++) {
				Object val = getParams().get(i);
				if ((val instanceof String))
					this.pstmt.setString(i + 1, (String) val);
				else if ((val instanceof Integer))
					this.pstmt.setInt(i + 1, ((Integer) val).intValue());
				else if ((val instanceof Long)) {
					this.pstmt.setLong(i + 1, ((Long) val).longValue());
				} else if ((val instanceof Double)) {
					this.pstmt.setDouble(i + 1, ((Double) val).doubleValue());
				}
			}
			this.rs = this.pstmt.executeQuery();
			ok = this.rs.next();
			this.rs.beforeFirst();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ok;
	}

	public abstract String getSQL();

	public ArrayList<Object> getParams() {
		return this.params;
	}

	public void addParam(Object e) {
		this.params.add(e);
	}

	public void clearParams() {
		this.params.clear();
	}

	public ResultSet getDataSet() {
		return this.rs;
	}

	public void dispose() {
		try {
			System.out.println("Dispose");
			if (this.rs != null)
				this.rs.close();
			this.rs = null;
			if (this.pstmt != null)
				this.pstmt.close();
			this.pstmt = null;
		} catch (SQLException ex) {
			Logger.getLogger(QuestionTbl.class.getName()).log(Level.SEVERE,
					null, ex);
		}
	}
}
