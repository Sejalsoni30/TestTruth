const assert = require('node:assert');
const test = require('node:test');
const { add, subtract, multiply, divide, calculateDiscount } = require('../src/calculator.js');
const { clamp } = require('../src/mathUtils.js');

// Weak Test 1: Only asserts toBeDefined / truthiness
test('add returns defined result', () => {
  const result = add(2, 3);
  assert.ok(result !== undefined, 'result should be defined');
});

// Weak Test 2: Run-only test (Zero assertions!)
test('multiply executes without throwing', () => {
  multiply(4, 5);
  // zero assertions made
});

// Weak Test 3: Tautological assertion
test('subtract performs subtraction', () => {
  const result = subtract(10, 4);
  assert.strictEqual(true, true);
});

// Weak Test 4: Missing boundary checks on userCount (tests userCount = 60 only)
test('calculateDiscount applies high tier discount', () => {
  const discount = calculateDiscount(100, 60);
  assert.strictEqual(discount, 20);
});

// Stronger Test for mathUtils: tests clamp properly
test('clamp limits value between min and max', () => {
  assert.strictEqual(clamp(5, 10, 20), 10);
  assert.strictEqual(clamp(25, 10, 20), 20);
  assert.strictEqual(clamp(15, 10, 20), 15);
});

