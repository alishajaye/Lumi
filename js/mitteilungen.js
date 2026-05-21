document.addEventListener('DOMContentLoaded', () => {
  const notificationList = document.getElementById('notificationList');
  const emptyState = document.getElementById('emptyState');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const tabs = document.querySelectorAll('.mitt-filter-tab');
  
  let allNotifications = []; // Speicher für die geladenen DB-Nachrichten
  let currentFilter = 'all';

  // 1. FUNTION: Mitteilungen von der PHP-API holen
  async function fetchNotifications() {
    try {
      const response = await fetch('api/notifications.php');
      const data = await response.json();

      if (data.status === 'success') {
        allNotifications = data.notifications;
        renderNotifications();
      } else {
        notificationList.innerHTML = `<p style="text-align: center; color: red; padding: 20px;">${data.message}</p>`;
      }
    } catch (error) {
      console.error('Fehler beim Laden der Mitteilungen:', error);
      notificationList.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">Verbindung zur API fehlgeschlagen.</p>';
    }
  }

  // 2. FUNKTION: Mitteilungen im DOM aufbauen und filtern
  function renderNotifications() {
    notificationList.innerHTML = ''; // Vorherigen Inhalt leeren
    
    // Filtern der Nachrichten basierend auf dem aktiven Tab
    // Da wir noch kein "gelesen"-Feld in der DB haben, simulieren wir die Filterung lokal.
    const filtered = allNotifications.filter(notif => {
      if (currentFilter === 'unread') return true; // Zum Testen alles als ungelesen zeigen
      if (currentFilter === 'read') return false; 
      return true; // 'all'
    });

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    filtered.forEach(notif => {
      // Schöne Zeitformatierung (z.B. "21.05.2026, 11:45 Uhr")
      const date = new Date(notif.created_at);
      const formattedTime = date.toLocaleString('de-DE', { 
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      });

      // Farbe des Kindes für das Icon und den Rand nutzen
      const childColor = notif.color || '#5192D2';

      const card = document.createElement('div');
      card.className = 'mitt-notification-card unread'; 
      card.style.borderLeft = `5px solid ${childColor}`; 

      card.innerHTML = `
        <div class="mitt-notif-icon" style="background-color: ${childColor}20;">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="${childColor}" stroke-width="1.5"/>
            <path d="M10 6v5l3 2" stroke="${childColor}" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="mitt-notif-body">
          <div class="mitt-notif-title" style="color: ${childColor}; font-weight: 700;">${notif.child_name}</div>
          <div class="mitt-notif-desc">${notif.message}</div>
          <div class="mitt-notif-time">${formattedTime} Uhr</div>
        </div>
      `;

      // Klick-Event: Karte lokal als gelesen markieren
      card.addEventListener('click', () => {
        card.classList.remove('unread');
        // Falls wir im "Ungelesen"-Tab sind, verschwindet die Karte nach dem Klick
        if (currentFilter === 'unread') {
          card.style.display = 'none';
        }
      });

      notificationList.appendChild(card);
    });
  }

  // 3. Filter-Tabs Event Listener
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderNotifications();
    });
  });

  // 4. Verlauf leeren (Ruft DELETE in notifications.php auf)
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', async () => {
      if (!confirm('Möchtest du wirklich alle Mitteilungen aus der Datenbank löschen?')) return;

      try {
        const response = await fetch('api/notifications.php', { method: 'DELETE' });
        const data = await response.json();

        if (data.status === 'success') {
          fetchNotifications(); // Liste neu laden (zeigt dann den leeren Zustand)
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Fehler beim Löschen des Verlaufs:', error);
      }
    });
  }

  // Initiales Laden beim Seitenaufruf
  fetchNotifications();

  // Automatischer Live-Poll: Aktualisiert die Liste alle 15 Sekunden von selbst
  setInterval(fetchNotifications, 15000);
});
