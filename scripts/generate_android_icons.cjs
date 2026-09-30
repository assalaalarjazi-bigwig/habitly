const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const iconSrc = path.join(__dirname, '../src/assets/images/habitly_luxury_icon_1790757937883.jpg');
const splashSrc = path.join(__dirname, '../src/assets/images/habitly_splash_screen_1790757950509.jpg');
const resDir = path.join(__dirname, '../android/app/src/main/res');

console.log('Generating Android Icons & Splash Screens...');

// 1. Android Launcher Icons
const iconDensities = [
  { name: 'mipmap-mdpi', size: 48, fgSize: 108, innerSize: 72 },
  { name: 'mipmap-hdpi', size: 72, fgSize: 162, innerSize: 108 },
  { name: 'mipmap-xhdpi', size: 96, fgSize: 216, innerSize: 144 },
  { name: 'mipmap-xxhdpi', size: 144, fgSize: 324, innerSize: 216 },
  { name: 'mipmap-xxxhdpi', size: 192, fgSize: 432, innerSize: 288 },
];

for (const d of iconDensities) {
  const targetDir = path.join(resDir, d.name);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // A. Standard ic_launcher.png (Rounded square styling with high quality)
  const launcherPath = path.join(targetDir, 'ic_launcher.png');
  execSync(`convert "${iconSrc}" -resize ${d.size}x${d.size}\\! "${launcherPath}"`);

  // B. Circular ic_launcher_round.png
  const roundPath = path.join(targetDir, 'ic_launcher_round.png');
  const half = Math.floor(d.size / 2);
  execSync(`convert "${iconSrc}" -resize ${d.size}x${d.size}\\! \\( -size ${d.size}x${d.size} xc:none -fill white -draw "circle ${half},${half} ${half},1" \\) -compose DstIn -composite "${roundPath}"`);

  // C. Adaptive foreground ic_launcher_foreground.png
  const fgPath = path.join(targetDir, 'ic_launcher_foreground.png');
  execSync(`convert -size ${d.fgSize}x${d.fgSize} xc:none \\( "${iconSrc}" -resize ${d.innerSize}x${d.innerSize}\\! \\) -gravity center -composite "${fgPath}"`);

  console.log(`✓ Generated icons for ${d.name}`);
}

// 2. Android Native Splash Screens
const splashPortDensities = [
  { dir: 'drawable', w: 480, h: 800 },
  { dir: 'drawable-port-mdpi', w: 320, h: 480 },
  { dir: 'drawable-port-hdpi', w: 480, h: 800 },
  { dir: 'drawable-port-xhdpi', w: 720, h: 1280 },
  { dir: 'drawable-port-xxhdpi', w: 960, h: 1600 },
  { dir: 'drawable-port-xxxhdpi', w: 1280, h: 1920 },
];

for (const s of splashPortDensities) {
  const targetDir = path.join(resDir, s.dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const splashPath = path.join(targetDir, 'splash.png');
  execSync(`convert "${splashSrc}" -resize ${s.w}x${s.h}^ -gravity center -extent ${s.w}x${s.h} "${splashPath}"`);
  console.log(`✓ Generated portrait splash for ${s.dir} (${s.w}x${s.h})`);
}

const splashLandDensities = [
  { dir: 'drawable-land-mdpi', w: 480, h: 320 },
  { dir: 'drawable-land-hdpi', w: 800, h: 480 },
  { dir: 'drawable-land-xhdpi', w: 1280, h: 720 },
  { dir: 'drawable-land-xxhdpi', w: 1600, h: 960 },
  { dir: 'drawable-land-xxxhdpi', w: 1920, h: 1280 },
];

for (const s of splashLandDensities) {
  const targetDir = path.join(resDir, s.dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const splashPath = path.join(targetDir, 'splash.png');
  execSync(`convert "${splashSrc}" -resize ${s.w}x${s.h}^ -gravity center -extent ${s.w}x${s.h} "${splashPath}"`);
  console.log(`✓ Generated landscape splash for ${s.dir} (${s.w}x${s.h})`);
}

// 3. Web Public Assets (PWA & HTML)
const publicDir = path.join(__dirname, '../public');
if (fs.existsSync(publicDir)) {
  execSync(`convert "${iconSrc}" -resize 192x192\\! "${path.join(publicDir, 'icon-192.png')}"`);
  execSync(`convert "${iconSrc}" -resize 512x512\\! "${path.join(publicDir, 'icon-512.png')}"`);
  execSync(`convert "${splashSrc}" -resize 640x1136^ -gravity center -extent 640x1136 "${path.join(publicDir, 'splash-preview.png')}"`);
  console.log('✓ Generated public web icons & splash preview');
}

console.log('🎉 All Android app icons & splash screens successfully generated!');
