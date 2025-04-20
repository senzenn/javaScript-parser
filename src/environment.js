/**
 * Environment - Manages variable scopes and values
 */

class Environment {
  constructor(enclosing = null) {
    this.values = new Map();
    this.enclosing = enclosing; // Reference to the outer environment (scope)
  }
  
  // Define a new variable in the current scope
  define(name, value) {
    this.values.set(name.lexeme, value);
    return value;
  }
  
  // Look up a variable by name
  get(name) {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }
    
    // If variable not found in this scope, check the enclosing scope
    if (this.enclosing) {
      return this.enclosing.get(name);
    }
    
    throw new Error(`Undefined variable '${name.lexeme}'.`);
  }
  
  // Update an existing variable's value
  assign(name, value) {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value);
      return value;
    }
    
    // If variable not found in this scope, try the enclosing scope
    if (this.enclosing) {
      return this.enclosing.assign(name, value);
    }
    
    throw new Error(`Undefined variable '${name.lexeme}'.`);
  }
}

module.exports = { Environment }; 