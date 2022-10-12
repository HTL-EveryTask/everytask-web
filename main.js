const { app, BrowserWindow, Menu, Tray } = require("electron");
const path = require("path");

let mainWindow = null;
let isQuitting;
let tray;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { preload: path.join(__dirname, "preload.js") },
  });
  win.loadFile("dist/index.html");
  mainWindow = win;
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  mainWindow.on("close", function (event) {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      event.returnValue = false;
    }
  });

  tray = new Tray("dist/favicon.ico");

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Show App",
        click: function () {
          mainWindow.show();
        },
      },
      {
        label: "Quit",
        click: function () {
          isQuitting = true;
          app.quit();
        },
      },
    ])
  );
});

app.on("before-quit", function () {
  isQuitting = true;
});
