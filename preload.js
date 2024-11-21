const { contextBridge } = require("electron");
const path = require("path");
contextBridge.exposeInMainWorld("api", {
  sendMessage: (msg) => console.log(msg),
  navigate: (givenPath) => {
    // window.location.href = `${path}.html`;
    path.join(__dirname, `../res/${givenPath}.html`);
  },
});
