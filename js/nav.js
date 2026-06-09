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
      changeIcon: "Profilbild ändern",
      logout: "Abmelden",
  
      currentPassword: "AKTUELLES PASSWORT",
      newPassword: "NEUES PASSWORT",
      confirmPassword: "PASSWORT BESTÄTIGEN",
      cancel: "Abbrechen",
      save: "Speichern",
  
      pwFillAll: "Bitte alle Felder ausfüllen.",
      pwNoMatch: "Passwörter stimmen nicht überein.",
      pwSaved: "Passwort wurde gespeichert.",
  
      footer_copy: "© 2026 Lumi · Für Familien gemacht",
      footer_privacy: "Datenschutz",
      footer_imprint: "Impressum",
      footer_contact: "Kontakt",
  
      legal_back_overview: "Zurück zur Übersicht",
  
      contact_title: "Kontakt",
      contact_subtitle: "Wir freuen uns über deine Nachricht.",
      contact_write_title: "Schreib uns",
      contact_write_text: "Hast du Fragen zu Lumi, Feedback oder Anregungen? Wir sind gerne für dich da.",
      contact_location_title: "Standort",
      contact_location_text: "Lumi ist ein Projekt der Fachhochschule Graubünden.",
      fhgr_name: "FHGR – Fachhochschule Graubünden",
  
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
      imprint_project_text: 'Lumi ist ein Projekt im Rahmen des Moduls <strong>Interaktive Medien 4 (IM4)</strong> im Studiengang Multimedia Production (BSc), 4. Semester.',
      imprint_team_title: "Team – Nic und die Coder",
      imprint_webapp: "Web-App",
      imprint_webapp_names: "Alisha Künzi & Melina Gast",
      imprint_physical: "Physical Computing",
      imprint_physical_names: "Inès Jetzer & Nic Luginbühl",
      imprint_concept_title: "Projektkonzept",
      imprint_concept_text: "Lumi unterstützt Familien bei einem bewussten Umgang mit Bildschirmzeit. Das System besteht aus einer physischen Lumi Box (Physical Computing) und einer Web-App zur Verwaltung und Visualisierung der Nutzungsdaten. Zielgruppe sind Eltern mit Kindern im Alter von 4–12 Jahren.",
  
      mitt_title: "Mitteilungen",
      mitt_mark_all: "Alle als gelesen markieren",
      mitt_all: "Alle",
      mitt_unread: "Ungelesen",
      mitt_read: "Gelesen",
      mitt_empty: "Keine Mitteilungen in dieser Kategorie",
  
      mitt_streak_title: "Mayumi hat 5-Tage-Streak erreicht",
      mitt_streak_desc: "Mayumi hat 5 Tage in Folge ihr Limit eingehalten.",
      mitt_reward_title: "Belohnung vergeben",
      mitt_reward_desc: "Du hast Mayumi +20 Minuten für das Aufräumen gegeben.",
      mitt_limit_title: "Leo: Tageslimit eingehalten",
      mitt_limit_desc: "Leo hat heute sein Limit von 60 Minuten eingehalten.",
      mitt_session_title: "Felix' Tablet-Session beendet",
      mitt_session_desc: "Die Sitzung wurde nach 45 Minuten automatisch beendet.",
      mitt_offline_title: "Lumi Hub ist offline",
      mitt_offline_desc: "Dein Lumi Hub ist seit gestern 22:00 nicht erreichbar.",
  
      mitt_1h: "vor 1h",
      mitt_3h: "vor 3h",
      mitt_5h: "vor 5h",
      mitt_yesterday: "gestern",
  
      prod_hero_title: "Lumi Hardware für Familien",
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
  
      empf_title: "Bildschirmzeit-Empfehlungen",
      empf_subtitle: "Offizielle Empfehlungen der Weltgesundheitsorganisation (WHO) und Pro Juventute für eine gesunde Mediennutzung von Kindern.",
      empf_hint: 'Die hier gezeigten Empfehlungen basieren auf den Richtlinien der WHO (2019) sowie den Empfehlungen von <strong><a href="https://www.projuventute.ch/de/eltern/medien-internet/bildschirmzeit" target="_blank">Pro Juventute</a></strong>. Sie dienen als Orientierung – jedes Kind ist individuell.',
  
      empf_age_0_2: "0 – 2 JAHRE",
      empf_age_2_4: "2 – 4 JAHRE",
      empf_age_4_8: "4 – 8 JAHRE",
      empf_age_9_10: "9 – 10 JAHRE",
      empf_age_11: "AB 11 JAHREN",
  
      empf_card1_title: "Möglichst keine Bildschirmzeit",
      empf_card1_l1: "Möglichst keine Bildschirmzeit",
      empf_card1_l2: "Direkte Interaktion fördern",
      empf_card1_l3: "Sprachentwicklung braucht echte Gespräche",
      empf_card1_l4: "Ausnahme: Videochat mit Familienmitgliedern",
  
      empf_card2_title: "5 – 10 Minuten pro Tag",
      empf_card2_l1: "Maximal 5 bis 10 Minuten pro Tag",
      empf_card2_l2: "Nur qualitativ hochwertige Inhalte",
      empf_card2_l3: "Gemeinsames Schauen und Erklären",
      empf_card2_l4: "Pädagogisch wertvolle Apps bevorzugen",
  
      empf_card3_title: "30 – 60 Minuten pro Tag",
      empf_card3_l1: "30 bis 60 Minuten pro Tag als Orientierung",
      empf_card3_l2: "Inhalte regelmässig gemeinsam besprechen",
      empf_card3_l3: "Klare Regeln für Geräte im Schlafzimmer",
      empf_card3_l4: "Bildschirmfreie Familienzeiten einplanen",
  
      empf_card4_title: "60 – 100 Minuten pro Tag",
      empf_card4_l1: "60 bis 100 Minuten pro Tag",
      empf_card4_l2: "Nutzungszeiten gemeinsam vereinbaren",
      empf_card4_l3: "Medienkompetenz aktiv fördern",
      empf_card4_l4: "Pausen und Offline-Zeiten einbauen",
  
      empf_card5_title: "Begleitung statt Verbote",
      empf_card5_l1: "Offene Gespräche über Mediennutzung führen",
      empf_card5_l2: "Vorbildfunktion der Eltern beachten",
      empf_card5_l3: "Schlafqualität im Blick behalten",
      empf_card5_l4: "Social Media kritisch begleiten",
  
      empf_source_who: "Quelle: WHO / American Academy of Pediatrics",
      empf_source_who2019: "Quelle: WHO Global Guidelines 2019",
      empf_source_pj_sucht: "Quelle: Pro Juventute / Sucht Schweiz",
      empf_source_pj: "Quelle: Pro Juventute",
      empf_source_klicksafe: "Quelle: Klicksafe / Pro Juventute",
  
      empf_tips_title: "Tipps für den Alltag",
      empf_tips_subtitle: "Kleine Regeln, grosse Wirkung.",
      empf_tip1_title: "Bildschirmfreie Zeiten",
      empf_tip1_text: "Legt feste Zeiten fest, wo alle Geräte weggelegt werden.",
      empf_tip2_title: "Gemeinsam statt alleine",
      empf_tip2_text: "Schaue gemeinsam mit deinem Kind, was es am Gerät macht.",
      empf_tip3_title: "Qualität über Quantität",
      empf_tip3_text: "Lernspiele und kreative Apps sind wertvoller als passives Konsumieren.",
      empf_tip4_title: "Gutes Vorbild sein",
      empf_tip4_text: "Kinder orientieren sich an Erwachsenen.",
      empf_footer: 'Weitere Informationen bei <a href="https://www.projuventute.ch/de/eltern/medien-internet/bildschirmzeit" target="_blank">Pro Juventute Schweiz</a>',
  
      order_title: "Aktuell ausverkauft",
      order_subtitle: "Alle Lumi Produkte sind momentan leider vergriffen.",
      order_info_title: "Was bedeutet das?",
      order_info_text: "Aufgrund der hohen Nachfrage sind unsere Lumi Produkte aktuell nicht verfügbar. Wir arbeiten daran, so schnell wie möglich neue Geräte bereitzustellen.",
      order_notify_title: "Benachrichtigung erhalten",
      order_notify_text: "Möchtest du informiert werden, sobald die Produkte wieder verfügbar sind? Schreib uns eine kurze Nachricht an kontakt@lumi.ch und wir melden uns bei dir.",
      order_back: "Zurück zu den Produkten"
    },
  
    en: {
      nav_uebersicht: "Overview",
      nav_kinder: "Children",
      nav_produkte: "Products",
      nav_empfehlungen: "Recommendations",
      nav_mitteilungen: "Notifications",
  
      language: "Language",
      changePassword: "Change password",
      changeIcon: "Change profile icon",
      logout: "Sign out",
  
      currentPassword: "CURRENT PASSWORD",
      newPassword: "NEW PASSWORD",
      confirmPassword: "CONFIRM PASSWORD",
      cancel: "Cancel",
      save: "Save",
  
      pwFillAll: "Please fill in all fields.",
      pwNoMatch: "Passwords do not match.",
      pwSaved: "Password saved.",
  
      footer_copy: "© 2026 Lumi · Made for families",
      footer_privacy: "Privacy",
      footer_imprint: "Imprint",
      footer_contact: "Contact",
  
      legal_back_overview: "Back to overview",
  
      contact_title: "Contact",
      contact_subtitle: "We look forward to hearing from you.",
      contact_write_title: "Write to us",
      contact_write_text: "Do you have questions about Lumi, feedback or suggestions? We are happy to help.",
      contact_location_title: "Location",
      contact_location_text: "Lumi is a project by the University of Applied Sciences of the Grisons.",
      fhgr_name: "FHGR – University of Applied Sciences of the Grisons",
  
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
      imprint_project_text: 'Lumi is a project created as part of the <strong>Interactive Media 4 (IM4)</strong> module in the Multimedia Production BSc programme, 4th semester.',
      imprint_team_title: "Team – Nic and the Coders",
      imprint_webapp: "Web app",
      imprint_webapp_names: "Alisha Künzi & Melina Gast",
      imprint_physical: "Physical computing",
      imprint_physical_names: "Inès Jetzer & Nic Luginbühl",
      imprint_concept_title: "Project concept",
      imprint_concept_text: "Lumi supports families in developing a mindful approach to screen time. The system consists of a physical Lumi Box and a web app for managing and visualising usage data. The target group is parents with children aged 4–12.",
  
      mitt_title: "Notifications",
      mitt_mark_all: "Mark all as read",
      mitt_all: "All",
      mitt_unread: "Unread",
      mitt_read: "Read",
      mitt_empty: "No notifications in this category",
  
      mitt_streak_title: "Mayumi reached a 5-day streak",
      mitt_streak_desc: "Mayumi stayed within her limit for 5 days in a row.",
      mitt_reward_title: "Reward given",
      mitt_reward_desc: "You gave Mayumi +20 minutes for tidying up.",
      mitt_limit_title: "Leo: Daily limit met",
      mitt_limit_desc: "Leo stayed within his 60-minute limit today.",
      mitt_session_title: "Felix's tablet session ended",
      mitt_session_desc: "The session ended automatically after 45 minutes.",
      mitt_offline_title: "Lumi Hub is offline",
      mitt_offline_desc: "Your Lumi Hub has been unreachable since yesterday at 22:00.",
  
      mitt_1h: "1h ago",
      mitt_3h: "3h ago",
      mitt_5h: "5h ago",
      mitt_yesterday: "yesterday",
  
      prod_hero_title: "Lumi hardware for families",
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
  
      empf_title: "Screen time recommendations",
      empf_subtitle: "Official recommendations from the World Health Organization (WHO) and Pro Juventute for healthy media use among children.",
      empf_hint: 'These recommendations are based on WHO guidelines (2019) and recommendations from <strong><a href="https://www.projuventute.ch/de/eltern/medien-internet/bildschirmzeit" target="_blank">Pro Juventute</a></strong>. They are meant as guidance – every child is different.',
  
      empf_age_0_2: "0 – 2 YEARS",
      empf_age_2_4: "2 – 4 YEARS",
      empf_age_4_8: "4 – 8 YEARS",
      empf_age_9_10: "9 – 10 YEARS",
      empf_age_11: "FROM 11 YEARS",
  
      empf_card1_title: "As little screen time as possible",
      empf_card1_l1: "As little screen time as possible",
      empf_card1_l2: "Encourage direct interaction",
      empf_card1_l3: "Language development needs real conversations",
      empf_card1_l4: "Exception: video calls with family members",
  
      empf_card2_title: "5 – 10 minutes per day",
      empf_card2_l1: "Maximum 5 to 10 minutes per day",
      empf_card2_l2: "Only high-quality content",
      empf_card2_l3: "Watch together and explain",
      empf_card2_l4: "Prefer educational apps",
  
      empf_card3_title: "30 – 60 minutes per day",
      empf_card3_l1: "30 to 60 minutes per day as guidance",
      empf_card3_l2: "Talk about content regularly",
      empf_card3_l3: "Set clear rules for devices in bedrooms",
      empf_card3_l4: "Plan screen-free family time",
  
      empf_card4_title: "60 – 100 minutes per day",
      empf_card4_l1: "60 to 100 minutes per day",
      empf_card4_l2: "Agree on usage times together",
      empf_card4_l3: "Actively support media literacy",
      empf_card4_l4: "Include breaks and offline time",
  
      empf_card5_title: "Guidance instead of bans",
      empf_card5_l1: "Have open conversations about media use",
      empf_card5_l2: "Be aware of parents' role-model effect",
      empf_card5_l3: "Keep an eye on sleep quality",
      empf_card5_l4: "Support critical use of social media",
  
      empf_source_who: "Source: WHO / American Academy of Pediatrics",
      empf_source_who2019: "Source: WHO Global Guidelines 2019",
      empf_source_pj_sucht: "Source: Pro Juventute / Sucht Schweiz",
      empf_source_pj: "Source: Pro Juventute",
      empf_source_klicksafe: "Source: Klicksafe / Pro Juventute",
  
      empf_tips_title: "Tips for everyday life",
      empf_tips_subtitle: "Small rules, big effect.",
      empf_tip1_title: "Screen-free times",
      empf_tip1_text: "Set fixed times when all devices are put away.",
      empf_tip2_title: "Together instead of alone",
      empf_tip2_text: "Watch together with your child and talk about what they do on the device.",
      empf_tip3_title: "Quality over quantity",
      empf_tip3_text: "Learning games and creative apps are more valuable than passive consumption.",
      empf_tip4_title: "Be a good role model",
      empf_tip4_text: "Children take cues from adults.",
      empf_footer: 'More information from <a href="https://www.projuventute.ch/de/eltern/medien-internet/bildschirmzeit" target="_blank">Pro Juventute Switzerland</a>',
  
      order_title: "Currently sold out",
      order_subtitle: "All Lumi products are unfortunately out of stock at the moment.",
      order_info_title: "What does this mean?",
      order_info_text: "Due to high demand, our Lumi products are currently unavailable. We are working to restock as soon as possible.",
      order_notify_title: "Get notified",
      order_notify_text: "Want to be notified when products are available again? Send us a message at kontakt@lumi.ch and we'll get back to you.",
      order_back: "Back to products"
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
    var footerLinks = document.querySelectorAll(".lumi-footer-links a[data-i18n-shared]");
    footerLinks.forEach(function(el) {
      var key = el.getAttribute("data-i18n-shared");
      var val = getSharedT(key);
      if (val !== key) el.textContent = val;
    });
    var footerCopy = document.querySelector(".lumi-footer-copy[data-i18n-shared]");
    if (footerCopy) {
      var val = getSharedT("footer_copy");
      if (val !== "footer_copy") footerCopy.textContent = val;
    }
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
            localStorage.setItem("lumi_user", JSON.stringify({ name: displayName, email: result.email }));
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
    var parentIcon = localStorage.getItem('lumi_parent_icon') || '';
    var avatar = document.getElementById("profileAvatar");
    var avatarLg = document.getElementById("profileAvatarLg");
    var nameEl = document.getElementById("profileName");
    var emailEl = document.getElementById("profileEmail");
    if (avatar) {
      if (parentIcon && typeof getLumiIconSvg === 'function' && typeof LUMI_ICONS !== 'undefined' && LUMI_ICONS[parentIcon]) {
        avatar.style.background = '#e8dff2';
        avatar.innerHTML = getLumiIconSvg(parentIcon, '#b49ed4', 32);
      } else {
        avatar.style.background = '#b49ed4';
        avatar.innerHTML = '';
        avatar.textContent = initial;
      }
    }
    if (avatarLg) {
      if (parentIcon && typeof getLumiIconSvg === 'function' && typeof LUMI_ICONS !== 'undefined' && LUMI_ICONS[parentIcon]) {
        avatarLg.style.background = '#e8dff2';
        avatarLg.innerHTML = getLumiIconSvg(parentIcon, '#b49ed4', 36);
      } else {
        avatarLg.style.background = '#b49ed4';
        avatarLg.innerHTML = '';
        avatarLg.textContent = initial;
      }
    }
    if (nameEl) nameEl.textContent = user.name || user.email;
    if (emailEl) emailEl.textContent = user.email;
  }
  
  // ─── Profile Dropdown & Burger Menu ──────────
  function injectProfileDropdown() {
    var nav = document.querySelector("nav");
    if (!nav || document.getElementById("profileBtn")) return;
  
    if (!document.querySelector(".burger-menu")) {
      var burgerBtn = document.createElement("button");
      burgerBtn.className = "burger-menu";
      burgerBtn.setAttribute("aria-label", "Menü öffnen");
      burgerBtn.setAttribute("aria-expanded", "false");
      burgerBtn.innerHTML = "<span></span><span></span><span></span>";
      
      var navLinks = document.querySelector(".nav-links");
      if (navLinks) {
        nav.insertBefore(burgerBtn, navLinks);
      }
    }
  
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
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#7C6E61" stroke-width="1.3"/><path d="M8 2c0 0-3 2.5-3 6s3 6 3 6M8 2c0 0 3 2.5 3 6s-3 6-3 6M2 8h12" stroke="#7C6E61" stroke-width="1.3" stroke-linecap="round"/></svg>' +
          '<span data-i18n-shared="language">' + getSharedT("language") + '</span>' +
          '<div class="nav-lang-toggle">' +
            '<button class="nav-lang-btn ' + (currentLang === "de" ? "active" : "") + '" id="langDE" onclick="setLang(\'de\')">DE</button>' +
            '<button class="nav-lang-btn ' + (currentLang === "en" ? "active" : "") + '" id="langEN" onclick="setLang(\'en\')">EN</button>' +
          '</div>' +
        '</div>' +
        '<button class="nav-profile-item" onclick="openPasswordModal()">' +
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="2" stroke="#7C6E61" stroke-width="1.3"/><path d="M5 7V5a3 3 0 016 0v2" stroke="#7C6E61" stroke-width="1.3" stroke-linecap="round"/></svg>' +
          '<span data-i18n-shared="changePassword">' + getSharedT("changePassword") + '</span>' +
        '</button>' +
        '<button class="nav-profile-item" onclick="openParentIconModal()">' +
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="3" stroke="#7C6E61" stroke-width="1.3"/><path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="#7C6E61" stroke-width="1.3" stroke-linecap="round"/></svg>' +
          '<span data-i18n-shared="changeIcon">' + getSharedT("changeIcon") + '</span>' +
        '</button>' +
        '<div class="nav-profile-divider"></div>' +
        '<button class="nav-profile-item nav-profile-item--logout" id="logoutBtn">' +
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3-3-3M13 8H6" stroke="#e05260" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '<span data-i18n-shared="logout">' + getSharedT("logout") + '</span>' +
        '</button>' +
      '</div>';
  
    nav.appendChild(wrap);
  
    var burger = document.querySelector(".burger-menu");
    var burgerNavLinks = document.querySelector(".nav-links");
  
    if (burger && burgerNavLinks) {
      burger.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        burgerNavLinks.classList.toggle("active");
        burger.classList.toggle("open");
        
        var isExpanded = burger.getAttribute("aria-expanded") === "true";
        burger.setAttribute("aria-expanded", !isExpanded);
  
        var dd = document.getElementById("profileDropdown");
        if (dd) dd.classList.remove("active");
      };
    }
  
    var profileBtn = document.getElementById("profileBtn");
    if (profileBtn) {
      profileBtn.onclick = function(e) {
        e.stopPropagation();
        var dd = document.getElementById("profileDropdown");
        if (dd) dd.classList.toggle("active");
        
        if (burger && burgerNavLinks) {
          burgerNavLinks.classList.remove("active");
          burger.classList.remove("open");
          burger.setAttribute("aria-expanded", "false");
        }
      };
    }
  
    document.addEventListener("click", function(e) {
      var dd = document.getElementById("profileDropdown");
      
      if (burger && burgerNavLinks && !burger.contains(e.target) && !burgerNavLinks.contains(e.target)) {
        burgerNavLinks.classList.remove("active");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
      
      if (dd && profileBtn && !profileBtn.contains(e.target) && !dd.contains(e.target)) {
        dd.classList.remove("active");
      }
    });
  
    var dropdownElement = document.getElementById("profileDropdown");
    if (dropdownElement) {
      dropdownElement.addEventListener("click", function(e) {
        e.stopPropagation();
      });
    }
  
    var logoutButton = document.getElementById("logoutBtn");
    if (logoutButton) {
      logoutButton.addEventListener("click", function() {
        fetch("api/logout.php", { method: "POST" }).catch(function() {});
        localStorage.removeItem("lumi_session");
        localStorage.removeItem("lumi_user");
        window.location.href = "login.html";
      });
    }
  }
  
  // ─── Password Modal ──────────────────────────
  function injectPasswordModal() {
    if (document.getElementById("navPasswordModalOverlay")) return;
    var modal = document.createElement("div");
    modal.className = "kinder-modal-overlay";
    modal.id = "navPasswordModalOverlay";
    modal.innerHTML =
      '<div class="kinder-modal kinder-modal--small">' +
        '<div class="kinder-modal-header">' +
          '<h2 class="kinder-modal-title" data-i18n-shared="changePassword">' + getSharedT("changePassword") + '</h2>' +
          '<button class="kinder-modal-close" onclick="closePasswordModal()"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><line x1="4" y1="4" x2="16" y2="16" stroke="#6b6b6b" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="4" x2="4" y2="16" stroke="#6b6b6b" stroke-width="2" stroke-linecap="round"/></svg></button>' +
        '</div>' +
        '<div class="kinder-form-group"><label data-i18n-shared="currentPassword">' + getSharedT("currentPassword") + '</label><input type="password" id="navPwCurrent" placeholder="••••••••" autocomplete="new-password" /></div>' +
        '<div class="kinder-form-group"><label data-i18n-shared="newPassword">' + getSharedT("newPassword") + '</label><input type="password" id="navPwNew" placeholder="••••••••" autocomplete="new-password" /></div>' +
        '<div class="kinder-form-group"><label data-i18n-shared="confirmPassword">' + getSharedT("confirmPassword") + '</label><input type="password" id="navPwConfirm" placeholder="••••••••" autocomplete="new-password" /></div>' +
        '<div class="kinder-form-actions">' +
          '<button class="kinder-btn-cancel" onclick="closePasswordModal()" data-i18n-shared="cancel">' + getSharedT("cancel") + '</button>' +
          '<button class="kinder-btn-save" onclick="savePassword()" data-i18n-shared="save">' + getSharedT("save") + '</button>' +
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
    if (!curr || !newPw || !conf) return alert(getSharedT("pwFillAll"));
    if (newPw !== conf) return alert(getSharedT("pwNoMatch"));
    alert(getSharedT("pwSaved"));
    closePasswordModal();
  }
  
  // ─── Footer ──────────────────────────────────
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
  
  // Skript automatisch initialisieren bei Laden der Seite
  document.addEventListener("DOMContentLoaded", function() {
    checkAuth();
    injectProfileDropdown();
    injectPasswordModal();
    injectFooter();
    applySharedTranslations();
  });