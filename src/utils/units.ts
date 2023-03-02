export const prettyPrintBytes = (size: number): string => {
  const units = ['B', 'KB', 'MB'];
  let s = size;
  for (const unit of units) {
    if (s < 1000) {
      return s.toFixed(0) + unit;
    }
    s /= 1024;
  }
  return s.toFixed(0) + 'GB';
};

export const prettyNumberWithCommas = (value: number): string => {
  const valueRound: number = Math.round(value * 100) / 100;
  const valueStrFormat: string = valueRound.toLocaleString('en-US', {
    minimumFractionDigits: 2,
  });
  return valueStrFormat.replace('.00', '');
};
