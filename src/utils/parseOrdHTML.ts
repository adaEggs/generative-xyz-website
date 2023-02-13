interface IInscriptionContent {
  index: string;
}

const getOrdContentByInscriptionID = (
  inscriptionID: string
): Promise<IInscriptionContent> => {
  return fetch(`https://ordinals.com/inscription/${inscriptionID}`)
    .then(response => response.text())
    .then(result => {
      const doc = new DOMParser().parseFromString(result, 'text/html');
      const links = doc.querySelectorAll('h1');
      let insIndex = '';
      if (links && links.length && links[0].innerText) {
        // ex: Inscription 71048
        const text = links[0].innerText;
        // ex: ['Inscription', '71048']
        const arr = text.split(' ');
        if (arr && arr.length === 2 && arr[1] && typeof arr[1] === 'string') {
          insIndex = arr[1]; // ex: 71048
        }
      }
      return Promise.resolve({
        index: insIndex,
      });
    })
    .catch(error => Promise.reject(error));
};

export { getOrdContentByInscriptionID };
