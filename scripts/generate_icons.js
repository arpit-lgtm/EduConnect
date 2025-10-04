const Jimp = require('jimp');
const path = require('path');

const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

async function generateIcons() {
  try {
    console.log('Loading source icon...');
    const sourceIcon = await Jimp.read('./assets/icon_source.png');
    
    for (const [folder, size] of Object.entries(sizes)) {
      console.log(`Generating ${size}x${size} icon for ${folder}...`);
      
      // Resize and save regular launcher icon
      const resized = sourceIcon.clone().resize(size, size);
      await resized.writeAsync(`./android/app/src/main/res/${folder}/ic_launcher.png`);
      
      // Also save as round icon
      await resized.writeAsync(`./android/app/src/main/res/${folder}/ic_launcher_round.png`);
    }
    
    console.log('✅ All launcher icons generated successfully!');
    console.log('Now rebuild your APK to see the new icons.');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

generateIcons();