function darken(url: string) {
    return new Promise((resolve) => {
        const img = new Image()
        img.src = url;

        img.onload = () => {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the image onto the canvas
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);

            // Get the pixel data for the canvas
            const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
            if (imageData) {
                const data = imageData.data;

                // Loop through the pixel data and darken each pixel
                for (let i = 0; i < data.length; i += 4) {
                    // Get the red, green, and blue values for this pixel
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // Calculate the new, darker values for the red, green, and blue channels
                    const newR = r > 200 ? 255 : Math.floor(r * 0.1);
                    const newG = g > 200 ? 255 : Math.floor(g * 0.1);
                    const newB = b > 200 ? 255 : Math.floor(b * 0.1);

                    // Set the new values for the red, green, and blue channels
                    data[i] = newR;
                    data[i + 1] = newG;
                    data[i + 2] = newB;
                }

                // Put the modified pixel data back onto the canvas
                ctx?.putImageData(imageData, 0, 0);

                // Create a new image element from the canvas
                const newImg = new Image();
                newImg.src = canvas.toDataURL();
                // return newImg.src;
                resolve(newImg.src)
            }
            return null;
        }
    })
}

const FilterUtils = {
    darken
}

export default FilterUtils