// TODO: @Charsima: Implement book search functionality
import { BookNode } from "./bookNode";
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
const book1: BookNode = {
    id: "clean-code",
    isbn13: 9780132350884,
    isbn10: "0132350882",
    title: "Clean Code",
    subtitle: "A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    categories: "Programming, Software Engineering",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way.",
    published_year: 2008,
    average_rating: 4.6,
    num_pages: 464,
    prerequisites: [],
  };

const book2: BookNode = {
    id: "code-complete",
    isbn13: 9780735619678,
    isbn10: "0735619670",
    title: "Code Complete",
    subtitle: "A Practical Handbook of Software Construction",
    author: "Steve McConnell",
    categories: "Programming, Software Engineering",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "Widely considered one of the best practical guides to programming, Steve McConnell's original CODE COMPLETE has been helping developers write better software for more than a decade.",
    published_year: 2004,
    average_rating: 4.6,
    num_pages: 960,
    prerequisites: [],
  };

const book3: BookNode = {
    id: "clean-architecture",
    isbn13: 9780134494166,
    isbn10: "0134494164",
    title: "Clean Architecture",
    subtitle: "A Craftsman's Guide to Software Structure and Design",
    author: "Robert C. Martin",
    categories: "Programming, Software Architecture",
    thumbnail: "https://dynamic.indigoimages.ca/v1/books/books/0140280197/1.jpg",
    description:
      "By applying universal rules of software architecture, you can dramatically improve developer productivity throughout the life of any software system.",
    published_year: 2017,
    average_rating: 4.4,
    num_pages: 432,
    prerequisites: [9780132350884], // Clean Code
  };

export async function bookDatabaseSearch(query: string): Promise<BookNode[]> {
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

export async function bookVectorSearch(query: string): Promise<BookNode[]> {
    // This function would normally perform a vector search.
    // For now, we return a static list

    return [book3];
}