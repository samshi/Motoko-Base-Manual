<?php
if(!isset($nohead)){
  header("Content-Type: text/html; charset=UTF-8");
}
ini_set('date.timezone', 'Asia/Shanghai');
set_time_limit(0);
error_reporting(E_ALL ^ E_NOTICE);
//error_reporting(E_ALL);
//ini_set('display_errors', TRUE);
//ini_set('display_startup_errors', TRUE);

define('BR', '<br>');

function noCache(){
  return;
  // 设置此页面的过期时间(用格林威治时间表示)，只要是已经过去的日期即可。
  header(" Expires: Mon, 26 Jul 1970 05:00:00 GMT ");
  // 设置此页面的最后更新日期(用格林威治时间表示)为当天，可以强制浏览器获取最新资料
  header(" Last-Modified:" . gmdate(" D, d M Y H:i:s ") . "GMT ");

  // 告诉客户端浏览器不使用缓存，HTTP 1.1 协议
  header(" Cache-Control: no-cache, must-revalidate ");

  // 告诉客户端浏览器不使用缓存，兼容HTTP 1.0 协议
  header(" Pragma: no-cache ");
}

function getDefinitions($voc){
  $result = curlGet('http://api.wordnik.com/v4/word.json/' . $voc . '/definitions?limit=200&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5');
  $obj    = json_decode($result);
  if($obj[0]->text){
    return $obj[0]->text;
  }
  return '';
}

function myfilemtime($filename){
  if(//
    substr($filename, 0, 2) == '//' ||     //
    substr($filename, 0, 7) == 'http://' || //
    substr($filename, 0, 8) == 'https://'   //`
  ){
    return $filename;
  }

  else if($filename[0] == '/'){
    $local_filename = ROOT . $filename;
  }
  else{
    /*
      hdcafe.com
        SCRIPT_NAME
        REQUEST_URI
        PHP_SELF

      X DOCUMENT_URI

      localhost
        SCRIPT_NAME
        REQUEST_URI
        PHP_SELF
    */
    $relative_path  = substr($_SERVER['SCRIPT_NAME'], 0, strrpos($_SERVER['SCRIPT_NAME'], '/') + 1);
    $local_filename = ROOT . $relative_path . $filename;
  }

  $t = filemtime($local_filename) % 10000;
  //$t = date('His');
  if(strpos($filename, '?')){
    return $filename . '&v=' . $t;
  }
  else{
    return $filename . '?v=' . $t;
  }
}

function showJS($js){
  //echo file_get_contents('xxx.js') . PHP_EOL;
  $a = myfilemtime($js);
  echo PHP_EOL . "<script src='$a'></script>" . PHP_EOL;
}

function showCSS($css){
  $a = myfilemtime($css);
  echo PHP_EOL . "<link rel='stylesheet' type='text/css' href='$a'/>" . PHP_EOL;
}

function php2js($js, $obj){
  // 用法 php2js('server_list', $servers);
  echo "\nvar $js = JSON.parse('" . myJsonEncode($obj) . "');\n";
}

function tree($dir){
  $mydir = dir($dir);
  $tree  = [];
  while($file = $mydir->read()){
    if($file != '.' && $file != '..' && substr($file, 0, 1) != '.'){
      if(is_dir("$dir/$file")){
        $tree[$file] = tree("$dir/$file");
      }
      else{
        $tree[] = str_replace('.txt', '', $file);
      }
    }
  }
  $mydir->close();
  if(isset($tree[0])){
    sort($tree);
  }

  return $tree;
}

//调用 curl 接口
function curlGetPost($url, $get = 0, $post = 0){
  $url = substr($url, 0, 4) == 'http' ? $url : APIURL . $url;
  if($get){
    $url .= '?' . http_build_query($get);
  }

  saveDebugInFile('', 'response');
  saveDebugInFile($url, 'response');
  if($post){
    return curlPost($url, myJsonEncode($post));
  }
  else{
    return curlGet($url);
  }
}

function curlGet($url, $data = null){
  $ch = curl_init();
  if($data){
    $url .= '?' . http_build_query($data);
  }

  //curl_setopt($ch, CURLOPT_URL, $url);
  //curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  //curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);// https请求不验证证书和hosts
  //curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
  //curl_setopt($ch, CURLOPT_CAINFO, 'chain.crt');
  //curl_setopt($ch, CURLOPT_HEADER, 0);

  curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
  curl_setopt($ch, CURLOPT_TIMEOUT, 30);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array());
  curl_setopt($ch, CURLINFO_HEADER_OUT, true);

  $result = curl_exec($ch);
  //saveDebugInFile($result, 'response');
  //showarr('$result');
  //showarr($result);

  curl_close($ch);

  return $result;
}

function curlPost($url, $data, $port = ''){
  $ch = curl_init();
  //echoBr($url);
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  if($port != ''){
    curl_setopt($ch, CURLOPT_PORT, $port);
  }
  //curl_setopt ( $ch, CURLOPT_POSTFIELDS, $data);
  //showarr($data);
  //saveDebugInFile(is_string($data) ? $data : myJsonEncode($data), 'response');
  curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($data) ? $data : http_build_query($data));
  //curl_setopt ( $ch, CURLOPT_POSTFIELDS, myJsonEncode($data));
  $result = curl_exec($ch);
  //saveDebugInFile($result, 'response');

  curl_close($ch);

  //showarr($result);
  return $result;
}

//JSON
function myJsonEncode($obj){
  return is_object($obj) || is_array($obj) ? json_encode($obj, JSON_UNESCAPED_SLASHES + JSON_UNESCAPED_UNICODE) : $obj;
}

function myJsonDecode($str){
  return json_decode($str, true);
}

//get/post
function getIndex($arr, $key, $default = ''){    //避免出错
  return isset($arr[$key]) ? $arr[$key] : $default;
}

//debug
function showarr($obj){
  echo '<pre>';
  print_r($obj);
  echo '</pre>';
}

//mySql
function sqlExec($db){
  if(!$db){
    exit('sqlExec: $db is needed');
  }

  if(0 && $_SERVER['SERVER_NAME'] == 'localhost'){
    $conn = mysqli_connect("localhost", "root", "ace");
  }
  else{
    $mysqli = @new mysqli("127.0.0.1", "root", "Woyouwaimai76", $db);
  }

  if($mysqli->connect_errno){
    exit("sqlExec: $db Connect false");
  }
  //if(!mysqli_connect_errno()){
  //$db is not exist
  //query("CREATE DATABASE IF NOT EXISTS `{$db}` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci");
  //mysqli_select_db($db, $conn);
  //}

  $mysqli->set_charset("utf8");
  //$mysqli->query("set names utf8");
  return $mysqli;
}

function query($sql){
  //filelog(" $f $sql" . PHP_EOL);
  global $mysqli;
  return $mysqli->query($sql);
}

//path
function checkPath($file){
  if(file_exists($file)){
    return 'exist';
  }
  $arr      = explode('/', $file);
  $arr_root = explode('/', ROOT);
  $dir      = '/';
  for($i = 1, $l = count($arr); $i < $l - 1; $i++){
    $dir .= $arr[$i] . '/';

    if(implode('/', array_slice($arr, 0, $i)) == implode('/', array_slice($arr_root, 0, $i))){
      continue;
    }

    if(!is_dir($dir)){
      if(!mkdir($dir, 0777, true)){
        exit("mkdir error $dir");
      }
      return 'mkdir ' . $dir;
    }
  }

  return true;
}

//weixin
function isWeixin(){
  return strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger') !== false;
}

function redirect($url){
  header("Location: {$url}");
}

function myFile($f){
  if(file_exists($f)){
    return file($f);
  }
  else{
    return array();
  }
}


