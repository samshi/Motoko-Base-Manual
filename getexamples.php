<?php
$module = $_GET['module'];
$func = $_GET['func'];
$file = 'example/'.$module.'_'.$func.'.txt';
echo file_get_contents($file);
