// ======================================
// MATH HUB - FULL SCRIPT
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
const fileInput = uploadBox ? uploadBox.querySelector("input") : null;

let selectedImageData = null;

if (uploadBox && fileInput) {

  uploadBox.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {

    if (fileInput.files.length === 0) {
      return;
    }

    const file = fileInput.files[0];

    // Maximum image size: 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5 MB.");
      fileInput.value = "";
      selectedImageData = null;
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {

      selectedImageData = reader.result;

      const title = uploadBox.querySelector("h3");
      const paragraph = uploadBox.querySelector("p");

      if (title) {
        title.textContent = "Image Selected! ✅";
      }

      if (paragraph) {
        paragraph.textContent = file.name;
      }
    };

    reader.readAsDataURL(file);
  });
}


// --------------------------------------
// AI Chat
// --------------------------------------

const chatInput = document.querySelector(".chat-box input");
const chatButton = document.querySelector(".chat-box button");
const answerBox = document.querySelector(".answer-box");

const AI_API_URL =
  "https://my-school-hub.lamisalabed36.workers.dev/api/tutor";


async function askAI() {

  if (!chatInput || !answerBox) {
    return;
  }

  const question = chatInput.value.trim();

  if (question === "" && !selectedImageData) {
    alert("Please type a math question or upload a picture first!");
    return;
  }

  // Show loading message
  answerBox.innerHTML = `
    <strong>🤖 Math Hub AI</strong>
    <p>🧠 Thinking about your question...</p>
  `;

  if (chatButton) {
    chatButton.disabled = true;
    chatButton.textContent = "Thinking...";
  }

  try {

    const response = await fetch(AI_API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        question:
          question ||
          "Please solve the math problem in this image and explain it step by step.",
        image: selectedImageData
      })
    });


    // Try to read the JSON response
    const data = await response.json().catch(() => ({}));


    // If Cloudflare returned an error
    if (!response.ok) {

      throw new Error(
        data.error ||
        `The AI server returned an error (${response.status}).`
      );
    }


    // ----------------------------------
    // Get the AI answer
    // ----------------------------------

    const answer =
      data.choices?.[0]?.message?.content ||
      data.response ||
      data.result?.response ||
      data.text ||
      data.result?.text ||
      "";


    if (!answer) {

      throw new Error(
        "The AI connected, but it did not send back an answer."
      );
    }


    // ----------------------------------
    // Display answer safely
    // ----------------------------------

    answerBox.innerHTML = "";

    const title = document.createElement("strong");
    title.textContent = "🤖 Math Hub AI";

    const answerParagraph = document.createElement("p");
    answerParagraph.textContent = answer;

    answerBox.appendChild(title);
    answerBox.appendChild(answerParagraph);


    // Clear the question
    chatInput.value = "";


    // Clear selected image
    selectedImageData = null;

    if (fileInput) {
      fileInput.value = "";
    }

    if (uploadBox) {

      const titleElement = uploadBox.querySelector("h3");
      const paragraphElement = uploadBox.querySelector("p");

      if (titleElement) {
        titleElement.textContent = "Upload a Math Question 📷";
      }

      if (paragraphElement) {
        paragraphElement.textContent =
          "Take a picture of your math problem";
      }
    }

  } catch (error) {

    console.error("Math Hub AI Error:", error);

    answerBox.innerHTML = "";

    const title = document.createElement("strong");
    title.textContent = "🤖 Math Hub AI";

    const errorParagraph = document.createElement("p");

    errorParagraph.textContent =
      "❌ " +
      (error.message ||
        "Sorry, something went wrong. Please try again.");

    answerBox.appendChild(title);
    answerBox.appendChild(errorParagraph);

  } finally {

    if (chatButton) {
      chatButton.disabled = false;
      chatButton.textContent = "Ask AI";
    }
  }
}


// --------------------------------------
// Ask AI Button
// --------------------------------------

if (chatButton) {
  chatButton.addEventListener("click", askAI);
}


// --------------------------------------
// Enter Key
// --------------------------------------

if (chatInput) {

  chatInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

      event.preventDefault();

      askAI();
    }
  });
}


// --------------------------------------
// Course Buttons
// --------------------------------------

const courseButtons =
  document.querySelectorAll(".course-card button");

courseButtons.forEach(button => {

  button.addEventListener("click", () => {

    const courseElement =
      button.parentElement.querySelector("h3");

    const course =
      courseElement
        ? courseElement.textContent
        : "This course";

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

if (addTaskButton) {

  addTaskButton.addEventListener("click", () => {

    const taskName =
      prompt("What task do you want to add?");

    if (!taskName) {
      return;
    }

    const task =
      document.createElement("div");

    task.className = "task pink-task";

    const strong =
      document.createElement("strong");

    strong.textContent = "New";

    const div =
      document.createElement("div");

    const bold =
      document.createElement("b");

    bold.textContent = taskName;

    const paragraph =
      document.createElement("p");

    paragraph.textContent =
      "Added to your planner";

    div.appendChild(bold);
    div.appendChild(paragraph);

    const checkbox =
      document.createElement("input");

    checkbox.type = "checkbox";

    task.appendChild(strong);
    task.appendChild(div);
    task.appendChild(checkbox);

    addTaskButton.before(task);
  });

}


// --------------------------------------
// Welcome Message
// --------------------------------------

console.log("🎓 Math Hub is ready!");
console.log("📚 Courses loaded.");
console.log("🤖 AI Tutor connected.");
