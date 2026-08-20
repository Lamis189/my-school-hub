// ==========================================
// 📚 HOMEWORK HELPER V2
// ==========================================

const STORAGE_KEY = "homework-helper-v2";

// ------------------------------------------
// 💾 LOAD / SAVE DATA
// ------------------------------------------

let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  name: "",
  subjects: ["Math", "English", "Science"],
  hw: [],
  notes: [],
  dark: false
};

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ------------------------------------------
// 🔎 SHORTCUT
// ------------------------------------------

const $ = (id) => document.getElementById(id);

// ------------------------------------------
// 🛡️ SAFE TEXT
// ------------------------------------------

function escapeHTML(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ------------------------------------------
// 👋 GREETING
// ------------------------------------------

function updateGreeting() {
  const greeting = $("greeting");

  if (!greeting) return;

  if (data.name.trim()) {
    greeting.textContent =
      `Hey ${data.name}! 👋 Let's get your homework done 💕`;
  } else {
    greeting.textContent =
      "Welcome! Let's get your homework done 💕";
  }

  if ($("nameInput")) {
    $("nameInput").value = data.name;
  }
}

// ------------------------------------------
// 📊 DASHBOARD
// ------------------------------------------

function updateDashboard() {
  const open = data.hw.filter(item => !item.done).length;
  const done = data.hw.filter(item => item.done).length;
  const notes = data.notes.length;

  if ($("openCount")) $("openCount").textContent = open;
  if ($("doneCount")) $("doneCount").textContent = done;
  if ($("notesCount")) $("notesCount").textContent = notes;

  updateProgress();
}

// ------------------------------------------
// 📈 PROGRESS
// ------------------------------------------

function updateProgress() {
  const total = data.hw.length;
  const completed = data.hw.filter(item => item.done).length;

  let percent = 0;

  if (total > 0) {
    percent = Math.round((completed / total) * 100);
  }

  if ($("progressBar")) {
    $("progressBar").style.width = percent + "%";
  }

  if ($("progressText")) {
    $("progressText").textContent =
      `${percent}% complete`;
  }
}

// ------------------------------------------
// 📝 HOMEWORK
// ------------------------------------------

function renderHomework(filter = "all", search = "") {
  const list = $("homeworkList");

  if (!list) return;

  list.innerHTML = "";

  const searchText = search.toLowerCase().trim();

  let homework = data.hw.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "all" ||
      (filter === "open" && !item.done) ||
      (filter === "done" && item.done);

    return matchesSearch && matchesFilter;
  });

  if (homework.length === 0) {
    list.innerHTML =
      `<li><div class="homework-info">
        🌸 No homework found!
      </div></li>`;
    return;
  }

  homework.forEach(item => {
    const li = document.createElement("li");

    li.className =
      `${item.done ? "done " : ""}priority-${item.priority.toLowerCase()}`;

    const info = document.createElement("div");
    info.className = "homework-info";

    let dueText = "";

    if (item.due) {
      dueText = `<br>📅 Due: ${escapeHTML(item.due)}`;
    }

    info.innerHTML = `
      <strong>${escapeHTML(item.title)}</strong>
      <br>
      <small>
        ${escapeHTML(item.priority)} Priority
        ${dueText}
      </small>
    `;

    const buttons = document.createElement("div");

    const doneButton = document.createElement("button");
    doneButton.className = "done-btn";
    doneButton.textContent = item.done
      ? "↩️ Undo"
      : "✅ Done";

    doneButton.onclick = () => {
      toggleHomework(item.id);
    };

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "🗑️ Delete";

    deleteButton.onclick = () => {
      deleteHomework(item.id);
    };

    buttons.appendChild(doneButton);
    buttons.appendChild(deleteButton);

    li.appendChild(info);
    li.appendChild(buttons);

    list.appendChild(li);
  });
}

// Add homework
function addHomework() {
  const input = $("homeworkInput");
  const priority = $("priorityInput");
  const dueDate = $("dueDateInput");

  if (!input || !input.value.trim()) {
    alert("Please write your homework first! 📚");
    return;
  }

  const homework = {
    id: Date.now(),
    title: input.value.trim(),
    priority: priority ? priority.value : "Low",
    due: dueDate ? dueDate.value : "",
    done: false
  };

  data.hw.push(homework);

  saveData();

  input.value = "";

  if (dueDate) {
    dueDate.value = "";
  }

  renderHomework();
  updateDashboard();
}

// Toggle homework
function toggleHomework(id) {
  const item = data.hw.find(hw => hw.id === id);

  if (!item) return;

  item.done = !item.done;

  saveData();

  renderHomework();
  updateDashboard();
}

// Delete homework
function deleteHomework(id) {
  data.hw = data.hw.filter(item => item.id !== id);

  saveData();

  renderHomework();
  updateDashboard();
}

// Homework filter
let currentHomeworkFilter = "all";

function filterHomework(filter) {
  currentHomeworkFilter = filter;

  const search =
    $("homeworkSearch")
      ? $("homeworkSearch").value
      : "";

  renderHomework(filter, search);
}

// ------------------------------------------
// 📚 SUBJECTS
// ------------------------------------------

function renderSubjects() {
  const list = $("subjectList");

  if (!list) return;

  list.innerHTML = "";

  data.subjects.forEach((subject, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>📚 ${escapeHTML(subject)}</span>
    `;

    const button = document.createElement("button");

    button.className = "delete-btn";
    button.textContent = "🗑️ Delete";

    button.onclick = () => {
      deleteSubject(index);
    };

    li.appendChild(button);
    list.appendChild(li);
  });
}

function addSubject() {
  const input = $("subjectInput");

  if (!input || !input.value.trim()) {
    alert("Please enter a subject! 📚");
    return;
  }

  const subject = input.value.trim();

  if (data.subjects.includes(subject)) {
    alert("You already have that subject! 😊");
    return;
  }

  data.subjects.push(subject);

  saveData();

  input.value = "";

  renderSubjects();
}

function deleteSubject(index) {
  data.subjects.splice(index, 1);

  saveData();

  renderSubjects();
}

// ------------------------------------------
// 📖 NOTES
// ------------------------------------------

function renderNotes(search = "") {
  const list = $("notesList");

  if (!list) return;

  list.innerHTML = "";

  const searchText = search.toLowerCase().trim();

  const notes = data.notes.filter(note => {
    return (
      note.subject.toLowerCase().includes(searchText) ||
      note.text.toLowerCase().includes(searchText)
    );
  });

  if (notes.length === 0) {
    list.innerHTML =
      `<div class="note">
        <p>🌸 No notes found!</p>
      </div>`;
    return;
  }

  notes.forEach(note => {
    const div = document.createElement("div");

    div.className = "note";

    div.innerHTML = `
      <h3>📚 ${escapeHTML(note.subject)}</h3>
      <p>${escapeHTML(note.text)}</p>
    `;

    const deleteButton = document.createElement("button");

    deleteButton.className = "delete-btn";
    deleteButton.textContent = "🗑️ Delete";

    deleteButton.onclick = () => {
      deleteNote(note.id);
    };

    div.appendChild(deleteButton);

    list.appendChild(div);
  });
}

function addNote() {
  const subject = $("noteSubject");
  const input = $("noteInput");

  if (
    !subject ||
    !input ||
    !subject.value.trim() ||
    !input.value.trim()
  ) {
    alert("Please enter both a subject and your notes! 📖");
    return;
  }

  const note = {
    id: Date.now(),
    subject: subject.value.trim(),
    text: input.value.trim()
  };

  data.notes.push(note);

  saveData();

  subject.value = "";
  input.value = "";

  renderNotes();
  updateDashboard();
}

function deleteNote(id) {
  data.notes = data.notes.filter(note => note.id !== id);

  saveData();

  renderNotes();
  updateDashboard();
}

// ------------------------------------------
// 🌙 DARK MODE
// ------------------------------------------

function applyDarkMode() {
  document.body.classList.toggle("dark", data.dark);

  const button = $("darkModeBtn");

  if (button) {
    button.textContent =
      data.dark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
  }
}

function toggleDarkMode() {
  data.dark = !data.dark;

  saveData();

  applyDarkMode();
}

// ------------------------------------------
// ⚙️ SETTINGS / NAME
// ------------------------------------------

function saveName() {
  const input = $("nameInput");

  if (!input) return;

  data.name = input.value.trim();

  saveData();

  updateGreeting();

  alert(
    data.name
      ? `Nice to meet you, ${data.name}! 💕`
      : "Your name was cleared."
  );
}

// ------------------------------------------
// 🤖 HOMEWORK HELPER
// ------------------------------------------

function helperAction(action) {
  const input = $("questionInput");
  const response = $("helperResponse");

  if (!input || !response) return;

  const question = input.value.trim();

  if (!question) {
    response.innerHTML =
      "💗 Type your question first and I'll help you!";
    return;
  }

  let answer = "";

  if (action === "explain") {
    answer = `
      <h3>💡 Let's explain it simply!</h3>
      <p>
        Your question is:
        <strong>${escapeHTML(question)}</strong>
      </p>
      <p>
        Start by identifying the main thing you don't understand.
        Then look for the important words, numbers, or ideas in the
        question.
      </p>
      <p>
        🌸 If you give me more details about the lesson or paste the
        question from your assignment, we can work through it together.
      </p>
    `;
  }

  if (action === "steps") {
    answer = `
      <h3>🪜 Let's break it into steps!</h3>

      <ol>
        <li>📖 Read the question carefully.</li>
        <li>🔎 Find out what the question is asking.</li>
        <li>📝 Write down the information you already know.</li>
        <li>🧩 Solve one small part at a time.</li>
        <li>✅ Check your answer.</li>
      </ol>

      <p>
        Your question:
        <strong>${escapeHTML(question)}</strong>
      </p>
    `;
  }

  if (action === "practice") {
    answer = `
      <h3>✏️ Practice Time!</h3>

      <p>
        Let's practice the idea behind:
        <strong>${escapeHTML(question)}</strong>
      </p>

      <p>
        🌟 Try explaining the topic in your own words first.
      </p>

      <p>
        Then ask yourself:
      </p>

      <ul>
        <li>🤔 What do I already know?</li>
        <li>🔎 What part is confusing?</li>
        <li>🧠 Can I solve a similar example?</li>
      </ul>

      <p>
        When you're ready, write your answer and check it against
        your notes.
      </p>
    `;
  }

  response.innerHTML = answer;
}

// ------------------------------------------
// 🔎 SEARCH
// ------------------------------------------

function setupSearch() {
  const homeworkSearch = $("homeworkSearch");

  if (homeworkSearch) {
    homeworkSearch.addEventListener("input", () => {
      renderHomework(
        currentHomeworkFilter,
        homeworkSearch.value
      );
    });
  }

  const noteSearch = $("noteSearch");

  if (noteSearch) {
    noteSearch.addEventListener("input", () => {
      renderNotes(noteSearch.value);
    });
  }
}

// ------------------------------------------
// 🎯 BUTTON EVENTS
// ------------------------------------------

function setupButtons() {
  if ($("addHomeworkBtn")) {
    $("addHomeworkBtn").addEventListener(
      "click",
      addHomework
    );
  }

  if ($("addSubjectBtn")) {
    $("addSubjectBtn").addEventListener(
      "click",
      addSubject
    );
  }

  if ($("addNoteBtn")) {
    $("addNoteBtn").addEventListener(
      "click",
      addNote
    );
  }

  if ($("darkModeBtn")) {
    $("darkModeBtn").addEventListener(
      "click",
      toggleDarkMode
    );
  }

  if ($("saveNameBtn")) {
    $("saveNameBtn").addEventListener(
      "click",
      saveName
    );
  }

  // Press Enter to add homework
  if ($("homeworkInput")) {
    $("homeworkInput").addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Enter") {
          addHomework();
        }
      }
    );
  }

  // Ctrl + Enter saves notes
  if ($("noteInput")) {
    $("noteInput").addEventListener(
      "keydown",
      (event) => {
        if (event.ctrlKey && event.key === "Enter") {
          addNote();
        }
      }
    );
  }
}

// ------------------------------------------
// 🚀 START APP
// ------------------------------------------

function startApp() {
  updateGreeting();
  applyDarkMode();
  renderHomework();
  renderSubjects();
  renderNotes();
  updateDashboard();
  setupButtons();
  setupSearch();
}

document.addEventListener(
  "DOMContentLoaded",
  startApp
);
