# Mini JavaScript Engine

A simplified JavaScript engine that demonstrates how JavaScript code is parsed, structured, and executed behind the scenes.

## Features

- **Tokenizer/Lexer**: Breaks code into tokens (keywords, identifiers, operators, literals, etc.)
- **Parser**: Uses grammar rules to convert tokens into an Abstract Syntax Tree (AST)
- **AST Generation**: Builds a tree representing the structure and flow of the program
- **Interpreter**: Traverses the AST and executes code node-by-node
- **Environment/Scope Management**: Tracks variable values and scopes during interpretation

## Supported JavaScript Features

- Variable declarations (let, const)
- Arithmetic & logical expressions (+, -, *, /, &&, ||)
- Conditional statements (if, else)

## Installation

```bash
git clone <repository-url>
cd mini-js-engine
npm install
```

## Usage

Run the interpreter with a JavaScript file:

```bash
npm start -- path/to/file.js
```

Or use the REPL mode:

```bash
npm start
```

## Examples

```javascript
// Sample program
let x = 5;
let y = 10;
let result = x + y;

if (result > 10) {
  result = result * 2;
}
```

## Project Structure

- `src/tokenizer.js`: Lexical analysis to produce tokens from source code
- `src/parser.js`: Builds the AST from tokens
- `src/ast.js`: Defines the AST node types
- `src/interpreter.js`: Executes the AST
- `src/environment.js`: Manages variable scopes
- `src/index.js`: Main entry point and REPL

## Testing

Run the test suite with:

```bash
npm test
``` # javaScript-parser
# pbl-compiler
# pbl-compiler
