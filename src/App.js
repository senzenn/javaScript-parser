import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import OutputPanel from './components/OutputPanel';
import Header from './components/Header';
import './App.css';
import { Tokenizer } from './compiler/tokenizer';
import { Parser } from './compiler/parser';
import { Interpreter } from './compiler/interpreter';
import { EnvironmentMonitor } from './compiler/environment-monitor';

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

// End of program`;

function App() {
  const [code, setCode] = useState(defaultCode);
  const [activeTab, setActiveTab] = useState('output');
  const [results, setResults] = useState({
    output: '// Run your code to see output',
    tokens: '// Run your code to see tokens',
    ast: '// Run your code to see AST',
    environment: '// Run your code to see environment variables',
    error: null
  });

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleRunCode = () => {
    try {
      const engine = new MiniJSEngine();
      const result = engine.run(code);
      
      setResults({
        output: result.output ?? 'Code executed successfully!',
        tokens: formatTokens(result.tokens),
        ast: result.ast ?? 'No AST generated',
        environment: formatEnvironment(result.environment),
        error: result.error
      });
    } catch (error) {
      setResults({
        ...results,
        output: `System Error: ${error.message}`,
        error: error.message
      });
    }
  };

  const formatTokens = (tokens) => {
    if (!tokens || tokens.length === 0) {
      return 'No tokens generated';
    }
    
    let result = '';
    tokens.forEach((token, index) => {
      result += `[${index}] ${token.type}: "${token.lexeme}" (Line ${token.line})\n`;
    });
    
    return result;
  };

  const formatEnvironment = (env) => {
    if (!env) {
      return '// No environment data available';
    }
    
    if (env.error) {
      return `// Error: ${env.error}`;
    }
    
    let envText = '';
    
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
    
    addEnvironmentToText(env);
    return envText;
  };

  // Mini JS Engine class adapted for web use
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

  return (
    <div className="app">
      <Header onRun={handleRunCode} />
      <main className="app-main">
        <CodeEditor code={code} onChange={handleCodeChange} />
        <OutputPanel
          results={results}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </main>
      <footer className="app-footer">
        <p>Mini JavaScript Engine &copy; 2023</p>
      </footer>
    </div>
  );
}

export default App; 