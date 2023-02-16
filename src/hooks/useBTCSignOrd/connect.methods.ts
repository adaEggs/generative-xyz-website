import { ethers } from 'ethers';
import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import BIP32Factory from 'bip32';
import { Buffer } from 'buffer';
import bitcoinMessage from 'bitcoinjs-message';
import { randomBytes } from 'crypto';

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);
const toXOnly = (pubKey: Buffer) =>
  pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);
const defaultPath = "m/86'/0'/0'/0/0";

// sign message with first sign transaction
const MESSAGE_0 =
  'Sign this message to generate your Bitcoin Taproot key. This key will be used for your generative.xyz transactions.\\n\\nNOTE: make sure you trust this application';

const getBitcoinOrdKeySignContent = (message: string): Buffer => {
  return Buffer.from(message);
};

const generateBitcoinOrdKey = async ({
  address,
  message: message_1, // sign message with second sign transaction
}: {
  address: string;
  message: string;
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const toSign = '0x' + getBitcoinOrdKeySignContent(MESSAGE_0).toString('hex');
  const signature_0 = await provider.send('personal_sign', [
    toSign,
    address.toString(),
  ]);

  const private_key = ethers.utils.arrayify(
    ethers.utils.keccak256(ethers.utils.arrayify(signature_0))
  );

  const root = bip32.fromSeed(Buffer.from(private_key));

  const child0 = root.derivePath(defaultPath);
  const { address: sendAddress } = bitcoin.payments.p2tr({
    internalPubkey: toXOnly(child0.publicKey),
  });

  const pubkey = child0.publicKey.toString('base64');
  const privateKey = child0.privateKey;

  let signature_1 = '';
  if (privateKey) {
    signature_1 = bitcoinMessage
      .sign(message_1, privateKey, true, {
        extraEntropy: randomBytes(32),
      })
      .toString('base64');
  }

  return {
    privateKey: child0.privateKey,
    address: sendAddress,

    pubkey,
    message_0: MESSAGE_0,
    message_1,

    signature_0,
    signature_1,
  };
};

export { generateBitcoinOrdKey, getBitcoinOrdKeySignContent };
