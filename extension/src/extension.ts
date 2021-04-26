import { TokenManager } from './TokenManager';
import * as vscode from 'vscode';
import axios from 'axios';
import SharedLinksPanel from './sharedLinks';
import githubAuthentication from './githubAuthentication';
import { apiBaseUrl } from './constants';
const FormData = require('form-data');

const OPEN_URL_OPTION = 'Open URL';

const pipfiApiCall = async(documentText:string,accessToken:string | undefined)=>{
	let formData = new FormData();
	formData.append('paste', documentText);
	const headers = formData.getHeaders();

	try{
		let input = await vscode.window.showInputBox({placeHolder: "Enter info about code."});
		if(!input) {input = "";};

		const apiResponse = await axios.post("https://p.ip.fi/",formData,{headers});
		await vscode.env.clipboard.writeText(apiResponse.data);
		try{
			await axios.post(`${apiBaseUrl}/addLink`,{
				title: input,
				url: apiResponse.data,
				description:""
			},{
				headers: {
					authorization: `Bearer ${accessToken}`,
				}
			});
		}catch(err){
			console.log(err,'error while making api call to server');
		}
		const selection = await vscode.window.showInformationMessage(("URL copied to clipboard.\n" + apiResponse.data),OPEN_URL_OPTION);
		if(selection === OPEN_URL_OPTION){
			vscode.env.openExternal(vscode.Uri.parse(apiResponse.data));
		}
	}catch(err){
		console.log(err,'error while making post request of p.ip.fi');
		vscode.window.showErrorMessage("Error while sharing your code in p.ip.fi.");
	}
};

export function activate(context: vscode.ExtensionContext) {
	TokenManager.globalState = context.globalState;

	context.subscriptions.push(vscode.commands.registerCommand('pipfi--code-share-.githubAuth', async () => {
		await githubAuthentication(() => {
			if(SharedLinksPanel._webview)
			{SharedLinksPanel._webview.postMessage({
				type: "token",
				value: TokenManager.getToken(),
			});}
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('pipfi--code-share-.shareCode', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {return;}

		let document = editor.document;
		const documentText = document.getText();
		pipfiApiCall(documentText,TokenManager.getToken());
	}));

	context.subscriptions.push(vscode.commands.registerCommand('pipfi--code-share-.shareSelectedCode',async ()=>{
		const editor = vscode.window.activeTextEditor;
		if (!editor) {return;}

		let document = editor.document;
		const selection = editor.selection;
		const documentText = document.getText(selection);
		pipfiApiCall(documentText,TokenManager.getToken());
	}));

	context.subscriptions.push(vscode.commands.registerCommand('pipfi--code-share-.sharedLinks',async ()=>{
		SharedLinksPanel.createOrShow(context.extensionUri);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('pipfi--code-share-.refreshWebView',async ()=>{
		SharedLinksPanel.kill();
		SharedLinksPanel.createOrShow(context.extensionUri);
	}));

}

// this method is called when your extension is deactivated
export function deactivate() {}
