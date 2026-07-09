const STORAGE_KEY = "royal-ticket-storage";

const ticketList =
  document.getElementById("ticketList");

const searchInput =
  document.getElementById("searchInput");

const filterCategory =
  document.getElementById("filterCategory");

const clearFiltersBtn =
  document.getElementById("clearFiltersBtn");

/* ========================= */
/* LOAD SAVED THEME */
/* ========================= */

const savedTheme =
  localStorage.getItem("royal-theme")
  || "princess-theme";

document.body.classList.add(savedTheme);

/* ========================= */
/* STORAGE */
/* ========================= */

function loadTickets() {

  const raw =
    localStorage.getItem(STORAGE_KEY);

  return raw
    ? JSON.parse(raw)
    : [];
}

/* ========================= */
/* SAFETY */
/* ========================= */

function escapeHtml(str) {

  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ========================= */
/* THEME ICONS */
/* ========================= */

function getRoleIcon(role) {

  if (role === "Prince") {
    return "🤴";
  }

  return "👸";
}

function getRoleClass(role) {

  if (role === "Prince") {
    return "royal-prince";
  }

  return "royal-princess";
}

/* ========================= */
/* RENDER TICKETS */
/* ========================= */

function renderTickets() {

  const tickets =
    loadTickets();

  const query =
    searchInput.value
      .toLowerCase()
      .trim();

  const categoryFilter =
    filterCategory.value;

  const filtered =
    tickets.filter(ticket => {

      const searchable = [

        ticket.ticketNumber,

        ticket.title,

        ticket.royalRole,

        ticket.category,

        (ticket.tags || [])
          .join(" "),

        ticket.symptoms,

        ticket.resolution,

        ticket.notes

      ]
      .join(" ")
      .toLowerCase();

      const matchesQuery =
        !query ||
        searchable.includes(query);

      const matchesCategory =
        !categoryFilter ||
        ticket.category === categoryFilter;

      return (
        matchesQuery &&
        matchesCategory
      );
    });

  ticketList.innerHTML = "";

  if (filtered.length === 0) {

    ticketList.innerHTML = `
      <div class="small">
        No Royal Tickets Found.
      </div>
    `;

    return;
  }

  filtered
    .sort(
      (a, b) =>
        new Date(b.updatedAt) -
        new Date(a.updatedAt)
    )
    .forEach(ticket => {

      const role =
        ticket.royalRole ||
        "Princess";

      const roleClass =
        getRoleClass(role);

      const roleIcon =
        getRoleIcon(role);

      const div =
        document.createElement("div");

      div.className =
        "ticket-card";

      div.innerHTML = `

        <h4>
          ${escapeHtml(ticket.title)}
        </h4>

        <div class="ticket-number">
          ${escapeHtml(ticket.ticketNumber)}
        </div>

        <div class="meta">

          <span class="${roleClass}">
            ${roleIcon}
            ${escapeHtml(role)}
          </span>

          •

          ${escapeHtml(ticket.category)}

          •

          ${new Date(
            ticket.updatedAt
          ).toLocaleDateString()}

        </div>

      `;

      div.addEventListener(
        "click",
        () => {

          window.location.href =
            `ticket.html?id=${encodeURIComponent(ticket.id)}`;

        }
      );

      ticketList.appendChild(div);

    });

}

/* ========================= */
/* EVENTS */
/* ========================= */

searchInput.addEventListener(
  "input",
  renderTickets
);

filterCategory.addEventListener(
  "change",
  renderTickets
);

clearFiltersBtn.addEventListener(
  "click",
  () => {

    searchInput.value = "";

    filterCategory.value = "";

    renderTickets();

  }
);

/* ========================= */
/* START */
/* ========================= */

renderTickets();
