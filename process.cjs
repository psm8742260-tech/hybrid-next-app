const Jimp = require('jimp');

async function processLogo() {
  const image = await Jimp.read('public/logo-original.jpg');
  
  const cx = image.bitmap.width / 2;
  const cy = image.bitmap.height / 2;
  
  let topY = -1;
  let bottomY = -1;
  let leftX = -1;
  let rightX = -1;
  
  for (let y = 0; y < image.bitmap.height; y++) {
    const color = Jimp.intToRGBA(image.getPixelColor(cx, y));
    if (color.r > 100 && color.g > 80 && color.b < 150) {
      if (topY === -1) topY = y;
      bottomY = y;
    }
  }
  
  for (let x = 0; x < image.bitmap.width; x++) {
    const color = Jimp.intToRGBA(image.getPixelColor(x, cy));
    if (color.r > 100 && color.g > 80 && color.b < 150) {
      if (leftX === -1) leftX = x;
      rightX = x;
    }
  }
  
  const width = rightX - leftX;
  const height = bottomY - topY;
  
  console.log("Image:", image.bitmap.width, "x", image.bitmap.height);
  console.log("Gold ring bounds:", {topY, bottomY, leftX, rightX});
  console.log("Center:", leftX + width/2, topY + height/2);
  console.log("Radius:", width/2, height/2);
}

processLogo().catch(console.error);
