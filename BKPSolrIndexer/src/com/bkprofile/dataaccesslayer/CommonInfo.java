package com.bkprofile.dataaccesslayer;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

public class CommonInfo extends AbstractConnectBase {
	/* 19 */private static CommonInfo instance = null;

	private CommonInfo() throws Exception {
	}

	public static CommonInfo getInstance() {
		if (instance == null) {
			try {
				instance = new CommonInfo();
			} catch (Exception ex) {
				Logger.getLogger(CommonInfo.class.getName()).log(Level.SEVERE,
						null, ex);
			}
		}
		return instance;
	}

	public int getMaxProfileID() throws SQLException {
		String sql = "SELECT Max(profile_id) as maxProfileID FROM objects";
		Statement stmt = normalConn.createStatement();
		ResultSet rs = stmt.executeQuery(sql);
		try {
			rs.next();
			System.out.println("ProfileID:" + rs.getString("maxProfileID"));
			return Integer.parseInt(rs.getString("maxProfileID"));
		} catch (Exception e) {
			System.out.println("Cannot get maxProfileID. Default to 20000");
		}
		return 20000;
	}
}
