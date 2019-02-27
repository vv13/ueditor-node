const Busboy = require('busboy');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const uuidv1 = require('uuid/v1');
const cfg = require('./config');

function getFileList(target) {
  const list = [];
  const list_dir = cfg.prefix + 'img/';
  return new Promise((resolve, reject) => {
    const files = fs.readdirSync(target);
    let i = 0;
    files.forEach(function(file) {
      const filetype = 'jpg,png,gif,ico,bmp';
      const tmplist = file.split('.');
      const _filetype = tmplist[tmplist.length - 1];
      if (filetype.indexOf(_filetype.toLowerCase()) >= 0) {
        list[i] = {
          url: list_dir + file
        };
      }
      i++;
      // send file name string when all files was processed
      if (i === files.length) {
        resolve({
          state: 'SUCCESS',
          list: list,
          start: 1,
          total: files.length
        });
      }
    });
  });
}

function uploadFile(img_url, req, config = {}) {
  if (
    config.action === 'uploadimage' ||
    config.action === 'uploadfile' ||
    config.action === 'uploadvideo'
  ) {
    const busboy = new Busboy({
      headers: config.headers
    });
    return new Promise((resolve, reject) => {
      const ueditorInfo = {};
      busboy.on('file', function(
        fieldname,
        file,
        filename,
        encoding,
        mimetype
      ) {
        Object.assign(ueditorInfo, {
          fieldname,
          file,
          filename,
          encoding,
          mimetype
        });

        const tmpdir = path.join(os.tmpdir(), path.basename(filename));
        const name = uuidv1() + path.extname(tmpdir);
        const dest = path.join(cfg.static_url, img_url, name);
        file.pipe(fs.createWriteStream(tmpdir));
        file.on('end', async () => {
          await fs.move(tmpdir, dest);
          resolve({
            url: path.join(img_url, name).replace(/\\/g, '/'),
            title: config.pictitle,
            original: filename,
            state: 'SUCCESS'
          });
        });
      });
      req.pipe(busboy);
    });
  }
}
module.exports = {
  getFileList,
  uploadFile
};
