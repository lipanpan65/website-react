

# 将代码打包然后并压缩上传到项目目录中
build() {
  echo "开始打包前端项目..."
  cd "$PROJECT_DIR" || exit
  # source ~/.bashrc
  nvm use website
  pnpm install  # 安装项目依赖
  pnpm run build  # 运行打包命令
}

