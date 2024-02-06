import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { config } from "../config";

// Load and optimize categories
const categoriesPath = path.join(__dirname, "../config/categories.json");
const categoriesArray = JSON.parse(fs.readFileSync(categoriesPath, "utf8"));
const categories = categoriesArray.join(", "); // Simple string concatenation

// todo: delete

const openai = new OpenAI({
  apiKey: config.openAiApiKey,
});

/**
 * Generates categories based on the provided description.
 * @param {string} description - The merchant's description.
 * @returns {Promise<string[]>} - The most fitting categories.
 */
export async function generateCategoriesFromDescription(
  description: string
): Promise<string[]> {
  const prompt = `Detect language and pick category based on "${description}". You can pick only from the list: ${categories}`;

  console.log("Prompt:", prompt);
  try {
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 600, // Adjust based on your needs
    });

    console.log("Completion:", completion);

    // Assuming the response is a comma-separated list of categories
    const responseCategories = completion.choices[0].text
      .trim()
      .split(",")
      .map((cat) => cat.trim());

    console.log("Response categories:", responseCategories);
    return responseCategories.filter((cat) => categoriesArray.includes(cat)); // Filter based on original list to ensure validity
  } catch (error) {
    console.error("Error generating categories:", error);
    return [];
  }
}
