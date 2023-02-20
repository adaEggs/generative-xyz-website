import { CDN_URL } from '@constants/config';

type IMAGE_TYPE =
  | 'application/json' // iframe
  | 'application/pdf' // iframe
  | 'application/pgp-signature' // iframe
  | 'application/yaml' // iframe
  | 'audio/flac' // iframe
  | 'model/gltf-binary' // iframe
  | 'model/stl' // iframe
  | 'text/html;charset=utf-8' // iframe
  | 'text/plain;charset=utf-8' // iframe
  | 'audio/mpeg' // https://www.w3schools.com/html/html5_audio.asp
  | 'audio/wav' // https://www.w3schools.com/html/html5_audio.asp
  | 'image/apng' // Image
  | 'image/avif' // Image
  | 'image/gif' // Image
  | 'image/jpeg' // Image
  | 'image/png' // Image
  | 'image/svg+xml' // Image
  | 'image/webp' // Image
  | 'video/mp4' // https://www.w3schools.com/html/html5_video.asp
  | 'video/webm'; // https://www.w3schools.com/html/html5_video.asp

const WHITE_LIST = [
  {
    id: '4b12a6520340b8e24420f6ca5fc6f0ae72f625833cfc68b82633893e1121cce2i0',
    link: `${CDN_URL}/btc-projects/bc1pvdl6dfhxtxc70wazxjezte4c4ru6kv7uclx3pa8c9pzqx900epys32cafk/1676450389.html`,
  },
  {
    id: '81976b8e537219ab489ce3bc0c5bc1a68544edd4ee892d78e09180052b34f93bi0',
    link: `${CDN_URL}/btc-projects/bc1pp89sm70z4kwshnpw03feutfe2t4ufzl2ur6dd9vh03a5s00lxv3qvzmq6l/1676436908.html`,
  },
  {
    id: '77edc4068a1670eb02fc79a70fc52d1b5daad380f5d6509d5f88f046f7e4da62i0',
    link: `${CDN_URL}/btc-projects/bc1pumcqqqxgt8dd750v0xapyssjs30ua5jqdu4z9nf5qpd7fdqx6m3qgt0lcz/1676436909.html`,
  },
  {
    id: '7e33a57f0c46eface2ebc31e69f56c2acf726bf5b2284f291fcf80fae22649ddi0',
    link: `${CDN_URL}/btc-projects/bc1pvqr4r6nyzcppzk5hanrhnw4t0nrnmakw4j04equus7qf8mhtcnmsxs4crh/1676434163.html`,
  },
  {
    id: '9e0056956c0300e215e32f9106b47b5d30103501a80073cf9b3babecde7692c9i0',
    link: `${CDN_URL}/btc-projects/bc1pxrvuyx6vm4xgc7gkw84jwnrueh26t5yx68leexxjv4rrppes40jqmxh3e5/1676434164.html`,
  },
  {
    id: 'db642893fe091a73a3e79547f97c8434354ffe74df136dadd60ec9254bb16b60i0',
    link: `${CDN_URL}/btc-projects/bc1p0xgej5hq66ysq25tfq420k34wtmvuejwml3n4ekxhcdqnw80yezszrld9a/1676434165.html`,
  },
  {
    id: '8a68bc73d4a8d79b0cfe04284ffacaa2ba2a43526b4cf4994b460636c6dcf055i0',
    link: `${CDN_URL}/btc-projects/bc1p4axfajvfd3a9guf3valayprktg03zkzj0mvw0l7rh2y3ft4azupqrqljud/1676434166.html`,
  },
  {
    id: '490db5e9c50be204e0c0917c70bbcfc157e9dc585bb381b6c1784bb06831ad7di0',
    link: `${CDN_URL}/btc-projects/bc1pfjhn2xes45zvfe47k0t67ddh7kymyz6w7u4yypq4s0kundas3s2szxgwtj/1676434166.html`,
  },
  {
    id: '0c9fc39d1d21eaff0f8d1abd2d9dcabdb5fafc4b96fa22442e87c2fca7d0ecb4i0',
    link: `${CDN_URL}/btc-projects/bc1pjamp333dvctrewxne2zkmwfh2dgsc6cvk47ke845rcufldldqhxsvazxnl/1676434167.html`,
  },
  {
    id: 'a010a0133a955a50593eaee840b44e9c7e5f1ae962499c9f53739e26d37dc2aei0',
    link: `${CDN_URL}/btc-projects/bc1pkmc7m8556lqa5xwwxuxpakapduz49axkelavq3wa8f3pcr93l9rshks323/1676508041.html`,
  },
  {
    id: '12de31f79f06b4db0578ac937824c11f66a38d1615c69c237bca696b904448edi0',
    link: `${CDN_URL}/btc-projects/bc1pp8d2tr3z3w7jtegqq224ufnmyn8wuexdn92s26hyyjzhfxr79wxshjg4t5/1676508042.html`,
  },
  {
    id: '1f0347fa237df3ee89d688cf3c770f67e654a03e0dd6be2e5b2fcc3adfba6cf1i0',
    link: `${CDN_URL}/btc-projects/bc1p8x9rfgwu7yaee50svvtp9kz6ptnd3698srr08kygmxwvjz6zes3qql7ehl/1676509551.html`,
  },
];

export type { IMAGE_TYPE };
export { WHITE_LIST };
