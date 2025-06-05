import { bookPipeline } from "@/book/bookPipeline";
import { bookNode } from "@/book/bookNode";

interface HomeProps {
  searchParams: { query?: string };
}

export default async function Home({ searchParams }: HomeProps) {
  const query = searchParams.query || '';
  let finalResponse = '';
  let books: bookNode[] = [];

  if (query) {
    try {
      const result = await bookPipeline(query);
      finalResponse = result.finalResponse;
      books = result.books;
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Readmap AI</h1>
      <form method="GET" className="w-full max-w-md mb-4">
        <input
          type="text"
          name="query"
          defaultValue={query}
          placeholder="Search what you want to read"
          className="border border-gray-300 p-2 rounded w-full mb-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {finalResponse && (
        <div className="mt-6 text-center max-w-2xl">
          <p className="text-lg font-medium mb-4">{finalResponse}</p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {books.map((book, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <img
              src={book.thumbail?.toString()}
              alt={book.title?.toString()}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="text-sm text-gray-500">by {book.author} ({book.published_year?.toString()})</p>
            <p className="mt-2 text-sm line-clamp-3">{book.description}</p>
            <p className="mt-1 text-xs text-gray-400">
              Rating: {book.average_rating?.toString()} | Pages: {book.num_page?.toString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
