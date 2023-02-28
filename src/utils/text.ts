const isObject = (str: unknown) => {
  return typeof str === 'object' && !Array.isArray(str) && str !== null;
};

export { isObject };
