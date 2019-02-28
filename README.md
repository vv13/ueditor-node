## 特性
服务实现的后端规范：
- GET action=config
- GET action=listimage
- POST action=uploadiamge
- POST action=uploadfile
- POST action=uploadvideo


TODO：
- [x] 图片、附件、视屏上传
- [x] 上传图片列表浏览
- [ ] 粘贴上传

## 引导
### 安装依赖
```
cd server && npm i
```

### 开发
```
npm run dev
```

### 访问

demo路径为：`http://localhost:3000/ueditor`

## 实现思路
### 构建最新版本ueditor
由于官网停止维护，前端资源不是最新的，因此我们通过clone主仓库，并手动构建出最新的前端版本：
```sh
git clone git@github.com:fex-team/ueditor.git
cd ueditor && npm i && npx grunt default
```

这里我们将打包好的`/dist/utf8-php`目录放入静态资源文件夹重命名为`ueditor`，然后在前端中引入即可：
```
  <script type="text/javascript" charset="utf-8" src="/ueditor/ueditor.config.js"></script>
  <script type="text/javascript" charset="utf-8" src="/ueditor/ueditor.all.min.js"> </script>
```

### 配置ueditor编辑器
打开`static/ueditor/ueditor.config.js`，找到下面的配置字段：
```
  // 它所表示的含义是：以编辑器实例化页面为当前路径，指向编辑器资源文件（即dialog等文件夹）的路径。
  UEDITOR_HOME_URL: URL,
  // 规定后端的路由地址，编辑器与后端交互的GET/POST都会通过这一个路径与后端进行数交互。
  serverUrl: URL + "php/controller.php"
```
 
在上一步，我们将编辑器资源存放到了前端的静态资源文件夹`/ueditor/`目录下，因此`UEDITOR_HOME_URL`也设置为这个绝对路径即可，还需要配置后端路由，在这里就规定为：`/ueditor/ue`（当然你可以设定任何值），那么应该进行如下配置：
```
  UEDITOR_HOME_URL: '/ueditor/',
  serverUrl: '/ueditor/ue/'
```

其他配置文件请根据个人喜好进行配置。

### 静态资源服务
为了方便演示，我们首先通过koa-static配置一个静态资源服务，并存放下述文件夹：
```
static
├── ueditor，前端静态资源
└── upload，上传文件夹加入.gitignore
```

到了这一步，当启动服务时，希望你能正常访问：：![](./assets/ui.png)

### 服务端配置
项目采用了Koa实现了相关上传服务的配置，所有路由都应该参照编辑器的请求规范进行配置，若用不到相关的功能，如涂鸦等，那后端无需进行实现相关接口，前端修改`ueditor.config.js`将该功能隐藏即可。

编辑器初始化成功后会向服务端发送一个请求：`GET serverUrl?action=config`，用于检测服务器是否正常运行，服务端需要返回相关一个用于规定后端的配置文件，此服务返回的模板文件路径为：`/static/ueditor/nodejs/config.js`，配置文件文档[在此](http://fex.baidu.com/ueditor/#server-config)。


### 后端请求规范实现
#### GET serverUrl?action=config
上面已经讲过了，核心逻辑为：
```
  ctx.response.redirect('/ueditor/nodejs/config.json');
```

#### POST /ueditor/ue?action=uploadimage
```
请求体(Form data)：
  upfile: (binary)
  type: ajax

返回格式：
{
    "state": "SUCCESS",
    "url": "upload/demo.jpg",
    "title": "demo.jpg",
    "original": "demo.jpg"
}
```

上传图片的请求，当拖拽、图片上传、图片批量上传都会调用此接口。

#### POST /ueditor/ue?action=uploadvideo
```
同 POST /ueditor/ue?action=uploadimage
```
上传视频。
#### POST /ueditor/ue?action=uploadfile
```
同 POST /ueditor/ue?action=uploadimage
```
上传附件。

#### GET /ueditor/ue?action=listimage&start=0&size=20
```
返回格式：
{
    "state": "SUCCESS",
    "list": [{
        "url": "upload/1.jpg"
    }, {
        "url": "upload/2.jpg"
    }, ],
    "start": 20,
    "total": 100
}
```
点击多图上传 -> 在线管理，可选择已上传好的图片。
