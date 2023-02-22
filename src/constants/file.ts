import { MediaType } from '@enums/file';

export const ZIP_MIMES = [
  'application/zip',
  'application/x-zip-compressed',
  'multipart/x-zip',
];

export const NAIVE_MIMES: Record<string, string> = {
  html: 'text/html',
  js: 'text/javascript',
  css: 'text/css',
  csv: 'text/csv',
};

export const JS_EXTENSION = 'js';
export const HTML_EXTENSION = 'html';
export const CSS_EXTENSION = 'css';

export const SUPPORTED_FILE_EXT: Array<{ mediaType: MediaType; ext: string }> =
  [
    {
      mediaType: MediaType.IMAGE,
      ext: 'jpg',
    },
    {
      mediaType: MediaType.IMAGE,
      ext: 'jpeg',
    },
    {
      mediaType: MediaType.IMAGE,
      ext: 'png',
    },
    {
      mediaType: MediaType.IMAGE,
      ext: 'gif',
    },
    {
      mediaType: MediaType.IMAGE,
      ext: 'svg',
    },
    {
      mediaType: MediaType.IMAGE,
      ext: 'webp',
    },
    {
      mediaType: MediaType.IMAGE,
      ext: 'apng',
    },
    {
      mediaType: MediaType.MODEL_3D,
      ext: 'glb',
    },
    {
      mediaType: MediaType.VIDEO,
      ext: 'mp4',
    },
    {
      mediaType: MediaType.VIDEO,
      ext: 'webm',
    },
    {
      mediaType: MediaType.AUDIO,
      ext: 'flac',
    },
    {
      mediaType: MediaType.AUDIO,
      ext: 'mp3',
    },
    {
      mediaType: MediaType.AUDIO,
      ext: 'wav',
    },
  ];
