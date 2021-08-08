import { Uri, window, workspace, WorkspaceEdit } from "vscode";
import * as path from "path";

/**
 * Create a new file
 * @export
 * @param {string} newFilePath File path to create
 * @return {*}  {Promise<boolean>}
 */
export async function createNewFile(newFilePath: string): Promise<boolean> {
    const uri = Uri.file(newFilePath);
    workspace.fs.writeFile(uri, new Uint8Array()).then((_) => {
        workspace.openTextDocument(uri).then((doc) => {
            // todo: add file content
            Promise.resolve(window.showTextDocument(doc));
        });
    });

    return Promise.resolve(true);
}

/**
 * Ask the user to the path and name of the new file to create.
 * @export
 * @param {boolean} [relativeToCurrentFile] Create the new file relative to the file open in the active editor
 * @param {boolean} [relativeToWorkspaceRoot] Create the file relative to the workspace root
 * @return {*}  {Promise<void>}
 */
export async function askForFilePathAndName(
    relativeToCurrentFile?: boolean,
    relativeToWorkspaceRoot?: boolean
): Promise<void> {
    let newFilePath: string = "";

    if (relativeToCurrentFile) {
        let currentFilePath = getDocumentUri()?.fsPath;
        if (!currentFilePath) {
            return Promise.reject();
        }

        let folderPath = path.parse(currentFilePath).dir;
        let fileName = await askForFilePathAndNameInternal(folderPath);
        if (!fileName) {
            return Promise.reject();
        }

        newFilePath = fileName;
    }

    if (relativeToWorkspaceRoot) {
        let workspaceFolder = getWorkspaceFolder()?.uri.fsPath;
        if (!workspaceFolder) {
            return Promise.reject();
        }

        let fileName = await askForFilePathAndNameInternal(workspaceFolder);
        if (!fileName) {
            return Promise.reject();
        }

        newFilePath = path.join(workspaceFolder, fileName);
    }

    createNewFile(newFilePath);

    return Promise.reject();
}

/**
 * Ask for new file path and name
 * @param {string} folderPath
 * @return {*}  {(Promise<string | undefined>)}
 */
async function askForFilePathAndNameInternal(
    folderPath: string
): Promise<string | undefined> {
    let fileName = await window.showInputBox({
        ignoreFocusOut: true,
        prompt: "Enter the new file name",
        value: folderPath + path.sep,
        valueSelection: [folderPath.length + 2, folderPath.length + 2],
    });

    if (!fileName) {
        return Promise.reject();
    }

    return Promise.resolve(fileName);
}

/**
 * Returns the Uri of the active document
 * @export
 * @return {*}  {(Uri | undefined)}
 */
export function getDocumentUri(): Uri | undefined {
    return window.activeTextEditor?.document.uri;
}

/**
 * Returns the active WorkspaceFolder
 * @export
 * @return {*}  {(WorkspaceFolder | undefined)}
 */
export function getWorkspaceFolder(): WorkspaceFolder | undefined {
    const fileUri = getDocumentUri();
    if (!fileUri) {
        return;
    }
    return workspace.getWorkspaceFolder(fileUri);
}
