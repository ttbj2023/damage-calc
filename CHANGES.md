# 中文翻译版改动说明

本项目是基于 [Smogon/Damage-Calc](https://github.com/smogon/damage-calc) 的中文翻译版本。

## 📝 改动总结

### 1. 新增文件

#### 核心翻译系统文件
- **`src/js/i18n/i18n.js`** - 国际化核心逻辑
  - 提供翻译查找和替换功能
  - 自动翻译页面上的各种游戏元素
  - 支持翻译 Species（宝可梦）、Moves（招式）、Abilities（特性）、Items（道具）、Natures（性格）、Types（属性）

- **`src/js/i18n/zh-CN.js`** - 中文翻译数据文件
  - 包含所有游戏元素的中文翻译
  - 当前版本包含约 2,012 个翻译条目
  - 数据来源：PokeAPI 官方中文翻译 + 人工补充

#### 辅助文件（用于维护和更新）
- **`src/js/i18n/zh-CN-complete.js`** - 完整翻译数据（包含部分未使用的）
- **`src/js/i18n/missing_*.json`** - 记录缺失的翻译条目
- **`src/js/i18n/to_translate_*.json`** - 待翻译条目列表
- **`translator-files/`** - 翻译工具和参考文件

#### 数据获取脚本
- **`/tmp/fetch_pokeapi_translations.py`** - PokeAPI 翻译获取脚本
  - 从 PokeAPI 批量获取官方中文翻译
  - 包含自动重试和错误恢复机制
  - 生成格式化的翻译数据文件

- **`/tmp/convert_format.py`** - 格式转换脚本
  - 将 PokeAPI 的 kebab-case 格式转换为 Title Case
  - 例如：`"thunder-punch"` → `"Thunder Punch"`

### 2. 修改的文件

#### HTML 文件（添加 i18n 支持）

以下 HTML 文件都添加了 i18n 脚本加载（在 `</body>` 前）：

```html
<script type="text/javascript" src="./js/i18n/zh-CN.js"></script>
<script type="text/javascript" src="./js/i18n/i18n.js"></script>
```

**修改的文件列表：**
1. **`src/index.html`** (主要计算器页面)
   - 添加行：在 `</body>` 前添加 i18n 脚本

2. **`src/champions.html`** (Champions 对战模式)
   - 修改行：第 1223-1224 行

3. **`src/oms.html`** (Other Metagames 对战模式)
   - 修改行：第 1676-1677 行

4. **`src/randoms.html`** (随机对战模式)
   - 修改行：第 1645-1646 行

5. **`src/honkalculate.html`** (团队计算器)
   - 修改行：第 988-989 行

**重要提示：** i18n 脚本必须在 `shared_controls.js` 之前加载，因为 shared_controls 依赖翻译功能。

## 🔄 如何更新到上游新版本

当原项目 [smogon/damage-calc](https://github.com/smogon/damage-calc) 发布新版本时，按以下步骤适配：

### 方案一：合并更新（推荐）

1. **添加上游远程仓库**
   ```bash
   git remote add upstream https://github.com/smogon/damage-calc.git
   ```

2. **获取上游更新**
   ```bash
   git fetch upstream
   ```

3. **合并上游更改**
   ```bash
   git merge upstream/master
   # 或如果是 main 分支
   git merge upstream/main
   ```

4. **解决冲突**
   - 如果 `src/js/i18n/` 目录下的文件有冲突，保留我们的版本
   - 如果 HTML 文件中 `</body>` 前的脚本加载部分有冲突，确保保留 i18n 脚本加载
   - 其他文件使用上游的新版本

5. **测试构建**
   ```bash
   node build
   ```

6. **验证翻译功能**
   - 访问 `http://localhost:8083/`
   - 检查各种对战模式下的翻译是否正常工作

### 方案二：手动迁移（适用于大版本更新）

1. **备份当前翻译文件**
   ```bash
   cp src/js/i18n/zh-CN.js src/js/i18n/zh-CN.js.backup
   ```

2. **下载新版本**
   ```bash
   git clone https://github.com/smogon/damage-calc.git damage-calc-new
   cd damage-calc-new
   ```

3. **复制翻译系统到新版本**
   ```bash
   # 复制整个 i18n 目录
   cp -r ../damage-calc/src/js/i18n src/js/i18n
   ```

4. **修改 HTML 文件**
   - 对所有 `src/*.html` 文件，在 `</body>` 前添加：
   ```html
   <script type="text/javascript" src="./js/i18n/zh-CN.js"></script>
   <script type="text/javascript" src="./js/i18n/i18n.js"></script>
   ```

5. **构建并测试**
   ```bash
   node build
   # 启动服务器测试
   ```

## 📊 翻译数据更新

当需要更新翻译数据时（例如新增宝可梦、招式等）：

### 从 PokeAPI 获取最新翻译

1. **运行获取脚本**
   ```bash
   cd /tmp
   python3 fetch_pokeapi_translations.py
   ```

2. **格式转换**
   ```bash
   python3 convert_format.py
   ```

3. **备份并替换**
   ```bash
   cp /home/jsjrjft/project/pkmcalc/damage-calc/src/js/i18n/zh-CN.js \
      /home/jsjrjft/project/pkmcalc/damage-calc/src/js/i18n/zh-CN.js.backup

   cp /tmp/zh-CN-converted.js \
      /home/jsjrjft/project/pkmcalc/damage-calc/src/js/i18n/zh-CN.js
   ```

4. **重新构建**
   ```bash
   cd /home/jsjrjft/project/pkmcalc/damage-calc
   node build
   ```

### 手动添加翻译

如果某些翻译 PokeAPI 中不存在，可以手动编辑 `src/js/i18n/zh-CN.js`：

```javascript
window.zhCN = {
    species: {
        "new-pokemon": "新宝可梦",
        // ...
    },
    moves: {
        "New Move": "新招式",
        // ...
    },
    // ...
};
```

## ⚠️ 注意事项

### 1. 脚本加载顺序
HTML 文件中的脚本加载顺序非常重要：
```html
<script type="text/javascript" src="./calc/index.js?"></script>
<script type="text/javascript" src="./js/i18n/zh-CN.js"></script>       <!-- 1. 翻译数据 -->
<script type="text/javascript" src="./js/i18n/i18n.js"></script>        <!-- 2. 翻译逻辑 -->
<script type="text/javascript" src="./js/shared_controls.js?"></script> <!-- 3. 依赖翻译的控件 -->
```

### 2. 格式要求
- **Species**: 使用 kebab-case（小写连字符）
  - 正确：`"charizard": "喷火龙"`
  - 错误：`"Charizard": "喷火龙"`

- **Moves/Abilities/Items**: 使用 Title Case（首字母大写）
  - 正确：`"Thunder Punch": "雷电拳"`
  - 错误：`"thunder-punch": "雷电拳"`

### 3. 编码
所有文件必须使用 **UTF-8** 编码保存。

### 4. 构建系统
- 修改源文件后必须运行 `node build` 来更新 `dist/` 目录
- `dist/` 目录是实际部署到服务器的文件

## 📁 项目结构

```
damage-calc/
├── src/
│   ├── js/
│   │   └── i18n/              # 翻译系统目录（新增）
│   │       ├── i18n.js        # 翻译逻辑
│   │       ├── zh-CN.js       # 中文翻译数据
│   │       └── *.json         # 辅助文件
│   ├── index.html             # 主页面（已修改）
│   ├── champions.html         # Champions 模式（已修改）
│   ├── oms.html               # OMS 模式（已修改）
│   ├── randoms.html           # 随机对战（已修改）
│   └── honkalculate.html      # 团队计算器（已修改）
├── dist/                      # 构建输出目录
└── translator-files/          # 翻译工具（新增）
```

## 🎯 翻译覆盖率

当前版本的翻译覆盖率：
- **Species（宝可梦）**: 674 / ~1000 (67.4%)
- **Moves（招式）**: 421 / ~800 (52.6%)
- **Abilities（特性）**: 138 / ~300 (46.0%)
- **Items（道具）**: 779 / ~2000 (38.9%)
- **总体提升**: Items 类别相比原版提升了 283.7%

## 📞 维护建议

1. **定期更新翻译**
   - 建议每 3-6 个月运行一次 PokeAPI 获取脚本
   - 宝可梦新世代发布时及时更新

2. **质量检查**
   - 更新后检查翻译准确性
   - 特别注意专有名词的官方译名

3. **版本控制**
   - 每次重大更新前备份 `zh-CN.js`
   - 使用 Git 记录所有更改

4. **测试**
   - 每次更新后测试所有对战模式
   - 确保翻译不破坏原有功能

## 📚 相关资源

- [PokeAPI](https://pokeapi.co/) - Pokémon 数据 API
- [宝可梦官方译名表](https://www Pokémon.co.jp) - 参考官方译名
- [Smogon University](https://www.smogon.com/) - 宝可梦对战策略网站

---

**最后更新**: 2026-04-24
**版本**: 0.11.0 (based on @smogon/calc)
