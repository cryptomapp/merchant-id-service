import Jimp from "jimp";
import { getIrys } from "../irys/irysService";

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

export async function generateImage(id: number): Promise<string> {
  try {
    let image = await new Jimp(800, 800, 0xffffffff);

    const cellSize = 100;
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        let cell = await new Jimp(cellSize, cellSize, color);
        image.blit(cell, x * cellSize, y * cellSize);
      }
    }

    const blueprint = await Jimp.read("src/images/blueprint.png");
    blueprint.resize(800, 800);
    image.composite(blueprint, 0, 0);

    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
    const text = `MerchantID #${id}`;
    const textWidth = Jimp.measureText(font, text);
    const textHeight = Jimp.measureTextHeight(font, text, image.bitmap.width);
    image.print(
      font,
      image.bitmap.width / 2 - textWidth / 2,
      image.bitmap.height / 2 - textHeight / 2,
      text
    );

    // Convert the image to a buffer and upload it to Irys
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    const irys = await getIrys();
    const imageReceipt = await irys.upload(buffer);
    const imageUrl = `https://gateway.irys.xyz/${imageReceipt.id}`;
    return imageUrl; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error generating image:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}
