/**
 * Parser - Converts tokens into an Abstract Syntax Tree (AST)
 * This is a simplified version for the web demo
 */

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }
  
  parse() {
    try {
      const statements = [];
      
      while (!this.isAtEnd()) {
        statements.push(this.statement());
      }
      
      return statements;
    } catch (error) {
      console.error("Parse error:", error);
      return [];
    }
  }
  
  statement() {
    // This is a simplified parser that creates basic statement objects
    // A full implementation would create proper AST nodes
    
    const token = this.advance();
    
    // Basic structure for demo purposes
    return {
      type: 'Statement',
      token: token,
      line: token.line
    };
  }
  
  isAtEnd() {
    return this.current >= this.tokens.length || 
           this.tokens[this.current].type === 'EOF';
  }
  
  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.tokens[this.current - 1];
  }
}

export { Parser }; 