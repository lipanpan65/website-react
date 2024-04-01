
#!/bin/bash

# 前端项目目录
PROJECT_DIR="/opt/website-react/website"

# 打包输出目录
BUILD_DIR="$PROJECT_DIR/build"

# 切换到 master 分支并忽略所有的修改
switch_to_master() {
  echo "切换到 master 分支并忽略所有的修改..."
  cd "$PROJECT_DIR" || exit
  git checkout master
  git reset --hard HEAD  # 重置到最新的提交，丢弃所有修改
}


# 打包命令
build() {
  echo "开始打包前端项目..."
  cd "$PROJECT_DIR" || exit
  source ~/.bashrc
  nvm use website
  npm install  # 安装项目依赖
  npm run build  # 运行打包命令
}

# 部署到服务器
deploy() {
  echo "开始部署前端项目..."
  # 这里假设你已经配置了服务器信息，例如服务器IP地址和SSH密钥
  # 替换下面的YOUR_SERVER_IP和YOUR_SERVER_USERNAME为你的实际服务器信息
  ssh YOUR_SERVER_USERNAME@YOUR_SERVER_IP << EOF
    cd /var/www/html  # 这里是你的服务器上的前端项目目录
    rm -rf *  # 清空原有文件
EOF
  scp -r "$BUILD_DIR"/* YOUR_SERVER_USERNAME@YOUR_SERVER_IP:/var/www/html  # 将打包好的文件拷贝到服务器
  echo "部署完成!"
}

# 执行打包和部署
build
# deploy



