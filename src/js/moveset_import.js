function placeBsBtn() {
	var importBtn = "<button id='import' class='bs-btn bs-btn-default'>Import</button>";
	$("#import-1_wrapper").append(importBtn);

	$("#import.bs-btn").click(function () {
		var pokes = document.getElementsByClassName("import-team-text")[0].value;
		var name = document.getElementsByClassName("import-name-text")[0].value.trim() === "" ? "Custom Set" : document.getElementsByClassName("import-name-text")[0].value;
		addSets(pokes, name);
	});
}

function ExportPokemon(pokeInfo) {
	var pokemon = createPokemon(pokeInfo);
	var gender = pokeInfo.find(".gender").val() || 'N';
	var EV_counter = 0;
	var finalText = checkExceptionsExport(pokemon.name);
	if (gender !== 'N') finalText += " (" + gender + ")";
	if (pokemon.item) finalText += " @ " + pokemon.item;
	finalText += "\n";
	if (pokemon.ability) finalText += "Ability: " + pokemon.ability + "\n";
	if (pokemon.level !== 100) finalText += "Level: " + pokemon.level + "\n";
	if (gen === 9) {
		var teraType = pokeInfo.find(".teraType").val();
		if (teraType !== undefined && teraType !== pokemon.types[0]) {
			finalText += "Tera Type: " + teraType + "\n";
		}
	}
	if (gen === 0 || gen > 2) {
		var EVs_Array = [];
		for (var stat in pokemon.evs) {
			var ev = pokemon.evs[stat] ? pokemon.evs[stat] : 0;
			if (ev > 0) {
				EVs_Array.push(ev + " " + calc.Stats.displayStat(stat));
			}
			EV_counter += ev;
			if (EV_counter > 510) break;
		}
		if (EVs_Array.length > 0) {
			finalText += "EVs: ";
			finalText += serialize(EVs_Array, " / ");
			finalText += "\n";
		}
	}
	if (pokemon.nature && gen > 2) finalText += pokemon.nature + " Nature" + "\n";
	var IVs_Array = [];
	for (var stat in pokemon.ivs) {
		var iv = pokemon.ivs[stat] ? pokemon.ivs[stat] : 0;
		if (iv < 31) {
			IVs_Array.push(iv + " " + calc.Stats.displayStat(stat));
		}
	}
	if (IVs_Array.length > 0) {
		finalText += "IVs: ";
		finalText += serialize(IVs_Array, " / ");
		finalText += "\n";
	}

	for (var i = 0; i < 4; i++) {
		var moveName = pokemon.moves[i].name;
		if (moveName !== "(No Move)") {
			finalText += "- " + moveName + "\n";
		}
	}
	finalText = finalText.trim();
	$("textarea.import-team-text").val(finalText);
}

$("#exportL").click(function () {
	ExportPokemon($("#p1"));
});

$("#exportR").click(function () {
	ExportPokemon($("#p2"));
});

// 收藏功能 - 直接从UI读取所有字段，绕过可能有bug的createPokemon和ExportPokemon
function ExportPokemonToString(pokeInfo) {
	// 获取宝可梦名称
	var setName = pokeInfo.find("input.set-selector").val();
	var pokemonName = setName;
	if (setName && setName.indexOf("(") !== -1) {
		pokemonName = setName.substring(0, setName.indexOf(" (")).trim();
	}

	// 开始构建导出文本
	var finalText = checkExceptionsExport(pokemonName);

	// 性别
	var gender = pokeInfo.find(".gender").val();
	if (gender && gender !== 'N') {
		finalText += " (" + gender + ")";
	}

	// 持有物
	var item = pokeInfo.find(".item").val();
	if (item) {
		finalText += " @ " + item;
	}
	finalText += "\n";

	// 特性
	var ability = pokeInfo.find(".ability").val();
	if (ability) {
		finalText += "Ability: " + ability + "\n";
	}

	// 等级
	var level = pokeInfo.find(".level").val();
	if (level && parseInt(level) !== 100) {
		finalText += "Level: " + level + "\n";
	}

	// Tera类型 (第9世代)
	if (typeof gen !== 'undefined' && gen === 9) {
		var teraType = pokeInfo.find(".teraType").val();
		if (teraType && teraType !== undefined) {
			finalText += "Tera Type: " + teraType + "\n";
		}
	}

	// EVs/SPs - 直接从UI读取（Champions模式使用sps，其他模式使用evs）
	var EVs_Array = [];
	var isChampionsMode = $("#champions").prop("checked");
	var evClass = isChampionsMode ? ".sps" : ".evs";
	var evLabel = isChampionsMode ? "SPs" : "EVs";
	// 使用LEGACY_STATS，因为HTML的父元素class使用legacy格式（hp, at, df, sa, sd, sp）
	var legacyStats = LEGACY_STATS[isChampionsMode ? 0 : 9];

	for (var i = 0; i < legacyStats.length; i++) {
		var legacyStat = legacyStats[i];
		var stat = legacyStatToStat(legacyStat); // 转换为显示用的标准格式
		var evVal = 0;
		if (pokeInfo.find("." + legacyStat + " " + evClass).length > 0) {
			evVal = parseInt(pokeInfo.find("." + legacyStat + " " + evClass).val()) || 0;
		}
		if (evVal > 0) {
			EVs_Array.push(evVal + " " + calc.Stats.displayStat(stat));
		}
	}
	if (EVs_Array.length > 0) {
		finalText += evLabel + ": ";
		finalText += serialize(EVs_Array, " / ");
		finalText += "\n";
	}

	// 性格 - 直接从UI读取
	var nature = pokeInfo.find(".nature").val();
	if (nature) {
		finalText += nature + " Nature\n";
	}

	// IVs - 直接从UI读取（使用相同的legacyStats）
	var IVs_Array = [];
	for (var i = 0; i < legacyStats.length; i++) {
		var legacyStat = legacyStats[i];
		var stat = legacyStatToStat(legacyStat);
		var ivVal = 31; // 默认31
		if (pokeInfo.find("." + legacyStat + " .ivs").length > 0) {
			ivVal = parseInt(pokeInfo.find("." + legacyStat + " .ivs").val()) || 31;
		}
		if (ivVal < 31) {
			IVs_Array.push(ivVal + " " + calc.Stats.displayStat(stat));
		}
	}
	if (IVs_Array.length > 0) {
		finalText += "IVs: ";
		finalText += serialize(IVs_Array, " / ");
		finalText += "\n";
	}

	// 招式
	for (var i = 1; i <= 4; i++) {
		var moveObj = pokeInfo.find(".move" + i + " select.move-selector");
		if (moveObj.length > 0) {
			var moveName = moveObj.val();
			if (moveName && moveName !== "(No Move)") {
				finalText += "- " + moveName + "\n";
			}
		}
	}

	return finalText.trim();
}

function addToFavorites(pokeInfo) {
	// 导出当前配置为文本
	var exportText = ExportPokemonToString(pokeInfo);

	// 获取宝可梦名称
	var pokemonName = pokeInfo.find(".set-selector").val();
	if (pokemonName && pokemonName.indexOf("(") !== -1) {
		pokemonName = pokemonName.substring(0, pokemonName.indexOf("(")).trim();
	}

	// 弹出对话框让用户输入收藏名称
	var favoriteName = prompt("为这个配置起个名字:", pokemonName || "我的配置");
	if (!favoriteName) return; // 用户取消

	// 调用现有的 addSets 函数保存配置
	addSets(exportText, favoriteName);

	// 提示用户
	alert("✅ 已收藏: " + favoriteName + "\n\n收藏的配置会出现在 " + pokemonName + " 的下拉菜单中");
}

$(document).ready(function () {
	// 左侧收藏按钮
	$("#favoriteL").click(function () {
		addToFavorites($("#p1"));
	});

	// 右侧收藏按钮
	$("#favoriteR").click(function () {
		addToFavorites($("#p2"));
	});

	// 打开收藏管理界面
	$("#manageFavorites").click(function () {
		openFavoritesManager();
	});

	// 关闭收藏管理界面
	$("#closeFavoritesModal").click(function () {
		$("#favoritesModal").fadeOut(200);
	});

	// 清空所有收藏
	$("#clearAllFavorites").click(function () {
		if (!confirm("确定要清空所有收藏配置吗？此操作不可恢复！")) {
			return;
		}

		localStorage.removeItem('customsets');

		// 清空所有 SETDEX 对象中的自定义配置
		var setdexObjects = [SETDEX_CHAMPIONS, SETDEX_SV, SETDEX_SS, SETDEX_SM, SETDEX_XY, SETDEX_BW, SETDEX_DPP, SETDEX_ADV, SETDEX_GSC, SETDEX_RBY];

		// 获取所有自定义配置的宝可梦名称
		if (localStorage.customsets) {
			var customsets = JSON.parse(localStorage.customsets);
			for (var pokemonName in customsets) {
				for (var i = 0; i < setdexObjects.length; i++) {
					if (setdexObjects[i][pokemonName]) {
						delete setdexObjects[i][pokemonName];
					}
				}
			}
		}

		alert("✅ 已清空所有收藏配置");
		$("#favoritesModal").fadeOut(200);

		// 刷新页面以更新下拉菜单
		setTimeout(function() {
			location.reload();
		}, 300);
	});
});

// 打开收藏管理器
function openFavoritesManager() {
	var customsets = localStorage.customsets ? JSON.parse(localStorage.customsets) : {};

	if (Object.keys(customsets).length === 0) {
		$("#favoritesList").html('<p style="text-align: center; color: #666; font-size: 18px;">暂无收藏配置</p>');
	} else {
		renderFavoritesList(customsets);
	}

	$("#favoritesModal").fadeIn(200);
}

// 渲染收藏列表
function renderFavoritesList(customsets) {
	var html = '<table style="width: 100%; border-collapse: collapse;">';
	html += '<thead><tr style="background: #e0e0e0;">';
	html += '<th style="padding: 12px; text-align: left; border-bottom: 2px solid #ccc;">宝可梦</th>';
	html += '<th style="padding: 12px; text-align: left; border-bottom: 2px solid #ccc;">配置名称</th>';
	html += '<th style="padding: 12px; text-align: left; border-bottom: 2px solid #ccc;">配置信息</th>';
	html += '<th style="padding: 12px; text-align: center; border-bottom: 2px solid #ccc;">操作</th>';
	html += '</tr></thead><tbody>';

	var count = 0;
	for (var pokemonName in customsets) {
		var sets = customsets[pokemonName];
		for (var setName in sets) {
			if (!sets[setName].isCustomSet) continue;

			var set = sets[setName];
			count++;

			var bgColor = count % 2 === 0 ? '#f9f9f9' : '#ffffff';

			html += '<tr style="background: ' + bgColor + ';">';
			html += '<td style="padding: 12px; border-bottom: 1px solid #ddd;"><strong>' + pokemonName + '</strong></td>';
			html += '<td style="padding: 12px; border-bottom: 1px solid #ddd;" id="setName_' + count + '">' + setName + '</td>';

			// 显示配置信息
			var info = [];
			if (set.ability) info.push('特性: ' + set.ability);
			if (set.item) info.push('道具: ' + set.item);
			if (set.nature) info.push('性格: ' + set.nature);
			var moves = set.moves ? set.moves.filter(function(m) { return m && m !== '(No Move)'; }).join(', ') : '';
			if (moves) info.push('招式: ' + moves.substring(0, 30) + (moves.length > 30 ? '...' : ''));

			html += '<td style="padding: 12px; border-bottom: 1px solid #ddd; font-size: 12px; color: #666;">' + info.join('<br>') + '</td>';
			html += '<td style="padding: 12px; border-bottom: 1px solid #ddd; text-align: center;">';
			html += '<button onclick="renameFavorite(\'' + pokemonName + '\', \'' + setName.replace(/'/g, "\\'") + '\', ' + count + ')" style="padding: 6px 12px; margin-right: 5px; cursor: pointer; background: #4CAF50; color: white; border: none; border-radius: 4px; font-size: 12px;">✏️ 改名</button>';
			html += '<button onclick="deleteSingleFavorite(\'' + pokemonName + '\', \'' + setName.replace(/'/g, "\\'") + '\')" style="padding: 6px 12px; cursor: pointer; background: #ff4444; color: white; border: none; border-radius: 4px; font-size: 12px;">🗑️ 删除</button>';
			html += '</td></tr>';
		}
	}

	html += '</tbody></table>';
	html += '<p style="text-align: center; margin-top: 15px; color: #666;">共 ' + count + ' 个收藏配置</p>';

	$("#favoritesList").html(html);
}

// 删除单个收藏
function deleteSingleFavorite(pokemonName, setName) {
	if (!confirm("确定要删除 \"" + setName + "\" 吗？")) {
		return;
	}

	var customsets = JSON.parse(localStorage.customsets);

	if (customsets[pokemonName] && customsets[pokemonName][setName]) {
		delete customsets[pokemonName][setName];

		// 如果该宝可梦没有其他收藏了，删除整个条目
		if (Object.keys(customsets[pokemonName]).length === 0) {
			delete customsets[pokemonName];
		}

		localStorage.customsets = JSON.stringify(customsets);

		// 从所有 SETDEX 对象中删除
		var setdexObjects = [SETDEX_CHAMPIONS, SETDEX_SV, SETDEX_SS, SETDEX_SM, SETDEX_XY, SETDEX_BW, SETDEX_DPP, SETDEX_ADV, SETDEX_GSC, SETDEX_RBY];
		for (var i = 0; i < setdexObjects.length; i++) {
			if (setdexObjects[i][pokemonName] && setdexObjects[i][pokemonName][setName]) {
				delete setdexObjects[i][pokemonName][setName];
			}
		}

		alert("✅ 已删除收藏: " + setName);

		// 重新加载列表
		openFavoritesManager();

		// 刷新页面以更新下拉菜单
		setTimeout(function() {
			location.reload();
		}, 100);
	} else {
		alert("❌ 未找到该收藏配置");
	}
}

// 重命名收藏
function renameFavorite(pokemonName, oldSetName, elementId) {
	var newName = prompt("请输入新的配置名称:", oldSetName);
	if (!newName || newName.trim() === "") {
		return;
	}

	newName = newName.trim();

	if (newName === oldSetName) {
		return;
	}

	var customsets = JSON.parse(localStorage.customsets);

	// 检查新名称是否已存在
	if (customsets[pokemonName] && customsets[pokemonName][newName]) {
		alert("❌ 配置名称 \"" + newName + "\" 已存在，请使用其他名称");
		return;
	}

	// 重命名
	if (customsets[pokemonName] && customsets[pokemonName][oldSetName]) {
		customsets[pokemonName][newName] = customsets[pokemonName][oldSetName];
		delete customsets[pokemonName][oldSetName];

		localStorage.customsets = JSON.stringify(customsets);

		// 更新所有 SETDEX 对象
		var setdexObjects = [SETDEX_CHAMPIONS, SETDEX_SV, SETDEX_SS, SETDEX_SM, SETDEX_XY, SETDEX_BW, SETDEX_DPP, SETDEX_ADV, SETDEX_GSC, SETDEX_RBY];
		for (var i = 0; i < setdexObjects.length; i++) {
			if (setdexObjects[i][pokemonName] && setdexObjects[i][pokemonName][oldSetName]) {
				setdexObjects[i][pokemonName][newName] = setdexObjects[i][pokemonName][oldSetName];
				delete setdexObjects[i][pokemonName][oldSetName];
			}
		}

		alert("✅ 已重命名为: " + newName);

		// 重新加载列表
		openFavoritesManager();

		// 刷新页面以更新下拉菜单
		setTimeout(function() {
			location.reload();
		}, 100);
	} else {
		alert("❌ 未找到该收藏配置");
	}
}

function serialize(array, separator) {
	var text = "";
	for (var i = 0; i < array.length; i++) {
		if (i < array.length - 1) {
			text += array[i] + separator;
		} else {
			text += array[i];
		}
	}
	return text;
}

function statToLegacyStat(stat) {
	switch (stat) {
	case 'hp':
		return "hp";
	case 'atk':
		return "at";
	case 'def':
		return "df";
	case 'spa':
		return "sa";
	case 'spd':
		return "sd";
	case 'spe':
		return "sp";
	}
}

function findSpecies(row) {
	row = row.split(/[()@]/);
	// Skip if the row contains the ability As One (Spectrier / Glastrier),
	// so that it is not treated as a separate Pokemon.
	if (row.length > 0 && row[0].includes('As One')) return {offset: undefined};
	var name;
	var offset;
	for (var j = 0; j < row.length && offset === undefined; j++) {
		name = checkExceptionsImport(row[j].trim());
		if (calc.SPECIES[9][name] !== undefined) offset = j;
	}
	return {name: name, offset: offset};
}

function getGender(currentRow, j) {
	var gender;
	for (; j < currentRow.length; j++) {
		gender = currentRow[j].trim();
		if (gender === 'M' || gender === 'F' || gender === 'N') return gender;
	}
}

function getItem(currentRow, j) {
	var item;
	for (; j < currentRow.length; j++) {
		item = currentRow[j].trim();
		if (calc.ITEMS[9].indexOf(item) !== -1) return item;
	}
}

function getStats(currentPoke, rows, x) {
	currentPoke.nature = "Serious";
	var currentEV;
	var currentIV;
	var currentNature;
	currentPoke.level = 100;
	for (; x < rows.length && findSpecies(rows[x]).offset === undefined; x++) {
		var currentRow = rows[x] ? rows[x].split(/[/:]/) : '';
		var evs = {};
		var ivs = {};
		var ev;
		var ability;
		var teraType;
		var j;

		switch (currentRow[0]) {
		case 'Level':
			currentPoke.level = parseInt(currentRow[1].trim());
			break;
		case 'EVs':
		case 'SPs':
			for (j = 1; j < currentRow.length; j++) {
				currentEV = currentRow[j].trim().split(" ");
				currentEV[1] = statToLegacyStat(currentEV[1].toLowerCase());
				evs[currentEV[1]] = parseInt(currentEV[0]);
			}
			currentPoke[$('#champions').prop('checked') ? 'sps' : 'evs'] = evs;
			break;
		case 'IVs':
			for (j = 1; j < currentRow.length; j++) {
				currentIV = currentRow[j].trim().split(" ");
				currentIV[1] = statToLegacyStat(currentIV[1].toLowerCase());
				ivs[currentIV[1]] = parseInt(currentIV[0]);
			}
			currentPoke.ivs = ivs;
			break;
		case 'Ability':
			ability = currentRow[1] ? currentRow[1].trim() : '';
			if (calc.ABILITIES[9].indexOf(ability) !== -1) currentPoke.ability = ability;
			break;
		case 'Tera Type':
			teraType = currentRow[1] ? currentRow[1].trim() : '';
			if (Object.keys(calc.TYPE_CHART[9]).slice(1).indexOf(teraType) !== -1) currentPoke.teraType = teraType;
			break;
		}

		currentNature = rows[x] ? rows[x].trim().split(" ") : '';
		if (currentNature[1] === "Nature" && currentNature[0] != "-") currentPoke.nature = currentNature[0];
	}
	return currentPoke;
}

function getMoves(currentPoke, rows, x) {
	var movesFound = false;
	var move;
	var moves = [];
	for (; x < rows.length && findSpecies(rows[x]).offset === undefined; x++) {
		if (rows[x]) {
			if (rows[x][0] === "-") {
				movesFound = true;
				move = rows[x].slice(2).replace("[", "").replace("]", "").trim().replace(/\s+/g, " ");
				moves.push(move);
			} else if (movesFound === true) {
				break;
			}
		}
	}
	currentPoke.moves = moves;
	return currentPoke;
}

function addToDex(poke) {
	var dexObject = {};
	if ($("#randoms").prop("checked")) {
		if (GEN9RANDOMBATTLE[poke.name] == undefined) GEN9RANDOMBATTLE[poke.name] = {};
		if (GEN8RANDOMBATTLE[poke.name] == undefined) GEN8RANDOMBATTLE[poke.name] = {};
		if (GEN7RANDOMBATTLE[poke.name] == undefined) GEN7RANDOMBATTLE[poke.name] = {};
		if (GEN6RANDOMBATTLE[poke.name] == undefined) GEN6RANDOMBATTLE[poke.name] = {};
		if (GEN5RANDOMBATTLE[poke.name] == undefined) GEN5RANDOMBATTLE[poke.name] = {};
		if (GEN4RANDOMBATTLE[poke.name] == undefined) GEN4RANDOMBATTLE[poke.name] = {};
		if (GEN3RANDOMBATTLE[poke.name] == undefined) GEN3RANDOMBATTLE[poke.name] = {};
		if (GEN2RANDOMBATTLE[poke.name] == undefined) GEN2RANDOMBATTLE[poke.name] = {};
		if (GEN1RANDOMBATTLE[poke.name] == undefined) GEN1RANDOMBATTLE[poke.name] = {};
	} else {
		if (SETDEX_CHAMPIONS[poke.name] == undefined) SETDEX_CHAMPIONS[poke.name] = {};
		if (SETDEX_SV[poke.name] == undefined) SETDEX_SV[poke.name] = {};
		if (SETDEX_SS[poke.name] == undefined) SETDEX_SS[poke.name] = {};
		if (SETDEX_SM[poke.name] == undefined) SETDEX_SM[poke.name] = {};
		if (SETDEX_XY[poke.name] == undefined) SETDEX_XY[poke.name] = {};
		if (SETDEX_BW[poke.name] == undefined) SETDEX_BW[poke.name] = {};
		if (SETDEX_DPP[poke.name] == undefined) SETDEX_DPP[poke.name] = {};
		if (SETDEX_ADV[poke.name] == undefined) SETDEX_ADV[poke.name] = {};
		if (SETDEX_GSC[poke.name] == undefined) SETDEX_GSC[poke.name] = {};
		if (SETDEX_RBY[poke.name] == undefined) SETDEX_RBY[poke.name] = {};
	}
	if (poke.ability !== undefined) {
		dexObject.ability = poke.ability;
	}
	if (poke.teraType !== undefined) {
		dexObject.teraType = poke.teraType;
	}
	if (poke.sps !== undefined) {
		dexObject.sps = poke.sps;
	}
	dexObject.level = poke.level;
	dexObject.evs = poke.evs;
	dexObject.ivs = poke.ivs;
	dexObject.moves = poke.moves;
	dexObject.nature = poke.nature;
	dexObject.gender = poke.gender;
	dexObject.item = poke.item;
	dexObject.isCustomSet = poke.isCustomSet;
	var customsets;
	if (localStorage.customsets) {
		customsets = JSON.parse(localStorage.customsets);
	} else {
		customsets = {};
	}
	if (!customsets[poke.name]) {
		customsets[poke.name] = {};
	}
	customsets[poke.name][poke.nameProp] = dexObject;
	if (poke.name === "Aegislash-Blade") {
		if (!customsets["Aegislash-Shield"]) customsets["Aegislash-Shield"] = {};
		if (!customsets["Aegislash-Both"]) customsets["Aegislash-Both"] = {};
		customsets["Aegislash-Shield"][poke.nameProp] = dexObject;
		customsets["Aegislash-Both"][poke.nameProp] = dexObject;
	}
	updateDex(customsets);
}

function updateDex(customsets) {
	for (var pokemon in customsets) {
		for (var moveset in customsets[pokemon]) {
			if (!SETDEX_CHAMPIONS[pokemon]) SETDEX_CHAMPIONS[pokemon] = {};
			SETDEX_CHAMPIONS[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_SV[pokemon]) SETDEX_SV[pokemon] = {};
			SETDEX_SV[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_SS[pokemon]) SETDEX_SS[pokemon] = {};
			SETDEX_SS[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_SM[pokemon]) SETDEX_SM[pokemon] = {};
			SETDEX_SM[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_XY[pokemon]) SETDEX_XY[pokemon] = {};
			SETDEX_XY[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_BW[pokemon]) SETDEX_BW[pokemon] = {};
			SETDEX_BW[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_DPP[pokemon]) SETDEX_DPP[pokemon] = {};
			SETDEX_DPP[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_ADV[pokemon]) SETDEX_ADV[pokemon] = {};
			SETDEX_ADV[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_GSC[pokemon]) SETDEX_GSC[pokemon] = {};
			SETDEX_GSC[pokemon][moveset] = customsets[pokemon][moveset];
			if (!SETDEX_RBY[pokemon]) SETDEX_RBY[pokemon] = {};
			SETDEX_RBY[pokemon][moveset] = customsets[pokemon][moveset];
		}
	}
	localStorage.customsets = JSON.stringify(customsets);
}

function addSets(pokes, name) {
	var rows = pokes.split("\n");
	var currentRow;
	var species;
	var currentPoke;
	var addedPokes = 0;
	for (var i = 0; i < rows.length; i++) {
		species = findSpecies(rows[i]);
		if (species.offset !== undefined) {
			currentRow = rows[i].split(/[()@]/);
			currentPoke = JSON.parse(JSON.stringify(calc.SPECIES[9][species.name]));
			currentPoke.name = species.name;
			currentPoke.gender = getGender(currentRow, species.offset + 1);
			currentPoke.item = getItem(currentRow, species.offset + 1);
			currentPoke = getStats(currentPoke, rows, i + 1);
			currentPoke = getMoves(currentPoke, rows, i + 1);
			if (species.offset === 1 && currentRow[0].trim()) {
				currentPoke.nameProp = currentRow[0].trim();
			} else {
				currentPoke.nameProp = name;
			}
			currentPoke.isCustomSet = true;
			addToDex(currentPoke);
			addedPokes++;
		}
	}
	if (addedPokes > 0) {
		alert("Successfully imported " + addedPokes + (addedPokes === 1 ? " set" : " sets"));
		$(allPokemon("#importedSetsOptions")).css("display", "inline");
	} else {
		alert("No sets imported, please check your syntax and try again");
	}
}

function checkExceptionsImport(poke) {
	switch (poke) {
	case 'Alcremie-Vanilla-Cream':
	case 'Alcremie-Ruby-Cream':
	case 'Alcremie-Matcha-Cream':
	case 'Alcremie-Mint-Cream':
	case 'Alcremie-Lemon-Cream':
	case 'Alcremie-Salted-Cream':
	case 'Alcremie-Ruby-Swirl':
	case 'Alcremie-Caramel-Swirl':
	case 'Alcremie-Rainbow-Swirl':
		poke = "Alcremie";
		break;
	case 'Aegislash':
	case 'Aegislash-Both':
		poke = "Aegislash-Blade";
		break;
	case 'Basculin-Red-Striped':
		poke = "Basculin";
		break;
	case 'Burmy-Plant':
	case 'Burmy-Sandy':
	case 'Burmy-Trash':
		poke = "Burmy";
		break;
	case 'Calyrex-Ice-Rider':
		poke = "Calyrex-Ice";
		break;
	case 'Calyrex-Shadow-Rider':
		poke = "Calyrex-Shadow";
		break;
	case 'Deerling-Summer':
	case 'Deerling-Autumn':
	case 'Deerling-Winter':
	case 'Deerling-Spring':
		poke = "Deerling";
		break;
	case 'Flabébé-Blue':
	case 'Flabébé-Orange':
	case 'Flabébé-Red':
	case 'Flabébé-White':
	case 'Flabébé-Yellow':
	case 'Flabebe':
	case 'Flabebe-Blue':
	case 'Flabebe-Orange':
	case 'Flabebe-Red':
	case 'Flabebe-White':
	case 'Flabebe-Yellow':
		poke = "Flabébé";
		break;
	case 'Floette-Blue':
	case 'Floette-Orange':
	case 'Floette-Red':
	case 'Floette-White':
	case 'Floette-Yellow':
		poke = "Floette";
		break;
	case 'Florges-Blue':
	case 'Florges-Orange':
	case 'Florges-Red':
	case 'Florges-White':
	case 'Florges-Yellow':
		poke = "Florges";
		break;
	case 'Furfrou-Dandy':
	case 'Furfrou-Debutante':
	case 'Furfrou-Diamond':
	case 'Furfrou-Heart':
	case 'Furfrou-Kabuki':
	case 'Furfrou-La-Reine':
	case 'Furfrou-Matron':
	case 'Furfrou-Natural':
	case 'Furfrou-Pharaoh':
	case 'Furfrou-Star':
		poke = "Furfrou";
		break;
	case 'Gastrodon-East':
	case 'Gastrodon-West':
		poke = "Gastrodon";
		break;
	case 'Giratina-Altered':
		poke = "Giratina";
		break;
	case 'Gourgeist-Average':
	case 'Gourgeist-Medium':
		poke = "Gourgeist";
		break;
	case 'Gourgeist-Jumbo':
		poke = "Gourgeist-Super";
		break;
	case 'Mimikyu-Busted-Totem':
		poke = "Mimikyu-Totem";
		break;
	case 'Mimikyu-Busted':
		poke = "Mimikyu";
		break;
	case 'Minior-Red':
	case 'Minior-Orange':
	case 'Minior-Yellow':
	case 'Minior-Green':
	case 'Minior-Blue':
	case 'Minior-Indigo':
	case 'Minior-Violet':
		poke = "Minior";
		break;
	case 'Poltchageist-Artisan':
	case 'Poltchageist-Counterfeit':
		poke = "Poltchageist";
		break;
	case 'Polteageist-Antique':
	case 'Polteageist-Phony':
		poke = "Polteageist";
		break;
	case 'Pumpkaboo-Average':
	case 'Pumpkaboo-Medium':
		poke = "Pumpkaboo";
		break;
	case 'Pumpkaboo-Jumbo':
		poke = "Pumpkaboo-Super";
		break;
	case 'Sawsbuck-Summer':
	case 'Sawsbuck-Autumn':
	case 'Sawsbuck-Winter':
	case 'Sawsbuck-Spring':
		poke = "Sawsbuck";
		break;
	case 'Shellos-East':
	case 'Shellos-West':
		poke = "Shellos";
		break;
	case 'Sinistcha-Masterpiece':
	case 'Sinistcha-Unremarkable':
		poke = "Sinistcha";
		break;
	case 'Sinistea-Antique':
	case 'Sinistea-Phony':
		poke = "Sinistea";
		break;
	case 'Tastugiri-Curly':
		poke = "Tatsugiri";
		break;
	case 'Unown-A':
	case 'Unown-B':
	case 'Unown-C':
	case 'Unown-D':
	case 'Unown-E':
	case 'Unown-F':
	case 'Unown-G':
	case 'Unown-H':
	case 'Unown-I':
	case 'Unown-J':
	case 'Unown-K':
	case 'Unown-L':
	case 'Unown-M':
	case 'Unown-N':
	case 'Unown-O':
	case 'Unown-P':
	case 'Unown-Q':
	case 'Unown-R':
	case 'Unown-S':
	case 'Unown-T':
	case 'Unown-U':
	case 'Unown-V':
	case 'Unown-W':
	case 'Unown-X':
	case 'Unown-Y':
	case 'Unown-Z':
	case 'Unown-Exclamation':
	case 'Unown-Question':
		poke = "Unown";
		break;
	case 'Vivillon-Archipelago':
	case 'Vivillon-Continental':
	case 'Vivillon-Elegant':
	case 'Vivillon-Garden':
	case 'Vivillon-High Plains':
	case 'Vivillon-Icy Snow':
	case 'Vivillon-Meadow':
	case 'Vivillon-Modern':
	case 'Vivillon-Monsoon':
	case 'Vivillon-Ocean':
	case 'Vivillon-Polar':
	case 'Vivillon-River':
	case 'Vivillon-Sandstorm':
	case 'Vivillon-Savanna':
	case 'Vivillon-Sun':
	case 'Vivillon-Tundra':
		poke = "Vivillon";
		break;
	case 'Vivillon-Pokéball':
		poke = "Vivillon-Pokeball";
		break;
	case 'Wormadam-Plant':
		poke = "Wormadam";
		break;
	case 'Xerneas-Neutral':
		poke = "Xerneas";
		break;
	}
	return poke;
}

function checkExceptionsExport(name) {
	switch (name) {
	case 'Aegislash-Shield':
	case 'Aegislash-Both':
		name = "Aegislash";
		break;
	}
	return name;
}

$(allPokemon("#clearSets")).click(function () {
	if (confirm("Are you sure you want to delete your custom sets? This action cannot be undone.")) {
		localStorage.removeItem("customsets");
		alert("Custom Sets successfully cleared. Please refresh the page.");
		$(allPokemon("#importedSetsOptions")).hide();
		loadDefaultLists();
	}
});

$(allPokemon("#importedSets")).click(function () {
	var pokeID = $(this).parent().parent().prop("id");
	var showCustomSets = $(this).prop("checked");
	if (showCustomSets) {
		loadCustomList(pokeID);
	} else {
		loadDefaultLists();
	}
});

$(document).ready(function () {
	var customSets;
	placeBsBtn();
	if (localStorage.customsets) {
		customSets = JSON.parse(localStorage.customsets);
		updateDex(customSets);
		$(allPokemon("#importedSetsOptions")).css("display", "inline");
	} else {
		loadDefaultLists();
	}
});
