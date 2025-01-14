'use strict';

import * as vscode from 'vscode';
import CscopeExecutor from './CscopeExecutor';
import FindResultDoc from './FindResultDoc';

export default class SearchResultProvider implements
            vscode.TextDocumentContentProvider, vscode.DocumentLinkProvider{
    private executor:CscopeExecutor = null;

    constructor (executor : CscopeExecutor){
        this.executor = executor;
    }

    dispose() {
    }

    static scheme = "search";

    private async getDoc(uri: vscode.Uri) : Promise<FindResultDoc>{
        let resultDoc = null;

        const [briefText, symbol, functionIndex, cacheBreaker] = <[string, string, number, number]>JSON.parse(uri.query);
        const fileList = await this.executor.runSearch(symbol, functionIndex);
        resultDoc = new FindResultDoc(uri, fileList);

        return resultDoc;
    }

    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string>{

        return new Promise( (resolve, reject) => {
            this.getDoc(uri).then((resultDoc)=>{
                resolve(resultDoc.getDocContent());
            });
        });
    }

    provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]>{
        return new Promise( (resolve, reject) => {
            this.getDoc(document.uri).then((resultDoc)=>{
                resolve(resultDoc.getDocLinks());
            });
        });
    }

    resolveDocumentLink(link: any, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink> {
        const lineInfo : any = link.lineInfo;
        const uri : vscode.Uri = vscode.Uri.file(lineInfo.fileName);
        const viewColumn = vscode.window.activeTextEditor.viewColumn + 1;
        vscode.window.showTextDocument(uri, {viewColumn:viewColumn, preserveFocus:false, preview:false}).then(editor => {
            // positions are zero based for both line no. and col. no.
            const pos = new vscode.Position(lineInfo.lineNum - 1, 0);
            editor.selection = new vscode.Selection(pos, pos);
            editor.revealRange(new vscode.Range(pos, pos));
        });

        return new Promise( (resolve, reject) => {
            reject();
        });
    }

}

export function openSearch(brief:string, functionIndex:number, columnMode : boolean) {
    if (vscode.window){
        if (vscode.window.activeTextEditor){

            const position = vscode.window.activeTextEditor.selection.active;
            const document = vscode.window.activeTextEditor.document;
            const symbol = document.getText(document.getWordRangeAtPosition(position));

            vscode.window.showInputBox({ value: symbol, prompt: "Enter the text",
                                        placeHolder: "", password: false }).then( (info) => {
                if (info !== undefined && info.length > 0) {
                    const cacheBreaker = Math.floor(Math.random() * 10);
                    const query = JSON.stringify([brief, info, functionIndex, cacheBreaker]);
                    let docUri = vscode.Uri.parse(`${SearchResultProvider.scheme}:${info}.find ?${query}`);
                    let viewColumn = vscode.window.activeTextEditor.viewColumn;
                    if (columnMode)
                    {
                        viewColumn += 1;
                    }
                    return vscode.workspace.openTextDocument(docUri).then((doc) => {
                        vscode.window.showTextDocument(doc.uri, {viewColumn:viewColumn, preserveFocus:false, preview:false});
                    });

                }
            });

        }
    }
}