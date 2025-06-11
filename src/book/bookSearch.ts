// Book search functionality implementation
import { bookNode } from "./bookNode";
import { MongoClient, Db, Collection } from 'mongodb';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import * as path from 'path';

// Load .env file from the project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });  // Adjust if your .env is not two levels up

// Environment variables for configuration
const MONGO_DB_USERNAME = process.env.MONGO_DB_USERNAME || 'your_username';
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD || 'your_password';
const DATABASE_NAME = process.env.DATABASE_NAME || 'ReadmapAIDatabase';
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'books';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'your_google_api_key';

// Build the connection string manually
const MONGODB_URI = `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@readmapai.v0hldcw.mongodb.net/?retryWrites=true&w=majority&appName=ReadmapAI`;
console.log('Using MongoDB URI:', MONGODB_URI);

// Initialize Google AI client
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// MongoDB connection variables
let client: MongoClient;
let db: Db;
let collection: Collection;

// Interface for vector search results from MongoDB
interface VectorSearchResult {
    isbn13?: number;
    isbn10?: number;
    title?: string;
    subtitle?: string;
    authors?: string;
    categories?: string;
    thumbnail?: string;
    description?: string;
    published_year?: number;
    average_rating?: number;
    num_pages?: number;
    ratings_count?: number;
    score?: number;
}
// Initialize database connection
async function initializeDatabase(): Promise<void> {
    try {
        if (!client) {
            client = new MongoClient(MONGODB_URI);
            await client.connect();
            db = client.db(DATABASE_NAME);
            collection = db.collection(COLLECTION_NAME);
            console.log('Connected to MongoDB Atlas');
        }
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

// Close database connection
async function closeDatabaseConnection(): Promise<void> {
    if (client) {
        await client.close();
        console.log('Disconnected from MongoDB Atlas');
    }
}

/**
 * Get embedding using Google's Generative AI
 */
async function getEmbedding(text: string): Promise<number[]> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-exp-03-07" });
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error('Error getting embedding:', error);
        // Return mock embedding for development
        return Array(3072).fill(0).map(() => Math.random());
    }
}

/**
 * Perform vector search using MongoDB's native $vectorSearch
 */
async function performVectorSearch(
    queryEmbedding: number[],
    limit: number = 5,
    excludeIds: number[] = []
): Promise<bookNode[]> {
    try {
        // Ensure database connection
        if (!collection) {
            await initializeDatabase();
        }

        // Build the vector search pipeline
        const pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index", // replace with your actual index name
                    "path": "embedding",     // field containing your embeddings
                    "queryVector": queryEmbedding,
                    "numCandidates": 100,
                    "limit": limit
                }
            }
        ];

        // Add exclusion filter if needed
        if (excludeIds.length > 0) {
            pipeline.push({
                "$match": {
                    "isbn13": { "$nin": excludeIds }
                }
            } as any);
        }

        // Add projection
        pipeline.push({
            "$project": {
                "isbn13": 1,
                "isbn10": 1,
                "title": 1,
                "subtitle": 1,
                "authors": 1,
                "categories": 1,
                "thumbnail": 1,
                "description": 1,
                "published_year": 1,
                "average_rating": 1,
                "num_pages": 1,
                "ratings_count": 1,
                "score": { "$meta": "vectorSearchScore" }
            }
        } as any);

        // Execute the aggregation pipeline
        const results = await collection.aggregate<VectorSearchResult>(pipeline).toArray();

        // Transform results to match bookNode interface
        return results.map(doc => ({
            isbn13: doc.isbn13 || 0,
            isbn10: doc.isbn10 || 0,
            title: doc.title || "",
            subtitle: doc.subtitle || "",
            author: doc.authors || "", // mapping authors to author
            categories: doc.categories || "",
            thumbail: doc.thumbnail || "", // keeping original field name from bookNode
            description: doc.description || "",
            published_year: doc.published_year || 0,
            average_rating: doc.average_rating || 0,
            num_page: doc.num_pages || 0, // mapping num_pages to num_page
            prevNodes: [] // will be populated later
        }));

    } catch (error) {
        console.error('Vector search error:', error);
        return []; // Return empty array on error
    }
}

/**
 * Create searchable text from book node
 */
function createBookSearchText(book: bookNode): string {
    return `${book.title} ${book.subtitle || ''} ${book.author} ${book.categories} ${book.description}`.trim();
}

/**
 * Remove duplicate books based on ISBN13
 */
function removeDuplicates(books: bookNode[]): bookNode[] {
    const seen = new Set<number>();
    return books.filter(book => {
        if (seen.has(book.isbn13)) {
            return false;
        }
        seen.add(book.isbn13);
        return true;
    });
}

/**
 * Build recommendation tree with prerequisite books
 */
async function buildRecommendationTree(
    initialBooks: bookNode[],
    depth: number = 2
): Promise<bookNode[]> {
    const allBooks: bookNode[] = [...initialBooks];
    const processedIds = new Set<number>(initialBooks.map(book => book.isbn13));

    let currentLevel = initialBooks;

    for (let level = 0; level < depth; level++) {
        const nextLevelBooks: bookNode[] = [];

        for (const book of currentLevel) {
            try {
                // Get embedding for current book
                const bookText = createBookSearchText(book);
                const bookEmbedding = await getEmbedding(bookText);

                // Find similar books (prerequisites)
                const excludeIds = Array.from(processedIds);
                const similarBooks = await performVectorSearch(bookEmbedding, 5, excludeIds);

                // Add to next level and mark as processed
                for (const similarBook of similarBooks) {
                    if (!processedIds.has(similarBook.isbn13)) {
                        nextLevelBooks.push(similarBook);
                        processedIds.add(similarBook.isbn13);
                    }
                }

                // Update prevNodes for current book
                book.prevNodes = [...(book.prevNodes || []), ...similarBooks.slice(0, 3)];

            } catch (error) {
                console.error(`Error processing book ${book.title}:`, error);
            }
        }

        // Add next level books to all books
        allBooks.push(...nextLevelBooks);
        currentLevel = nextLevelBooks;

        // Break if no more books found
        if (nextLevelBooks.length === 0) {
            break;
        }
    }

    return removeDuplicates(allBooks);
}

/**
 * Basic database search by title, author, or description
 */
export async function bookDatabaseSearch(query: string): Promise<bookNode[]> {
    try {
        // Ensure database connection
        if (!collection) {
            await initializeDatabase();
        }

        // Create text search query
        const searchRegex = new RegExp(query, 'i');
        const searchQuery = {
            $or: [
                { title: searchRegex },
                { authors: searchRegex }, // Use 'authors' field from database
                { description: searchRegex },
                { categories: searchRegex }
            ]
        };

        const results = await collection
            .find(searchQuery)
            .limit(10)
            .toArray();

        return results.map(doc => ({
            isbn13: doc.isbn13 || 0,
            isbn10: doc.isbn10 || 0,
            title: doc.title || "",
            subtitle: doc.subtitle || "",
            author: doc.authors || "", // mapping authors to author
            categories: doc.categories || "",
            thumbail: doc.thumbnail || "", // mapping thumbnail to thumbail
            description: doc.description || "",
            published_year: doc.published_year || 0,
            average_rating: doc.average_rating || 0,
            num_page: doc.num_pages || 0, // mapping num_pages to num_page
            prevNodes: []
        }));

    } catch (error) {
        console.error('Database search error:', error);
        return []; // Return empty array on error
    }
}

/**
 * Advanced vector search with recommendation tree building
 */
export async function bookVectorSearch(query: string): Promise<bookNode[]> {
    try {
        // Ensure database connection
        if (!collection) {
            await initializeDatabase();
        }

        // Step 1: Get query embedding from Google AI
        console.log('Getting query embedding...');
        const queryEmbedding = await getEmbedding(query);

        // Step 2: Perform initial vector search (5 books)
        console.log('Performing initial vector search...');
        const initialBooks = await performVectorSearch(queryEmbedding, 5);

        if (initialBooks.length === 0) {
            console.log('No books found for query');
            return [];
        }

        // Step 3-7: Build recommendation tree with prerequisites
        console.log('Building recommendation tree...');
        const allRecommendedBooks = await buildRecommendationTree(initialBooks, 2);

        console.log(`Found ${allRecommendedBooks.length} books in recommendation tree`);
        return allRecommendedBooks;

    } catch (error) {
        console.error('Vector search error:', error);
        return []; // Return empty array on error
    }
}

/**
 * Utility function to update book embeddings in database
 */
export async function updateBookEmbeddings(): Promise<void> {
    try {
        // Ensure database connection
        if (!collection) {
            await initializeDatabase();
        }

        // Get all books without embeddings
        const booksWithoutEmbeddings = await collection
            .find({ embedding: { $exists: false } })
            .toArray();

        console.log(`Updating embeddings for ${booksWithoutEmbeddings.length} books...`);

        for (const book of booksWithoutEmbeddings) {
            try {
                const bookText = createBookSearchText({
                    isbn13: book.isbn13 || 0,
                    isbn10: book.isbn10 || 0,
                    title: book.title || "",
                    subtitle: book.subtitle || "",
                    author: book.authors || "",
                    categories: book.categories || "",
                    thumbail: book.thumbnail || "",
                    description: book.description || "",
                    published_year: book.published_year || 0,
                    average_rating: book.average_rating || 0,
                    num_page: book.num_pages || 0,
                    prevNodes: []
                });

                const embedding = await getEmbedding(bookText);

                await collection.updateOne(
                    { _id: book._id },
                    { $set: { embedding } }
                );

                console.log(`Updated embedding for: ${book.title}`);

                // Add delay to respect API rate limits
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.error(`Error updating embedding for ${book.title}:`, error);
            }
        }

        console.log('Embedding update completed');

    } catch (error) {
        console.error('Error updating embeddings:', error);
    }
}

/**
 * Clean up database connection (call this when your app shuts down)
 */
export async function cleanup(): Promise<void> {
    await closeDatabaseConnection();
}