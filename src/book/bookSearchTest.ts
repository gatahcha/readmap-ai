// Vector search test script
import { bookVectorSearch, bookDatabaseSearch } from './bookSearch';
import { BookNode } from "./bookNode";

/**
 * Pretty print a book node with all its details
 */
function printBook(book: BookNode, index: number): void {
    console.log(`\n📚 Book #${index + 1}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📖 Title: ${book.title}`);
    if (book.subtitle) {
        console.log(`📝 Subtitle: ${book.subtitle}`);
    }
    console.log(`✍️  Author: ${book.author}`);
    console.log(`📚 Categories: ${book.categories}`);
    console.log(`📅 Published: ${book.published_year}`);
    console.log(`⭐ Rating: ${book.average_rating}/5`);
    console.log(`📄 Pages: ${book.num_pages}`);
    console.log(`🔢 ISBN13: ${book.isbn13}`);
    console.log(`🔢 ISBN10: ${book.isbn10}`);
    if (book.thumbnail) {
        console.log(`🖼️  Thumbnail: ${book.thumbnail}`);
    }
    console.log(`📋 Description: ${book.description}`);

    if (book.prerequisites && book.prerequisites.length > 0) {
        console.log(`🔗 Prerequisites (${book.prerequisites.length} books):`);
        book.prerequisites.forEach((isbn, i) => {
            console.log(`   ${i + 1}. ISBN: ${isbn}`);
        });
    }
}

/**
 * Print summary statistics
 */
function printSummary(books: BookNode[]): void {
    console.log(`\n📊 SEARCH SUMMARY`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📚 Total books found: ${books.length}`);

    if (books.length > 0) {
        const avgRating = books.reduce((sum, book) => sum + book.average_rating, 0) / books.length;
        const avgPages = books.reduce((sum, book) => sum + book.num_pages, 0) / books.length;
        const totalPrereqs = books.reduce((sum, book) => sum + (book.prerequisites?.length || 0), 0);

        console.log(`⭐ Average rating: ${avgRating.toFixed(2)}/5`);
        console.log(`📄 Average pages: ${Math.round(avgPages)}`);
        console.log(`🔗 Total prerequisites: ${totalPrereqs}`);

        // Year distribution
        const years = books.map(book => book.published_year).filter(year => year > 0);
        if (years.length > 0) {
            const minYear = Math.min(...years);
            const maxYear = Math.max(...years);
            console.log(`📅 Publication years: ${minYear} - ${maxYear}`);
        }

        // Categories
        const categories = new Set();
        books.forEach(book => {
            if (book.categories) {
                book.categories.split(',').forEach(cat => categories.add(cat.trim()));
            }
        });
        console.log(`🏷️  Unique categories: ${categories.size}`);
        if (categories.size > 0) {
            console.log(`   ${Array.from(categories).slice(0, 5).join(', ')}${categories.size > 5 ? '...' : ''}`);
        }
    }
}

/**
 * Main test function
 */
export async function testVectorSearch(): Promise<void> {
    const query = "About magical academy fiction";

    console.log(`🔍 VECTOR SEARCH TEST`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`🎯 Query: "${query}"`);
    console.log(`⏳ Searching...`);

    try {
        const startTime = Date.now();

        // Perform vector search
        const books = await bookVectorSearch(query);

        const endTime = Date.now();
        const searchTime = endTime - startTime;

        console.log(`✅ Search completed in ${searchTime}ms`);

        if (books.length === 0) {
            console.log(`\n❌ No books found for query: "${query}"`);
            return;
        }

        // Print summary first
        printSummary(books);

        // Print all books
        console.log(`\n📖 DETAILED RESULTS`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        books.forEach((book, index) => {
            printBook(book, index);
        });

        console.log(`\n✨ End of results`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    } catch (error) {
        console.error(`❌ Error during vector search:`, error);

        // Fallback to regular database search
        console.log(`\n🔄 Trying fallback database search...`);
        try {
            const fallbackBooks = await bookDatabaseSearch(query);
            console.log(`✅ Fallback search found ${fallbackBooks.length} books`);

            if (fallbackBooks.length > 0) {
                printSummary(fallbackBooks);
                fallbackBooks.forEach((book, index) => {
                    printBook(book, index);
                });
            }
        } catch (fallbackError) {
            console.error(`❌ Fallback search also failed:`, fallbackError);
        }
    }
}