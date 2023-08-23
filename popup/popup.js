// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const statusMessage = document.getElementById("statusMessage");

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "status") {
      statusMessage.textContent = message.message;
    }
  });
});
