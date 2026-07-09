const STORAGE_KEY = "royal-ticket-storage";

const form =
  document.getElementById("newTicketForm");

const ticketNumberInput =
  document.getElementById("ticketNumber");

const titleInput =
  document.getElementById("title");

const royalRoleInput =
  document.getElementById("royalRole");

const categoryInput =
  document.getElementById("category");

const tagsInput =
  document.getElementById("tags");

const symptomsInput =
  document.getElementById("symptoms");

const resolutionInput =
  document.getElementById("resolution");

const notesInput =
  document.getElementById("notes");

const saveMessage =
  document.getElementById("saveMessage");

/* ========================= */
/* LOAD THEME */
/* ========================= */

const savedTheme =
  localStorage.getItem("royal-theme")
  || "princess-theme";

document.body.classList.add(
  savedTheme
);

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

function saveTickets(tickets) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tickets)
  );
}

/* ========================= */
/* TITLE CASE */
/* ========================= */

function titleCase(text) {

  return text
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(word => {

      return (
        word.charAt(0).toUpperCase() +
        word.slice(1)
      );

    })
    .join(" ");
}

/* ========================= */
/* SAVE */
/* ========================= */

form.addEventListener(
  "submit",
  (e) => {

    e.preventDefault();

    const ticketNumber =
      ticketNumberInput.value.trim();

    const title =
      titleCase(
        titleInput.value.trim()
      );

    const royalRole =
      royalRoleInput.value;

    const category =
      categoryInput.value;

    if (
      !ticketNumber ||
      !title ||
      !royalRole ||
      !category
    ) {

      alert(
        "Please complete all required fields."
      );

      return;
    }

    const tickets =
      loadTickets();

    const now =
      new Date().toISOString();

    const newTicket = {

      id:
        crypto.randomUUID(),

      ticketNumber,

      title,

      royalRole,

      category,

      tags:
        tagsInput.value
          .split(",")
          .map(tag => tag.trim())
          .filter(Boolean),

      symptoms:
        symptomsInput.value.trim(),

      resolution:
        resolutionInput.value.trim(),

      notes:
        notesInput.value.trim(),

      createdAt:
        now,

      updatedAt:
        now
    };

    tickets.unshift(
      newTicket
    );

    saveTickets(
      tickets
    );

    if (
      royalRole === "Prince"
    ) {

      saveMessage.textContent =
        `🤴 Prince Ticket ${ticketNumber} Saved To The Kingdom Archive!`;

    } else {

      saveMessage.textContent =
        `👸 Princess Ticket ${ticketNumber} Saved To The Royal Archive!`;

    }

    setTimeout(() => {

      window.location.href =
        "index.html";

    }, 1000);

  }
);
