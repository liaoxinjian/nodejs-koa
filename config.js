const path = require('path')
module.exports = {
  DB_HOST: 'localhost',
  DB_ROOT: 'root',
  DB_PASS: 'root',
  DB_PORT: 3306,
  DB_NAME: 'cpts',
  DB_CONNECTION: 10,
  // http相关的
  HTTP_PORT: 6661,
  HTTP_ROOT: 'http://localhost:6661',
  UPLOADDIR: path.join(__dirname, './static/upload'),
  MD5_SUFFIX: '_sakd^*&!@#%&@#0-sd'
}