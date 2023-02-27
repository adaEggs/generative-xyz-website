import { ethers } from 'ethers';
import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import BIP32Factory from 'bip32';
import { Buffer } from 'buffer';
import * as Segwit from 'segwit';

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

const toXOnly = (pubKey: Buffer) =>
  pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);

const defaultPath = "m/86'/0'/0'/0/0";

// sign message with first sign transaction
const TAPROOT_MESSAGE =
  'Sign this message to generate your Bitcoin Taproot key. This key will be used for your generative.xyz transactions.';

const getBitcoinKeySignContent = (message: string): Buffer => {
  return Buffer.from(message);
};

export const generateBitcoinTaprootKey = async (address: string) => {
  const provider = new ethers.providers.Web3Provider(
    window.ethereum as ethers.providers.ExternalProvider
  );
  const toSign =
    '0x' + getBitcoinKeySignContent(TAPROOT_MESSAGE).toString('hex');
  const signature = await provider.send('personal_sign', [
    toSign,
    address.toString(),
  ]);
  const seed = ethers.utils.arrayify(
    ethers.utils.keccak256(ethers.utils.arrayify(signature))
  );
  const root = bip32.fromSeed(Buffer.from(seed));

  // Taproot
  const taprootChild = root.derivePath(defaultPath);
  const { address: taprootAddress } = bitcoin.payments.p2tr({
    internalPubkey: toXOnly(taprootChild.publicKey),
  });

  return {
    root,
    taprootChild,
    address: taprootAddress,
    signature,
  };
};

const generateBitcoinKey = async ({
  address,
  message: messageSegwit, // sign message with second sign transaction
}: {
  address: string;
  message: string;
}) => {
  const {
    root,
    address: sendTaprootAddress,
    signature,
  } = await generateBitcoinTaprootKey(address);

  // Segwit
  const signSegwit = await Segwit.signBitcoinSegwitKey({
    signMessage: messageSegwit,
    root,
  });

  return {
    taproot: {
      sendAddress: sendTaprootAddress,
      signature,
      message: TAPROOT_MESSAGE,
    },

    segwit: {
      sendAddress: signSegwit.address,
      signature: signSegwit.signature,
      message: signSegwit.message,
      messagePrefix: signSegwit.messagePrefix,
    },
  };
};

export { generateBitcoinKey, getBitcoinKeySignContent };
