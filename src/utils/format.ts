import { isBrowser } from '@utils/common';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

export const utf8ToBase64 = (str: string): string => {
  if (!isBrowser()) {
    return '';
  }
  return window.btoa(unescape(encodeURIComponent(str)));
};

export const base64ToUtf8 = (str: string): string => {
  if (!isBrowser()) {
    return '';
  }
  try {
    return decodeURIComponent(escape(window.atob(str)));
  } catch (e) {
    return '';
  }
};

export const escapeSpecialChars = (str: string): string => {
  return str
    .replaceAll('\n', '\\n')
    .replaceAll('\b', '\\b')
    .replaceAll('\f', '\\f')
    .replaceAll('\r', '\\r')
    .replaceAll('\t', '\\t');
};

export const toBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export const formatAddress = (address?: string, length = 10): string => {
  if (!address) return '';
  if (address.length < 14) return address;
  return `${address.substring(0, length)}`;
};

export const formatAddressDisplayName = (
  address?: string,
  length = 6
): string => {
  if (!address) return '';
  if (address.length <= length) {
    return address;
  }
  return `${address.substring(address.length - length, address.length)}`;
};

export const formatLongAddress = (address?: string): string => {
  if (!address) return '';
  if (address.length < 14) return address;
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4,
    address.length
  )}`;
};

export const getProjectIdFromTokenId = (tokenId: number): number => {
  return Math.floor(tokenId / 1000000);
};

export const formatTokenId = (tokenId: string): string => {
  const id = !isNaN(Number(tokenId)) ? Number(tokenId) % 1000000 : tokenId;
  return id.toString();
};

export const exponentialToDecimal = (exponential: number): string => {
  let decimal = exponential.toString().toLowerCase();
  if (decimal.includes('e+')) {
    const exponentialSplitted = decimal.split('e+');
    let postfix = '';
    for (
      let i = 0;
      i <
      +exponentialSplitted[1] -
        (exponentialSplitted[0].includes('.')
          ? exponentialSplitted[0].split('.')[1].length
          : 0);
      i++
    ) {
      postfix += '0';
    }
    const addCommas = (text: string): string => {
      let j = 3;
      let textLength = text.length;
      while (j < textLength) {
        text = `${text.slice(0, textLength - j)}, ${text.slice(
          textLength - j,
          textLength
        )}`;
        textLength++;
        j += 3 + 1;
      }
      return text;
    };
    decimal = addCommas(exponentialSplitted[0].replace('.', '') + postfix);
  }
  if (decimal.toLowerCase().includes('e-')) {
    const exponentialSplitted = decimal.split('e-');
    let prefix = '0.';
    for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
      prefix += '0';
    }
    decimal = prefix + exponentialSplitted[0].replace('.', '');
  }
  return decimal;
};

export const formatCurrency = (value: number): string => {
  function getDecimalPart(num: number): number {
    if (Number.isInteger(num)) {
      return 0;
    }

    const decimalStr = exponentialToDecimal(num).split('.')[1];
    return decimalStr.length;
  }

  const decimalLength = getDecimalPart(value);
  return value
    .toFixed(decimalLength > 2 ? decimalLength : 2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const tokenID = (tokenName: string) => tokenName.split('#')[1];

export const formatBTCPrice = (
  price: number | string,
  emptyStr?: string,
  precision = 5
): string => {
  if (!price) return emptyStr || '-';
  const priceNumb = new BigNumber(price).dividedBy(1e8).toNumber();
  return ceilPrecised(priceNumb, precision).toString().replace(',', '.');
};

export const formatPrice = (
  price: number | string,
  emptyStr?: string
): string => {
  if (!price) return emptyStr || '-';
  const priceNumb = new BigNumber(price).toNumber();
  return ceilPrecised(priceNumb, 4).toString().replace(',', '.');
};

// export const formatEthVolumePrice = (
//   price: string | null,
//   emptyStr?: string
// ): string => {
//   if (!price) return emptyStr || '-';
//   const priceNumb = new BigNumber(price).dividedBy(1e8).toNumber();
//   return ceilPrecised(priceNumb).toString().replace(',', '.');
// };

export const formatEthPrice = (
  price: string | number | null,
  emptyStr?: string
): string => {
  if (!price) return emptyStr || '-';
  return ceilPrecised(parseFloat(Web3.utils.fromWei(`${price}`, 'ether')), 4)
    .toString()
    .replace(',', '.');
};

export const formatEthPriceInput = (
  price: string | null,
  emptyStr?: string
): string => {
  if (!price) return emptyStr || '-';
  const priceNumb = new BigNumber(price).dividedBy(1e18).toNumber();
  return ceilPrecised(priceNumb, 4).toString().replace(',', '.');
};

export const ceilPrecised = (number: number, precision = 6) => {
  const power = Math.pow(10, precision);
  return Math.ceil(Number(number) * power) / power;
};

export const ellipsisCenter = (payload: {
  str: string;
  limit?: number;
  dots?: string;
}) => {
  const { str, limit = 5, dots = '...' } = payload;
  try {
    const size = str.length;
    if (size < limit * 2 + dots.length) {
      return str;
    }
    const leftStr = str.substring(0, limit);
    const rightStr = str.substring(size - limit, size);
    return leftStr + dots + rightStr;
  } catch {
    return str;
  }
};

export const formatWebDomain = (link: string): string => {
  return link ? new URL(link).hostname : '';
};

export const convertToSatoshiNumber = (amount: number | string): number => {
  if (!amount) throw 'Invalid amount';
  return new BigNumber(amount).multipliedBy(1e8).toNumber();
};

export const formatBTCOriginalPrice = (price: number | string): string => {
  if (!price) return '--';
  const priceNumb = new BigNumber(price).dividedBy(1e8);
  return priceNumb.toString().replace(',', '.');
};
