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

/**
 * Generates a category based on the provided description.
 * @param description - The merchant's description.
 * @returns A promise that resolves to a single, most fitting category.
 */
export async function generateCategoriesFromDescription(
  description: string
): Promise<string> {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant able to detect different languages and selecting the best fitting merchant category",
        },
        {
          role: "user",
          content: `Given the description "${description}", identify the most fitting category from the following list: ${categories}.`,
        },
      ],
    });

    // Extract the text response directly without assuming JSON structure
    const responseContent =
      chatCompletion.choices[0]?.message?.content?.trim() ?? "unknown";

    console.log("Response category:", responseContent);

    // Directly return the response without filtering, assuming it provides a valid category
    return responseContent; // If you need to ensure the response is within your categories, you can still perform a check here
  } catch (error) {
    console.error("Error generating category:", error);
    return "error"; // Return a default or error indicator as appropriate
  }
}
