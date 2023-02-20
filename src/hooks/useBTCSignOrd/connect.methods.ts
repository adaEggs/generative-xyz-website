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
const MESSAGE_TAP_R0OT =
  'Sign this message to generate your Bitcoin Taproot key. This key will be used for your generative.xyz transactions.';

const getBitcoinOrdKeySignContent = (message: string): Buffer => {
  return Buffer.from(message);
};

const generateBitcoinKey = async ({
  address,
  message: messageSegwit, // sign message with second sign transaction
}: {
  address: string;
  message: string;
}) => {
  const provider = new ethers.providers.Web3Provider(
    window.ethereum as ethers.providers.ExternalProvider
  );
  const toSign =
    '0x' + getBitcoinOrdKeySignContent(MESSAGE_TAP_R0OT).toString('hex');
  const signature = await provider.send('personal_sign', [
    toSign,
    address.toString(),
  ]);

  const private_key = ethers.utils.arrayify(
    ethers.utils.keccak256(ethers.utils.arrayify(signature))
  );

  const root = bip32.fromSeed(Buffer.from(private_key));

  // Taproot
  const childTaproot = root.derivePath(defaultPath);
  const { address: sendAddressTaproot } = bitcoin.payments.p2tr({
    internalPubkey: toXOnly(childTaproot.publicKey),
  });
  const privateKeyTaproot = childTaproot.privateKey;

  // Segwit
  const signSegwit = await Segwit.signBitcoinSegwitKey({
    signMessage: messageSegwit,
    root,
  });
  return {
    taproot: {
      privateKey: privateKeyTaproot,
      sendAddress: sendAddressTaproot,
      signature,
      message: MESSAGE_TAP_R0OT,
    },

    segwit: {
      privateKey: signSegwit.privateKey,
      sendAddress: signSegwit.address,
      signature: signSegwit.signature,
      message: messageSegwit,
      messagePrefix: signSegwit.signMessagePrefix,
    },
  };
};

export { generateBitcoinKey, getBitcoinOrdKeySignContent };
