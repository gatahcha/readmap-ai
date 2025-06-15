

export function userInputPrompt(userQuery: String) {

    const prompt = `Generate an AI-based book recommendation query prompt that takes <userQuery> ${userQuery} </userQuery> as input and returns a structured output as follows:

Before generating the queries, evaluate if the userQuery contains sufficient and clear information for constructing accurate searches. If the provided user query is unclear, vague, or lacks necessary context to perform effective vector and MongoDB searches, do **not** generate the search queries.

Instead, clearly articulate a follow-up clarification question to the user, specifying precisely what additional information or details you require.

If the provided userQuery is deemed sufficient and clear, proceed to generate the following structured output:

1. **Vector Search Query**:

   * Generate a concise and descriptive sentence suitable for vector-based search, specifically targeting semantic matching against book descriptions. This sentence should encapsulate the essence and intent of the user's query effectively.

2. **MongoDB Search Query**:

   * Construct a MongoDB search query tailored to search within the fields title, subtitle, authors, categories, and description.
   * Ensure the query accurately retrieves relevant matches using keywords derived directly from the user's query.
   * The query must only perform searches—no delete or update operations.

**MongoDB Database Structure Reference:**

    {
        "_id": { "$oid": "..." },
        "isbn13": { "$numberLong": "..." },
        "isbn10": "...",
            "title": "...",
                "subtitle": "...",
                    "authors": "...",
                        "categories": "...",
                            "thumbnail": "...",
                                "description": "...",
                                    "published_year": { "$numberDouble": "..." },
        "average_rating": { "$numberDouble": "..." },
        "num_pages": { "$numberDouble": "..." },
        "ratings_count": { "$numberDouble": "..." },
        "embedding": []
    }

* If userQuery is sufficiently clear:

  * **Further Clarification**: "" (empty string)

* If userQuery is insufficient or unclear:

  * **Vector Search Query**: ""
  * **MongoDB Search Query**: ""
  * **Further Clarification**: Generate a concise, polite, and specific question prompting the user to clarify or provide additional information needed.
`


    return prompt;

}