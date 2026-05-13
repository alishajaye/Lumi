let children = [];
let selectedColor = "#F19DAE";

const KINDER_TRANSLATIONS = {
  de: {
    pageTitle: "Kinder",
    loadingProfiles: "Profile werden geladen...",
    noProfiles: "Keine Profile",
    oneProfile: "1 Profil aktiv",
    manyProfiles: "Profile aktiv",

    addChild: "Kind hinzufügen",
    add: "Hinzufügen",
    save: "Speichern",
    cancel: "Abbrechen",
    deleteChild: "Kind löschen",

    name: "NAME",
    age: "ALTER",
    dailyLimit: "TAGESLIMIT (MINUTEN)",
    chooseColor: "FARBE WÄHLEN",
    ownColor: "+ Eigene Farbe",

    namePlaceholder: "Name des Kindes",
    agePlaceholder: "Alter in Jahren",
    limitPlaceholder: "z.B. 90",

    noChildren: "Noch keine Kinder hinzugefügt",
    noChildrenSub: "Klicke auf «Kind hinzufügen» um zu starten.",

    today: "Heute",
    weeklyGoal: "Wochenziel",
    devices: "GERÄTE",
    noDevice: "Noch kein Gerät verbunden",
    details: "Details",
    limit: "Limit",

    years: "Jahre",
    colorChange: "Farbe ändern",
    chooseColorTitle: "Farbe wählen",

    edit: "bearbeiten",
    newDailyLimit: "NEUES TAGESLIMIT (MINUTEN)",
    changeDailyLimit: "Tageslimit ändern",
    dailyLimitDash: "Tageslimit – ",

    deleteConfirmStart: "Möchtest du ",
    deleteConfirmEnd: " wirklich löschen?",

    loadError: "Fehler beim Laden der Kinder: ",
    loadChildrenError: "Kinder konnten nicht geladen werden.",
    deleteError: "Kind konnte nicht gelöscht werden.",
    saveError: "Speichern fehlgeschlagen.",
    colorError: "Farbe konnte nicht gespeichert werden.",
    limitError: "Limit konnte nicht gespeichert werden."
  },

  en: {
    pageTitle: "Children",
    loadingProfiles: "Loading profiles...",
    noProfiles: "No profiles",
    oneProfile: "1 active profile",
    manyProfiles: "active profiles",

    addChild: "Add child",
    add: "Add",
    save: "Save",
    cancel: "Cancel",
    deleteChild: "Delete child",

    name: "NAME",
    age: "AGE",
    dailyLimit: "DAILY LIMIT (MINUTES)",
    chooseColor: "CHOOSE COLOR",
    ownColor: "+ Custom color",

    namePlaceholder: "Child's name",
    agePlaceholder: "Age in years",
    limitPlaceholder: "e.g. 90",

    noChildren: "No children added yet",
    noChildrenSub: "Click “Add child” to get started.",

    today: "Today",
    weeklyGoal: "Weekly goal",
    devices: "DEVICES",
    noDevice: "No device connected yet",
    details: "Details",
    limit: "Limit",

    years: "years old",
    colorChange: "Change color",
    chooseColorTitle: "Choose color",

    edit: "edit",
    newDailyLimit: "NEW DAILY LIMIT (MINUTES)",
    changeDailyLimit: "Change daily limit",
    dailyLimitDash: "Daily limit – ",

    deleteConfirmStart: "Do you really want to delete ",
    deleteConfirmEnd: "?",

    loadError: "Error loading children: ",
    loadChildrenError: "Children could not be loaded.",
    deleteError: "Child could not be deleted.",
    saveError: "Saving failed.",
    colorError: "Color could not be saved.",
    limitError: "Limit could not be saved."
  }
};

function getKinderLang() {
  return localStorage.getItem("lumi_lang") || "de";
}

function t(key) {
  const lang = getKinderLang();
  return KINDER_TRANSLATIONS[lang][key] || key;
}

function getWeekdays() {
  return getKinderLang() === "en"
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
}

const modalOverlay = document.getElementById("modalOverlay");
const childForm = document.getElementById("childForm");
const deleteBtn = document.getElementById("modalDeleteBtn");

const colorModalOverlay = document.getElementById("colorModalOverlay");
let colorModalChildId = null;

const limitModalOverlay = document.getElementById("limitModalOverlay");
let limitChildId = null;

function soften(hex, a) {
  return hex + a;
}

function applyKinderStaticTranslations() {
  const title = document.querySelector(".kinder-title");
  if (title) title.textContent = t("pageTitle");

  const addBtn = document.getElementById("addChildBtn");
  if (addBtn) {
    const svg = addBtn.querySelector("svg");
    addBtn.innerHTML = "";
    if (svg) addBtn.appendChild(svg);
    addBtn.append(" " + t("addChild"));
  }

  const modalTitle = document.getElementById("modalTitle");
  if (modalTitle && !document.getElementById("childId").value) {
    modalTitle.textContent = t("addChild");
  }

  const modalSaveBtn = document.getElementById("modalSaveBtn");
  if (modalSaveBtn && !document.getElementById("childId").value) {
    modalSaveBtn.textContent = t("add");
  }

  const modalCancelBtn = document.getElementById("modalCancelBtn");
  if (modalCancelBtn) modalCancelBtn.textContent = t("cancel");

  if (deleteBtn) deleteBtn.textContent = t("deleteChild");

  const labels = document.querySelectorAll("#childForm .kinder-form-group label");
  if (labels[0]) labels[0].textContent = t("name");
  if (labels[1]) labels[1].textContent = t("age");
  if (labels[2]) labels[2].textContent = t("dailyLimit");
  if (labels[3]) labels[3].textContent = t("chooseColor");

  const childName = document.getElementById("childName");
  if (childName) childName.placeholder = t("namePlaceholder");

  const childAge = document.getElementById("childAge");
  if (childAge) childAge.placeholder = t("agePlaceholder");

  const childLimit = document.getElementById("childLimit");
  if (childLimit) childLimit.placeholder = t("limitPlaceholder");

  const customColorBtn = document.getElementById("customColorBtn");
  if (customColorBtn) {
    const preview = document.getElementById("customColorPreview");
    customColorBtn.innerHTML = "";
    if (preview) customColorBtn.appendChild(preview);
    customColorBtn.append(" " + t("ownColor"));
  }

  const colorModalTitle = colorModalOverlay?.querySelector(".kinder-modal-title");
  if (colorModalTitle) colorModalTitle.textContent = t("chooseColorTitle");

  const colorModalCustomBtn = document.getElementById("colorModalCustomBtn");
  if (colorModalCustomBtn) {
    const preview = document.getElementById("colorModalCustomPreview");
    colorModalCustomBtn.innerHTML = "";
    if (preview) colorModalCustomBtn.appendChild(preview);
    colorModalCustomBtn.append(" " + t("ownColor"));
  }

  const limitModalLabel = limitModalOverlay?.querySelector(".kinder-form-group label");
  if (limitModalLabel) limitModalLabel.textContent = t("newDailyLimit");

  const limitModalInput = document.getElementById("limitModalInput");
  if (limitModalInput) limitModalInput.placeholder = t("limitPlaceholder");

  const limitModalCancel = document.getElementById("limitModalCancel");
  if (limitModalCancel) limitModalCancel.textContent = t("cancel");

  const limitModalSave = document.getElementById("limitModalSave");
  if (limitModalSave) limitModalSave.textContent = t("save");
}

async function loadChildren() {
  applyKinderStaticTranslations();

  try {
    const response = await fetch("api/kinder.php");
    const result = await response.json();

    if (result.status === "success") {
      children = result.children.map((child) => ({
        id: String(child.id),
        name: child.name,
        age: Number(child.age),
        color: child.color || "#F19DAE",
        dailyLimit: Number(child.daily_limit),
        usedToday: Number(child.used_today || 0),
        streak: Number(child.streak || 0),
        timeSaved: Number(child.time_saved || 0),
        deviceId: child.device_id,
        devices: [],
        weekData: [0, 0, 0, 0, 0, 0, 0],
      }));

      renderCards();
    } else {
      alert(result.message || t("loadChildrenError"));
    }
  } catch (error) {
    console.error(error);
    alert(t("loadError") + error.message);
  }
}

async function createChild(data) {
  const response = await fetch("api/kinder.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      age: data.age,
      daily_limit: data.dailyLimit,
      color: data.color,
    }),
  });

  return await response.json();
}

async function updateChild(id, data) {
  const response = await fetch("api/kinder.php", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: id,
      name: data.name,
      age: data.age,
      daily_limit: data.dailyLimit,
      color: data.color,
    }),
  });

  return await response.json();
}

async function deleteChild(id) {
  const response = await fetch("api/kinder.php", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id }),
  });

  return await response.json();
}

function renderCards() {
  applyKinderStaticTranslations();

  const grid = document.getElementById("kinderGrid");
  const profileCount = document.getElementById("profileCount");

  if (profileCount) {
    profileCount.textContent =
      children.length === 0
        ? t("noProfiles")
        : children.length === 1
        ? t("oneProfile")
        : children.length + " " + t("manyProfiles");
  }

  if (children.length === 0) {
    grid.innerHTML = `
      <div class="kinder-empty">
        <p>${t("noChildren")}</p>
        <p class="kinder-empty-sub">${t("noChildrenSub")}</p>
      </div>
    `;
    return;
  }

  const WK = getWeekdays();

  grid.innerHTML = children
    .map((child) => {
      const pct =
        child.dailyLimit > 0
          ? Math.round((child.usedToday / child.dailyLimit) * 100)
          : 0;

      const wkTotal = child.weekData.reduce((a, b) => a + b, 0);
      const wkPct =
        child.dailyLimit > 0
          ? Math.round((wkTotal / (child.dailyLimit * 7)) * 100)
          : 0;

      const maxB = Math.max(...child.weekData, child.dailyLimit, 1);

      const bars = child.weekData
        .map((m, i) => {
          const h = maxB > 0 ? Math.max(4, (m / maxB) * 80) : 4;
          const op = m === 0 ? 0.15 : 0.65;

          return `
            <div class="kinder-bar-col">
              <div class="kinder-bar" style="height:${h}px;background:${child.color};opacity:${op}"></div>
              <span class="kinder-bar-label">${WK[i]}</span>
            </div>
          `;
        })
        .join("");

      return `
        <div class="kinder-card" style="border-top:4px solid ${soften(child.color, "40")}">
          ${
            child.streak > 0
              ? `<div class="kinder-streak" style="color:${child.color};background:${soften(child.color, "1A")}">${child.streak}d🔥</div>`
              : ""
          }

          <button class="kinder-color-change-btn" data-child-id="${child.id}" style="background:${soften(child.color, "1A")}" title="${t("colorChange")}">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5" stroke="${child.color}" stroke-width="1.5" fill="none"/>
              <circle cx="7" cy="7" r="2" fill="${child.color}"/>
            </svg>
          </button>

          <div class="kinder-avatar" style="background:${soften(child.color, "20")};border:3px solid ${child.color}">
            <span style="color:${child.color}">${child.name.charAt(0)}</span>
          </div>

          <div class="kinder-card-name">${child.name}</div>
          <div class="kinder-card-age">${child.age} ${t("years")}</div>

          <div class="kinder-stats">
            <div class="kinder-stat-row">
              <span class="kinder-stat-label">${t("today")}</span>
              <span class="kinder-stat-value" style="color:${child.color}">
                ${child.usedToday} / ${child.dailyLimit} min
              </span>
            </div>

            <div class="kinder-progress-bar" style="background:${soften(child.color, "15")}">
              <div class="kinder-progress-fill" style="width:${Math.min(100, pct)}%;background:${child.color}"></div>
            </div>

            <div class="kinder-stat-row">
              <span class="kinder-stat-label">${t("weeklyGoal")}</span>
              <span class="kinder-stat-value" style="color:${child.color}">${wkPct}%</span>
            </div>

            <div class="kinder-progress-bar" style="background:${soften(child.color, "15")}">
              <div class="kinder-progress-fill" style="width:${Math.min(100, wkPct)}%;background:${child.color}"></div>
            </div>
          </div>

          <div class="kinder-week-chart">${bars}</div>

          <div class="kinder-devices-section">
            <div class="kinder-devices-label">${t("devices")}</div>
            <div class="kinder-devices-list">
              <span class="kinder-device-none">${t("noDevice")}</span>
            </div>
          </div>

          <div class="kinder-card-actions">
            <button class="kinder-btn-details" style="--child-color:${child.color};--child-color-light:${soften(child.color, "1A")}" data-child-id="${child.id}">
              ${t("details")}
            </button>
            <button class="kinder-btn-limit" style="--child-color:${child.color};--child-color-light:${soften(child.color, "1A")}" data-child-id="${child.id}">
              ${t("limit")}
            </button>
          </div>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll(".kinder-color-change-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openColorModal(btn.dataset.childId);
    });
  });

  document.querySelectorAll(".kinder-btn-details").forEach((btn) => {
    btn.addEventListener("click", () => openEditModal(btn.dataset.childId));
  });

  document.querySelectorAll(".kinder-btn-limit").forEach((btn) => {
    btn.addEventListener("click", () => openLimitModal(btn.dataset.childId));
  });
}

function renderAll() {
  applyKinderStaticTranslations();
  renderCards();
}

function openAddModal() {
  applyKinderStaticTranslations();

  document.getElementById("modalTitle").textContent = t("addChild");
  document.getElementById("modalSaveBtn").textContent = t("add");
  document.getElementById("childId").value = "";
  childForm.reset();

  selectedColor = "#F19DAE";
  document.getElementById("childColor").value = selectedColor;
  updateColorSel("colorPresets", selectedColor);

  deleteBtn.style.display = "none";
  modalOverlay.classList.add("active");
}

function openEditModal(childId) {
  const child = children.find((c) => c.id === childId);
  if (!child) return;

  document.getElementById("modalTitle").textContent = child.name + " " + t("edit");
  document.getElementById("modalSaveBtn").textContent = t("save");
  document.getElementById("childId").value = child.id;
  document.getElementById("childName").value = child.name;
  document.getElementById("childAge").value = child.age;
  document.getElementById("childLimit").value = child.dailyLimit;

  selectedColor = child.color;
  document.getElementById("childColor").value = selectedColor;
  updateColorSel("colorPresets", selectedColor);

  deleteBtn.style.display = "flex";
  modalOverlay.classList.add("active");
}

function closeModal() {
  modalOverlay.classList.remove("active");
}

document.getElementById("addChildBtn").addEventListener("click", openAddModal);
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalCancelBtn").addEventListener("click", closeModal);

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

deleteBtn.addEventListener("click", async () => {
  const id = document.getElementById("childId").value;
  const child = children.find((c) => c.id === id);

  if (!child) return;

  if (confirm(t("deleteConfirmStart") + child.name + t("deleteConfirmEnd"))) {
    const result = await deleteChild(id);

    if (result.status === "success") {
      closeModal();
      loadChildren();
    } else {
      alert(result.message || t("deleteError"));
    }
  }
});

childForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("childId").value;

  const data = {
    name: document.getElementById("childName").value.trim(),
    age: parseInt(document.getElementById("childAge").value),
    dailyLimit: parseInt(document.getElementById("childLimit").value),
    color: document.getElementById("childColor").value,
  };

  let result;

  if (id) {
    result = await updateChild(id, data);
  } else {
    result = await createChild(data);
  }

  if (result.status === "success") {
    closeModal();
    loadChildren();
  } else {
    alert(result.message || t("saveError"));
  }
});

function updateColorSel(presetsId, color) {
  const dots = document.querySelectorAll("#" + presetsId + " .kinder-color-dot");
  let found = false;

  dots.forEach((dot) => {
    if (dot.dataset.color.toLowerCase() === color.toLowerCase()) {
      dot.classList.add("active");
      found = true;
    } else {
      dot.classList.remove("active");
    }
  });

  const isMain = presetsId === "colorPresets";

  const preview = document.getElementById(
    isMain ? "customColorPreview" : "colorModalCustomPreview"
  );

  const input = document.getElementById(
    isMain ? "customColorInput" : "colorModalCustomInput"
  );

  if (!found) {
    preview.style.background = color;
    preview.classList.add("active");
    input.value = color;
  } else {
    preview.style.background = "#ccc";
    preview.classList.remove("active");
  }
}

document.querySelectorAll("#colorPresets .kinder-color-dot").forEach((dot) => {
  dot.addEventListener("click", () => {
    selectedColor = dot.dataset.color;
    document.getElementById("childColor").value = selectedColor;
    updateColorSel("colorPresets", selectedColor);
  });
});

document.getElementById("customColorBtn").addEventListener("click", () => {
  document.getElementById("customColorInput").click();
});

document.getElementById("customColorInput").addEventListener("input", (e) => {
  selectedColor = e.target.value;
  document.getElementById("childColor").value = selectedColor;
  document.getElementById("customColorPreview").style.background = selectedColor;
  document.getElementById("customColorPreview").classList.add("active");

  document
    .querySelectorAll("#colorPresets .kinder-color-dot")
    .forEach((dot) => dot.classList.remove("active"));
});

function openColorModal(childId) {
  colorModalChildId = childId;

  const child = children.find((c) => c.id === childId);
  if (!child) return;

  updateColorSel("colorModalPresets", child.color);
  colorModalOverlay.classList.add("active");
}

function closeColorModal() {
  colorModalOverlay.classList.remove("active");
}

document.getElementById("colorModalClose").addEventListener("click", closeColorModal);

colorModalOverlay.addEventListener("click", (e) => {
  if (e.target === colorModalOverlay) closeColorModal();
});

document.querySelectorAll("#colorModalPresets .kinder-color-dot").forEach((dot) => {
  dot.addEventListener("click", () => applyColor(dot.dataset.color));
});

document.getElementById("colorModalCustomBtn").addEventListener("click", () => {
  document.getElementById("colorModalCustomInput").click();
});

document.getElementById("colorModalCustomInput").addEventListener("input", (e) => {
  applyColor(e.target.value);
});

async function applyColor(color) {
  if (!colorModalChildId) return;

  const child = children.find((c) => c.id === colorModalChildId);
  if (!child) return;

  const result = await updateChild(child.id, {
    name: child.name,
    age: child.age,
    dailyLimit: child.dailyLimit,
    color: color,
  });

  if (result.status === "success") {
    closeColorModal();
    loadChildren();
  } else {
    alert(result.message || t("colorError"));
  }
}

function openLimitModal(childId) {
  limitChildId = childId;

  const child = children.find((c) => c.id === childId);
  if (!child) return;

  document.getElementById("limitModalTitle").textContent = t("dailyLimitDash") + child.name;
  document.getElementById("limitModalInput").value = child.dailyLimit;

  document.querySelectorAll(".kinder-limit-preset").forEach((btn) => {
    if (parseInt(btn.dataset.mins) === child.dailyLimit) {
      btn.style.background = child.color;
      btn.style.color = "#fff";
    } else {
      btn.style.background = "#f0ede8";
      btn.style.color = "#6b6b6b";
    }
  });

  limitModalOverlay.classList.add("active");
}

function closeLimitModal() {
  limitModalOverlay.classList.remove("active");
}

document.getElementById("limitModalClose").addEventListener("click", closeLimitModal);
document.getElementById("limitModalCancel").addEventListener("click", closeLimitModal);

limitModalOverlay.addEventListener("click", (e) => {
  if (e.target === limitModalOverlay) closeLimitModal();
});

document.querySelectorAll(".kinder-limit-preset").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("limitModalInput").value = btn.dataset.mins;

    const child = children.find((c) => c.id === limitChildId);

    document.querySelectorAll(".kinder-limit-preset").forEach((x) => {
      if (x === btn && child) {
        x.style.background = child.color;
        x.style.color = "#fff";
      } else {
        x.style.background = "#f0ede8";
        x.style.color = "#6b6b6b";
      }
    });
  });
});

document.getElementById("limitModalSave").addEventListener("click", async () => {
  if (!limitChildId) return;

  const value = parseInt(document.getElementById("limitModalInput").value);
  const child = children.find((c) => c.id === limitChildId);

  if (!child || isNaN(value) || value < 0) return;

  const result = await updateChild(child.id, {
    name: child.name,
    age: child.age,
    dailyLimit: value,
    color: child.color,
  });

  if (result.status === "success") {
    closeLimitModal();
    loadChildren();
  } else {
    alert(result.message || t("limitError"));
  }
});

loadChildren();