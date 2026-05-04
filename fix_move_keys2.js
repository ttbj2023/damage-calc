const fs = require('fs');

// Additional keys to fix
const keyMappings = {
  "baby-dolleyes": "Baby Doll Eyes",
  "double-edge": "Double-Edge",
  "freeze-dry": "Freeze-Dry",
  "lock-on": "Lock-On",
  "mud-slap": "Mud-Slap",
  "multi-attack": "Multi-Attack",
  "power-uppunch": "Power-Up Punch",
  "self-destruct": "Self-Destruct",
  "soft-boiled": "Soft-Boiled",
  "soul-stealing7-starstrike": "Soul-Stealing 7-Star Strike",
  "topsy-turvy": "Topsy-Turvy",
  "trick-or-treat": "Trick-or-Treat",
  "u-turn": "U-turn",
  "v-create": "V-create",
  "wake-upslap": "Wake-Up Slap",
  "will-o-wisp": "Will-O-Wisp",
  "x-scissor": "X-Scissor"
};

// Read the file
const zhCNPath = './src/js/i18n/zh-CN.js';
let content = fs.readFileSync(zhCNPath, 'utf-8');

// Replace all keys
let replacements = 0;
for (const [oldKey, newKey] of Object.entries(keyMappings)) {
  const regex = new RegExp(`"${oldKey}":`, 'g');
  const matches = content.match(regex);
  if (matches && matches.length > 0) {
    content = content.replace(regex, `"${newKey}":`);
    replacements += matches.length;
    console.log(`✓ "${oldKey}" → "${newKey}"`);
  }
}

console.log(`\n总共替换了 ${replacements} 处`);

// Write back
fs.writeFileSync(zhCNPath, content, 'utf-8');
console.log('文件已更新');
