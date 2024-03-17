document.addEventListener("DOMContentLoaded", () => {
  const findButton = document.getElementById("findButton");
  const xpathResult = document.getElementById("xpathResult");

  findButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: getSelectedElementXPath,
        },
        (result) => {
          if (!chrome.runtime.lastError) {
            const xpath = result[0];
            xpathResult.textContent = xpath || "No element selected.";
          }
        }
      );
    });
  });
});

function getSelectedElementXPath() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const container = document.createElement("div");
    container.appendChild(range.cloneContents());
    const xpath = getXPath(container.firstChild);
    return xpath;
  }
}

function getXPath(element) {
  if (element.id !== "") {
    return 'id("' + element.id + '")';
  }
  if (element === document.body) {
    return element.tagName.toLowerCase();
  }

  let ix = 0;
  const siblings = element.parentNode.childNodes;
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling === element) {
      return getXPath(element.parentNode) + "/" + element.tagName.toLowerCase() + "[" + (ix + 1) + "]";
    }
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      ix++;
    }
  }
}
