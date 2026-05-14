/* =============================================
   LUMI – nav.js
   Läuft auf JEDER Seite: Auth-Check, Profil-Dropdown, Sprachwechsel, Nav, Footer
   ============================================= */

const SHARED_TRANSLATIONS = {
  de: {
    nav_uebersicht: "Übersicht",
    nav_kinder: "Kinder",
    nav_produkte: "Produkte",
    nav_empfehlungen: "Empfehlungen",
    nav_mitteilungen: "Mitteilungen",

    language: "Sprache",
    changePassword: "Passwort ändern",
    logout: "Abmelden",

    footer_copy: "© 2026 Lumi · Für Familien gemacht",
    footer_privacy: "Datenschutz",
    footer_imprint: "Impressum",
    footer_contact: "Kontakt",

    prod_hero_title: "Lumi Hardware<br>für Familien",
    prod_hero_subtitle: "Geräte, Apps und Zubehör",
    prod_tablet_name: "Lumi Box Tablet",
    prod_tablet_desc: "Weniger Bildschirmstress, mehr echte Momente. Lumi unterstützt Kinder dabei, bewusster mit Medien umzugehen.",
    prod_phone_name: "Lumi Box Smartphone",
    prod_phone_desc: "Handy-Pausen dürfen einfach sein. Lumi schafft klare Routinen und hilft Kindern, Balance zu lernen.",
    prod_badge_name: "Lumi Badge",
    prod_badge_desc: "Der kleine Begleiter für grosse Routinen. Kinder können ihre Bildschirmzeit selbstständig starten und beenden.",
    prod_set_name: "Lumi Starter Set",
    prod_set_desc: "Der perfekte Start in eine gesunde Medienroutine. Alle wichtigen Lumi Produkte in einem Paket kombiniert.",
    prod_available: "sofort verfügbar",
    prod_buy: "Jetzt kaufen",
    prod_recommended: "Empfohlen",

    order_title: "Aktuell ausverkauft",
    order_subtitle: "Alle Lumi Produkte sind momentan leider vergriffen.",
    order_info_title: "Was bedeutet das?",
    order_info_text: "Aufgrund der hohen Nachfrage sind unsere Lumi Produkte aktuell nicht verfügbar.<br>Wir arbeiten daran, so schnell wie möglich neue Geräte bereitzustellen.",
    order_notify_title: "Benachrichtigung erhalten",
    order_notify_text: 'Möchtest du informiert werden, sobald die Produkte wieder verfügbar sind?<br>Schreib uns eine kurze Nachricht an <a href="mailto:kontakt@lumi.ch">kontakt@lumi.ch</a> und wir melden uns bei dir.',
    order_back: "Zurück zu den Produkten",

    legal_back_overview: "Zurück zur Übersicht",

    contact_title: "Kontakt",
    contact_subtitle: "Wir freuen uns über deine Nachricht.",
    contact_write_title: "Schreib uns",
    contact_write_text: "Hast du Fragen zu Lumi, Feedback oder Anregungen? Wir sind gerne für dich da.",
    contact_location_title: "Standort",
    contact_location_text: "Lumi ist ein Projekt der Fachhochschule Graubünden.",

    privacy_title: "Datenschutz",
    privacy_subtitle: "So geht Lumi mit deinen Daten um.",
    privacy_what_title: "Was ist Lumi?",
    privacy_what_text: "Lumi ist ein smartes System für Familien, das Kindern hilft, einen bewussten Umgang mit Bildschirmzeit zu entwickeln. Es besteht aus einer physischen Lumi Box, die erkennt, wenn ein Gerät hineingelegt oder herausgenommen wird, und einer Web-App, über die Eltern die Bildschirmzeit verwalten, Belohnungen vergeben und den Fortschritt ihrer Kinder verfolgen können.",
    privacy_data_title: "Welche Daten werden gespeichert?",
    privacy_data_text_1: "Lumi speichert nur die für den Betrieb notwendigen Daten. Dazu gehören der Name und die E-Mail-Adresse der Eltern für die Anmeldung, die Namen und das Alter der Kinder für die Profilzuordnung, die tägliche Bildschirmzeit und Tageslimits sowie Belohnungen und Aktivitäten.",
    privacy_data_text_2: "Alle Daten werden auf einem geschützten Server in der Schweiz gespeichert und nicht an Dritte weitergegeben.",
    privacy_box_title: "Wie funktioniert die Lumi Box?",
    privacy_box_text: "Die Lumi Box kommuniziert über WLAN mit der Web-App. Wenn ein Kind sein Gerät in die Box legt, wird dies registriert und die Bildschirmzeit-Zählung pausiert. Wird das Gerät entnommen, startet die Zählung. Die Box sendet diese Informationen verschlüsselt an die Datenbank, sodass Eltern in Echtzeit den Status sehen können.",
    privacy_rights_title: "Deine Rechte",
    privacy_rights_text: 'Du kannst jederzeit dein Konto löschen, woraufhin alle gespeicherten Daten entfernt werden. Kinderprofile können einzeln gelöscht werden. Bei Fragen zum Datenschutz wende dich an <a href="mailto:kontakt@lumi.ch">kontakt@lumi.ch</a>.',
    privacy_note_title: "Hinweis",
    privacy_note_text: "Dieses Projekt wurde im Rahmen des Moduls Interaktive Medien 4 (IM4) an der Fachhochschule Graubünden (FHGR) erstellt. Es handelt sich um ein Hochschulprojekt und keinen kommerziellen Dienst.",

    imprint_title: "Impressum",
    imprint_subtitle: "Wer hinter Lumi steckt.",
    imprint_project_title: "Hochschulprojekt",
    imprint_project_text: "Lumi ist ein Projekt im Rahmen des Moduls <strong>Interaktive Medien 4 (IM4)</strong> im Studiengang Multimedia Production (BSc), 4. Semester.",
    imprint_team_title: "Team - Nic und die Coder",
    imprint_webapp: "Web-App",
    imprint_webapp_names: "Alisha Künzi und Melina Gast",
    imprint_physical: "Physical Computing",
    imprint_physical_names: "Inès Jetzer und Nic Luginbühl",
    imprint_concept_title: "Projektkonzept",
    imprint_concept_text: "Lumi unterstützt Familien bei einem bewussten Umgang mit Bildschirmzeit. Das System besteht aus einer physischen Lumi Box (Physical Computing) und einer Web-App zur Verwaltung und Visualisierung der Nutzungsdaten. Zielgruppe sind Eltern mit Kindern im Alter von 4–10 Jahren.",

    fhgr_name: "FHGR – Fachhochschule Graubünden"
  },

  en: {
    nav_uebersicht: "Overview",
    nav_kinder: "Children",
    nav_produkte: "Products",
    nav_empfehlungen: "Recommendations",
    nav_mitteilungen: "Notifications",

    language: "Language",
    changePassword: "Change password",
    logout: "Sign out",

    footer_copy: "© 2026 Lumi · Made for families",
    footer_privacy: "Privacy",
    footer_imprint: "Imprint",
    footer_contact: "Contact",

    prod_hero_title: "Lumi hardware<br>for families",
    prod_hero_subtitle: "Devices, apps and accessories",
    prod_tablet_name: "Lumi Box Tablet",
    prod_tablet_desc: "Less screen-time stress, more real moments. Lumi helps children use media more consciously.",
    prod_phone_name: "Lumi Box Smartphone",
    prod_phone_desc: "Phone breaks can be simple. Lumi creates clear routines and helps children learn balance.",
    prod_badge_name: "Lumi Badge",
    prod_badge_desc: "A small companion for big routines. Children can start and end their screen time independently.",
    prod_set_name: "Lumi Starter Set",
    prod_set_desc: "The perfect start for a healthy media routine. All important Lumi products combined in one set.",
    prod_available: "available now",
    prod_buy: "Buy now",
    prod_recommended: "Recommended",

    order_title: "Currently sold out",
    order_subtitle: "All Lumi products are unfortunately out of stock at the moment.",
    order_info_title: "What does this mean?",
    order_info_text: "Due to high demand, our Lumi products are currently unavailable.<br>We are working to restock as soon as possible.",
    order_notify_title: "Get notified",
    order_notify_text: 'Want to be notified when products are available again?<br>Send us a short message at <a href="mailto:kontakt@lumi.ch">kontakt@lumi.ch</a> and we will get back to you.',
    order_back: "Back to products",

    legal_back_overview: "Back to overview",

    contact_title: "Contact",
    contact_subtitle: "We look forward to hearing from you.",
    contact_write_title: "Write to us",
    contact_write_text: "Do you have questions about Lumi, feedback or suggestions? We are happy to help.",
    contact_location_title: "Location",
    contact_location_text: "Lumi is a project by the University of Applied Sciences of the Grisons.",

    privacy_title: "Privacy",
    privacy_subtitle: "How Lumi handles your data.",
    privacy_what_title: "What is Lumi?",
    privacy_what_text: "Lumi is a smart system for families that helps children develop a more mindful approach to screen time. It consists of a physical Lumi Box that detects when a device is placed inside or taken out, and a web app that parents can use to manage screen time, give rewards and follow their children's progress.",
    privacy_data_title: "What data is stored?",
    privacy_data_text_1: "Lumi only stores the data needed for the service to work. This includes the parents' name and email address for login, the children's names and ages for profile assignment, daily screen time and daily limits, as well as rewards and activities.",
    privacy_data_text_2: "All data is stored on a protected server in Switzerland and is not shared with third parties.",
    privacy_box_title: "How does the Lumi Box work?",
    privacy_box_text: "The Lumi Box communicates with the web app via Wi-Fi. When a child places their device in the box, this is registered and screen-time tracking pauses. When the device is taken out, tracking starts again. The box sends this information to the database in encrypted form so parents can see the status in real time.",
    privacy_rights_title: "Your rights",
    privacy_rights_text: 'You can delete your account at any time, which removes all stored data. Child profiles can be deleted individually. If you have questions about privacy, contact us at <a href="mailto:kontakt@lumi.ch">kontakt@lumi.ch</a>.',
    privacy_note_title: "Note",
    privacy_note_text: "This project was created as part of the Interactive Media 4 (IM4) module at the University of Applied Sciences of the Grisons (FHGR). It is a university project and not a commercial service.",

    imprint_title: "Imprint",
    imprint_subtitle: "Who is behind Lumi.",
    imprint_project_title: "University project",
    imprint_project_text: "Lumi is a project created as part of the <strong>Interactive Media 4 (IM4)</strong> module in the Multimedia Production BSc programme, 4th semester.",
    imprint_team_title: "Team – Nic and the Coders",
    imprint_webapp: "Web app",
    imprint_webapp_names: "Alisha Künzi and Melina Gast",
    imprint_physical: "Physical computing",
    imprint_physical_names: "Inès Jetzer and Nic Luginbühl",
    imprint_concept_title: "Project concept",
    imprint_concept_text: "Lumi supports families in developing a mindful approach to screen time. The system consists of a physical Lumi Box and a web app for managing and visualising usage data. The target group is parents with children aged 4–12.",

    fhgr_name: "FHGR – University of Applied Sciences of the Grisons"
  }
};

var currentLang = localStorage.getItem("lumi_lang") || "de";

function getSharedT(key) {
  return (
    SHARED_TRANSLATIONS[currentLang] &&
    SHARED_TRANSLATIONS[currentLang][key]
  ) || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lumi_lang", lang);
  applySharedTranslations();
  if (typeof renderAll === "function") renderAll();
  if (typeof renderCards === "function") renderCards();
}

function applySharedTranslations() {
  document.querySelectorAll("[data-i18n-nav]").forEach(function(el) {
    var key = el.getAttribute("data-i18n-nav");
    var val = getSharedT(key);
    if (val !== key) el.textContent = val;
  });

  document.querySelectorAll("[data-i18n-shared]").forEach(function(el) {
    var key = el.getAttribute("data-i18n-shared");
    var val = getSharedT(key);
    if (val !== key) el.textContent = val;
  });

  document.querySelectorAll("[data-i18n]").forEach(function(el) {
    var key = el.getAttribute("data-i18n");
    var val = getSharedT(key);
    if (val !== key) el.textContent = val;
  });

  document.querySelectorAll("[data-i18n-html]").forEach(function(el) {
    var key = el.getAttribute("data-i18n-html");
    var val = getSharedT(key);
    if (val !== key) el.innerHTML = val;
  });

  var de = document.getElementById("langDE");
  var en = document.getElementById("langEN");

  if (de) de.classList.toggle("active", currentLang === "de");
  if (en) en.classList.toggle("active", currentLang === "en");
}

function getUser() {
  try {
    var raw = localStorage.getItem("lumi_user");
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return { name: "User", email: "" };
}

function checkAuth() {
  var page = window.location.pathname.split("/").pop();

  if (page === "login.html" || page === "register.html") return;

  fetch("api/protected.php", { credentials: "include" })
    .then(function(response) {
      if (response.status === 401) {
        window.location.href = "login.html";
        return null;
      }

      return response.json();
    })
    .then(function(result) {
      if (!result) return;

      if (result.email) {
        var stored = getUser();

        if (!stored.name || stored.name === "User" || stored.email !== result.email) {
          var beforeAt = result.email.split("@")[0];
          var firstName = beforeAt.split(".")[0];
          var displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

          localStorage.setItem("lumi_user", JSON.stringify({
            name: displayName,
            email: result.email
          }));
        }

        updateProfileDisplay();
      }
    })
    .catch(function(error) {
      console.error("Auth check failed:", error);
    });
}

function updateProfileDisplay() {
  var user = getUser();
  var initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  var avatar = document.getElementById("profileAvatar");
  var avatarLg = document.getElementById("profileAvatarLg");
  var nameEl = document.getElementById("profileName");
  var emailEl = document.getElementById("profileEmail");

  if (avatar) avatar.textContent = initial;
  if (avatarLg) avatarLg.textContent = initial;
  if (nameEl) nameEl.textContent = user.name || user.email;
  if (emailEl) emailEl.textContent = user.email;
}

function injectProfileDropdown() {
  var nav = document.querySelector("nav");

  if (!nav || document.getElementById("profileBtn")) return;

  var user = getUser();
  var initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  var wrap = document.createElement("div");
  wrap.className = "nav-profile-wrap";

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
        '<span data-i18n-shared="language">' + getSharedT("language") + '</span>' +
        '<div class="nav-lang-toggle">' +
          '<button class="nav-lang-btn ' + (currentLang === "de" ? "active" : "") + '" id="langDE" onclick="setLang(\'de\')">DE</button>' +
          '<button class="nav-lang-btn ' + (currentLang === "en" ? "active" : "") + '" id="langEN" onclick="setLang(\'en\')">EN</button>' +
        '</div>' +
      '</div>' +
      '<button class="nav-profile-item" onclick="openPasswordModal()">' +
        '<span data-i18n-shared="changePassword">' + getSharedT("changePassword") + '</span>' +
      '</button>' +
      '<div class="nav-profile-divider"></div>' +
      '<button class="nav-profile-item nav-profile-item--logout" id="logoutBtn">' +
        '<span data-i18n-shared="logout">' + getSharedT("logout") + '</span>' +
      '</button>' +
    '</div>';

  nav.appendChild(wrap);

  document.getElementById("profileBtn").addEventListener("click", function(e) {
    e.stopPropagation();
    document.getElementById("profileDropdown").classList.toggle("active");
  });

  document.addEventListener("click", function() {
    var dd = document.getElementById("profileDropdown");
    if (dd) dd.classList.remove("active");
  });

  document.getElementById("profileDropdown").addEventListener("click", function(e) {
    e.stopPropagation();
  });

  document.getElementById("logoutBtn").addEventListener("click", function() {
    fetch("api/logout.php", { method: "POST" }).catch(function() {});
    localStorage.removeItem("lumi_session");
    localStorage.removeItem("lumi_user");
    window.location.href = "login.html";
  });
}

function injectPasswordModal() {
  if (document.getElementById("navPasswordModalOverlay")) return;

  var modal = document.createElement("div");
  modal.className = "kinder-modal-overlay";
  modal.id = "navPasswordModalOverlay";

  modal.innerHTML =
    '<div class="kinder-modal kinder-modal--small">' +
      '<div class="kinder-modal-header">' +
        '<h2 class="kinder-modal-title" data-i18n-shared="changePassword">' + getSharedT("changePassword") + '</h2>' +
        '<button class="kinder-modal-close" onclick="closePasswordModal()">×</button>' +
      '</div>' +
      '<div class="kinder-form-group"><label>AKTUELLES PASSWORT</label><input type="password" id="navPwCurrent" placeholder="••••••••" autocomplete="new-password" /></div>' +
      '<div class="kinder-form-group"><label>NEUES PASSWORT</label><input type="password" id="navPwNew" placeholder="••••••••" autocomplete="new-password" /></div>' +
      '<div class="kinder-form-group"><label>PASSWORT BESTÄTIGEN</label><input type="password" id="navPwConfirm" placeholder="••••••••" autocomplete="new-password" /></div>' +
      '<div class="kinder-form-actions">' +
        '<button class="kinder-btn-cancel" onclick="closePasswordModal()">Abbrechen</button>' +
        '<button class="kinder-btn-save" onclick="savePassword()">Speichern</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(modal);
}

function openPasswordModal() {
  var overlay = document.getElementById("navPasswordModalOverlay") || document.getElementById("passwordModalOverlay");

  if (overlay) overlay.classList.add("active");

  var dd = document.getElementById("profileDropdown");
  if (dd) dd.classList.remove("active");
}

function closePasswordModal() {
  var overlay = document.getElementById("navPasswordModalOverlay") || document.getElementById("passwordModalOverlay");

  if (overlay) overlay.classList.remove("active");
}

function savePassword() {
  var curr = document.getElementById("navPwCurrent").value;
  var newPw = document.getElementById("navPwNew").value;
  var conf = document.getElementById("navPwConfirm").value;

  if (!curr || !newPw || !conf) return alert("Bitte alle Felder ausfüllen.");
  if (newPw !== conf) return alert("Passwörter stimmen nicht überein.");

  alert("Passwort wurde gespeichert.");
  closePasswordModal();
}

function injectFooter() {
  if (document.getElementById("lumiFooter")) return;

  var page = window.location.pathname.split("/").pop();

  if (page === "login.html" || page === "register.html") return;

  var footer = document.createElement("footer");
  footer.className = "lumi-footer";
  footer.id = "lumiFooter";

  footer.innerHTML =
    '<div class="lumi-footer-inner">' +
      '<div class="lumi-footer-left">' +
        '<img src="resources/assets/lumi_logo.svg" alt="Lumi" class="lumi-footer-logo" />' +
        '<span class="lumi-footer-copy" data-i18n-shared="footer_copy">' + getSharedT("footer_copy") + '</span>' +
      '</div>' +
      '<div class="lumi-footer-links">' +
        '<a href="datenschutz.html" data-i18n-shared="footer_privacy">' + getSharedT("footer_privacy") + '</a>' +
        '<a href="impressum.html" data-i18n-shared="footer_imprint">' + getSharedT("footer_imprint") + '</a>' +
        '<a href="kontakt.html" data-i18n-shared="footer_contact">' + getSharedT("footer_contact") + '</a>' +
      '</div>' +
    '</div>';

  document.body.appendChild(footer);
}

function setupNav() {
  var navLinks = document.querySelectorAll(".nav-links a[href]");
  var currentPage = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach(function(link) {
    link.classList.remove("active");

    var linkPage = link.getAttribute("href").split("/").pop();

    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}

setupNav();
injectProfileDropdown();
injectPasswordModal();
injectFooter();
applySharedTranslations();
checkAuth();