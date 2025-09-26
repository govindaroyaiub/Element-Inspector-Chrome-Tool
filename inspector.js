// Inspector window JavaScript
class ElementInspector {
  constructor() {
    this.elementData = null;
    this.currentTab = "computed";
    this.currentTreeView = "current";
    this.init();
  }

  init() {
    this.loadElementData();
    this.setupEventListeners();
    this.setupCollapsiblePanels();
  }

  loadElementData() {
    // Request data from background script instead of sessionStorage
    chrome.runtime.sendMessage({ action: "getElementData" }, (response) => {
      console.log("Inspector received response:", response);

      if (!response || !response.elementData) {
        console.log("No element data received from background");
        this.showNoDataState();
        return;
      }

      try {
        this.elementData = response.elementData;
        console.log("Element data loaded:", this.elementData);
        this.renderInspector();
      } catch (error) {
        console.error("Failed to process element data:", error);
        this.showNoDataState();
      }
    });
  }

  showNoDataState() {
    document.querySelector(".inspector-container").style.display = "none";
    document.getElementById("noData").style.display = "flex";
  }

  renderInspector() {
    if (!this.elementData) return;

    this.renderOverview();
    this.renderDOMTree();
    this.renderCSSProperties();
    this.renderAnimations();
    this.renderEvents();
  }

  renderOverview() {
    const { element, dimensions, cssProperties } = this.elementData;

    // Element tag
    const elementTag = document.getElementById("elementTag");
    const tagName = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    const className = element.className
      ? `.${element.className.split(" ").join(".")}`
      : "";
    elementTag.textContent = `<${tagName}${id}${className}>`;

    // Element path
    const elementPath = document.getElementById("elementPath");
    elementPath.textContent = this.generateElementPath(element);

    // Dimensions
    const elementDimensions = document.getElementById("elementDimensions");
    elementDimensions.innerHTML = `
            <span>Width: ${Math.round(dimensions.width)}px</span>
            <span>Height: ${Math.round(dimensions.height)}px</span>
            <span>Top: ${Math.round(dimensions.top)}px</span>
            <span>Left: ${Math.round(dimensions.left)}px</span>
        `;

    // Attributes
    const attributeGrid = document.getElementById("attributeGrid");
    attributeGrid.innerHTML = "";

    Object.entries(element.attributes).forEach(([name, value]) => {
      const attributeItem = document.createElement("div");
      attributeItem.className = "attribute-item";
      attributeItem.innerHTML = `
                <span class="attribute-name">${name}:</span>
                <span class="attribute-value">${this.escapeHtml(value)}</span>
            `;
      attributeGrid.appendChild(attributeItem);
    });
  }

  renderDOMTree() {
    const { domTree } = this.elementData;
    const treeContainer = document.getElementById("treeContainer");

    // Set up navigation buttons
    this.setupTreeNavigation();

    // Render current view
    this.renderTreeView(this.currentTreeView);
  }

  setupTreeNavigation() {
    const parentBtn = document.getElementById("parentBtn");
    const siblingsBtn = document.getElementById("siblingsBtn");
    const childrenBtn = document.getElementById("childrenBtn");

    parentBtn.addEventListener("click", () => {
      this.currentTreeView = "parent";
      this.updateTreeNavigation();
      this.renderTreeView("parent");
    });

    siblingsBtn.addEventListener("click", () => {
      this.currentTreeView = "siblings";
      this.updateTreeNavigation();
      this.renderTreeView("siblings");
    });

    childrenBtn.addEventListener("click", () => {
      this.currentTreeView = "children";
      this.updateTreeNavigation();
      this.renderTreeView("children");
    });

    // Set initial state
    this.updateTreeNavigation();
  }

  updateTreeNavigation() {
    const buttons = document.querySelectorAll(".tree-nav-btn");
    buttons.forEach((btn) => btn.classList.remove("active"));

    const activeBtn = {
      parent: document.getElementById("parentBtn"),
      siblings: document.getElementById("siblingsBtn"),
      children: document.getElementById("childrenBtn"),
    }[this.currentTreeView];

    if (activeBtn) {
      activeBtn.classList.add("active");
    }
  }

  renderTreeView(view) {
    const treeContainer = document.getElementById("treeContainer");
    const { domTree } = this.elementData;

    treeContainer.innerHTML = "";

    switch (view) {
      case "parent":
        if (domTree.parent) {
          this.renderTreeNode(domTree.parent, "parent", treeContainer);
          this.renderTreeNode(domTree.current, "current", treeContainer, 1);
        } else {
          treeContainer.innerHTML =
            '<div class="no-parent">No parent element</div>';
        }
        break;

      case "siblings":
        this.renderTreeNode(domTree.current, "current", treeContainer);
        domTree.siblings.forEach((sibling) => {
          this.renderTreeNode(sibling, "sibling", treeContainer);
        });
        break;

      case "children":
        this.renderTreeNode(domTree.current, "current", treeContainer);
        if (domTree.current.children && domTree.current.children.length > 0) {
          domTree.current.children.forEach((child) => {
            this.renderTreeNode(child, "child", treeContainer, 1);
          });
        } else {
          const noChildren = document.createElement("div");
          noChildren.className = "no-children";
          noChildren.textContent = "No child elements";
          noChildren.style.marginLeft = "20px";
          noChildren.style.color = "#666";
          treeContainer.appendChild(noChildren);
        }
        break;

      default:
        this.renderTreeNode(domTree.current, "current", treeContainer);
        break;
    }
  }

  renderTreeNode(nodeData, type, container, depth = 0) {
    const nodeElement = document.createElement("div");
    nodeElement.className = `tree-node ${type}`;
    nodeElement.style.marginLeft = `${depth * 20}px`;

    const tagName = nodeData.tagName.toLowerCase();
    const id = nodeData.id ? `#${nodeData.id}` : "";
    const className = nodeData.className
      ? `.${nodeData.className.split(" ").slice(0, 2).join(".")}`
      : "";

    nodeElement.innerHTML = `
            <div class="node-content">
                <span class="node-tag">&lt;${tagName}&gt;</span>
                <span class="node-attributes">${id}${className}</span>
                ${
                  nodeData.children && nodeData.children.length > 0
                    ? `<span>(${nodeData.children.length} children)</span>`
                    : ""
                }
            </div>
        `;

    container.appendChild(nodeElement);

    // Add click handler for navigation
    nodeElement.addEventListener("click", () => {
      this.highlightTreeNode(nodeElement);
    });
  }

  highlightTreeNode(nodeElement) {
    // Remove previous highlights
    document.querySelectorAll(".tree-node").forEach((node) => {
      node.style.transform = "";
      node.style.boxShadow = "";
    });

    // Highlight selected node
    nodeElement.style.transform = "scale(1.02)";
    nodeElement.style.boxShadow = "0 4px 8px rgba(0, 122, 204, 0.3)";
  }

  renderCSSProperties() {
    const { cssProperties } = this.elementData;
    this.cssProperties = cssProperties;

    // Set up search
    const cssSearch = document.getElementById("cssSearch");
    cssSearch.addEventListener("input", (e) => {
      this.filterCSSProperties(e.target.value);
    });

    // Render initial properties
    this.filterCSSProperties("");
  }

  filterCSSProperties(searchTerm) {
    const cssPropertiesList = document.getElementById("cssPropertiesList");
    cssPropertiesList.innerHTML = "";

    // Filter out properties with default/empty/meaningless values
    const meaningfulProperties = Object.entries(this.cssProperties)
      .filter(([property, value]) => {
        // Skip properties with default/empty/meaningless values
        const defaultValues = [
          "",
          "none",
          "auto",
          "normal",
          "initial",
          "inherit",
          "unset",
          "0px",
          "0",
          "0px 0px 0px 0px",
          "rgba(0, 0, 0, 0)",
          "transparent",
          "static",
          "visible",
          "baseline",
          "start",
          "left",
          "top",
          "ltr",
          "break-word",
          "normal normal",
          "normal normal normal",
          "scroll",
          "border-box",
          "content-box",
        ];

        if (defaultValues.includes(value.toLowerCase().trim())) {
          return false;
        }

        // Skip properties that are clearly default values
        if (
          value.startsWith("0px 0px") ||
          (value === "rgb(0, 0, 0)" && property.includes("color"))
        ) {
          return false;
        }

        // Apply search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            property.toLowerCase().includes(searchLower) ||
            value.toLowerCase().includes(searchLower)
          );
        }

        return true;
      })
      .sort(([a], [b]) => a.localeCompare(b));

    meaningfulProperties.forEach(([property, value]) => {
      const propertyElement = document.createElement("div");
      propertyElement.className = "css-property";

      // Add visual indicator for different types of CSS
      let sourceIndicator = "";
      if (property.startsWith("--")) {
        sourceIndicator =
          '<span style="background: #17a2b8; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-right: 8px;">CSS VAR</span>';
      } else if (value.includes("!important")) {
        sourceIndicator =
          '<span style="background: #dc3545; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-right: 8px;">!IMPORTANT</span>';
      }

      propertyElement.innerHTML = `
        <span class="css-property-name">${sourceIndicator}${property}</span>
        <span class="css-property-value">${this.escapeHtml(value)}</span>
      `;
      cssPropertiesList.appendChild(propertyElement);
    });

    if (meaningfulProperties.length === 0) {
      cssPropertiesList.innerHTML =
        '<div style="text-align: center; color: #666; padding: 20px;">No meaningful CSS properties found</div>';
    }
  }

  renderAnimations() {
    const { animations } = this.elementData;

    // CSS Animations
    const cssAnimationsContainer = document.querySelector(
      "#cssAnimations .animation-list"
    );
    cssAnimationsContainer.innerHTML = "";

    if (animations.css.length > 0) {
      animations.css.forEach((animation) => {
        const animationElement = document.createElement("div");
        animationElement.className = `animation-item ${
          animation.type === "transition" ? "transition" : ""
        }`;

        if (animation.type === "transition") {
          animationElement.innerHTML = `
                        <div class="animation-name">Transition</div>
                        <div class="animation-details">
                            Property: ${animation.property}<br>
                            Duration: ${animation.duration}<br>
                            Timing: ${animation.timing}<br>
                            Delay: ${animation.delay}
                        </div>
                    `;
        } else {
          animationElement.innerHTML = `
                        <div class="animation-name">${animation.name}</div>
                        <div class="animation-details">
                            Duration: ${animation.duration}<br>
                            Timing: ${animation.timing}<br>
                            Delay: ${animation.delay}<br>
                            Iteration: ${animation.iteration}<br>
                            Direction: ${animation.direction}<br>
                            Fill Mode: ${animation.fillMode}
                        </div>
                    `;
        }

        cssAnimationsContainer.appendChild(animationElement);
      });
    } else {
      cssAnimationsContainer.innerHTML =
        '<div style="color: #666;">No CSS animations detected</div>';
    }

    // GSAP Animations
    const gsapAnimationsContainer = document.querySelector(
      "#gsapAnimations .animation-list"
    );
    gsapAnimationsContainer.innerHTML = "";

    if (animations.gsap.length > 0) {
      animations.gsap.forEach((gsap) => {
        const gsapElement = document.createElement("div");
        gsapElement.className = "animation-item gsap";
        gsapElement.innerHTML = `
                    <div class="animation-name">GSAP Detected</div>
                    <div class="animation-details">
                        Library: ${gsap.library}<br>
                        Version: ${gsap.version}
                    </div>
                `;
        gsapAnimationsContainer.appendChild(gsapElement);
      });
    } else {
      gsapAnimationsContainer.innerHTML =
        '<div style="color: #666;">No GSAP animations detected</div>';
    }

    // Other Animations
    const otherAnimationsContainer = document.querySelector(
      "#otherAnimations .animation-list"
    );
    otherAnimationsContainer.innerHTML =
      '<div style="color: #666;">No other animation libraries detected</div>';
  }

  renderEvents() {
    // This would require more advanced event listener detection
    // For now, we'll show a placeholder
    const eventsList = document.getElementById("eventsList");
    eventsList.innerHTML = `
            <div style="text-align: center; color: #666; padding: 20px;">
                Event listener detection requires additional permissions.<br>
                This feature will be available in a future update.
            </div>
        `;
  }

  setupEventListeners() {
    // Refresh button
    document.getElementById("refreshBtn").addEventListener("click", () => {
      location.reload();
    });

    // Export button
    document.getElementById("exportBtn").addEventListener("click", () => {
      this.exportData();
    });

    // Close window buttons - handle both inline onclick and programmatic
    const closeButtons = document.querySelectorAll(
      'button[onclick*="window.close"], .close-btn'
    );
    closeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        this.closeWindow();
      });

      // Remove inline onclick to avoid conflicts
      button.removeAttribute("onclick");
    });

    // Add keyboard shortcut for closing (Escape key)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeWindow();
      }
    });
  }

  closeWindow() {
    // Try multiple methods to close the window/tab
    try {
      if (typeof chrome !== "undefined" && chrome.tabs) {
        // Close current tab using Chrome extension API
        chrome.tabs.getCurrent((tab) => {
          if (tab) {
            chrome.tabs.remove(tab.id);
          } else {
            // Fallback if getCurrent doesn't work
            this.fallbackClose();
          }
        });
      } else {
        this.fallbackClose();
      }
    } catch (error) {
      console.log("Chrome API close failed, using fallback:", error);
      this.fallbackClose();
    }
  }

  fallbackClose() {
    // Alternative closing methods
    if (window.close) {
      window.close();
    } else if (history.length > 1) {
      history.back();
    } else {
      // Show a message with manual close instruction
      const closeMessage = document.createElement("div");
      closeMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #007ACC;
        color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        font-family: Arial, sans-serif;
      `;
      closeMessage.innerHTML = `
        <h3>Please close this tab manually</h3>
        <p>Press Ctrl+W (Cmd+W on Mac) or click the X button on the browser tab</p>
        <button onclick="this.parentElement.remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px;">
          Dismiss
        </button>
      `;
      document.body.appendChild(closeMessage);
    }
  }

  setupTabSwitching() {
    // Tab functionality removed - no longer needed
  }

  switchTab(tab) {
    // Tab functionality removed - no longer needed
  }

  setupCollapsiblePanels() {
    const collapseButtons = document.querySelectorAll(".collapse-btn");
    collapseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.target;
        const panel = document.getElementById(target);

        if (panel.style.display === "none") {
          panel.style.display = "block";
          button.textContent = "−";
        } else {
          panel.style.display = "none";
          button.textContent = "+";
        }
      });
    });
  }

  exportData() {
    if (!this.elementData) return;

    const exportData = {
      ...this.elementData,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `element-inspector-${Date.now()}.json`;
    link.click();
  }

  generateElementPath(element) {
    let path = element.tagName.toLowerCase();
    if (element.id) path += `#${element.id}`;
    if (element.className) {
      const classes = element.className.split(" ").filter((c) => c.trim());
      if (classes.length > 0) {
        path += `.${classes.join(".")}`;
      }
    }
    return path;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new ElementInspector();
});

// Handle window focus to refresh data if needed
window.addEventListener("focus", () => {
  // Could implement auto-refresh logic here
});
