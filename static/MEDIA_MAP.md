# 媒体资源映射表（最终版）

> 以下映射关系已全部执行完毕，记录存档。

---

## 一、成员头像

| # | 姓名 | imgSeed | 头像路径 | 影响页面 |
|---|------|---------|---------|---------|
| 1 | 何祥鹏 | he → | `/何祥鹏.png` | Members.tsx, Profile.tsx |
| 2 | 余佳 | yu → | `/余佳.png` | Members.tsx, Profile.tsx |
| 3 | 张凯峰 | zhang → | `/张凯峰.png` | Members.tsx, Profile.tsx |
| 4 | 牛青峰 | niu → | `/牛青峰 (2).png` | Members.tsx, Profile.tsx |
| 5 | 段利利 | duan → | `/段利利.jpeg` | Members.tsx, Profile.tsx |
| 6 | 袁丹琴 | yuan → | `/袁丹琴.png` | Members.tsx, Profile.tsx |

## 二、视频资源

| # | 视频路径 | 缩略图 | 对应 id | 影响页面 |
|---|---------|--------|--------|---------|
| 1 | `/视频.mp4` | `/日常.jpeg` | 1 | CoreDisplay, VideoDetail |
| 2 | `/视频2.mp4` | `/日常.jpg` | 2 | CoreDisplay, VideoDetail |
| 3 | `/视频3.mp4` | `/日常照.jpeg` | 3 | CoreDisplay, VideoDetail |
| 4 | `/视频4 .mp4` | `/日常 (2).jpeg` | 4 | CoreDisplay, VideoDetail |

## 三、日常照片分配

### 时间轴图片（DataViz.tsx）

| # | 图片路径 | 时间轴事件 |
|---|---------|-----------|
| 1 | `/日常 (2).jpg` | 小组成立决议 (meeting) |
| 2 | `/日常 (3).jpg` | 第一次团建翻车 (camping) |
| 3 | `/日常 (4).jpg` | 项目V1上线 (server) |
| 4 | `/日常 (5).jpg` | 集体熬夜修BUG (bug) |
| 5 | `/日常 (6).jpg` | 版本重构完成 (cafe) |

### 总结封面（CoreDisplay.tsx）

| # | 图片路径 | 总结 id |
|---|---------|--------|
| 1 | `/日常 (7).jpeg` | 1 |
| 2 | `/大合照.jpeg` | 2 |
| 3 | `/大合照2.jpeg` | 3 |

### 帖子封面（Profile.tsx）

循环使用所有日常照片和大合照，共 12 张。

## 四、首页大合照（Home.tsx）

| # | 图片路径 | 位置 |
|---|---------|------|
| 1 | `/大合照.jpeg` | 首页"团队瞬间"区域 |
| 2 | `/大合照2.jpeg` | 首页"团队瞬间"区域 |

## 五、周总结文章（SummaryDetail.tsx）

| # | 作者 | docx 来源 | summary id |
|---|------|----------|-----------|
| 1 | 何祥鹏 | `static/周总结/工作总结-何祥鹏.docx` | 1 |
| 2 | 余佳 | `static/周总结/工作总结-余佳.docx` | 2 |
| 3 | 张凯峰 | `static/周总结/工作总结-张凯峰.docx` | 3 |
| 4 | 段利利 | `static/周总结/工作总结-段利利.docx` | 4 |
| 5 | 牛青峰 | `static/周总结/工作总结-牛青峰 .docx` | 5 |
| 6 | 袁丹琴 | `static/周总结/工作总结-袁丹琴.docx` | 6 |

## 六、基础设施变更

| 文件 | 变更内容 |
|------|---------|
| `vite.config.ts` | 新增 `publicDir: 'static'`，使 static 目录文件可直接通过 `/` 路径访问 |
| `VideoDetail.tsx` | 模拟播放器改为真实 `<video>` 元素，保留全部控制功能 |
