import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	const commandPrefix = 'vscode-changelogmanager.';
	let workspace: vscode.Uri;

	suiteSetup(async function () {
		this.timeout(20000);
		const extension = vscode.extensions.getExtension('carlocardella.vscode-changelogmanager');
		assert.ok(extension);
		await extension.activate();
		assert.ok(vscode.workspace.workspaceFolders?.length, 'Tests require an isolated workspace');
		workspace = vscode.workspace.workspaceFolders[0].uri;
	});

	teardown(async () => {
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
		for (const name of ['CHANGELOG.md', 'CHANGELOG.txt', 'selected-CHANGELOG.md', 'selected-CHANGELOG.txt']) {
			try {
				await vscode.workspace.fs.delete(vscode.Uri.joinPath(workspace, name), { recursive: true });
			} catch (error) {
				if (!(error instanceof vscode.FileSystemError) || error.code !== 'FileNotFound') {
					throw error;
				}
			}
		}
	});

	test('Registers all contributed commands', async () => {
		const commands = await vscode.commands.getCommands(true);
		for (const name of ['initMarkdownChangelog', 'initPlainTextChangelog', 'askFolderMarkdownChangelog', 'askFolderPlainTextChangelog']) {
			assert.ok(commands.includes(commandPrefix + name), name);
		}
	});

	for (const [command, filename, language] of [
		['initMarkdownChangelog', 'CHANGELOG.md', 'markdown'],
		['initPlainTextChangelog', 'CHANGELOG.txt', 'plaintext']
	]) {
		test(`Creates a full ${language} changelog`, async function () {
			this.timeout(20000);
			await vscode.commands.executeCommand(commandPrefix + command);
			const uri = vscode.Uri.joinPath(workspace, filename);
			const document = await vscode.workspace.openTextDocument(uri);
			assert.strictEqual(document.languageId, language);
			assert.ok(document.getText().includes('All notable changes to this project'));
			assert.ok(document.getText().includes('[Unreleased]'));
			for (const section of ['Added', 'Changed', 'Fixed', 'Deprecated', 'Removed', 'Security']) {
				assert.ok(document.getText().includes(section), section);
			}
			assert.ok(!document.getText().includes('$CURRENT_YEAR'));
			assert.ok(!document.getText().includes('${2:version}'));
			assert.ok(await document.save(), 'Changelog should save successfully');
			assert.strictEqual(Buffer.from(await vscode.workspace.fs.readFile(uri)).toString(), document.getText());
		});

		test(`Does not overwrite an existing ${language} changelog`, async () => {
			const uri = vscode.Uri.joinPath(workspace, filename);
			const original = Buffer.from('Existing changelog content');
			await vscode.workspace.fs.writeFile(uri, original);
			await vscode.commands.executeCommand(commandPrefix + command);
			assert.deepStrictEqual(Buffer.from(await vscode.workspace.fs.readFile(uri)), original);
		});
	}

	for (const [command, filename] of [
		['askFolderMarkdownChangelog', 'CHANGELOG.md'],
		['askFolderPlainTextChangelog', 'CHANGELOG.txt']
	]) {
		test(`Creates ${filename} in the selected folder`, async function () {
			this.timeout(20000);
			const selectedFolder = vscode.Uri.joinPath(workspace, 'selected-' + filename);
			await vscode.workspace.fs.createDirectory(selectedFolder);
			const original = vscode.window.showOpenDialog;
			let prompted = false;
			vscode.window.showOpenDialog = async options => {
				prompted = true;
				assert.strictEqual(options?.canSelectFiles, false);
				assert.strictEqual(options?.canSelectFolders, true);
				return [selectedFolder];
			};
			try {
				await vscode.commands.executeCommand(commandPrefix + command);
				assert.ok(prompted);
				const uri = vscode.Uri.joinPath(selectedFolder, filename);
				const document = await vscode.workspace.openTextDocument(uri);
				assert.ok(document.getText().includes('All notable changes to this project'));
				assert.ok(document.getText().includes('Security'));
				assert.ok(await document.save(), 'Selected-folder changelog should save successfully');
				assert.strictEqual(Buffer.from(await vscode.workspace.fs.readFile(uri)).toString(), document.getText());
			} finally {
				vscode.window.showOpenDialog = original;
			}
		});

		test(`Cancelling ${command} creates no file`, async () => {
			const original = vscode.window.showOpenDialog;
			let prompted = false;
			vscode.window.showOpenDialog = async () => {
				prompted = true;
				return undefined;
			};
			try {
				await vscode.commands.executeCommand(commandPrefix + command);
				assert.ok(prompted);
				assert.ok(!(await vscode.workspace.fs.readDirectory(workspace)).some(([name]) => name === filename));
			} finally {
				vscode.window.showOpenDialog = original;
			}
		});
	}
});
