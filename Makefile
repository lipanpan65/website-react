# Makefile for Docker Development Environment

.PHONY: help check-docker docker-dev docker-build docker-up docker-stop docker-clean docker-logs docker-shell docker-restart update-deps regenerate-lockfile

# 默认目标
help:
	@echo "🚀 Docker开发环境管理"
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

