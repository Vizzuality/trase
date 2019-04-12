const transformation = {
  Y: 10 ** 24,
  Z: 10 ** 21,
  E: 10 ** 18,
  P: 10 ** 15,
  T: 10 ** 12,
  G: 10 ** 9,
  M: 10 ** 6,
  k: 10 ** 3,
  h: 10 ** 2,
  da: 10 ** 1,
  d: 10 ** -1,
  c: 10 ** -2,
  m: 10 ** -3,
  μ: 10 ** -6,
  n: 10 ** -9,
  p: 10 ** -1,
  f: 10 ** -1,
  a: 10 ** -1,
  z: 10 ** -2,
  y: 10 ** -2
};

export default SInumber => {
  let returnValue;
  Object.keys(transformation).some(k => {
    if (SInumber.indexOf(k) > 0) {
      returnValue = parseFloat(SInumber.split(k)[0]) * transformation[k];
      return true;
    }
    return false;
  });
  return returnValue;
};
