'use strict'
let fs   = require("fs");
var path = require('path');
var exec = require('child_process').exec;

const root = "../base/test"
let data   = fs.readdirSync(root);
let files  = []
data.map(file => {
  if(/\w+\.mo/.test(file)){
    files.push(file)
  }
})

console.log(files)
let demos = {}
for(let i = 0, l = files.length; i < l; i++){
  let file_content = fs.readFileSync(root + '/' + files[i]);
  file_content     = file_content.toString();
  let module       = files[i].slice(0, -3)
  console.log(i, module)
  getFunctions(file_content)
  return
  demos[module]          = {
    imports: getImports(file_content),
    functions,
    other
  }

  let file = 'demos/' + module + '.js'

  if(!fs.existsSync(file)){
    fs.writeFileSync(file, 'demos.' + file + '=' + JSON.stringify(demos[module]))
    console.log(file, 'replaced')
  }
  else{
  }
}

// console.log(demos)

function getImports(file_content){
  let imports = {}
  file_content.replace(/(^|\n)import \w+ "[^"]+"/g, import_str => {
    let a         = import_str.trim().split(/[\s\"]+/g)
    imports[a[2]] = a[1]
  })

  return imports
}

function getFunctions(file_content){
  // let a = file_content.split(/(\n[^ ][^\n]+)(?=\n)/)
  let arr = file_content.split(/\n/)
  let imports = {}
  for(let i=0, l=arr.length; i<l; i++){
    if(/^import /.test(arr[i]){
      let a         = arr[i].trim().split(/[\s\"]+/g)
      imports[a[2]] = a[1]
    }
    else if
  }
  console.log(a, a.length)
}
