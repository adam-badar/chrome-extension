// background.ts
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
