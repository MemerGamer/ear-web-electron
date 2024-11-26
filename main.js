const { app, BrowserWindow, Menu, dialog } = require("electron");
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
    async (event, portList, webContents, callback) => {
      console.log("Available serial ports:", portList);

      // Add listeners for serial ports being added or removed
      mainWindow.webContents.session.on("serial-port-added", (event, port) => {
        console.log("Serial port added:", port);
      });

      mainWindow.webContents.session.on(
        "serial-port-removed",
        (event, port) => {
          console.log("Serial port removed:", port);
        }
      );

      event.preventDefault(); // Prevent the default behavior of the event

      if (portList && portList.length > 0) {
        // TODO: refactor device name, get from bluetooth devices directly not from port
        // Create an array of display names: Device Name (Port Name)
        const portNames = portList.map((port) => {
          const deviceName = port.deviceName || "Unknown Device"; // Use `deviceName` if available
          const portName = port.portName || "Unknown Port"; // Fallback if no port name
          return `${deviceName} (${portName})`;
        });

        // Show a dialog for the user to select a device
        const { response } = await dialog.showMessageBox(mainWindow, {
          type: "question",
          buttons: [...portNames, "Cancel"],
          title: "Select Bluetooth Headset",
          message:
            "Please select the Bluetooth headset you want to connect to:",
          cancelId: portNames.length, // Index of the Cancel button
        });

        if (response < portNames.length) {
          // The user selected a valid device
          const selectedPort = portList[response];
          console.log("User selected:", selectedPort);
          callback(selectedPort.portId);
        } else {
          // The user canceled the selection
          console.log("User canceled device selection");
          callback(""); // No device selected
        }
      } else {
        dialog.showMessageBoxSync(mainWindow, {
          type: "warning",
          title: "No Devices Found",
          message:
            "No Bluetooth devices were found. Please ensure your headset is discoverable.",
        });
        callback(""); // No devices to select
      }
    }
  );

  // Set permission check handler for serial port access
  mainWindow.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      if (permission === "serial" && details.securityOrigin === "file:///") {
        return true; // Allow access if the security origin is file://
      }
      return false; // Deny access otherwise
    }
  );

  // Set device permission handler for serial devices
  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === "serial" && details.origin === "file://") {
      return true; // Allow access to serial devices from local files
    }
    return false; // Deny access otherwise
  });

  // Load the main HTML file
  mainWindow.loadFile(
    path.join(__dirname, "../../resources/res", "index.html")
  );

  // Uncomment this to open DevTools by default
  mainWindow.webContents.openDevTools();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
