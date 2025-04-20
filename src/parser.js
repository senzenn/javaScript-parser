/**
 * Parser - Converts tokens into an Abstract Syntax Tree
 */

const { TokenType } = require('./tokenizer');
const {
  Binary, Grouping, Literal, Unary, Variable, Assign, Logical,
  Expression, If, Var, Block
} = require('./ast');

class ParseError extends Error {
  constructor(message) {
    super(message);
    this.name = "ParseError";
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }
  
  parse() {
    try {
      const statements = [];
      while (!this.isAtEnd()) {
        statements.push(this.declaration());
      }
      return statements;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  // Grammar rules
  
  // declaration -> varDeclaration | statement
  declaration() {
    try {
      if (this.match(TokenType.LET, TokenType.CONST)) {
        return this.varDeclaration();
      }
      
      return this.statement();
    } catch (error) {
      this.synchronize();
      return null;
    }
  }
  
  // varDeclaration -> "let" IDENTIFIER ( "=" expression )? ";"
  varDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Expected variable name.");
    
    let initializer = null;
    if (this.match(TokenType.ASSIGN)) {
      initializer = this.expression();
    }
    
    this.consume(TokenType.SEMICOLON, "Expected ';' after variable declaration.");
    return new Var(name, initializer);
  }
  
  // statement -> expressionStatement | ifStatement | block
  statement() {
    if (this.match(TokenType.IF)) {
      return this.ifStatement();
    }
    
    if (this.match(TokenType.LEFT_BRACE)) {
      return new Block(this.block());
    }
    
    return this.expressionStatement();
  }
  
  // ifStatement -> "if" "(" expression ")" statement ( "else" statement )?
  ifStatement() {
    this.consume(TokenType.LEFT_PAREN, "Expected '(' after 'if'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expected ')' after if condition.");
    
    const thenBranch = this.statement();
    let elseBranch = null;
    
    if (this.match(TokenType.ELSE)) {
      elseBranch = this.statement();
    }
    
    return new If(condition, thenBranch, elseBranch);
  }
  
  // block -> "{" declaration* "}"
  block() {
    const statements = [];
    
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }
    
    this.consume(TokenType.RIGHT_BRACE, "Expected '}' after block.");
    return statements;
  }
  
  // expressionStatement -> expression ";"
  expressionStatement() {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expected ';' after expression.");
    return new Expression(expr);
  }
  
  // expression -> assignment
  expression() {
    return this.assignment();
  }
  
  // assignment -> IDENTIFIER "=" assignment | logic_or
  assignment() {
    const expr = this.or();
    
    if (this.match(TokenType.ASSIGN)) {
      const equals = this.previous();
      const value = this.assignment();
      
      if (expr instanceof Variable) {
        const name = expr.name;
        return new Assign(name, value);
      }
      
      this.error(equals, "Invalid assignment target.");
    }
    
    return expr;
  }
  
  // logic_or -> logic_and ( "||" logic_and )*
  or() {
    let expr = this.and();
    
    while (this.match(TokenType.OR)) {
      const operator = this.previous();
      const right = this.and();
      expr = new Logical(expr, operator, right);
    }
    
    return expr;
  }
  
  // logic_and -> equality ( "&&" equality )*
  and() {
    let expr = this.equality();
    
    while (this.match(TokenType.AND)) {
      const operator = this.previous();
      const right = this.equality();
      expr = new Logical(expr, operator, right);
    }
    
    return expr;
  }
  
  // equality -> comparison ( ( "!=" | "==" ) comparison )*
  equality() {
    let expr = this.comparison();
    
    while (this.match(TokenType.NOT_EQUAL, TokenType.EQUAL)) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new Binary(expr, operator, right);
    }
    
    return expr;
  }
  
  // comparison -> term ( ( ">" | ">=" | "<" | "<=" ) term )*
  comparison() {
    let expr = this.term();
    
    while (this.match(
      TokenType.GREATER, TokenType.GREATER_EQUAL,
      TokenType.LESS, TokenType.LESS_EQUAL
    )) {
      const operator = this.previous();
      const right = this.term();
      expr = new Binary(expr, operator, right);
    }
    
    return expr;
  }
  
  // term -> factor ( ( "-" | "+" ) factor )*
  term() {
    let expr = this.factor();
    
    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous();
      const right = this.factor();
      expr = new Binary(expr, operator, right);
    }
    
    return expr;
  }
  
  // factor -> unary ( ( "/" | "*" ) unary )*
  factor() {
    let expr = this.unary();
    
    while (this.match(TokenType.DIVIDE, TokenType.MULTIPLY)) {
      const operator = this.previous();
      const right = this.unary();
      expr = new Binary(expr, operator, right);
    }
    
    return expr;
  }
  
  // unary -> ( "!" | "-" ) unary | primary
  unary() {
    if (this.match(TokenType.NOT, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.unary();
      return new Unary(operator, right);
    }
    
    return this.primary();
  }
  
  // primary -> NUMBER | STRING | "true" | "false" | "nil"
  //            | "(" expression ")" | IDENTIFIER
  primary() {
    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal);
    }
    
    if (this.match(TokenType.IDENTIFIER)) {
      return new Variable(this.previous());
    }
    
    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression.");
      return new Grouping(expr);
    }
    
    throw this.error(this.peek(), "Expected expression.");
  }
  
  // Helper methods
  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    
    return false;
  }
  
  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }
  
  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }
  
  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }
  
  peek() {
    return this.tokens[this.current];
  }
  
  previous() {
    return this.tokens[this.current - 1];
  }
  
  consume(type, message) {
    if (this.check(type)) return this.advance();
    
    throw this.error(this.peek(), message);
  }
  
  error(token, message) {
    if (token.type === TokenType.EOF) {
      console.error(`Error at end: ${message}`);
    } else {
      console.error(`Error at '${token.lexeme}': ${message}`);
    }
    
    return new ParseError(message);
  }
  
  synchronize() {
    this.advance();
    
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;
      
      switch (this.peek().type) {
        case TokenType.LET:
        case TokenType.CONST:
        case TokenType.IF:
        case TokenType.ELSE:
          return;
      }
      
      this.advance();
    }
  }
}

module.exports = { Parser }; 