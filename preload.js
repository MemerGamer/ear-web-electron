const { contextBridge, ipcRenderer } = require("electron");
const path = require("path");

contextBridge.exposeInMainWorld("api", {
    // Dynamically construct the correct path to the HTML file
    getHtmlPath: (fileName) => {
        const basePath = path.join(__dirname, "res", "MainControl");
        return `file://${path.join(basePath, fileName)}`;
    },
    sendMessage: (msg) => console.log(msg),
});

console.log("Preload script loaded");
