import * as vscode from 'vscode';
import axios from 'axios';
const FormData = require('form-data');

const OPEN_URL_OPTION = 'Open URL';

const pipfiApiCall = async(documentText:string)=>{
	let formData = new FormData();
	formData.append('paste', documentText);
	const headers = formData.getHeaders();

	try{
		const apiResponse = await axios.post("https://p.ip.fi/",formData,{headers});
		await vscode.env.clipboard.writeText(apiResponse.data);
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

	context.subscriptions.push(vscode.commands.registerCommand('pipfi--code-share-.shareCode', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {return;}

		let document = editor.document;
		const documentText = document.getText();
		pipfiApiCall(documentText);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('pipfi--code-share-.shareSelectedCode',async ()=>{
		const editor = vscode.window.activeTextEditor;
		if (!editor) {return;}

		let document = editor.document;
		const selection = editor.selection;
		const documentText = document.getText(selection);
		pipfiApiCall(documentText);
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}
