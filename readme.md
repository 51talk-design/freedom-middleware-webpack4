### freedom-middleware-webpack4构建中间件

中间件统一管理了项目开发中大概95%以上的构建配置。在对项目构建时，中间件会自动合并项目中的webpack.config.js(**构建项目必须存在的webpack扩展约束文件**)文件，然后进行项目的构建。

[![npm](https://img.shields.io/npm/l/freedom-middleware-webpack2.svg)](LICENSE)
[![NPM Version](https://img.shields.io/npm/v/freedom-middleware-webpack2.svg)](https://www.npmjs.com/package/freedom-middleware-webpack2)
[![npm](https://img.shields.io/npm/dt/freedom-middleware-webpack2.svg)](https://www.npmjs.com/package/freedom-middleware-webpack2)

### Freedom-middleware-webpack4构建中间件支持构建的项目

- 使用less、sass、ts、vue、react、ejs,jade以及es6开发的项目
- 中间件生成的webpack.config.js：**允许开发者根据项目需要自行扩展构建配置或者覆盖中间件本身的配置**
- 中间件生成的.babelrc文件：**允许开发者自行定义babel相关构建配置**
- 中间件生成的tsconfig.json：**允许开发者自行定义ts编译选项**
- postcss.config.js：**允许开发者自行定义样式处理方式**

### Freedom-middleware-webpack4安装

```
npm install @51npm/freedom-middleware-webpack4
```

### Freedom-middleware-webpack4构建中间件使用

```js
var webpackBuild = require("freedom-middleware-webpack4");
(async function () {
  var params = {
    port: 9090,
    env: "dev",//环境变量，dev:开发环境；prod：生成环境
    srcDir:"/src",
    entryDir:"/entry",//编译入口目录，会跟src组装一起/src/entry
    publicPath: `//{域名}/oneTomany/0.0.1`,
    build: `build`,//生产环境prod构建的资源存放的目录，在dev环境中该值忽略
    proxy: {
      context: ["/api", "/auth","/award"],
      options: {
        target: 'http://localhost:8080'
      }
    }
  };
  await webpackBuild(params);
})();
```

### Freedom-middleware-webpack4构建中间件的参数说明

```js
{
  "root":"",//根目录，不写默认为process.cwd()
  "port":"本地环境dev启动的端口后",
  "env":"环境变量，dev:开发环境；prod：生成环境",
  "srcDir": "/src",// 源码目录，默认源码目录为：process.cwd()
  "entryDir":"/src/entry",//webpack编译入口目录，为srcDir源码目录中的相对目录，跟srcDir一起构成完成的编译目录
  "publicPath":"构建资源的替换路径，比如：css中的图片路径",
  "build":"生产环境prod构建的资源存放的目录，在dev环境中该值忽略",
  "proxy":{ //反向代理设置
    "context":["/api", "/auth","/award"],//要拦截的url
    "options":{ //设置代理端口
      "target": 'http://localhost:8080'	
    }
  }
}
```

**dev环境下，文件编译的目录存储于根目录下的__build目录**

### 备注

构建项目下必须要有webpack.config.js文件，配置(**webpack的配置格式**)如下:

```js
module.exports = function () {
  var extendConf = {
    plugins: [
      
    ],
    resolve: {
     
    },
    module: {
      rules: [
        
      ]
    }
  };
  return extendConf;
};
```

### 版本更新说明
| 发布时间 | 发布版本 | 发布功能 |
| -------- | -------- | -------- |
|          |          |          |



