export const checkLines = (str: string) => str.split(/\r\n|\r|\n/).length;

export const checkForHttpRegex = (str: string) => {
  const httpsRegex = /^(http|https):\/\//;
  return httpsRegex.test(str);
};
