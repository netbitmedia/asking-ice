package com.bkprofile.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Vector;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

public class ConfigLoader {
	private static ConfigLoader instance = null;
	private static FileInputStream fis = null;
	private String databaseName;
	private String username;
	private String password;
	private String host;
	private String port;
	private String hostSolr;
	private String portSolr;
	private String coreSolr;
	private String maxDocCommit;
	private String query;
	private String step;
	private Vector<String> fields;

	private ConfigLoader() {
		try {
			File f = new File("./config.xml");
			System.out.println("FILE PATH:+++++" + f.getCanonicalPath());
			fis = new FileInputStream("./config.xml");
			DocumentBuilderFactory factory = DocumentBuilderFactory
					.newInstance();
			DocumentBuilder builder = factory.newDocumentBuilder();
			Document doc = builder.parse(fis);

			NodeList nl = doc.getElementsByTagName("username");
			Element el = (Element) nl.item(0);
			this.username = el.getTextContent().trim();

			nl = doc.getElementsByTagName("password");
			el = (Element) nl.item(0);
			this.password = el.getTextContent().trim();

			nl = doc.getElementsByTagName("database");
			el = (Element) nl.item(0);
			this.databaseName = el.getTextContent().trim();

			nl = doc.getElementsByTagName("host");
			el = (Element) nl.item(0);
			this.host = el.getTextContent();

			nl = doc.getElementsByTagName("port");
			el = (Element) nl.item(0);
			this.port = el.getTextContent().trim();

			nl = doc.getElementsByTagName("hostSolr");
			el = (Element) nl.item(0);
			this.hostSolr = el.getTextContent().trim();

			nl = doc.getElementsByTagName("portSolr");
			el = (Element) nl.item(0);
			this.portSolr = el.getTextContent().trim();

			nl = doc.getElementsByTagName("coreSolr");
			el = (Element) nl.item(0);
			this.coreSolr = el.getTextContent().trim();

			nl = doc.getElementsByTagName("maxDocCommit");
			el = (Element) nl.item(0);
			this.maxDocCommit = el.getTextContent().trim();

			nl = doc.getElementsByTagName("query");
			el = (Element) nl.item(0);
			this.query = el.getTextContent().trim();

			nl = doc.getElementsByTagName("step");
			el = (Element) nl.item(0);
			this.step = el.getTextContent().trim();

			nl = doc.getElementsByTagName("indexField");
			el = (Element) nl.item(0);
			nl = el.getChildNodes();
			this.fields = new Vector<String>();
			Element tmp = null;
			for (int i = 0; i < nl.getLength(); i++)
				try {
					tmp = (Element) nl.item(i);
					if (tmp.getNodeName().equals("field"))
						this.fields.add(tmp.getTextContent().trim());
				} catch (ClassCastException localClassCastException) {
				}
		} catch (FileNotFoundException ex) {
			Logger.getLogger(ConfigLoader.class.getName()).log(Level.SEVERE,
					null, ex);
		} catch (Exception ex) {
			Logger.getLogger(ConfigLoader.class.getName()).log(Level.SEVERE,
					null, ex);
		}
	}

	public String getQuery() {
		return this.query;
	}

	public String getCoreSolr() {
		return this.coreSolr;
	}

	public String getHostSolr() {
		return this.hostSolr;
	}

	public int getMaxDocCommit() {
		try {
			return Integer.parseInt(this.maxDocCommit);
		} catch (Exception e) {
			System.out
					.println("MaxDocCommit Config Failed: Default 1000 is used");
		}
		return 1000;
	}

	public String getPortSolr() {
		return this.portSolr;
	}

	public int getStep() {
		try {
			return Integer.parseInt(this.step);
		} catch (Exception e) {
			System.out.println("STEP Config Failed: Default 20000 is used");
		}
		return 20000;
	}

	public static ConfigLoader getInstance() {
		if (instance == null) {
			instance = new ConfigLoader();
		}
		return instance;
	}

	public String getDatabaseName() {
		return this.databaseName;
	}

	public String getUsername() {
		return this.username;
	}

	public String getPassword() {
		return this.password;
	}

	public String getPort() {
		return this.port;
	}

	public String getHost() {
		return this.host;
	}

	public Vector<String> getIndexedFields() {
		return this.fields;
	}

	public boolean isFieldIndexed(String fieldName) {
		if (this.fields == null) {
			return true;
		}

		if ((this.fields.size() == 1)
				&& (((String) this.fields.get(0)).equalsIgnoreCase("*"))) {
			return true;
		}

		return this.fields.contains(fieldName);
	}

	public String getURL() {
		return "jdbc:mysql://"
				+ getHost()
				+ ":"
				+ getPort()
				+ "/"
				+ getDatabaseName()
				+ "?characterSetResults=UTF-8&characterEncoding=UTF-8&useUnicode=yes";
	}

	public String getSolrURL() {
		return "http://" + getHostSolr() + ":" + getPortSolr() + "/solr/"
				+ getCoreSolr();
	}

	public void setCore(String core) {
		this.coreSolr = core;
	}

	public void setUser(String user) {
		this.username = user;
	}

	public void setPassword(String pass) {
		this.password = pass;
	}
}