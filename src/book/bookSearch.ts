// Book search functionality implementation
import { BookNode } from "./bookNode";
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
	embedding?: number[];
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
): Promise<BookNode[]> {
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
				"embedding": 1,
				"score": { "$meta": "vectorSearchScore" }
			}
		} as any);

		// Execute the aggregation pipeline
		const results = await collection.aggregate<VectorSearchResult>(pipeline).toArray();

		// Transform results to match bookNode interface
		return results.map(doc => ({
			id: doc.isbn13?.toString() || `book-${Date.now()}`,
			isbn13: doc.isbn13 || 0,
			isbn10: doc.isbn10 || 0,
			title: doc.title || "",
			subtitle: doc.subtitle || "",
			author: doc.authors || "", // mapping authors to author
			categories: doc.categories || "",
			thumbnail: doc.thumbnail || "", // keeping original field name from bookNode
			description: doc.description || "",
			published_year: doc.published_year || 0,
			average_rating: doc.average_rating || 0,
			num_pages: doc.num_pages || 0, // mapping num_pages to num_page
			embedding: doc.embedding || [], // ensure embedding is present
			prerequisites: [] // will be populated later
		}));

	} catch (error) {
		console.error('Vector search error:', error);
		return []; // Return empty array on error
	}
}


/**
 * Remove duplicate books based on ISBN13
 */
function removeDuplicates(books: BookNode[]): BookNode[] {
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
async function buildRecommendationTree(initialBooks: BookNode[], depth: number = 2): Promise<BookNode[]> {
	// track which ISBNs we've already returned
	const processedIds = new Set<number>(
		initialBooks.map((book) => book.isbn13)
	);

	// collect all books across all levels
	const allBooks: BookNode[] = [...initialBooks];

	// start from your initial "roots"
	let currentLevel = initialBooks;

	for (let level = 0; level < depth; level++) {
		const nextLevelBooks: BookNode[] = [];

		for (const book of currentLevel) {
			try {
				const bookEmbedding = book.embedding;
				const excludeIds = Array.from(processedIds);

				// this returns e.g. top 3—but might include ones you've already seen
				const similarBooks = await performVectorSearch(
					bookEmbedding,
					1,
					excludeIds
				);

				// only keep brand-new ones
				const newBooks = similarBooks.filter(
					(sb) => !processedIds.has(sb.isbn13)
				);

				// mark them processed and queue for the next "wave"
				for (const nb of newBooks) {
					processedIds.add(nb.isbn13);
					nextLevelBooks.push(nb);
					allBooks.push(nb);
				}

				// attach only the new book ISBNs as prerequisites
				const newPrerequisites = newBooks.map(nb => nb.isbn13);
				book.prerequisites = [...(book.prerequisites || []), ...newPrerequisites];
			} catch (error) {
				console.error(`Error processing book ${book.title}:`, error);
			}
		}

		// move one level deeper
		currentLevel = nextLevelBooks;
	}

	// ensure the last level books have empty prerequisites
	for (const book of currentLevel) {
		book.prerequisites = [];
	}

	// return all books with duplicates removed
	return removeDuplicates(allBooks);
}

/**
 * Basic database search by title, author, or description
 */
export async function bookDatabaseSearch(query: string): Promise<BookNode[]> {
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
			id: "memek",
			isbn13: doc.isbn13 || 0,
			isbn10: doc.isbn10 || 0,
			title: doc.title || "",
			subtitle: doc.subtitle || "",
			author: doc.authors || "", // mapping authors to author
			categories: doc.categories || "",
			thumbnail: doc.thumbnail || "", // mapping thumbnail to thumbail
			description: doc.description || "",
			published_year: doc.published_year || 0,
			average_rating: doc.average_rating || 0,
			num_pages: doc.num_pages || 0, // mapping num_pages to num_page
			embedding: doc.embedding || [], // ensure embedding is present
			prerequisites: []
		}));

	} catch (error) {
		console.error('Database search error:', error);
		return []; // Return empty array on error
	}
}

/**
 * Advanced vector search with recommendation tree building
 */
export async function bookVectorSearch(query: string): Promise<BookNode[]> {
	try {
		// Ensure database connection
		if (!collection) {
			await initializeDatabase();
		}

		// Step 1: Get query embedding from Google AI
		// console.log('Getting query embedding...');
		const queryEmbedding = await getEmbedding(query);

		// Step 2: Perform initial vector search (3 books)
		// console.log('Performing initial vector search...');
		const initialBooks = await performVectorSearch(queryEmbedding, 3);

		if (initialBooks.length === 0) {
			console.log('No books found for query');
			return [];
		}

		// Step 3-7: Build recommendation tree with prerequisites
		// console.log('Building recommendation tree...');
		const allRecommendedBooks = await buildRecommendationTree(initialBooks, 5);

		// console.log(`Found ${allRecommendedBooks.length} books in recommendation tree`);
		// console.log(`First book: "${allRecommendedBooks[0].title}" has ${allRecommendedBooks[0].prevNodes.length} prerequisite books`);
		// console.log(`First prerequisite book: "${allRecommendedBooks[0].prevNodes[0]?.title || 'none'}" has ${allRecommendedBooks[0].prevNodes[0]?.prevNodes.length || 0} prerequisite books`);
		return allRecommendedBooks;

	} catch (error) {
		console.error('Vector search error:', error);
		return []; // Return empty array on error
	}
}

/**
 * Clean up database connection (call this when your app shuts down)
 */
export async function cleanup(): Promise<void> {
	await closeDatabaseConnection();
}