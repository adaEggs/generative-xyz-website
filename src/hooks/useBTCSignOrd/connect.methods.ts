import { ethers } from 'ethers';
import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import BIP32Factory from 'bip32';
import { Buffer } from 'buffer';
import bitcoinMessage from 'bitcoinjs-message';
import ECPairFactory from 'ecpair';

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);

const toXOnly = (pubKey: Buffer) =>
  pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);

const defaultPath = "m/86'/0'/0'/0/0";
const defaultPathSegwit = "m/84'/0'/0'/0/0";

// sign message with first sign transaction
const MESSAGE_TAP_R0OT =
  'Sign this message to generate your Bitcoin Taproot key. This key will be used for your generative.xyz transactions.';

const getBitcoinOrdKeySignContent = (message: string): Buffer => {
  return Buffer.from(message);
};

const generateBitcoinOrdKey = async ({
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
  const childSegwit = root.derivePath(defaultPathSegwit);
  const privateKeySegwit = childSegwit.privateKey;
  const keyPair = ECPair.fromPrivateKey(privateKeySegwit as Buffer);

  const signatureSegwit = bitcoinMessage.sign(
    messageSegwit,
    privateKeySegwit as Buffer,
    keyPair.compressed,
    { segwitType: 'p2wpkh' }
  );
  const { address: sendAddressSegwit, network: networkSegwit } =
    bitcoin.payments.p2wpkh({
      pubkey: keyPair.publicKey,
    });
  const messagePrefix = networkSegwit?.messagePrefix;
  // console.log('signer: ', {
  //   messageSegwit,
  //   sendAddressSegwit,
  //   messagePrefix,
  //   signatureSegwit,
  //   signatureSegwitBase64: signatureSegwit.toString('base64'),
  //   hash: bitcoinMessage.magicHash(sendAddressSegwit as string, messagePrefix),
  //   verify: bitcoinMessage.verify(
  //     messageSegwit,
  //     sendAddressSegwit as string,
  //     signatureSegwit,
  //     messagePrefix,
  //     true
  //   ),
  // });
  return {
    taproot: {
      privateKey: privateKeyTaproot,
      sendAddress: sendAddressTaproot,
      signature,
      message: MESSAGE_TAP_R0OT,
    },

    segwit: {
      privateKey: privateKeySegwit,
      sendAddress: sendAddressSegwit,
      signature: signatureSegwit,
      message: messageSegwit,
      messagePrefix,
    },
  };
};

export { generateBitcoinOrdKey, getBitcoinOrdKeySignContent };
