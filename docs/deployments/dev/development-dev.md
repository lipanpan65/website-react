# 开发环境部署

安装nvm
```
nvm install v20.10.0
nvm alias website v20.10.0
nvm use website
npm install pnpm -g
pnpm install
pnpm start
```
安装包
```
nvm use website
cd website 
pnpm install
```

基于docker部署前端代码
```
# 下载node镜像
docker pull node:20.10.0
# 下载centos镜像
docker pull centos:7.9.2009
下载镜像的名称 CentOS-7.9.2009-x86_64-DVD.iso
# 下载python镜像
docker pull python:3.9.6
# 下载mysql
docker pull mysql:8.1.0
```

进入centos镜像中
```shell

```
使用python运行python脚本
```shell

```
使用nginx运行html文件
```shell

```








# Windows 搭建
nvm install v20.10.0
nvm use v20.10.0
npx create-strapi-app@latest website-mock-server --quickstart
$ npx create-strapi-app@latest website-mock-server --quickstart
npm WARN exec The following package was not found and will be installed: create-strapi-app@4.21.0
Creating a quickstart project.
Creating a new Strapi application at D:\github\website-react\website\mock-server\website-mock-server.
Creating files.
- Installing dependencies:
Dependencies installed successfully.

Your application was created at D:\github\website-react\website\mock-server\website-mock-server.

Available commands in your project:

  npm run develop
  Start Strapi in watch mode. (Changes in Strapi project files will trigger a server restart)

  npm run start
  Start Strapi without watch mode.

  npm run build
  Build Strapi admin panel.

  npm run strapi
  Display all available commands.

You can start by doing:

  cd D:\github\website-react\website\mock-server\website-mock-server
  npm run develop

Running your Strapi application.

> website-mock-server@0.1.0 develop
> strapi develop

