chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelectedXPath") {
    chrome.scripting.executeScript(
      {
        target: { tabId: sender.tab.id },
        function: getSelectedXPath,
        args: [request.xpath],
      },
      (result) => {
        if (!chrome.runtime.lastError) {
          sendResponse(result[0].result);
        }
      }
    );
    return true; // Required for sendResponse to be used asynchronously
  }
});

function getSelectedXPath(xpath) {
  const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if (element) {
    const elementXPath = getElementXPath(element);
    return elementXPath;
  }
}

function getElementXPath(element) {
  const paths = [];

  for (; element && element.nodeType == Node.ELEMENT_NODE; element = element.parentNode) {
    let index = 0;
    let hasFollowingSiblings = false;

    for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
      if (sibling.nodeType != Node.DOCUMENT_TYPE_NODE && sibling.nodeName == element.nodeName) {
        ++index;
      }
    }

    for (let sibling = element.nextSibling; sibling && !hasFollowingSiblings; sibling = sibling.nextSibling) {
      if (sibling.nodeName == element.nodeName) {
        hasFollowingSiblings = true;
      }
    }

    const tagName = (element.prefix ? element.prefix + ":" : "") + element.localName;
    const pathIndex = index || hasFollowingSiblings ? "[" + (index + 1) + "]" : "";
    paths.splice(0, 0, tagName + pathIndex);
  }

  return paths.length ? "/" + paths.join("/") : null;
}
