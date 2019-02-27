const ueditor = require('./controller');

module.exports = router => {
  router.get('/ueditor/ue', ueditor.getUeditorConfig);
  router.post('/ueditor/ue', ueditor.postUeditorUpload);
};
