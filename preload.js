const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  sendMessage: (msg) => console.log(msg),
});
