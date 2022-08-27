<?php
define('ROOT', $_SERVER['DOCUMENT_ROOT']);
include(ROOT.'/include/tools.php');

$folder = "./example";

//打开目录
$fp = opendir($folder);

//阅读目录
$modules = [];
while(false != $file = readdir($fp)){
  //列出所有文件并去掉'.'和'..'
  if($file != '.' && $file != '..'){
    $a = explode('_', substr($file, 0, -4));
    if(!$modules[$a[0]]){
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
  <style>
      h1 {
          margin-top: 5px;
          text-align: center;
      }

      .main{
          margin-left:400px;
          margin-right: 20px;
          width:calc(100% - 420px);
          min-width:588px;
      }

      pre {
          width:100%;
          /*calc(100% - 20px);*/
          background: #eee;
          padding: 10px;
          font-family: monospace;
          font-size: 18px;
          overflow: scroll;
          max-height: 300px;
          min-width:588px;
      }
      table {
          margin: 0 20px;
          border-collapse: collapse;
          border-spacing: 1px;
      }

      td, th {
          border: 1px solid #ccc;
          padding: 1px 5px;
      }

      th {
          /*border-bottom: 1px solid #666;*/
      }

      a{
          font-size: 14px;
      }


      button {
          margin-left: 10px;
      }

      input {
          padding: 5px;
          width: 30%;
          font-size: 14px;
          margin-bottom: 10px;
      }

      textarea {
          padding: 5px;
          width: calc(100% - 20px);
          height: 200px;
          font-size: 14px;
      }
  </style>
  <script>
    var examples = JSON.parse('<?php echo myJsonEncode($modules); ?>')
    console.log(examples);
    var modules = {}
    var demos   = {}
  </script>
  <script src="myjq.js"></script>
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
</head>
<body>
<h1 class="main">
  Motoko Base Manual <a style="font-size:14px;">updated on 20220826 by <a href="mailto:samshi@hdcafe.com">Sam SHI</a></span>
</h1>
<div id="import_page"></div>
</body>
</html>
<script>
  var pages_list  = [
    'base_module_function', 'base_module_import', // 'cycle_caculator_page',
  ]
  var pages       = {}
  var status_data = {}

  var dependent = {}
  for(let module in modules){
    for(let import_from in modules[module].imports){
      if(!dependent[import_from]){
        dependent[import_from] = {}
      }

      dependent[import_from][module] = modules[module].imports[import_from]
    }
  }

  $(_ => {
    window.IW = $.IW()
    window.IH = $.IH()
    createPages()
    createModulePage()
    createImportPage()

    selectPage(pages_list[0])
  })

  function createPages(){
    pages_list.map((page, index) => {
      $.C($.body, {
        id: page,
        L : 30 + index * 180,
        T : 20,
        W : 160,
        I : page
      }, 'button').down(eobj => {
        selectPage(eobj.ID_)
      })

      pages[page] = $.C($.body, {
        id: page,
        L : 20,
        T : 50,
        W : 'calc(100% - 40px)',
        minWidth: '988px',
        H : IH - 70,
        BD:'1px solid #ccc',
        O : 'scroll'
      }).H()
    })
  }

  function createModulePage(){
    window.modules_list_node = $.C(pages[pages_list[0]], {
      L: 20,
      T: 20,
      H: IH - 100,
      O: 'auto'
    })

    window.functions_list_node = $.C(pages[pages_list[0]], {
      L: 270,
      T: 20,
      H: IH - 100,
      O: 'auto'
    })

    window.functions_detail_node = $.C(pages[pages_list[0]], {
      CN: 'main',
      T: 0,
      H: IH - 70,
      O: 'auto'
    })

    for(let module in modules){
      $.c(modules_list_node, {
        id: module,
        I : module + moduleExamples(module),
        CS: 'pointer',
      }).down(eobj => {
        let module = eobj.I_.split(' ')[0]
        status_data.module = module
        modules_list_node.CHILDREN.map(module_eobj => {
          module_eobj.S({
            color: module_eobj == eobj ? 'red' : ''
          })
        })

        status_data.func = null
        showFunctions(module)

      })
    }
  }

  function moduleExamples(module){
    let sum = 0
    if(examples[module]){
      for(let f in examples[module]){
        sum += examples[module][f]
      }
    }
    if(sum){
      return ' ('+sum+')'
    }
    return ''
  }

  function showFunctions(module){
    var s = ''
    for(let func in modules[module].functions){
      let color = func == status_data.func ? 'red' : ''
      s += '<div onclick="selectFunction(this)" style="color:' + color + '">'
      s += func
      if(examples[module] && examples[module][func]){
        s += ' (' +examples[module][func]+')'
      }
      s += '</div>'
    }

    functions_list_node.I(s)
    functions_detail_node.I('')
  }

  function selectFunction(node){
    let func = node.innerText.split(' ')[0]
    status_data.func = func
    showFunctions(status_data.module)

    showDetail()
  }

  function showDetail(){
    window.module = status_data.module
    window.func   = status_data.func
    $.get('getexamples.php', {
      module,
      func
    }, res => {

      let s = ''

      s += '<h3>' + func + ' desc</h3>'
      s += '<pre>' + turnText(modules[module].functions[func].desc) + '</pre>'

      s += '<h3>' + func + ' code</h3>'
      s += '<pre>' + turnText(modules[module].functions[func].body) + '</pre>'

      let source = modules[module].test
      let hl     = highLight(source, func)
      let hl_btn = ''
      if(hl.length){
        hl.map(n => {
          hl_btn += '<button onclick="myTop(' + n + ')">' + (n + 1) + '</button>'
        })
      }
      s += '<h3>test ' + hl_btn + '</h3>'
      s += '<pre id="test">' + turnText(addLine(source)) + '</pre>'

      s += '<h3>' + module + ' import</h3>'
      for(let import_str in modules[module].imports){
        s += '<div>import ' + modules[module].imports[import_str] + ' "' + import_str + '"</div>'
      }
      s += '<h3>related</h3>'
      s += '<pre>' + turnText(modules[module].related) + '</pre>'

      s += '<h3>add your example <button onclick="addSample(this)">add</button></h3>'
      s += '<input id="myname" placeholder="your name" value="' + (localStorage.myname || '') + '"/><br>'
      s += '<textarea id="myexample" placeholder="example code here"></textarea>'

      s += '<h3>examples</h3>'
      s += '<pre id="examples">' + turnText(res).replace(/\n\-{5}/g, '\n\n-----').replace(/^\n+/g, '') + '</pre>'

      functions_detail_node.I(s)

      if(hl.length){
        myTop(hl[0])
      }
    })

  }

  function turnText(s){
    return s.replace(/\</g, '&lt').replace(/\>/g, '&gt')
  }

  function myTop(top){
    // setTimeout(function(top){
    //   return function(){
    $('#test', 1).context.scrollTop = top * 20
    // }
    // }(top), 100)
  }

  function createImportPage(){
    let import_from_arr = Object.keys(dependent).sort((a, b) => {
      let len1 = Object.keys(dependent[a]).length
      let len2 = Object.keys(dependent[b]).length
      return len2 - len1
    })
    let import_from_len = import_from_arr.length
    let s               = '<p/><table>'
    s += '<tr>'
    s += '<th>module</th>'
    s += '<th>import</th>'
    s += '<th>imported</th>'
    s += '<th>' + import_from_arr.join('</th><th>') + '</th>'
    s += '</tr>'
    for(let module in modules){
      s += '<tr>'
      s += '<td>' + module + '</td>'
      s += '<td>' + (Object.keys(modules[module].imports).length || '') + '</td>'
      s += '<td>' + (dependent[module] ? Object.keys(dependent[module]).length : '') + '</td>'
      for(let i = 0; i < import_from_len; i++){
        s += '<td>' + (dependent[import_from_arr[i]][module] || '') + '</td>'
      }
      s += '</tr>'
    }
    s += '<table>'

    pages.base_module_import.I(s)
  }

  function selectPage(page){
    for(let _page in pages){
      pages[_page].V(_page == page)
    }
  }

  function highLight(source, func){
    let str      = source
    let position = []
    let find
    let reg      = new RegExp(`[^\\w]` + func + `[^\\w]`)
    while(true){
      find = str.match(reg)
      if(!find){
        break
      }

      let line = str.slice(0, find.index).split(/\n/).length - 1

      if(line){
        if(position.length){
          line += position[position.length - 1]
        }
        position.push(line)
      }

      str = str.slice(find.index + 1 + func.length)
    }

    return position
  }

  function addLine(source){
    let a = source.split(/\n/)
    if(a.length > 1){
      a = a.map((line, index) => {
        index++
        let blank = ' |'
        if(index < 10){
          blank = '   |'
        }
        else if(index < 100){
          blank = '  |'
        }
        return index + blank + line
      })
    }
    else{
      a = ['no text code']
    }

    return a.join('\n')
  }

  function addSample(node){
    let myname   = document.getElementById('myname').value
    let myexample = document.getElementById('myexample').value
    console.log(window.module, window.func, myname, myexample)
    if(!myname || !myexample){
      alert('name and example are all needed')
      return;
    }
    if(myname){
      localStorage.myname = myname
    }
    $.post('setexample.php', {
      module,
      func,
      name  : encodeURIComponent(myname),
      example: encodeURIComponent(myexample)
    }, res=>{
      console.log('setexample res', res)
      showDetail()
    })

  }
</script>




