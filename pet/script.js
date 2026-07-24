(() => {
  "use strict";
  const DS = window.DetectiveSystem;
  const $ = id => document.getElementById(id);
  let selectedEgg = "cat";

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    })[char]);
  }

  /* ---------- 領養 ---------- */
  function renderAdopt() {
    $("egg-choices").innerHTML = Object.values(DS.petSpecies).map(sp => `
      <button class="egg ${sp.id === selectedEgg ? "selected" : ""}" data-egg="${sp.id}">
        <span class="big">${sp.stages[1]}</span>
        <strong>${sp.name}</strong>
        <small>長大後：${sp.stages[3]}</small>
      </button>`).join("");
    document.querySelectorAll("[data-egg]").forEach(button => {
      button.onclick = () => { selectedEgg = button.dataset.egg; renderAdopt(); };
    });
  }
  $("btn-adopt").onclick = () => {
    const result = DS.adoptPet(selectedEgg, $("pet-name-input").value);
    $("adopt-message").textContent = result.msg;
    if (result.success) renderAll();
  };

  /* ---------- 寵物狀態 ---------- */
  function moodLine(status) {
    if (status.pet.stage === 0) return "蛋殼安安靜靜的，偶爾晃一下。多摸摸牠吧。";
    if (status.sick) return "牠病懨懨地縮成一團，需要一瓶偵探藥水……";
    if (status.hunger < 30) return "牠的肚子咕嚕咕嚕叫，一直看著你。";
    if (status.mood < 30) return "牠有點無聊，戳戳你的手想玩。";
    if (status.hunger > 70 && status.mood > 70) return "牠精神飽滿，正在幫你整理案件線索！";
    return "牠靜靜陪在桌邊，看你破解案件。";
  }

  function renderPet() {
    const status = DS.petStatus();
    const pet = status.pet;
    $("pet-species").textContent = status.species.name;
    $("pet-name").textContent = pet.name;
    $("pet-stage").textContent = status.stageName;
    $("pet-avatar").textContent = status.emoji;
    $("pet-avatar").classList.toggle("sick", status.sick);
    $("pet-line").textContent = moodLine(status);

    $("stat-hunger").style.width = status.hunger + "%";
    $("stat-hunger").classList.toggle("low", status.hunger < 30);
    $("stat-hunger-num").textContent = status.hunger;
    $("stat-mood").style.width = status.mood + "%";
    $("stat-mood").classList.toggle("low", status.mood < 30);
    $("stat-mood-num").textContent = status.mood;

    const inv = DS.state.inventory;
    const acts = [
      { id:"petFood",  label:"🍖 餵飼料",  count:inv.petFood || 0 },
      { id:"petSnack", label:"🍮 給點心",  count:inv.petSnack || 0 },
      { id:"petToy",   label:"🧶 玩玩具",  count:inv.petToy || 0 },
      { id:"petMed",   label:"💊 喝藥水",  count:inv.petMed || 0 }
    ];
    $("pet-actions").innerHTML = acts.map(a => `
      <button data-use="${a.id}" ${a.count < 1 ? "disabled" : ""}>${a.label}<small>背包 ×${a.count}</small></button>
    `).join("") + `
      <button data-pat>🤚 摸摸牠<small>今天 ${pet.petsToday}/5</small></button>`;

    document.querySelectorAll("[data-use]").forEach(button => {
      button.onclick = () => react(DS.petUse(button.dataset.use));
    });
    document.querySelector("[data-pat]").onclick = () => react(DS.petPat());
  }

  function react(result) {
    $("pet-message").textContent = result.msg;
    if (result.success) {
      const avatar = $("pet-avatar");
      avatar.classList.remove("bounce");
      void avatar.offsetWidth;
      avatar.classList.add("bounce");
      if (result.hatched) DS.toast("🎉 偵探蛋孵化了！");
    }
    renderAll();
  }

  /* ---------- 進化與材料 ---------- */
  function renderEvolve() {
    const check = DS.petEvolveCheck();
    $("evolve-status").textContent = check.msg;
    $("btn-evolve").disabled = !check.ready;
    $("mat-list").innerHTML = Object.values(DS.petMaterials).map(mat => {
      const count = DS.state.petMat[mat.id] || 0;
      return `<div class="mat ${count ? "" : "zero"}"><span>${mat.emoji}</span>${esc(mat.name)}<b>×${count}</b></div>`;
    }).join("");
  }
  $("btn-evolve").onclick = () => {
    const result = DS.petEvolve();
    $("pet-message").textContent = result.msg;
    if (result.success) DS.toast(result.msg);
    renderAll();
  };

  /* ---------- 補給站 ---------- */
  function renderShop() {
    $("coins").textContent = DS.state.coins;
    $("pet-shop").innerHTML = Object.values(DS.petItems).map(item => `
      <article class="shop-item">
        <span class="item-icon">${item.emoji}</span>
        <div><strong>${esc(item.name)}</strong><p>${esc(item.desc)}</p>
          <small>背包已有 ${DS.state.inventory[item.id] || 0}</small></div>
        <button data-buy="${item.id}" ${DS.state.coins < item.cost ? "disabled" : ""}>🪙 ${item.cost}</button>
      </article>`).join("");
    document.querySelectorAll("[data-buy]").forEach(button => {
      button.onclick = () => {
        const result = DS.buyPetItem(button.dataset.buy);
        $("shop-message").textContent = result.msg;
        renderAll();
      };
    });
  }

  function renderAll() {
    const hasPet = !!DS.state.pet;
    $("screen-adopt").classList.toggle("hidden", hasPet);
    $("screen-pet").classList.toggle("hidden", !hasPet);
    if (hasPet) { renderPet(); renderEvolve(); renderShop(); }
    else renderAdopt();
  }

  renderAll();
  // 停留頁面時每分鐘結算一次，讓狀態條保持即時
  setInterval(() => { if (DS.state.pet) renderAll(); }, 60000);
})();
