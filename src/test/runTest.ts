import * as path from 'path';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';

import { runTests } from '@vscode/test-electron';

async function main() {
	const workspace = await mkdtemp(path.join(tmpdir(), 'changelog-manager-test-'));
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		// The path to test runner
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		// Download VS Code, unzip it and run the integration test
		await runTests({
			extensionDevelopmentPath,
			extensionTestsPath,
			launchArgs: [workspace, '--disable-extensions', '--skip-welcome', '--skip-release-notes', '--disable-workspace-trust']
		});
	} catch (err) {
		console.error('Failed to run tests', err);
		process.exitCode = 1;
	} finally {
		await rm(workspace, { recursive: true, force: true });
	}
}

main();
