<?php
include('php/tools.php');

$folder = "./example";

//打开目录
$fp = opendir($folder);

//阅读目录
$modules = [];
while(false != $file = readdir($fp)){
  //列出所有文件并去掉'.'和'..'
  if($file != '.' && $file != '..'){
    $a = explode('_', substr($file, 0, -4));
    if(!isset($modules[$a[0]])){
      $modules[$a[0]] = [];
    }
    $modules[$a[0]][$a[1]] = getNumber($file);
  }
}

//关闭目录
closedir($fp);

function getNumber($file){
  global $folder;
  //return $folder.'/'.$file;
  $content = file_get_contents($folder.'/'.$file);
  return count(explode("\n-----", $content))-1;
}

//count
$cFile="log/count.txt";
if(file_exists($cFile)){
  $str=file_get_contents($cFile);
  $count=trim($str);
  $count++;
}else{
  $count=1;
}
file_put_contents($cFile, $count);

//log
$lFile="log/log.txt";
$str = getIndex($_SERVER, 'REQUEST_TIME').' '.getIndex($_SERVER, 'REMOTE_ADDR').' "'.getIndex($_SERVER, 'HTTP_USER_AGENT').'"'."\n";
file_put_contents($lFile, $str, FILE_APPEND);

//if(!isset($_COOKIE['acctime'])){
//$acctime=time();
//  setcookie("acctime", $acctime, time() + 3600 * 24);
//  $first = true;
//}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Motoko Base Manual</title>
  <meta name="keywords" content="motoko, base, dfinity, icp">
  <meta name="description" content="it's a supernova project and voted by many developers. The website includes 100+ sample code files now, and all common functions have examples. To learn motoko easier, just visit the website">
  <link type="text/css" rel="styleSheet" href="css/index.css" />
  <script>
    var count = <?php echo file_get_contents($cFile); ?>;
    var examples = JSON.parse('<?php echo myJsonEncode($modules); ?>');
    var modules = {}
    // var demos   = {}
  </script>
  <?php
  showJS('js/myjq.js');
  showJS('modules/Array.js');
  showJS('modules/AssocList.js');
  showJS('modules/Blob.js');
  showJS('modules/Bool.js');
  showJS('modules/Buffer.js');
  showJS('modules/CertifiedData.js');
  showJS('modules/Char.js');
  showJS('modules/Debug.js');
  showJS('modules/Deque.js');
  showJS('modules/Error.js');
  showJS('modules/ExperimentalCycles.js');
  showJS('modules/ExperimentalInternetComputer.js');
  showJS('modules/ExperimentalStableMemory.js');
  showJS('modules/Float.js');
  showJS('modules/Func.js');
  showJS('modules/Hash.js');
  showJS('modules/HashMap.js');
  showJS('modules/Heap.js');
  showJS('modules/Int.js');
  showJS('modules/Int16.js');
  showJS('modules/Int32.js');
  showJS('modules/Int64.js');
  showJS('modules/Int8.js');
  showJS('modules/Iter.js');
  showJS('modules/IterType.js');
  showJS('modules/List.js');
  showJS('modules/Nat.js');
  showJS('modules/Nat16.js');
  showJS('modules/Nat32.js');
  showJS('modules/Nat64.js');
  showJS('modules/Nat8.js');
  showJS('modules/None.js');
  showJS('modules/Option.js');
  showJS('modules/Order.js');
  showJS('modules/Prelude.js');
  showJS('modules/Principal.js');
  showJS('modules/RBTree.js');
  showJS('modules/Random.js');
  showJS('modules/Result.js');
  showJS('modules/Stack.js');
  showJS('modules/Text.js');
  showJS('modules/Time.js');
  showJS('modules/Trie.js');
  showJS('modules/TrieMap.js');
  showJS('modules/TrieSet.js');
  showJS('motoko/allin1.js');
  ?>

</head>
<body>
<h1 class="main">
  Motoko Base Manual <span style="font-size:14px;">updated on 20221023 by <a href="mailto:samshi@hdcafe.com">Sam SHI</a></span>
</h1>
<div id="import_page"></div>
</body>
</html>
<?php
showJS('js/index.js');
?>


