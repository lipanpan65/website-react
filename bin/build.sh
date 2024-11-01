#!/bin/bash

PROJECT_DIR="/Users/lipanpan/github/website-react/website"
DIST_DIR=""
SERVER_DIR="/opt/dist"
SERVER_USER="root"
SERVER_HOST="47.93.43.223"

# 将代码打包然后并压缩上传到项目目录中
build() {
  echo "开始打包前端项目..."
  cd "$PROJECT_DIR" || exit
  # source ~/.bashrc
  # source ~/.zshrc
  # source ~/.bash_profile
  # source ~/.profile
    # 直接加载 nvm
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  nvm use website
  pnpm install  # 安装项目依赖
  pnpm run build  # 运行打包命令

  # 检查上一个命令的退出状态
  if [ $? -eq 0 ]; then
    echo "打包完成，开始压缩..."
    DATE=$(date +%Y%m%d)  # 获取当前日期
    
    tar -czf "dist-$DATE.tar.gz" build  # 创建压缩文件
    echo "压缩文件创建完成，开始上传到服务器..."
    scp "dist-$DATE.tar.gz" "$SERVER_USER@$SERVER_HOST:$SERVER_DIR"
    echo "文件上传完成"
  else
    echo "打包失败，停止脚本执行"
    exit 1
  fi
}

build
