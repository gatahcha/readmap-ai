// Main function to process user query and return book nodes
import { bookNode } from "./bookNode";
import { bookDatabaseSearch, bookVectorSearch } from "./bookSearch";
import { GoogleGenAI, Type } from "@google/genai";
import { userInputPrompt } from "./prompts";

// Initialize Gemini client
const geminiClient = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "YOUR_API_KEY" });

export async function bookPipeline(userQuery: string): Promise<{ finalResponse: string, books: bookNode[] }> {
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

    // Perform database query
    const databaseBooks = await bookDatabaseSearch(instructionJson.mongoDBSearch);

    // Perform vector search using the query
    const vectorBooks = await bookVectorSearch(instructionJson.vectorSearch);

    // Generate a response message
    if (!databaseBooks.length && !vectorBooks.length) {
        return {
            finalResponse: "No books found matching your query.",
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
            Thumbnail: ${book.thumbail}
            Description: ${book.description}
            Published Year: ${book.published_year}
            Average Rating: ${book.average_rating}
            Number of Pages: ${book.num_page}`;
    })
        .join("\n\n");

    const responseMessage = await geminiClient.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are ReadMap AI, an intelligent book recommendation system.
You have previously analyzed the database and retrieved relevant information on books:
${booksKnowledge}

Your current task is to respond concisely and accurately to the user's query: ${userQuery}

Provide a professional yet engaging reply, structured clearly as follows:
"We found some books in our database that could be interesting for you based on your query:
    1. **Book Title** by *Author Name* (Year Published)
        * Briefly explain why this book matches the query.
    2. **Book Title** by *Author Name* (Year Published)
        * Briefly explain why this book matches the query.
    
    (Continue as needed, limiting recommendations to the most relevant options.)"`
    });

    return {
        finalResponse: responseMessage.text || "We have found some books based on your query.",
        books: [...databaseBooks, ...vectorBooks]
    };
}
