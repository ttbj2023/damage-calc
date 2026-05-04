const fs = require('fs');

// Read moves.ts to get all move names
const movesContent = fs.readFileSync('./calc/src/data/moves.ts', 'utf-8');

// Read zh-CN.js to get existing translations
const zhCNContent = fs.readFileSync('./src/js/i18n/zh-CN.js', 'utf-8');

// Extract all move names from moves.ts
const allMoves = new Set();

// Match lines that contain move definitions
const lines = movesContent.split('\n');
for (const line of lines) {
  // Skip lines that don't contain move definitions
  if (!line.includes(': {') && !line.includes(': {bp:')) continue;

  // Skip export and interface lines and const declarations
  if (line.includes('export') || line.includes('interface') || line.includes('MoveData')) continue;
  if (line.trim().startsWith('const ')) continue;

  // Extract the move name from the line
  const match = line.match(/^\s*['"]?([a-zA-Z0-9\s\-\'\.\(\)\+\#\&]+)['"]?:\s*\{/);
  if (match) {
    let moveName = match[1].trim();
    // Clean up the name - remove trailing/leading single quotes if any
    moveName = moveName.replace(/'+$/, '').replace(/^'+/, '').trim();

    // Skip non-move entries
    if (!moveName || moveName === '(No Move)' ||
        moveName === 'const map' ||
        moveName === 'self' ||
        moveName.includes('{')) continue;

    allMoves.add(moveName);
  }
}

// Extract moves section from zh-CN.js and create a case-insensitive lookup
const movesMatch = zhCNContent.match(/moves:\s*\{([\s\S]*?)\n\s*\}/);
const translatedMovesLower = new Set();
const translatedMovesOriginal = new Map();

if (movesMatch) {
  const movesSection = movesMatch[1];
  // Extract move names (keys) from translations
  const keyPattern = /['"]([a-zA-Z0-9\s\-\'\.\(\)\+\#\&]+)['"]:/g;
  let match;

  while ((match = keyPattern.exec(movesSection)) !== null) {
    const moveName = match[1];
    translatedMovesLower.add(moveName.toLowerCase());
    translatedMovesOriginal.set(moveName.toLowerCase(), moveName);
  }
}

// Find missing translations
const missingMoves = [];
allMoves.forEach(move => {
  if (!translatedMovesLower.has(move.toLowerCase())) {
    missingMoves.push(move);
  }
});

// Sort moves alphabetically (case-insensitive)
missingMoves.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

console.log(`=== 技能翻译覆盖分析 ===\n`);
console.log(`总技能数: ${allMoves.size}`);
console.log(`已翻译数: ${translatedMovesOriginal.size}`);
console.log(`缺失翻译: ${missingMoves.length}\n`);
console.log(`覆盖率: ${((translatedMovesOriginal.size / allMoves.size) * 100).toFixed(2)}%\n`);

if (missingMoves.length > 0) {
  // Show all missing moves
  console.log(`=== 缺失翻译的技能 (完整列表 ${missingMoves.length} 个) ===`);
  missingMoves.forEach((move, i) => {
    console.log(`${i + 1}. ${move}`);
  });

  // Summary of missing translations by type
  const zMoves = missingMoves.filter(m => m.startsWith('Z-'));
  const maxMoves = missingMoves.filter(m => m.startsWith('Max ') || m.startsWith('G-Max '));
  const hiddenPower = missingMoves.filter(m => m.toLowerCase().startsWith('hidden power'));
  const regularMoves = missingMoves.length - zMoves.length - maxMoves.length - hiddenPower.length;

  console.log(`\n=== 缺失翻译分类 ===`);
  console.log(`常规技能: ${regularMoves} 个`);
  if (zMoves.length > 0) console.log(`Z招式 (Z-): ${zMoves.length} 个`);
  if (maxMoves.length > 0) console.log(`极巨招式 (Max/G-Max): ${maxMoves.length} 个`);
  if (hiddenPower.length > 0) console.log(`Hidden Power 变体: ${hiddenPower.length} 个`);

  // Show sample of each category
  if (regularMoves > 0) {
    console.log(`\n=== 常规技能示例 (前20个) ===`);
    const regularMissing = missingMoves.filter(m =>
      !m.startsWith('Z-') &&
      !m.startsWith('Max ') &&
      !m.startsWith('G-Max ') &&
      !m.toLowerCase().startsWith('hidden power')
    ).slice(0, 20);
    regularMissing.forEach((move, i) => {
      console.log(`${i + 1}. ${move}`);
    });
  }

  if (maxMoves.length > 0) {
    console.log(`\n=== 极巨招式列表 (${maxMoves.length}个) ===`);
    maxMoves.sort().forEach((move, i) => {
      console.log(`${i + 1}. ${move}`);
    });
  }

  if (hiddenPower.length > 0) {
    console.log(`\n=== Hidden Power 变体 (${hiddenPower.length}个) ===`);
    hiddenPower.sort().forEach((move, i) => {
      console.log(`${i + 1}. ${move}`);
    });
  }
}
