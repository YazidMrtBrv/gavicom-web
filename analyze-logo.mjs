import { loadImage, createCanvas } from '@napi-rs/canvas';

const img = await loadImage('public/logo-gavicom.png');
const canvas = createCanvas(img.width, img.height);
const ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0);
const data = ctx.getImageData(0, 0, img.width, img.height).data;

// Count non-transparent and bright vs dark pixels
let totalPixels = 0;
let nonTransparent = 0;
let bright = 0;
let dark = 0;

for (let i = 0; i < data.length; i += 4) {
  totalPixels++;
  const a = data[i + 3];
  if (a > 0) {
    nonTransparent++;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const brightness = (r + g + b) / 3;
    if (brightness < 50) dark++;
    else bright++;
  }
}

console.log('Image size:', img.width, 'x', img.height);
console.log('Total pixels:', totalPixels);
console.log('Non-transparent:', nonTransparent, (nonTransparent / totalPixels * 100).toFixed(1) + '%');
console.log('Bright (non-transparent):', bright);
console.log('Dark (non-transparent):', dark);

// Get average color of non-transparent pixels
let sumR = 0, sumG = 0, sumB = 0, count = 0;
for (let i = 0; i < data.length; i += 4) {
  if (data[i + 3] > 0) {
    sumR += data[i];
    sumG += data[i + 1];
    sumB += data[i + 2];
    count++;
  }
}
console.log('Average color:', (sumR/count).toFixed(0), (sumG/count).toFixed(0), (sumB/count).toFixed(0));
