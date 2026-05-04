const fs = require('fs');

// These 18 moves have simplified Chinese translations from PokeAPI
const movesWithZhHans = [
  { name: "Baby-Doll Eyes", key: "baby-dolleyes", zh: "圆瞳" },
  { name: "Double-Edge", key: "double-edge", zh: "舍身冲撞" },
  { name: "Freeze-Dry", key: "freeze-dry", zh: "冷冻干燥" },
  { name: "Lock-On", key: "lock-on", zh: "锁定" },
  { name: "Malignant Chain", key: "malignantchain", zh: "邪毒锁链" },
  { name: "Mud-Slap", key: "mud-slap", zh: "掷泥" },
  { name: "Multi-Attack", key: "multi-attack", zh: "多属性攻击" },
  { name: "Power-Up Punch", key: "power-uppunch", zh: "增强拳" },
  { name: "Self-Destruct", key: "self-destruct", zh: "自爆" },
  { name: "Soft-Boiled", key: "soft-boiled", zh: "生蛋" },
  { name: "Soul-Stealing 7-Star Strike", key: "soul-stealing7-starstrike", zh: "七星夺魂腿" },
  { name: "Topsy-Turvy", key: "topsy-turvy", zh: "颠倒" },
  { name: "Trick-or-Treat", key: "trick-or-treat", zh: "万圣夜" },
  { name: "U-turn", key: "u-turn", zh: "急速折返" },
  { name: "V-create", key: "v-create", zh: "Ｖ热焰" },
  { name: "Wake-Up Slap", key: "wake-upslap", zh: "唤醒巴掌" },
  { name: "Will-O-Wisp", key: "will-o-wisp", zh: "鬼火" },
  { name: "X-Scissor", key: "x-scissor", zh: "十字剪" }
];

// Read current zh-CN.js
const zhCNContent = fs.readFileSync('./src/js/i18n/zh-CN.js', 'utf-8');

// Extract moves section
const movesMatch = zhCNContent.match(/moves:\s*\{([\s\S]*?)\n\s*\}/);
if (!movesMatch) {
  console.log('无法找到moves部分');
  process.exit(1);
}

const movesSection = movesMatch[1];

// Find which moves are actually missing
const missingMoves = [];
const existingMoves = [];

// Extract all keys from moves section
const existingKeys = new Set();
const keyPattern = /['"]([a-zA-Z0-9\s\-\'\.\(\)\+\#\&]+)['"]:/g;
let match;
while ((match = keyPattern.exec(movesSection)) !== null) {
  existingKeys.add(match[1].toLowerCase().replace(/\s+/g, '').replace(/-/g, ''));
}

movesWithZhHans.forEach(move => {
  const normalizedKey = move.key.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
  if (existingKeys.has(normalizedKey)) {
    existingMoves.push(move);
  } else {
    missingMoves.push(move);
  }
}

console.log(`=== 检查结果 ===\n`);
console.log(`已存在: ${existingMoves.length} 个`);
console.log(`缺失: ${missingMoves.length} 个\n`);

if (existingMoves.length > 0) {
  console.log(`=== 已存在的翻译 ===`);
  existingMoves.forEach(m => {
    console.log(`${m.name} → ${m.zh}`);
  });
}

if (missingMoves.length > 0) {
  console.log(`\n=== 需要添加的翻译 ===`);
  missingMoves.forEach(m => {
    console.log(`"${m.key}": "${m.zh}",  // ${m.name}`);
  });

  console.log(`\n=== 生成添加代码 ===`);
  const insertPos = movesMatch.index + movesMatch[0].length - 3; // Before closing brace
  const indent = '    ';

  missingMoves.forEach(m => {
    console.log(`${indent}"${m.key}": "${m.zh}",  // ${m.name}`);
  });
}
