## 构建最新版本ueditor
由于官网停止维护，前端资源不是最新的，因此我们通过clone主仓库，并手动构建出最新的前端版本：
```sh
git clone git@github.com:fex-team/ueditor.git
cd ueditor && npm i && npx grunt default
```

这里我们将打包好的`/dist/utf8-php`目录放入静态资源文件夹重命名为`ueditor`，然后在前端中引入即可。
