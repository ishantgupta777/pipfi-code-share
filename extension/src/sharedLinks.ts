import { TokenManager } from './TokenManager';
import * as vscode from 'vscode';
import { apiBaseUrl } from './constants';
import githubAuthentication from './githubAuthentication';

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,

		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media'),vscode.Uri.joinPath(extensionUri, 'out/compiled')]
	};
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

class SharedLinksPanel {
	public static currentPanel: SharedLinksPanel | undefined;

	public static readonly viewType = 'sharedLinks';

	private readonly _panel: vscode.WebviewPanel;
	public static _webview: vscode.Webview | undefined;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (SharedLinksPanel.currentPanel) {
			SharedLinksPanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			SharedLinksPanel.viewType,
			'Pipfi (Code Share)',
			column || vscode.ViewColumn.One,
			getWebviewOptions(extensionUri),
		);

		SharedLinksPanel.currentPanel = new SharedLinksPanel(panel, extensionUri);
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		SharedLinksPanel.currentPanel = new SharedLinksPanel(panel, extensionUri);
	}

	public static kill() {
    SharedLinksPanel.currentPanel?.dispose();
    SharedLinksPanel.currentPanel = undefined;
  }

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;
		this._extensionUri = extensionUri;
		SharedLinksPanel._webview = undefined;

		// Set the webview's initial html content
		this._update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programmatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// // Update the content based on view changes
		// this._panel.onDidChangeViewState(
		// 	e => {
		// 		if (this._panel.visible) {
		// 			this._update();
		// 		}
		// 	},
		// 	null,
		// 	this._disposables
		// );

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.type) {
					case 'get-token':
						if(SharedLinksPanel._webview)
						{SharedLinksPanel._webview.postMessage({type: 'token',value: TokenManager.getToken()});}
						return;
					case "logout": {
						TokenManager.setToken("");
						break;
					}
					case "authenticate": {
						githubAuthentication(() => {
							if(SharedLinksPanel._webview)
							{SharedLinksPanel._webview.postMessage({
								type: "token",
								value: TokenManager.getToken(),
							});}
						});
						break;
					}
				}
			},
			null,
			this._disposables
		);
	}

	public dispose() {
		SharedLinksPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _update() {
		const webview = this._panel.webview;
		this._panel.webview.html = this._getHtmlForWebview(webview);

		// Vary the webview's content based on where it is located in the editor.
		switch (this._panel.viewColumn) {
			default:
				return;
		}
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		SharedLinksPanel._webview = webview;
		// Local path to main script run in the webview
		const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'out/compiled', 'SharedLinks.js');

		// And the uri we use to load this script in the webview
		const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

		// Local path to css styles
		const styleResetPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css');
		const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css');

		// Uri to load styles into webview
		const stylesResetUri = webview.asWebviewUri(styleResetPath);
		const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);

		// Use a nonce to only allow specific scripts to be run
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${
          webview.cspSource
        }; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">
				<script nonce="${nonce}">
				const tsvscode = acquireVsCodeApi();
				const apiBaseUrl = ${JSON.stringify(apiBaseUrl)}
				const accessToken = ${JSON.stringify(TokenManager.getToken())}
				</script>
				<title>Pipfi (Share code)</title>
			</head>
			<body>
			</body>
			<script nonce="${nonce}" src="${scriptUri}"></script>
			</html>`;
	}
}

export default SharedLinksPanel;