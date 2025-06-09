// TODO: @Charsima: Implement book search functionality
import { bookNode } from "./bookNode";
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import * as path from 'path';

//loading information from .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Environment variables for configuration
const MONGODB_USERNAME = process.env.MONGO_DB_USERNAME || 'your_username';
const MONGODB_PASSWORD = process.env.MONGO_DB_PASSWORD || 'your_password';


// Build the connection string manually
const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@readmapai.v0hldcw.mongodb.net/?retryWrites=true&w=majority&appName=ReadmapAI`;
const DATABASE_NAME = 'ReadmapAIDatabase';
const COLLECTION_NAME = 'books';


// NOTE: This is a mock implementation for demonstration purposes.
const book1: bookNode = {
    isbn13: 9780451524935,
    isbn10: 451524935,
    title: "1984",
    subtitle: "A Novel",
    author: "George Orwell",
    categories: "Dystopian, Political Fiction",
    thumbail: "https://example.com/1984.jpg",
    description: "A chilling prophecy about the future.",
    published_year: 1949,
    average_rating: 4.2,
    num_page: 328,
    prevNode: [],
};

const book2: bookNode = {
    isbn13: 9780061120084,
    isbn10: 61120081,
    title: "To Kill a Mockingbird",
    subtitle: "",
    author: "Harper Lee",
    categories: "Classic, Legal Story",
    thumbail: "https://example.com/mockingbird.jpg",
    description: "A novel of warmth and humor despite dealing with serious issues.",
    published_year: 1960,
    average_rating: 4.3,
    num_page: 281,
    prevNode: [book1],
};

const book3: bookNode = {
    isbn13: 9780743273565,
    isbn10: 743273565,
    title: "The Great Gatsby",
    subtitle: "",
    author: "F. Scott Fitzgerald",
    categories: "Classic, Tragedy",
    thumbail: "https://example.com/gatsby.jpg",
    description: "The story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.",
    published_year: 1925,
    average_rating: 3.9,
    num_page: 180,
    prevNode: [book1, book2],
};

export async function bookDatabaseSearch(query: string): Promise<bookNode[]> {
    // This function would normally perform a database search.
    // For now, we return a static list

    // const client = new MongoClient(MONGODB_URI);

    // try {
    //     await client.connect();
    //     const firstItem = await client.db(DATABASE_NAME)
    //                                     .collection(COLLECTION_NAME)
    //                                     .findOne();
        
    // } finally {
    //     await client.close();
    // }
    

    return [book1, book2]
}

export async function bookVectorSearch(query: string): Promise<bookNode[]> {
    // This function would normally perform a vector search.
    // For now, we return a static list

    return [book3];
}