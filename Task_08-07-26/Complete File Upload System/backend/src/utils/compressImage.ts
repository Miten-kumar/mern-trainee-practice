import sharp from "sharp";
import fs from "fs";
import path from "path";

const compressImage = async (
  imagePath: string
) => {
  const outputPath = path.join(
    path.dirname(imagePath),
    "compressed-" + path.basename(imagePath)
  );

  await sharp(imagePath)
    .resize({
      width: 1200,
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 80,
    })
    .toFile(outputPath);

  // Delete original image
  fs.unlinkSync(imagePath);

  return outputPath;
};

export default compressImage;