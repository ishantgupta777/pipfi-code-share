"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const axios_1 = require("axios");
const sharedLinks_1 = require("./sharedLinks");
const FormData = require('form-data');
const OPEN_URL_OPTION = 'Open URL';
const pipfiApiCall = (documentText) => __awaiter(void 0, void 0, void 0, function* () {
    let formData = new FormData();
    formData.append('paste', documentText);
    const headers = formData.getHeaders();
    try {
        const apiResponse = yield axios_1.default.post("https://p.ip.fi/", formData, { headers });
        yield vscode.env.clipboard.writeText(apiResponse.data);
        const selection = yield vscode.window.showInformationMessage(("URL copied to clipboard.\n" + apiResponse.data), OPEN_URL_OPTION);
        if (selection === OPEN_URL_OPTION) {
            vscode.env.openExternal(vscode.Uri.parse(apiResponse.data));
        }
    }
    catch (err) {
        console.log(err, 'error while making post request of p.ip.fi');
        vscode.window.showErrorMessage("Error while sharing your code in p.ip.fi.");
    }
});
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('pipfi--code-share-.shareCode', () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let document = editor.document;
        const documentText = document.getText();
        pipfiApiCall(documentText);
    })));
    context.subscriptions.push(vscode.commands.registerCommand('pipfi--code-share-.shareSelectedCode', () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let document = editor.document;
        const selection = editor.selection;
        const documentText = document.getText(selection);
        pipfiApiCall(documentText);
    })));
    context.subscriptions.push(vscode.commands.registerCommand('pipfi--code-share-.sharedLinks', () => __awaiter(this, void 0, void 0, function* () {
        sharedLinks_1.default.createOrShow(context.extensionUri);
    })));
    context.subscriptions.push(vscode.commands.registerCommand('pipfi--code-share-.refreshWebView', () => __awaiter(this, void 0, void 0, function* () {
        sharedLinks_1.default.kill();
        sharedLinks_1.default.createOrShow(context.extensionUri);
    })));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
