// TODO: @Charsima: Implement book search functionality
import { bookNode } from "./bookNode";

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
    prevNodes: [],
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
    prevNodes: [book1],
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
    prevNodes: [book1, book2],
};

export async function bookDatabaseSearch(query: string): Promise<bookNode[]> {
    // This function would normally perform a database search.
    // For now, we return a static list

    

    return [book1, book2]
}

export async function bookVectorSearch(query: string): Promise<bookNode[]> {
    // This function would normally perform a vector search.
    // For now, we return a static list

    return [book3];
}