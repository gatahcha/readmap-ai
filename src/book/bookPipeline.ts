// Main function to process user query and return book nodes
import { BookNode } from "./bookNode";
import { bookDatabaseSearch, bookVectorSearch } from "./bookSearch";
import { GoogleGenAI, Type } from "@google/genai";
import { userInputPrompt } from "./prompts";

// Initialize Gemini client
const geminiClient = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "YOUR_API_KEY" });

export async function bookPipeline(userQuery: string): Promise<{ roadmapTitle: string, books: BookNode[] }> {
    // Define the user query 

    const responseQuery = await geminiClient.models.generateContent({
        model: "gemini-2.0-flash",
        contents: userInputPrompt(userQuery),
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    vectorSearch: {
                        type: Type.STRING,
                    },
                    mongoDBSearch: {
                        type: Type.STRING,
                    },
                },
                propertyOrdering: ["vectorSearch", "mongoDBSearch"],
            },
        },
    });

    const instructionJson = JSON.parse(responseQuery.text || '{}');

    // writeFileSync('src/book/trial_lookout.json', JSON.stringify(responseQuery, null, 2));

    // Perform database query
    const databaseBooks = await bookDatabaseSearch(instructionJson.mongoDBSearch);

    // Perform vector search using the query
    const vectorBooks = await bookVectorSearch(instructionJson.vectorSearch);

    // Generate a response message
    if (!databaseBooks.length && !vectorBooks.length) {
        return {
            roadmapTitle: "No books found matching your query.",
            books: []
        };
    }

    // Build books knowledge base
    const booksKnowledge = [...databaseBooks, ...vectorBooks].map((book, index) => {
        return `Book ${index + 1}
            ISBN-13: ${book.isbn13}
            ISBN-10: ${book.isbn10}
            Title: ${book.title}
            Subtitle: ${book.subtitle}
            Author: ${book.author}
            Categories: ${book.categories}
            Thumbnail: ${book.thumbnail}
            Description: ${book.description}
            Published Year: ${book.published_year}
            Average Rating: ${book.average_rating}
            Number of Pages: ${book.num_pages}`;
    })
        .join("\n\n");

    const responseMessage = await geminiClient.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are ReadMap AI, an intelligent book recommendation system.

Based on the books previously retrieved and analyzed from our database:
${booksKnowledge}

And the user's original query:
${userQuery}

Generate a concise, clear, and engaging title for a visual diagram showcasing these book recommendations. The title should succinctly reflect the essence of the user's query and the recommended books."`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                    },
                },
                propertyOrdering: ["title"],
            }
        }
    });

    const titleJSON = JSON.parse(responseMessage.text || '{}');

    // Helper function to safely convert to number
    const toSafeNumber = (value: any): number => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const cleaned = value.replace(/[^0-9]/g, '');
            const parsed = parseInt(cleaned, 10);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    // 🔧 Clean and normalize data before returning
    const cleanedBooks = [...databaseBooks, ...vectorBooks].map(book => ({
        ...book,
        // 1. Set embedding to empty array
        embedding: [],
        // 2. Ensure isbn10 is a number
        isbn10: toSafeNumber(book.isbn10),
        // 3. Ensure isbn13 is a number
        isbn13: toSafeNumber(book.isbn13)
    }));

    return {
        roadmapTitle: titleJSON.title || "Your personal roadmap",
        books: cleanedBooks
    };
}