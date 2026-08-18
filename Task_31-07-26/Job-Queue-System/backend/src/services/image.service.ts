interface ImageJobData {
  imageName: string;
}

export const processImage = async (
  data: ImageJobData
): Promise<void> => {
  console.log(`Processing image: ${data.imageName}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log(`Image processed: ${data.imageName}`);
};