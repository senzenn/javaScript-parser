/**
 * AST - Abstract Syntax Tree node types
 */

// Base Visitor pattern for traversing AST nodes
class Visitor {
  visitBinaryExpr(expr) {}
  visitGroupingExpr(expr) {}
  visitLiteralExpr(expr) {}
  visitUnaryExpr(expr) {}
  visitVariableExpr(expr) {}
  visitAssignExpr(expr) {}
  visitLogicalExpr(expr) {}
  
  visitExpressionStmt(stmt) {}
  visitIfStmt(stmt) {}
  visitVarStmt(stmt) {}
  visitBlockStmt(stmt) {}
}

// Base class for all expressions
class Expr {
  accept(visitor) {}
}

// Binary expression (e.g., a + b, a > b)
class Binary extends Expr {
  constructor(left, operator, right) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  
  accept(visitor) {
    return visitor.visitBinaryExpr(this);
  }
}

// Grouping expression (e.g., (a + b))
class Grouping extends Expr {
  constructor(expression) {
    super();
    this.expression = expression;
  }
  
  accept(visitor) {
    return visitor.visitGroupingExpr(this);
  }
}

// Literal expression (e.g., 123, "abc")
class Literal extends Expr {
  constructor(value) {
    super();
    this.value = value;
  }
  
  accept(visitor) {
    return visitor.visitLiteralExpr(this);
  }
}

// Unary expression (e.g., !true, -5)
class Unary extends Expr {
  constructor(operator, right) {
    super();
    this.operator = operator;
    this.right = right;
  }
  
  accept(visitor) {
    return visitor.visitUnaryExpr(this);
  }
}

// Variable expression (e.g., someVar)
class Variable extends Expr {
  constructor(name) {
    super();
    this.name = name;
  }
  
  accept(visitor) {
    return visitor.visitVariableExpr(this);
  }
}

// Assignment expression (e.g., x = 5)
class Assign extends Expr {
  constructor(name, value) {
    super();
    this.name = name;
    this.value = value;
  }
  
  accept(visitor) {
    return visitor.visitAssignExpr(this);
  }
}

// Logical expression (e.g., a && b, a || b)
class Logical extends Expr {
  constructor(left, operator, right) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  
  accept(visitor) {
    return visitor.visitLogicalExpr(this);
  }
}

// Base class for all statements
class Stmt {
  accept(visitor) {}
}

// Expression statement (e.g., console.log("hi");)
class Expression extends Stmt {
  constructor(expression) {
    super();
    this.expression = expression;
  }
  
  accept(visitor) {
    return visitor.visitExpressionStmt(this);
  }
}

// If statement (e.g., if (condition) { ... } else { ... })
class If extends Stmt {
  constructor(condition, thenBranch, elseBranch) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }
  
  accept(visitor) {
    return visitor.visitIfStmt(this);
  }
}

// Variable declaration (e.g., let x = 5;)
class Var extends Stmt {
  constructor(name, initializer) {
    super();
    this.name = name;
    this.initializer = initializer;
  }
  
  accept(visitor) {
    return visitor.visitVarStmt(this);
  }
}

// Block statement (e.g., { let x = 5; print x; })
class Block extends Stmt {
  constructor(statements) {
    super();
    this.statements = statements;
  }
  
  accept(visitor) {
    return visitor.visitBlockStmt(this);
  }
}

module.exports = {
  Visitor,
  // Expressions
  Expr,
  Binary,
  Grouping,
  Literal,
  Unary,
  Variable,
  Assign,
  Logical,
  // Statements
  Stmt,
  Expression,
  If,
  Var,
  Block
}; 