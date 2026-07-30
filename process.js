const Jimp = require('jimp');

async function processLogo() {
  const image = await Jimp.read('public/logo-original.jpg');
  console.log("Width:", image.bitmap.width, "Height:", image.bitmap.height);
  
  // Find the extents of the gold ring (which is a bit dark gold)
  // Let's just find the bounding box of non-blue pixels in the center area.
  // Actually, I can just generate a transparent PNG!
  
  // Let's just create a new transparent PNG
  const newImg = new Jimp(image.bitmap.width, image.bitmap.height);
  
  const cx = image.bitmap.width / 2;
  const cy = image.bitmap.height / 2;
  
  // By manual estimation, the radius of the gold ring is about 40-45% of the width.
  // Let's measure the exact pixel of the top edge of the gold ring.
  let topY = -1;
  let bottomY = -1;
  let leftX = -1;
  let rightX = -1;
  
  for (let y = 0; y < image.bitmap.height; y++) {
    const color = Jimp.intToRGBA(image.getPixelColor(cx, y));
    // Gold ring has some red/green, low blue. Blue background is mostly blue.
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
  
  console.log("Gold ring bounds (est):", {topY, bottomY, leftX, rightX});
  
  const width = rightX - leftX;
  const height = bottomY - topY;
  const actualCx = leftX + width/2;
  const actualCy = topY + height/2;
  const radius = Math.max(width, height) / 2;
  
  console.log("Center:", actualCx, actualCy, "Radius:", radius);
  
  // Now copy pixels within this radius to new transparent image
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const dx = x - actualCx;
    const dy = y - actualCy;
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    if (distance <= radius + 2) { // Add 2 pixels for anti-aliasing margin
      const rgba = Jimp.intToRGBA(image.getPixelColor(x, y));
      newImg.setPixelColor(Jimp.rgbaToInt(rgba.r, rgba.g, rgba.b, rgba.a), x, y);
    } else {
      newImg.setPixelColor(0x00000000, x, y);
    }
  });
  
  // Crop it tightly
  newImg.crop(actualCx - radius, actualCy - radius, radius * 2, radius * 2);
  
  await newImg.writeAsync('public/logo-transparent.png');
  console.log("Successfully created logo-transparent.png");
}

processLogo().catch(console.error);
