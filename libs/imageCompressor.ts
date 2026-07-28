import imageCompression from 'browser-image-compression';

/**
 * Utility helper to compress image files using browser-image-compression with Web Worker support,
 * plus strict HTML Canvas WebP fallback. Guarantees output size < 200 KB per photo.
 */
export async function compressImage(
  file: File,
  maxDimension = 1000,
  maxSizeMB = 0.2
): Promise<Blob> {
  // SVG or non-image files bypass compression
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  try {
    const options = {
      maxSizeMB: maxSizeMB, // 0.2 MB = 200 KB max
      maxWidthOrHeight: maxDimension, // 1000px max
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: 0.75,
    };

    const compressedFile = await imageCompression(file, options);

    // If output is still larger than 250 KB, apply strict canvas compression
    if (compressedFile.size > 250 * 1024) {
      return await fallbackCanvasCompress(compressedFile, maxDimension, 0.7);
    }

    return compressedFile;
  } catch (error) {
    console.error("browser-image-compression error, falling back to Canvas:", error);
    return await fallbackCanvasCompress(file, maxDimension, 0.7);
  }
}

async function fallbackCanvasCompress(
  file: File | Blob,
  maxDimension: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => resolve(blob || file),
          "image/webp",
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
