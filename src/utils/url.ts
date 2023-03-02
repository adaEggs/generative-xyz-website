export const isImageURL = (url: string): boolean => {
  return (
    url.match(
      /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp|bmp|ico|cur|tif|tiff)$/
    ) !== null
  );
};
