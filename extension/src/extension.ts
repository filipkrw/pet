import * as vscode from "vscode";
import * as os from "os";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "pet.createSnippet",
    async () => {
      let config: any = vscode.workspace.getConfiguration().get("pet");

      if (!config.basePath) {
        const basePath = await vscode.window.showInputBox({
          prompt: "Specify snippets base path",
          placeHolder: "Base Path",
          value: path.join(os.homedir(), "snippets"),
        });
        if (basePath) {
          await vscode.workspace
            .getConfiguration()
            .update("pet.basePath", path.normalize(basePath), true);
          config = vscode.workspace.getConfiguration().get("pet");
        } else {
          vscode.window.showErrorMessage(
            "You need to specify base path to create new snippets."
          );
          return;
        }
      }

      const relativePath = await vscode.window.showInputBox({
        placeHolder: "Snippet Path",
      });
      if (relativePath) {
        const uri = path.join(config.basePath, relativePath);
        try {
          const doc = await vscode.workspace.openTextDocument(
            vscode.Uri.file(uri).with({ scheme: "untitled" })
          );
          await vscode.window.showTextDocument(doc);
        } catch (error) {
          vscode.window.showErrorMessage(
            "Snippet on this path already exists."
          );
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
