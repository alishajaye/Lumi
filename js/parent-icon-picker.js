function openParentIconModal() {
  if (!document.getElementById('parentIconModalOverlay')) {
    injectParentIconModal();
  }
  renderParentIconGrid();
  document.getElementById('parentIconModalOverlay').classList.add('active');

  var dd = document.getElementById('profileDropdown');
  if (dd) dd.classList.remove('active');
}

function closeParentIconModal() {
  var overlay = document.getElementById('parentIconModalOverlay');
  if (overlay) overlay.classList.remove('active');
}

function injectParentIconModal() {
  var lang = localStorage.getItem('lumi_lang') || 'de';

  var title      = lang === 'en' ? 'Change profile icon' : 'Profilbild ändern';
  var noneLabel  = lang === 'en' ? 'None' : 'Kein';
  var cancelText = lang === 'en' ? 'Cancel' : 'Abbrechen';
  var saveText   = lang === 'en' ? 'Save' : 'Speichern';

  var overlay = document.createElement('div');
  overlay.className = 'kinder-modal-overlay';
  overlay.id = 'parentIconModalOverlay';
  overlay.innerHTML =
    '<div class="kinder-modal kinder-modal--small">'+
      '<div class="kinder-modal-header">' +
        '<h2 class="kinder-modal-title">' + title + '</h2>' +
        '<button class="kinder-modal-close" onclick="closeParentIconModal()">' +
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none">' +
            '<line x1="4" y1="4" x2="16" y2="16" stroke="#6b6b6b" stroke-width="2" stroke-linecap="round"/>' +
            '<line x1="16" y1="4" x2="4" y2="16" stroke="#6b6b6b" stroke-width="2" stroke-linecap="round"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="kinder-icon-grid" id="parentIconGrid" style="overflow-y:auto;"></div>' +
      '<div class="kinder-form-actions" style="margin-top:20px;">' +
        '<button class="kinder-btn-cancel" onclick="closeParentIconModal()">' + cancelText + '</button>' +
        '<button class="kinder-btn-save" onclick="saveParentIcon()">' + saveText + '</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeParentIconModal();
  });
}

var _selectedParentIcon = '';

function renderParentIconGrid() {
  var grid = document.getElementById('parentIconGrid');
  if (!grid) return;

  _selectedParentIcon = localStorage.getItem('lumi_parent_icon') || '';
  var lang  = localStorage.getItem('lumi_lang') || 'de';
  var color = '#b49ed4';
  var noneLabel = lang === 'en' ? 'None' : 'Kein';

  var html = '<button type="button" class="kinder-icon-option no-icon ' +
    (!_selectedParentIcon ? 'active' : '') + '" data-icon="" style="' +
    (!_selectedParentIcon ? 'border-color:' + color + ';background:' + color + '20' : '') +
    '">' + noneLabel + '</button>';

  for (var key in LUMI_ICONS) {
    var isActive = _selectedParentIcon === key;
    var icon = LUMI_ICONS[key];
    var activeStyle = isActive ? 'border-color:' + color + ';background:' + color + '20' : '';
    html += '<button type="button" class="kinder-icon-option' + (isActive ? ' active' : '') +
      '" data-icon="' + key + '" title="' + (icon.name[lang] || icon.name.de) +
      '" style="' + activeStyle + '">' +
      '<div style="width:32px;height:32px;color:' + color +
      ';display:flex;align-items:center;justify-content:center">' + icon.svg + '</div>' +
      '</button>';
  }

  grid.innerHTML = html;

  grid.querySelectorAll('.kinder-icon-option').forEach(function(btn) {
    btn.addEventListener('click', function() {
      _selectedParentIcon = btn.getAttribute('data-icon');
      grid.querySelectorAll('.kinder-icon-option').forEach(function(b) {
        b.classList.remove('active');
        b.style.borderColor = '';
        b.style.background = '';
      });
      btn.classList.add('active');
      btn.style.borderColor = color;
      btn.style.background = color + '20';
    });
  });
}

function saveParentIcon() {
  localStorage.setItem('lumi_parent_icon', _selectedParentIcon);

  if (typeof updateProfileDisplay === 'function') updateProfileDisplay();
  closeParentIconModal();
}