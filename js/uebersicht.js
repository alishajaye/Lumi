/* =============================================
   LUMI – Übersicht JS (API-basiert mit Live-Ticker - BEREINIGT)
   ============================================= */

   const WK_DE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
   const WK_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
   
   // ─── Übersetzungen ───────────────────────────
   const TRANSLATIONS = {
     de: {
       language: 'Sprache', changePassword: 'Passwort ändern', logout: 'Abmelden',
       devices: 'Geräte', avgToday: 'Ø heute',
       family: 'Familie', manage: 'Verwalten ›',
       activities: 'Aktivitäten', seeAll: 'Alle sehen',
       weekOverview: 'Wochenübersicht', monToSun: 'Montag bis Sonntag',
       thisWeek: 'diese Woche bis heute', allChildren: 'Alle Kinder',
       noChildren: 'Noch keine Kinder hinzugefügt',
       currentPassword: 'AKTUELLES PASSWORT', newPassword: 'NEUES PASSWORT',
       confirmPassword: 'PASSWORT BESTÄTIGEN', cancel: 'Abbrechen', save: 'Speichern',
       greetingMorning: 'Guten Morgen', greetingAfternoon: 'Guten Nachmittag',
       greetingEvening: 'Guten Abend',
       actLimitReached: 'hat sein Tageslimit eingehalten',
       actSessionEnded: 'Tablet-Session beendet',
       actStreakStart: 'erster Tages-Streak started',
       actStreakReached: 'Tage-Streak erreicht',
       minToday: 'min heute', noActivities: 'Noch keine Aktivitäten vorhanden',
       children: 'Kinder', activeDevices: 'Geräte aktiv',
       years: 'Jahre',
       today: 'Heute', weekGoal: 'Wochenziel',
     },
     en: {
       language: 'Language', changePassword: 'Change Password', logout: 'Sign Out',
       devices: 'Devices', avgToday: 'Ø today',
       family: 'Family', manage: 'Manage ›',
       activities: 'Activities', seeAll: 'See all',
       weekOverview: 'Weekly Overview', monToSun: 'Monday to Sunday',
       thisWeek: 'this week so far', allChildren: 'All Children',
       noChildren: 'No children added yet',
       currentPassword: 'CURRENT PASSWORD', newPassword: 'NEW PASSWORD',
       confirmPassword: 'CONFIRM PASSWORD', cancel: 'Cancel', save: 'Save',
       greetingMorning: 'Good morning', greetingAfternoon: 'Good afternoon',
       greetingEvening: 'Good evening',
       actLimitReached: 'kept their daily limit',
       actSessionEnded: 'Tablet session ended',
       actStreakStart: 'first daily streak started',
       actStreakReached: 'day streak reached',
       minToday: 'min today', noActivities: 'No activities yet',
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
   function renderUser() {
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
           var iconKey = 'lumi_child_icon_' + child.id;
           var icon = child.icon || localStorage.getItem(iconKey) || '';
           return {
             id: String(child.id),
             name: child.name,
             age: Number(child.age),
             color: child.color || '#F19DAE',
             icon: icon,
             dailyLimit: Number(child.daily_limit),
             usedTodayStored: Number(child.used_today || 0), 
             isCurrentlyUsing: Boolean(child.is_currently_using),
             currentSessionStart: child.current_session_start,
             streak: Number(child.streak || 0),
             timeSaved: Number(child.time_saved || 0),
             deviceId: child.device_id,
             devices: [],
             weekData: child.week_data || [0, 0, 0, 0, 0, 0, 0],
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
   
   // ─── Hilfsfunktionen ─────────────────────────
   function soften(hex, a) { return hex + a; }
   
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
   
   // Hilfsfunktion zur sekundengenauen Berechnung der heutigen Live-Minuten
   function calculateLiveMinutes(child) {
     let totalMinutes = child.usedTodayStored;
   
     if (child.isCurrentlyUsing && child.currentSessionStart) {
       const startTime = new Date(child.currentSessionStart);
       const now = new Date();
       const diffInMilliseconds = now - startTime;
       const diffInMinutes = diffInMilliseconds / 1000 / 60;
       
       totalMinutes += diffInMinutes;
     }
     return totalMinutes;
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
     const avgMin = children.length > 0 ? Math.round(children.reduce((a, c) => a + calculateLiveMinutes(c), 0) / children.length) : 0;
   
     document.getElementById('uebersichtMeta').textContent =
       `${children.length} ${t('children')} · ${totalDevices} ${t('activeDevices')} · Ø ${avgMin} ${t('minToday')}`;
     document.getElementById('statGeraete').textContent = totalDevices;
     document.getElementById('statMinuten').textContent = avgMin + ' min';
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
       const liveMinutes = calculateLiveMinutes(child);
       const liveMinutesFloor = Math.floor(liveMinutes);
   
       const pct = child.dailyLimit > 0 ? Math.round((liveMinutes / child.dailyLimit) * 100) : 0;
       
       const currentDayIndex = (new Date().getDay() + 6) % 7; 
       
       const displayWeekData = [...child.weekData];
       if (liveMinutesFloor > displayWeekData[currentDayIndex]) {
           displayWeekData[currentDayIndex] = liveMinutesFloor;
       }
   
       const wkTotal = displayWeekData.reduce((a, b) => a + b, 0);
       const wkPct = child.dailyLimit > 0 ? Math.round((wkTotal / (child.dailyLimit * 7)) * 100) : 0;
       const maxB = Math.max(...displayWeekData, child.dailyLimit, 1);
   
       const bars = displayWeekData.map((m, i) => {
         const h = maxB > 0 ? Math.max(4, (m / maxB) * 60) : 4;
         const op = m === 0 ? 0.15 : 0.65;
         return `<div class="ueb-bar-col">
           <div class="ueb-bar" style="height:${h}px;background:${child.color};opacity:${op}"></div>
           <span class="ueb-bar-label">${wk[i]}</span>
         </div>`;
       }).join('');
   
       const badges = [];
       if (child.streak >= 5) badges.push(`<span class="ueb-badge" style="background:${soften(child.color,'1A')};color:${child.color}">Streak Queen</span>`);
       if (pct <= 100 && liveMinutesFloor > 0) badges.push(`<span class="ueb-badge" style="background:${soften(child.color,'1A')};color:${child.color}">Limit-Held</span>`);
   
       return `
       <div class="ueb-kind-card ${child.isCurrentlyUsing ? 'is-active-using' : ''}" style="border-top: 4px solid ${soften(child.color,'40')}">
         ${child.streak > 0 ? `<div class="ueb-streak" style="color:${child.color};background:${soften(child.color,'1A')}">
           <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1.5C6.8 3 7.5 3.5 8.5 4.5C9.5 5.8 9.5 7.5 8 9C7 10 5 10 4 9C2.5 7.5 2.5 5.8 3.5 4.5C4.5 3.5 5.2 3 6 1.5Z" stroke="${child.color}" stroke-width="1" fill="none"/></svg>
           ${child.streak}d</div>` : ''}
         <div class="ueb-kind-avatar" style="background:${soften(child.color,'20')};border:3px solid ${child.color}; ${child.isCurrentlyUsing ? 'box-shadow: 0 0 12px ' + child.color : ''}">
           ${renderAvatar(child, 'md')}
         </div>
         <div class="ueb-kind-name">${child.name} ${child.isCurrentlyUsing ? '⚡' : ''}</div>
         <div class="ueb-kind-age">${child.age} ${t('years')}</div>
         <div class="ueb-kind-stats">
           <div class="ueb-stat-row">
             <span>${t('today')}</span>
             <span style="color:${child.color};font-weight:800">${liveMinutesFloor} / ${child.dailyLimit} min</span>
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
   
   // ─── Echte Aktivitäten von notifications.php laden ───
   async function renderAktivitaeten() {
     const list = document.getElementById('aktivitaetenList');
     if (!list) return;
   
     try {
       const response = await fetch('api/notifications.php');
       const data = await response.json();
   
       if (data.status !== 'success') {
         list.innerHTML = `<div class="ueb-empty-small">Fehler beim Laden</div>`;
         return;
       }
   
       const notifications = data.notifications;
   
       if (!notifications || notifications.length === 0) {
         list.innerHTML = `<div class="ueb-empty-small">${t('noActivities')}</div>`;
         return;
       }
   
       // Zeige maximal die neuesten 6 Aktivitäten auf dem Dashboard an
       const latestNotifications = notifications.slice(0, 6);
   
       list.innerHTML = latestNotifications.map(notif => {
         const date = new Date(notif.created_at);
         const formattedTime = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
         const childColor = notif.color || '#5192D2';
   
         return `
         <div class="ueb-aktivitaet-item" style="display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid #f5f5f5;">
           <div class="ueb-aktivitaet-icon" style="background-color: ${childColor}15; width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:50%;">
             <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
               <circle cx="8" cy="8" r="6" stroke="${childColor}" stroke-width="1.5"/>
               <path d="M8 5v3l2 2" stroke="${childColor}" stroke-width="1.5" stroke-linecap="round"/>
             </svg>
           </div>
           <div style="flex: 1;">
             <div style="font-size: 14px; font-weight: 700; color: #2d2d2d;">${notif.child_name}</div>
             <div style="font-size: 13px; color: #666; margin-top: 2px;">${notif.message}</div>
           </div>
           <div style="font-size: 12px; color: #a0a0a0; white-space: nowrap;">${formattedTime} Uhr</div>
         </div>`;
       }).join('');
   
     } catch (error) {
       console.error('Fehler beim Laden der Aktivitäten:', error);
       list.innerHTML = `<div class="ueb-empty-small">Verbindung zur API fehlgeschlagen</div>`;
     }
   }
   
   // ─── Wochenübersicht ─────────────────────────
   let wocheSelectedChild = null;
   let wocheShowAll = false;
   
   function selectWocheChild(id) {
     wocheSelectedChild = id;
     wocheShowAll = false;
     renderWoche();
   }
   
   function selectWocheAll() {
     wocheShowAll = true;
     wocheSelectedChild = null;
     renderWoche();
   }
   
   function renderWoche() {
     const wk = WK();
     const tabsEl = document.getElementById('wocheKinderTabs');
   
     if (!wocheSelectedChild && !wocheShowAll && children.length > 0) {
       wocheSelectedChild = children[0].id;
     }
   
     let tabsHtml = children.map(c => {
       const isActive = !wocheShowAll && (wocheSelectedChild === c.id || wocheSelectedChild === String(c.id));
       return `<button class="uebersicht-woche-tab uebersicht-woche-tab--child ${isActive ? 'active' : ''}"
               style="${isActive ? 'background:' + soften(c.color,'30') + ';color:' + c.color : ''}"
               onclick="selectWocheChild('${c.id}')">
         ${c.name}
       </button>`;
     }).join('');
   
     if (children.length > 1) {
       tabsHtml += `<button class="uebersicht-woche-tab ${wocheShowAll ? 'active' : ''}" onclick="selectWocheAll()">${t('allChildren')}</button>`;
     }
   
     tabsEl.innerHTML = tabsHtml;
     tabsEl.style.display = 'flex';
   
     const chart = document.getElementById('wocheChart');
     const currentDayIndex = (new Date().getDay() + 6) % 7; // 0=Mo, 1=Di... 6=So
   
     if (wocheShowAll && children.length > 1) {
       const allWeekDataLive = children.map(c => {
           const baseData = [...(c.weekData || [0,0,0,0,0,0,0])];
           const liveFloor = Math.floor(calculateLiveMinutes(c));
           if (liveFloor > baseData[currentDayIndex]) {
               baseData[currentDayIndex] = liveFloor;
           }
           return baseData;
       });
   
       const maxVal = Math.max(...allWeekDataLive.flat(), 1);
       const total = allWeekDataLive.reduce((sum, wd) => sum + wd.reduce((a,b) => a+b, 0), 0);
       document.getElementById('wocheTotal').textContent = total + ' min';
   
       chart.innerHTML = wk.map((day, i) => {
         const barsHtml = children.map((child, childIdx) => {
           const val = allWeekDataLive[childIdx][i];
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
       let data = [0,0,0,0,0,0,0];
       let color = '#b49ed4';
   
       if (wocheShowAll) {
         children.forEach(c => {
           const baseData = [...(c.weekData || [0,0,0,0,0,0,0])];
           const liveFloor = Math.floor(calculateLiveMinutes(c));
           if (liveFloor > baseData[currentDayIndex]) baseData[currentDayIndex] = liveFloor;
           
           baseData.forEach((v, i) => { data[i] += v; });
         });
         if (children.length === 1) color = children[0].color;
       } else {
         const child = children.find(c => String(c.id) === String(wocheSelectedChild));
         if (child) {
           data = [...(child.weekData || [0,0,0,0,0,0,0])];
           const liveFloor = Math.floor(calculateLiveMinutes(child));
           if (liveFloor > data[currentDayIndex]) data[currentDayIndex] = liveFloor;
           color = child.color;
         }
       }
   
       const maxVal = Math.max(...data, 1);
       const total = data.reduce((a,b) => a+b, 0);
       document.getElementById('wocheTotal').textContent = total + ' min';
   
       chart.innerHTML = data.map((val, i) => {
         const h = Math.max(4, (val / maxVal) * 140);
         const op = val === 0 ? 0.15 : 0.75;
         return `<div class="ueb-woche-bar-col">
           <div class="ueb-woche-bar-val">${val > 0 ? val : ''}</div>
           <div class="ueb-woche-bar" style="height:${h}px;background:${color};opacity:${op};border-radius:6px 6px 0 0;transition:height 0.3s ease"></div>
           <span class="ueb-woche-bar-label">${wk[i]}</span>
         </div>`;
       }).join('');
     }
   }
   
   // ─── Live-Ticker Logik ─────────────────────────
   function startLiveDashboardTicker() {
     if (window.liveDashboardInterval) clearInterval(window.liveDashboardInterval);
   
     window.liveDashboardInterval = setInterval(() => {
       const activeChildRunning = children.some(c => c.isCurrentlyUsing);
       if (activeChildRunning) {
         renderHeader();
         renderKinderGrid();
         renderWoche();
       }
     }, 1000);
   
     if (window.apiPollInterval) clearInterval(window.apiPollInterval);
     window.apiPollInterval = setInterval(async () => {
       await loadChildren();
       renderHeader();
       renderKinderGrid();
       renderAktivitaeten();
       renderWoche();
     }, 10000);
   }
   
   // ─── Init ────────────────────────────────────
   function renderAllSync() {
     applyTranslations();
     renderUser();
     renderHeader();
     renderKinderGrid();
     renderAktivitaeten();
     renderWoche();
   }
   
   async function renderAll() {
     await loadChildren();
     renderAllSync();
     startLiveDashboardTicker(); 
   }
   
   renderAll();