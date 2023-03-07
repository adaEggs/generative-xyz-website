import { SANDBOX_BTC_IMAGE_SIZE_LIMIT } from '@constants/config';
import {
  HTML_EXTENSION,
  JS_EXTENSION,
  NAIVE_MIMES,
  ZIP_MIMES,
} from '@constants/file';
import { THIRD_PARTY_SCRIPTS } from '@constants/mint-generative';
import {
  SNIPPET_CONTRACT_CODE_SELECTOR,
  SNIPPET_RANDOM_CODE_SELECTOR,
} from '@constants/sandbox';
import {
  SNIPPET_CONTRACT_HTML,
  SNIPPET_RANDOM_HTML,
} from '@constants/snippet-html';
import { LogLevel } from '@enums/log-level';
import { ImageFileError, SandboxFileError } from '@enums/sandbox';
import {
  ImageCollectionFiles,
  SandboxFileContent,
  SandboxFiles,
} from '@interfaces/sandbox';
import { minifyFile } from '@services/file';
import {
  getFileExtensionByFileName,
  getSupportedFileExtList,
  unzipFile,
} from '@utils/file';
import { utf8ToBase64 } from '@utils/format';
import log from '@utils/logger';
import FileType from 'file-type/browser';

const LOG_PREFIX = 'SandboxUtil';

export const processSandboxZipFile = async (
  file: File
): Promise<SandboxFiles> => {
  const fileType = await FileType.fromBlob(file);

  if (!fileType || !ZIP_MIMES.includes(fileType.mime)) {
    throw Error(SandboxFileError.WRONG_FORMAT);
  }

  let files: Record<string, Blob>;
  try {
    files = await unzipFile(file);
  } catch (err) {
    throw Error(SandboxFileError.FAILED_UNZIP);
  }

  if (!files['index.html']) {
    throw Error(SandboxFileError.NO_INDEX_HTML);
  }

  const indexContents = await files['index.html'].text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(indexContents, 'text/html');

  const snippetContract = doc.querySelector(SNIPPET_CONTRACT_CODE_SELECTOR);
  if (!snippetContract) {
    throw Error(SandboxFileError.NO_SNIPPET_CONTRACT);
  }
  snippetContract.innerHTML = SNIPPET_CONTRACT_HTML;

  const snippetRandom = doc.querySelector(SNIPPET_RANDOM_CODE_SELECTOR);
  if (!snippetRandom) {
    throw Error(SandboxFileError.NO_SNIPPET_RANDOM);
  }
  snippetRandom.innerHTML = SNIPPET_RANDOM_HTML;

  const newIndexContents = doc.documentElement.outerHTML;
  files['index.html'] = new Blob([newIndexContents], { type: 'text/html' });

  const record: SandboxFiles = {};

  for (const name in files) {
    if (name.slice(-4) === '.svg') {
      files[name] = files[name].slice(0, files[name].size, 'image/svg+xml');
    }
    record[name] = {
      url: URL.createObjectURL(files[name]),
    };
    if (name === 'index.html') {
      record[name].blob = files[name];
    }
  }

  return record;
};

export const readSandboxFileContent = async (
  sandBoxFiles: SandboxFiles
): Promise<SandboxFileContent> => {
  const fileContents: SandboxFileContent = {};

  for (const [fileName, { url }] of Object.entries(sandBoxFiles)) {
    const fileExt = getFileExtensionByFileName(fileName);
    if (fileExt && url) {
      const blob = await fetch(url);
      let fileContent = await blob.text();

      if (fileExt === JS_EXTENSION) {
        let minifiedContent = fileContent;
        try {
          const { files: minifiedFiles } = await minifyFile({
            files: {
              [`${fileName}`]: {
                mediaType: NAIVE_MIMES.js,
                content: utf8ToBase64(fileContent),
              },
            },
          });
          minifiedContent = minifiedFiles[fileName].deflate
            ? minifiedFiles[fileName].deflate
            : minifiedFiles[fileName].content;
        } catch (err: unknown) {
          log(err as Error, LogLevel.ERROR, LOG_PREFIX);
        }

        fileContent = `<script>${minifiedContent}</script>`;
      }

      if (fileContents[fileExt]) {
        fileContents[fileExt] = [...fileContents[fileExt], fileContent];
      } else {
        fileContents[fileExt] = [fileContent];
      }
    }
  }

  return fileContents;
};

export const detectUsedLibs = async (
  sandBoxFiles: SandboxFiles
): Promise<Array<string>> => {
  let detectedLibs: Array<string> = [];

  for (const [fileName, { url }] of Object.entries(sandBoxFiles)) {
    const fileExt = getFileExtensionByFileName(fileName);
    if (fileExt && url) {
      const blob = await fetch(url);
      const fileContent = await blob.text();

      if (fileExt === HTML_EXTENSION) {
        const commentCodes = fileContent.match(/<!--(?:.|\n|\r)*?-->/g);
        const scriptCode = fileContent.match(
          /<script ([^>]*src="(.*(cdn)+.*)")*><\/script>/g
        );

        if (scriptCode) {
          const usedScripts = scriptCode.filter((script: string) => {
            if (commentCodes) {
              return !commentCodes.some((commentScript: string) =>
                commentScript.includes(script)
              );
            }
            return true;
          });

          detectedLibs = usedScripts
            .map((script: string) => {
              return (
                THIRD_PARTY_SCRIPTS.find(lib => {
                  return JSON.parse(JSON.stringify(lib.script)) === script;
                })?.value ?? ''
              );
            })
            .filter((script: string | null) => script !== '');
        }
      }
    }
  }

  return detectedLibs;
};

export const processCollectionZipFile = async (
  file: File
): Promise<ImageCollectionFiles> => {
  const fileType = await FileType.fromBlob(file);

  if (!fileType || !ZIP_MIMES.includes(fileType.mime)) {
    throw Error(SandboxFileError.WRONG_FORMAT);
  }

  let files: Record<string, Blob>;
  try {
    files = await unzipFile(file);
  } catch (err) {
    throw Error(SandboxFileError.FAILED_UNZIP);
  }

  const record: ImageCollectionFiles = {};
  const fileExtList = new Set();

  for (const fileName in files) {
    const file = files[fileName];
    let error = null;

    // Check file extension
    const fileExt = getFileExtensionByFileName(fileName) ?? '';
    // const fileMediaType = getMediaTypeFromFileExt(fileExt);

    fileExtList.add(fileExt);
    if (fileExtList.size > 1) {
      throw Error(ImageFileError.TOO_MANY_EXT);
    }

    if (
      !fileExt ||
      !getSupportedFileExtList().includes(fileExt.toLowerCase())
    ) {
      error = ImageFileError.INVALID_EXTENSION;
    }

    // Check file size is smaller than SANDBOX_BTC_IMAGE_SIZE_LIMIT
    const fileSizeInKb = file.size / 1024;
    if (
      // fileMediaType === MediaType.IMAGE &&
      fileSizeInKb > SANDBOX_BTC_IMAGE_SIZE_LIMIT
    ) {
      error = ImageFileError.TOO_LARGE;
    }
    // else if (
    //   fileMediaType !== MediaType.IMAGE &&
    //   fileSizeInKb > SANDBOX_BTC_IMAGE_SIZE_LIMIT
    // ) {
    //   error = ImageFileError.TOO_LARGE;
    // }

    record[fileName] = {
      blob: file,
      error,
      url: URL.createObjectURL(files[fileName]),
    };
  }

  return record;
};

export const processHTMLFile = async (file: File): Promise<SandboxFiles> => {
  const fileName = file.name;
  const fileExt = getFileExtensionByFileName(fileName);

  // Check file extension
  if (!fileExt || fileExt !== HTML_EXTENSION) {
    throw Error(SandboxFileError.WRONG_FORMAT);
  }

  // Check file size is smaller than SANDBOX_BTC_IMAGE_SIZE_LIMIT
  const fileSizeInKb = file.size / 1024;
  if (fileSizeInKb > SANDBOX_BTC_IMAGE_SIZE_LIMIT) {
    throw Error(SandboxFileError.TOO_LARGE);
  }

  const indexContents = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(indexContents, 'text/html');

  const newIndexContents = doc.documentElement.outerHTML;
  const blobHtml = new Blob([newIndexContents], { type: 'text/html' });

  const record: SandboxFiles = {
    ['index.html']: {
      blob: blobHtml,
      url: URL.createObjectURL(file),
    },
  };

  return record;
};
