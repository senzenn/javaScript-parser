/**
 * Tokenizer (Lexer) - Breaks source code into tokens
 */

// Token types
const TokenType = {
  // Keywords
  LET: 'LET',
  CONST: 'CONST',
  IF: 'IF',
  ELSE: 'ELSE',
  
  // Identifiers and literals
  IDENTIFIER: 'IDENTIFIER',
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  
  // Operators
  PLUS: 'PLUS',             // +
  MINUS: 'MINUS',           // -
  MULTIPLY: 'MULTIPLY',     // *
  DIVIDE: 'DIVIDE',         // /
  ASSIGN: 'ASSIGN',         // =
  
  // Comparison operators
  EQUAL: 'EQUAL',           // ==
  NOT_EQUAL: 'NOT_EQUAL',   // !=
  GREATER: 'GREATER',       // >
  LESS: 'LESS',             // <
  GREATER_EQUAL: 'GREATER_EQUAL', // >=
  LESS_EQUAL: 'LESS_EQUAL', // <=
  
  // Logical operators
  AND: 'AND',               // &&
  OR: 'OR',                 // ||
  
  // Delimiters
  SEMICOLON: 'SEMICOLON',   // ;
  LEFT_PAREN: 'LEFT_PAREN', // (
  RIGHT_PAREN: 'RIGHT_PAREN', // )
  LEFT_BRACE: 'LEFT_BRACE', // {
  RIGHT_BRACE: 'RIGHT_BRACE', // }
  
  // End of file
  EOF: 'EOF'
};

// Token class
class Token {
  constructor(type, lexeme, literal = null, line = 0) {
    this.type = type;       // Token type
    this.lexeme = lexeme;   // The actual string value from source
    this.literal = literal; // Processed value (for numbers, strings)
    this.line = line;       // Line number in source
  }
  
  toString() {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}

// Tokenizer class
class Tokenizer {
  constructor(source) {
    this.source = source;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
    
    // Keywords map
    this.keywords = {
      'let': TokenType.LET,
      'const': TokenType.CONST,
      'if': TokenType.IF,
      'else': TokenType.ELSE,
    };
  }
  
  tokenize() {
    while (!this.isAtEnd()) {
      // Beginning of the next lexeme
      this.start = this.current;
      this.scanToken();
    }
    
    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
    return this.tokens;
  }
  
  scanToken() {
    const c = this.advance();
    
    switch (c) {
      // Single-character tokens
      case '(': this.addToken(TokenType.LEFT_PAREN); break;
      case ')': this.addToken(TokenType.RIGHT_PAREN); break;
      case '{': this.addToken(TokenType.LEFT_BRACE); break;
      case '}': this.addToken(TokenType.RIGHT_BRACE); break;
      case ';': this.addToken(TokenType.SEMICOLON); break;
      
      // Operators
      case '+': this.addToken(TokenType.PLUS); break;
      case '-': this.addToken(TokenType.MINUS); break;
      case '*': this.addToken(TokenType.MULTIPLY); break;
      case '/': 
        if (this.match('/')) {
          // Comment - skip the rest of the line
          while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken(TokenType.DIVIDE);
        }
        break;
      
      // Assignment and comparison operators
      case '=':
        this.addToken(this.match('=') ? TokenType.EQUAL : TokenType.ASSIGN);
        break;
      case '!':
        this.addToken(this.match('=') ? TokenType.NOT_EQUAL : TokenType.NOT);
        break;
      case '>':
        this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      
      // Logical operators
      case '&':
        if (this.match('&')) {
          this.addToken(TokenType.AND);
        }
        break;
      case '|':
        if (this.match('|')) {
          this.addToken(TokenType.OR);
        }
        break;
      
      // Whitespace
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace
        break;
      case '\n':
        this.line++;
        break;
      
      // String literals
      case '"': this.string(); break;
      
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          console.error(`Unexpected character: ${c} at line ${this.line}`);
        }
        break;
    }
  }
  
  // Helper methods
  isAtEnd() {
    return this.current >= this.source.length;
  }
  
  advance() {
    return this.source.charAt(this.current++);
  }
  
  peek() {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }
  
  peekNext() {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }
  
  match(expected) {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;
    
    this.current++;
    return true;
  }
  
  addToken(type, literal = null) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }
  
  isDigit(c) {
    return c >= '0' && c <= '9';
  }
  
  isAlpha(c) {
    return (c >= 'a' && c <= 'z') ||
           (c >= 'A' && c <= 'Z') ||
           c === '_';
  }
  
  isAlphaNumeric(c) {
    return this.isAlpha(c) || this.isDigit(c);
  }
  
  string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;
      this.advance();
    }
    
    if (this.isAtEnd()) {
      console.error(`Unterminated string at line ${this.line}`);
      return;
    }
    
    // Consume the closing "
    this.advance();
    
    // Get the string value without quotes
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }
  
  number() {
    while (this.isDigit(this.peek())) this.advance();
    
    // Look for a decimal point
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      // Consume the decimal point
      this.advance();
      
      while (this.isDigit(this.peek())) this.advance();
    }
    
    this.addToken(
      TokenType.NUMBER,
      parseFloat(this.source.substring(this.start, this.current))
    );
  }
  
  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    
    // See if the identifier is a reserved word
    const text = this.source.substring(this.start, this.current);
    const type = this.keywords[text] || TokenType.IDENTIFIER;
    
    this.addToken(type);
  }
}

export { Tokenizer, Token, TokenType }; 