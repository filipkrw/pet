/******/ (() => {
  // webpackBootstrap
  /******/ "use strict";
  /******/ var __webpack_modules__ = [
    ,
    /* 0 */ /* 1 */
    /***/ (module) => {
      module.exports = require("vscode");

      /***/
    },
    /* 2 */
    /***/ (module) => {
      module.exports = require("os");

      /***/
    },
    /* 3 */
    /***/ (module) => {
      module.exports = require("path");

      /***/
    },
    /******/
  ];
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    var exports = __webpack_exports__;

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deactivate = exports.activate = void 0;
    const vscode = __webpack_require__(1);
    const os = __webpack_require__(2);
    const path = __webpack_require__(3);
    function activate(context) {
      let disposable = vscode.commands.registerCommand(
        "pet.createSnippet",
        async () => {
          let config = vscode.workspace.getConfiguration().get("pet");
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
    exports.activate = activate;
    function deactivate() {}
    exports.deactivate = deactivate;
  })();

  module.exports = __webpack_exports__;
  /******/
})();
//# sourceMappingURL=extension.js.map
