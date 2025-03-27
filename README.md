# Webpage Cleaner Chrome Extension

A Chrome extension that removes specific elements from supported websites. Currently supports engnovate.com and can be easily extended to support other websites.

## Features

- Removes specified elements from supported websites with a single click
- Shows notifications for unsupported websites
- Easy to extend for other websites
- Simple and intuitive interface

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. Navigate to a supported website (currently engnovate.com)
2. Click the extension icon in your Chrome toolbar
3. The specified elements will be removed immediately
4. If you click the extension on an unsupported website, you'll see a notification listing the currently supported websites

## Extending for Other Websites

To add support for another website:

1. Open `content.js`
2. Add a new entry to the `websiteConfigs` object:

```javascript
'example.com': {
  selectors: [
    '.selector1',
    '.selector2'
  ]
}
```

3. Update the `matches` pattern in `manifest.json` to include the new website:

```json
"content_scripts": [
  {
    "matches": [
      "*://*.engnovate.com/*",
      "*://*.example.com/*"
    ],
    "js": ["content.js"]
  }
]
```

4. Add the new website to the `supportedWebsites` array in `background.js`:

```javascript
const supportedWebsites = ['engnovate.com', 'example.com'];
```

## Current Supported Websites

- engnovate.com
  - Removes: announcement-bar, entry-content, ielts-reading-comment-section, site-footer

## Contributing

Feel free to submit issues and enhancement requests!

## Permissions

This extension requires the following permissions:
- `activeTab`: To interact with the current tab
- `storage`: To store extension settings
- `notifications`: To show notifications for unsupported websites
