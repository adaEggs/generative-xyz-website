export const MathMap = (
  x: number,
  a: number,
  b: number,
  c: number,
  d: number
): number => {
  return parseFloat((((x - a) * (d - c)) / (b - a) + c).toFixed(3));
};

export const MathLerp = (a: number, b: number, n: number): number => {
  return parseFloat(((1 - n) * a + n * b).toFixed(3));
};

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
