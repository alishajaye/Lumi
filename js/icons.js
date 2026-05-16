/* =============================================
   LUMI – icons.js (die Bibliothek)
   Shared SVG icon definitions for profiles
   Loaded BEFORE other scripts that need icons
   ============================================= */

var LUMI_ICONS = {
  lion: {
    name: { de: 'Löwe', en: 'Lion' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="10" fill="currentColor" opacity="0.3"/><circle cx="20" cy="22" r="7" fill="currentColor"/><circle cx="17" cy="20" r="1.2" fill="#fff"/><circle cx="23" cy="20" r="1.2" fill="#fff"/><ellipse cx="20" cy="23" rx="2" ry="1.2" fill="#fff" opacity="0.5"/><path d="M15 12C10 8 8 16 12 20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M25 12C30 8 32 16 28 20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M20 10C18 6 22 6 20 10" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
  },
  bear: {
    name: { de: 'Bär', en: 'Bear' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4" fill="currentColor"/><circle cx="28" cy="12" r="4" fill="currentColor"/><circle cx="20" cy="22" r="9" fill="currentColor"/><circle cx="17" cy="20" r="1.2" fill="#fff"/><circle cx="23" cy="20" r="1.2" fill="#fff"/><ellipse cx="20" cy="24" rx="3" ry="2" fill="#fff" opacity="0.4"/><circle cx="20" cy="23.5" r="1" fill="#fff"/></svg>'
  },
  fox: {
    name: { de: 'Fuchs', en: 'Fox' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 10L10 18L20 26L30 18L28 10Z" fill="currentColor"/><path d="M16 22L20 26L24 22Z" fill="#fff" opacity="0.6"/><circle cx="17" cy="18" r="1.2" fill="#fff"/><circle cx="23" cy="18" r="1.2" fill="#fff"/><circle cx="20" cy="21" r="1" fill="#fff"/></svg>'
  },
  bunny: {
    name: { de: 'Hase', en: 'Bunny' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="8" rx="3" ry="8" fill="currentColor"/><ellipse cx="24" cy="8" rx="3" ry="8" fill="currentColor"/><ellipse cx="16" cy="8" rx="1.5" ry="5" fill="#fff" opacity="0.3"/><ellipse cx="24" cy="8" rx="1.5" ry="5" fill="#fff" opacity="0.3"/><circle cx="20" cy="24" r="8" fill="currentColor"/><circle cx="17" cy="22" r="1.2" fill="#fff"/><circle cx="23" cy="22" r="1.2" fill="#fff"/><circle cx="20" cy="25" r="0.8" fill="#fff" opacity="0.6"/></svg>'
  },
  cat: {
    name: { de: 'Katze', en: 'Cat' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="22" r="8" fill="currentColor"/><path d="M12 16L14 10L18 16" fill="currentColor"/><path d="M28 16L26 10L22 16" fill="currentColor"/><circle cx="17" cy="20" r="1.5" fill="#fff"/><circle cx="23" cy="20" r="1.5" fill="#fff"/><circle cx="17" cy="20" r="0.8" fill="#333"/><circle cx="23" cy="20" r="0.8" fill="#333"/><circle cx="20" cy="22.5" r="0.8" fill="#fff" opacity="0.6"/><path d="M18 24Q20 26 22 24" stroke="#fff" stroke-width="0.8" fill="none" opacity="0.5"/></svg>'
  },
  dog: {
    name: { de: 'Hund', en: 'Dog' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="22" r="8" fill="currentColor"/><ellipse cx="13" cy="16" rx="4" ry="5" fill="currentColor" opacity="0.7" transform="rotate(-15 13 16)"/><ellipse cx="27" cy="16" rx="4" ry="5" fill="currentColor" opacity="0.7" transform="rotate(15 27 16)"/><circle cx="17" cy="20" r="1.2" fill="#fff"/><circle cx="23" cy="20" r="1.2" fill="#fff"/><ellipse cx="20" cy="24" rx="3" ry="2" fill="#fff" opacity="0.3"/><circle cx="20" cy="23" r="1.2" fill="#fff"/></svg>'
  },
  frog: {
    name: { de: 'Frosch', en: 'Frog' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="22" r="8" fill="currentColor"/><circle cx="15" cy="15" r="4" fill="currentColor"/><circle cx="25" cy="15" r="4" fill="currentColor"/><circle cx="15" cy="15" r="2" fill="#fff"/><circle cx="25" cy="15" r="2" fill="#fff"/><circle cx="15" cy="15" r="1" fill="#333"/><circle cx="25" cy="15" r="1" fill="#333"/><path d="M17 24Q20 27 23 24" stroke="#fff" stroke-width="1" fill="none" opacity="0.5"/></svg>'
  },
  panda: {
    name: { de: 'Panda', en: 'Panda' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="15" r="4" fill="currentColor"/><circle cx="27" cy="15" r="4" fill="currentColor"/><circle cx="20" cy="22" r="9" fill="#fff" stroke="currentColor" stroke-width="0.5"/><ellipse cx="16" cy="19" rx="3" ry="3.5" fill="currentColor"/><ellipse cx="24" cy="19" rx="3" ry="3.5" fill="currentColor"/><circle cx="16.5" cy="18.5" r="1.2" fill="#fff"/><circle cx="23.5" cy="18.5" r="1.2" fill="#fff"/><ellipse cx="20" cy="23" rx="2" ry="1.5" fill="currentColor"/></svg>'
  },
  koala: {
    name: { de: 'Koala', en: 'Koala' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="17" r="5" fill="currentColor"/><circle cx="28" cy="17" r="5" fill="currentColor"/><circle cx="12" cy="17" r="3" fill="currentColor" opacity="0.4"/><circle cx="28" cy="17" r="3" fill="currentColor" opacity="0.4"/><circle cx="20" cy="22" r="9" fill="currentColor"/><circle cx="17" cy="20" r="1.2" fill="#fff"/><circle cx="23" cy="20" r="1.2" fill="#fff"/><ellipse cx="20" cy="23.5" rx="3" ry="2" fill="currentColor" opacity="0.6"/></svg>'
  },
  butterfly: {
    name: { de: 'Falter', en: 'Butterfly' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="14" cy="17" rx="6" ry="7" fill="currentColor" opacity="0.6"/><ellipse cx="26" cy="17" rx="6" ry="7" fill="currentColor" opacity="0.4"/><ellipse cx="16" cy="24" rx="4" ry="4" fill="currentColor" opacity="0.3"/><ellipse cx="24" cy="24" rx="4" ry="4" fill="currentColor" opacity="0.5"/><line x1="20" y1="12" x2="20" y2="28" stroke="currentColor" stroke-width="1.2"/><circle cx="18" cy="11" r="0.8" fill="currentColor"/><circle cx="22" cy="11" r="0.8" fill="currentColor"/></svg>'
  },
  flower: {
    name: { de: 'Blume', en: 'Flower' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="14" r="4" fill="currentColor" opacity="0.7"/><circle cx="25.5" cy="18" r="4" fill="currentColor" opacity="0.6"/><circle cx="23.5" cy="24" r="4" fill="currentColor" opacity="0.5"/><circle cx="16.5" cy="24" r="4" fill="currentColor" opacity="0.5"/><circle cx="14.5" cy="18" r="4" fill="currentColor" opacity="0.6"/><circle cx="20" cy="20" r="3" fill="#F7CE6E"/></svg>'
  },
  rainbow: {
    name: { de: 'Bogen', en: 'Rainbow' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 26A12 12 0 0132 26" fill="none" stroke="#e05260" stroke-width="2.5"/><path d="M11 26A9 9 0 0129 26" fill="none" stroke="#F7CE6E" stroke-width="2.5"/><path d="M14 26A6 6 0 0126 26" fill="none" stroke="#7ECE9F" stroke-width="2.5"/><path d="M17 26A3 3 0 0123 26" fill="none" stroke="#639BE9" stroke-width="2.5"/></svg>'
  },
  star: {
    name: { de: 'Stern', en: 'Star' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 9L23 16L31 17L25 23L27 31L20 27L13 31L15 23L9 17L17 16Z" fill="currentColor"/><circle cx="18" cy="20" r="1" fill="#fff" opacity="0.6"/><circle cx="22" cy="20" r="1" fill="#fff" opacity="0.6"/><path d="M18.5 22.5Q20 24 21.5 22.5" stroke="#fff" stroke-width="0.8" fill="none" opacity="0.5"/></svg>'
  },
  rocket: {
    name: { de: 'Rakete', en: 'Rocket' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 8C24 12 24 24 22 28L18 28C16 24 16 12 20 8Z" fill="currentColor"/><circle cx="20" cy="16" r="2" fill="#fff" opacity="0.6"/><path d="M18 28L15 26L16 22" fill="currentColor" opacity="0.6"/><path d="M22 28L25 26L24 22" fill="currentColor" opacity="0.6"/><path d="M18.5 28L20 32L21.5 28" fill="#F7CE6E"/></svg>'
  },
  heart: {
    name: { de: 'Herz', en: 'Heart' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 28C8 16 8 8 14 8C18 8 20 12 20 14C20 12 22 8 26 8C32 8 32 16 20 28Z" fill="currentColor"/></svg>'
  },
  sun: {
    name: { de: 'Sonne', en: 'Sun' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="6" fill="currentColor"/><line x1="20" y1="7" x2="20" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="20" y1="30" x2="20" y2="33" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="7" y1="20" x2="10" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="30" y1="20" x2="33" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="11" y1="11" x2="13" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="27" y1="11" x2="29" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" transform="rotate(0)"/><line x1="11" y1="29" x2="13" y2="27" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="27" y1="27" x2="29" y2="29" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  },
  leaf: {
    name: { de: 'Blatt', en: 'Leaf' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 30C10 18 12 6 20 8C28 6 30 18 20 30Z" fill="currentColor"/><line x1="20" y1="12" x2="20" y2="28" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity="0.4"/><path d="M20 16C17 18 16 20 16 20" stroke="#fff" stroke-width="0.8" fill="none" stroke-linecap="round" opacity="0.3"/><path d="M20 20C23 22 24 24 24 24" stroke="#fff" stroke-width="0.8" fill="none" stroke-linecap="round" opacity="0.3"/></svg>'
  },
  mountain: {
    name: { de: 'Berg', en: 'Mountain' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 30L16 10L21 18L28 12L36 30Z" fill="currentColor"/><path d="M16 10L14 16L18 14L21 18" fill="#fff" opacity="0.3"/></svg>'
  },
  coffee: {
    name: { de: 'Kaffee', en: 'Coffee' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="18" width="16" height="12" rx="2" fill="currentColor"/><path d="M26 20C30 20 30 28 26 28" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M16 14C16 11 18 11 18 14" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.5"/><path d="M20 13C20 10 22 10 22 13" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.5"/></svg>'
  },
  diamond: {
    name: { de: 'Diamant', en: 'Diamond' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 8L32 18L20 32L8 18Z" fill="currentColor" opacity="0.7"/><path d="M20 8L32 18L20 22L8 18Z" fill="currentColor" opacity="0.4"/><path d="M20 8L20 32" stroke="currentColor" stroke-width="0.5" opacity="0.3"/></svg>'
  },
  crown: {
    name: { de: 'Krone', en: 'Crown' },
    svg: '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 26L10 14L15 20L20 10L25 20L30 14L32 26Z" fill="currentColor"/><rect x="8" y="26" width="24" height="4" rx="1" fill="currentColor"/><circle cx="10" cy="15" r="1.2" fill="#fff" opacity="0.4"/><circle cx="20" cy="11" r="1.2" fill="#fff" opacity="0.4"/><circle cx="30" cy="15" r="1.2" fill="#fff" opacity="0.4"/></svg>'
  }
};

// Helper: get icon SVG with a specific color
function getLumiIconSvg(iconKey, color, size) {
  if (!iconKey || !LUMI_ICONS[iconKey]) return '';
  size = size || 24;
  var svg = LUMI_ICONS[iconKey].svg;
  return '<div style="width:' + size + 'px;height:' + size + 'px;color:' + color + ';display:flex;align-items:center;justify-content:center">' + svg + '</div>';
}

// Helper: get icon name in current language
function getLumiIconName(iconKey) {
  if (!iconKey || !LUMI_ICONS[iconKey]) return '';
  var lang = localStorage.getItem('lumi_lang') || 'de';
  return LUMI_ICONS[iconKey].name[lang] || LUMI_ICONS[iconKey].name.de;
}

// Helper: render avatar (icon or initial letter)
function renderLumiAvatar(child, size) {
  var iconKey = child.icon || localStorage.getItem('lumi_child_icon_' + child.id) || '';
  if (iconKey && LUMI_ICONS[iconKey]) {
    var px = size === 'sm' ? 28 : size === 'lg' ? 48 : 38;
    return getLumiIconSvg(iconKey, child.color, px);
  }
  var fs = size === 'sm' ? '15px' : size === 'lg' ? '28px' : '22px';
  return '<span style="color:' + child.color + ';font-size:' + fs + ';font-weight:900">' + child.name.charAt(0) + '</span>';
}

// Helper: render parent avatar (icon or initial letter)
function renderParentAvatar(size) {
  var iconKey = localStorage.getItem('lumi_parent_icon') || '';
  var user = typeof getUser === 'function' ? getUser() : { name: 'U' };
  var initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  if (iconKey && LUMI_ICONS[iconKey]) {
    var px = size === 'sm' ? 18 : size === 'lg' ? 24 : 20;
    return getLumiIconSvg(iconKey, '#b49ed4', px);
  }
  return initial;
}