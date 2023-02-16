import { ethers } from 'ethers';
import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import BIP32Factory from 'bip32';
import { Buffer } from 'buffer';

import {
  ExternalProvider,
  JsonRpcFetchFunc,
} from '@ethersproject/providers/src.ts/web3-provider';

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);
const toXOnly = (pubKey: Buffer) =>
  pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);
const defaultPath = "m/86'/0'/0'/0/0";

const getBitcoinOrdKeySignContent = (message: string): Buffer => {
  // return Buffer.from(
  //   'Sign this message to generate your Bitcoin Taproot key. This key will be used for your generative.xyz transactions.\n\nNOTE: make sure you trust this application'
  // );
  return Buffer.from(message);
};

const generateBitcoinOrdKey = async ({
  address,
  message,
}: {
  address: string;
  message: string;
}) => {
  const provider = new ethers.providers.Web3Provider(
    window.ethereum as ExternalProvider | JsonRpcFetchFunc
  );
  const toSign = '0x' + getBitcoinOrdKeySignContent(message).toString('hex');
  const result = await provider.send('personal_sign', [
    toSign,
    address.toString(),
  ]);
  const private_key = ethers.utils.arrayify(
    ethers.utils.keccak256(ethers.utils.arrayify(result))
  );
  const root = bip32.fromSeed(Buffer.from(private_key));
  const child0 = root.derivePath(defaultPath);
  const { address: sendAddress } = bitcoin.payments.p2tr({
    internalPubkey: toXOnly(child0.publicKey),
  });

  return {
    privateKey: child0.privateKey,
    address: sendAddress,
    signature: result,
  };
};

export { generateBitcoinOrdKey, getBitcoinOrdKeySignContent };
