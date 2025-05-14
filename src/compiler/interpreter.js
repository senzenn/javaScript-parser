/**
 * Interpreter - Executes the AST
 * This is a simplified version for the web demo
 */

import { Environment } from './environment';

class Interpreter {
  constructor() {
    this.environment = new Environment();
    this.result = null;
  }
  
  interpret(statements) {
    try {
      // Execute each statement in the program
      for (const statement of statements) {
        this.execute(statement);
      }
      
      return this.result;
    } catch (error) {
      console.error("Runtime error:", error);
      throw error;
    }
  }
  
  execute(statement) {
    // This is a simplified interpreter that just tracks token types
    // A full implementation would properly execute the code
    
    if (statement.token) {
      // For the demo, we'll just store token information
      this.environment.define(
        { lexeme: `var_${statement.token.lexeme}` },
        statement.token.literal || statement.token.lexeme
      );
    }
    
    this.result = "Program executed successfully";
    return null;
  }
}

export { Interpreter }; 