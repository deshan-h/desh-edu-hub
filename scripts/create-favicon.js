const fs = require('fs');
const path = require('path');

// 1. Read the newly generated 192x192 rounded 3D metallic icon
const pngBuffer = fs.readFileSync('public/icon-192.png');
const base64Png = pngBuffer.toString('base64');

// 2. Generate SVG with embedded high-res 3D metallic emblem
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192">
  <image href="data:image/png;base64,${base64Png}" width="192" height="192" />
</svg>
`;

fs.writeFileSync('src/app/icon.svg', svgContent, 'utf8');
fs.writeFileSync('public/icon.svg', svgContent, 'utf8');
fs.writeFileSync('public/favicon.svg', svgContent, 'utf8');
console.log('Updated icon.svg and public/icon.svg with 3D metallic emblem.');

// 3. Also copy png to src/app/icon.png and src/app/apple-icon.png
fs.copyFileSync('public/icon-192.png', 'src/app/icon.png');
fs.copyFileSync('public/apple-touch-icon.png', 'src/app/apple-icon.png');
console.log('Copied icon.png to src/app/');

