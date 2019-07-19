const Router = require('koa-router')
const fs = require('await-fs')
const path = require('path')
module.exports = function(table, page_type, fields) {
  const router = new Router()
  const page_types = {
    'banner': 'banner管理',
    'catalog': '类目管理',
    'article': '文章管理'
  }
  const reg = /^\d+$/;
  router.get('/', async ctx=>{
    const {HTTP_ROOT} = ctx.config
    let datas = await ctx.db.query(`SELECT * FROM ${table}`)
    fields.forEach(async field=>{
      if (field.type == 'select') {
        field.items = await ctx.db.query(field.from)
      }
    })
    await ctx.render('admin/table', {
      HTTP_ROOT,
      datas,
      fields,
      page_type,
      page_types,
    })
  })
  router.post('/', async ctx=>{
    const {HTTP_ROOT} = ctx.config
    let keys = []
    let vals = []
    fields.forEach(field=>{
      const {name, type} = field
      keys.push(name)
      if (type == 'file') {
        // 这个是当有文件的时候 获取文件的名称的
        vals.push(path.basename(ctx.request.fields[name][0].path))
      } else if (type == 'date') {
        // 因为数据库里面时间这一字段设置的是int类型，这里才会转换成时间戳
        // 如果不想转换成时间戳的话 那么可以把数据库里面这一字段改为verchar类型
        vals.push(new Date(ctx.request.fields[name]).getTime()/1000)
      } else {
        vals.push(ctx.request.fields[name])
      }
    })
    await ctx.db.query(`INSERT INTO ${table} (${keys.join(',')}) VALUES(${keys.map(key=>'?').join(',')})`, vals)
    ctx.redirect(`${HTTP_ROOT}/admin/${page_type}`)
  })
  router.get('/delete/:id', async ctx=>{
    const {HTTP_ROOT, UPLOADDIR} = ctx.config
    const {id} = ctx.params
    let datas = await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id])
    ctx.assert(datas.length, 400, 'No Data')
    let row = datas[0]
    fields.forEach(async ({name, type})=>{
      if (type=='file') {
        await ctx.common.unlink(path.join(UPLOADDIR, row[name]))
      }
    })
    await ctx.db.query(`DELETE FROM ${table} WHERE ID=?`, [id])
    ctx.redirect(`${HTTP_ROOT}/admin/${page_type}`)
  })
  router.get('/get/:id', async ctx=>{
    const {id} = ctx.params
    if (reg.test(id)) {
      let datas = await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`, [id])
      if (!datas.length) {
        ctx.body = {code: 1, msg: 'No Data'}
      } else {
        ctx.body = {code: 0, msg: 'success', data: datas[0]}
      }
    }
  })
  router.post('/modify/:id', async ctx=>{
    const post = ctx.request.fields
    const {UPLOADDIR, HTTP_ROOT} = ctx.config
    const {id} = ctx.params
    if (reg.test(id)) {
      let row = await ctx.db.query(`SELECT * FROM ${table} WHERE ID=?`,[id])
      ctx.assert(row.length, 400, 'No Data')
      let paths = {}
      fields.forEach(({name, type})=>{
        if (type=='file') {
          paths[name] = row[0][name]
        }
      })
  
  
      // const old_src = row[0].src
      let keys = []
      let vals = []
      let src_changed = {}
      fields.forEach(({name, type}) => {
        if (type == 'file') {
          if (post[name] && post[name].length && post[name][0].size) {
            src_changed[name] = true
            keys.push(name)
            vals.push(path.basename(post[name][0].path))
          }
        } else if (type=='date') {
          keys.push(name)
          vals.push(Math.floor(new Date(post[name]).getTime()/1000))
        } else {
          keys.push(name)
          vals.push(post[name])
        }
      })
      await ctx.db.query(`UPDATE ${table} SET ${keys.map(item=>(`${item}=?`)).join(',')} WHERE ID=?`, [...vals, id])
      fields.forEach(async ({name, type})=>{
        if (type=='file' && src_changed[name]) {
          await ctx.common.unlink(path.resolve(UPLOADDIR, paths[name]))
        }
      })
      ctx.redirect(`${HTTP_ROOT}/admin/${page_type}`)
    }
  })
  return router.routes()
}