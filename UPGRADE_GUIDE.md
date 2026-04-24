# 快速更新指南

当原项目更新时，需要重新应用我们的翻译修改。

## ⚡ 快速清单

更新时需要确认以下文件包含我们的改动：

### ✅ 必须存在的文件

```
src/js/i18n/i18n.js
src/js/i18n/zh-CN.js
```

### ✅ 必须修改的 HTML 文件（在 </body> 前添加）

```html
<script type="text/javascript" src="./js/i18n/zh-CN.js"></script>
<script type="text/javascript" src="./js/i18n/i18n.js"></script>
```

需要修改的文件：
- [ ] `src/index.html`
- [ ] `src/champions.html`
- [ ] `src/oms.html`
- [ ] `src/randoms.html`
- [ ] `src/honkalculate.html`

**重要：** 这些脚本标签必须在 `shared_controls.js` 之前！

## 🔧 更新步骤

```bash
# 1. 备份翻译文件
cp src/js/i18n/zh-CN.js src/js/i18n/zh-CN.js.backup

# 2. 获取上游更新
git fetch upstream
git merge upstream/master

# 3. 检查文件是否存在
ls src/js/i18n/i18n.js
ls src/js/i18n/zh-CN.js

# 4. 检查 HTML 文件中的脚本加载
grep -n "i18n/zh-CN.js" src/*.html

# 5. 构建测试
node build

# 6. 启动服务器测试
# 访问 http://localhost:8083/ 验证翻译功能
```

## 📋 更新后检查清单

- [ ] 所有 5 个 HTML 文件都包含 i18n 脚本标签
- [ ] i18n 脚本在 shared_controls.js 之前加载
- [ ] `src/js/i18n/` 目录存在且包含两个核心文件
- [ ] `node build` 成功执行无错误
- [ ] 主页翻译正常工作
- [ ] Champions 模式翻译正常
- [ ] OMS 模式翻译正常
- [ ] Randoms 模式翻译正常
- [ ] Honkalculate 模式翻译正常

## 🆘 常见问题

### Q: 合并时 HTML 文件出现冲突
**A:** 保留我们的版本，确保 i18n 脚本标签存在即可

### Q: 翻译不工作
**A:** 检查：
1. 浏览器控制台是否有错误
2. i18n 脚本是否正确加载
3. 脚本加载顺序是否正确

### Q: 需要更新翻译数据
**A:** 运行 PokeAPI 获取脚本（见 CHANGES.md）

## 📞 获取帮助

详细文档请查看：`CHANGES.md`
