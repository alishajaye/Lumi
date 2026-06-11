document.addEventListener('DOMContentLoaded', () => {
  const notificationList = document.getElementById('notificationList');
  const emptyState = document.getElementById('emptyState');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const tabs = document.querySelectorAll('.mitt-filter-tab');
  
  let allNotifications = [];
  let currentFilter = 'all';

  function formatTime(dateString) {
    const date = new Date(dateString);
    const lang = localStorage.getItem('lumi_lang') || 'de';
    const locale = lang === 'en' ? 'en-GB' : 'de-DE';
    return date.toLocaleString(locale, {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

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

  function renderNotifications() {
    notificationList.innerHTML = '';
    
    const filtered = allNotifications.filter(notif => {
      if (currentFilter === 'unread') return true;
      if (currentFilter === 'read') return false; 
      return true;
    });

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    filtered.forEach(notif => {
      const formattedTime = formatTime(notif.created_at);
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
          <div class="mitt-notif-time">${formattedTime}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        card.classList.remove('unread');
        if (currentFilter === 'unread') {
          card.style.display = 'none';
        }
      });

      notificationList.appendChild(card);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderNotifications();
    });
  });

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', async () => {
      const lang = localStorage.getItem('lumi_lang') || 'de';
      const confirmMsg = lang === 'en'
        ? 'Do you really want to delete all notifications?'
        : 'Möchtest du wirklich alle Mitteilungen aus der Datenbank löschen?';

      if (!confirm(confirmMsg)) return;

      try {
        const response = await fetch('api/notifications.php', { method: 'DELETE' });
        const data = await response.json();

        if (data.status === 'success') {
          fetchNotifications();
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Fehler beim Löschen des Verlaufs:', error);
      }
    });
  }

  fetchNotifications();

  setInterval(fetchNotifications, 15000);
});
