var pages_list  = [
  'base_module_function', 'base_module_import', // 'cycle_caculator_page',
]
var pages       = {}
var status_data = {}
var dependent   = {}
var sample_keys

$(_ => {
  var t0 = performance.now()
  $.get('motoko/userfilein1.js', '', res => {
    let userfilein1 = JSON.parse(res);
    // console.log(userfilein1)
    $.E(sample_code, userfilein1)

    sample_keys = getSampleKeyOrdered()

    let total_test    = 0
    let total_example = 0
    let total_code    = 0

    for(let module in modules){
      for(let func in modules[module].functions){
        let source                              = modules[module].test
        let module_as                           = moduleAs(source, module)
        modules[module].functions[func].test    = highLight(source, module_as, func).length
        modules[module].functions[func].example = examples[module] && examples[module][func] || 0
        modules[module].functions[func].code    = findInCodeNum_2(module, func)

        total_test += modules[module].functions[func].test
        total_example += modules[module].functions[func].example
        total_code += modules[module].functions[func].code
      }
    }

    createModuleItem_1()
    createStatisticContent_1(total_test, total_example, total_code)
    selectPage(pages_list[0])

    var t1 = performance.now()
    console.log(t1 - t0)
  })

  window.IW = $.IW()
  window.IH = $.IH()
  createPages()
  createModulePage()
  createImportPage()
})

//getExamples_2
function addSample_3(node){
  let myname    = document.getElementById('myname').value
  let myexample = document.getElementById('myexample').value
  console.log(window.module, window.func, myname, myexample)
  if(!myname || !myexample){
    alert('name and example are all needed')
    return;
  }
  if(myname){
    localStorage.myname = myname
  }
  $.post('php/setexample.php', {
    module,
    func,
    name   : encodeURIComponent(myname),
    example: encodeURIComponent(myexample)
  }, res => {
    console.log('setexample res', res)
    getExamples_2()
  })

}

//showFunctions, showDetail_2, getExamples_2
function selectFunction_3(node){
  let func         = node.innerText.split(' ')[0]
  status_data.func = func
  showFunctions(status_data.module)

  showDetail_2()
  getExamples_2()
}

//findInCode_1
function findInCodeNum_2(module, func){
  let find   = findInCode_1(module, func)
  let amount = 0
  for(let name in find){
    amount += find[name].length
  }

  return amount
}

//turnDivText_1
function getExamples_2(){
  $.get('php/getexamples.php', {
    module,
    func
  }, res => {
    $('#examples', 1).I(turnDivText_1(res, module, func))
  })
}

//turnText, moduleAs, highLight, createButtons, findInCode_1, turnDivText_1, myTop, simplify
function showDetail_2(){
  window.module = status_data.module
  window.func   = status_data.func

  let s = ''

  s += '<h3>' + module + ' import</h3>'
  for(let import_str in modules[module].imports){
    s += '<div>import ' + modules[module].imports[import_str] + ' "' + import_str + '"</div>'
  }

  s += '<h3>related</h3>'
  s += '<pre>' + turnText(modules[module].related) + '</pre>'

  s += '<h3>' + func + ' desc</h3>'
  s += '<pre>' + turnText(modules[module].functions[func].desc) + '</pre>'

  s += '<h3>' + func + ' code</h3>'
  s += '<pre>' + turnText(modules[module].functions[func].body) + '</pre>'

  let source    = modules[module].test
  let module_as = moduleAs(source, module)
  let hl        = highLight(source, module_as, func)
  let hl_btn    = createButtons('test', hl)
  s += '<h3>test ' + hl_btn + '</h3>'
  s += '<div id="test" class="code">' + turnDivText_1(addLine(source), module_as, func) + '</div>'

  s += '<h3>add your example <button onclick="addSample_3(this)">add</button></h3>'
  s += '<input id="myname" placeholder="your name" value="' + (localStorage.myname || '') + '"/>'
  s += '<textarea id="myexample" placeholder="example code here"></textarea>'

  s += '<h3>examples</h3>'
  s += '<div id="examples" class="code"></div>'

  s += '<h3>Sample Code</h3>'
  let find = findInCode_1(module, func)
  let i    = 0
  for(let sample_name in find){
    let lines     = find[sample_name]
    let hl_btn    = createButtons(sample_name, lines)
    let source    = sample_code[sample_name]
    let submitter = ''
    if(sample_name.slice(0, 6) == 'https:'){
      let a     = source.indexOf('\n')
      submitter = source.slice(1, a)
      source    = source.slice(a + 1)
    }
    let module_as    = moduleAs(source, module)
    let color_source = turnDivText_1(addLine(source), module_as, func)
    s += `<p>${++i}. <a target="source" href="${getUrl(sample_name)}">${simplify(sample_name, submitter)}</a> ${hl_btn}</p>`
    s += `<div id="${sample_name}" class="code">${color_source}</div>`
    setTimeout((function(sample_name, lines0){
      return function(){
        myTop(sample_name, lines0)
      }
    })(sample_name, lines[0]), 100)
  }

  statistic_node.H()
  functions_detail_node.I(s).V()

  if(hl.length){
    myTop('test', hl[0])
  }
}

//moduleExamples, showFunctions
function createModuleItem_1(){
  for(let module in modules){
    $.c(modules_list_node, {
      id: module,
      I : module + moduleExamples(module),
      CS: 'pointer',
    }).down(eobj => {
      let module = eobj.I_.split(' ')[0]
      if(status_data.module == module){
        status_data.module = null
        statistic_node.V()
      }
      else{
        status_data.module = module
        statistic_node.H()
      }

      modules_list_node.CHILDREN.map(module_eobj => {
        module_eobj.S({
          BG: module_eobj == eobj && status_data.module ? 'yellow' : ''
        })
      })

      status_data.func = null
      showFunctions()
      functions_detail_node.H()

    })
  }
}

//getUrl
function createStatisticContent_1(total_test, total_example, total_code){
  let s = '<table id="statistic">'
  s += `<tr><td width="50%">examples in motoko-base test</td><td>${total_test}</td></tr>`
  s += `<tr><td>examples by users submit</td><td>${total_example}</td></tr>`
  s += `<tr><td>examples in motoko sample files <button onclick="showFiles(this)">show files</button></td><td>${total_code}</td></tr>`
  s += `<tr><td colspan="2">`
  s += '<input placeholder="your name" value="' + (localStorage.myname || '') + '"/>'
  s += '<input id="url" placeholder="motoko file url: https://github.com/.../xxx.mo" />'
  s += `<button style="margin-left:calc(100% - 160px);font-size:16px;padding:5px 10px;" onclick="urlSubmit(this)">submit motoko file</button>`
  s += `</td></tr>`

  s += '</table>'
  s += '<p><p>'

  s += `<div id="filelist" style="display:none">motoko sample files list (${sample_keys.length}): `
  s += `<br><br>`
  let submitter = ''
  sample_keys.map((file, index) => {
    if(file.slice(0, 6) == 'https:'){
      let source = sample_code[file]
      let a      = source.indexOf('\n')
      if(source.slice(1, a) != 'samshi'){
        submitter  = ' submit by ' + source.slice(1, a)
      }
    }

    let url = getUrl(file)
    s += `<span class="index">${index + 1}</span>: <a target="source" href="${url}">${url.slice(8)}</a>${submitter}<br>`
  })
  s += '</div>'
  statistic_node.I(s)
}

//moduleAs,highLight
function findInCode_1(module, func){
  // console.log('==================')
  var result = {}
  sample_keys.map(sample_name => {
    let source = sample_code[sample_name]
    if(sample_name.slice(0, 6) == 'https:'){
      let a  = source.indexOf('/')
      source = source.slice(a) + 1
    }
    let module_as = moduleAs(source, module)

    let find = highLight(source, module_as, func)
    if(find.length){
      result[sample_name] = find
      // console.log(sample_name)
      // console.log(find)
    }
  })

  return result
}

//turnText
function turnDivText_1(s, module, func){
  return turnText(s)
    .replace(/\n\-{5}/g, '\n\n-----')
    .replace(/^\n+/g, '')
    .replace(/\n/g, '<br>')
    .replace(/ /g, '&nbsp;')
    .replace(new RegExp(module + '\\.' + func, 'g'), '<span>' + module + '\.' + func + '</span>')
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

function createButtons(id, arr){
  let hl_btn = ''
  if(arr.length){
    arr.map(n => {
      hl_btn += `<button onclick="myTop('${id}',${n})">${n + 1}</button>`
    })
  }
  return hl_btn
}

function createModulePage(){
  window.modules_list_node = $.C(pages[pages_list[0]], {
    L : 0,
    T : 0,
    O : 'auto',
    PD: 20,
    Z : 1
  })

  window.functions_list_node = $.C(pages[pages_list[0]], {
    L : 250,
    T : 0,
    O : 'auto',
    BG: '#fff',
    PD: 20,
    Z : 3
  })

  window.functions_detail_node = $.C(pages[pages_list[0]], {
    CN: 'main',
    T : 0,
    H : IH - 120,
    O : 'auto',
    Z : 2
  })

  window.statistic_node = $.C(pages[pages_list[0]], {
    I : 'statistic',
    CN: 'main',
    T : 0,
    H : IH - 120,
    O : 'auto',
    Z : 2
  })
}

function createImportPage(){
  for(let module in modules){
    for(let import_from in modules[module].imports){
      if(!dependent[import_from]){
        dependent[import_from] = {}
      }

      dependent[import_from][module] = modules[module].imports[import_from]
    }
  }

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
      id      : page,
      L       : 20,
      T       : 50,
      W       : 'calc(100% - 40px)',
      minWidth: '988px',
      H       : IH - 70,
      BD      : '1px solid #ccc',
      O       : 'scroll'
    }).H()
  })
}

function getSampleKeyOrdered(){
  let keys = Object.keys(sample_code)
  keys.sort((a, b) => {
    return getUrl(a).toLowerCase() > getUrl(b).toLowerCase() ? 1 : -1
  })

  return keys
}

function getUrl(s){
  if(s.slice(0, 6) == 'https:'){
    return s
  }
  else if(s.slice(0, 6) == 'cancan'){
    return 'https://github.com/dfinity/cancan/blob/main/' + s.slice(7)
    // https://github.com/ninegua/tipjar/blob/main/src/tipjar/src/tipjar/Util.mo
    // https://github.com/ninegua/tipjar/blob/main/src/tipjar/Util.mo
  }
  else if(s.slice(0, 6) == 'tipjar'){
    return 'https://github.com/ninegua/tipjar/blob/main/' + s.slice(7)
    // https://github.com/ninegua/tipjar/blob/main/src/tipjar/src/tipjar/Util.mo
    // https://github.com/ninegua/tipjar/blob/main/src/tipjar/Util.mo
  }
  else if(s.slice(0, 8) == 'ic-drive'){
    return 'https://github.com/IC-Drive/ic-drive/blob/master/' + s.slice(9)
    // https://github.com/IC-Drive/ic-drive/blob/master/src/icdrive/src/icdrive/Util.mo
    // https://github.com/IC-Drive/ic-drive/blob/master/src/icdrive/FileHandle.mo
  }
  else if(s == 'defi/src/DIP20/motoko/src/token.mo'){
    return 'https://github.com/Psychedelic/DIP20/blob/1d4b92781e46cee528e52f578c55e384561f380a/motoko/src/token.mo'
  }
  else if(s == 'defi/src/DIP20/motoko/src/types.mo'){
    return 'https://github.com/Psychedelic/DIP20/blob/1d4b92781e46cee528e52f578c55e384561f380a/motoko/src/types.mo'
  }

  return 'https://github.com/dfinity/examples/blob/master/motoko/' + s
}

function highLight(source, module, func){
  if(!module){
    return []
  }

  let str      = source
  let position = []
  let find
  let reg      = new RegExp(`[^\\w]` + module + '\\.' + func + `[^\\w]`)
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

function myTop(id, top){
  // setTimeout(function(top){
  //   return function(){
  $(`#${id}`, 1).context.scrollTop = ((top * 18.5) >> 0) - 60
  // }
  // }(top), 100)
}

function moduleAs(source, module){
  let load_reg = new RegExp(`import (\\w+) "mo\:base\/${module}"`)
  let load_as  = source.match(load_reg)
  if(!load_as){
    return ''
  }

  return load_as[1]
}

function moduleExamples(module){
  let sum_test    = 0
  let sum_example = 0
  let sum_code    = 0
  if(modules[module]){
    let functions = modules[module].functions
    for(let f in functions){
      sum_test += functions[f].test
      sum_example += functions[f].example
      sum_code += functions[f].code
    }
  }
  if(sum_test || sum_example || sum_code){
    return ` (${sum_test}/${sum_example}/${sum_code})`
  }
  return ''
}

function selectPage(page){
  for(let _page in pages){
    pages[_page].V(_page == page)
  }
}

function simplify(s, submitter){
  if(s.slice(0, 6) == 'https:'){
    let a = s.split('/');
    return [].concat(a[4], a.slice(7)).join('/') //+ ' by ' + submitter;
  }
  return s
}

function showFiles(node){
  var target           = $('#filelist').context
  var value = target.style.display == 'none' ? '' : 'none'
  target.style.display = value
  node.innerHTML = value == '' ? 'hide files' : 'show files'
}

function showFunctions(){
  let module = status_data.module
  var s      = ''
  if(module){
    var functions = modules[module].functions
    for(let func in functions){
      let color = func == status_data.func ? 'yellow' : ''
      s += '<div onclick="selectFunction_3(this)" style="background:' + color + '">'
      s += func
      if(functions[func].test || functions[func].example || functions[func].code){
        s += ` (${functions[func].test}/${functions[func].example}/${functions[func].code})`
      }
      s += '</div>'
    }
  }

  functions_list_node.I(s)
}

function turnText(s){
  return s.replace(/\</g, '&lt').replace(/\>/g, '&gt')
}

function urlSubmit(node){
  let url  = node.previousElementSibling.value.trim()
  let myname = node.previousElementSibling.previousElementSibling.value.trim()
  console.log(url, myname)

  if(!myname){
    alert('please input name')
    return
  }

  if(myname){
    localStorage.myname = myname
  }

  if(!/^https:\/\/github\.com\/[\w\-\_\/\.]+\.mo$/.test(url)){
    alert(url + ' is not a motoko file')
    return
  }

  if(statistic_node.I_.indexOf(url) >= 0){
    alert('the file was included already')
    return
  }

  $.post('php/seturl.php', {
    name: encodeURIComponent(myname),
    url : encodeURIComponent(url)
  }, res => {
    alert(res);
  })
}
