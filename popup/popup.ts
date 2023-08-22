// popup.ts
document.addEventListener("DOMContentLoaded", () => {
  const blockButton = document.getElementById("blockButton");
  const unblockButton = document.getElementById("unblockButton");

  blockButton.addEventListener("click", () => {
    const website = prompt("Enter the website to block:");
    if (website) {
      chrome.runtime.sendMessage({ action: "block", website });
    }
  });

  unblockButton.addEventListener("click", () => {
    const website = prompt("Enter the website to unblock:");
    if (website) {
      chrome.runtime.sendMessage({ action: "unblock", website });
    }
  });
});
