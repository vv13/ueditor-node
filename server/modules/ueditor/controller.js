const path = require('path');
const config = require('./config');

const { getFileList, uploadFile, catchimageUpload } = require('./service');

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
  const { request } = ctx;
  const ActionType = ctx.query.action;
  const uplaodTypeSuffix = {
    uploadimage: 'img/',
    uploadfile: 'file/',
    uploadvideo: 'video/'
  };
  // 处理上传文件
  if (uplaodTypeSuffix[ActionType]) {
    const file_url = config.prefix + uplaodTypeSuffix[ActionType];
    const result = await uploadFile(file_url, ctx.req, {
      action: request.query.action,
      pictitle: request.body.pictitle,
      headers: ctx.headers
    });
    ctx.set('Content-Type', 'text/html');
    ctx.body = result;
  } else if (ActionType === 'catchimage') {
    // 处理粘贴网络图片上传
    const { source } = request.body
    ctx.body = await catchimageUpload(source)
  }
  next();
};
