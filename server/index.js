const Koa = require('koa');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const router = require('./routes');

const app = new Koa();

app.use(bodyParser());
app.use(serve(path.join(__dirname, 'static')));
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
