package com.bkprofile.utils;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Hashtable;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class SolrSchema {
	private static SolrSchema instance = null;

	private Hashtable<String, SolrSchemaPartial> data = new Hashtable<String, SolrSchemaPartial>();

	public static SolrSchema getInstance() throws IOException,
			ParserConfigurationException, SAXException {
		if (instance == null) {
			instance = new SolrSchema();
		}
		return instance;
	}

	private SolrSchema() throws IOException, ParserConfigurationException,
			SAXException {
		URL schemaURL = new URL(
				"http://localhost:8983/solr/person/admin/file/?file=schema.xml");
		InputStream in = schemaURL.openStream();
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();
		Document doc = builder.parse(in);

		NodeList nl = doc.getElementsByTagName("fields");
		Element el = (Element) nl.item(0);
		nl = el.getElementsByTagName("field");
		for (int i = 0; i < nl.getLength(); i++) {
			el = (Element) nl.item(i);
			String name = el.getAttribute("name").trim();
			String type = el.getAttribute("type").trim();
			String stored = el.getAttribute("stored").trim();
			String indexed = el.getAttribute("indexed").trim();
			String multivalued = el.getAttribute("multiValued").trim();
			SolrSchemaPartial x = new SolrSchemaPartial(name, type,
					stored.equalsIgnoreCase("true"),
					indexed.equalsIgnoreCase("true"),
					multivalued.equalsIgnoreCase("true"));
			this.data.put(name, x);
		}
	}

	public SolrSchemaPartial getField(String field) {
		return (SolrSchemaPartial) this.data.get(field);
	}
}