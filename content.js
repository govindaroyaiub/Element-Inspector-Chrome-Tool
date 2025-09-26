// Content script for Element Inspector
let isInspectMode = false;
let selectedElement = null;
let overlay = null;

// Define toggleInspectMode function early and make it globally available
function toggleInspectMode() {
  isInspectMode = !isInspectMode;
  window.isInspectMode = isInspectMode; // Make it accessible globally

  if (isInspectMode) {
    document.body.style.cursor = "crosshair";
    showInspectModeIndicator();
    disablePageInteractions();
  } else {
    document.body.style.cursor = "";
    removeOverlay();
    hideInspectModeIndicator();
    enablePageInteractions();
    selectedElement = null; // Clear selection when exiting
  }
}

// Make toggleInspectMode available globally immediately
window.toggleInspectMode = toggleInspectMode;

// Helper function to safely get className from any element (including SVG)
function getElementClassName(element) {
  if (!element.className) return "";

  if (typeof element.className === "string") {
    // Regular HTML element
    return element.className;
  } else if (element.className.baseVal !== undefined) {
    // SVG element with SVGAnimatedString
    return element.className.baseVal || "";
  }

  return "";
}

// Create overlay for highlighting elements (removed - no longer needed)
function createOverlay() {
  // Overlay functionality removed - using hover effects only
}

// Remove overlay (kept for compatibility)
function removeOverlay() {
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
    overlay = null;
  }
}

// Highlight element (simplified - no overlay)
function highlightElement(element) {
  // Remove any existing highlight
  const existingHighlight = document.querySelector(
    ".element-inspector-highlight"
  );
  if (existingHighlight) {
    existingHighlight.classList.remove("element-inspector-highlight");
  }

  // Add highlight class to current element
  element.classList.add("element-inspector-highlight");
}

// Disable page interactions during inspect mode
function disablePageInteractions() {
  // Add a high-z-index overlay to capture all clicks
  const clickBlocker = document.createElement("div");
  clickBlocker.id = "element-inspector-click-blocker";
  clickBlocker.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    pointer-events: auto;
    background: transparent;
  `;

  // Handle clicks on the blocker
  clickBlocker.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // Get the element under the click blocker
    clickBlocker.style.pointerEvents = "none";
    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    clickBlocker.style.pointerEvents = "auto";

    if (elementBelow && elementBelow.tagName) {
      selectedElement = elementBelow;
      window.elementInspectorTarget = elementBelow;

      // Add visual feedback for selected element with error handling
      try {
        if (elementBelow && elementBelow.style) {
          elementBelow.style.outline = "3px solid #ff6b35";
        }
      } catch (error) {
        // Could not set outline on selected element
      }

      // Exit inspect mode and immediately open inspector
      isInspectMode = false;
      document.body.style.cursor = "";
      hideInspectModeIndicator();
      enablePageInteractions();

      // Show brief success message then open inspector
      showSelectionSuccess(elementBelow);

      // Open inspector automatically after a short delay
      setTimeout(() => {
        openInspectorWindow();
        // Remove outline after opening inspector with error handling
        try {
          if (
            elementBelow &&
            elementBelow.style &&
            elementBelow.style.outline
          ) {
            elementBelow.style.outline = "";
          }
        } catch (error) {
          // Could not remove outline from selected element
        }
      }, 1000);
    }
  });

  document.body.appendChild(clickBlocker);
}

// Re-enable page interactions
function enablePageInteractions() {
  const clickBlocker = document.getElementById(
    "element-inspector-click-blocker"
  );
  if (clickBlocker) {
    clickBlocker.remove();
  }

  // Remove any remaining highlights
  const highlightedElements = document.querySelectorAll(
    ".element-inspector-highlight"
  );
  highlightedElements.forEach((el) => {
    el.classList.remove("element-inspector-highlight");
  });
}

// Show inspect mode indicator
function showInspectModeIndicator() {
  const indicator = document.createElement("div");
  indicator.id = "inspect-mode-indicator";
  indicator.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #007ACC;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 10001;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    ">
      🔍 Inspect Mode Active - Click any element to inspect it
    </div>
  `;
  document.body.appendChild(indicator);
}

// Hide inspect mode indicator
function hideInspectModeIndicator() {
  const indicator = document.getElementById("inspect-mode-indicator");
  if (indicator) {
    indicator.remove();
  }
}

// Mouse events for element selection - DISABLED (no hover highlighting)
/*
document.addEventListener("mouseover", (e) => {
  if (isInspectMode) {
    let targetElement = e.target;

    // If hovering over click blocker, get element underneath
    if (targetElement.id === "element-inspector-click-blocker") {
      const clickBlocker = targetElement;
      clickBlocker.style.pointerEvents = "none";
      targetElement = document.elementFromPoint(e.clientX, e.clientY);
      clickBlocker.style.pointerEvents = "auto";
    }

    if (
      targetElement &&
      targetElement.id !== "element-inspector-click-blocker"
    ) {
      highlightElement(targetElement);
    }
  }
});

document.addEventListener("mouseout", (e) => {
  if (isInspectMode) {
    // Remove highlight when mouse leaves
    const highlightedElement = document.querySelector(
      ".element-inspector-highlight"
    );
    if (highlightedElement) {
      highlightedElement.classList.remove("element-inspector-highlight");
    }
  }
});
*/

// Note: Click handling is now done through the click blocker overlay for better isolation

// Show error message to user when extension context is invalidated
function showContextInvalidatedMessage() {
  const errorMessage = document.createElement("div");
  errorMessage.style.cssText = `
    position: fixed;
    top: 60px;
    right: 20px;
    background: #ff9800;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 10002;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    max-width: 300px;
  `;
  errorMessage.innerHTML = `⚠️ Extension Reloaded<br><small>Please refresh the page and try again</small>`;
  document.body.appendChild(errorMessage);

  setTimeout(() => {
    if (errorMessage.parentNode) {
      errorMessage.remove();
    }
  }, 5000);
}

// Show selection success message
function showSelectionSuccess(element) {
  const tagName = element.tagName.toLowerCase();
  const classNameStr = getElementClassName(element);
  const className = classNameStr ? `.${classNameStr.split(" ").join(".")}` : "";
  const id = element.id ? `#${element.id}` : "";

  const message = document.createElement("div");
  message.style.cssText = `
    position: fixed;
    top: 60px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 10002;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  `;
  message.innerHTML = `✅ Selected: ${tagName}${id}${className}<br><small>Opening inspector...</small>`;
  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
}

// Listen for keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + Shift + I to toggle inspect mode
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I") {
    e.preventDefault();
    toggleInspectMode();
  }

  // Escape to exit inspect mode
  if (e.key === "Escape" && isInspectMode) {
    toggleInspectMode();
  }
});

// Listen for right-click to automatically open inspector
document.addEventListener("contextmenu", (e) => {
  // If we have a selected element (from previous click), open inspector
  if (selectedElement) {
    e.preventDefault(); // Prevent default context menu
    openInspectorWindow();
  }
  // If in inspect mode but no element selected, select the right-clicked element
  else if (isInspectMode) {
    e.preventDefault();
    selectedElement = e.target;
    window.elementInspectorTarget = e.target;

    // Add visual feedback with error handling
    try {
      if (e.target && e.target.style) {
        e.target.style.outline = "3px solid #ff6b35";
      }
    } catch (error) {
      // Could not set outline style
    }

    // Exit inspect mode and open inspector
    isInspectMode = false;
    document.body.style.cursor = "";
    hideInspectModeIndicator();
    enablePageInteractions();

    setTimeout(() => {
      openInspectorWindow();
      // Remove outline with error handling
      try {
        if (e.target && e.target.style && e.target.style.outline) {
          e.target.style.outline = "";
        }
      } catch (error) {
        // Could not remove outline style
      }
    }, 500);
  }
});

// Listen for messages from background script
window.addEventListener("message", (event) => {
  if (event.data.type === "ELEMENT_INSPECTOR_OPEN" && selectedElement) {
    openInspectorWindow();
  }
});

// Open inspector window with element data
function openInspectorWindow() {
  if (!selectedElement) {
    return;
  }

  // Verify element still exists in DOM (for dynamic content)
  if (!document.contains(selectedElement)) {
    selectedElement = null;
    return;
  }

  try {
    const elementData = gatherElementData(selectedElement);

    // Send data directly to background script with error handling
    try {
      chrome.runtime.sendMessage(
        {
          action: "openInspector",
          elementData: elementData,
        },
        (response) => {
          // Handle potential extension context invalidation
          if (chrome.runtime.lastError) {
            showContextInvalidatedMessage();
          }
        }
      );
    } catch (contextError) {
      showContextInvalidatedMessage();
    }
  } catch (error) {
    // Show error message to user
    const errorMessage = document.createElement("div");
    errorMessage.style.cssText = `
      position: fixed;
      top: 60px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 10002;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    errorMessage.innerHTML = `❌ Error inspecting element<br><small>Try selecting a different element</small>`;
    document.body.appendChild(errorMessage);

    setTimeout(() => {
      errorMessage.remove();
    }, 3000);
  }
}

// Gather comprehensive element data
function gatherElementData(element) {
  // Safety check
  if (!element || !element.tagName) {
    throw new Error("Invalid element provided");
  }

  const computedStyle = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  // Get all CSS properties
  const cssProperties = {};
  try {
    for (let i = 0; i < computedStyle.length; i++) {
      const property = computedStyle[i];
      cssProperties[property] = computedStyle.getPropertyValue(property);
    }
  } catch (error) {
    cssProperties["error"] = "Could not retrieve CSS properties";
  }

  // Get DOM tree information
  const getDOMTreeData = (el, maxDepth = 3, currentDepth = 0) => {
    if (currentDepth >= maxDepth || !el || !el.tagName) return null;

    try {
      return {
        tagName: el.tagName,
        id: el.id || "",
        className: getElementClassName(el),
        textContent: el.textContent ? el.textContent.substring(0, 100) : "",
        children: Array.from(el.children)
          .map((child) => getDOMTreeData(child, maxDepth, currentDepth + 1))
          .filter(Boolean),
        attributes: Array.from(el.attributes).reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {}),
      };
    } catch (error) {
      return null;
    }
  };

  // Check for animations (GSAP, CSS animations, etc.)
  let animations = {};
  try {
    animations = detectAnimations(element);
  } catch (error) {
    animations = { css: [], gsap: [], other: [] };
  }

  return {
    element: {
      tagName: element.tagName,
      id: element.id || "",
      className: getElementClassName(element),
      innerHTML: element.innerHTML.substring(0, 1000), // Limit innerHTML size
      outerHTML: element.outerHTML.substring(0, 1000), // Limit outerHTML size
      textContent: element.textContent
        ? element.textContent.substring(0, 200)
        : "",
      attributes: Array.from(element.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {}),
    },
    dimensions: {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
    },
    cssProperties,
    domTree: {
      current: getDOMTreeData(element),
      parent: element.parentElement
        ? getDOMTreeData(element.parentElement, 2)
        : null,
      siblings: element.parentElement
        ? Array.from(element.parentElement.children)
            .filter((sibling) => sibling !== element)
            .map((sibling) => getDOMTreeData(sibling, 1))
            .slice(0, 10) // Limit siblings to prevent huge data
        : [],
    },
    animations,
    timestamp: Date.now(),
  };
}

// Detect animations on element
function detectAnimations(element) {
  const animations = {
    css: [],
    gsap: [],
    other: [],
  };

  // CSS Animations
  const computedStyle = window.getComputedStyle(element);
  if (computedStyle.animationName !== "none") {
    animations.css.push({
      name: computedStyle.animationName,
      duration: computedStyle.animationDuration,
      timing: computedStyle.animationTimingFunction,
      delay: computedStyle.animationDelay,
      iteration: computedStyle.animationIterationCount,
      direction: computedStyle.animationDirection,
      fillMode: computedStyle.animationFillMode,
    });
  }

  // CSS Transitions
  if (computedStyle.transitionProperty !== "none") {
    animations.css.push({
      type: "transition",
      property: computedStyle.transitionProperty,
      duration: computedStyle.transitionDuration,
      timing: computedStyle.transitionTimingFunction,
      delay: computedStyle.transitionDelay,
    });
  }

  // GSAP Detection
  if (window.gsap) {
    try {
      const gsapAnimations = window.gsap.getById ? window.gsap.getById() : [];
      // This is a simplified check - in real implementation, you'd need more sophisticated GSAP detection
      animations.gsap.push({
        detected: true,
        library: "GSAP",
        version: window.gsap.version || "Unknown",
      });
    } catch (e) {
      // GSAP detection failed
    }
  }

  return animations;
}

// Initialize - Element Inspector content script loaded

// Check if Chrome extension context is valid
if (typeof chrome === "undefined" || !chrome.runtime || !chrome.runtime.id) {
  // Chrome extension context may be invalidated - extension may need to be reloaded
}
