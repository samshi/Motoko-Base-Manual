<?php
$module = $_GET['module'];
$func = $_GET['func'];
$file = '../example/'.$module.'_'.$func.'.txt';
if(file_exists($file)){
  echo file_get_contents($file);
}
else{
  echo '';
}

