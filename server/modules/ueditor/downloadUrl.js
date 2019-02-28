const request = require('request');
const fs = require('fs');
const path = require('path');

// 创建多级目录
function mkdirs(dst) {
  if (fs.existsSync(dst)) {
    return;
  }
  mkdirs(path.dirname(dst));
  fs.mkdirSync(dst);
}

module.exports = (source, target) => {
  const baseDir = path.dirname(target);
  mkdirs(baseDir);
  return new Promise((resolve, reject) => {
    request(source)
      .on('error', err => {
        reject(err);
      })
      .on('response', () => {
        resolve(target);
      })
      .pipe(fs.createWriteStream(target));
  });
};
