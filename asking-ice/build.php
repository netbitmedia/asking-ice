<?php

	$host = "http://asking.vn";
	
	function writeFile($filename, $content)	{
		$fh = fopen($filename, "w");
		fwrite($fh, $content);
		fclose($fh);
	}
	$version = $_GET['version'];
	require_once('simple_html_dom.php');
	echo "building all.$version.js...<br> for $host";
	$html = file_get_html("WebContent/resource/index.$version.copy.html");
	$content = "";
	$srcArray = array();
	foreach($html->find('script') as $element) 	{
		$src = $element->src;
		$src = str_replace("{resourceUrl}", "WebContent/resource", $src);
		$build = $element->build;
		if ($src != null && $src != "" && $build != 'no')	{
			echo $src."<br>";
			$content .= file_get_contents($src)."\n";
			$srcArray[] = $src;
		}
	}
	writeFile("WebContent/resource/js/all.$version.js", $content);
	
	echo "<br>building all.$version.css...<br>";
	$content = "";
	foreach($html->find('link') as $element) 	{
		$src = $element->href;
		$src = str_replace("{resourceUrl}", "WebContent/resource", $src);
		echo $src."<br>";
		$content .= file_get_contents($src)."\n";
	}
	writeFile("WebContent/resource/css/all.$version.css", $content);
	
	echo "<br>building all.$version.txt...<br>";
	$content = "";
	$htmArray = array();
	$htmArray[] = "WebContent/resource/microtemplating/$version/template.htm";
	$htmArray[] = "WebContent/resource/microtemplating/$version/layout.htm";
	$htmArray[] = "WebContent/resource/microtemplating/$version/plugin.htm";
	
	foreach($srcArray as $src) 	{
		if (strpos($src, "resource/js/app/portlets/") !== false) {
			$src = str_replace("resource/js/app/portlets/", "resource/microtemplating/$version/", $src);
			$src = str_replace(".js", ".htm", $src);
			$htmArray[] = $src;
		}
	}
	foreach($htmArray as $src) 	{
		if (file_exists($src) && is_readable($src))	{
			echo $src."<br />";
			$content .= file_get_contents($src)."\n";
		} else {
			echo "<font color='red'>WARNING: Filename not exist: ".$src."</font><br />";
		}
	}

	$content = str_replace("#!", $host."#!", $content);	
	
	writeFile("WebContent/resource/microtemplating/all.$version.txt", $content);
?>