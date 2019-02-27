const path = require('path');
const config = require('./config');

const { getFileList, uploadFile } = require('./service');

exports.getUeditorConfig = async (ctx, next) => {
  const { action } = ctx.query;
  if (action === 'config') {
    ctx.set('Content-Type', 'application/json');
    ctx.response.redirect('/ueditor/nodejs/config.json');
  } else if (action === 'listimage') {
    const root = path.join(__dirname, '../../static', config.prefix, 'img');
    ctx.body = await getFileList(root);
  }
  next();
};

exports.postUeditorUpload = async (ctx, next) => {
  const { request: req } = ctx;
  const ActionType = ctx.query.action;
  if (
    ActionType === 'uploadimage' ||
    ActionType === 'uploadfile' ||
    ActionType === 'uploadvideo'
  ) {
    let file_url = config.prefiox; //默认图片上传地址
    /*其他上传格式的地址*/
    if (ActionType === 'uploadimage') {
      file_url = config.prefix + 'img/';
    }
    if (ActionType === 'uploadfile') {
      file_url = config.prefix + 'file/';
    }
    if (ActionType === 'uploadvideo') {
      file_url = config.prefix + 'video/';
    }
    const result = await uploadFile(file_url, ctx.req, {
      action: req.query.action,
      pictitle: req.body.pictitle,
      headers: ctx.headers
    });
    ctx.set('Content-Type', 'text/html');
    ctx.body = result;
  }
  // koaUeditor(path.join(__dirname, 'static')
  next();
};
