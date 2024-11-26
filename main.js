const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

let mainWindow;

app.on("ready", () => {
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      experimentalFeatures: true,
      preload: path.join(__dirname, "preload.js"), // Optional, for communication with renderer
    },
  });

  // Handle the select-serial-port event
  mainWindow.webContents.session.on(
    "select-serial-port",
    (event, portList, webContents, callback) => {
      console.log("Available serial ports:", portList);

      // Add listeners for serial ports being added or removed
      mainWindow.webContents.session.on("serial-port-added", (event, port) => {
        console.log("Serial port added:", port);
      });

      mainWindow.webContents.session.on(
        "serial-port-removed",
        (event, port) => {
          console.log("Serial port removed:", port);
        },
      );

      event.preventDefault(); // Prevent the default behavior of the event

      // If there are available serial ports, pass the first one back to the callback
      if (portList && portList.length > 0) {
        callback(portList[0].portId); // Select the first available port
      } else {
        callback(""); // No matching devices found
      }
    },
  );

  // Set permission check handler for serial port access
  mainWindow.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      if (permission === "serial" && details.securityOrigin === "file:///") {
        return true; // Allow access if the security origin is file://
      }
      return false; // Deny access otherwise
    },
  );

  // Set device permission handler for serial devices
  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === "serial" && details.origin === "file://") {
      return true; // Allow access to serial devices from local files
    }
    return false; // Deny access otherwise
  });

  // Load the main HTML file
  mainWindow.loadFile(path.join(__dirname, "../../resources/res", "index.html"));

  // Uncomment this to open DevTools by default
  // mainWindow.webContents.openDevTools();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
