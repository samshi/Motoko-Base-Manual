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

//showarr($modules);
//exit();

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <link type="text/css" rel="styleSheet"  href="css/index.css" />
  <script>
    var examples = JSON.parse('<?php echo myJsonEncode($modules); ?>')
    var modules = {}
    // var demos   = {}
  </script>
  <script src="js/myjq.js"></script>
  <script src="modules/Array.js"></script>
  <script src="modules/AssocList.js"></script>
  <script src="modules/Blob.js"></script>
  <script src="modules/Bool.js"></script>
  <script src="modules/Buffer.js"></script>
  <script src="modules/CertifiedData.js"></script>
  <script src="modules/Char.js"></script>
  <script src="modules/Debug.js"></script>
  <script src="modules/Deque.js"></script>
  <script src="modules/Error.js"></script>
  <script src="modules/ExperimentalCycles.js"></script>
  <script src="modules/ExperimentalInternetComputer.js"></script>
  <script src="modules/ExperimentalStableMemory.js"></script>
  <script src="modules/Float.js"></script>
  <script src="modules/Func.js"></script>
  <script src="modules/Hash.js"></script>
  <script src="modules/HashMap.js"></script>
  <script src="modules/Heap.js"></script>
  <script src="modules/Int.js"></script>
  <script src="modules/Int16.js"></script>
  <script src="modules/Int32.js"></script>
  <script src="modules/Int64.js"></script>
  <script src="modules/Int8.js"></script>
  <script src="modules/Iter.js"></script>
  <script src="modules/IterType.js"></script>
  <script src="modules/List.js"></script>
  <script src="modules/Nat.js"></script>
  <script src="modules/Nat16.js"></script>
  <script src="modules/Nat32.js"></script>
  <script src="modules/Nat64.js"></script>
  <script src="modules/Nat8.js"></script>
  <script src="modules/None.js"></script>
  <script src="modules/Option.js"></script>
  <script src="modules/Order.js"></script>
  <script src="modules/Prelude.js"></script>
  <script src="modules/Principal.js"></script>
  <script src="modules/RBTree.js"></script>
  <script src="modules/Random.js"></script>
  <script src="modules/Result.js"></script>
  <script src="modules/Stack.js"></script>
  <script src="modules/Text.js"></script>
  <script src="modules/Time.js"></script>
  <script src="modules/Trie.js"></script>
  <script src="modules/TrieMap.js"></script>
  <script src="modules/TrieSet.js"></script>
  <script src="motoko/allin1.js"></script>
</head>
<body>
<h1 class="main">
  Motoko Base Manual <a style="font-size:14px;">updated on 20220831 by <a href="mailto:samshi@hdcafe.com">Sam SHI</a></span>
</h1>
<div id="import_page"></div>
</body>
</html>
<script src="js/index2.js"></script>

