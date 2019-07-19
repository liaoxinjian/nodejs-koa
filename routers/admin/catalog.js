const tablelib = require('./libs')
const fields = [
  {title: '标题', name: 'title', type: "text"}
]
const table = 'catalog_table'
const page_type = 'catalog'

module.exports = tablelib(table, page_type, fields)