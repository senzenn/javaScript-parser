/**
 * Interpreter - Executes the AST by traversing it
 */

const { Visitor } = require('./ast');
const { TokenType } = require('./tokenizer');
const { Environment } = require('./environment');

class RuntimeError extends Error {
  constructor(token, message) {
    super(message);
    this.token = token;
    this.name = "RuntimeError";
  }
}

class Interpreter extends Visitor {
  constructor() {
    super();
    this.environment = new Environment();
  }
  
  interpret(statements) {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
      return true;
    } catch (error) {
      console.error(`Runtime Error: ${error.message}`);
      return false;
    }
  }
  
  // Statement execution
  execute(stmt) {
    return stmt.accept(this);
  }
  
  // Create a new scope
  executeBlock(statements, environment) {
    const previous = this.environment;
    
    try {
      this.environment = environment;
      
      for (const statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }
  
  // Expression evaluation
  evaluate(expr) {
    return expr.accept(this);
  }
  
  // Statement visitors
  
  visitBlockStmt(stmt) {
    this.executeBlock(
      stmt.statements,
      new Environment(this.environment)
    );
    return null;
  }
  
  visitExpressionStmt(stmt) {
    this.evaluate(stmt.expression);
    return null;
  }
  
  visitIfStmt(stmt) {
    if (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch !== null) {
      this.execute(stmt.elseBranch);
    }
    return null;
  }
  
  visitVarStmt(stmt) {
    let value = null;
    if (stmt.initializer !== null) {
      value = this.evaluate(stmt.initializer);
    }
    
    this.environment.define(stmt.name, value);
    return null;
  }
  
  // Expression visitors
  
  visitAssignExpr(expr) {
    const value = this.evaluate(expr.value);
    this.environment.assign(expr.name, value);
    return value;
  }
  
  visitBinaryExpr(expr) {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);
    
    switch (expr.operator.type) {
      // Arithmetic operators
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return left - right;
      case TokenType.PLUS:
        if (typeof left === 'number' && typeof right === 'number') {
          return left + right;
        }
        if (typeof left === 'string' || typeof right === 'string') {
          return String(left) + String(right);
        }
        throw new RuntimeError(expr.operator, "Operands must be numbers or strings.");
      case TokenType.DIVIDE:
        this.checkNumberOperands(expr.operator, left, right);
        if (right === 0) {
          throw new RuntimeError(expr.operator, "Division by zero.");
        }
        return left / right;
      case TokenType.MULTIPLY:
        this.checkNumberOperands(expr.operator, left, right);
        return left * right;
        
      // Comparison operators
      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return left > right;
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return left >= right;
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return left < right;
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return left <= right;
        
      // Equality operators
      case TokenType.EQUAL:
        return this.isEqual(left, right);
      case TokenType.NOT_EQUAL:
        return !this.isEqual(left, right);
    }
    
    // Unreachable
    return null;
  }
  
  visitGroupingExpr(expr) {
    return this.evaluate(expr.expression);
  }
  
  visitLiteralExpr(expr) {
    return expr.value;
  }
  
  visitLogicalExpr(expr) {
    const left = this.evaluate(expr.left);
    
    // Short-circuit evaluation
    if (expr.operator.type === TokenType.OR) {
      if (this.isTruthy(left)) return left;
    } else if (expr.operator.type === TokenType.AND) {
      if (!this.isTruthy(left)) return left;
    }
    
    return this.evaluate(expr.right);
  }
  
  visitUnaryExpr(expr) {
    const right = this.evaluate(expr.right);
    
    switch (expr.operator.type) {
      case TokenType.MINUS:
        this.checkNumberOperand(expr.operator, right);
        return -right;
      case TokenType.NOT:
        return !this.isTruthy(right);
    }
    
    // Unreachable
    return null;
  }
  
  visitVariableExpr(expr) {
    return this.environment.get(expr.name);
  }
  
  // Helper methods
  
  isTruthy(value) {
    if (value === null) return false;
    if (typeof value === 'boolean') return value;
    if (value === 0) return false;
    if (value === '') return false;
    return true;
  }
  
  isEqual(a, b) {
    if (a === null && b === null) return true;
    if (a === null) return false;
    return a === b;
  }
  
  checkNumberOperand(operator, operand) {
    if (typeof operand === 'number') return;
    throw new RuntimeError(operator, "Operand must be a number.");
  }
  
  checkNumberOperands(operator, left, right) {
    if (typeof left === 'number' && typeof right === 'number') return;
    throw new RuntimeError(operator, "Operands must be numbers.");
  }
}

module.exports = { Interpreter }; 