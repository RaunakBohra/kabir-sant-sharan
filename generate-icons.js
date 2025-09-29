const { createCanvas } = require('canvas');
const fs = require('fs');

function createSpiritualIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  gradient.addColorStop(0, '#059669'); // Teal center
  gradient.addColorStop(1, '#047857'); // Darker teal edge

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Add subtle border
  ctx.strokeStyle = '#065f46';
  ctx.lineWidth = size * 0.02;
  ctx.strokeRect(0, 0, size, size);

  // Draw lotus-like symbol in center
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.5}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Draw "कबीर" (Kabir in Devanagari) or "K" as fallback
  try {
    ctx.fillText('कबीर', size/2, size/2);
  } catch (e) {
    // Fallback to "K" if Devanagari not supported
    ctx.font = `bold ${size * 0.6}px Arial, sans-serif`;
    ctx.fillText('K', size/2, size/2);
  }

  // Add subtle inner glow
  ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
  ctx.shadowBlur = size * 0.05;
  ctx.fillText('K', size/2, size/2);

  return canvas.toBuffer('image/png');
}

// Create all required icon sizes
const iconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' }
];

iconSizes.forEach(({ size, name }) => {
  const buffer = createSpiritualIcon(size);
  fs.writeFileSync(`public/${name}`, buffer);
  console.log(`Created ${name} (${size}x${size})`);
});

// Create ICO file for favicon
const ico16 = createSpiritualIcon(16);
const ico32 = createSpiritualIcon(32);
fs.writeFileSync('public/favicon.ico', ico32); // Use 32px as main favicon

console.log('All PWA icons created successfully!');