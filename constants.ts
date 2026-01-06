import { Type } from "@google/genai";

export const APP_NAME = "Animagery";

export const HOME_PROMPT = `
Generate a JSON object containing curated lists of anime for a streaming app. 
Focus on 4 distinct categories: "Trending Now", "Cult Classics", "Cyberpunk Futures", and "Slice of Life".
Each category should have 4-6 anime titles.
For each anime, provide:
- A unique numeric ID (string).
- Catchy title.
- A sophisticated 2-sentence description.
- A list of available dub languages (e.g., "Japanese", "English", "German", "Spanish").
- Genre tags.
- Release year.
- Episode count.
- Rating (1-10).
Ensure the tone is professional.
`;

export const SEARCH_PROMPT_TEMPLATE = (query: string) => `
Search for anime matching the query: "${query}". 
Return a list of 6-8 fictional or real anime titles that fit the search. 
Format as a JSON array of anime objects matching the structure used previously.
`;

// Schema for structured output
export const ANIME_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    categories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                genres: { type: Type.ARRAY, items: { type: Type.STRING } },
                rating: { type: Type.NUMBER },
                releaseYear: { type: Type.INTEGER },
                availableLanguages: { type: Type.ARRAY, items: { type: Type.STRING } },
                episodes: { type: Type.INTEGER }
              },
              required: ["id", "title", "description", "genres", "rating", "availableLanguages"]
            }
          }
        },
        required: ["title", "items"]
      }
    }
  }
};
