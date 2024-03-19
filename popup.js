document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelector(".changeColorBtn");
  const getXpathBtn = document.querySelector(".getXpathBtn");
  const colorGrid = document.querySelector(".colorGrid");
  const colorValue = document.querySelector(".colorValue");

  btn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: startInspectMode,
      });
    });
  });

  getXpathBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: startXPathMode,
      });
    });
  });

  function startInspectMode() {
    let selectedElement = null;

    document.addEventListener("mouseover", (event) => {
      const target = event.target;
      if (selectedElement !== target) {
        if (selectedElement) {
          selectedElement.classList.remove("extension-highlight");
        }
        selectedElement = target;
        selectedElement.classList.add("extension-highlight");
      }
      event.stopPropagation();
    });

    document.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const xpath = getXPath(selectedElement);
      console.log("XPath:", xpath);
      // You can modify this part to do anything you want with the XPath, like copying to clipboard or sending it to your background script for further processing
    });

    function getXPath(element) {
      if (!element) return "";

      const rootElement = document.body;
      if (rootElement === element) return "body";

      const idx = (sib, name) => (sib ? idx(sib.previousElementSibling, name || sib.localName) + (sib.localName == name) : 1);
      const segs = (elm) =>
        !elm || elm.nodeType !== 1
          ? ["body"]
          : elm === rootElement
          ? ["body"]
          : segs(elm.parentNode).concat(idx(elm) + "~" + (elm.localName || "*"));
      return segs(element).join("/").toLowerCase();
    }
  }

  function startXPathMode() {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0, 0, 0, 0.5)";
    overlay.style.cursor = "crosshair";
    overlay.style.zIndex = "9999";

    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (event) {
      event.stopPropagation();
      const xpath = getXPathFromClick(event.clientX, event.clientY);
      console.log("XPath:", xpath);
      overlay.remove();
      // You can modify this part to do anything you want with the XPath, like copying to clipboard or sending it to your background script for further processing
    });

    function getXPathFromClick(x, y) {
      const element = document.elementFromPoint(x, y);
      return getXPath(element);
    }

    function getXPath(element) {
      if (!element) return "";

      const rootElement = document.body;
      if (rootElement === element) return "body";

      const idx = (sib, name) => (sib ? idx(sib.previousElementSibling, name || sib.localName) + (sib.localName == name) : 1);
      const segs = (elm) =>
        !elm || elm.nodeType !== 1
          ? ["body"]
          : elm === rootElement
          ? ["body"]
          : segs(elm.parentNode).concat(idx(elm) + "~" + (elm.localName || "*"));
      return segs(element).join("/").toLowerCase();
    }
  }
});
