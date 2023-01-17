export const openMetamaskDeeplink = (): void => {
  const appURL = window.location.hostname
    .replace(/^https?:\/\//, '')
    .replace('/', '');
  const deeplink = `https://metamask.app.link/dapp/${appURL}`;
  window.location.href = deeplink;
};
