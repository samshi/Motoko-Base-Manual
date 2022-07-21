<?php
$module = $_POST['module'];
$func = $_POST['func'];
$name = $_POST['name'];
$sample = $_POST['sample'];
$file = 'samples/'.$module.'_'.$func.'.txt';
$content = "\n---------- ".date('Y-m-d H:i:s').' '.$name." -----------";
$content .= "\n".urldecode($sample);

echo file_put_contents($file, $content, FILE_APPEND);
