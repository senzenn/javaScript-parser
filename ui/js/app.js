// DOM Elements
const editorElement = document.getElementById('editor');
const outputContent = document.getElementById('output-content');
const tokensContent = document.getElementById('tokens-content');
const astContent = document.getElementById('ast-content');
const envContent = document.getElementById('env-content');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const newBtn = document.getElementById('newBtn');
const openBtn = document.getElementById('openBtn');
const saveBtn = document.getElementById('saveBtn');
const runBtn = document.getElementById('runBtn');

// Editor setup - using a simple textarea for now
// In a real implementation, you would integrate CodeMirror properly
const editor = document.createElement('textarea');
editor.style.width = '100%';
editor.style.height = '100%';
editor.style.padding = '1rem';
editor.style.border = 'none';
editor.style.resize = 'none';
editor.style.fontFamily = 'Fira Code, Consolas, Monaco, monospace';
editor.style.fontSize = '14px';
editor.style.lineHeight = '1.5';
editor.spellcheck = false;
editorElement.appendChild(editor);

// Default example code
const defaultCode = `// Example program for the Mini JavaScript Engine

// Variable declarations
let x = 10;
let y = 5;

// Arithmetic expressions
let sum = x + y;
let diff = x - y;
let product = x * y;
let quotient = x / y;

// Logical conditions
let isGreater = x > y;

// Conditional statements
if (isGreater) {
  // This block should execute
  sum = sum * 2;
}

// Variable assignment
x = sum; 

// End of program
`;

// Initialize editor with default code
editor.value = defaultCode;

// Tab switching functionality
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all tabs
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    // Add active class to clicked tab
    button.classList.add('active');
    const tabId = button.dataset.tab;
    document.getElementById(tabId).classList.add('active');
  });
});

// Execute code functionality
async function executeCode() {
  try {
    const code = editor.value;
    const result = await window.electronAPI.executeCode(code);
    
    if (result.error) {
      outputContent.textContent = `Error: ${result.error}`;
      outputContent.style.color = 'red';
    } else {
      // Display output
      outputContent.textContent = result.output ?? 'Code executed successfully!';
      outputContent.style.color = '#333';
      
      // Display tokens
      tokensContent.textContent = formatTokens(result.tokens);
      
      // Display AST
      astContent.textContent = result.ast ?? 'No AST generated';
      
      // Display environment
      renderEnvironment(result);
    }
  } catch (error) {
    outputContent.textContent = `System Error: ${error.message}`;
    outputContent.style.color = 'red';
  }
}

// Format tokens for display
function formatTokens(tokens) {
  if (!tokens || tokens.length === 0) {
    return 'No tokens generated';
  }
  
  let result = '';
  tokens.forEach((token, index) => {
    result += `[${index}] ${token.type}: "${token.lexeme}" (Line ${token.line})\n`;
  });
  
  return result;
}

// Render environment variables
function renderEnvironment(result) {
  if (!result.environment) {
    envContent.textContent = '// No environment data available';
    return;
  }
  
  if (result.environment.error) {
    envContent.textContent = `// Error: ${result.environment.error}`;
    return;
  }
  
  let envText = '// Environment Variables\n\n';
  
  // Recursive function to display environment chain
  function addEnvironmentToText(env, indentLevel = 0) {
    if (!env) return;
    
    const indent = '  '.repeat(indentLevel);
    envText += `${indent}${env.name}:\n`;
    
    // Add variables
    const variables = env.variables || {};
    for (const [name, value] of Object.entries(variables)) {
      envText += `${indent}  ${name}: ${value}\n`;
    }
    
    // Process enclosing environment
    if (env.enclosing) {
      envText += '\n';
      addEnvironmentToText(env.enclosing, indentLevel + 1);
    }
  }
  
  addEnvironmentToText(result.environment);
  envContent.textContent = envText;
}

// Button event listeners
newBtn.addEventListener('click', () => {
  if (confirm('Create a new file? Any unsaved changes will be lost.')) {
    editor.value = '';
  }
});

openBtn.addEventListener('click', async () => {
  try {
    const content = await window.electronAPI.openFile();
    if (content) {
      editor.value = content;
    }
  } catch (error) {
    alert(`Error opening file: ${error.message}`);
  }
});

saveBtn.addEventListener('click', async () => {
  try {
    const success = await window.electronAPI.saveFile(editor.value);
    if (success) {
      alert('File saved successfully!');
    }
  } catch (error) {
    alert(`Error saving file: ${error.message}`);
  }
});

runBtn.addEventListener('click', executeCode); 