#!/bin/bash

PROJECT_DIR="/Users/lipanpan/github/website-react/website"
DIST_DIR=""
SERVER_DIR="/opt/dist"
SERVER_USER="root"
SERVER_HOST="47.93.43.223"
REMOTE_WEBSITE_DIR="/opt/website-react/website"
BUILD_DIR="$REMOTE_WEBSITE_DIR/build"

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

    # 删除扩展属性（如果有的话），确保归档中不包含 macOS 特有的扩展属性
    # echo "删除文件扩展属性..."
    # find build -type f -exec xattr -c {} \;  # 删除所有文件的扩展属性

    tar --no-xattrs -czf "dist-$DATE.tar.gz" -C build . # 创建压缩文件
    echo "压缩文件创建完成，开始上传到服务器..."
    scp "dist-$DATE.tar.gz" "$SERVER_USER@$SERVER_HOST:$SERVER_DIR"
    echo "文件上传完成"
    deploy "$DATE"  # 上传完成后调用部署函数
  else
    echo "打包失败，停止脚本执行"
    exit 1
  fi
}

# 部署函数，检查旧的 tar.gz 文件，解压最新的文件
deploy() {
  DATE=$1
  echo "开始部署..."

  ssh "$SERVER_USER@$SERVER_HOST" << EOF
    cd "$REMOTE_WEBSITE_DIR" || exit
    echo "查看当前目录的文件和"
    ls -l
    echo "-----------------"
    # 检查并创建 build 目录（如果目录不存在）
    if [ ! -d "$BUILD_DIR" ]; then
      echo "build 目录不存在，正在创建..."
      mkdir -p "$BUILD_DIR"  # 创建 build 目录
    else
      echo "build 目录已存在，正在清空..."
      rm -rf "$BUILD_DIR"/*  # 清空 build 目录下的所有文件
    fi
    
    # 修复权限问题，确保当前用户可以写入 build 目录
    echo "修复 build 目录权限..."
    sudo chmod -R 775 "$BUILD_DIR"  # 给 build 目录添加写权限

    # 判断是否存在以前的 dist-日期.tar.gz 文件
    OLD_TAR_FILE="\$(ls dist-*.tar.gz 2>/dev/null | grep -v dist-$DATE.tar.gz)"
    if [ -n "\$OLD_TAR_FILE" ]; then
      echo "检测到旧的压缩包，移动到 /tmp 目录：\$OLD_TAR_FILE"
      mv "\$OLD_TAR_FILE" /tmp/  # 将旧包移动到 /tmp 目录
    else
      echo "没有旧的压缩包"
    fi
  
    # 解压最新的 dist-$DATE.tar.gz 文件到 build 目录，忽略扩展属性
    echo "解压 dist-$DATE.tar.gz 到 $BUILD_DIR..."
    tar --no-xattrs -xzf "$SERVER_DIR/dist-$DATE.tar.gz" -C "$BUILD_DIR"  # 解压到 build 目录
    rm "$SERVER_DIR/dist-$DATE.tar.gz"  # 解压后删除压缩包
    echo "部署完成，网站已更新"
EOF
}

build
