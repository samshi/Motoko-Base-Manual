'use strict'
let fs = require("fs");

const target = "../motoko/allin1.js"
var all      = {}
var i        = 0
var total    = 0

if(fs.existsSync(target)){
  fs.unlinkSync(target)
}
const fd = fs.openSync(target, 'a');

var root, root_len

root = "../../examples/motoko"
root_len = root.length+1
scandir(root)

root = "../../tipjar"
root_len = 6
scandir(root)

root = "../../ic-drive"
root_len = 6
scandir(root)

root = "../../cancan"
root_len = 6
scandir(root)

const content = "const sample_code=" + JSON.stringify(all)

fs.appendFileSync(fd, content)

// console.log(all)
console.log(total)

function scandir(dir){
  let list = fs.readdirSync(dir);
  list.map(file => {
    let path = dir + '/' + file
    let stat = fs.statSync(path)

    if(stat.isDirectory()){
      scandir(path)
    }
    else if(path.slice(-3) == '.mo'){
      let file    = path.slice(root_len)

      if('hello/src/hello/main.mo' == file){
        return
      }

      let content = '' + fs.readFileSync(path)
      // content     = `\n\n///@${file}\n` + content
      all[file]   = content

      total += stat.size
      // fs.appendFileSync(fd, content)
      // console.log(file)

      console.log(path, '=>',file)
    }
  })
}
