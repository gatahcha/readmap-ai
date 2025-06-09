import { MongoClient, Db, Collection } from 'mongodb';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { bookNode } from "@/RAG-experiment/jsonschema";


// Environment variables for configuration
const MONGODB_USERNAME = process.env.MONGODB_USERNAME || 'your_username';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || 'your_password';
const DATABASE_NAME = process.env.DATABASE_NAME || 'your_database_name';
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'books';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'your_google_api_key';

// Build the connection string manually
const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@readmapai.v0hldcw.mongodb.net/?retryWrites=true&w=majority&appName=ReadmapAI`;

// Initialize Google AI client
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// MongoDB connection
let client: MongoClient;
let db: Db;
let collection: Collection;

// TODO: VectorSearchResult definition
interface VectorSearchResult {
  isbn13?: number
  isbn10?: number
  title?: string
  subtitle?: string
  authors?: string
  categories?: string
  thumbnail?: string
  description?: string
  published_year?: number
  average_rating?: number
  num_pages?: number
  ratings_count?: number
  embedding?: number[]
  score?: number
}


// TODO: Fix the BookNode import

// Initialize database connection
async function initializeDatabase(): Promise<void> {
    try {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db(DATABASE_NAME);
        collection = db.collection(COLLECTION_NAME);
        console.log('Connected to MongoDB Atlas');
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

async function searchDatabase(text: string): Promise<bookNode[]> {
    try {
        // Ensure database connection is established
        if (!collection) {
            await initializeDatabase();
        }

        // Get the embedding model
        const model = genAI.getGenerativeModel({ model: "embedding-001" });

        // Generate query embedding using Gemini
        const result = await model.embedContent(text);
        
        const queryEmbedding = result.embedding.values;

        // MongoDB vector search pipeline
        const pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index", // replace with your actual index name
                    "path": "embedding",     // field containing your embeddings
                    "queryVector": queryEmbedding,
                    "numCandidates": 100,
                    "limit": 10 // adjust as needed
                }
            },
            {
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
            }
        ];

        // Execute the aggregation pipeline
        const results = await collection.aggregate<VectorSearchResult>(pipeline).toArray();

        // Transform results to match BookNode interface
        const bookNodes: bookNode[] = results.map((doc, index) => {
            const bookNode: bookNode = {
                isbn13: doc.isbn13 || 0,
                isbn10: doc.isbn10 || 0,
                title: doc.title || "",
                subtitle: doc.subtitle || "",
                author: doc.authors || "", // mapping authors to author
                categories: doc.categories || "",
                thumbnail: doc.thumbnail || "", // fixed typo from thumbail
                description: doc.description || "",
                published_year: doc.published_year || 0,
                average_rating: doc.average_rating || 0,
                num_page: doc.num_pages || 0, // mapping num_pages to num_page
            };

            // Link to previous node if not the first item
            if (index > 0) {
                bookNode.prevNode = [bookNodes[index - 1]];
            }

            return bookNode;
        });

        return bookNodes;

    } catch (error) {
        console.error("Error searching database:", error);
        throw new Error(`Database search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}