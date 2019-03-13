
[GitHub地址](https://github.com/zhaoxuhui1122/document)

[演示地址](http://47.99.205.74/document/product)

```
name:admin  
password:123456
```

**一套可以直接发布产品原型、UI设计稿和在线编辑文档的平台。**

![image.png](http://smalleyes.oss-cn-shanghai.aliyuncs.com/1544169157858_6954.png)

[TOC]

# 目录
## 1.开发背景
目前入职的公司产品文档、UI设计稿、内部文件等相关文档，在公司内部流转主要依靠点对点传输，效率等，信息同步不及时。也有考虑使用蓝湖或磨刀等成熟产品，毕竟花钱的事儿，无人推动，索性自己开发一个简单的平台，用于发布产品文档、UI设计稿和一些内部文档，不支持协同开发。

## 2.开发理念
内部资源，平台内所有人均可共享，权限相关设置较少，只有两个地方有做权限区分

1. 除管理员身份外其他用户不能查看用户管理界面
2. 除管理员和文档创建者外不允许其他人删除文档

## 3.系统功能

### 产品文档发布
- 支持上传Axure等产品原型开发工具生成的html文件压缩包
- 支持自定义查看项目的入口页面
- 支持压缩包源文件下载

### UI设计稿发布
- 支持上传Sketch等UI设计工具工具生成的html文件压缩包
- 支持自定义查看项目的入口页面
- 支持压缩包源文件下载

###  内部文档发布
- 支持文档在线编辑发布（使用百度Ueditor开发）
- 支持编写markdown文档，支持多种代码块主题
- 支持markdown文档导出和导入
- 支持创建文件夹管理相关文档

## 4.使用的技术
### server
- node
- Ko2 + 相关npm包
- ES6
- pm2
- mongoose
- nodemon
- multer
- log4js
- node-unzip-2
- ...

### client
- vue全家桶
- iView
- 改造的ueditor富文本编辑器
- 自己开发的markdown编辑器

## 5.项目代码说明
### client

```
项目由vue-cli 2.x版本创建
...
|--electron  //electron配置文件
...
```

### server 服务端代码
**重要 ： 由于前台不提供用户注册功能，只能由管理员创建账户，启动项目时需要定义初始化管理员账号密码，配置地方在/config/config.js**

**默认用户名：root  密码 123456**

### 目录结构说明

```
|--config  //配置文件
|--logs //日志文件目录
|--meddleware  // 中间件
|--mongodb  // 数据库相关文件
|--router // 对外提供的接口
|--service
|--static  // 静态文件放置位置
|--tmp // 缓存文件夹，定时任务会定时清空
|--utils  // 封装的工具方法
|--views  // 页面文件，项目只提供接口，无需关注
|--server.js // 服务启动文件
|--index.js  // 项目启动文件
|--package.json

```
> 由于node并不完全支持ES规范，项目开发过程中为了使用ES语法，使用nodemon 去启动项目，实现项目的热更新，发布上线使用pm2发布



## 6.关于线上部署

1. 前端代码安装依赖打包，默认开启gzip压缩
2. 服务端代码由于使用了ES语法，使用pm2发布项目，不要直接使用node启动/server/server.js文件
3. 服务器部署，以nginx上为例

```

#user  nobody;
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    #tcp_nopush     on;
    #keepalive_timeout  0;
    keepalive_timeout  65;
    client_max_body_size 50m;
    #gzip配置
    gzip  on;
    gzip_min_length 1k; 
    gzip_comp_level 3; 
    gzip_types text/plain application/javascript application/x-javascript text/javascript text/xml text/css;
    gzip_disable "MSIE [1-6]\.";  
    gzip_vary on; 

    server {
        listen       80;
        server_name  47.99.205.74;
        # 如果使用history模式路由，参见vue-router官网配置
        root   /var/www/client/dist;
        index  index.html;
        location / {
            try_files $uri $uri/ /index.html;
        }
        # 对外提供的接口服务代理，如果不配置，需要将前端项目里的baseUrl修改，服务端支持跨域请求
        location /api/ {
           proxy_pass  http://localhost:8000/;
        }
        error_page 404   /404.html;
 
        location /404.html {
            alias /var/www/static/html/40.html;
        }
        error_page  500 501 502 503 504 /50x.html;

        location /50x.html {
            alias /var/www/static/html/50.html;
        }
    }
}


```

## 7.发布产品文档业务实现原理简介
> 分析Axure或者Sketch等工具导出的分享文档，都是生成相关的html文档，支持在浏览器打开查看，直接将文档放置在服务器上，请求对应的静态文件即可实现查看上传的文档

**实现步骤**
1. 新建一个项目
2. 进入项目编辑页面，填写项目名称，项目简介等信息
3. 在编辑页面上传一个产品文档压缩包（目前只支持zip格式），后台会对zip压缩包进行解压缩，并循环遍历里面存在的html文件，将html文件路径列表返回给前在台，此时文件和解压过的文件存储在缓存文件夹tmp内
4. 选中默认首页对应的html路径
5. 提交项目，服务端先将前一步存储在缓存文件夹内的压缩包和文件复制到静态文件夹static内，删除缓存文件，解析对应的数据，存入数据库。（如果一次编辑多次选中zip压缩包，数据提交时后台只会删除一个对应的压缩包，其他的垃圾文件不会立即删除，会在定时任务里每天定时清除文件夹）
6. 结束
![image](https://smalleyes.oss-cn-shanghai.aliyuncs.com/2017-04-12.png)

## 8.关于项目内使用的编辑器简介
1. 富文本编辑器，使用的百度Ueditor二次开发，定制UI界面，配置根据实际场景定制，集成了秀米排版

![image.png](http://smalleyes.oss-cn-shanghai.aliyuncs.com/1544167561948_765.png)

2. markdown编辑器，自己开发的一款富文本编辑器的简化版，支持常见的markdown语法，内置多款代码块主题，详细介绍可参见：https://github.com/zhaoxuhui1122/vue-markdown

![image.png](http://smalleyes.oss-cn-shanghai.aliyuncs.com/1544167974158_9062.png)

## 9.基于Electron打包为桌面客户端
开发客户端前一定要考虑清除是否真的需要，再决定技术选型，架构搭建


个人对这一块一知半解，也是项目开发完成才开始考虑做客户端的，如果一开始就需要做客户端，可以参见成熟的架构，例如electron-vue等，另外此处打包出来的文件过大，还没仔细检查

```

相关配置位于/client/electron下

每个文件还内均有对应的配置备注

打包时注意electron和相关依赖的版本，需要指定版本

以打包mac系统的.app为例
```

```
# "build:mac": "rimraf ./build/mac && electron-packager . document --platform=darwin --out ./build/mac --arch=x64 --app-version=0.0.1 --overwrite --electron-version=4.0.8   --ignore=node_modules --icon=./static/logo.ico"

# rimraf ./build/mac  //删除上次打包生成的文件
# electron-packager // 使用electron-packager进行打包
# document  //打包出来的我文件名称
# --out ./build/mac // 输出目录
# --arch=x64 // 平台
# --app-version=0.0.1 // 版本号
# --overwrite  // 覆盖
# --electron-version=4.0.8 //指定打包的electron版本，很关键
# --ignore=node_modules // 忽略node_modules
# --icon=./static/logo.ico // 制定打包icon

```

```

注：此处打包的app，为了方便打包，入口文件直接使用的线上环境的，此处可改为本地文件，打包文件时相应的数据请求地址均需要修改

win.loadURL('http://http://47.99.205.74');
```
## 10.阿里云ECS搭建nodejs开发环境简介

### 安装nvm 及 node
1.安装git
```
yum install git
```
2.安装nvm
```
git clone https://github.com/cnpm/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
```
3.激活nvm
```
echo ". ~/.nvm/nvm.sh" >> /etc/profile
source /etc/profile
```
4.查看远程版本
```
nvm list-remote
```
5.安装指定版本
```
nvm install v10.8.0
```
6.使用指定版本
```
nvm use v10.8.0
```
7.设置默认node版本
```
nvm alias default v10.8.0
```
8.安装cnpm
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
### 安装pm2

```
npm install pm2 -g
```



### 安装nginx

```
cd /usr/local
```

```
yum -y install pcre pcre-devel
```

```
 yum install -y zlib-devel
```

下载nginx压缩包
```
wget http://nginx.org/download/nginx-1.9.9.tar.gz
```
解压、重命名
```
tar -xvzf nginx-1.9.9.tar.gz

mv nginx-1.9.9 nginx
```
安装
```
 cd nginx 
 ./configure --prefix=/usr/local/nginx
 make && make install
```

```
// 运行

/usr/local/nginx/sbin/nginx
```

此时nginx命令不是全局的，如果想方便使用，将nginx命令配置到全局
```
cd /etc
vi /etc/profile

```
 找到 export PATH USER LOGNAME MAIL HOSTNAME HISTSIZE INPUTRC这一行，在其下一行添加一行：


```
export PATH=$PATH:/usr/local/nginx/sbin
```

保存文件

```
source /etc/profile
```
执行nginx -h 查看


此时输入ip查看，如果无法访问,修改服务器安全组规则，放开http、https等端口

### 安装mongodb

下载

```
wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.4.9.tgz
```
解压
```
tar -xvzf mongodb-linux-x86_64-3.4.9.tgz 
```
重命名

```
mv mongodb-linux-x86_64-3.4.9 mongodb
```

配置命令到全局
```
vi /etc/profile
// 增加
export PATH=$PATH:/usr/local/mongodb/bin

source /etc/profile
```
启动mongod

```
mongod --dbpath=/data/db --fork --logpath=/data/logs

```

### 安装zsh、oh-my-zsh
查看系统当前的shell

```
echo $SHELL
///bin/bash
```


```
yum -y install zsh

chsh -s /bin/zsh
```
查看系统当前的shell

```
echo $SHELL
//bin/bash 未改变
重启服务器
```
安装oh-my-zsh

```
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh
```

    