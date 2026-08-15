const HW = "schoolHubHomework";
const NOTES = "schoolHubNotes";

let homework = JSON.parse(localStorage.getItem(HW) || "[]");
let notes = JSON.parse(localStorage.getItem(NOTES) || "[]");
let mode = "simple";

const $ = (id) => document.getElementById(id);

function save() {
  localStorage.setItem(HW, JSON.stringify(homework));
  localStorage.setItem(NOTES, JSON.stringify(notes));
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#039;"
  }[c]));
}

function formatDate(value) {
  if (!value) return "No due date";
  return new Date(value + "T00:00:00").toLocaleDateString(undefined, {
    month: "short", day: "numeric"
  });
}

function render() {
  const list = $("homeworkList");

  list.innerHTML = homework.length
    ? homework.map((item, index) => `
      <div class="homework">
        <button class="check ${item.done ? "done" : ""}" data-index="${index}">
          ${item.done ? "✓" : ""}
        </button>
        <div class="hw-info">
          <b style="${item.done ? "text-decoration:line-through;opacity:.55" : ""}">
            ${esc(item.title)}
          </b>
          <small>${esc(item.subject)}</small>
        </div>
        <span class="date">${formatDate(item.date)}</span>
      </div>
    `).join("")
    : '<div class="empty">🌷 No homework yet. Add your first assignment!</div>';

  document.querySelectorAll(".check").forEach((button) => {
    button.onclick = () => {
      homework[Number(button.dataset.index)].done =
        !homework[Number(button.dataset.index)].done;
      save();
      render();
      updateProgress();
    };
  });

  $("notesList").innerHTML = notes.length
    ? notes.map((note) => `
      <article class="note">
        📝
        <h3>${esc(note.title)}</h3>
        <p>${esc(note.body)}</p>
      </article>
    `).join("")
    : '<div class="empty">📝 Your helpful notes will live here.</div>';

  document.querySelectorAll(".subject").forEach((subject) => {
    const name = subject.querySelector("b").textContent;
    if (name !== "Other") {
      const count = homework.filter(
        (item) => item.subject === name && !item.done
      ).length;
      subject.querySelector("small").textContent =
        `${count} task${count === 1 ? "" : "s"}`;
    }
  });
}

function updateProgress() {
  const percent = homework.length
    ? Math.round(
        homework.filter((item) => item.done).length /
        homework.length * 100
      )
    : 0;

  $("progress").style.width = percent + "%";
  $("percent").textContent = percent + "%";
}

function openModal(id) {
  $(id).classList.remove("hidden");
}

function closeModal(id) {
  $(id).classList.add("hidden");
}

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.onclick = () => {
    $(button.dataset.scroll).scrollIntoView({ behavior: "smooth" });
  };
});

$("helpBtn").onclick = () => openModal("helpModal");
$("helpBtn2").onclick = () => openModal("helpModal");
$("addHomework").onclick = () => openModal("homeworkModal");
$("addNote").onclick = () => openModal("noteModal");

document.querySelectorAll("[data-close]").forEach((button) => {
  button.onclick = () => closeModal(button.dataset.close);
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.onclick = (event) => {
    if (event.target === modal) modal.classList.add("hidden");
  };
});

document.querySelectorAll(".mode").forEach((button) => {
  button.onclick = () => {
    mode = button.dataset.mode;
    document.querySelectorAll(".mode").forEach((item) => {
      item.classList.remove("active");
    });
    button.classList.add("active");

    $("explain").textContent =
      mode === "practice"
        ? "🧠 Make me a practice question"
        : mode === "steps"
        ? "🪜 Break it down"
        : "✨ Explain this";
  };
});

$("explain").onclick = () => {
  const question = $("question").value.trim();
  const response = $("response");

  response.classList.remove("hidden");

  response.innerHTML = question
    ? `🌷 <b>Your question:</b> ${esc(question)}
       <br><br>
       This is the V1 helper screen. In V2, we'll connect the AI so it can
       explain this, break it into steps, or make a practice question for you! ✨`
    : "🌷 <b>Tell me what you're stuck on first!</b>";
};

$("saveHomework").onclick = () => {
  const title = $("hwTitle").value.trim();

  if (!title) {
    alert("Add an assignment name!");
    return;
  }

  homework.push({
    title,
    subject: $("hwSubject").value,
    date: $("hwDate").value,
    done: false
  });

  save();
  render();
  updateProgress();

  $("hwTitle").value = "";
  $("hwDate").value = "";
  closeModal("homeworkModal");
};

$("saveNote").onclick = () => {
  const title = $("noteTitle").value.trim();
  const body = $("noteBody").value.trim();

  if (!title || !body) {
    alert("Add a title and note!");
    return;
  }

  notes.push({ title, body });

  save();
  render();

  $("noteTitle").value = "";
  $("noteBody").value = "";
  closeModal("noteModal");
};

$("themeBtn").onclick = () => {
  alert("Theme controls are coming in V2! 🎀");
};

$("settingsBtn").onclick = () => {
  alert("Settings are coming in V2! 🎀");
};

render();
updateProgress();
