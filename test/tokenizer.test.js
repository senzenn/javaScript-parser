/**
 * Tests for the Tokenizer
 */

const { Tokenizer, TokenType } = require('../src/tokenizer');

describe('Tokenizer', () => {
  test('should tokenize empty input', () => {
    const tokenizer = new Tokenizer('');
    const tokens = tokenizer.tokenize();
    
    expect(tokens.length).toBe(1);
    expect(tokens[0].type).toBe(TokenType.EOF);
  });
  
  test('should tokenize numbers', () => {
    const tokenizer = new Tokenizer('123 45.67');
    const tokens = tokenizer.tokenize();
    
    expect(tokens.length).toBe(3); // 2 numbers + EOF
    
    expect(tokens[0].type).toBe(TokenType.NUMBER);
    expect(tokens[0].literal).toBe(123);
    
    expect(tokens[1].type).toBe(TokenType.NUMBER);
    expect(tokens[1].literal).toBe(45.67);
  });
  
  test('should tokenize strings', () => {
    const tokenizer = new Tokenizer('"hello" "world"');
    const tokens = tokenizer.tokenize();
    
    expect(tokens.length).toBe(3); // 2 strings + EOF
    
    expect(tokens[0].type).toBe(TokenType.STRING);
    expect(tokens[0].literal).toBe('hello');
    
    expect(tokens[1].type).toBe(TokenType.STRING);
    expect(tokens[1].literal).toBe('world');
  });
  
  test('should tokenize identifiers and keywords', () => {
    const tokenizer = new Tokenizer('let x if else');
    const tokens = tokenizer.tokenize();
    
    expect(tokens.length).toBe(5); // 4 tokens + EOF
    
    expect(tokens[0].type).toBe(TokenType.LET);
    expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[2].type).toBe(TokenType.IF);
    expect(tokens[3].type).toBe(TokenType.ELSE);
  });
  
  test('should tokenize operators', () => {
    const tokenizer = new Tokenizer('+ - * / = == != > >= < <=');
    const tokens = tokenizer.tokenize();
    
    expect(tokens.length).toBe(12); // 11 operators + EOF
    
    expect(tokens[0].type).toBe(TokenType.PLUS);
    expect(tokens[1].type).toBe(TokenType.MINUS);
    expect(tokens[2].type).toBe(TokenType.MULTIPLY);
    expect(tokens[3].type).toBe(TokenType.DIVIDE);
    expect(tokens[4].type).toBe(TokenType.ASSIGN);
    expect(tokens[5].type).toBe(TokenType.EQUAL);
    expect(tokens[6].type).toBe(TokenType.NOT_EQUAL);
    expect(tokens[7].type).toBe(TokenType.GREATER);
    expect(tokens[8].type).toBe(TokenType.GREATER_EQUAL);
    expect(tokens[9].type).toBe(TokenType.LESS);
    expect(tokens[10].type).toBe(TokenType.LESS_EQUAL);
  });
  
  test('should tokenize logical operators', () => {
    const tokenizer = new Tokenizer('&& ||');
    const tokens = tokenizer.tokenize();
    
    expect(tokens.length).toBe(3); // 2 operators + EOF
    
    expect(tokens[0].type).toBe(TokenType.AND);
    expect(tokens[1].type).toBe(TokenType.OR);
  });
  
  test('should tokenize delimiters', () => {
    const tokenizer = new Tokenizer('(){};');
    const tokens = tokenizer.tokenize();
    
    expect(tokens.length).toBe(6); // 5 delimiters + EOF
    
    expect(tokens[0].type).toBe(TokenType.LEFT_PAREN);
    expect(tokens[1].type).toBe(TokenType.RIGHT_PAREN);
    expect(tokens[2].type).toBe(TokenType.LEFT_BRACE);
    expect(tokens[3].type).toBe(TokenType.RIGHT_BRACE);
    expect(tokens[4].type).toBe(TokenType.SEMICOLON);
  });
  
  test('should ignore comments', () => {
    const tokenizer = new Tokenizer('// This is a comment\nlet x = 5;');
    const tokens = tokenizer.tokenize();
    
    expect(tokens.length).toBe(5); // let, x, =, 5, ;, EOF
    expect(tokens[0].type).toBe(TokenType.LET);
  });
  
  test('should tokenize a simple program', () => {
    const program = `
      let x = 10;
      let y = 5;
      if (x > y) {
        x = x + y;
      }
    `;
    
    const tokenizer = new Tokenizer(program);
    const tokens = tokenizer.tokenize();
    
    // Verify we have the expected number of tokens (not counting whitespace)
    expect(tokens.length).toBe(21); // 20 tokens + EOF
  });
}); 