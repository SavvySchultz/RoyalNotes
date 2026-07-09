const STORAGE_KEY = "royal-ticket-storage";

const ticketView =
  document.getElementById("ticketView");

const editBtn =
  document.getElementById("editBtn");

const deleteBtn =
  document.getElementById("deleteBtn");

const editForm =
  document.getElementById("editForm");

const cancelEditBtn =
  document.getElementById("cancelEditBtn");

const ticketMessage =
  document.getElementById("ticketMessage");

const editTicketNumber =
  document.getElementById("editTicketNumber");

const editTitle =
  document.getElementById("editTitle");

const editRoyalRole =
  document.getElementById("editRoyalRole");

const editCategory =
  document.getElementById("editCategory");

const editTags =
  document.getElementById("editTags");

const editSymptoms =
  document.getElementById("editSymptoms");

const editResolution =
  document.getElementById("editResolution");

const editNotes =
  document.getElementById("editNotes");

function loadTickets() {
  const raw =
    localStorage.getItem(STORAGE_KEY);

  return raw
    ? JSON.parse(raw)
    : [];
}

function saveTickets(tickets) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tickets)
  );
}

function getTicketIdFromUrl() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get("id");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function titleCase(text) {
  return text
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

let tickets =
  loadTickets();

let ticketId =
  getTicketIdFromUrl();

let ticket =
  tickets.find(
    t => t.id === ticketId
  );

if (!ticket) {

  ticketView.innerHTML = `
    <p class="small">
      Ticket not found.
    </p>
  `;

  editBtn.disabled = true;
  deleteBtn.disabled = true;

} else {

  renderTicket(ticket);

}

function renderTicket(ticket) {

  const crown =
    ticket.royalRole === "Prince"
      ? "🤴"
      : "👸";

  ticketView.innerHTML = `

<div class="detail-block">

<h3>
${crown}
${escapeHtml(ticket.title)}
</h3>

<p class="small">
Ticket Number:
<strong>
${escapeHtml(ticket.ticketNumber)}
</strong>
</p>

<p class="small">
Royal Role:
<strong>
${escapeHtml(ticket.royalRole || "Princess")}
</strong>
</p>

<p class="small">
Category:
<strong>
${escapeHtml(ticket.category)}
</strong>
</p>

<p class="small">
Created:
${new Date(ticket.createdAt).toLocaleString()}
</p>

<p class="small">
Last Updated:
${new Date(ticket.updatedAt).toLocaleString()}
</p>

</div>

<div class="detail-block">

<h3>Tags</h3>

<div class="tag-list">

${(ticket.tags || [])
  .map(
    tag =>
      `<span class="tag">${escapeHtml(tag)}</span>`
  )
  .join("")}

</div>

</div>

<div class="detail-block">
<h3>Symptoms</h3>
<p>${escapeHtml(ticket.symptoms || "")}</p>
</div>

<div class="detail-block">
<h3>Resolution</h3>
<p>${escapeHtml(ticket.resolution || "")}</p>
</div>

<div class="detail-block">
<h3>Additional Notes</h3>
<p>${escapeHtml(ticket.notes || "")}</p>
</div>
`;
}

editBtn.addEventListener("click", () => {

  editForm.style.display = "block";

  editTicketNumber.value =
    ticket.ticketNumber;

  editTitle.value =
    ticket.title;

  editRoyalRole.value =
    ticket.royalRole || "Princess";

  editCategory.value =
    ticket.category;

  editTags.value =
    (ticket.tags || []).join(", ");

  editSymptoms.value =
    ticket.symptoms || "";

  editResolution.value =
    ticket.resolution || "";

  editNotes.value =
    ticket.notes || "";
});

cancelEditBtn.addEventListener(
  "click",
  () => {
    editForm.style.display = "none";
  }
);

editForm.addEventListener(
  "submit",
  e => {

    e.preventDefault();

    const index =
      tickets.findIndex(
        t => t.id === ticket.id
      );

    tickets[index] = {

      ...tickets[index],

      ticketNumber:
        editTicketNumber.value.trim(),

      title:
        titleCase(
          editTitle.value.trim()
        ),

      royalRole:
        editRoyalRole.value,

      category:
        editCategory.value,

      tags:
        editTags.value
          .split(",")
          .map(tag => tag.trim())
          .filter(Boolean),

      symptoms:
        editSymptoms.value.trim(),

      resolution:
        editResolution.value.trim(),

      notes:
        editNotes.value.trim(),

      updatedAt:
        new Date().toISOString()
    };

    saveTickets(tickets);

    ticket =
      tickets[index];

    renderTicket(ticket);

    editForm.style.display =
      "none";

    ticketMessage.textContent =
      "✨ Ticket Updated!";
  }
);

deleteBtn.addEventListener(
  "click",
  () => {

    const ok = confirm(
      `Delete ticket ${ticket.ticketNumber}?`
    );

    if (!ok) return;

    tickets =
      tickets.filter(
        t => t.id !== ticket.id
      );

    saveTickets(tickets);

    window.location.href =
      "index.html";
  }
);
