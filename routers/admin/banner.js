const tablelib = require('./libs')
const fields = [
  {title: '标题', name: 'title', type: "text"},
  {title: '图片', name: 'src', type: "file"},
  {title: '链接地址', name: 'href', type: "text"},
  {title: '序号', name: 'serial', type: "number"},
]
const table = 'banner_table'
const page_type = 'banner'
module.exports = tablelib(table, page_type, fields)