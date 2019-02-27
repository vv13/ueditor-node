const Router = require('koa-router');
const router = new Router();
const ueditorRoutes = require('./modules/ueditor');

ueditorRoutes(router);

module.exports = router;
