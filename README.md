# NeoFeeder CORS Bridge

A browser extension that bypasses CORS restrictions for NeoFeeder API connections. This extension allows the NeoFeeder Bridge web application to connect to NeoFeeder servers running on different origins.

## What is This?

NeoFeeder Bridge is a client-side web application for bulk data import to NeoFeeder PDDikti. Since NeoFeeder servers are typically on different origins (localhost, local network, or different domains), browsers block these requests due to CORS policy.

This extension solves that by adding CORS headers to NeoFeeder API responses.

## Features

- **CORS Bypass** - Enables cross-origin requests to NeoFeeder API servers
- **Toggle On/Off** - Quickly enable or disable CORS bypass
- **Custom Origins** - Add your own server URLs through the popup

## Default Origins

The extension comes with these defaults:

- `http://localhost:8100/*`
- `http://localhost:3003/*`
- `http://127.0.0.1:8100/*`
- `http://127.0.0.1:3003/*`

Add your NeoFeeder server URL through the popup if needed.

## Installation

### Load Unpacked (Development/Manual)

#### Chrome / Edge

1. Go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `dist/extension/` folder

## Building

```bash
cd neofeeder-bridge-extension
chmod +x build.sh
./build.sh
```

Output: `dist/neofeeder-bridge-chrome.zip`

## Usage

1. Click the extension icon in your browser toolbar
2. Ensure "Enable CORS Bypass" is toggled ON
3. To add your NeoFeeder server:
   - Enter URL pattern (e.g., `http://192.168.1.100:3003/*`)
   - Click "Add"
4. Click "Reset to Defaults" to restore original settings

## File Structure

```
neofeeder-bridge-extension/
├── background.js           # Service worker - handles CORS rules
├── manifest.chrome.json   # Chrome manifest (Manifest V3)
├── rules.json             # Static CORS rules (unused, dynamic used)
├── icons/
│   ├── icon.svg           # SVG icon source
│   ├── icon-16.png        # 16x16 icon
│   ├── icon-32.png        # 32x32 icon
│   ├── icon-48.png        # 48x48 icon
│   └── icon-128.png       # 128x128 icon
├── popup/
│   ├── popup.html         # Popup UI
│   ├── popup.js           # Popup logic
│   └── popup.css          # Popup styles
├── _locales/
│   └── id/
│       └── messages.json  # Localization strings
├── build.sh               # Build script
├── README.md              # This file
└── LICENSE                # MIT license
```

## Browser Compatibility

- Chrome 120+
- Edge (Chromium-based)

## Permissions

- `declarativeNetRequest` - Modify network requests to add CORS headers
- `storage` - Save user configuration locally

## Security

- No data collection or tracking
- Open source - anyone can audit
- User-controlled configuration
- Minimal permissions required

## License

MIT
