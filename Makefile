# Makefile for Docker Development Environment

.PHONY: help check-docker check-nvm setup-node install dev start build test docker-dev docker-build docker-up docker-stop docker-clean docker-logs docker-shell docker-restart update-deps regenerate-lockfile

# 默认目标
help:
	@echo "🚀 React开发环境管理"
	@echo ""
	@echo "本地开发命令:"
	@echo "  make setup-node     - 设置Node.js环境 (nvm + pnpm)"
	@echo "  make install        - 安装项目依赖"
	@echo "  make dev            - 启动本地开发服务器"
	@echo "  make start          - 启动本地开发服务器 (同dev)"
	@echo "  make build          - 构建生产版本"
	@echo "  make test           - 运行测试"
	@echo ""
	@echo "Docker 相关命令:"
	@echo "  make docker-dev     - 启动Docker开发环境 (构建并运行)"
	@echo "  make docker-build   - 构建Docker镜像"
	@echo "  make docker-up      - 启动容器"
	@echo "  make docker-stop    - 停止并删除容器"
	@echo "  make docker-clean   - 清理所有Docker资源"
	@echo "  make docker-logs    - 查看容器日志"
	@echo "  make docker-shell   - 进入容器shell"
	@echo "  make docker-restart - 重启开发环境"
	@echo ""
	@echo "其他命令:"
	@echo "  make update-deps           - 更新项目依赖"
	@echo "  make regenerate-lockfile   - 重新生成pnpm-lock.yaml"
	@echo "  make help                  - 显示此帮助信息"
	@echo ""
	@echo "💡 快速开始:"
	@echo "  1. make setup-node  # 首次使用，设置Node环境"
	@echo "  2. make install     # 安装依赖"
	@echo "  3. make dev         # 启动开发服务器"
	@echo ""
	@echo "📋 要求:"
	@echo "  - Node.js v20.10.0 (推荐使用nvm管理)"
	@echo "  - pnpm包管理器"
	@echo "  - 后端服务运行在 http://127.0.0.1:9798"

# 检查nvm是否可用
check-nvm:
	@if ! command -v nvm > /dev/null 2>&1; then \
		echo "❌ nvm未安装，请先安装nvm"; \
		echo "📖 安装地址: https://github.com/nvm-sh/nvm"; \
		exit 1; \
	fi

# 设置Node.js环境
setup-node: check-nvm
	@echo "🔧 设置Node.js环境..."
	@echo "📦 安装Node.js v20.10.0..."
	nvm install v20.10.0
	@echo "🔖 创建website别名..."
	nvm alias website v20.10.0
	@echo "✅ Node.js环境设置完成！"
	@echo "💡 请运行 'nvm use website' 切换到项目Node版本"

# 安装项目依赖
install:
	@echo "📦 安装项目依赖..."
	@echo "🔄 检查Node版本..."
	@node --version
	@echo "🔄 检查pnpm..."
	@if ! command -v pnpm > /dev/null 2>&1; then \
		echo "📦 安装pnpm..."; \
		npm install pnpm -g; \
	fi
	@echo "📂 进入website目录并安装依赖..."
	cd website && pnpm install
	@echo "✅ 依赖安装完成！"

# 启动本地开发服务器
dev:
	@echo "🚀 启动React本地开发服务器..."
	@echo "🌐 开发服务器将在 http://localhost:3000 启动"
	@echo "🔄 代理后端API到 http://127.0.0.1:9798"
	@if ! command -v nvm > /dev/null 2>&1; then \
		echo "⚠️  nvm未安装，使用系统默认Node版本"; \
		cd website && pnpm start; \
	else \
		cd website && bash -c "source ~/.nvm/nvm.sh && nvm use website 2>/dev/null || nvm use node && pnpm start"; \
	fi

# start命令别名
start: dev

# 构建生产版本
build:
	@echo "🏗️ 构建生产版本..."
	@if ! command -v nvm > /dev/null 2>&1; then \
		cd website && pnpm build; \
	else \
		cd website && bash -c "source ~/.nvm/nvm.sh && nvm use website 2>/dev/null || nvm use node && pnpm build"; \
	fi
	@echo "✅ 构建完成！输出目录: website/build"

# 运行测试
test:
	@echo "🧪 运行测试..."
	@if ! command -v nvm > /dev/null 2>&1; then \
		cd website && pnpm test; \
	else \
		cd website && bash -c "source ~/.nvm/nvm.sh && nvm use website 2>/dev/null || nvm use node && pnpm test"; \
	fi

# 检查Docker是否运行
check-docker:
	@if ! docker info > /dev/null 2>&1; then \
		echo "❌ Docker未运行，请先启动Docker"; \
		exit 1; \
	fi

# 启动开发环境
docker-dev: check-docker
	@echo "🚀 启动Docker开发环境..."
	@echo "📦 构建Docker镜像..."
	docker-compose -f docker-compose.dev.yml build
	@echo "🔄 启动开发服务器..."
	docker-compose -f docker-compose.dev.yml up

# 构建镜像
docker-build: check-docker
	@echo "📦 构建Docker镜像..."
	docker-compose -f docker-compose.dev.yml build

# 启动容器
docker-up: check-docker
	@echo "🔄 启动开发服务器..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ 开发环境已启动！"
	@echo "🌐 访问地址: http://localhost:3000"

# 停止容器
docker-stop:
	@echo "🛑 停止Docker开发环境..."
	docker-compose -f docker-compose.dev.yml down

# 清理所有Docker资源
docker-clean:
	@echo "🧹 清理Docker资源..."
	docker-compose -f docker-compose.dev.yml down --volumes --remove-orphans
	docker system prune -f

# 查看日志
docker-logs:
	@echo "📋 查看容器日志..."
	docker-compose -f docker-compose.dev.yml logs -f

# 进入容器shell
docker-shell:
	@echo "🐚 进入容器shell..."
	docker-compose -f docker-compose.dev.yml exec website-react-dev sh

# 重启开发环境
docker-restart: docker-stop docker-up
	@echo "🔄 开发环境已重启！"

# 更新依赖
update-deps:
	@echo "📦 更新项目依赖..."
	cd website && pnpm install
	@echo "✅ 依赖更新完成！"

# 重新生成lockfile
regenerate-lockfile:
	@echo "🔄 重新生成pnpm-lock.yaml..."
	cd website && rm -f pnpm-lock.yaml && pnpm install
	@echo "✅ lockfile重新生成完成！"

