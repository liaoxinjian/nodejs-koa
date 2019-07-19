const mysql = require('mysql')
const co = require('co-mysql')
const {DB_HOST, DB_ROOT, DB_PASS, DB_PORT, DB_NAME, DB_CONNECTION} = require('../config')
let conn = mysql.createPool({
  host: DB_HOST,
  user: DB_ROOT,
  password: DB_PASS,
  port: DB_PORT,
  database: DB_NAME,
  connectionLimit: DB_CONNECTION
})
module.exports = co(conn)