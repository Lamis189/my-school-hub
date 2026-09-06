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

let selectedImageData = null;

uploadBox.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];

    // Keep images reasonably small
    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5 MB.");
      fileInput.value = "";
      return;
    }

    const fileName = file.name;

    uploadBox.querySelector("h3").textContent = "Image Selected! ✅";
    uploadBox.querySelector("p").textContent = fileName;

    // Convert image to data that can be sent to the AI
    const reader = new FileReader();

    reader.onload = () => {
      selectedImageData = reader.result;
    };

    reader.readAsDataURL(file);
  }
});


// --------------------------------------
// AI Chat
// --------------------------------------

const chatInput = document.querySelector(".chat-box input");
const chatButton = document.querySelector(".chat-box button");
const answerBox = document.querySelector(".answer-box");

// Cloudflare Worker AI endpoint
const AI_API_URL =
  "https://my-school-hub.lamisalabed36.workers.dev/api/tutor";

async function askAI() {
  const question = chatInput.value.trim();

  // Make sure there is either text or an image
  if (question === "" && !selectedImageData) {
    alert("Please type a math question or upload a picture first!");
    return;
  }

  // Show loading message
  answerBox.innerHTML = `
    <strong>🤖 Math Hub AI</strong>
    <p>🧠 Thinking about your question...</p>
  `;

  try {
    const response = await fetch(AI_API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        question: question,
        image: selectedImageData
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "The AI request failed."
      );
    }

    // Get the AI's answer
    const answer =
      data.response ||
      data.result?.response ||
      data.text ||
      "Sorry, I couldn't answer that question.";

    // Display the answer safely
    answerBox.innerHTML = `
      <strong>🤖 Math Hub AI</strong>
      <p class="ai-response"></p>
    `;

    answerBox.querySelector(".ai-response").textContent = answer;

    // Clear the question and image
    chatInput.value = "";
    selectedImageData = null;
    fileInput.value = "";

    uploadBox.querySelector("h3").textContent = "Upload Image";
    uploadBox.querySelector("p").textContent =
      "Click to upload a math question";

  } catch (error) {
    console.error("AI Error:", error);

    answerBox.innerHTML = `
      <strong>🤖 Math Hub AI</strong>
      <p>❌ Sorry, something went wrong.</p>
      <p>Please try again in a moment.</p>
    `;
  }
}


// Send button
chatButton.addEventListener("click", askAI);


// Press Enter to send
chatInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    askAI();
  }
});


// --------------------------------------
// Course Buttons
// --------------------------------------

const courseButtons =
  document.querySelectorAll(".course-card button");

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
      <b></b>
      <p>Added to your planner</p>
    </div>

    <input type="checkbox">
  `;

  // Put the user's task name into the page safely
  task.querySelector("b").textContent = taskName;

  addTaskButton.before(task);
});


// --------------------------------------
// Welcome Message
// --------------------------------------

console.log("🎓 Math Hub is ready!");
console.log("📚 Courses loaded.");
console.log("🤖 AI Tutor is connected!");
