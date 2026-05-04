const https = require('https');

// Missing moves from our analysis
const missingMoves = [
  "Acid Downpour", "All-Out Pummeling", "Aqua Cutter", "Aqua Step", "Armor Cannon", "Axe Kick",
  "Baby-Doll Eyes", "Barb Barrage", "Bitter Blade", "Bitter Malice", "Black Hole Eclipse",
  "Blazing Torque", "Bleakwind Storm", "Blood Moon", "Bloom Doom", "Breakneck Blitz",
  "Ceaseless Edge", "Chilling Water", "Chilly Reception", "Chloroblast", "Collision Course",
  "Combat Torque", "Comeuppance", "Continental Crush", "Corkscrew Crash", "Devastating Drake",
  "Dire Claw", "Doodle", "Double Shock", "Double-Edge", "Electro Drift", "Esper Wing",
  "Fillet Away", "Flower Trick", "Freeze-Dry",
  "G-Max Befuddle", "G-Max Cannonade", "G-Max Centiferno", "G-Max Chi Strike", "G-Max Cuddle",
  "G-Max Depletion", "G-Max Drum Solo", "G-Max Finale", "G-Max Fireball", "G-Max Foam Burst",
  "G-Max Gold Rush", "G-Max Gravitas", "G-Max Hydrosnipe", "G-Max Malodor", "G-Max Meltdown",
  "G-Max One Blow", "G-Max Rapid Flow", "G-Max Replenish", "G-Max Resonance", "G-Max Sandblast",
  "G-Max Smite", "G-Max Snooze", "G-Max Steelsurge", "G-Max Stonesurge", "G-Max Stun Shock",
  "G-Max Sweetness", "G-Max Tartness", "G-Max Terror", "G-Max Vine Lash", "G-Max Volcalith",
  "G-Max Volt Crash", "G-Max Wildfire", "G-Max Wind Rage",
  "Gigaton Hammer", "Gigavolt Havoc", "Glaive Rush", "Headlong Rush",
  "Hidden Power Bug", "Hidden Power Dark", "Hidden Power Dragon", "Hidden Power Electric",
  "Hidden Power Fighting", "Hidden Power Fire", "Hidden Power Flying", "Hidden Power Ghost",
  "Hidden Power Grass", "Hidden Power Ground", "Hidden Power Ice", "Hidden Power Poison",
  "Hidden Power Psychic", "Hidden Power Rock", "Hidden Power Steel", "Hidden Power Water",
  "Hydro Vortex", "Hyper Drill", "Ice Spinner", "Infernal Parade", "Inferno Overdrive",
  "Ivy Cudgel", "Jet Punch", "Kowtow Cleave", "Last Respects", "Lock-On", "Lumina Crash",
  "Lunar Blessing", "Magical Torque", "Make It Rain", "Malignant Chain", "Matcha Gotcha",
  "Mortal Spin", "Mountain Gale", "Mud-Slap", "Multi-Attack", "Mystical Power",
  "Never-Ending Nightmare", "Nihil Light", "Noxious Torque", "Order Up", "Paleo Wave",
  "Polar Flare", "Population Bomb", "Pounce", "Power Shift", "Power-Up Punch",
  "Psyshield Bash", "Rage Fist", "Raging Bull", "Raging Fury", "Revival Blessing",
  "Ruination", "Salt Cure", "Sandsear Storm", "Savage Spin-Out", "Self-Destruct",
  "Shadow Strike", "Shattered Psyche", "Shed Tail", "Shelter", "Silk Trap", "Snowscape",
  "Soft-Boiled", "Soul-Stealing 7-Star Strike", "Spicy Extract", "Spin Out", "Springtide Storm",
  "Stone Axe", "Subzero Slammer", "Supersonic Skystrike", "Syrup Bomb", "Take Heart",
  "Tectonic Rage", "Tera Blast", "Tidy Up", "Topsy-Turvy", "Torch Song", "Trailblaze",
  "Trick-or-Treat", "Triple Arrows", "Triple Dive", "Twin Beam", "Twinkle Tackle",
  "U-turn", "V-create", "Victory Dance", "Vise Grip", "Wake-Up Slap", "Wave Crash",
  "Wicked Torque", "Wildbolt Storm", "Will-O-Wisp", "X-Scissor"
];

function toApiName(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
}

function fetchMoveData(moveName) {
  return new Promise((resolve) => {
    const apiName = toApiName(moveName);
    const url = `https://pokeapi.co/api/v2/move/${apiName}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const zhHans = json.names.find(n => n.language.name === 'zh-hans');
          const zhHant = json.names.find(n => n.language.name === 'zh-hant');
          resolve({
            moveName,
            apiName,
            found: true,
            zhHans: zhHans ? zhHans.name : null,
            zhHant: zhHant ? zhHant.name : null
          });
        } catch (e) {
          resolve({ moveName, apiName, found: false });
        }
      });
    }).on('error', () => {
      resolve({ moveName, apiName, found: false });
    });
  });
}

async function checkAllMoves() {
  console.log(`正在检查 ${missingMoves.length} 个缺失的技能在PokeAPI上的翻译...\n`);

  const results = [];
  const batchSize = 5;

  for (let i = 0; i < missingMoves.length; i += batchSize) {
    const batch = missingMoves.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fetchMoveData));
    results.push(...batchResults);

    const checked = Math.min(i + batchSize, missingMoves.length);
    console.log(`进度: ${checked}/${missingMoves.length}`);

    if (i + batchSize < missingMoves.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  const withZhHans = results.filter(r => r.found && r.zhHans);
  const withZhHantOnly = results.filter(r => r.found && r.zhHant && !r.zhHans);
  const notFound = results.filter(r => !r.found);
  const noChinese = results.filter(r => r.found && !r.zhHans && !r.zhHant);

  console.log(`\n=== PokeAPI 检查结果 ===\n`);
  console.log(`有简体中文: ${withZhHans.length} 个`);
  console.log(`仅繁体中文: ${withZhHantOnly.length} 个`);
  console.log(`API中不存在: ${notFound.length} 个`);
  console.log(`无中文: ${noChinese.length} 个\n`);

  if (withZhHans.length > 0) {
    console.log(`=== 有简体中文翻译 (${withZhHans.length}个) ===`);
    withZhHans.sort((a, b) => a.moveName.localeCompare(b.moveName));
    withZhHans.forEach((r, i) => {
      console.log(`${i + 1}. ${r.moveName} → ${r.zhHans}`);
    });
  }

  if (withZhHantOnly.length > 0) {
    console.log(`\n=== 仅繁体中文翻译 (${withZhHantOnly.length}个) ===`);
    withZhHantOnly.sort((a, b) => a.moveName.localeCompare(b.moveName));
    withZhHantOnly.forEach((r, i) => {
      console.log(`${i + 1}. ${r.moveName} → ${r.zhHant}`);
    });
  }

  if (notFound.length > 0) {
    console.log(`\n=== API中不存在 (${notFound.length}个) ===`);
    notFound.sort((a, b) => a.moveName.localeCompare(b.moveName));
    notFound.forEach((r, i) => {
      console.log(`${i + 1}. ${r.moveName}`);
    });
  }

  if (noChinese.length > 0) {
    console.log(`\n=== API中有但无中文 (${noChinese.length}个) ===`);
    noChinese.sort((a, b) => a.moveName.localeCompare(b.moveName));
    noChinese.forEach((r, i) => {
      console.log(`${i + 1}. ${r.moveName}`);
    });
  }

  // Generate code
  console.log(`\n=== 可添加的翻译 (简体优先，繁体次之) ===`);
  const allWithChinese = [...withZhHans, ...withZhHantOnly];
  allWithChinese.sort((a, b) => a.moveName.localeCompare(b.moveName));

  allWithChinese.forEach(r => {
    const key = r.moveName.toLowerCase().replace(/['\s]/g, '');
    const translation = r.zhHans || r.zhHant;
    const source = r.zhHans ? '简体' : '繁体';
    console.log(`"${key}": "${translation}",  // ${source}`);
  });
}

checkAllMoves().catch(console.error);
