# 智慧答题 QuizMaster

基于 Word 文档智能解析的在线答题应用，支持选择题与填空题，提供即时反馈与成绩分析。

## 1. How to Run

### 使用 Docker（推荐）

```bash
docker-compose up --build -d
```

访问 http://localhost:8081

### 本地开发

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:8081

### 构建生产版本

```bash
cd frontend
npm install
npm run build
npm run preview
```

## 2. Services

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端应用 | http://localhost:8081 | 答题应用主页 |

## 3. 测试账号

本项目为纯前端应用，无登录系统，无需测试账号。

## 4. 题目内容

根据指定文件夹中的Word文档内容，开发一个整合选择题和填空题的单页面HTML答题应用。该应用需满足以下要求：
1. 功能完整性：实现题目展示、选项选择、答案填写、答题进度跟踪、提交答案和成绩计算功能
2. 响应式设计：确保在手机、平板和电脑等多种设备上均有良好的显示效果和用户体验
3. 交互体验：添加适当的动画效果、表单验证和即时反馈机制
4. 数据处理：能够正确解析Word文档中的题目结构、选项内容和答案信息
5. 兼容性：支持主流现代浏览器，包括Chrome、Firefox、Safari和Edge的最新版本
6. 性能要求：页面加载时间不超过3秒，操作响应延迟不超过200毫秒
7. 可访问性：符合WCAG 2.1 AA级标准，确保键盘导航和屏幕阅读器兼容性

应用应包含以下核心组件：题目导航区、题目展示区、答题区域、提交按钮和结果反馈区。确保界面简洁直观，操作流程符合用户习惯，便于各类用户快速上手使用。

## 5. 项目结构

```
label-00691/
├── frontend/                  # 前端应用
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # 基础 UI 组件（Button, ProgressBar, Toast, Icon）
│   │   │   └── business/      # 业务组件（FileUploader, QuizNav, ChoiceQuestion 等）
│   │   ├── composables/       # 组合式函数（useToast, useTimer）
│   │   ├── stores/            # Pinia 状态管理（quiz store）
│   │   ├── styles/            # 全局样式 + Design Tokens
│   │   ├── types/             # TypeScript 类型定义
│   │   ├── utils/             # 工具函数（Word 文档解析器）
│   │   ├── data/              # 内置示例题库数据
│   │   ├── App.vue            # 根组件
│   │   └── main.ts            # 入口文件
│   ├── public/
│   │   └── samples/           # 示例 Word 文档（用于测试导入功能）
│   ├── Dockerfile             # 容器构建配置
│   ├── nginx.conf             # Nginx 配置
│   ├── package.json           # 依赖管理
│   ├── vite.config.ts         # Vite 配置
│   ├── tailwind.config.ts     # Tailwind 配置
│   └── tsconfig.json          # TypeScript 配置
├── docs/
│   └── project_design.md      # 项目设计文档
├── docker-compose.yml         # 容器编排
├── .gitignore                 # Git 忽略规则
├── README.md                  # 项目说明（本文件）
└── draft.md                   # 项目总结
```

## 6. 示例文档

项目提供了示例 Word 文档用于测试导入功能，位于 `frontend/public/samples/` 目录：

| 文件 | 说明 |
|------|------|
| `示例试卷-计算机基础.docx` | 标准格式试卷（4 道选择题 + 4 道填空题），可直接上传测试 |
| `示例试卷-计算机基础.txt` | 纯文本版本，展示文档解析所需的格式规范 |

### Word 文档格式要求

为确保文档能被正确解析，请遵循以下格式：

**选择题格式：**
```
1. 题干内容？
A. 选项A
B. 选项B
C. 选项C
D. 选项D
答案: B
解析: 解析内容（可选）
```

**填空题格式：**
```
5. 题干内容____需要填写的部分____。
答案: 答案1, 答案2
解析: 解析内容（可选）
```

### 重新生成示例文档

如需修改示例文档内容，可编辑并运行生成脚本：

```bash
cd frontend
node scripts/generate-sample-docx.mjs
```

## 7. 功能清单

- [x] **Word 文档解析**：支持 .doc/.docx 文件上传，自动解析选择题与填空题
- [x] **内置示例题库**：预置 10 道计算机基础知识题目（6 选择题 + 4 填空题）
- [x] **题目导航**：侧栏/底部导航显示所有题号及作答状态
- [x] **选择题作答**：点击选项选择答案，支持修改
- [x] **填空题作答**：文本输入框，支持多空填写
- [x] **答题进度追踪**：顶部进度条实时显示完成比例
- [x] **计时功能**：自动记录答题用时
- [x] **提交答卷**：未答完时二次确认，答完直接提交
- [x] **成绩计算**：自动评分，显示正确率、得分、用时
- [x] **结果分析**：圆环图展示得分，逐题对错详情，错题回顾
- [x] **答案解析**：提交后显示每题正确答案和解析
- [x] **重新答题 / 更换题库**：结果页快捷操作
- [x] **响应式设计**：适配手机（375px+）、平板（768px+）、桌面（1024px+）
- [x] **动效体系**：页面过渡、卡片入场、选项 hover、分数滚动动画
- [x] **无障碍**：ARIA 标签、键盘导航、屏幕阅读器友好、跳转链接
- [x] **Toast 反馈**：操作结果即时通知

## 8. 编码说明

本项目所有文件使用 UTF-8 编码，确保中文正常显示：
- 源代码：UTF-8 without BOM
- HTML：`<meta charset="UTF-8">`
- 配置文件：UTF-8
