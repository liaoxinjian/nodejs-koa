const Router = require('koa-router')
const router = new Router()
router.get('', async ctx=>{
  const {HTTP_ROOT} = ctx.config
  let banners = await ctx.db.query('SELECT * FROM banner_table ORDER BY serial ASC')
  let catalogs = await ctx.db.query('SELECT * FROM catalog_table')
  let articles = await ctx.db.query(`
    SELECT
    *,
    article_table.title AS article_title,
    catalog_table.title AS catalog_title,
    article_table.ID AS article_ID
    FROM article_table
    LEFT JOIN catalog_table ON article_table.catalog_ID=catalog_table.ID
    ORDER BY article_table.created_time DESC LIMIT 10
    `)
    articles.forEach(article=>{
      let oDate=new Date(article.created_time*1000);
  
      article.created_time=`${oDate.getFullYear()}-${oDate.getMonth()+1}-${oDate.getDate()}`;
    });
  await ctx.render('www/index', {
    HTTP_ROOT,
    banners,
    catalogs,
    articles
  })
})
router.get('/list/:id/', async ctx=>{
  let {id}=ctx.params;
  let {HTTP_ROOT}=ctx.config;

  let rows=await ctx.db.query('SELECT * FROM catalog_table WHERE ID=?', [id]);
  let articles=await ctx.db.query(`
    SELECT
    *,
    article_table.title AS article_title,
    catalog_table.title AS catalog_title,
    article_table.ID AS article_ID
    FROM article_table
    LEFT JOIN catalog_table ON article_table.catalog_ID=catalog_table.ID
    WHERE article_table.catalog_ID=${id}
    ORDER BY article_table.created_time DESC LIMIT 10
  `);

  articles.forEach(article=>{
    let oDate=new Date(article.created_time*1000);

    article.created_time=`${oDate.getFullYear()}-${oDate.getMonth()+1}-${oDate.getDate()}`;
  });

  await ctx.render('www/list', {
    HTTP_ROOT,
    catalog_title: rows[0].title,
    articles
  });
});

router.get('/article/:id/', async ctx=>{
  let {id}=ctx.params;
  let {HTTP_ROOT}=ctx.config;

  let rows=await ctx.db.query("SELECT * FROM article_table WHERE ID=?", [id]);
  let article=rows[0];

  let oDate=new Date(article.created_time*1000);

  article.created_time=`${oDate.getFullYear()}-${oDate.getMonth()+1}-${oDate.getDate()}`;

  await ctx.render('www/article', {
    HTTP_ROOT,
    article
  });
});
module.exports = router.routes()