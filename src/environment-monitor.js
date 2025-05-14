/**
 * Environment Monitor - Extracts information from the Environment for GUI display
 */

class EnvironmentMonitor {
  constructor(interpreter) {
    this.interpreter = interpreter;
  }
  
  /**
   * Extract all environment variables for display
   * @returns {Object} Object containing environment information
   */
  extractEnvironment() {
    if (!this.interpreter || !this.interpreter.environment) {
      return { error: 'No active environment' };
    }
    
    return this.serializeEnvironment(this.interpreter.environment);
  }
  
  /**
   * Serialize an environment and its enclosing environments
   * @param {Environment} env The environment to serialize
   * @param {number} depth Current depth in the environment chain
   * @returns {Object} Serialized environment data
   */
  serializeEnvironment(env, depth = 0) {
    if (!env) return null;
    
    const result = {
      depth,
      name: depth === 0 ? 'Global Scope' : `Scope ${depth}`,
      variables: {},
      enclosing: null
    };
    
    // Extract variables
    if (env.values && env.values instanceof Map) {
      for (const [name, value] of env.values.entries()) {
        result.variables[name] = this.serializeValue(value);
      }
    }
    
    // Process enclosing environment recursively
    if (env.enclosing) {
      result.enclosing = this.serializeEnvironment(env.enclosing, depth + 1);
    }
    
    return result;
  }
  
  /**
   * Convert a JavaScript value to a displayable string
   * @param {any} value The value to serialize
   * @returns {string} String representation of the value
   */
  serializeValue(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    
    switch (typeof value) {
      case 'number':
      case 'boolean':
        return value.toString();
      case 'string':
        return `"${value}"`;
      case 'object':
        if (Array.isArray(value)) {
          return `[${value.map(v => this.serializeValue(v)).join(', ')}]`;
        }
        return JSON.stringify(value);
      default:
        return String(value);
    }
  }
}

module.exports = { EnvironmentMonitor }; 