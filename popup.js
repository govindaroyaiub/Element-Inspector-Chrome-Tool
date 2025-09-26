// Popup script
document.addEventListener("DOMContentLoaded", async () => {
  const startInspectButton = document.getElementById("startInspect");

  // Check current inspect mode state
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  // Get current inspect mode state from content script
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: () => window.isInspectMode || false,
    },
    (result) => {
      if (result && result[0] && result[0].result) {
        updateButtonState(true);
      }
    }
  );

  startInspectButton.addEventListener("click", async () => {
    const isCurrentlyInspecting =
      startInspectButton.textContent.includes("Stop");

    // Close popup immediately for Start action
    if (!isCurrentlyInspecting) {
      window.close();
    }

    // Execute the inspect mode toggle in the content script
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: () => {
          // Trigger inspect mode toggle
          const event = new KeyboardEvent("keydown", {
            key: "I",
            ctrlKey: true,
            shiftKey: true,
            bubbles: true,
          });
          document.dispatchEvent(event);

          // Return the new state
          return window.isInspectMode;
        },
      },
      (result) => {
        if (result && result[0]) {
          updateButtonState(result[0].result);

          // Close popup for Stop action (Start already closed above)
          if (!result[0].result) {
            // If inspect mode is now OFF, close popup after short delay
            setTimeout(() => window.close(), 300);
          }
        }
      }
    );
  });

  function updateButtonState(isInspecting) {
    if (isInspecting) {
      startInspectButton.textContent = "🛑 Stop Inspecting";
      startInspectButton.style.background = "#dc3545"; // Red color
    } else {
      startInspectButton.textContent = "🔍 Start Inspecting";
      startInspectButton.style.background = "#007ACC"; // Blue color
    }
  }
});
