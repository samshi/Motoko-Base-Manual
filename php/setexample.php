<?php
$module = $_POST['module'];
$func = $_POST['func'];
$name = urldecode($_POST['name']);
$example = urldecode($_POST['example']);
$file = '../example/'.$module.'_'.$func.'.txt';
$content = "\n---------- ".date('Y-m-d H:i:s').' '.$name." -----------";
$content .= "\n".$example;

echo file_put_contents($file, $content, FILE_APPEND);

//rawurldecode() does not decode plus symbols ('+') into spaces. urldecode() does.
//rawurlencode() - URL-encode according to RFC 3986
//urldecode() - Decodes URL-encoded string
