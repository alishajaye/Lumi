/* =============================================
   LUMI – Übersicht JS
   ============================================= */
 
const WK = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
 
// ─── Übersetzungen ───────────────────────────
const TRANSLATIONS = {
  de: {
    language: 'Sprache', changePassword: 'Passwort ändern', logout: 'Abmelden',
    devices: 'Geräte', avgToday: 'Ø heute', rewards: 'Belohnungen',
    family: 'Familie', manage: 'Verwalten ›',
    giveReward: 'Belohnung schenken', giveRewardSub: 'Zeit als Anerkennung vergeben',
    selectChild: 'KIND AUSWÄHLEN', selectReason: 'GRUND AUSWÄHLEN',
    cleanRoom: 'Zimmer aufgeräumt', homework: 'Hausaufgaben',
    playedOutside: 'Draussen gespielt', helpedCooking: 'Beim Kochen geholfen',
    readBook: 'Buch gelesen', ownReason: 'Eigener Grund eingeben...',
    giveMinutes: 'MINUTEN SCHENKEN', ownMinutes: 'Eigene Minutenzahl eingeben...',
    giveTime: 'Zeit schenken', lastRewards: 'LETZTE BELOHNUNGEN',
    activities: 'Aktivitäten', seeAll: 'Alle sehen',
    weekOverview: 'Wochenübersicht', monToSun: 'Montag bis Sonntag',
    thisWeek: 'diese Woche bis heute', individual: 'Einzeln', allChildren: 'Alle Kinder',
    noChildren: 'Noch keine Kinder hinzugefügt',
    currentPassword: 'AKTUELLES PASSWORT', newPassword: 'NEUES PASSWORT',
    confirmPassword: 'PASSWORT BESTÄTIGEN', cancel: 'Abbrechen', save: 'Speichern',
    greetingMorning: 'Guten Morgen', greetingAfternoon: 'Guten Nachmittag',
    greetingEvening: 'Guten Abend',
    actLimitReached: 'hat sein Tageslimit eingehalten',
    actRewardGiven: 'erhielt',
    actSessionEnded: 'Tablet-Session beendet',
    actStreakStart: 'erster Tages-Streak gestartet',
    actStreakReached: 'Tage-Streak erreicht',
    minToday: 'min heute', noActivities: 'Noch keine Aktivitäten',
    noRewards: 'Noch keine Belohnungen vergeben',
    children: 'Kinder', activeDevices: 'Geräte aktiv',
  },
  en: {
    language: 'Language', changePassword: 'Change Password', logout: 'Sign Out',
    devices: 'Devices', avgToday: 'Ø today', rewards: 'Rewards',
    family: 'Family', manage: 'Manage ›',
    giveReward: 'Give a Reward', giveRewardSub: 'Give time as recognition',
    selectChild: 'SELECT CHILD', selectReason: 'SELECT REASON',
    cleanRoom: 'Cleaned room', homework: 'Homework',
    playedOutside: 'Played outside', helpedCooking: 'Helped cooking',
    readBook: 'Read a book', ownReason: 'Enter custom reason...',
    giveMinutes: 'GIVE MINUTES', ownMinutes: 'Enter custom minutes...',
    giveTime: 'Give time', lastRewards: 'LAST REWARDS',
    activities: 'Activities', seeAll: 'See all',
    weekOverview: 'Weekly Overview', monToSun: 'Monday to Sunday',
    thisWeek: 'this week so far', individual: 'Individual', allChildren: 'All Children',
    noChildren: 'No children added yet',
    currentPassword: 'CURRENT PASSWORD', newPassword: 'NEW PASSWORD',
    confirmPassword: 'CONFIRM PASSWORD', cancel: 'Cancel', save: 'Save',
    greetingMorning: 'Good morning', greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    actLimitReached: 'kept their daily limit',
    actRewardGiven: 'received',
    actSessionEnded: 'Tablet session ended',
    actStreakStart: 'first daily streak started',
    actStreakReached: 'day streak reached',
    minToday: 'min today', noActivities: 'No activities yet',
    noRewards: 'No rewards given yet',
    children: 'Children', activeDevices: 'Active devices',
  }
};
 
let currentLang = localStorage.getItem('lumi_lang') || 'de';
function t(key) { return TRANSLATIONS[currentLang][key] || key; }
 
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lumi_lang', lang);
  document.getElementById('langDE').classList.toggle('active', lang === 'de');
  document.getElementById('langEN').classList.toggle('active', lang === 'en');
  applyTranslations();
  renderAll();
}
 
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (TRANSLATIONS[currentLang][key]) el.textContent = TRANSLATIONS[currentLang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (TRANSLATIONS[currentLang][key]) el.placeholder = TRANSLATIONS[currentLang][key];
  });
}
 
// ─── Auth / User ─────────────────────────────
function getUser() {
  const raw = localStorage.getItem('lumi_user');
  if (raw) return JSON.parse(raw);
  return { name: 'Max', email: 'max@beispiel.ch' };
}
 
function renderUser() {
  const user = getUser();
  const initial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
  document.getElementById('profileAvatar').textContent = initial;
  document.getElementById('profileAvatarLg').textContent = initial;
  document.getElementById('profileName').textContent = user.name || user.email;
  document.getElementById('profileEmail').textContent = user.email;
}
 
// ─── Kinder laden ────────────────────────────
function getChildren() {
  const raw = localStorage.getItem('lumi_children');
  if (raw) return JSON.parse(raw);
  return [];
}
 
function getBelohnungen() {
  const raw = localStorage.getItem('lumi_belohnungen');
  if (raw) return JSON.parse(raw);
  return [];
}
 
function saveBelohnungen(b) {
  localStorage.setItem('lumi_belohnungen', JSON.stringify(b));
}
 
// ─── Datum & Begrüssung ──────────────────────
function renderHeader() {
  const now = new Date();
  const h = now.getHours();
  const greeting = h < 12 ? t('greetingMorning') : h < 18 ? t('greetingAfternoon') : t('greetingEvening');
  const user = getUser();
  const name = user.name || user.email.split('@')[0];
 
  const days = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
  const months = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  const dateStr = currentLang === 'de'
    ? `${days[now.getDay()]}, ${now.getDate()}. ${months[now.getMonth()]} ${now.getFullYear()}`
    : now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
 
  document.getElementById('uebersichtDate').textContent = dateStr;
  document.getElementById('uebersichtGreeting').textContent = `${greeting}, ${name}.`;
 
  const children = getChildren();
  const totalDevices = children.reduce((a, c) => a + (c.devices ? c.devices.length : 0), 0);
  const avgMin = children.length > 0 ? Math.round(children.reduce((a, c) => a + (c.usedToday || 0), 0) / children.length) : 0;
  const belohnungen = getBelohnungen();
 
  document.getElementById('uebersichtMeta').textContent =
    `${children.length} ${t('children')} · ${totalDevices} ${t('activeDevices')} · Ø ${avgMin} ${t('minToday')}`;
  document.getElementById('statGeraete').textContent = totalDevices;
  document.getElementById('statMinuten').textContent = avgMin + ' min';
  document.getElementById('statBelohnungen').textContent = belohnungen.length;
}
 
// ─── Familie Karten ──────────────────────────
function soften(hex, a) { return hex + a; }
 
function renderKinderGrid() {
  const children = getChildren();
  const grid = document.getElementById('uebersichtKinderGrid');
 
  if (children.length === 0) {
    grid.innerHTML = `<div class="uebersicht-empty">${t('noChildren')}</div>`;
    return;
  }
 
  grid.innerHTML = children.map(child => {
    const pct = child.dailyLimit > 0 ? Math.round((child.usedToday / child.dailyLimit) * 100) : 0;
    const wkTotal = (child.weekData || []).reduce((a, b) => a + b, 0);
    const wkPct = child.dailyLimit > 0 ? Math.round((wkTotal / (child.dailyLimit * 7)) * 100) : 0;
    const maxB = Math.max(...(child.weekData || [0, 0, 0, 0, 0, 0, 0]), child.dailyLimit, 1);
 
    const bars = (child.weekData || [0,0,0,0,0,0,0]).map((m, i) => {
      const h = maxB > 0 ? Math.max(4, (m / maxB) * 60) : 4;
      const op = m === 0 ? 0.15 : 0.65;
      return `<div class="ueb-bar-col">
        <div class="ueb-bar" style="height:${h}px;background:${child.color};opacity:${op}"></div>
        <span class="ueb-bar-label">${WK[i]}</span>
      </div>`;
    }).join('');
 
    // Badges
    const badges = [];
    if (child.streak >= 5) badges.push(`<span class="ueb-badge" style="background:${soften(child.color,'1A')};color:${child.color}">Streak Queen</span>`);
    if (pct <= 100 && child.usedToday > 0) badges.push(`<span class="ueb-badge" style="background:${soften(child.color,'1A')};color:${child.color}">Limit-Held</span>`);
 
    return `
    <div class="ueb-kind-card" style="border-top: 4px solid ${soften(child.color,'40')}">
      ${child.streak > 0 ? `<div class="ueb-streak" style="color:${child.color};background:${soften(child.color,'1A')}">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1.5C6.8 3 7.5 3.5 8.5 4.5C9.5 5.8 9.5 7.5 8 9C7 10 5 10 4 9C2.5 7.5 2.5 5.8 3.5 4.5C4.5 3.5 5.2 3 6 1.5Z" stroke="${child.color}" stroke-width="1" fill="none"/></svg>
        ${child.streak}d</div>` : ''}
      <div class="ueb-kind-avatar" style="background:${soften(child.color,'20')};border:3px solid ${child.color}">
        <span style="color:${child.color}">${child.name.charAt(0)}</span>
      </div>
      <div class="ueb-kind-name">${child.name}</div>
      <div class="ueb-kind-age">${child.age} Jahre</div>
      <div class="ueb-kind-stats">
        <div class="ueb-stat-row">
          <span>Heute</span>
          <span style="color:${child.color};font-weight:800">${child.usedToday} / ${child.dailyLimit} min</span>
        </div>
        <div class="ueb-progress-bar" style="background:${soften(child.color,'20')}">
          <div class="ueb-progress-fill" style="width:${Math.min(100,pct)}%;background:${child.color}"></div>
        </div>
        <div class="ueb-stat-row">
          <span>Wochenziel</span>
          <span style="color:${child.color};font-weight:800">${wkPct}%</span>
        </div>
        <div class="ueb-progress-bar" style="background:${soften(child.color,'20')}">
          <div class="ueb-progress-fill" style="width:${Math.min(100,wkPct)}%;background:${child.color}"></div>
        </div>
      </div>
      <div class="ueb-week-chart">${bars}</div>
      ${badges.length > 0 ? `<div class="ueb-badges">${badges.join('')}</div>` : ''}
    </div>`;
  }).join('');
}
 
// ─── Belohnung schenken ──────────────────────
let belSelectedChild = null;
let belSelectedReason = null;
let belSelectedMinutes = null;
 
function renderBelKinder() {
  const children = getChildren();
  const container = document.getElementById('belKinder');
  container.innerHTML = children.map(child => `
    <div class="ueb-bel-child ${belSelectedChild === child.id ? 'active' : ''}"
         style="--c:${child.color}"
         onclick="selectBelChild('${child.id}')">
      <div class="ueb-bel-child-avatar" style="background:${soften(child.color,'20')};border:2px solid ${child.color}">
        <span style="color:${child.color}">${child.name.charAt(0)}</span>
      </div>
      <span>${child.name}</span>
    </div>`).join('') || `<span style="color:#b0a9a0;font-size:13px">${t('noChildren')}</span>`;
}
 
function selectBelChild(id) {
  belSelectedChild = id;
  renderBelKinder();
  checkBelSubmit();
}
 
function checkBelSubmit() {
  const mins = belSelectedMinutes || parseInt(document.getElementById('belEigeneMinuten').value);
  document.getElementById('belSubmitBtn').disabled = !(belSelectedChild && (belSelectedReason || document.getElementById('belEigenerGrund').value.trim()) && mins > 0);
}
 
// Reason buttons
document.querySelectorAll('.uebersicht-bel-reason-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.uebersicht-bel-reason-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    belSelectedReason = btn.textContent;
    checkBelSubmit();
  });
});
 
// Minute buttons
document.querySelectorAll('.uebersicht-bel-min-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.uebersicht-bel-min-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    belSelectedMinutes = parseInt(btn.dataset.mins);
    document.getElementById('belEigeneMinuten').value = '';
    checkBelSubmit();
  });
});
 
document.getElementById('belEigeneMinuten').addEventListener('input', () => {
  document.querySelectorAll('.uebersicht-bel-min-btn').forEach(b => b.classList.remove('active'));
  belSelectedMinutes = null;
  checkBelSubmit();
});
 
document.getElementById('belEigenerGrund').addEventListener('input', checkBelSubmit);
 
document.getElementById('belSubmitBtn').addEventListener('click', () => {
  const children = getChildren();
  const child = children.find(c => c.id === belSelectedChild || c.id === String(belSelectedChild));
  if (!child) return;
 
  const mins = belSelectedMinutes || parseInt(document.getElementById('belEigeneMinuten').value);
  const reason = belSelectedReason || document.getElementById('belEigenerGrund').value.trim();
  if (!mins || !reason) return;
 
  const belohnungen = getBelohnungen();
  belohnungen.unshift({
    childId: child.id, childName: child.name, childColor: child.color,
    mins, reason, time: Date.now()
  });
  saveBelohnungen(belohnungen);
 
  // Reset
  belSelectedChild = null; belSelectedReason = null; belSelectedMinutes = null;
  document.querySelectorAll('.uebersicht-bel-reason-btn, .uebersicht-bel-min-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('belEigenerGrund').value = '';
  document.getElementById('belEigeneMinuten').value = '';
  document.getElementById('belSubmitBtn').disabled = true;
 
  renderAll();
});
 
function renderBelLetzte() {
  const belohnungen = getBelohnungen().slice(0, 3);
  const list = document.getElementById('belLetzteList');
  if (belohnungen.length === 0) {
    list.innerHTML = `<div class="ueb-empty-small">${t('noRewards')}</div>`;
    return;
  }
  list.innerHTML = belohnungen.map(b => {
    const ago = getTimeAgo(b.time);
    return `<div class="ueb-bel-letzte-item">
      <div class="ueb-bel-letzte-avatar" style="background:${soften(b.childColor,'20')};color:${b.childColor}">
        ${b.childName.charAt(0)}
      </div>
      <div>
        <div class="ueb-bel-letzte-name">
          <strong>${b.childName}</strong>
          <span style="color:#7ec99a;font-weight:700"> +${b.mins} min</span>
        </div>
        <div class="ueb-bel-letzte-reason">${b.reason} · ${ago}</div>
      </div>
    </div>`;
  }).join('');
}
 
// ─── Aktivitäten ─────────────────────────────
function renderAktivitaeten() {
  const children = getChildren();
  const belohnungen = getBelohnungen();
  const list = document.getElementById('aktivitaetenList');
 
  const events = [];
 
  children.forEach(child => {
    if (child.usedToday >= child.dailyLimit && child.dailyLimit > 0) {
      events.push({ child, type: 'limit', time: Date.now() - 2*3600000, color: child.color });
    }
    if (child.streak === 1) {
      events.push({ child, type: 'streakStart', time: Date.now() - 4*3600000, color: child.color });
    }
    if (child.streak > 1) {
      events.push({ child, type: 'streak', time: Date.now() - 24*3600000, color: child.color });
    }
  });
 
  belohnungen.slice(0, 3).forEach(b => {
    events.push({ childName: b.childName, color: b.childColor, type: 'reward', mins: b.mins, time: b.time });
  });
 
  events.sort((a, b) => b.time - a.time);
 
  if (events.length === 0) {
    list.innerHTML = `<div class="ueb-empty-small">${t('noActivities')}</div>`;
    return;
  }
 
  const icons = {
    limit: (c) => `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6" stroke="${c}" stroke-width="1.4"/><path d="M9 6v3l2 2" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    reward: (c) => `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="4" y="8" width="10" height="7" rx="1.5" stroke="${c}" stroke-width="1.4"/><path d="M9 8V6a2 2 0 00-4 0 2 2 0 004 0zM9 8V6a2 2 0 014 0 2 2 0 01-4 0z" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    streakStart: (c) => `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C10 4 11 4.5 12 6C13.5 7.5 13 10 11 11.5C9.5 12.5 7 12 6 11C4 9 4.5 7 6 5.5C7 4.5 8 4 9 2Z" stroke="${c}" stroke-width="1.4" fill="none"/></svg>`,
    streak: (c) => `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2l1.5 3 3.5.5-2.5 2.5.5 3.5L9 10l-3 1.5.5-3.5L4 5.5l3.5-.5z" stroke="${c}" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  };
 
  const bgColors = { limit:'#EAF2FB', reward:'#FEF3E2', streakStart:'#FDEEF2', streak:'#EDF6EF' };
 
  list.innerHTML = events.slice(0, 6).map(ev => {
    const name = ev.child ? ev.child.name : ev.childName;
    const color = ev.color;
    let text = '';
    if (ev.type === 'limit') text = `${name} ${t('actLimitReached')}`;
    else if (ev.type === 'reward') text = `${name} ${t('actRewardGiven')} +${ev.mins} min`;
    else if (ev.type === 'streakStart') text = `${name}: ${t('actStreakStart')}`;
    else if (ev.type === 'streak') text = `${name}: ${(ev.child?.streak || '')} ${t('actStreakReached')}`;
 
    return `<div class="ueb-aktivitaet-item">
      <div class="ueb-aktivitaet-icon" style="background:${bgColors[ev.type]}">
        ${icons[ev.type](color)}
      </div>
      <div>
        <div class="ueb-aktivitaet-text">${text}</div>
        <div class="ueb-aktivitaet-time">${getTimeAgo(ev.time)}</div>
      </div>
    </div>`;
  }).join('');
}
 
// ─── Wochenübersicht ─────────────────────────
let wocheTab = 'einzeln';
let wocheSelectedChild = null;
 
function setWocheTab(tab) {
  wocheTab = tab;
  document.getElementById('tabEinzeln').classList.toggle('active', tab === 'einzeln');
  document.getElementById('tabAlle').classList.toggle('active', tab === 'alle');
  renderWoche();
}
 
function renderWoche() {
  const children = getChildren();
 
  // Child tabs
  const tabsEl = document.getElementById('wocheKinderTabs');
  if (wocheTab === 'einzeln') {
    tabsEl.style.display = 'flex';
    if (!wocheSelectedChild && children.length > 0) wocheSelectedChild = children[0].id;
    tabsEl.innerHTML = children.map(c => `
      <button class="uebersicht-woche-tab uebersicht-woche-tab--child ${wocheSelectedChild === c.id || wocheSelectedChild === String(c.id) ? 'active' : ''}"
              style="${(wocheSelectedChild === c.id || wocheSelectedChild === String(c.id)) ? `background:${soften(c.color,'30')};color:${c.color}` : ''}"
              onclick="selectWocheChild('${c.id}')">
        ${c.name}
      </button>`).join('');
  } else {
    tabsEl.style.display = 'none';
  }
 
  // Chart
  const chart = document.getElementById('wocheChart');
  let data = [];
  let color = '#b49ed4';
 
  if (wocheTab === 'alle') {
    data = [0,0,0,0,0,0,0];
    children.forEach(c => {
      (c.weekData || [0,0,0,0,0,0,0]).forEach((v, i) => { data[i] += v; });
    });
  } else {
    const child = children.find(c => String(c.id) === String(wocheSelectedChild));
    data = child ? (child.weekData || [0,0,0,0,0,0,0]) : [0,0,0,0,0,0,0];
    color = child ? child.color : '#b49ed4';
  }
 
  const maxVal = Math.max(...data, 1);
  const total = data.reduce((a,b) => a+b, 0);
  document.getElementById('wocheTotal').textContent = total + ' min';
 
  chart.innerHTML = data.map((val, i) => {
    const h = Math.max(4, (val / maxVal) * 140);
    const op = val === 0 ? 0.15 : 0.75;
    return `<div class="ueb-woche-bar-col">
      <div class="ueb-woche-bar-val">${val > 0 ? val : ''}</div>
      <div class="ueb-woche-bar" style="height:${h}px;background:${color};opacity:${op}"></div>
      <span class="ueb-woche-bar-label">${WK[i]}</span>
    </div>`;
  }).join('');
}
 
function selectWocheChild(id) {
  wocheSelectedChild = id;
  renderWoche();
}
 
// ─── Profil Dropdown ─────────────────────────
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');
 
profileBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  profileDropdown.classList.toggle('active');
});
 
document.addEventListener('click', () => profileDropdown.classList.remove('active'));
profileDropdown.addEventListener('click', e => e.stopPropagation());
 
// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    await fetch('api/logout.php', { method: 'POST' });
  } catch(e) {}
  localStorage.removeItem('lumi_session');
  localStorage.removeItem('lumi_user');
  window.location.href = 'login.html';
});
 
// ─── Passwort Modal ──────────────────────────
function openPasswordModal() {
  document.getElementById('passwordModalOverlay').classList.add('active');
  profileDropdown.classList.remove('active');
}
function closePasswordModal() {
  document.getElementById('passwordModalOverlay').classList.remove('active');
}
function savePassword() {
  const curr = document.getElementById('pwCurrent').value;
  const newPw = document.getElementById('pwNew').value;
  const confirm = document.getElementById('pwConfirm').value;
  if (!curr || !newPw || !confirm) return alert('Bitte alle Felder ausfüllen.');
  if (newPw !== confirm) return alert('Passwörter stimmen nicht überein.');
  alert('Passwort wurde gespeichert. (Funktion noch nicht mit Backend verknüpft)');
  closePasswordModal();
}
 
// ─── Hilfsfunktionen ─────────────────────────
function getTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (currentLang === 'de') {
    if (mins < 2) return 'gerade eben';
    if (mins < 60) return `vor ${mins} Min`;
    if (hours < 24) return `vor ${hours}h`;
    return `gestern`;
  } else {
    if (mins < 2) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    if (hours < 24) return `${hours}h ago`;
    return 'yesterday';
  }
}
 
// ─── Init ────────────────────────────────────
function renderAll() {
  applyTranslations();
  renderUser();
  renderHeader();
  renderKinderGrid();
  renderBelKinder();
  renderBelLetzte();
  renderAktivitaeten();
  renderWoche();
  // Sprachbuttons
  document.getElementById('langDE').classList.toggle('active', currentLang === 'de');
  document.getElementById('langEN').classList.toggle('active', currentLang === 'en');
}
 
renderAll();