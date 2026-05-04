const fs = require('fs');

// 需要修正的技能键名映射
const keyMappings = {
  "aquacutter": "Aqua Cutter",
  "aquastep": "Aqua Step",
  "armorcannon": "Armor Cannon",
  "axekick": "Axe Kick",
  "barbbarrage": "Barb Barrage",
  "bitterblade": "Bitter Blade",
  "bittermalice": "Bitter Malice",
  "blazingtorque": "Blazing Torque",
  "bleakwindstorm": "Bleakwind Storm",
  "ceaselessedge": "Ceaseless Edge",
  "chillingwater": "Chilling Water",
  "chillyreception": "Chilly Reception",
  "chloroblast": "Chloroblast",
  "collisioncourse": "Collision Course",
  "combattorque": "Combat Torque",
  "comeuppance": "Comeuppance",
  "direclaw": "Dire Claw",
  "doubleshock": "Double Shock",
  "electrodrift": "Electro Drift",
  "esperwing": "Esper Wing",
  "filletaway": "Fillet Away",
  "flowertrick": "Flower Trick",
  "gigatonhammer": "Gigaton Hammer",
  "glaiverush": "Glaive Rush",
  "headlongrush": "Headlong Rush",
  "hyperdrill": "Hyper Drill",
  "icespinner": "Ice Spinner",
  "infernalparade": "Infernal Parade",
  "jetpunch": "Jet Punch",
  "kowtowcleave": "Kowtow Cleave",
  "lastrespects": "Last Respects",
  "luminacrash": "Lumina Crash",
  "lunarblessing": "Lunar Blessing",
  "magicaltorque": "Magical Torque",
  "makeitrain": "Make It Rain",
  "mortalspin": "Mortal Spin",
  "mountaingale": "Mountain Gale",
  "mysticalpower": "Mystical Power",
  "noxioustorque": "Noxious Torque",
  "orderup": "Order Up",
  "populationbomb": "Population Bomb",
  "powershift": "Power Shift",
  "psyshieldbash": "Psyshield Bash",
  "ragefist": "Rage Fist",
  "ragingbull": "Raging Bull",
  "ragingfury": "Raging Fury",
  "revivalblessing": "Revival Blessing",
  "ruination": "Ruination",
  "saltcure": "Salt Cure",
  "sandsearstorm": "Sandsear Storm",
  "shedtail": "Shed Tail",
  "shelter": "Shelter",
  "silktrap": "Silk Trap",
  "snowscape": "Snowscape",
  "spicyextract": "Spicy Extract",
  "spinout": "Spin Out",
  "springtidestorm": "Springtide Storm",
  "stoneaxe": "Stone Axe",
  "takeheart": "Take Heart",
  "terablast": "Tera Blast",
  "tidyup": "Tidy Up",
  "torchsong": "Torch Song",
  "trailblaze": "Trailblaze",
  "triplearrows": "Triple Arrows",
  "tripledive": "Triple Dive",
  "twinbeam": "Twin Beam",
  "victorydance": "Victory Dance",
  "wavecrash": "Wave Crash",
  "wickedtorque": "Wicked Torque",
  "wildboltstorm": "Wildbolt Storm",
  "bloodmoon": "Blood Moon",
  "ivycudgel": "Ivy Cudgel",
  "matchagotcha": "Matcha Gotcha",
  "syrupbomb": "Syrup Bomb"
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
