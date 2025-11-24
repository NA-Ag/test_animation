// Local Image Processing Service
// Runs 100% in the browser using HTML5 Canvas. Privacy first, no data leaves the device.

export const processCleanup = async (
  base64Image: string, 
  threshold: number = 128, 
  mode: 'bw' | 'blue' = 'bw'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple thresholding algorithm
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const avg = (r + g + b) / 3;

        if (avg < threshold) {
          // Dark pixel (The Line)
          if (mode === 'blue') {
            // Convert to Non-Photo Blue (approx R:164, G:221, B:237 or similar)
            // Let's use a nice sketching blue
            data[i] = 70;   // R
            data[i + 1] = 130; // G
            data[i + 2] = 255; // B
          } else {
            // Pure Black
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
          }
        } else {
          // Light pixel (The Paper)
          // Make it pure white
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = base64Image;
  });
};

export const processLineExtraction = async (
  base64Image: string, 
  threshold: number = 200
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Alpha extraction algorithm
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const avg = (r + g + b) / 3;

        // If the pixel is white (paper), make it transparent
        if (avg > threshold) {
          data[i + 3] = 0; // Alpha = 0
        } else {
          // Ensure line is solid black for clean coloring
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 255; // Full opacity
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = base64Image;
  });
};
