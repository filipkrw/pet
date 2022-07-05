import { lstat } from "fs/promises";
import { cwd } from "process";
import { ipcRenderer } from "electron";

ipcRenderer.on("main-process-message", (_event, ...args) => {
  console.log("[Receive Main-process message]:", ...args);
});

ipcRenderer.on("asynchronous-message", function (evt, message) {
  if (message?.shortcut === "CommandOrControl+X") {
    console.log("[Receive Asynchronous message]:", message);
  }
});

lstat(cwd())
  .then((stats) => {
    console.log("[fs.lstat]", stats);
  })
  .catch((err) => {
    console.error(err);
  });
