# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是基于 [Smogon/Damage-Calc](https://github.com/smogon/damage-calc) 的**中文增强版本**，在保留原项目所有功能的基础上，添加了完整的中文翻译支持。项目使用传统JavaScript（非ES6模块）编写以保持与原项目的兼容性。

## 构建和开发命令

### 构建项目
```bash
# 完整构建（包括 calc/ TypeScript 编译）
npm run build

# 仅构建 UI（不编译 calc/，更快）
npm run build-ui

# 仅编译 calc/ 包
cd calc && npm run compile
```

### 测试和代码质量
```bash
# 运行测试
npm test

# 代码检查
npm run lint

# 自动修复代码问题
npm run fix
```

### 本地调试服务器
```bash
# 方法1：使用 src/ 目录（快速迭代，无缓存hash）
cd src && python3 -m http.server 8083

# 方法2：使用 dist/ 目录（生产版本，带缓存hash）
cd dist && python3 -m http.server 8084
```

## 核心架构

### 构建系统（build 脚本）

**关键概念**：构建脚本使用wrapper模板系统。所有HTML文件必须在`<!-- START WRAPPER -->`和`<!-- END WRAPPER -->`标记之间放置内容，否则build过程中会被丢弃。

构建流程：
1. 编译 `calc/` TypeScript → JavaScript（除非使用 `node build view`）
2. 复制 `src/` → `dist/`
3. 复制 `calc/dist/` → `dist/calc/`
4. 对5个HTML文件应用cache-busting（添加MD5 hash到JS/CSS引用）

**重要**：修改 `src/` 中的HTML/JS后，必须运行 `npm run build-ui` 才能看到变化。修改 `calc/` 后需要运行完整 `npm run build`。

### 国际化（i18n）系统

**位置**：`src/js/i18n/`

**核心文件**：
- `i18n.js` - 翻译引擎，提供 `translate()` 和 `findByChinese()` 方法
- `zh-CN.js` - 中文翻译数据（约2,000条目）

**使用方式**：
```javascript
// 英文 → 中文
window.i18n.translate('species', 'Gengar') // 返回 '耿鬼'

// 中文 → 英文（用于搜索）
window.i18n.findByChinese('species', '耿鬼') // 返回 'Gengar'

// 显示文本（中英文同时显示）
window.i18n.getDisplayText('species', 'Gengar') // 返回 '耿鬼 (Gengar)'
```

**翻译数据结构**：
```javascript
window.zhCN = {
  species: { 'Gengar': '耿鬼', 'Charizard': '喷火龙', ... },
  moves: { 'Flamethrower': '喷射火焰', ... },
  abilities: { 'Blaze': '猛火', ... },
  items: { 'Choice Specs': '讲究眼镜', ... },
  types: { 'Fire': '火', 'Water': '水', ... },
  natures: { 'Adamant': '固执', ... }
}
```

### 收藏配置管理系统

**位置**：`src/js/moveset_import.js`

**功能**：
- 左侧/右侧的"⭐ 收藏"按钮 - 保存当前配置到localStorage
- "📋 管理收藏"按钮（右上角） - 打开收藏管理modal
- 支持：查看、删除、重命名收藏配置

**关键函数**：
- `addToFavorites(pokeInfo)` - 添加配置到收藏
- `openFavoritesManager()` - 打开管理modal
- `renderFavoritesList(customsets)` - 渲染收藏列表
- `deleteSingleFavorite(pokemonName, setName)` - 删除单个收藏
- `clearAllFavorites()` - 清空所有收藏

**HTML元素位置**：
- 按钮在 `src/champions.html` 第53行（wrapper内）
- Modal在 `src/champions.html` 第1233-1243行（wrapper内）

## 项目结构

```
damage-calc-i18n/
├── calc/                    # @smogon/calc 核心计算包（TypeScript）
│   ├── src/                 # TypeScript 源码
│   ├── dist/                # 编译后的 JS
│   └── package.json         # 子包配置
├── src/                     # UI 源文件（开发目录）
│   ├── js/
│   │   ├── i18n/            # 国际化系统
│   │   │   ├── i18n.js
│   │   │   └── zh-CN.js
│   │   ├── data/            # 数据文件
│   │   │   └── sets/        # 宝可梦配置集
│   │   ├── shared_controls.js    # 共享控件逻辑
│   │   ├── moveset_import.js    # 导入/导出/收藏功能
│   │   └── vendor/         # 第三方库（jQuery, Select2）
│   ├── css/                 # 样式文件
│   ├── img/                 # 图片资源
│   ├── *.html               # 5个主要HTML页面
│   └── shared.template.html # 包装模板
├── dist/                    # 构建输出（生产目录）
│   ├── calc/                # 编译后的计算包
│   └── *.html               # 带cache-busting的HTML文件
├── build                    # 构建脚本
└── package.json             # 根包配置
```

## HTML页面说明

1. **index.html** - 标准计算器（Singles/Doubles）
2. **champions.html** - Champions模式（最新：已添加收藏管理UI）
3. **randoms.html** - 随机对战模式
4. **oms.html** - Other Metagames
5. **honkalculate.html** - 团队计算器

所有HTML文件都使用 `shared.template.html` 作为包装器。

## 开发注意事项

### 添加新功能到HTML页面时

**必须**将新元素放在 `<!-- START WRAPPER -->` 和 `<!-- END WRAPPER -->` 之间，否则build过程会将其删除。

```html
<!-- START WRAPPER -->
<div class="wrapper">
  <!-- 你的新内容放在这里 -->
</div>
<!-- END WRAPPER -->
```

### 修改翻译数据

编辑 `src/js/i18n/zh-CN.js`，然后运行 `npm run build-ui`。

### 添加新的收藏功能

参考 `champions.html` 和 `moveset_import.js` 的实现：
1. 在HTML中添加按钮/modal（必须在wrapper内）
2. 在对应的JS文件中添加事件处理函数
3. 使用localStorage存储数据（key格式：`customSets_<pokemonName>`）

### 服务器部署

使用以下命令同步到服务器（需要root权限）：
```bash
# 本地构建
npm run build

# 同步到220服务器
rsync -avz --delete dist/ 220-root:/home/jft/damage-calc-i18n/dist/

# 重启nginx
ssh 220-root "docker exec nginx-movie-proxy nginx -s reload"
```

服务器URL：http://192.168.100.220:9222/

## 与上游的差异

- 新增完整的中文i18n系统（`src/js/i18n/`）
- 5个HTML文件都添加了i18n脚本加载
- 添加了收藏配置管理功能（champions.html）
- 保持与原项目功能同步，定期合并upstream更新

## 相关文档

- `README-CN.md` - 中文项目说明
- `CHANGES.md` - 详细改动记录
- `.gitignore` - 忽略node_modules和IDE配置
