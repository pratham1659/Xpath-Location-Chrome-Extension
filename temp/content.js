chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "get_xpath") {
    console.log("Received message to get XPath");
    const xpath = getClickedElementXPath();
    console.log("Generated XPath:", xpath);
    alert(xpath); // Display the XPath in an alert dialog
  }
});

function getClickedElementXPath() {
  const clickedElement = window.event.target;
  let xpath = "";

  // Traverse up the DOM tree
  for (let element = clickedElement; element && element.nodeType === 1; element = element.parentNode) {
    const tagName = element.tagName.toLowerCase();
    const index = getElementIndex(element);
    const id = element.id;

    if (id) {
      // If the element has an ID, use it in the XPath
      xpath = `id("${id}")/${xpath}`;
      break; // Stop traversing
    } else if (index > 0) {
      // If the element has siblings of the same tag name, include the index in the XPath
      xpath = `${tagName}[${index}]/${xpath}`;
    } else {
      // Otherwise, simply include the tag name
      xpath = `${tagName}/${xpath}`;
    }
  }

  // Remove trailing '/' and return the XPath
  return xpath.replace(/\/$/, "");
}

function getElementIndex(element) {
  const siblings = element.parentNode.querySelectorAll(element.tagName);
  let index = 0;
  for (let i = 0; i < siblings.length; i++) {
    if (siblings[i] === element) {
      return index + 1; // XPath index starts from 1
    }
    if (siblings[i].nodeType === 1 && siblings[i].tagName === element.tagName) {
      index++;
    }
  }
  return 0;
}
