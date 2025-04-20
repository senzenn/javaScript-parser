/**
 * Main entry point for the Mini JavaScript Engine
 */

const fs = require('fs');
const readline = require('readline');
const { Tokenizer } = require('./tokenizer');
const { Parser } = require('./parser');
const { Interpreter } = require('./interpreter');

class MiniJSEngine {
  constructor() {
    this.interpreter = new Interpreter();
    this.hadError = false;
    this.hadRuntimeError = false;
  }
  
  // Run code from a file
  runFile(path) {
    try {
      const source = fs.readFileSync(path, 'utf8');
      this.run(source);
      
      // Exit with error code if there was an error
      if (this.hadError) process.exit(65);
      if (this.hadRuntimeError) process.exit(70);
    } catch (error) {
      console.error(`Error reading file: ${error.message}`);
      process.exit(1);
    }
  }
  
  // Run interactive REPL (Read-Eval-Print Loop)
  runPrompt() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> '
    });
    
    rl.prompt();
    
    rl.on('line', (line) => {
      if (line.trim() === 'exit' || line.trim() === 'quit') {
        rl.close();
        return;
      }
      
      this.run(line);
      this.hadError = false;
      this.hadRuntimeError = false;
      rl.prompt();
    }).on('close', () => {
      console.log('Goodbye!');
      process.exit(0);
    });
  }
  
  // Run source code
  run(source) {
    try {
      // Tokenization
      const tokenizer = new Tokenizer(source);
      const tokens = tokenizer.tokenize();
      
      // Parsing
      const parser = new Parser(tokens);
      const statements = parser.parse();
      
      // Don't interpret if there was a syntax error
      if (this.hadError) return;
      
      // Interpretation
      const result = this.interpreter.interpret(statements);
      
      // Print result for REPL mode
      if (result && process.argv.length <= 2) {
        console.log(result);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      this.hadError = true;
    }
  }
  
  // Error reporting methods
  error(line, message) {
    this.report(line, "", message);
  }
  
  runtimeError(error) {
    console.error(`Runtime Error: ${error.message}`);
    this.hadRuntimeError = true;
  }
  
  report(line, where, message) {
    console.error(`[line ${line}] Error ${where}: ${message}`);
    this.hadError = true;
  }
}

// Main execution
function main() {
  const engine = new MiniJSEngine();
  
  if (process.argv.length > 3) {
    console.log('Usage: node src/index.js [script]');
    process.exit(64);
  } else if (process.argv.length === 3) {
    engine.runFile(process.argv[2]);
  } else {
    console.log('Mini JavaScript Engine - REPL Mode');
    console.log('Type "exit" or "quit" to exit');
    engine.runPrompt();
  }
}

main(); 