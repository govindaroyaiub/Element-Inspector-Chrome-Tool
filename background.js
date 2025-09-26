// Background script for Element Inspector
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu item
  chrome.contextMenus.create({
    id: "element-inspector",
    title: "Element Inspector",
    contexts: ["all"],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "element-inspector") {
    // Inject the inspector script
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: openElementInspector,
    });
  }
});

// Function to be injected into the page
function openElementInspector() {
  // This will be executed in the content script context
  if (window.elementInspectorTarget) {
    window.postMessage(
      {
        type: "ELEMENT_INSPECTOR_OPEN",
        element: window.elementInspectorTarget,
      },
      "*"
    );
  } else {
    alert(
      "Please first click on an element while in inspect mode, then right-click to open Element Inspector."
    );
  }
}

// Store element data temporarily
let currentElementData = null;

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log("Background script received message:", request);
  if (request.action === "openInspector") {
    // console.log("Opening inspector window...");

    // Store the element data temporarily
    currentElementData = request.elementData;
    // console.log("Stored element data in background:", currentElementData);

    // Handle opening inspector in new tab or popup
    chrome.tabs.create({
      url: chrome.runtime.getURL("inspector.html"),
      active: true,
    });
  } else if (request.action === "getElementData") {
    // Send the stored data to the inspector window
    // console.log("Sending stored element data to inspector");
    sendResponse({ elementData: currentElementData });
  }
});
