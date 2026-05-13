/* =============================================
   LUMI – nav.js
   Läuft auf JEDER Seite: Auth-Check, Profil-Dropdown, Sprachwechsel, Nav
   ============================================= */
 
// ─── Language ────────────────────────────────
const SHARED_TRANSLATIONS = {
  de: {
    nav_uebersicht: 'Übersicht', nav_kinder: 'Kinder', nav_produkte: 'Produkte',
    nav_empfehlungen: 'Empfehlungen', nav_mitteilungen: 'Mitteilungen',
    language: 'Sprache', changePassword: 'Passwort ändern', logout: 'Abmelden',
    currentPassword: 'AKTUELLES PASSWORT', newPassword: 'NEUES PASSWORT',
    confirmPassword: 'PASSWORT BESTÄTIGEN', cancel: 'Abbrechen', save: 'Speichern',
    pwFillAll: 'Bitte alle Felder ausfüllen.', pwNoMatch: 'Passwörter stimmen nicht überein.',
    pwSaved: 'Passwort wurde gespeichert.',
  },
  en: {
    nav_uebersicht: 'Overview', nav_kinder: 'Children', nav_produkte: 'Products',
    nav_empfehlungen: 'Recommendations', nav_mitteilungen: 'Notifications',
    language: 'Language', changePassword: 'Change Password', logout: 'Sign Out',
    currentPassword: 'CURRENT PASSWORD', newPassword: 'NEW PASSWORD',
    confirmPassword: 'CONFIRM PASSWORD', cancel: 'Cancel', save: 'Save',
    pwFillAll: 'Please fill in all fields.', pwNoMatch: 'Passwords do not match.',
    pwSaved: 'Password saved.',
  }
};
 
var currentLang = localStorage.getItem('lumi_lang') || 'de';
 
function getSharedT(key) {
  return (SHARED_TRANSLATIONS[currentLang] && SHARED_TRANSLATIONS[currentLang][key]) || key;
}
 
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lumi_lang', lang);
  applySharedTranslations();
  // If page has its own renderAll, call it
  if (typeof renderAll === 'function') renderAll();
}
 
function applySharedTranslations() {
  // Nav links
  document.querySelectorAll('[data-i18n-nav]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-nav');
    var val = getSharedT(key);
    if (val !== key) el.textContent = val;
  });
 
  // Shared i18n elements (profile dropdown etc)
  document.querySelectorAll('[data-i18n-shared]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-shared');
    var val = getSharedT(key);
    if (val !== key) el.textContent = val;
  });
 
  // Update lang buttons
  var de = document.getElementById('langDE');
  var en = document.getElementById('langEN');
  if (de) de.classList.toggle('active', currentLang === 'de');
  if (en) en.classList.toggle('active', currentLang === 'en');
}
 
// ─── User ────────────────────────────────────
function getUser() {
  try {
    var raw = localStorage.getItem('lumi_user');
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return { name: 'User', email: '' };
}
 
// ─── Auth Check ──────────────────────────────
function checkAuth() {
  // Don't check auth on login or register pages
  var page = window.location.pathname.split('/').pop();
  if (page === 'login.html' || page === 'register.html') return;
 
  fetch('api/protected.php', { credentials: 'include' })
    .then(function(response) {
      if (response.status === 401) {
        window.location.href = 'login.html';
        return null;
      }
      return response.json();
    })
    .then(function(result) {
      if (!result) return;
      // Update stored user data from session
      if (result.email) {
        var stored = getUser();
        // Only update if we don't have a name yet or email changed
        if (!stored.name || stored.name === 'User' || stored.email !== result.email) {
          var raw = result.email.split('@')[0];
          var displayName = raw.charAt(0).toUpperCase() + raw.slice(1);
          localStorage.setItem('lumi_user', JSON.stringify({ name: displayName, email: result.email }));
        }
        // Refresh profile display
        updateProfileDisplay();
      }
    })
    .catch(function(error) {
      console.error('Auth check failed:', error);
    });
}
 
function updateProfileDisplay() {
  var user = getUser();
  var initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  var avatar = document.getElementById('profileAvatar');
  var avatarLg = document.getElementById('profileAvatarLg');
  var nameEl = document.getElementById('profileName');
  var emailEl = document.getElementById('profileEmail');
  if (avatar) avatar.textContent = initial;
  if (avatarLg) avatarLg.textContent = initial;
  if (nameEl) nameEl.textContent = user.name || user.email;
  if (emailEl) emailEl.textContent = user.email;
}
 
// ─── Inject Profile Dropdown into Nav ────────
function injectProfileDropdown() {
  var nav = document.querySelector('nav');
  if (!nav || document.getElementById('profileBtn')) return;
 
  var user = getUser();
  var initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
 
  var wrap = document.createElement('div');
  wrap.className = 'nav-profile-wrap';
  wrap.innerHTML =
    '<button class="nav-profile-btn" id="profileBtn">' +
      '<span class="nav-profile-avatar" id="profileAvatar">' + initial + '</span>' +
    '</button>' +
    '<div class="nav-profile-dropdown" id="profileDropdown">' +
      '<div class="nav-profile-info">' +
        '<div class="nav-profile-avatar-lg" id="profileAvatarLg">' + initial + '</div>' +
        '<div>' +
          '<div class="nav-profile-name" id="profileName">' + (user.name || user.email) + '</div>' +
          '<div class="nav-profile-email" id="profileEmail">' + user.email + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="nav-profile-divider"></div>' +
      '<div class="nav-profile-item nav-profile-item--lang">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#7C6E61" stroke-width="1.3"/><path d="M8 2c0 0-3 2.5-3 6s3 6 3 6M8 2c0 0 3 2.5 3 6s-3 6-3 6M2 8h12" stroke="#7C6E61" stroke-width="1.3" stroke-linecap="round"/></svg>' +
        '<span data-i18n-shared="language">' + getSharedT('language') + '</span>' +
        '<div class="nav-lang-toggle">' +
          '<button class="nav-lang-btn ' + (currentLang === 'de' ? 'active' : '') + '" id="langDE" onclick="setLang(\'de\')">DE</button>' +
          '<button class="nav-lang-btn ' + (currentLang === 'en' ? 'active' : '') + '" id="langEN" onclick="setLang(\'en\')">EN</button>' +
        '</div>' +
      '</div>' +
      '<button class="nav-profile-item" onclick="openPasswordModal()">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="2" stroke="#7C6E61" stroke-width="1.3"/><path d="M5 7V5a3 3 0 016 0v2" stroke="#7C6E61" stroke-width="1.3" stroke-linecap="round"/></svg>' +
        '<span data-i18n-shared="changePassword">' + getSharedT('changePassword') + '</span>' +
      '</button>' +
      '<div class="nav-profile-divider"></div>' +
      '<button class="nav-profile-item nav-profile-item--logout" id="logoutBtn">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3-3-3M13 8H6" stroke="#e05260" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<span data-i18n-shared="logout">' + getSharedT('logout') + '</span>' +
      '</button>' +
    '</div>';
 
  nav.appendChild(wrap);
 
  // Dropdown toggle
  document.getElementById('profileBtn').addEventListener('click', function(e) {
    e.stopPropagation();
    document.getElementById('profileDropdown').classList.toggle('active');
  });
  document.addEventListener('click', function() {
    var dd = document.getElementById('profileDropdown');
    if (dd) dd.classList.remove('active');
  });
  document.getElementById('profileDropdown').addEventListener('click', function(e) {
    e.stopPropagation();
  });
 
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', function() {
    fetch('api/logout.php', { method: 'POST' }).catch(function(){});
    localStorage.removeItem('lumi_session');
    localStorage.removeItem('lumi_user');
    window.location.href = 'login.html';
  });
}
 
// ─── Password Modal ──────────────────────────
function injectPasswordModal() {
  if (document.getElementById('navPasswordModalOverlay')) return;
 
  var modal = document.createElement('div');
  modal.className = 'kinder-modal-overlay';
  modal.id = 'navPasswordModalOverlay';
  modal.innerHTML =
    '<div class="kinder-modal kinder-modal--small">' +
      '<div class="kinder-modal-header">' +
        '<h2 class="kinder-modal-title" data-i18n-shared="changePassword">' + getSharedT('changePassword') + '</h2>' +
        '<button class="kinder-modal-close" onclick="closePasswordModal()">' +
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><line x1="4" y1="4" x2="16" y2="16" stroke="#6b6b6b" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="4" x2="4" y2="16" stroke="#6b6b6b" stroke-width="2" stroke-linecap="round"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="kinder-form-group">' +
        '<label data-i18n-shared="currentPassword">' + getSharedT('currentPassword') + '</label>' +
        '<input type="password" id="navPwCurrent" placeholder="••••••••" autocomplete="new-password" />' +
      '</div>' +
      '<div class="kinder-form-group">' +
        '<label data-i18n-shared="newPassword">' + getSharedT('newPassword') + '</label>' +
        '<input type="password" id="navPwNew" placeholder="••••••••" autocomplete="new-password" />' +
      '</div>' +
      '<div class="kinder-form-group">' +
        '<label data-i18n-shared="confirmPassword">' + getSharedT('confirmPassword') + '</label>' +
        '<input type="password" id="navPwConfirm" placeholder="••••••••" autocomplete="new-password" />' +
      '</div>' +
      '<div class="kinder-form-actions">' +
        '<button class="kinder-btn-cancel" onclick="closePasswordModal()" data-i18n-shared="cancel">' + getSharedT('cancel') + '</button>' +
        '<button class="kinder-btn-save" onclick="savePassword()" data-i18n-shared="save">' + getSharedT('save') + '</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);
}
 
function openPasswordModal() {
  var overlay = document.getElementById('navPasswordModalOverlay') || document.getElementById('passwordModalOverlay');
  if (overlay) overlay.classList.add('active');
  var dd = document.getElementById('profileDropdown');
  if (dd) dd.classList.remove('active');
}
 
function closePasswordModal() {
  var overlay = document.getElementById('navPasswordModalOverlay') || document.getElementById('passwordModalOverlay');
  if (overlay) overlay.classList.remove('active');
}
 
function savePassword() {
  var curr = document.getElementById('navPwCurrent').value;
  var newPw = document.getElementById('navPwNew').value;
  var conf = document.getElementById('navPwConfirm').value;
  if (!curr || !newPw || !conf) return alert(getSharedT('pwFillAll'));
  if (newPw !== conf) return alert(getSharedT('pwNoMatch'));
  alert(getSharedT('pwSaved'));
  closePasswordModal();
}
 
// ─── Nav: active link ────────────────────────
function setupNav() {
  var navLinks = document.querySelectorAll('nav a[href]');
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(function(link) {
    link.classList.remove('active');
    var linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) link.classList.add('active');
  });
}
 
// ─── Init ────────────────────────────────────
setupNav();
injectProfileDropdown();
injectPasswordModal();
applySharedTranslations();
checkAuth();