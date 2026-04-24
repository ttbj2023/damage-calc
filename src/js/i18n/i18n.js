/**
 * 国际化（i18n）工具模块
 * 用于支持中文搜索和显示，底层逻辑保持英文
 * 使用传统JavaScript方式（非ES6模块）以兼容项目
 */

(function() {
  'use strict';

  /**
   * 数据类型枚举
   */
  const DataType = {
    SPECIES: 'species',
    MOVES: 'moves',
    ABILITIES: 'abilities',
    ITEMS: 'items',
    TYPES: 'types',
    NATURES: 'natures'
  };

  /**
   * 国际化管理类
   */
  function I18nManager() {
    this.currentLocale = 'zh-CN';
    this.fallbackLocale = 'en';
    this.translationCache = {};
  }

  /**
   * 根据英文名称获取中文名称
   * @param {string} type - 数据类型 (species, moves, abilities, items, types, natures)
   * @param {string} englishName - 英文名称
   * @returns {string} 中文名称，如果未找到则返回英文名称
   */
  I18nManager.prototype.translate = function(type, englishName) {
    if (!englishName) return '';

    var cacheKey = type + ':' + englishName;
    if (this.translationCache[cacheKey]) {
      return this.translationCache[cacheKey];
    }

    var translations = window.zhCN[type];
    if (!translations) {
      return englishName;
    }

    // 首先尝试精确匹配
    var chineseName = translations[englishName];

    // 如果没有找到，尝试小写匹配（因为PokeAPI数据是小写的）
    if (!chineseName) {
      var lowerName = englishName.toLowerCase();
      chineseName = translations[lowerName];
    }

    // 如果还没有找到，尝试处理特殊情况
    if (!chineseName) {
      // 处理带有空格的名称
      var parts = englishName.split(' ');
      var simpleName = parts[0];
      chineseName = translations[simpleName] || translations[simpleName.toLowerCase()] || englishName;
    }

    this.translationCache[cacheKey] = chineseName;
    return chineseName;
  };

  /**
   * 根据中文名称查找英文名称（用于搜索）
   * @param {string} type - 数据类型
   * @param {string} chineseName - 中文名称
   * @returns {string|null} 英文名称，如果未找到则返回null
   */
  I18nManager.prototype.findByChinese = function(type, chineseName) {
    if (!chineseName) return null;

    var translations = window.zhCN[type];
    if (!translations) return null;

    // 精确匹配
    for (var en in translations) {
      if (translations[en] === chineseName) {
        return en;
      }
    }

    // 部分匹配（支持模糊搜索）
    var searchTerm = chineseName.toLowerCase();
    for (var en in translations) {
      var zh = translations[en];
      if (zh.indexOf(searchTerm) !== -1 || searchTerm.indexOf(zh.substring(0, Math.floor(zh.length / 2))) !== -1) {
        return en;
      }
    }

    return null;
  };

  /**
   * 检查文本是否包含中文字符
   * @param {string} text - 要检查的文本
   * @returns {boolean}
   */
  I18nManager.prototype.containsChinese = function(text) {
    return /[\u4e00-\u9fa5]/.test(text);
  };

  /**
   * 获取用于显示的文本（优先显示中文）
   * @param {string} type - 数据类型
   * @param {string} englishName - 英文名称
   * @param {boolean} showBoth - 是否同时显示中英文（默认true）
   * @returns {string}
   */
  I18nManager.prototype.getDisplayText = function(type, englishName, showBoth) {
    var chinese = this.translate(type, englishName);

    // 默认显示中英文，除非明确指定不显示
    if (showBoth !== false && chinese !== englishName) {
      return chinese + ' (' + englishName + ')';
    }

    return chinese;
  };

  /**
   * 清除缓存
   */
  I18nManager.prototype.clearCache = function() {
    this.translationCache = {};
  };

  /**
   * 获取所有翻译数据
   * @param {string} type - 数据类型
   * @returns {Object}
   */
  I18nManager.prototype.getAllTranslations = function(type) {
    return window.zhCN[type] || {};
  };

  // 创建全局单例实例
  window.i18n = new I18nManager();

  // 为了兼容性，也导出到全局
  console.log('✅ i18n module loaded successfully');
  console.log('📊 Translation data loaded:', {
    species: Object.keys(window.zhCN.species || {}).length,
    moves: Object.keys(window.zhCN.moves || {}).length,
    abilities: Object.keys(window.zhCN.abilities || {}).length,
    items: Object.keys(window.zhCN.items || {}).length
  });

})();
