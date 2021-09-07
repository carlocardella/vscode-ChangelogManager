// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('"vscode-changelogmanager" is active');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "vscode-changelogmanager.initMarkdownChangelog",
            () => {
                initMarkdownChangelog("markdown");
            }
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "vscode-changelogmanager.initPlainTextChangelog",
            () => {
                initMarkdownChangelog("plaintext");
            }
        )
    );
}

// this method is called when your extension is deactivated
export function deactivate() {}

async function initMarkdownChangelog(languageId: string) {
    let workspaceFolder: string | undefined =
        vscode.workspace.workspaceFolders![0].uri.fsPath;
    // no folder or workspace open, ask the user where to create the changelog file
    if (!workspaceFolder) {
        workspaceFolder = await askForFolder();
    }
    if (!workspaceFolder) {
        return;
    }

    let changelogFileName =
        languageId === "markdown" ? "CHANGELOG.md" : "CHANGELOG.txt";
    let uri = vscode.Uri.file(path.join(workspaceFolder, changelogFileName));

    if (!(await checkIfChangelogExists(uri))) {
        vscode.workspace.fs.writeFile(uri, new Uint8Array()).then((_) => {
            vscode.workspace.openTextDocument(uri).then((doc) => {
                vscode.window.showTextDocument(doc).then(() => {
                    vscode.commands.executeCommand(
                        "editor.action.insertSnippet",
                        {
                            langId: languageId,
                            name: "Changelog Initialize Full",
                        }
                    );
                });
            });
        });
    } else {
        vscode.window.showErrorMessage(
            `Changelog file ${uri.fsPath} already exists. Please delete it first.`
        );
    }
}

async function askForFolder(): Promise<string | undefined> {
    const folderPath = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        title: "Select a folder to initialize a changelog",
    });

    if (folderPath) {
        return Promise.resolve(folderPath[0].fsPath);
    } else {
        return Promise.reject();
    }
}

function checkIfChangelogExists(uri: vscode.Uri) {
    return vscode.workspace.fs.stat(uri).then((stat) => {
        if (stat.type === vscode.FileType.File) {
            return true;
        } else {
            return false;
        }
    });
}
