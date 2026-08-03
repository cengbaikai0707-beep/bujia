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
    $("toggle-companion").textContent = p.companionVisible === false ? "顯示畫面夥伴" : "上課專注模式";
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
      $("hub-pet-avatar").className = "";
      $("hub-pet-avatar").textContent = "🥚";
      $("hub-pet-accessory").textContent = "";
      $("hub-pet-name").textContent = "等待第一位夥伴";
      $("hub-pet-line").textContent = "先選一顆偵探蛋；完成各館任務，就能帶回照顧與進化資源。";
      $("hub-pet-stage").textContent = "尚未領養";
      $("hub-pet-collection").textContent = `0 / ${total}`;
      return;
    }
    if (status.pet.stage === 0) {
      $("hub-pet-avatar").className = "";
      $("hub-pet-avatar").textContent = status.emoji;
    } else {
      $("hub-pet-avatar").className = `pixel stage-${status.pet.stage}`;
      $("hub-pet-avatar").innerHTML = `<img src="${DS.petImageUrl(status.pet.species)}" alt="${esc(status.pet.name)}">`;
    }
    $("hub-pet-accessory").textContent = status.accessory === "none" ? "" : ((DS.petCosmetics[status.accessory] || {}).emoji || "");
    $("hub-pet-name").textContent = status.pet.name;
    const wish = status.wish && !status.wish.done ? ` 今日想和你一起：${status.wish.label}。` : "";
    $("hub-pet-line").textContent = `${status.species.personality}　飽足 ${status.hunger}、心情 ${status.mood}。${wish}`;
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

  function teacherData() {
    return DS.listProfiles().map(profile => {
      const history = Array.isArray(profile.history) ? profile.history : [];
      const recent = history.slice(0, 10);
      const average = recent.length ? Math.round(recent.reduce((sum, item) => sum + Number(item.accuracy || 0), 0) / recent.length) : null;
      const moduleCount = Object.keys(profile.moduleSeals || {}).filter(id => (profile.moduleSeals[id] || 0) > 0).length;
      const myths = Object.entries(profile.myths || {}).sort((a,b) => b[1] - a[1]).slice(0,3).map(([id,count]) => `${((DS.trapMonsters[id] || {}).name || id)}×${count}`);
      const pet = profile.pet || ((profile.pets || {})[profile.activePetId]);
      const last = history[0];
      return {
        name:profile.name, type:profile.type, sessions:history.length, moduleCount, average,
        last:last ? `${(DS.modules[last.moduleId] || {}).name || last.moduleId} ${last.accuracy}%` : "尚未練習",
        myths:myths.join("、") || "—",
        pet:pet ? `${(DS.petSpecies[pet.species] || {}).name || pet.species}／${DS.petStageNames[pet.stage || 0]}／親密${pet.bond || 0}` : "尚未領養"
      };
    });
  }

  function renderTeacher() {
    const rows = teacherData();
    const sessions = rows.reduce((sum,row) => sum + row.sessions, 0);
    const active = rows.filter(row => row.sessions > 0).length;
    $("teacher-summary").innerHTML = `<span>檔案 <b>${rows.length}</b></span><span>已有練習 <b>${active}</b></span><span>留存紀錄 <b>${sessions}</b></span>`;
    $("teacher-rows").innerHTML = rows.map(row => `<tr>
      <td><strong>${esc(row.name)}</strong><small>${row.type === "team" ? "小隊" : "個人"}</small></td>
      <td>${esc(row.last)}<small>共 ${row.sessions} 次</small></td><td>${row.moduleCount}/7</td>
      <td>${row.average == null ? "—" : `${row.average}%`}</td><td>${esc(row.myths)}</td><td>${esc(row.pet)}</td>
    </tr>`).join("") || `<tr><td colspan="6">目前沒有偵探檔案。</td></tr>`;
  }

  function exportTeacherCsv() {
    const quote = value => `"${String(value == null ? "" : value).replace(/"/g, '""')}"`;
    const lines = [["偵探","類型","留存練習次數","已探索館別","最近練習","近十次平均正確率","常見迷思","夥伴"]];
    teacherData().forEach(row => lines.push([row.name,row.type === "team" ? "小隊" : "個人",row.sessions,`${row.moduleCount}/7`,row.last,row.average == null ? "" : row.average,row.myths,row.pet]));
    const csv = "\ufeff" + lines.map(row => row.map(quote).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type:"text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = `教師總覽_${DS.localDateKey()}.csv`; link.click(); URL.revokeObjectURL(url);
    $("teacher-message").textContent = "教師總覽已下載。";
  }

  function renderAll() {
    renderProfile(); renderCompanion(); renderModules(); renderQuests(); renderProfiles(); renderShop(); renderBag(); renderTeacher();
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
  $("export-teacher").onclick = exportTeacherCsv;
  $("toggle-companion").onclick = () => {
    const visible = DS.toggleCompanionVisible();
    DS.toast(visible ? "🐾 夥伴重新回到畫面。" : "已暫時隱藏畫面夥伴；養成進度不受影響。 ");
    renderAll();
  };

  renderAll();
})();
