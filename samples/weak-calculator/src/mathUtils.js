function clamp(val, min, max) {
  if (val < min) {
    return min;
  }
  if (val > max) {
    return max;
  }
  return val;
}

function abs(n) {
  if (n < 0) {
    return -n;
  }
  return n;
}

module.exports = {
  clamp,
  abs,
};
