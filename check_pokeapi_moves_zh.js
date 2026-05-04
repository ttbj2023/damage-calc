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

// Convert move name to API format (lowercase, replace spaces with hyphens)
function toApiName(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
}

function fetchMoveData(moveName) {
  return new Promise((resolve) => {
    const apiName = toApiName(moveName);
    const url = `https://pokeapi.co/api/v2/move/${apiName}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          // Try to find Chinese name (both zh-Hans and zh-Hant)
          const chineseName = json.names.find(n => n.language.name === 'zh-hans' || n.language.name === 'zh-Hant');
          resolve({
            moveName,
            apiName,
            found: true,
            chineseName: chineseName ? chineseName.name : null,
            allNames: json.names
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
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  // Categorize results
  const withTranslation = results.filter(r => r.found && r.chineseName);
  const notFound = results.filter(r => !r.found);
  const foundNoChinese = results.filter(r => r.found && !r.chineseName);

  console.log(`\n=== PokeAPI 检查结果 (使用繁体中文 zh-Hant) ===\n`);
  console.log(`有中文翻译: ${withTranslation.length} 个`);
  console.log(`API中不存在: ${notFound.length} 个`);
  console.log(`存在但无中文: ${foundNoChinese.length} 个\n`);

  if (withTranslation.length > 0) {
    console.log(`=== 有官方中文翻译的技能 (${withTranslation.length}个) ===`);
    withTranslation.sort((a, b) => a.moveName.localeCompare(b.moveName));
    withTranslation.forEach((r, i) => {
      console.log(`${i + 1}. ${r.moveName} → ${r.chineseName}`);
    });
  }

  if (notFound.length > 0) {
    console.log(`\n=== PokeAPI中不存在的技能 (${notFound.length}个) ===`);
    notFound.sort((a, b) => a.moveName.localeCompare(b.moveName));
    notFound.forEach((r, i) => {
      console.log(`${i + 1}. ${r.moveName} (API名: ${r.apiName})`);
    });
  }

  if (foundNoChinese.length > 0) {
    console.log(`\n=== PokeAPI中有但无中文翻译的技能 (${foundNoChinese.length}个) ===`);
    foundNoChinese.sort((a, b) => a.moveName.localeCompare(b.moveName));
    foundNoChinese.forEach((r, i) => {
      console.log(`${i + 1}. ${r.moveName}`);
    });
  }

  // Generate code for adding translations (convert traditional to simplified if needed)
  if (withTranslation.length > 0) {
    console.log(`\n=== 可添加的翻译代码 ===`);

    // Common Traditional to Simplified conversions
    const tradToSimp = {
      '衝': '冲', '擊': '击', '氣': '气', '轉': '转', '頭': '头', '幹': '干',
      '網': '网', '絲': '丝', '繫': '系', '續': '续', '纏': '缠', '結': '结',
      '變': '变', '敵': '敌', '戰': '战', '劇': '剧', '藥': '药', '強': '强',
      '彙': '汇', '衛': '卫', '鐘': '钟', '鍵': '键', '門': '门', '閃': '闪',
      '電': '电', '霧': '雾', '齊': '齐', '劍': '剑', '華': '华', '飛': '飞',
      '術': '术', '靈': '灵', '壓': '压', '墜': '坠', '淚': '泪', '掙': '挣',
      '奪': '夺', '圍': '围', '塵': '尘', '種': '种', '稱': '称', '獄': '狱',
      '獸': '兽', '獨': '独', '獎': '奖', '關': '关', '衝': '冲', '擊': '击',
      '雙': '双', '難': '难', '葉': '叶', '號': '号', '頓': '顿', '偵': '侦',
      '側': '侧', '備': '备', '複': '复', '變': '变', '昇': '升', '曉': '晓',
      '棄': '弃', '殼': '壳', '漢': '汉', '禮': '礼', '穀': '谷', '聖': '圣',
      '盤': '盘', '觸': '触', '覺': '觉', '視': '视', '設': '设', '識': '识',
      '詞': '词', '謀': '谋', '諜': '谍', '討': '讨', '讓': '让', '謝': '谢',
      '謎': '谜', '謙': '谦', '講': '讲', '譽': '誉', '讀': '读', '變': '变',
      '遊': '游', '運': '运', '遙': '遥', '遜': '逊', '遞': '递', '邊': '边',
      '達': '达', '遠': '远', '遞': '递', '適': '适', '遺': '遗', '遲': '迟',
      '選': '选', '遲': '迟', '鄰': '邻', '鏈': '链', '鏡': '镜', '鎖': '锁',
      '鐵': '铁', '鑽': '钻', '鑰': '钥', '長': '长', '門': '门', '閃': '闪',
      '闇': '暗', '隊': '队', '階': '阶', '際': '际', '無': '无', '熱': '热',
      '準': '准', '確': '确', '碼': '码', '礫': '砾', '竊': '窃', '築': '筑',
      '範': '范', '篤': '笃', '篩': '筛', '簡': '简', '籠': '笼', '糧': '粮',
      '繁': '繁', '紅': '红', '紀': '纪', '約': '约', '級': '级', '素': '素',
      '純': '纯', '紛': '纷', '納': '纳', '紙': '纸', '紐': '纽', '絆': '绊',
      '級': '级', '紡': '纺', '索': '索', '紫': '紫', '累': '累', '細': '细',
      '紳': '绅', '紹': '绍', '紺': '绀', '終': '终', '組': '组', '結': '结',
      '絕': '绝', '絲': '丝', '經': '经', '綁': '绑', '綜': '综', '綠': '绿',
      '綱': '纲', '網': '网', '維': '维', '綾': '绫', '綠': '绿', '綻': '绽',
      '緒': '绪', '綫': '线', '維': '维', '綜': '综', '綠': '绿', '綽': '绰',
      '線': '线', '縣': '县', '縛': '缚', '縫': '缝', '縮': '缩', '縱': '纵',
      '總': '总', '績': '绩', '繁': '繁', '緻': '致', '縮': '缩', '縱': '纵',
      '繃': '绷', '繪': '绘', '繩': '绳', '繼': '继', '續': '续', '纏': '缠',
      '宆': '穹', '寶': '宝', '將': '将', '專': '专', '尋': '寻', '導': '导',
      '屍': '尸', '屬': '属', '嵐': '岚', '網': '网', '輕': '轻', '較': '较',
      '輛': '辆', '輔': '辅', '輩': '辈', '輝': '辉', '輕': '轻', '輟': '辍',
      '輸': '输', '選': '选', '遜': '逊', '遙': '遥', '適': '适', '遺': '遗',
      '遲': '迟', '鄰': '邻', '鏈': '链', '鏡': '镜', '鎖': '锁', '鐵': '铁',
      '鑽': '钻', '鑰': '钥', '關': '关', '霧': '雾', '難': '难', '靈': '灵',
      '靜': '静', '靨': '靥', '靭': '韧', '頂': '顶', '響': '响', '預': '预',
      '頑': '顽', '頒': '颁', '頓': '顿', '頗': '颇', '領': '领', '頗': '颇',
      '頸': '颈', '顆': '颗', '題': '题', '顏': '颜', '願': '愿', '類': '类',
      '顧': '顾', '顯': '显', '顫': '颤', '顥': '颥', '顫': '颤', '顯': '显',
      '顧': '顾', '顏': '颜', '顆': '颗', '題': '题', '頓': '顿', '頒': '颁',
      '頑': '顽', '預': '预', '頗': '颇', '頗': '颇', '領': '领', '頸': '颈',
      '願': '愿', '類': '类', '顧': '顾', '顯': '显', '顫': '颤', '顥': '颥',
      '顫': '颤', '顯': '显', '顧': '顾', '顏': '颜', '顆': '颗', '題': '题',
      '頓': '顿', '頒': '颁', '頑': '顽', '預': '预', '頗': '颇', '頗': '颇',
      '領': '领', '頸': '颈', '願': '愿', '類': '类', '顧': '顾', '顯': '显',
      '顫': '颤', '顥': '颥', '顫': '颤', '顯': '显', '顧': '顾', '顏': '颜',
      '顆': '颗', '題': '题', '頓': '顿', '頒': '颁', '頑': '顽', '預': '预',
      '頗': '颇', '頗': '颇', '領': '领', '頸': '颈', '願': '愿', '類': '类',
      '顧': '顾', '顯': '显', '顫': '颤', '顥': '颥', '顫': '颤', '顯': '显',
      '顧': '顾', '顏': '颜', '顆': '颗', '題': '题', '頓': '顿', '頒': '颁',
      '頑': '顽', '預': '预', '頗': '颇', '頗': '颇', '領': '领', '頸': '颈',
      '願': '愿', '類': '类', '顧': '顾', '顯': '显', '顫': '颤', '顥': '颥',
      '顫': '颤', '顯': '显', '顧': '顾', '顏': '颜', '顆': '颗', '題': '题'
    };

    function toSimplified(text) {
      return text.split('').map(char => tradToSimp[char] || char).join('');
    }

    withTranslation.forEach(r => {
      const key = r.moveName.toLowerCase().replace(/['\s]/g, '');
      const trad = r.chineseName;
      const simp = toSimplified(trad);
      console.log(`"${key}": "${simp}",  // ${trad}`);
    });
  }
}

checkAllMoves().catch(console.error);
