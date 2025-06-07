

export function userInputPrompt(userQuery : String) {

    const prompt = 
    `Generate an AI-based book recommendation query prompt that takes ${userQuery} as input and returns the following structured output:

        1. **Vector Search Query**:

        * Generate a concise yet descriptive sentence suitable for vector-based search, focusing specifically on book descriptions. The vector search should retrieve books whose descriptions semantically match the essence of the user's query.

        2. **MongoDB Search Query**:

        * Construct a MongoDB search query (similar to an SQL-like query) tailored to search through relevant fields (title, subtitle, authors, categories, description) without performing delete or update operations.
        * The search query must specifically retrieve relevant matches based on keywords derived from {user query}, ensuring accurate and precise matches.

        **MongoDB Database Structure Reference:**

        {
        "_id": {"$oid": "..."},
        "isbn13": {"$numberLong": "..."},
        "isbn10": "...",
        "title": "...",
        "subtitle": "...",
        "authors": "...",
        "categories": "...",
        "thumbnail": "...",
        "description": "...",
        "published_year": {"$numberDouble": "..."},
        "average_rating": {"$numberDouble": "..."},
        "num_pages": {"$numberDouble": "..."},
        "ratings_count": {"$numberDouble": "..."},
        "embedding": []
        }
        
        Ensure the MongoDB query strictly performs searches and respects the provided database schema.
    `

    return prompt

}

export function combineAndFinalize(query : String) {

    //ask gemini to give final decision in term of BookNode
    return 0;
}