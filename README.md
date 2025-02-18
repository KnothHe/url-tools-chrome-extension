# README.md

# URL Parser Chrome Extension

This project is a Chrome extension that allows users to input a URL, parse its parameters, and manipulate the URL in various ways. The extension provides a user-friendly interface for managing URLs, including features to remove UTM parameters and open modified URLs in different tabs.

## Features

- Input field for entering a URL
- Parsing of URL parameters with a user-friendly display
- Action buttons for opening modified URLs and clearing input
- Preview of the modified URL
- Clipboard access to read URLs directly from the clipboard
- Support for removing UTM parameters from URLs
- Persistent storage for user preferences and settings
- Multi-language support (English and Chinese)
- Light and dark theme support

## Technologies Used

- TypeScript
- React
- TailwindCSS
- Shadcn UI
- Vite

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/KnothHe/url-tools-chrome-extension.git
   ```

2. Navigate to the project directory:
   ```
   cd url-tools-chrome-extension
   ```

3. Install the dependencies:
   ```
   pnpm install
   ```

## Development

To start the development server, run:
```
pnpm run dev
```

This will launch the application in development mode.

## Building for Production

To build the extension for production, run:
```
pnpm run build
```

This will create a production-ready version of the extension in the `dist` folder.

## Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" in the top right corner.
3. Click on "Load unpacked" and select the `dist` folder of the project.
4. The extension should now be loaded and ready to use.

## Usage

- Click on the extension icon to open the popup.
- Enter a URL in the input field.
- The extension will parse the URL and display its parameters.
- Use the action buttons to manipulate the URL as needed.

### Storage
The extension automatically saves your preferences and settings using Chrome's storage API. Your data is stored locally in your browser.

### Multi-language Support
The extension supports both English and Chinese. You can also manually change the language in the options page.

### Theme Support
The extension supports both light and dark themes. You can manually change the theme in the options page.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
