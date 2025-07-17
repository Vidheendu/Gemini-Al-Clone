document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.querySelector(".typing-input");
  const sendBtn = document.getElementById("send-message-button");
  const header = document.getElementById("welcome-header");
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const themeToggle = document.getElementById("theme-toggle");
  const suggestionChips = document.querySelectorAll(".chip");
  let firstMessageSent = false;

  // ✅ Send message on click
  sendBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const userMessage = inputField.value.trim();
    if (!userMessage) return;

    // Hide welcome header after first message
    if (!firstMessageSent) {
      header.style.display = "none";
      firstMessageSent = true;
    }

    // Show user message
    appendMessage(userMessage, "user");
    inputField.value = "";

    // Show typing animation for Gemini
    const typingMsg = appendMessage(
      `<div class="typing-dots"><span></span><span></span><span></span></div>`,
      "bot"
    );

    const reply = await fetchApiResponse(userMessage);

    // Replace typing with real reply
    typingMsg.querySelector(".chat-text").innerHTML = reply;
  });

  // ✅ Suggestion chips click
  suggestionChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      inputField.value = chip.innerText;
    });
  });

  // ✅ Sidebar toggle
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuToggle.style.display = "none"; // hide menu button when sidebar open
  });

  // ✅ Hide sidebar on outside click
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove("open");
      menuToggle.style.display = "block";
    }
  });

  // ✅ Dark mode toggle + change moon to sun
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      themeToggle.innerHTML = "☀️"; // sun icon in dark mode
    } else {
      themeToggle.innerHTML = "🌙"; // moon icon in light mode
    }
  });
});

// ✅ Append chat bubble with ICONS
function appendMessage(text, sender) {
  const chatArea = document.querySelector(".chat-area");
  const div = document.createElement("div");
  div.classList.add("chat", sender);

  if (sender === "user") {
   
    div.innerHTML = `
      
      <div class="chat-text">${text}</div>
    `;
  } else {
    
    div.innerHTML = `
      
      <div class="chat-text">${text}</div>
    `;
  }

  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
  return div;
}

// ✅ Fetch API response
async function fetchApiResponse(chat) {
  const API_KEY = "AIzaSyDAlVAiNIT7y-yNiT5u-3OH4_0_nDusDw4";
  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: chat }] }],
        }),
      }
    );
    if (!resp.ok) throw new Error(`HTTP error! ${resp.status}`);
    const data = await resp.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No valid response."
    );
  } catch (error) {
    console.error(error);
    return "❌ Error fetching response.";
  }
}
