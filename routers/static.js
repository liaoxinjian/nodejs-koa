const static = require('koa-static')
const path = require('path')
module.exports = function(router, options) {
  options = options || {}
  options.images = options.images || 30
  options.scripts = options.scripts || 30
  options.html = options.html || 7
  options.styles = options.styles || 30
  options.others = options.others || 30
  router.all(/((\.js)|(\.jsx))$/i, static(path.join(__dirname, '../static'), {
    maxage: options.scripts*86400*1000
  }))
  router.all(/((\.html)|(\.htm))$/i, static(path.join(__dirname, '../static'), {
    maxage: options.html*86400*1000
  }))
  router.all(/(\.css)$/i, static(path.join(__dirname, '../static'), {
    maxage: options.styles*86400*1000
  }))
  router.all(/((\.jpg)|(\.jpeg)|(\.png)|(\.gif))$/i, static(path.join(__dirname, '../static'), {
    maxage: options.images*86400*1000
  }))
  router.all('*', static(path.join(__dirname, '../static'), {
    maxage: options.others*86400*1000
  }))
}