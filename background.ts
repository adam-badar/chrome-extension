// background.ts
type BlockingResponse = { cancel?: boolean };

function blockWebsite(website: string) {
  getBlockedWebsites((blockedWebsites) => {
    blockedWebsites.push(website);
    chrome.storage.sync.set({ blockedWebsites });
  });
}

function unblockWebsite(website: string) {
  getBlockedWebsites((blockedWebsites) => {
    const index = blockedWebsites.indexOf(website);
    if (index !== -1) {
      blockedWebsites.splice(index, 1);
      chrome.storage.sync.set({ blockedWebsites });
    }
  });
}

function getBlockedWebsites(callback: (blockedWebsites: string[]) => void) {
  chrome.storage.sync.get(["blockedWebsites"], (result) => {
    const blockedWebsites: string[] = result.blockedWebsites || [];
    callback(blockedWebsites);
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blockedWebsites: [] });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "block") {
    blockWebsite(message.website);
  } else if (message.action === "unblock") {
    unblockWebsite(message.website);
  }
});

// background.ts
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    let cancelRequest = false;

    getBlockedWebsites((blockedWebsites) => {
      if (blockedWebsites.includes(new URL(details.url).hostname)) {
        cancelRequest = true;
        (chrome.tabs as any).executeScript(details.tabId, {
          code: `
              document.body.innerHTML = '';
              const message = document.createElement('p');
              message.textContent = 'This website has been blocked.';
              message.style.textAlign = 'center';
              document.body.appendChild(message);
            `,
        });
        chrome.runtime.sendMessage({
          action: "status",
          message: "Website blocked successfully.",
        });
      }
    });

    if (cancelRequest) {
      return { cancel: true };
    } else {
      return { cancel: false };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
