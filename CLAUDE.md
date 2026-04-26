# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Saturday Team" 小组博客系统的前端高保真原型，基于 React 19 + Vite + Tailwind CSS v4 构建。起源于 Google AI Studio 模板，使用 HashRouter 的 SPA 应用，包含音乐播放器、互动弹幕墙、数据可视化、成员展示等功能模块。

## Common Commands

```bash
npm install        # 安装依赖
npm run dev        # 启动开发服务器 (端口 3000, 监听 0.0.0.0)
npm run build      # 生产构建 → dist/
npm run preview    # 预览生产构建
npm run lint       # TypeScript 类型检查 (tsc --noEmit)
npm run clean      # 清理 dist 目录
```

## Environment Setup

复制 `.env.example` 为 `.env.local`，需要配置：
- `GEMINI_API_KEY` — Gemini API 密钥（AI Studio 运行时自动注入）
- `VITE_AMAP_KEY` / `VITE_AMAP_SECURITY_CODE` — 高德地图 API（用于 AmapContainer 组件）

## Architecture

### Provider Hierarchy
```
ThemeProvider → AuthProvider → HashRouter → Routes → Layout (Outlet)
```

### Routing (HashRouter)
- `/` — Home 首页
- `/core` — CoreDisplay 核心展示
- `/video/:id` — VideoDetail 视频详情
- `/summary/:id` — SummaryDetail 总结详情
- `/interactive` — Interactive 互动体验
- `/data` — DataViz 数据可视化
- `/members` — Members 成员阵地
- `/profile/:id` — Profile 个人资料
- `/admin` — Management 管理后台
- `/me` — UserCenter 用户中心

### Key Modules
- **AuthContext** (`src/lib/AuthContext.tsx`) — 模拟认证系统，使用 localStorage 持久化。管理员凭据：`admin@group.com` / `admin`，任意 `@` 邮箱登录为普通用户。
- **ThemeProvider** (`src/components/ThemeProvider.tsx`) — 日/夜双主题切换，通过 `dark` class 控制样式。自定义 `useTheme()` hook。
- **Layout** (`src/components/layout/Layout.tsx`) — 全局布局壳，包含导航栏、页面转场动画（motion）、底部浮动音乐播放器。音乐播放器使用 `idb-keyval` 存储自定义音轨 blob，通过 `sync_music_tracks` 自定义事件同步。
- **Theme System** (`src/index.css`) — CSS 自定义属性驱动的双主题系统。`glass-card`、`neon-text-blue`、`neon-box-pink` 等工具类定义在新布鲁特主义风格中。Tailwind v4 使用 `@theme` 定义自定义颜色和动画。

### Tech Stack Notes
- **Tailwind CSS v4** — 使用 `@tailwindcss/vite` 插件和 `@theme` 指令，非传统 `tailwind.config.js` 配置方式
- **motion** (framer-motion) — 页面转场和 UI 动画库（包名 `motion/react`）
- **recharts** — 数据可视化图表
- **@amap/amap-jsapi-loader** — 高德地图集成
- **@dnd-kit** — 拖拽排序功能
- **idb-keyval** — IndexedDB 轻量封装，用于存储音乐文件 blob
- **react-router-dom v7** — 客户端路由

### Path Alias
- `@/*` 映射到项目根目录（在 `vite.config.ts` 和 `tsconfig.json` 中均配置）

### Static Assets
`static/` 目录存放团队照片、视频等媒体资源，直接在页面中引用。
