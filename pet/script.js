(() => {
  "use strict";
  const DS = window.DetectiveSystem;
  const $ = id => document.getElementById(id);
  let selectedEgg = "dog";
  let selectedMats = new Set();
  let growthKey = "";

  // 每個階段的移動節奏：幼年期急、成熟期穩。
  const STAGE_PACE = [1150, 800, 1100, 1450];
  const STAGE_TALK = {
    1:{ come:["咚咚咚——我來了！","等等我，我用跑的！","我來了我來了！"],
        idle:["這裡有什麼？","嗅嗅……好像有味道。","再看一下下就好。"],
        pat:["嘿嘿，好舒服！","再摸一下嘛～","你的手好溫暖。"] },
    2:{ come:["聽到你叫我了。","來了！剛剛在練跳躍。","馬上到。"],
        idle:["我想玩線索球。","這個角落我還沒查過。","巡邏一圈再回來。"],
        pat:["你今天也有來看我。","被你摸到就想睡了。","我有變強一點吧？"] },
    3:{ come:["我在。","慢慢走過去。","需要我嗎？"],
        idle:["把線索排整齊。","我在這裡陪你。","你休息一下也沒關係。"],
        pat:["謝謝你一直照顧我。","我們一起走了好久了。","我記得你每一次的摸摸。"] }
  };
  const pick = list => list[Math.floor(Math.random() * list.length)];
  function stageTalk(kind, fallback) {
    const pet = DS.state.pet;
    const pack = pet && STAGE_TALK[pet.stage];
    return pack && pack[kind] ? pick(pack[kind]) : fallback;
  }
  function timeLine() {
    const hour = new Date().getHours();
    if (hour < 6) return "夜深了，你也早點休息。";
    if (hour < 11) return "早安，今天想先查哪一館？";
    if (hour < 18) return "下午了，做一題再休息一下。";
    return "晚上光線暗，別盯螢幕太久。";
  }
  function emote(symbol) {
    const wrap = $("pet-avatar-wrap");
    if (!wrap) return;
    const node = document.createElement("span");
    node.className = "pet-emote";
    node.textContent = symbol;
    wrap.appendChild(node);
    setTimeout(() => node.remove(), 1200);
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    })[char]);
  }
  function favoriteName(species) {
    return (DS.petItems[species.favorite] || {}).name || "陪伴";
  }
  function speciesCard(species, mode) {
    const status = DS.petSpeciesStatus(species.id);
    const owned = !!DS.state.pets[species.id];
    const active = DS.state.activePetId === species.id;
    const pet = DS.state.pets[species.id];
    let action = "";
    if (mode === "adopt") {
      action = `<small>${species.starter ? "初始夥伴" : esc(status.reason)}</small>`;
    } else if (owned) {
      action = `<button data-switch="${species.id}" ${active ? "disabled" : ""}>${active ? "目前夥伴" : "切換夥伴"}</button>`;
    } else {
      action = `<button data-adopt-new="${species.id}" ${status.unlocked ? "" : "disabled"}>
        ${status.unlocked ? "領養" : "尚未解鎖"}</button><small>${esc(status.reason)}</small>`;
    }
    const preview = owned && pet.stage === 0
      ? species.stages[0]
      : `<img src="${DS.petImageUrl(species.id, owned ? pet.stage : 1)}" onerror="this.onerror=null;this.src='${DS.petImageUrl(species.id)}'" alt="${esc(species.name)}">`;
    return `<article class="species-card ${active ? "active" : ""} ${status.unlocked ? "" : "locked"}"
      ${mode === "adopt" && status.unlocked ? `data-egg="${species.id}"` : ""}>
      <span class="species-emoji">${preview}</span>
      <div><strong>${owned ? esc(pet.name) : esc(species.name)}</strong>
      <p>${esc(species.personality)}</p><small>最喜歡：${esc(favoriteName(species))}</small></div>${action}
    </article>`;
  }

  function renderAdopt() {
    const starters = Object.values(DS.petSpecies).filter(species => species.starter);
    $("egg-choices").innerHTML = starters.map(species => speciesCard(species, "adopt")).join("");
    document.querySelectorAll("[data-egg]").forEach(card => {
      card.classList.toggle("selected", card.dataset.egg === selectedEgg);
      card.onclick = () => { selectedEgg = card.dataset.egg; renderAdopt(); };
    });
  }
  $("btn-adopt").onclick = () => {
    const result = DS.adoptPet(selectedEgg, $("pet-name-input").value);
    $("adopt-message").textContent = result.msg;
    if (result.success) renderAll();
  };

  function moodLine(status) {
    if (status.pet.stage === 0) return "蛋殼偶爾晃一下。先從喜歡的兩館取得材料，就能迎接孵化。";
    if (status.sick) return "牠看起來沒精神，喝一瓶活力飲就會好起來。";
    if (status.hunger < 30) return "牠的肚子咕嚕咕嚕叫，一直看著食盆。";
    if (status.mood < 30) return "牠有點無聊，正在等你拿玩具過來。";
    if (status.hunger > 70 && status.mood > 70) return "牠精神飽滿，正在房間裡開心地跑來跑去！";
    return "牠靜靜陪在桌邊，等你完成任務回來。";
  }
  function roomInfo(roomId) {
    if (roomId === "study") return { name:"偵探書房", emoji:"🗂️" };
    const room = DS.petCosmetics[roomId];
    return { name:room ? room.name : "偵探書房", emoji:room ? room.emoji : "🗂️" };
  }
  function renderGrowth(status) {
    $("growth-track").innerHTML = DS.petStageInfo.map(info => {
      const state = info.stage === status.pet.stage ? "current" : info.stage < status.pet.stage ? "done" : "";
      return `<div class="growth-step ${state}"><b>${info.icon} ${esc(info.name)}</b>${esc(info.tone)}</div>`;
    }).join("");
    $("growth-note").textContent = `${status.stageInfo.desc}　${status.stageInfo.ability}`;
  }

  function renderPet() {
    const status = DS.petStatus();
    const pet = status.pet, species = status.species;
    $("pet-species").textContent = species.name;
    $("pet-name").textContent = pet.name;
    $("pet-stage").textContent = `${status.stageInfo.icon} ${status.stageName}`;
    $("pet-stage").dataset.stage = String(pet.stage);
    $("pet-count").textContent = `收藏 ${status.ownedCount}/9`;
    renderGrowth(status);
    if (pet.stage === 0) {
      $("pet-avatar").classList.remove("pixel");
      $("pet-avatar").textContent = status.emoji;
    } else {
      $("pet-avatar").classList.add("pixel");
      $("pet-avatar").innerHTML = `<img src="${DS.petImageUrl(pet.species, pet.stage)}" onerror="this.onerror=null;this.src='${DS.petImageUrl(pet.species)}'" alt="${esc(pet.name)}">`;
    }
    $("pet-avatar-wrap").dataset.stage = String(pet.stage);
    $("pet-avatar-wrap").dataset.species = pet.species;
    $("pet-avatar-wrap").classList.toggle("trusted", status.bond >= 25);
    $("pet-accessory").textContent = status.accessory === "none" ? "" : ((DS.petCosmetics[status.accessory] || {}).emoji || "");
    $("pet-stage-emblem").textContent = pet.stage ? status.stageInfo.icon : "";
    $("pet-room").dataset.petStage = String(pet.stage);
    $("habitat-help").textContent = [
      "先摸摸蛋殼；湊齊兩館材料就會孵化。",
      "幼年期會跌跌撞撞跑來；餵食和摸摸最適合牠。",
      "少年期可點玩具丟球，牠會快速跑去追。",
      "成熟期可啟動陪讀；牠會守在題目旁，不撒嬌遮題。"
    ][pet.stage] || "點房間和牠互動。";
    $("pet-line").textContent = moodLine(status);
    $("pet-personality").textContent = `${species.personality}　最喜歡：${favoriteName(species)}。`;
    $("pet-bond").textContent = status.bond;
    $("bond-levels").innerHTML = DS.petBondLevels.map(level => {
      const unlocked = status.bond >= level.min;
      return `<span class="${unlocked ? "unlocked" : ""}" title="${esc(level.desc)}">${unlocked ? "✓" : "🔒"} ${esc(level.name)} <small>${level.min}</small></span>`;
    }).join("");
    const room = roomInfo(status.room);
    $("pet-room").className = `pet-stage-card room-${status.room}`;
    $("room-label").textContent = `${room.emoji} ${room.name}`;

    $("stat-hunger").style.width = status.hunger + "%";
    $("stat-hunger").classList.toggle("low", status.hunger < 30);
    $("stat-hunger-num").textContent = status.hunger;
    $("stat-mood").style.width = status.mood + "%";
    $("stat-mood").classList.toggle("low", status.mood < 30);
    $("stat-mood-num").textContent = status.mood;

    const inv = DS.state.inventory;
    const acts = [
      { id:"petFood",label:"🍖 餵飼料",count:inv.petFood || 0 },
      { id:"petSnack",label:"🍮 給點心",count:inv.petSnack || 0 },
      { id:"petToy",label:"🧶 玩玩具",count:inv.petToy || 0 },
      { id:"petMed",label:"🧃 活力飲",count:inv.petMed || 0 }
    ];
    const studyActive = DS.petStudyActive(pet);
    const studyRemain = studyActive ? Math.max(1, Math.ceil((pet.studyUntil - Date.now()) / 60000)) : 10;
    $("pet-actions").innerHTML = acts.map(action => `
      <button data-use="${action.id}" ${action.count < 1 ? "disabled" : ""}>${action.label}<small>背包 ×${action.count}</small></button>
    `).join("") + `<button data-pat>🤚 摸摸牠<small>今天 ${pet.petsToday}/5</small></button>
      <button data-study ${pet.stage < 3 || studyActive ? "disabled" : ""}>📚 ${studyActive ? "陪讀中" : "陪我複習"}<small>${pet.stage < 3 ? "成熟期解鎖" : studyActive ? `剩 ${studyRemain} 分鐘` : "安靜陪讀 10 分鐘"}</small></button>`;
    document.querySelectorAll("[data-use]").forEach(button => button.onclick = () => react(DS.petUse(button.dataset.use)));
    document.querySelector("[data-pat]").onclick = () => react(DS.petPat());
    document.querySelector("[data-study]").onclick = () => {
      const result = DS.startPetStudy(10);
      habitatSpeak(result.msg, 2600);
      react(result);
    };
    renderWish(status.wish);
  }

  function renderWish(wish) {
    if (!wish) {
      $("wish-progress").textContent = "孵化後開放";
      $("wish-label").textContent = "夥伴還在蛋裡；孵化後每天會提出一個短任務。";
      $("wish-reward").textContent = "";
      return;
    }
    $("wish-progress").textContent = wish.done ? "✓ 已完成" : `${wish.progress || 0} / ${wish.goal}`;
    $("wish-label").textContent = wish.done ? `今天的願望完成：${wish.label}` : wish.label;
    $("wish-reward").textContent = `完成獎勵：${wish.reward}。每日依裝置所在地午夜更新。`;
    $("wish-label").classList.toggle("done", wish.done);
  }
  function react(result) {
    $("pet-message").textContent = result.msg;
    if (result.success) {
      const avatar = $("pet-avatar");
      avatar.classList.remove("bounce"); void avatar.offsetWidth; avatar.classList.add("bounce");
      if (result.hatched) DS.toast("🎉 偵探蛋孵化了！");
    }
    renderAll();
  }

  let habitatTimer = null;
  let habitatMoveTimer = null;
  function habitatSpeak(message, duration=1800) {
    const bubble = $("habitat-speech");
    if (!bubble) return;
    bubble.textContent = message;
    bubble.classList.add("show");
    clearTimeout(bubble._hideTimer);
    bubble._hideTimer = setTimeout(() => bubble.classList.remove("show"), duration);
  }
  function throwBall() {
    const habitat = $("pet-habitat");
    const ball = $("habitat-ball");
    const ratio = .22 + Math.random() * .56;
    if (!habitat || !ball) return ratio;
    ball.classList.add("show");
    ball.style.left = `${Math.max(10, (habitat.clientWidth - 36) * ratio)}px`;
    ball.style.bottom = "92px";
    setTimeout(() => { ball.style.bottom = "22px"; }, 280);
    return ratio;
  }
  function hideBall() {
    const ball = $("habitat-ball");
    if (ball) ball.classList.remove("show");
  }
  function moveHabitat(ratio, message, mode="idle") {
    const habitat = $("pet-habitat");
    const wrap = $("pet-avatar-wrap");
    if (!habitat || !wrap) return;
    clearTimeout(habitatMoveTimer);
    const max = Math.max(8, habitat.clientWidth - wrap.offsetWidth - 8);
    const target = Math.max(8, Math.min(max, max * ratio));
    const current = parseFloat(wrap.style.left) || max * .44;
    const pace = STAGE_PACE[(DS.state.pet && DS.state.pet.stage) || 0] || 1150;
    wrap.classList.remove("sleeping");
    wrap.classList.add("walking");
    wrap.style.transitionDuration = `${pace / 1000}s`;
    wrap.style.setProperty("--habitat-face", target < current ? "-1" : "1");
    wrap.style.left = `${target}px`;
    if (message) habitatSpeak(message);
    habitatMoveTimer = setTimeout(() => {
      wrap.classList.remove("walking");
      wrap.classList.toggle("sleeping", mode === "sleep");
    }, pace);
  }
  function scheduleHabitat(delay=3500) {
    clearTimeout(habitatTimer);
    habitatTimer = setTimeout(() => {
      const screen = $("screen-pet");
      const pet = DS.state.pet;
      if (!screen || screen.classList.contains("hidden") || !pet) {
        scheduleHabitat(2500);
        return;
      }
      if (pet.stage === 0) {
        moveHabitat(.45 + Math.random() * .12, "蛋殼輕輕晃了一下。");
      } else if (pet.hunger < 45) {
        moveHabitat(.03, "聞聞食盆……好像有點餓。");
      } else if (pet.mood < 45) {
        moveHabitat(.65, "想玩線索球！");
      } else {
        const common = [
          { ratio:.18, msg:"四處巡邏中。", mode:"idle" },
          { ratio:.62, msg:"找到玩具了！", mode:"idle" },
          { ratio:.9, msg:"先在小床休息一下。", mode:"sleep" }
        ];
        const personality = {
          dog:{ ratio:.66, msg:"嗅嗅……線索球在這裡！", mode:"idle" },
          cat:{ ratio:.88, msg:"我在床邊安靜觀察。", mode:"sleep" },
          rabbit:{ ratio:.3, msg:"跳到另一邊看看！", mode:"idle" },
          hamster:{ ratio:.08, msg:"食盆旁有小東西可以收藏。", mode:"idle" },
          owl:{ ratio:.84, msg:"先讀完這份證詞。", mode:"sleep" },
          fox:{ ratio:.55, msg:"尾巴發現可疑光點。", mode:"idle" },
          bear:{ ratio:.9, msg:"把小床整理舒服。", mode:"sleep" },
          penguin:{ ratio:.18, msg:"物品要排整齊。", mode:"idle" },
          dragon:{ ratio:.52, msg:"感覺到新的線索能量！", mode:"idle" }
        };
        // 階段差異：幼年期小碎步、少年期跑大範圍、成熟期定點久待。
        const byStage = {
          1:[{ ratio:.34, msg:"這邊！那邊！", mode:"idle" }, { ratio:.5, msg:"跑一跑好開心。", mode:"idle" }],
          2:[{ ratio:.72, msg:"我可以跑到最遠那頭！", mode:"idle" }, { ratio:.12, msg:"再繞回來看看。", mode:"idle" }],
          3:[{ ratio:.46, msg:"站在這裡就看得到你。", mode:"idle" }, { ratio:.88, msg:"我在小床邊守著。", mode:"sleep" }]
        };
        const choices = common
          .concat(pet.bond >= 8 && personality[pet.species] ? [personality[pet.species]] : [])
          .concat(byStage[pet.stage] || []);
        const choice = pick(choices);
        moveHabitat(choice.ratio, Math.random() < .22 ? timeLine() : stageTalk("idle", choice.msg), choice.mode);
      }
      const rest = pet.stage === 1 ? 3400 : pet.stage === 3 ? 7200 : 5200;
      scheduleHabitat(rest + Math.random() * 4200);
    }, delay);
  }
  function bindHabitat() {
    const habitat = $("pet-habitat");
    if (!habitat || habitat.dataset.bound) return;
    habitat.dataset.bound = "1";
    habitat.addEventListener("click", event => {
      if (event.target.closest("[data-habitat],#pet-avatar-wrap")) return;
      const rect = habitat.getBoundingClientRect();
      moveHabitat((event.clientX - rect.left) / rect.width, stageTalk("come", "我來了！"));
    });
    $("pet-avatar-wrap").addEventListener("click", () => {
      const result = DS.petPat();
      habitatSpeak(result.success ? stageTalk("pat", result.msg) : result.msg);
      if (result.success) emote(pick(["❤️","✨","🎵"]));
      react(result);
    });
    document.querySelectorAll("[data-habitat]").forEach(button => {
      button.addEventListener("click", () => {
        const action = button.dataset.habitat;
        const pet = DS.state.pet;
        if (action === "bed") {
          moveHabitat(.9, "蓋好被子，休息一下。", "sleep");
          emote("💤");
          $("pet-message").textContent = "休息不會消耗用品，牠只是安靜睡一會兒。";
          return;
        }
        const itemId = action === "food" ? "petFood" : "petToy";
        // 少年期起解鎖丟球：球先飛出去，夥伴自己去追。
        const canThrow = action === "toy" && pet && pet.stage >= 2 && (DS.state.inventory.petToy || 0) >= 1;
        const ratio = canThrow ? throwBall() : action === "food" ? .03 : .65;
        moveHabitat(ratio, canThrow ? "球飛出去了，我去追！" : action === "food" ? "開飯囉！" : "來玩線索球！");
        setTimeout(() => {
          if (canThrow) hideBall();
          const result = DS.petUse(itemId);
          habitatSpeak(result.msg);
          if (result.success) emote(action === "food" ? "🍖" : "🎵");
          react(result);
        }, canThrow ? 1000 : 850);
      });
    });
    scheduleHabitat();
  }

  function renderCollection() {
    const all = Object.values(DS.petSpecies);
    $("lifetime-coins").textContent = DS.state.coinsEarned;
    $("collection-count").textContent = `${DS.ownedPetIds().length} / ${all.length}`;
    $("collection-list").innerHTML = all.map(species => speciesCard(species, "collection")).join("");
    document.querySelectorAll("[data-switch]").forEach(button => {
      button.onclick = () => {
        const result = DS.switchPet(button.dataset.switch);
        $("collection-message").textContent = result.msg; renderAll();
      };
    });
    document.querySelectorAll("[data-adopt-new]").forEach(button => {
      button.onclick = () => {
        const result = DS.adoptPet(button.dataset.adoptNew, $("new-pet-name").value);
        $("collection-message").textContent = result.msg;
        if (result.success) $("new-pet-name").value = "";
        renderAll();
      };
    });
  }

  function renderEvolve() {
    const pet = DS.state.pet;
    const nextKey = pet ? `${pet.species}:${pet.stage}` : "none";
    if (growthKey !== nextKey) { growthKey = nextKey; selectedMats = new Set(); }
    const route = pet && pet.stage < 3 ? DS.petRouteFor(pet) : [];
    selectedMats = new Set([...selectedMats].filter(id => route.includes(id) && (DS.state.petMat[id] || 0) > 0));
    const check = DS.petEvolveCheck([...selectedMats]);
    $("evolve-status").textContent = check.msg;
    $("btn-evolve").disabled = !check.ready;
    $("btn-evolve").textContent = pet && pet.stage === 0 ? "🐣 孵化目前夥伴" : "✨ 讓目前夥伴進化";
    let goal = "先領養一位偵探夥伴。";
    if (pet && pet.stage < 3) {
      const need = DS.petEvolveRules[pet.stage].kinds;
      const stageGoal = pet.stage === 0 ? "孵化" : pet.stage === 1 ? "進入少年期" : "進入成熟期";
      goal = `🎯 從尚未計入成長的館別中自選 ${need} 館，各取得 1 個材料即可${stageGoal}。`;
    } else if (pet) {
      goal = "🏅 已完成所有成長階段，之後取得的材料會保留在收藏中。";
    }
    const shown = route.length ? route.map(id => DS.petMaterials[id]) :
      Object.values(DS.petMaterials).filter(mat => (DS.state.petMat[mat.id] || 0) > 0);
    const cards = shown.map(mat => {
      const count = DS.state.petMat[mat.id] || 0;
      const frag = DS.state.petFrag[mat.id] || 0;
      const selected = selectedMats.has(mat.id);
      return `<button type="button" data-mat="${mat.id}" class="mat selectable ${count ? "" : "zero"} ${selected ? "selected" : ""}" ${count ? "" : "disabled"}>
        <span>${mat.emoji}</span><span>${esc(mat.name)}<small>${count ? `完整 ×${count}` : `碎片 ${frag}/2`}</small></span><b>${selected ? "✓ 已選" : count ? "選擇" : "尚缺"}</b></button>`;
    }).join("");
    $("mat-list").innerHTML = `<div class="mat mat-goal"><span>🧭</span>${esc(goal)}</div>` +
      (cards || `<div class="mat mat-empty"><span>🎒</span>目前還沒有可用材料；可自由選擇一個尚未使用過的館別開始。</div>`);
    document.querySelectorAll("[data-mat]").forEach(button => button.onclick = () => {
      const need = pet && pet.stage < 3 ? DS.petEvolveRules[pet.stage].kinds : 0;
      const id = button.dataset.mat;
      if (selectedMats.has(id)) selectedMats.delete(id);
      else if (selectedMats.size < need) selectedMats.add(id);
      else $("evolve-status").textContent = `這個階段只能選 ${need} 館；先取消一個再改選。`;
      renderEvolve();
    });
  }
  $("btn-evolve").onclick = () => {
    const result = DS.petEvolve([...selectedMats]);
    $("pet-message").textContent = result.msg;
    if (result.success) { selectedMats = new Set(); growthKey = ""; DS.toast(result.msg); }
    renderAll();
  };

  function styleCard(item, owned, equipped) {
    return `<article class="style-item ${equipped ? "equipped" : ""}">
      <span>${item.emoji}</span><div><strong>${esc(item.name)}</strong>
      <small>${equipped ? "使用中" : owned ? "已收藏" : `🪙 ${item.cost}`}</small></div>
      <button data-${owned ? "equip" : "buy-style"}="${item.id}" ${equipped ? "disabled" : ""}>
        ${equipped ? "使用中" : owned ? "使用" : "購買"}</button></article>`;
  }
  function renderStyles() {
    const pet=DS.state.pet;
    $("style-coins").textContent=DS.state.coins;
    const rotation=DS.rotatingCosmetics();
    const allAccessories=Object.values(DS.petCosmetics).filter(item=>item.kind==="accessory");
    const allRooms=Object.values(DS.petCosmetics).filter(item=>item.kind==="room");
    const accessories=allAccessories.filter(item=>rotation.accessories.some(current=>current.id===item.id)||DS.state.petCloset[item.id]||pet.accessory===item.id);
    const rooms=allRooms.filter(item=>rotation.rooms.some(current=>current.id===item.id)||DS.state.petRooms[item.id]||pet.room===item.id);
    $("rotation-note").textContent="本週新品會輪替；已收藏的配件與房間會永久保留。";
    const none={id:"none",kind:"accessory",name:"不戴配件",emoji:"✨",cost:0};
    const study={id:"study",kind:"room",name:"偵探書房",emoji:"🗂️",cost:0};
    $("accessory-list").innerHTML=[none,...accessories].map(item=>
      styleCard(item,item.id==="none"||!!DS.state.petCloset[item.id],pet.accessory===item.id)).join("");
    $("room-list").innerHTML=[study,...rooms].map(item=>
      styleCard(item,item.id==="study"||!!DS.state.petRooms[item.id],pet.room===item.id)).join("");
    document.querySelectorAll("[data-buy-style]").forEach(button=>button.onclick=()=>{
      const result=DS.buyPetCosmetic(button.dataset.buyStyle);
      $("style-message").textContent=result.msg;renderAll();
    });
    document.querySelectorAll("[data-equip]").forEach(button=>button.onclick=()=>{
      const result=DS.equipPetCosmetic(button.dataset.equip);
      $("style-message").textContent=result.msg;renderAll();
    });
  }

  function renderShop() {
    $("coins").textContent=DS.state.coins;
    $("pet-shop").innerHTML=Object.values(DS.petItems).map(item=>`
      <article class="shop-item"><span class="item-icon">${item.emoji}</span>
      <div><strong>${esc(item.name)}</strong><p>${esc(item.desc)}</p><small>背包已有 ${DS.state.inventory[item.id]||0}</small></div>
      <button data-buy="${item.id}" ${DS.state.coins<item.cost?"disabled":""}>🪙 ${item.cost}</button></article>`).join("");
    document.querySelectorAll("[data-buy]").forEach(button=>button.onclick=()=>{
      const result=DS.buyPetItem(button.dataset.buy);
      $("shop-message").textContent=result.msg;renderAll();
    });
  }
  function renderAll() {
    const hasPet=!!DS.state.pet;
    $("screen-adopt").classList.toggle("hidden",hasPet);
    $("screen-pet").classList.toggle("hidden",!hasPet);
    if(hasPet){renderPet();renderCollection();renderEvolve();renderStyles();renderShop();}
    else renderAdopt();
  }
  bindHabitat();
  renderAll();
  setInterval(()=>{if(DS.state.pet)renderAll();},60000);
})();
