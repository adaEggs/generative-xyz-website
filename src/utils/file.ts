import FileType from 'file-type/browser';
import { NAIVE_MIMES } from '@constants/file';
import { unzip } from 'unzipit';
import { MASOX_SYSTEM_PREFIX } from '@constants/sandbox';

export function getNaiveMimeType(filename: string): string | false {
  const ext = filename.split('.').pop();
  return (ext && NAIVE_MIMES[ext]) || false;
}

export async function unzipFile(file: File): Promise<Record<string, Blob>> {
  const { entries } = await unzip(file);

  const blobs: Record<string, Blob> = {};
  for (const name in entries) {
    if (name.includes(MASOX_SYSTEM_PREFIX)) {
      continue;
    }

    let mime = getNaiveMimeType(name);
    if (!mime) {
      const buffer = await entries[name].arrayBuffer();
      const type = await FileType.fromBuffer(buffer);
      if (type) {
        mime = type.mime;
      }
    }
    blobs[name] = await entries[name].blob(mime || undefined);
  }

  return blobs;
}

export const getFileExtensionByFileName = (fileName: string): string | null => {
  const fileExt = fileName.split('.').pop();
  return fileExt ?? null;
};

export const fileToBase64 = (
  file: File
): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export const blobToBase64 = (
  blob: File
): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
