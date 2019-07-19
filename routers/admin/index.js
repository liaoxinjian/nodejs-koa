const Router = require('koa-router')
const router = new Router()
const fs = require('await-fs')
const path = require('path')
router.get('/login', async ctx=>{
  const {HTTP_ROOT} = ctx.config
  await ctx.render('admin/login', {
    HTTP_ROOT,
    errorMsg: ctx.query.errorMsg
  })
})
router.post('/login', async ctx=>{
  const {HTTP_ROOT, MD5_SUFFIX} = ctx.config
  const {username, password} = ctx.request.fields
  let admins = JSON.parse((await fs.readFile(path.join(__dirname, '../../admins.json'))).toString())
  function findAdmins(username) {
    let a = null;
    admins.forEach(item => {
      if (item.username==username) a=item
    })
    return a
  }
  let admin = findAdmins(username)
  if (!admin) {
    ctx.redirect(`${HTTP_ROOT}/admin/login?errorMsg=${encodeURIComponent("该账号不存在")}`)
  } else if (admin.password != ctx.common.md5(password+MD5_SUFFIX)) {
    ctx.redirect(`${HTTP_ROOT}/admin/login?errorMsg=${encodeURIComponent("该密码不正确")}`)
  } else {
    ctx.session['admin'] = username
    ctx.redirect(`${HTTP_ROOT}/admin/`)
  }
})
router.all('*', async (ctx,next) => {
  const {HTTP_ROOT} = ctx.config
  if (ctx.session['admin']) {
    await next()
  } else {
    ctx.redirect(`${HTTP_ROOT}/admin/login`)
  }
})
router.get('/', async ctx=>{
  const {HTTP_ROOT} = ctx.config
  ctx.redirect(`${HTTP_ROOT}/admin/banner`)
})
router.use('/banner', require('./banner'))
router.use('/article', require('./article'))
router.use('/catalog', require('./catalog'))
module.exports = router.routes()