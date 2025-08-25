# Makefile for Docker Development Environment

.PHONY: help dev build up down clean logs shell restart

# 默认目标
help:
	@echo "🚀 Docker开发环境管理"
	@echo ""
	@echo "可用命令:"
	@echo "  make dev     - 启动开发环境 (构建并运行)"
	@echo "  make build   - 构建Docker镜像"
	@echo "  make up      - 启动容器"
	@echo "  make down    - 停止并删除容器"
	@echo "  make clean   - 清理所有Docker资源"
	@echo "  make logs    - 查看容器日志"
	@echo "  make shell   - 进入容器shell"
	@echo "  make restart - 重启开发环境"
	@echo "  make help    - 显示此帮助信息"

# 检查Docker是否运行
check-docker:
	@if ! docker info > /dev/null 2>&1; then \
		echo "❌ Docker未运行，请先启动Docker"; \
		exit 1; \
	fi

# 启动开发环境
dev: check-docker
	@echo "🚀 启动Docker开发环境..."
	@echo "📦 构建Docker镜像..."
	docker-compose -f docker-compose.dev.yml build
	@echo "🔄 启动开发服务器..."
	docker-compose -f docker-compose.dev.yml up

# 构建镜像
build: check-docker
	@echo "📦 构建Docker镜像..."
	docker-compose -f docker-compose.dev.yml build

# 启动容器
up: check-docker
	@echo "🔄 启动开发服务器..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ 开发环境已启动！"
	@echo "🌐 访问地址: http://localhost:3000"

# 停止容器
down:
	@echo "🛑 停止Docker开发环境..."
	docker-compose -f docker-compose.dev.yml down

# 清理所有Docker资源
clean:
	@echo "🧹 清理Docker资源..."
	docker-compose -f docker-compose.dev.yml down --volumes --remove-orphans
	docker system prune -f

# 查看日志
logs:
	@echo "📋 查看容器日志..."
	docker-compose -f docker-compose.dev.yml logs -f

# 进入容器shell
shell:
	@echo "🐚 进入容器shell..."
	docker-compose -f docker-compose.dev.yml exec website-react-dev sh

# 重启开发环境
restart: down up
	@echo "🔄 开发环境已重启！"
