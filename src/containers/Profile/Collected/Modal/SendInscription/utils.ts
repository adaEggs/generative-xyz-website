const getStorageKey = (insID: string) => {
  return `${insID}-storage-send-inscription`;
};

const getStorage = (insID: string) => {
  const key = getStorageKey(insID);
  const time = localStorage.getItem(key);
  const expiredTime = 60 * 30 * 1000;
  if (!!time && new Date().getTime() - Number(time) > expiredTime) {
    localStorage.removeItem(key);
    return null;
  }
  return time;
};

const setStorage = (insID: string) => {
  const key = getStorageKey(insID);
  localStorage.setItem(key, new Date().getTime().toString());
};

export { getStorageKey, getStorage, setStorage };
