// Example program for the Mini JavaScript Engine

// Variable declarations
let x = 10;
let y = 5;

// Arithmetic expressions
let sum = x + y;
let diff = x - y;
let product = x * y;
let quotient = x / y;

// Logical conditions
let isGreater = x > y;

// Conditional statements
if (isGreater) {
  // This block should execute
  sum = sum * 2;
}

// Variable assignment
x = sum; 

// Nested scope with block
{
  let z = 42; // z is only accessible in this block
  let nested = x + z;
}

// End of program 