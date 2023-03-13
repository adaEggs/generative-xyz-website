import { UTXO } from 'generative-sdk';

const getUTXOKey = (utxo: UTXO) => {
  let txIDKey = utxo.tx_hash.concat(':');
  txIDKey = txIDKey.concat(utxo.tx_output_n.toString());
  return txIDKey;
};

export { getUTXOKey };
