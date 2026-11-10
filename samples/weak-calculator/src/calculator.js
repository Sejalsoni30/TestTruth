function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

function isPositive(n) {
  return n > 0;
}

function calculateDiscount(amount, userCount) {
  if (userCount >= 50) {
    return amount * 0.2;
  } else if (userCount >= 10) {
    return amount * 0.1;
  }
  return 0;
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  isPositive,
  calculateDiscount,
};

