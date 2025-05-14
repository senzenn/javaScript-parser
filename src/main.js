const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { Tokenizer } = require('./tokenizer');
const { Parser } = require('./parser');
const { Interpreter } = require('./interpreter');
const { EnvironmentMonitor } = require('./environment-monitor');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'ui', 'index.html'));
  mainWindow.setMenuBarVisibility(false);
  
  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Handle code execution requests from the renderer
ipcMain.handle('execute-code', async (event, code) => {
  try {
    const engine = new MiniJSEngine();
    return engine.run(code);
  } catch (error) {
    return { error: error.message };
  }
});

// Handle file opening
ipcMain.handle('open-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'JavaScript', extensions: ['js'] }]
  });
  
  if (canceled) return null;
  
  return fs.readFileSync(filePaths[0], 'utf8');
});

// Handle file saving
ipcMain.handle('save-file', async (event, content) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    filters: [{ name: 'JavaScript', extensions: ['js'] }]
  });
  
  if (canceled) return false;
  
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
});

// Mini JS Engine class adapted for GUI use
class MiniJSEngine {
  constructor() {
    this.interpreter = new Interpreter();
    this.environmentMonitor = new EnvironmentMonitor(this.interpreter);
    this.results = {
      tokens: [],
      ast: null,
      output: null,
      error: null,
      environment: null
    };
  }
  
  run(source) {
    try {
      // Reset results
      this.results = {
        tokens: [],
        ast: null,
        output: null,
        error: null,
        environment: null
      };
      
      // Tokenization
      const tokenizer = new Tokenizer(source);
      const tokens = tokenizer.tokenize();
      this.results.tokens = tokens;
      
      // Parsing
      const parser = new Parser(tokens);
      const statements = parser.parse();
      this.results.ast = JSON.stringify(statements, this.astReplacer, 2);
      
      // Interpretation
      const result = this.interpreter.interpret(statements);
      this.results.output = result;
      
      // Extract environment information
      this.results.environment = this.environmentMonitor.extractEnvironment();
      
      return this.results;
    } catch (error) {
      this.results.error = error.message;
      return this.results;
    }
  }
  
  // Helper method to handle circular references in AST
  astReplacer(key, value) {
    if (key === 'parent' || key === 'previous') {
      return undefined; // Skip circular references
    }
    return value;
  }
} 