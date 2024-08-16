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
pnpm start
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
```
$ npx create-strapi-app@latest website-mock-server --quickstart --ts
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

- Building build context

[INFO] Including the following ENV variables as part of the JS bundle:
    - ADMIN_PATH
    - STRAPI_ADMIN_BACKEND_URL
    - STRAPI_TELEMETRY_DISABLED
√ Building build context (243ms)
- Creating admin
√ Creating admin (21918ms)
- Loading Strapi
[2024-03-22 11:59:52.645] info: The Users & Permissions plugin automatically generated a jwt secret and stored it in .env under the name JWT_SECRET.
√ Loading Strapi (4360ms)
- Generating types
√ Generating types (266ms)
- Compiling TS
- Cleaning dist dir D:/github/website-react/website/mock-server/website-mock-server/dist
√ Cleaning dist dir (3ms)
√ Compiling TS (2077ms)

 Project information

┌────────────────────┬──────────────────────────────────────────────────┐
│ Time               │ Fri Mar 22 2024 11:59:56 GMT+0800 (中国标准时间) │
│ Launched in        │ 6725 ms                                          │
│ Environment        │ development                                      │
│ Process PID        │ 2556                                             │
│ Version            │ 4.21.0 (node v18.19.1)                           │
│ Edition            │ Community                                        │
│ Database           │ sqlite                                           │
└────────────────────┴──────────────────────────────────────────────────┘

 Actions available

One more thing...
Create your first administrator 💻 by going to the administration panel at:

┌─────────────────────────────┐
│ http://localhost:1337/admin │
└─────────────────────────────┘

[2024-03-22 11:59:57.280] http: GET /admin (19 ms) 200
[2024-03-22 11:59:57.309] http: GET /admin/runtime~main.4f263e8f.js (10 ms) 200
[2024-03-22 11:59:57.310] http: GET /admin/main.e32f035d.js (2 ms) 200
[2024-03-22 11:59:57.760] http: GET /admin/project-type (2 ms) 200
[2024-03-22 11:59:57.791] http: GET /admin/6189.6797a22c.chunk.js (3 ms) 200
[2024-03-22 11:59:57.801] http: GET /admin/7410.83c270e5.chunk.js (2 ms) 200
[2024-03-22 11:59:57.801] http: GET /admin/1047.7ebbe146.chunk.js (1 ms) 200
[2024-03-22 11:59:57.802] http: GET /admin/7542.bd5f01f8.chunk.js (3 ms) 200
[2024-03-22 11:59:57.810] http: GET /admin/6895.d959e639.chunk.js (6 ms) 200
[2024-03-22 11:59:57.810] http: GET /admin/159.4629e192.chunk.js (4 ms) 200
[2024-03-22 11:59:57.811] http: GET /admin/4495.be011698.chunk.js (4 ms) 200
[2024-03-22 11:59:57.814] http: GET /admin/4306.4432d33c.chunk.js (1 ms) 200
[2024-03-22 11:59:57.857] http: GET /admin/init (6 ms) 200

$ nvm ls
    20.10.0
  * 18.19.1 (Currently using 64-bit executable)
    16.19.0
    14.17.6
    10.15.3

```
