<?php
//motoko and modules chmod to 777
//define('ROOT', $_SERVER['DOCUMENT_ROOT']);
include('tools.php');

$name = urldecode(getIndex($_POST, 'name', 'samshi'));
$url = urldecode(getIndex($_POST, 'url', ''));

if(!$url){
  exit('');
}
// https://github.com/IC-Drive/ic-drive/blob/master/src/icdrive/backend/fileTypes.mo;
// https://github.com/ninegua/ic-logger/blob/main/src/Logger.mo

$content = getContent($url);

$filein1 = '../motoko/userfilein1.js';
if(file_exists($filein1)){
  $filein1_content = myJsonDecode(file_get_contents($filein1));
}
else{
  $filein1_content = [];
}

if($content){
  $filein1_content[$url] = "@$name\n".$content;

  file_put_contents($filein1, myJsonEncode($filein1_content));

  echo ' submit success';
}
else{
  echo ' submit failed, backend can not get the row content';
}


function getContent($url){
  $row_url = str_replace(['github.com', 'blob/'], ['raw.githubusercontent.com', ''], $url);
  echo ($row_url);
  return curlGet($row_url);
}