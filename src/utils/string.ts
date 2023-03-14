import { isBrowser } from './common';

export const checkLines = (str: string) => str.split(/\r\n|\r|\n/).length;

export const checkForHttpRegex = (str: string) => {
  const httpsRegex = /^(http|https):\/\//;
  return httpsRegex.test(str);
};

export const isBase64String = (str: string): boolean => {
  try {
    window.atob(str);
    return true;
  } catch (e) {
    return false;
  }
};

export const isNumeric = (str: never | string) => {
  return /^\d+$/.test(str);
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const base64ToDataURL = (base64String: string): string => {
  if (!isBrowser()) {
    return '';
  }

  const decodedData = window.atob(base64String);
  const slice = decodedData.slice(0, 4);
  const mimeTypes: Record<string, string> = {
    '89504E47': 'image/png',
    '47494638': 'image/gif',
    FFD8: 'image/jpeg',
    '424D': 'image/bmp',
    '52494646': 'image/webp',
    '00000100': 'image/x-icon',
    FFD88FFE: 'image/jp2',
    '5035350A': 'image/heif',
    '42564D31': 'image/bpg',
    '89504E470D0A1A0A': 'image/apng',
    '3C737667': 'image/svg+xml',
  };

  if (slice in mimeTypes) {
    const mimeType = mimeTypes[slice];
    return mimeType;
  }

  return '';
};
