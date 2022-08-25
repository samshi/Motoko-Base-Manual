'use strict'
let fs   = require("fs");
var path = require('path');
var exec = require('child_process').exec;

const root       = "../motoko-base"
const src_dir    = root + '/src'
const test_dir   = root + '/test'
let modules_list = fs.readdirSync(src_dir);
let files        = []
modules_list.map(file => {
  if(/\w+\.mo/.test(file)){
    files.push(file)
  }
})

// console.log(files)
let modules = {}
for(let i = 0, l = files.length; i < l; i++){
  let file_content = fs.readFileSync(src_dir + '/' + files[i]);
  file_content     = file_content.toString();
  let module       = files[i].slice(0, -3)

  if(module != 'Iter'){
    // continue
  }
  console.log(i, module)
  let [functions, other] = getFunctions(file_content)
  modules[module]        = {
    imports: getImports(file_content),
    functions,
    other,
    test   : getTest(module)
  }

  let file = 'demos/' + module + '.js'

  if(1 || !fs.existsSync(file)){
    fs.writeFileSync(file, 'modules.' + module + '=' + JSON.stringify(modules[module]))
    console.log(file, 'replaced')
  }
  else{
  }
}

// console.log(modules)

function getImports(file_content){
  let imports = {}
  file_content.replace(/(^|\n)import \w+ "[^"]+"/g, import_str => {
    let a         = import_str.trim().split(/[\s\"]+/g)
    imports[a[2]] = a[1]
  })

  return imports
}

function getFunctions(file_content){
  let functions     = {}
  let a             = file_content.split(/(\nmodule \{|\n\})/g)
  let functions_str = a[2]
  if(/public (func|class|type|let)/.test(functions_str)){
    functions_str = functions_str.replace(/((\n  )?\/{2,3}[^\n]*)*\n  public (func|class|type|let)[\s\S]+?(\n[ ]{2}[\}\/]|$)/g, f => {
      // console.log('---------------------------------------')
      // console.log(f)
      let a          = f.split(/\n  public (func|class|type|let) (\w+)/)
      let desc       = a[0].replace(/  \/{2,3}[ ]?/g, '').trim()
      let return_str = '\n'
      if(f.slice(-1) == '/'){
        // console.log('===========================')
        // desc       = desc.slice(0, -1)
        return_str = '\n/'
        // console.log('===========================')
      }

      let block_type = a[1]
      let func_name  = a[2]
      let body       = 'public ' + block_type + ' ' + func_name + a[3]
        .replace(/\n  /g, '\n').trim().replace(/\/$/g, '').trim()

      functions[func_name] = {
        desc,
        body
      }

      // console.log(functions[func_name], 1)

      return return_str
    })
  }

  if(1){
    // console.log('func in class, add blank')
    // console.log(76)

    if(/public (func|class|type|let)/.test(functions_str)){
      functions_str = functions_str.replace(/(\s*[\/]{2,3}[^\n]*)*\n[ ]{4}public (func|class|type|let)[\s\S]+?(\n[ ]{4}[\}\/]|$)/g, f => {
        let a    = f.split(/public (func|class|type|let) (\w+)/)
        let desc = a[0].replace(/[ ]*\/{2,3}[ ]?/g, '').trim()

        let return_str = '\n'
        if(f.slice(-1) == '/'){
          return_str = '\n/'
        }

        let block_type = a[1]
        let func_name  = a[2]
        let body       = 'public ' + block_type + ' ' + func_name + a[3]
          .replace(/\n[ ]{4}/g, '\n').trim().replace(/\/$/g, '').trim()

        functions['class.' + func_name] = {
          desc,
          body
        }

        // console.log(functions[func_name], 1)

        return return_str
      })
    }
    // console.log(77)
  }

  let other = functions_str
    .replace(/^[;\n]+$/g, '')
    .replace(/\n;/g, '')
    .replace(/\n{2,}/g, '\n')

    .replace(/\n  /g, '\n')
    .replace(/[;\/]+\n/g, ';\n')
    .trim()
    .replace(/^\/$/g, '')
    .replace(/^[;\n]+$/g, '')
    .replace(/\n;/g, '')

  console.log('------------------')
  console.log(other)
  return [functions, other]
}

function getTest(module){
  let file_path = test_dir + '/' + module + 'Test.mo'
  console.log(file_path)
  if(fs.existsSync(file_path)){
    return fs.readFileSync(file_path).toString()
  }

  return ''
}
