# Obsidian Gyazo Plugin

![Image from Gyazo](https://t.gyazo.com/teams/nota/c3c3b3f2f0ce08a659a18e89639b5354.png)

This plugin integrates Gyazo with Obsidian, allowing you to view and embed your Gyazo captures directly in your notes.

## Features

-   View your Gyazo captures in a dedicated sidebar
-   Embed images and videos in your notes with a single click
-   Drag and drop captures into your notes
-   Copy markdown for images and videos
-   Right-click context menu with additional options
-   Support for both free and Pro Gyazo accounts
-   Internationalization support (English and Japanese)

## Installation

1. Download the latest release from the Releases section
2. Extract the zip file in your Obsidian vault's `.obsidian/plugins/` directory
3. Run `npm ci` to install dependencies
4. Run `npm run build` to compile the plugin
5. Enable the plugin in Obsidian settings

## Usage

### Setup

1. Get your Gyazo API access token from [Gyazo API](https://gyazo.com/api)
2. Open the plugin settings and enter your access token
3. Select your preferred language (English or Japanese)
4. If you have a Gyazo Pro account, enable the Pro option

### Viewing Captures

1. Click Gyazo icon in the left ribbon to open the Gyazo captures view
2. Your captures will be displayed as a grid of thumbnails in the right sidebar

### Embedding Captures

-   **Click**: Click on a capture to embed it at the current cursor position
-   **Drag & Drop**: Drag a capture from the sidebar and drop it into your note
-   **Hover & Copy**: Hover over a capture to reveal a copy button that copies the markdown

### Context Menu

Right-click on a capture to access additional options:

-   Copy URL
-   Open in Browser
-   For videos: Copy GIF Markdown or MP4 Markdown

### Free vs Pro

-   Free users can interact with their 10 most recent captures
-   Pro users can access all captures (up to 100)

## Releasing new releases

-   Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
-   Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
-   Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
-   Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
-   Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`

## Adding your plugin to the community plugin list

-   Check the [plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines).
-   Publish an initial version.
-   Make sure you have a `README.md` file in the root of your repo.
-   Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.

## How to use

-   Clone this repo.
-   Make sure your NodeJS is at least v16 (`node --version`).
-   `npm i` or `yarn` to install dependencies.
-   `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

-   Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

## Improve code quality with eslint (optional)

-   [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code.
-   To use eslint with this project, make sure to install eslint from terminal:
    -   `npm install -g eslint`
-   To use eslint to analyze this project use this command:
    -   `eslint main.ts`
    -   eslint will then create a report with suggestions for code improvement by file and line number.
-   If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
    -   `eslint .\src\`

## Pricing & Plans URL

https://gyazo.com/pricing

## API Documentation

See https://github.com/obsidianmd/obsidian-api

## License

This project is licensed under the GNU GPL v3.0 - see the [LICENSE](https://raw.githubusercontent.com/nota/gyazo-obsidian-plugin/master/LICENSE) file for details.
