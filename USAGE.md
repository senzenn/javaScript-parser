# Running the Mini JavaScript Engine

This guide will help you set up and run the Mini JavaScript Engine project.

## Setup

1. Make sure you have Node.js installed (version 14+ recommended)
2. Clone this repository
3. Install dependencies:

```bash
npm install
```

## Running the Engine

### REPL Mode (Interactive)

To start an interactive session:

```bash
npm start
```

This will start a Read-Eval-Print Loop where you can type JavaScript code one line at a time.

Example usage in REPL:

```
> let x = 10;
> let y = 5;
> x + y
15
> if (x > y) { x = x * 2; }
> x
20
```

Type `exit` or `quit` to exit the REPL.

### Running a Script

To run a JavaScript file:

```bash
npm start -- examples/example.js
```

## Supported Features

The Mini JavaScript Engine supports:

- Variable declarations (let, const)
- Arithmetic expressions (+, -, *, /)
- Comparison operators (>, >=, <, <=, ==, !=)
- Logical operators (&&, ||)
- Conditional statements (if/else)
- Blocks and scopes

## Running Tests

Run the test suite with:

```bash
npm test
```

## Project Structure

- `src/` - Source code of the engine
  - `tokenizer.js` - Breaks code into tokens
  - `parser.js` - Builds the AST
  - `ast.js` - AST node definitions
  - `interpreter.js` - Executes the AST
  - `environment.js` - Manages variable scopes
  - `index.js` - Main entry point
- `examples/` - Example JavaScript files
- `test/` - Test files 