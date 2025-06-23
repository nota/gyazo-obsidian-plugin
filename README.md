# Gyazo viewer for Obsidian

This Obsidian plugin integrates with Gyazo, allowing you to view and embed your Gyazo captures directly in your notes. Gyazo is a screenshot and image sharing service that makes capturing and sharing visual information quickly and easily.

[![Image from Gyazo](https://t.gyazo.com/teams/nota/4ac0c420da3f52e9d87f8c2db6bdbe8b.gif)](https://nota.gyazo.com/4ac0c420da3f52e9d87f8c2db6bdbe8b)

## Features

- **Sidebar Gallery**: View your Gyazo captures in a dedicated sidebar
- **Drag & Drop Embedding**: Drag images directly into your notes
- **Markdown Copying**: Copy markdown for images with hover actions
- **Context Menu Options**: Right-click on captures for additional actions
- **Detail View**: View captures with their metadata including OCR
- **Free & Pro Support**: Works with both free and Pro Gyazo accounts
  - Free accounts can access the latest 10 captures
  - Pro accounts can access up to 100
- **Internationalization**: Full support for English and Japanese interfaces

## Installation

### From Community Plugins (Recommended)

1. Open Obsidian Settings > Community Plugins.
2. Ensure "Restricted mode" is off.
3. Click Browse community plugins.
4. Search for "Gyazo Viewer".
5. Click Install.
6. Once installed, click Enable.

### Manual Installation

1. Download the latest release files (`main.js`, `manifest.json`, `styles.css`) from the [Releases page](https://github.com/nota/gyazo-obsidian-plugin/releases/latest).
2. Navigate to your Obsidian vault's plugins folder: `YourVault/.obsidian/plugins/`.
3. Create a new folder named `gyazo-obsidian-plugin`.
4. Copy the downloaded `main.js`, `manifest.json`, and `styles.css` files into this new folder.
5. Reload Obsidian (Ctrl/Cmd+R or close and reopen).
6. Go to settings > Community plugins, find "Gyazo Viewer", and enable it.

## Configuration

After installing and enabling the plugin, you need to configure it:

1. Generate API Token:
   - Visit [Gyazo API](https://gyazo.com/api) and sign in to your Gyazo account.
   - Create a new application, then generate a new access token.
   - Copy your access token.

2. Obsidian settings:
   - Go to Settings > Gyazo Viewer.
   - Paste your access token in the Access Token field.
   - Select your preferred language (English or Japanese).
   - Configure display options like image width and permalink links.

### Security Note

Your Gyazo access token allows access to your Gyazo captures. The token is stored locally in your Obsidian vault and is not shared with any third parties.

## Usage

### Sidebar Grid View

1. Click the Gyazo icon in the left ribbon to open the captures view.
2. Your captures will appear as a grid of thumbnails in the right sidebar.
3. Hover over captures to see copy options.
4. Refresh your captures by clicking the refresh button at the top of the sidebar.

### Embedding Captures

- **Drag & Drop**: Drag a capture from the sidebar and drop it into your note.
- **Copy Markdown**: Hover over a capture and click the copy button to copy its markdown.

### Context Menu

Right-click on a capture to access additional options:
- Copy URL
- Open in Browser

### Free vs Pro Account Differences

- Free Gyazo users can access their 10 most recent captures
- Pro users can access up to 100 captures with full functionality

## Development

### Setup

1. Clone this repo.
2. Make sure your NodeJS is at least v22 (`node --version`).
3. `npm ci` to install dependencies.
4. `npm run dev` to start compilation in watch mode.

### Build

- `npm run build` - Builds the production version.
- `npm run lint` - Checks code quality with ESLint.

## License

This project is licensed under the GNU GPL v3.0 - see the [LICENSE](https://raw.githubusercontent.com/nota/gyazo-obsidian-plugin/master/LICENSE) file for details.
