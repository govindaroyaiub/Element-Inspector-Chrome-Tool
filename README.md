# 🔍 Element Inspector

A powerful Chrome extension for web developers and designers to inspect and analyze DOM elements with advanced features including CSS analysis, DOM tree visualization, and animation detection.

## ✨ Features

- **🎯 Element Selection**: Click any element on the page to inspect it
- **📊 CSS Properties Analysis**: View all computed CSS properties with filtered meaningful values
- **🌳 Interactive DOM Tree**: Navigate through parent, children, and sibling elements with click-to-inspect
- **🔄 Element Switching**: Click any tree node to instantly switch inspector to that element
- **🎬 Animation Detection**: Detect CSS animations, transitions, and GSAP libraries
- **📐 Element Dimensions**: Get precise measurements and positioning data
- **⚡ Real-time Inspection**: Instant analysis without page refresh
- **🎨 Visual Feedback**: Highlighted element selection with outline indicators
- **🔧 Developer Friendly**: Clean interface designed for web development workflow

## 🚀 Installation

### Option 1: Load Unpacked (Development)

### Method 1: Download Pre-built Extension

1. **Download**: Get the latest `element-inspector-chrome-extension.zip` from [Releases](https://github.com/govindaroyaiub/Element-Inspector-Chrome-Tool/releases)
2. **Extract**: Unzip the downloaded file
3. **Install**:
   - Open Chrome → `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the extracted folder
4. **Ready**: Element Inspector icon appears in toolbar

### Method 2: Clone from Source

1. **Clone**: `git clone https://github.com/govindaroyaiub/Element-Inspector-Chrome-Tool.git`
2. **Install**:
   - Open Chrome → `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the cloned folder
3. **Ready**: Extension is now active

### Method 3: Chrome Web Store

🚀 **Coming Soon** - Official Chrome Web Store listing in review

## � How to Use

### Quick Start

1. **Activate**: Click the Element Inspector icon in your toolbar
2. **Start Inspecting**: Click "Start Inspecting" in the popup
3. **Select Element**: Click any element on the webpage
4. **View Analysis**: Inspector window opens automatically with detailed analysis

### Advanced Usage

#### Element Selection Methods

- **Primary**: Click "Start Inspecting" → Click any element
- **Alternative**: Right-click any element while in inspect mode

#### Keyboard Shortcuts

- `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Shift+I` (Mac): Toggle inspect mode
- `Escape`: Exit inspect mode

#### Inspector Window Features

- **Element Info**: Tag name, ID, classes, attributes
- **Interactive DOM Tree**: Click parent, siblings, or children to switch inspector focus
- **CSS Properties**: Filtered list showing only meaningful CSS values
- **Element Switching**: Instantly analyze different elements without leaving the inspector
- **DOM Tree**: Navigate through element relationships with visual indicators
- **Dimensions**: Width, height, position coordinates
- **Animations**: Detected CSS animations and GSAP libraries

### 🆕 New in v1.2.1: Interactive DOM Tree

- **Click Navigation**: Click any parent, sibling, or child element to inspect it
- **Seamless Switching**: Inspector updates instantly with new element's properties
- **Visual Feedback**: Hover effects and click hints for better usability
- **Loading States**: Smooth transitions when switching between elements

## 🛠️ Technical Details

### Architecture

- **Manifest V3**: Modern Chrome extension architecture
- **Content Scripts**: Non-intrusive DOM interaction
- **Service Worker**: Background processing and data management
- **Chrome APIs**: Tabs, scripting, and runtime messaging

### Supported Browsers

- ✅ Chrome 88+
- ✅ Chromium-based browsers (Edge, Brave, etc.)

### File Structure

```
Element Inspector/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.js              # Popup functionality
├── inspector.html        # Main inspector window
├── inspector.js          # Inspector logic and UI
├── content.js            # Content script for DOM interaction
├── background.js         # Service worker background script
├── icons/               # Extension icons
└── README.md           # This file
```

## 🔧 Development

### Prerequisites

- Chrome browser with Developer Mode enabled
- Basic knowledge of Chrome Extension APIs

### Setup for Development

```bash
# Clone the repository
git clone https://github.com/yourusername/element-inspector.git

# Navigate to the directory
cd element-inspector

# Load the extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the project folder
```

### Making Changes

1. Edit the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Element Inspector extension
4. Test your changes

## 🐛 Troubleshooting

### Common Issues

**Extension not working after page refresh**

- Solution: The extension context may have been invalidated. Refresh the page and try again.

**Can't select certain elements**

- Solution: Some elements may have complex event handling. Try right-clicking instead of left-clicking.

**Inspector window not opening**

- Solution: Check if popups are blocked for the current site. Allow popups in browser settings.

### Error Messages

**"Extension Reloaded"** (Orange notification)

- The extension was reloaded in development mode
- Refresh the webpage and try again

**"Error inspecting element"** (Red notification)

- The selected element couldn't be analyzed
- Try selecting a different element

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

- Follow existing code style and structure
- Test thoroughly on different websites
- Update README if adding new features
- Ensure Chrome extension best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Chrome Extension APIs documentation
- Web development community feedback
- Open source contributors

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Review Chrome extension documentation

---

**Made with ❤️ for the web development community**

### 🌳 **DOM Tree Visualization**

- Interactive parent/children/siblings navigation
- Visual tree structure with color coding
- Click to navigate through DOM hierarchy
- Expandable tree view with relationship indicators

### 🎨 **CSS Analysis**

- All computed CSS properties
- Real-time property search and filtering
- Organized property display
- Layout and styling information

### ✨ **Animation Detection**

- CSS animations and transitions
- GSAP library detection
- Animation parameters and timing
- Multiple animation library support

### ⚡ **Advanced Features**

- Export element data as JSON
- Responsive design for all screen sizes
- Professional UI with dark/light themes
- Real-time data updates

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The Element Inspector icon will appear in your extensions toolbar

## Usage

### Method 1: Using the Extension Popup

1. Click the Element Inspector icon in your toolbar
2. Click "Start Inspecting"
3. Click on any element on the webpage
4. Right-click and select "Element Inspector"

### Method 2: Using Keyboard Shortcuts

1. Press `Ctrl+Shift+I` (or `Cmd+Shift+I` on Mac) to toggle inspect mode
2. Click on any element to select it
3. Right-click and choose "Element Inspector"
4. Press `Escape` to exit inspect mode

### Inspector Window Features

#### Element Overview

- View element tag, ID, classes, and all attributes
- See element dimensions and positioning
- Copy element information

#### DOM Tree Navigation

- **Parent View**: See the element's parent and its position in the hierarchy
- **Siblings View**: View all sibling elements at the same level
- **Children View**: Explore child elements and nested structure
- Click on any tree node to highlight and focus

#### CSS Properties

- **Computed Tab**: All final computed CSS values
- **Search**: Filter properties by name or value
- **Layout Tab**: Box model and positioning information
- Real-time property search

#### Animation Detection

- Automatically detects CSS animations and transitions
- GSAP library detection and version information
- Animation timing, duration, and easing details
- Support for multiple animation libraries

## File Structure

```
Element Inspector/
├── manifest.json          # Extension configuration
├── background.js           # Service worker for context menus
├── content.js             # Content script for element selection
├── content.css            # Content script styles
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── inspector.html         # Main inspector window
├── inspector.css          # Inspector window styles
├── inspector.js           # Inspector window functionality
├── icons/                 # Extension icons
└── README.md             # This file
```

## Technical Details

### Permissions Required

- `activeTab`: Access to the current tab for element inspection
- `contextMenus`: Add right-click context menu option
- `scripting`: Inject scripts for element selection
- `<all_urls>`: Access to all websites for inspection

### Browser Compatibility

- Chrome 88+ (Manifest V3)
- Edge 88+ (Chromium-based)
- Other Chromium-based browsers

### Architecture

- **Manifest V3**: Uses modern Chrome extension architecture
- **Content Scripts**: Handle element selection and highlighting
- **Service Worker**: Manages context menus and tab communication
- **Popup**: Quick access interface
- **Inspector Window**: Dedicated analysis interface

## Advanced Features

### Element Data Export

Export complete element analysis as JSON including:

- Element structure and attributes
- All computed CSS properties
- DOM tree relationships
- Animation details
- Timestamp and metadata

### Animation Library Support

Currently supports detection for:

- CSS Animations and Transitions
- GSAP (GreenSock Animation Platform)
- Extensible architecture for additional libraries

### DOM Tree Relationships

Visual representation of:

- Parent elements (green highlight)
- Current element (blue highlight)
- Sibling elements (yellow highlight)
- Child elements (teal highlight)

## Development

### Adding Animation Library Support

To add support for new animation libraries:

1. Extend the `detectAnimations` function in `content.js`
2. Add detection logic for the library's global objects
3. Update the animation rendering in `inspector.js`
4. Add appropriate styling in `inspector.css`

### Customizing Styles

The extension uses CSS custom properties for easy theming:

- Primary color: `#007ACC`
- Success color: `#28a745`
- Warning color: `#ffc107`
- Danger color: `#dc3545`

## Troubleshooting

### Extension Not Working

1. Ensure you have the latest Chrome version
2. Check that Developer mode is enabled
3. Reload the extension in `chrome://extensions/`
4. Refresh the webpage you're trying to inspect

### Element Selection Issues

1. Make sure inspect mode is active (cursor should be crosshair)
2. Some elements may be covered by overlays - try clicking nearby
3. Use the keyboard shortcut to toggle inspect mode
4. Check the browser console for any error messages

### Inspector Window Not Opening

1. Allow popups for the current website
2. Check that you've selected an element first
3. Ensure the context menu item "Element Inspector" is visible
4. Try refreshing the page and selecting again

## Privacy & Security

- **No Data Collection**: The extension doesn't collect or transmit any personal data
- **Local Processing**: All analysis happens locally in your browser
- **No Network Requests**: Extension works entirely offline
- **Minimal Permissions**: Only requests necessary permissions for functionality

## Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

### Development Setup

1. Fork the repository
2. Make your changes
3. Test thoroughly on different websites
4. Submit a pull request with detailed description

## License

This project is open source and available under the [MIT License](LICENSE).

## 📋 Changelog

### Version 1.2.1 (Latest)

- **🆕 Interactive DOM Tree Navigation**: Click any parent, sibling, or child element in the DOM tree to instantly switch the inspector to that element
- **⚡ Real-time Element Switching**: Inspector updates all properties, CSS, and tree structure when switching elements
- **🎨 Enhanced Visual Feedback**: Hover effects, click hints, and loading states for better user experience
- **🔄 Seamless Workflow**: Navigate through DOM elements without closing and reopening the inspector

### Version 1.1.5

- Fixed inspect mode UX issues
- Enabled continuous element inspection
- Improved popup button state synchronization
- Enhanced error handling and context invalidation recovery

### Version 1.0.0

- Initial release
- Basic element selection and inspection
- DOM tree visualization
- CSS property analysis
- Animation detection
- Export functionality
- Professional UI design
- Animation detection
- Export functionality
- Professional UI design
