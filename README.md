# Changelog Manager 📝

<!-- ![.github/workflows/BuildAndPublish.yml](https://github.com/carlocardella/vscode-ChangelogManager/workflows/.github/workflows/BuildAndPublish.yml/badge.svg?branch=master) -->
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/carlocardella.vscode-changelogmanager)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/carlocardella.vscode-changelogmanager)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/carlocardella.vscode-changelogmanager)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/carlocardella.vscode-changelogmanager)
[![GitHub issues](https://img.shields.io/github/issues/carlocardella/vscode-ChangelogManager.svg)](https://github.com/carlocardella/vscode-ChangelogManager/issues)
[![GitHub license](https://img.shields.io/github/license/carlocardella/vscode-ChangelogManager.svg)](https://github.com/carlocardella/vscode-ChangelogManager/blob/master/LICENSE.md)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/carlocardella/vscode-ChangelogManager.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fcarlocardella%2Fvscode-ChangelogManager)
<!-- [![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/carlocardella/vscode-changelogmanager) -->

This [Visual Studio Code](https://code.visualstudio.com/) extension helps to build a changelog for your project, either in markdown or plain text files. The changelog format follows [Keep a changelog](https://keepachangelog.com/).

Requires Visual Studio Code 1.140 or newer.

For markdown files I suggest to enable `quickSuggestions` (disabled by default for markdown files):

```json
// Configure settings to be overridden for [markdown] language.
"[markdown]":  {
  "editor.quickSuggestions": true
}
```

## Commands

Initialize a new full changelog in the workspace or open folder root; if there is no folder open, prompt the user to ask for a folder where to store the new changelog file

* `Initialize full markdown ChangeLog`
* `Initialize full plaintext ChangeLog`

Allow to select the folder where to create the changelog

* `Initialize full markdown ChangeLog in folder...`
* `Initialize full plaintext ChangeLog in folder...`

## Development

Use Node.js 24 LTS (`nvm use`) and npm. The development toolchain requires a
supported Node.js release; Node.js 16 and 23 are not supported.

```sh
npm ci
npm audit
npm run lint
npm test
```

`npm test` builds the production extension, compiles the tests, and runs them in
a downloaded VS Code instance with an isolated temporary workspace. On headless
Linux, run `xvfb-run -a npm test`. `npm run webpack-dev` watches the extension
bundle; `npm run unit-tests` watches test compilation for the VS Code debugger.

TypeScript stays on the latest compatible 6.x release while typescript-eslint
requires TypeScript below 6.1. Dependency overrides keep transitive `glob` and
`minimatch` on patched releases until their consumers update their requirements.
