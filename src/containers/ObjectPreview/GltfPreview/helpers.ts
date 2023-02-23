// Base64 to Blob
export function base64ToBlob(base64: string, mime: string) {
  mime = mime || '';
  const sliceSize = 1024;
  const byteChars = window.atob(base64);
  const byteArrays = [];
  for (
    let offset = 0, len = byteChars.length;
    offset < len;
    offset += sliceSize
  ) {
    const slice = byteChars.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: mime });
}

// Data URL to BLOB
export function dataURItoBlob(dataURI: string) {
  const byteString = dataURI.split(',')[1];
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  return base64ToBlob(byteString, mimeString);
}

export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function getRandomSign() {
  return Math.round(Math.random()) * 2 - 1;
}

export function getDebugMode(): boolean {
  const params = new URLSearchParams(window.location.search);
  if (params.has('debug')) {
    return params.get('debug') === 'true';
  }
  return false;
}

export const promiseCounting = <T>(func: Promise<T>, callback: () => void) => {
  return new Promise(resolve => {
    func.then(() => {
      callback();
      resolve(true);
    });
  });
};

export const promiseAllCounting = <T>(
  values: Array<Promise<T>>,
  totalCounter: (total: number) => void,
  counter: (doneStep: number) => void
): Promise<T[]> => {
  totalCounter(values.length);

  let counting = 0;
  const callback = () => {
    counting += 1;
    counter(counting);
  };
  return new Promise(resolve => {
    const wrapper = values.map(v => promiseCounting(v, callback));
    Promise.all(wrapper).then(results => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve(results as any);
    });
  });
};
