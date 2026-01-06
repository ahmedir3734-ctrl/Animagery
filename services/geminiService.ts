import { GoogleGenAI, Type } from "@google/genai";
import { ANIME_SCHEMA, HOME_PROMPT, SEARCH_PROMPT_TEMPLATE } from "../constants";
import { Anime, Category, Episode } from "../types";

// Helper to inject consistent images based on ID
const enhanceAnimeWithImages = (anime: any): Anime => {
  // If images are already manually provided, preserve them
  if (anime.thumbnailUrl && anime.coverUrl && !anime.thumbnailUrl.includes('picsum.photos')) {
      return anime;
  }

  const seed = anime.id || Math.random().toString();
  return {
    ...anime,
    thumbnailUrl: `https://picsum.photos/seed/${seed}/400/600`,
    coverUrl: `https://picsum.photos/seed/${seed}-wide/1200/600`,
  };
};

export const fetchHomeContent = async (): Promise<Category[]> => {
  try {
    const apiKey = process.env.API_KEY;
    
    // 1. Fetch AI Content
    let aiCategories: Category[] = [];
    
    if (apiKey) {
        try {
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: HOME_PROMPT,
            config: {
                responseMimeType: "application/json",
                responseSchema: ANIME_SCHEMA,
                systemInstruction: "You are a specialized content curator for a high-end anime streaming platform.",
            },
            });

            const text = response.text;
            if (text) {
                const data = JSON.parse(text);
                if (data.categories) {
                    aiCategories = data.categories.map((cat: any) => ({
                        ...cat,
                        items: cat.items.map(enhanceAnimeWithImages)
                    }));
                }
            }
        } catch (err) {
            console.warn("AI Fetch failed, falling back to offline mode for AI content");
        }
    }

    // 2. Fallback / Offline Mode if AI returns nothing
    if (aiCategories.length === 0) {
        return [
            {
                title: "Trending Now (Offline Mode)",
                items: [1, 2, 3, 4].map((id) => enhanceAnimeWithImages({
                    id: `offline-${id}`,
                    title: `Anime Sample ${id}`,
                    description: "An engaging story about persistence and dreams in a fantastical world.",
                    genres: ["Action", "Fantasy"],
                    rating: 8.5,
                    releaseYear: 2024,
                    availableLanguages: ["JP", "EN"],
                    episodes: 12
                }))
            }
        ];
    }

    return aiCategories;

  } catch (error) {
    console.error("Gemini fetch error:", error);
    return [];
  }
};

export const searchAnime = async (query: string): Promise<Anime[]> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return [];
    
        const ai = new GoogleGenAI({ apiKey });
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: SEARCH_PROMPT_TEMPLATE(query),
          config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: ANIME_SCHEMA.properties.categories.items.properties.items.items
            }
          },
        });
    
        const text = response.text;
        if (!text) return [];
    
        const items = JSON.parse(text);
        return items.map(enhanceAnimeWithImages);
    } catch (e) {
        console.error(e);
        return [];
    }
}