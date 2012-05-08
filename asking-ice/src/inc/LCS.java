package inc;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.Locale;

import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.sax.SAXTransformerFactory;
import javax.xml.transform.sax.TransformerHandler;
import javax.xml.transform.stream.StreamResult;

import org.outerj.daisy.diff.helper.NekoHtmlParser;
import org.outerj.daisy.diff.html.HTMLDiffer;
import org.outerj.daisy.diff.html.HtmlSaxDiffOutput;
import org.outerj.daisy.diff.html.TextNodeComparator;
import org.outerj.daisy.diff.html.dom.DomTreeBuilder;
import org.xml.sax.ContentHandler;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public class LCS {

	public static String diff(String oldHtml, String newHtml) throws TransformerConfigurationException, IOException, SAXException {
		StringWriter sw = new StringWriter();
		SAXTransformerFactory tf = (SAXTransformerFactory) TransformerFactory.newInstance();
        TransformerHandler result = tf.newTransformerHandler();
        result.setResult(new StreamResult(new BufferedWriter(sw)));
		
		ContentHandler postProcess = result;

        Locale locale = Locale.getDefault();
        String prefix = "diff";

        InputSource oldSource = new InputSource(new StringReader(oldHtml));
        InputSource newSource = new InputSource(new StringReader(newHtml));
        
        NekoHtmlParser parser = new NekoHtmlParser();

        DomTreeBuilder oldHandler = new DomTreeBuilder();
        parser.parse(oldSource, oldHandler);
        TextNodeComparator leftComparator = new TextNodeComparator(
                oldHandler, locale);

        DomTreeBuilder newHandler = new DomTreeBuilder();
        parser.parse(newSource, newHandler);
        TextNodeComparator rightComparator = new TextNodeComparator(
                newHandler, locale);

        postProcess.startDocument();
        HtmlSaxDiffOutput output = new HtmlSaxDiffOutput(postProcess,
                prefix);
        
        HTMLDiffer differ = new HTMLDiffer(output);
        differ.diff(leftComparator, rightComparator);
        postProcess.endDocument();
        return sw.toString();
	}
}
