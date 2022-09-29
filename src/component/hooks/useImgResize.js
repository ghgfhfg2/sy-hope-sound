import imageCompression from "browser-image-compression";

export const imageResize = async (file, size) => {
  if (!file || !size) {
    return;
  }
  if (file.type === "image/svg+xml") {
    return file;
  }
  const options = {
    maxWidthOrHeight: size,
    fileType: file.type,
  };
  try {
    const compressedFile = await imageCompression(file, options);
    const promise = imageCompression.getDataUrlFromFile(compressedFile);
    return promise;
  } catch (error) {
    console.log(error);
  }
};

export default function useImgResize(file, size) {
  //이미지 리사이즈
  const imageResize = async (file, size) => {
    if (!file || !size) {
      return;
    }
    if (file.type === "image/svg+xml") {
      return file;
    }
    const options = {
      maxWidthOrHeight: size,
      fileType: file.type,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const promise = imageCompression.getDataUrlFromFile(compressedFile);
      return promise;
    } catch (error) {
      console.log(error);
    }
  };

  return imageResize(file, size);
}
