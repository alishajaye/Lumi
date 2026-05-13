const tabs = document.querySelectorAll(".mitt-filter-tab");
const cards = document.querySelectorAll(".mitt-notification-card");
const emptyState = document.getElementById("emptyState");

function applyFilter(filter) {
  let visible = 0;

  cards.forEach((card) => {
    const isUnread = card.classList.contains("unread");

    if (filter === "all") {
      card.style.display = "flex";
      visible++;
    } else if (filter === "unread") {
      card.style.display = isUnread ? "flex" : "none";
      if (isUnread) visible++;
    } else if (filter === "read") {
      card.style.display = !isUnread ? "flex" : "none";
      if (!isUnread) visible++;
    }
  });

  emptyState.style.display = visible === 0 ? "block" : "none";
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    applyFilter(tab.dataset.filter);
  });
});

cards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.remove("unread");

    const activeFilter = document.querySelector(".mitt-filter-tab.active").dataset.filter;
    applyFilter(activeFilter);
  });
});

document.getElementById("markAllBtn").addEventListener("click", () => {
  cards.forEach((card) => card.classList.remove("unread"));

  const activeFilter = document.querySelector(".mitt-filter-tab.active").dataset.filter;
  applyFilter(activeFilter);
});