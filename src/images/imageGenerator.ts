import Jimp from "jimp";

// Define your colors (Hex strings are accepted by Jimp)
const colors = [
  "#fbf8cc",
  "#fde4cf",
  "#ffcfd2",
  "#f1c0e8",
  "#cfbaf0",
  "#a3c4f3",
  "#90dbf4",
  "#8eecf5",
  "#98f5e1",
];

async function generateImage(id: number): Promise<void> {
  try {
    // Create a new 800x800 image with white background
    let image = await new Jimp(800, 800, 0xffffffff);

    // Define size of each cell in the bitmap (8x8 grid on 800x800 image)
    const cellSize = 100; // 800/20

    // Populate the image with random colors, creating the bitmap
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        let cell = await new Jimp(cellSize, cellSize, color);
        image.blit(cell, x * cellSize, y * cellSize);
      }
    }

    // Load the blueprint image
    const blueprint = await Jimp.read("src/images/blueprint.png");
    blueprint.resize(800, 800); // Resize to fit the image
    image.composite(blueprint, 0, 0); // Composite the blueprint onto the image

    // Load a font
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

    // Calculate width of the text
    const text = `MerchantID #${id}`;
    const textWidth = Jimp.measureText(font, text);
    const textHeight = Jimp.measureTextHeight(font, text, image.bitmap.width);

    // Print the text on image (centered)
    image.print(
      font,
      image.bitmap.width / 2 - textWidth / 2, // x position
      image.bitmap.height / 2 - textHeight / 2, // y position
      text
    );

    // Save the image
    const outputPath = "output.jpg";
    await image.writeAsync(outputPath);
    console.log(`Image has been generated as ${outputPath}`);
  } catch (error) {
    console.error("Error generating image:", error);
  }
}

// Replace with a dynamic id or input
generateImage(1);
