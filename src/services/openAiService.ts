import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { config } from "../config";

// Load and optimize categories
const categoriesPath = path.join(__dirname, "../config/categories.json");
const categoriesArray = JSON.parse(fs.readFileSync(categoriesPath, "utf8"));
const categories = categoriesArray.join(", "); // Simple string concatenation

const openai = new OpenAI({
  apiKey: config.openAiApiKey,
});

export async function loadCategories(): Promise<string[]> {
  const filePath = path.join(__dirname, "../config/categories.json");
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to load categories:", error);
    return [];
  }
}

/**
 * Generates a category based on the provided description.
 * @param description - The merchant's description.
 * @returns A promise that resolves to a single, most fitting category.
 */
export async function generateCategoriesFromDescription(
  description: string
): Promise<string[]> {
  try {
    const categories = await loadCategories();
    const prompt = `Based on the description "${description}", list the most relevant categories from: ${categories.join(
      ", "
    )}.`;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "List the best matching categories from the given list based on the description. Max 3 in form of cat1, cat2, cat3.",
        },
        { role: "user", content: prompt },
      ],
    });

    const responseContent =
      chatCompletion.choices[0]?.message?.content?.trim() ?? "";

    console.log(responseContent);
    const responseCategories = responseContent.split(", ");

    console.log("Response categories:", responseCategories);
    return responseCategories;
  } catch (error) {
    console.error("Error generating categories:", error);
    return []; // Return an empty array on error
  }
}
