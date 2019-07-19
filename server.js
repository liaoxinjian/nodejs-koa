const Koa = require('koa')
const Router = require('koa-router')
const static = require('./routers/static')
const body = require('koa-better-body')
const ejs = require('koa-ejs')
const session = require('koa-session')
const config = require('./config')
const path = require('path')
const fs = require('fs')
const app = new Koa()
const router = new Router()
app.listen(config.HTTP_PORT)
console.log(`server running at ${config.HTTP_PORT}`);
// 中间件
app.use(body({
  uploadDir: config.UPLOADDIR
}))
app.keys = fs.readFileSync('.key').toString().split('\n')
app.use(session({
  maxAge: 20*60*1000,
  renew: true
}, app))
ejs(app,{
  root: path.join(__dirname, './template'),
  viewExt: 'ejs',
  layout: false,
  cache: false,
  debug: false
})
app.context.db = require('./libs/database')
app.context.config = config
app.context.common = require('./libs/common')
// 路由和静态资源处理
router.use('/admin', require('./routers/admin'))
router.use('', require('./routers/www'))
router.use('/api', require('./routers/api'))
static(router, {
  html: 365
})
app.use(router.routes())