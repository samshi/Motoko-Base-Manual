<?php
$module = $_POST['module'];
$func = $_POST['func'];
$name = $_POST['name'];
$example = $_POST['example'];
$file = 'example/'.$module.'_'.$func.'.txt';
$content = "\n---------- ".date('Y-m-d H:i:s').' '.$name." -----------";
$content .= "\n".urldecode($example);

echo file_put_contents($file, $content, FILE_APPEND);
