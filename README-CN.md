# Pokémon 伤害计算器 - 中文版

[![GitHub](https://img.shields.io/badge/GitHub-ttbj2023%2Fdamage--calc-blue)](https://github.com/ttbj2023/damage-calc)
[中文版](README-CN.md) | [English](README.md)

## 📝 项目简介

这是基于 [Smogon/Damage-Calc](https://github.com/smogon/damage-calc) 的**中文增强版本**，在保留原项目所有功能的基础上，添加了完整的中文翻译支持。

## ✨ 主要特性

- ✅ **完整中文翻译** - 宝可梦、招式、特性、道具等全部支持中文显示
- ✅ **所有对战模式** - Singles、Doubles、Randoms 等所有模式均支持中文
- ✅ **官方翻译数据** - 使用 PokeAPI 官方中文翻译，保证准确性
- ✅ **高频更新** - 跟随原项目更新，保持功能同步

## 🚀 在线使用

访问 [在线演示地址](https://your-domain.com) 开始使用（待部署）

## 📦 本地运行

### 1. 克隆仓库

```bash
git clone https://github.com/ttbj2023/damage-calc.git
cd damage-calc
```

### 2. 安装依赖

```bash
npm install
```

### 3. 构建项目

```bash
npm run build
```

### 4. 启动服务

```bash
npm start
```

访问 http://localhost:8080/ 即可使用。

## 🌐 翻译数据

- **Species（宝可梦）**: 674 个
- **Moves（招式）**: 421 个  
- **Abilities（特性）**: 138 个
- **Items（道具）**: 779 个
- **总翻译条目**: 2,012 个

数据来源：[PokeAPI](https://pokeapi.co/) 官方中文翻译

## 📚 项目结构

```
damage-calc/
├── src/
│   ├── js/
│   │   └── i18n/              # 国际化翻译系统
│   │       ├── i18n.js        # 翻译逻辑
│   │       └── zh-CN.js       # 中文翻译数据
│   ├── index.html             # 主页（已添加中文支持）
│   ├── champions.html         # Champions 模式
│   ├── oms.html               # Other Metagames 模式
│   ├── randoms.html           # 随机对战模式
│   └── honkalculate.html      # 团队计算器
├── CHANGES.md                 # 详细改动说明
└── UPGRADE_GUIDE.md           # 更新指南
```

## 🔧 与原项目的主要差异

### 新增文件
- `src/js/i18n/i18n.js` - 翻译核心逻辑
- `src/js/i18n/zh-CN.js` - 中文翻译数据
- `CHANGES.md` - 完整改动说明
- `UPGRADE_GUIDE.md` - 快速更新指南

### 修改文件
在以下 5 个 HTML 文件中添加了 i18n 脚本加载：
- `src/index.html`
- `src/champions.html`
- `src/oms.html`
- `src/randoms.html`
- `src/honkalculate.html`

## 🔄 如何更新到原项目新版本

当 [smogon/damage-calc](https://github.com/smogon/damage-calc) 发布新版本时：

1. **添加上游仓库**（首次）
   ```bash
   git remote add upstream https://github.com/smogon/damage-calc.git
   ```

2. **获取更新**
   ```bash
   git fetch upstream
   ```

3. **合并更新**
   ```bash
   git merge upstream/master
   ```

4. **解决冲突**（如果有）
   - 保留 `src/js/i18n/` 目录
   - 确保 5 个 HTML 文件包含 i18n 脚本

5. **提交并推送**
   ```bash
   git add .
   git commit -m "Update to latest upstream version"
   git push
   ```

详细说明请查看 [UPGRADE_GUIDE.md](UPGRADE_GUIDE.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于原项目 [MIT License](LICENSE)。

## 🙏 致谢

- [Smogon University](https://www.smogon.com/) - 原项目开发团队
- [PokeAPI](https://pokeapi.co/) - 提供 Pokémon 数据 API
- 所有贡献者

## 📞 联系方式

- GitHub: [@ttbj2023](https://github.com/ttbj2023)
- 问题反馈: [Issues](https://github.com/ttbj2023/damage-calc/issues)

---

**注意**: 本项目为非官方中文版，与 The Pokémon Company、Nintendo、Game Freak 无任何关联。
