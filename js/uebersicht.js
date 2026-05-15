/* =============================================
   LUMI – Übersicht JS  (API-basiert)
   ============================================= */

const WK_DE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const WK_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
    years: 'Jahre',
    today: 'Heute', weekGoal: 'Wochenziel',
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
    years: 'years',
    today: 'Today', weekGoal: 'Week goal',
  }
};

// currentLang is declared in nav.js (loaded first)
function t(key) { return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || key; }
function WK() { return currentLang === 'en' ? WK_EN : WK_DE; }

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
// getUser() is defined in nav.js
function renderUser() {
  // nav.js handles profile display via updateProfileDisplay()
  if (typeof updateProfileDisplay === 'function') updateProfileDisplay();
}

// ─── Kinder von API laden ────────────────────
let children = [];

async function loadChildren() {
  try {
    const response = await fetch('api/kinder.php');
    const result = await response.json();

    if (result.status === 'success') {
      children = result.children.map(child => {
        // Try to get icon from API, fallback to localStorage
        var iconKey = 'lumi_child_icon_' + child.id;
        var icon = child.icon || localStorage.getItem(iconKey) || '';
        return {
          id: String(child.id),
          name: child.name,
          age: Number(child.age),
          color: child.color || '#F19DAE',
          icon: icon,
          dailyLimit: Number(child.daily_limit),
          usedToday: Number(child.used_today || 0),
          streak: Number(child.streak || 0),
          timeSaved: Number(child.time_saved || 0),
          deviceId: child.device_id,
          devices: [],
          weekData: [0, 0, 0, 0, 0, 0, 0],
        };
      });
    } else {
      children = [];
    }
  } catch (error) {
    console.error('Fehler beim Laden der Kinder:', error);
    children = [];
  }
}

// ─── Belohnungen (localStorage, da keine API dafür) ───
function getBelohnungen() {
  const raw = localStorage.getItem('lumi_belohnungen');
  if (raw) return JSON.parse(raw);
  return [];
}

function saveBelohnungen(b) {
  localStorage.setItem('lumi_belohnungen', JSON.stringify(b));
}

// ─── Hilfsfunktionen ─────────────────────────
function soften(hex, a) { return hex + a; }

// Render avatar: SVG icon or first letter (uses lumi-icons.js if loaded)
function renderAvatar(child, size) {
  if (typeof renderLumiAvatar === 'function') return renderLumiAvatar(child, size);
  var fontSize = size === 'sm' ? '15px' : size === 'lg' ? '28px' : '22px';
  return '<span style="color:' + child.color + ';font-size:' + fontSize + ';font-weight:900">' + child.name.charAt(0) + '</span>';
}

function getTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (currentLang === 'de') {
    if (mins < 2) return 'gerade eben';
    if (mins < 60) return `vor ${mins} Min`;
    if (hours < 24) return `vor ${hours}h`;
    return 'gestern';
  } else {
    if (mins < 2) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    if (hours < 24) return `${hours}h ago`;
    return 'yesterday';
  }
}

// ─── Datum & Begrüssung ──────────────────────
function renderHeader() {
  const now = new Date();
  const h = now.getHours();
  const greeting = h < 12 ? t('greetingMorning') : h < 18 ? t('greetingAfternoon') : t('greetingEvening');
  const user = getUser();
  const name = user.name || user.email.split('@')[0];

  const days_de = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
  const months_de = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  const dateStr = currentLang === 'de'
    ? `${days_de[now.getDay()]}, ${now.getDate()}. ${months_de[now.getMonth()]} ${now.getFullYear()}`
    : now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  document.getElementById('uebersichtDate').textContent = dateStr;
  document.getElementById('uebersichtGreeting').textContent = `${greeting}, ${name}.`;

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
function renderKinderGrid() {
  const grid = document.getElementById('uebersichtKinderGrid');

  if (children.length === 0) {
    grid.innerHTML = `<div class="uebersicht-empty">${t('noChildren')}</div>`;
    return;
  }

  const wk = WK();

  grid.innerHTML = children.map(child => {
    const pct = child.dailyLimit > 0 ? Math.round((child.usedToday / child.dailyLimit) * 100) : 0;
    const wkTotal = (child.weekData || []).reduce((a, b) => a + b, 0);
    const wkPct = child.dailyLimit > 0 ? Math.round((wkTotal / (child.dailyLimit * 7)) * 100) : 0;
    const maxB = Math.max(...(child.weekData || [0,0,0,0,0,0,0]), child.dailyLimit, 1);

    const bars = (child.weekData || [0,0,0,0,0,0,0]).map((m, i) => {
      const h = maxB > 0 ? Math.max(4, (m / maxB) * 60) : 4;
      const op = m === 0 ? 0.15 : 0.65;
      return `<div class="ueb-bar-col">
        <div class="ueb-bar" style="height:${h}px;background:${child.color};opacity:${op}"></div>
        <span class="ueb-bar-label">${wk[i]}</span>
      </div>`;
    }).join('');

    const badges = [];
    if (child.streak >= 5) badges.push(`<span class="ueb-badge" style="background:${soften(child.color,'1A')};color:${child.color}">Streak Queen</span>`);
    if (pct <= 100 && child.usedToday > 0) badges.push(`<span class="ueb-badge" style="background:${soften(child.color,'1A')};color:${child.color}">Limit-Held</span>`);

    return `
    <div class="ueb-kind-card" style="border-top: 4px solid ${soften(child.color,'40')}">
      ${child.streak > 0 ? `<div class="ueb-streak" style="color:${child.color};background:${soften(child.color,'1A')}">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1.5C6.8 3 7.5 3.5 8.5 4.5C9.5 5.8 9.5 7.5 8 9C7 10 5 10 4 9C2.5 7.5 2.5 5.8 3.5 4.5C4.5 3.5 5.2 3 6 1.5Z" stroke="${child.color}" stroke-width="1" fill="none"/></svg>
        ${child.streak}d</div>` : ''}
      <div class="ueb-kind-avatar" style="background:${soften(child.color,'20')};border:3px solid ${child.color}">
        ${renderAvatar(child, 'md')}
      </div>
      <div class="ueb-kind-name">${child.name}</div>
      <div class="ueb-kind-age">${child.age} ${t('years')}</div>
      <div class="ueb-kind-stats">
        <div class="ueb-stat-row">
          <span>${t('today')}</span>
          <span style="color:${child.color};font-weight:800">${child.usedToday} / ${child.dailyLimit} min</span>
        </div>
        <div class="ueb-progress-bar" style="background:${soften(child.color,'20')}">
          <div class="ueb-progress-fill" style="width:${Math.min(100,pct)}%;background:${child.color}"></div>
        </div>
        <div class="ueb-stat-row">
          <span>${t('weekGoal')}</span>
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
  const container = document.getElementById('belKinder');

  // Auto-select if only one child
  if (children.length === 1 && !belSelectedChild) {
    belSelectedChild = children[0].id;
  }

  container.innerHTML = children.map(child => {
    const isActive = String(belSelectedChild) === String(child.id);
    return `
    <div class="ueb-bel-child ${isActive ? 'active' : ''}"
         style="--c:${child.color};${isActive ? 'background:' + soften(child.color,'15') + ';' : ''}"
         onclick="selectBelChild('${child.id}')">
      <div class="ueb-bel-child-avatar" style="background:${soften(child.color,'20')};border:2px solid ${child.color}">
        ${renderAvatar(child, 'sm')}
      </div>
      <span>${child.name}</span>
    </div>`;
  }).join('') || `<span style="color:#b0a9a0;font-size:13px">${t('noChildren')}</span>`;

  checkBelSubmit();
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

  // Update colors and icons from current children data
  list.innerHTML = belohnungen.map(b => {
    const child = children.find(c => c.id === String(b.childId));
    const color = child ? child.color : b.childColor;
    const avatarContent = child && child.icon ? child.icon : b.childName.charAt(0);
    const ago = getTimeAgo(b.time);
    return `<div class="ueb-bel-letzte-item">
      <div class="ueb-bel-letzte-avatar" style="background:${soften(color,'20')};color:${color}">
        ${avatarContent}
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
    const child = children.find(c => c.id === String(b.childId));
    const color = child ? child.color : b.childColor;
    events.push({ childName: b.childName, color: color, type: 'reward', mins: b.mins, time: b.time });
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

function selectWocheChild(id) {
  wocheSelectedChild = id;
  renderWoche();
}

function renderWoche() {
  const wk = WK();

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

  if (wocheTab === 'alle' && children.length > 1) {
    // ─── GROUPED BARS: nebeneinander pro Tag, eine pro Kind ───
    const allWeekData = children.map(c => c.weekData || [0,0,0,0,0,0,0]);
    const maxVal = Math.max(...allWeekData.flat(), 1);
    const total = allWeekData.reduce((sum, wd) => sum + wd.reduce((a,b) => a+b, 0), 0);
    document.getElementById('wocheTotal').textContent = total + ' min';

    chart.innerHTML = wk.map((day, i) => {
      const barsHtml = children.map(child => {
        const val = (child.weekData || [0,0,0,0,0,0,0])[i];
        const h = Math.max(4, (val / maxVal) * 140);
        const op = val === 0 ? 0.15 : 0.75;
        const barWidth = Math.max(12, Math.floor(48 / children.length));
        return `<div style="display:flex;flex-direction:column;align-items:center;">
          <div class="ueb-woche-bar-val" style="font-size:9px">${val > 0 ? val : ''}</div>
          <div style="width:${barWidth}px;height:${h}px;background:${child.color};opacity:${op};border-radius:6px 6px 3px 3px;transition:height 0.3s ease"></div>
        </div>`;
      }).join('');

      return `<div class="ueb-woche-bar-col">
        <div style="display:flex;gap:3px;align-items:flex-end;flex:1;justify-content:center;height:100%">
          ${barsHtml}
        </div>
        <span class="ueb-woche-bar-label">${day}</span>
      </div>`;
    }).join('');

  } else {
    // ─── SINGLE CHILD or single bar per day ───
    let data = [0,0,0,0,0,0,0];
    let color = '#b49ed4';

    if (wocheTab === 'alle') {
      // Only 1 child, just show their data
      children.forEach(c => {
        (c.weekData || [0,0,0,0,0,0,0]).forEach((v, i) => { data[i] += v; });
      });
      if (children.length === 1) color = children[0].color;
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
        <span class="ueb-woche-bar-label">${wk[i]}</span>
      </div>`;
    }).join('');
  }
}

// ─── Profil Dropdown, Logout, Passwort Modal ─
// All handled by nav.js

// ─── Init ────────────────────────────────────
function renderAllSync() {
  applyTranslations();
  renderUser();
  renderHeader();
  renderKinderGrid();
  renderBelKinder();
  renderBelLetzte();
  renderAktivitaeten();
  renderWoche();
}

async function renderAll() {
  await loadChildren();
  renderAllSync();
}

// Initial load
renderAll();