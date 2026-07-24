(() => {
  "use strict";
  const DS = window.DetectiveSystem;
  const $ = id => document.getElementById(id);
  let selectedEgg = "dog";

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
      : `<img src="${DS.petImageUrl(species.id)}" alt="${esc(species.name)}">`;
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
  function renderPet() {
    const status = DS.petStatus();
    const pet = status.pet, species = status.species;
    $("pet-species").textContent = species.name;
    $("pet-name").textContent = pet.name;
    $("pet-stage").textContent = status.stageName;
    $("pet-count").textContent = `收藏 ${status.ownedCount}/9`;
    if (pet.stage === 0) {
      $("pet-avatar").classList.remove("pixel");
      $("pet-avatar").textContent = status.emoji;
    } else {
      $("pet-avatar").classList.add("pixel");
      $("pet-avatar").innerHTML = `<img src="${DS.petImageUrl(pet.species)}" alt="${esc(pet.name)}">`;
    }
    $("pet-accessory").textContent = status.accessory === "none" ? "" : ((DS.petCosmetics[status.accessory] || {}).emoji || "");
    $("pet-line").textContent = moodLine(status);
    $("pet-personality").textContent = `${species.personality}　最喜歡：${favoriteName(species)}。`;
    $("pet-bond").textContent = status.bond;
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
    $("pet-actions").innerHTML = acts.map(action => `
      <button data-use="${action.id}" ${action.count < 1 ? "disabled" : ""}>${action.label}<small>背包 ×${action.count}</small></button>
    `).join("") + `<button data-pat>🤚 摸摸牠<small>今天 ${pet.petsToday}/5</small></button>`;
    document.querySelectorAll("[data-use]").forEach(button => button.onclick = () => react(DS.petUse(button.dataset.use)));
    document.querySelector("[data-pat]").onclick = () => react(DS.petPat());
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

  function renderCollection() {
    const all = Object.values(DS.petSpecies);
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
    const check = DS.petEvolveCheck();
    $("evolve-status").textContent = check.msg;
    $("btn-evolve").disabled = !check.ready;
    const pet = DS.state.pet;
    $("btn-evolve").textContent = pet && pet.stage === 0 ? "🐣 孵化目前夥伴" : "✨ 讓目前夥伴進化";
    let route = [];
    let goal = "先領養一位偵探夥伴。";
    if (pet && pet.stage < 3) {
      route = DS.petRouteFor(pet);
      const need = DS.petEvolveRules[pet.stage].kinds;
      const stageGoal = pet.stage === 0 ? "孵化" : pet.stage === 1 ? "進入少年期" : "進入成熟期";
      goal = `🎯 從尚未計入成長的館別中自選 ${need} 館，各取得 1 個材料即可${stageGoal}。`;
    } else if (pet) {
      goal = "🏅 已完成所有成長階段，之後取得的材料會保留在收藏中。";
    }
    const readyIds = route.filter(id => (DS.state.petMat[id] || 0) > 0);
    const shown = route.length ? readyIds.map(id => DS.petMaterials[id]) :
      Object.values(DS.petMaterials).filter(mat => (DS.state.petMat[mat.id] || 0) > 0);
    const cards = shown.map(mat => {
      const count = DS.state.petMat[mat.id] || 0;
      return `<div class="mat ${count ? "" : "zero"}"><span>${mat.emoji}</span>${esc(mat.name)}<b>${count ? "✓" : "尚缺"}</b></div>`;
    }).join("");
    $("mat-list").innerHTML = `<div class="mat mat-goal"><span>🧭</span>${esc(goal)}</div>` +
      (cards || `<div class="mat mat-empty"><span>🎒</span>目前還沒有可用材料；可自由選擇一個尚未使用過的館別開始。</div>`);
  }
  $("btn-evolve").onclick = () => {
    const result = DS.petEvolve();
    $("pet-message").textContent = result.msg;
    if (result.success) DS.toast(result.msg);
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
    const accessories=Object.values(DS.petCosmetics).filter(item=>item.kind==="accessory");
    const rooms=Object.values(DS.petCosmetics).filter(item=>item.kind==="room");
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
  renderAll();
  setInterval(()=>{if(DS.state.pet)renderAll();},60000);
})();
