export async function autoCropImageTo3x4(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Calculate the maximum 3:4 crop area
      const targetAspect = 3 / 4;
      const imgAspect = img.width / img.height;

      let cropWidth, cropHeight, cropX, cropY;

      if (imgAspect > targetAspect) {
        // Image is wider than 3:4, constrain height and crop width
        cropHeight = img.height;
        cropWidth = cropHeight * targetAspect;
        cropX = (img.width - cropWidth) / 2;
        cropY = 0;
      } else {
        // Image is taller than 3:4, constrain width and crop height
        cropWidth = img.width;
        cropHeight = cropWidth / targetAspect;
        cropX = 0;
        cropY = (img.height - cropHeight) / 2;
      }

      // Set canvas size to the cropped dimensions
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // Draw the cropped area to the canvas
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      // Export as WebP blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        'image/webp',
        0.85
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for cropping'));
    };

    img.src = url;
  });
}
