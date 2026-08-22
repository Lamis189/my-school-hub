// ======================================
// MATH HUB - BASIC INTERACTIONS
// ======================================


// --------------------------------------
// Navigation
// --------------------------------------

const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(button => {

  button.addEventListener("click", () => {

    navButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

  });

});


// --------------------------------------
// Upload Image
// --------------------------------------

const uploadBox = document.querySelector(".upload-box");
const fileInput = uploadBox.querySelector("input");

uploadBox.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {

  if (fileInput.files.length > 0) {

    const fileName = fileInput.files[0].name;

    uploadBox.querySelector("h3").textContent = "Image Selected! ✅";

    uploadBox.querySelector("p").textContent =
      fileName;

  }

});


// --------------------------------------
// AI Chat
// --------------------------------------

const chatInput = document.querySelector(".chat-box input");
const chatButton = document.querySelector(".chat-box button");
const answerBox = document.querySelector(".answer-box");

function askAI() {

  const question = chatInput.value.trim();

  if (question === "") {
    alert("Please type a math question first!");
    return;
  }

  answerBox.innerHTML = `
    <strong>🤖 Math Hub AI</strong>

    <p>
      I received your question:
    </p>

    <div class="question-bubble">
      ${question}
    </div>

    <p>
      🧠 AI Tutor is being connected next!
    </p>

    <p>
      When the AI is connected, I'll be able to explain
      your math question step-by-step.
    </p>
  `;

  chatInput.value = "";

}

chatButton.addEventListener("click", askAI);

chatInput.addEventListener("keydown", event => {

  if (event.key === "Enter") {
    askAI();
  }

});


// --------------------------------------
// Course Buttons
// --------------------------------------

const courseButtons = document.querySelectorAll(".course-card button");

courseButtons.forEach(button => {

  button.addEventListener("click", () => {

    const course =
      button.parentElement.querySelector("h3").textContent;

    alert(
      course +
      " will open its lessons, topics, examples, practice questions and AI tutor."
    );

  });

});


// --------------------------------------
// Add Planner Task
// --------------------------------------

const addTaskButton =
  document.querySelector(".add-task");

addTaskButton.addEventListener("click", () => {

  const taskName =
    prompt("What task do you want to add?");

  if (!taskName) {
    return;
  }

  const task = document.createElement("div");

  task.className = "task pink-task";

  task.innerHTML = `
    <strong>New</strong>

    <div>
      <b>${taskName}</b>
      <p>Added to your planner</p>
    </div>

    <input type="checkbox">
  `;

  addTaskButton.before(task);

});


// --------------------------------------
// Welcome Message
// --------------------------------------

console.log("🎓 Math Hub is ready!");
console.log("📚 Courses loaded.");
console.log("🤖 AI Tutor interface loaded.");
