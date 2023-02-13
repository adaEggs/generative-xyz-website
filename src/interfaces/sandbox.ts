import { ImageFileError } from '@enums/sandbox';

export type SandboxFiles = Record<string, { blob?: Blob; url: string }>;

export type SandboxFileContent = Record<string, Array<string>>;

export interface ISandboxRef {
  reloadIframe: () => void;
  getHtmlIframe: () => HTMLIFrameElement | null;
}

export type RawTokenAttributes = Record<string, string | number | boolean>;

export type ImageCollectionFiles = Record<
  string,
  {
    error: ImageFileError | null;
    url: string;
    blob: Blob;
  }
>;
