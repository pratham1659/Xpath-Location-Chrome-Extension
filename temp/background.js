chrome.runtime.onInstalled.addListener(() => {
  console.log("Installed XPath Locator Extension");
  chrome.contextMenus.create({
    id: "get-xpath",
    title: "Get XPath",
    contexts: ["all"],
  });
});
console.log("Background script loaded");
chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log("Context menu clicked");
  console.log(Object.keys(info));
});
