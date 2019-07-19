const fs = require('fs')
const KEY_LEN = 1024
const KEY_COUNT = 2048
const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+{}[]'
let arr = []
for(let i=0; i<=KEY_COUNT; i++) {
  let str = ""
  for(let j=0; j<=KEY_LEN; j++) {
    str += CHARS[Math.floor(Math.random()*CHARS.length)]
  }
  arr.push(str)
}
fs.writeFileSync('.key', arr.join('\n'))