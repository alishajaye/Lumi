/* =============================================
   LUMI – icon-picker.js (die Auswahl-Logik)
   SVG Icon-Picker Add-on für die Kinder-Seite
   Wird NACH kinder.js und lumi-icons.js geladen
   ============================================= */

var selectedIcon = "";

function buildIconGridHtml(selectedKey) {
  var lang = getKinderLang();
  var noneLabel = lang === 'en' ? 'None' : 'Kein';
  var color = document.getElementById('childColor') ? document.getElementById('childColor').value : '#b49ed4';
  var html = '<button type="button" class="kinder-icon-option no-icon ' + (!selectedKey ? 'active' : '') + '" data-icon="" style="' + (!selectedKey ? 'border-color:' + color + ';background:' + color + '20' : '') + '">' + noneLabel + '</button>';
  for (var key in LUMI_ICONS) {
    var isActive = selectedKey === key;
    var icon = LUMI_ICONS[key];
    var activeStyle = isActive ? 'border-color:' + color + ';background:' + color + '20' : '';
    html += '<button type="button" class="kinder-icon-option' + (isActive ? ' active' : '') + '" data-icon="' + key + '" title="' + (icon.name[lang] || icon.name.de) + '" style="' + activeStyle + '">';
    html += '<div style="width:32px;height:32px;color:' + color + ';display:flex;align-items:center;justify-content:center">' + icon.svg + '</div>';
    html += '</button>';
  }
  return html;
}

function renderIconGrid() {
  var grid = document.getElementById('iconGrid');
  if (!grid) return;
  grid.innerHTML = buildIconGridHtml(selectedIcon);
  grid.querySelectorAll('.kinder-icon-option').forEach(function(btn) {
    btn.addEventListener('click', function() {
      selectedIcon = btn.getAttribute('data-icon');
      document.getElementById('childIcon').value = selectedIcon;
      grid.querySelectorAll('.kinder-icon-option').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });
}

var _origLoadChildren = loadChildren;
loadChildren = async function() {
  await _origLoadChildren();
  children.forEach(function(child) {
    if (!child.icon) child.icon = localStorage.getItem('lumi_child_icon_' + child.id) || '';
  });
  renderCards();
};

var _origRenderCards = renderCards;
renderCards = function() {
  _origRenderCards();
  children.forEach(function(child) {
    var iconKey = child.icon || localStorage.getItem('lumi_child_icon_' + child.id) || '';
    if (!iconKey || !LUMI_ICONS[iconKey]) return;
    document.querySelectorAll('.kinder-card').forEach(function(card) {
      var nameEl = card.querySelector('.kinder-card-name');
      if (nameEl && nameEl.textContent.trim() === child.name) {
        var avatar = card.querySelector('.kinder-avatar');
        if (avatar) avatar.innerHTML = getLumiIconSvg(iconKey, child.color, 48);
      }
    });
  });
};

var _origOpenAddModal = openAddModal;
openAddModal = function() {
  _origOpenAddModal();
  selectedIcon = '';
  var iconInput = document.getElementById('childIcon');
  if (iconInput) iconInput.value = '';
  renderIconGrid();
};

var _origOpenEditModal = openEditModal;
openEditModal = function(childId) {
  _origOpenEditModal(childId);
  var child = children.find(function(c) { return c.id === childId; });
  if (child) {
    selectedIcon = child.icon || localStorage.getItem('lumi_child_icon_' + child.id) || '';
    var iconInput = document.getElementById('childIcon');
    if (iconInput) iconInput.value = selectedIcon;
    renderIconGrid();
  }
};

var form = document.getElementById('childForm');
var newForm = form.cloneNode(true);
form.parentNode.replaceChild(newForm, form);

newForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  var id = document.getElementById('childId').value;
  var data = {
    name: document.getElementById('childName').value.trim(),
    age: parseInt(document.getElementById('childAge').value),
    dailyLimit: parseInt(document.getElementById('childLimit').value),
    color: document.getElementById('childColor').value,
    icon: document.getElementById('childIcon').value || '',
  };
  var result;
  if (id) {
    result = await updateChild(id, data);
    localStorage.setItem('lumi_child_icon_' + id, data.icon);
  } else {
    result = await createChild(data);
  }
  if (result.status === 'success') {
    if (!id && result.child_id) localStorage.setItem('lumi_child_icon_' + result.child_id, data.icon);
    closeModal();
    loadChildren();
  } else {
    alert(result.message || t('saveError'));
  }
});

document.getElementById('modalDeleteBtn').addEventListener('click', async function() {
  var id = document.getElementById('childId').value;
  var child = children.find(function(c) { return c.id === id; });
  if (!child) return;
  if (confirm(t('deleteConfirmStart') + child.name + t('deleteConfirmEnd'))) {
    var result = await deleteChild(id);
    if (result.status === 'success') {
      localStorage.removeItem('lumi_child_icon_' + id);
      closeModal();
      loadChildren();
    } else {
      alert(result.message || t('deleteError'));
    }
  }
});

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancelBtn').addEventListener('click', closeModal);

document.querySelectorAll('#colorPresets .kinder-color-dot').forEach(function(dot) {
  dot.addEventListener('click', function() {
    selectedColor = dot.dataset.color;
    document.getElementById('childColor').value = selectedColor;
    updateColorSel('colorPresets', selectedColor);
    renderIconGrid();
  });
});
document.getElementById('customColorBtn').addEventListener('click', function() {
  document.getElementById('customColorInput').click();
});
document.getElementById('customColorInput').addEventListener('input', function(e) {
  selectedColor = e.target.value;
  document.getElementById('childColor').value = selectedColor;
  document.getElementById('customColorPreview').style.background = selectedColor;
  document.getElementById('customColorPreview').classList.add('active');
  document.querySelectorAll('#colorPresets .kinder-color-dot').forEach(function(dot) { dot.classList.remove('active'); });
  renderIconGrid();
});

var _origApplyKinderStatic = applyKinderStaticTranslations;
applyKinderStaticTranslations = function() {
  _origApplyKinderStatic();
  var label = document.getElementById('iconPickerLabel');
  if (label) label.textContent = getKinderLang() === 'en' ? 'CHOOSE ICON' : 'ICON WÄHLEN';
  renderIconGrid();
};

renderIconGrid();