package com.bkprofile.dataaccesslayer;

import com.bkprofile.utils.ConfigLoader;

import java.sql.Connection;

import java.sql.DriverManager;

import java.util.logging.Level;

import java.util.logging.Logger;

public class AbstractConnectBase {
	protected static Connection normalConn;
	private static String url;
	private static ConfigLoader loader;

	public AbstractConnectBase() throws Exception {
		try {
			if (normalConn != null) {
				normalConn.close();
			}
			loader = ConfigLoader.getInstance();
			url = loader.getURL();
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println(url);
			normalConn = DriverManager.getConnection(url, loader.getUsername(),
					loader.getPassword());
		} catch (Exception ex) {
			Logger.getLogger(AbstractConnectBase.class.getName()).log(
					Level.SEVERE, null, ex);
			throw ex;
		}
	}

}
