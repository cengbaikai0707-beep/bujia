(() => {
  "use strict";
  const DS = window.DetectiveSystem;
  const $ = id => document.getElementById(id);
  let newType = "individual";

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    })[char]);
  }

  function renderProfile() {
    const p = DS.activeProfile();
    const rank = DS.rankFor();
    const next = DS.nextRank();
    $("profile-name").textContent = p.name;
    $("profile-type").textContent = p.type === "team" ? "小隊共用檔案" : "個人偵探檔案";
    $("profile-avatar").textContent = p.type === "team" ? "隊" : "偵";
    $("profile-rank").textContent = rank.name;
    $("rank-next").textContent = next ? `　距離「${next.name}」還有 ${next.min - p.xp} 經驗` : "　最高階級";
    $("world-coins").textContent = p.coins;
    $("world-evidence").textContent = p.evidence;
    $("world-modules").textContent = `${DS.distinctModules().length}/7`;
    const previous = rank.min;
    const span = next ? next.min - previous : 1;
    $("rank-fill").style.width = `${next ? Math.min(100, (p.xp - previous) / span * 100) : 100}%`;
  }

  function renderModules() {
    Object.entries(DS.modules).forEach(([id, info]) => {
      const node = $(`progress-${id}`);
      if (!node) return;
      const seals = DS.state.moduleSeals[id] || 0;
      const best = DS.state.moduleBest[id] || 0;
      node.textContent = seals ? `✓ ${info.relic} ×${seals}｜最佳 ${best}%` : `尚未取得「${info.relic}」`;
      node.classList.toggle("earned", seals > 0);
    });
    const cleared = Object.keys(DS.state.casesCleared).length;
    const grand = DS.sideCaseStatus("grandCase");
    $("guild-progress").textContent = grand.unlocked
      ? `大型聯合案件已開放｜完成 ${cleared} 件支線`
      : `完成 ${DS.distinctModules().length}/5 館、蒐集 ${DS.state.evidence}/8 證據可開大案件`;
  }

  function renderCompanion() {
    const status = DS.petStatus();
    const total = Object.keys(DS.petSpecies).length;
    if (!status) {
      $("hub-pet-avatar").textContent = "🥚";
      $("hub-pet-accessory").textContent = "";
      $("hub-pet-name").textContent = "等待第一位夥伴";
      $("hub-pet-line").textContent = "先選一顆偵探蛋；完成各館任務，就能帶回照顧與進化資源。";
      $("hub-pet-stage").textContent = "尚未領養";
      $("hub-pet-collection").textContent = `0 / ${total}`;
      return;
    }
    $("hub-pet-avatar").textContent = status.emoji;
    $("hub-pet-accessory").textContent = status.accessory === "none" ? "" : ((DS.petCosmetics[status.accessory] || {}).emoji || "");
    $("hub-pet-name").textContent = status.pet.name;
    $("hub-pet-line").textContent = `${status.species.personality}　飽足 ${status.hunger}、心情 ${status.mood}。`;
    $("hub-pet-stage").textContent = `${status.species.name}｜${status.stageName}`;
    $("hub-pet-collection").textContent = `${status.ownedCount} / ${total}`;
  }

  function renderQuests() {
    $("quest-date").textContent = new Date().toLocaleDateString("zh-TW", { month:"long", day:"numeric" });
    $("quest-list").innerHTML = DS.questDefinitions().map(q => {
      const done = q.now >= q.goal;
      const claimed = DS.state.quest.claimed[q.id];
      return `<article class="quest ${done ? "done" : ""}">
        <div><strong>${esc(q.label)}</strong><span>${Math.min(q.now, q.goal)} / ${q.goal}</span></div>
        <div class="quest-track"><i style="width:${Math.min(100, q.now / q.goal * 100)}%"></i></div>
        <button data-claim="${q.id}" ${!done || claimed ? "disabled" : ""}>
          ${claimed ? "已領取" : `領取 🪙${q.reward}`}
        </button>
      </article>`;
    }).join("");
    document.querySelectorAll("[data-claim]").forEach(button => {
      button.onclick = () => {
        const result = DS.claimQuest(button.dataset.claim);
        DS.toast(result.msg);
        renderAll();
      };
    });
  }

  function renderProfiles() {
    $("profile-select").innerHTML = DS.listProfiles().map(profile =>
      `<option value="${esc(profile.id)}" ${profile.id === DS.world.activeId ? "selected" : ""}>
        ${profile.type === "team" ? "👥" : "🕵️"} ${esc(profile.name)}
      </option>`
    ).join("");
  }

  function renderShop() {
    $("shop-list").innerHTML = Object.values(DS.items).map(item => `
      <article class="shop-item">
        <span class="item-icon">${item.emoji}</span>
        <div><strong>${esc(item.name)}</strong><p>${esc(item.desc)}</p>
          <small>背包已有 ${DS.state.inventory[item.id] || 0}</small></div>
        <button data-buy="${item.id}" ${DS.state.coins < item.cost ? "disabled" : ""}>🪙 ${item.cost}</button>
      </article>`).join("");
    document.querySelectorAll("[data-buy]").forEach(button => {
      button.onclick = () => {
        const result = DS.buyItem(button.dataset.buy);
        $("shop-message").textContent = result.msg;
        renderAll();
      };
    });
  }

  function renderBag() {
    $("bag-list").innerHTML = Object.values(DS.items).map(item => `
      <div class="bag-item"><span>${item.emoji}</span><strong>${esc(item.name)}</strong>
      <b>× ${DS.state.inventory[item.id] || 0}</b></div>`).join("");
    const myths = DS.rescueTargets();
    $("myth-list").innerHTML = myths.length ? myths.map(m => `
      <div class="myth-item"><span>${m.emoji}</span><div><strong>${esc(m.name)} ×${m.count}</strong>
      <small>${esc(m.desc)}</small></div></div>`).join("")
      : `<p class="empty">目前沒有待調查迷思。答錯不會扣幣，會轉成可救援的線索。</p>`;
    $("title-list").innerHTML = DS.state.titles.length
      ? DS.state.titles.map(title => `<span class="title-chip">🏅 ${esc(title)}</span>`).join("")
      : `<p class="empty">完成聯合案件後，稱號會留在這裡。</p>`;
  }

  function renderAll() {
    renderProfile(); renderCompanion(); renderModules(); renderQuests(); renderProfiles(); renderShop(); renderBag();
  }

  function openModal(id) {
    var box = $(id);
    if (box) box.classList.remove("hidden");
    renderAll();
  }
  function closeModals() {
    document.querySelectorAll(".modal").forEach(modal => modal.classList.add("hidden"));
  }

  document.querySelectorAll("[data-open]").forEach(button => {
    button.onclick = () => openModal(button.dataset.open);
  });
  document.querySelectorAll("[data-close]").forEach(button => button.onclick = closeModals);
  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => { if (event.target === modal) closeModals(); });
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeModals(); });

  $("profile-select").onchange = event => {
    DS.switchProfile(event.target.value);
    $("profile-message").textContent = "已切換偵探檔案。";
    renderAll();
  };
  document.querySelectorAll("[data-profile-type]").forEach(button => {
    button.onclick = () => {
      newType = button.dataset.profileType;
      document.querySelectorAll("[data-profile-type]").forEach(item =>
        item.classList.toggle("selected", item === button));
    };
  });
  $("create-profile").onclick = () => {
    const result = DS.createProfile($("new-profile-name").value, newType);
    $("profile-message").textContent = result.success ? "新檔案已建立並切換。" : result.msg;
    if (result.success) $("new-profile-name").value = "";
    renderAll();
  };
  $("export-profile").onclick = () => DS.downloadActive();
  $("import-profile").onclick = () => $("import-file").click();
  $("import-file").onchange = async event => {
    const file = event.target.files[0];
    if (!file) return;
    const result = DS.importProfile(await file.text());
    DS.toast(result.success ? `已匯入「${result.profile.name}」` : result.msg);
    event.target.value = "";
    renderAll();
  };

  renderAll();
})();
