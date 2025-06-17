"""Add additional books to the database."""
import os
import pandas as pd
from google import genai
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

mongo_url = "YOU_MONGO_URI_HERE"

# Create client and connect to DB
client = MongoClient(mongo_url)
db = client["ReadmapAIDatabase"]
collection = db["books"]

# Add additional books
books = [
    {
        "isbn13": "9780143128540",
        "isbn10": "014312854X",
        "title": "Example Book Title",
        "subtitle": "An Example Subtitle",
        "authors": ["Author One", "Author Two"],
        "categories": ["Fiction", "Adventure"],
        "thumbnail": "http://example.com/thumbnail.jpg",
        "description": "This is an example book description.",
        "published_year": 2020,
        "average_rating": 4.5,
        "num_pages": 320,
        "ratings_count": 1250,
    },
    # …add more dicts with the same keys…
]

# Or you can load from a CSV file
# df = pd.read_csv("PATH TO YOUR CSV FILE")
# For this example, we will use the predefined books list

df = pd.DataFrame(books)

# Convert to dictionary and insert
data = df.to_dict(orient="records")
collection.insert_many(data)

# Initialize Google GenAI client
# Ensure you have set GOOGLE_API_KEY in your environment variables
google_api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=google_api_key)

# Process each document
# Only process docs without embedding
for doc in collection.find({"embedding": {"$exists": False}}):
    text = doc.get("description", "")
    if not text:  # Skip only if text is completely empty
        print(
            f"Skipping document ID {doc['_id']}: no description field or empty text")
        continue

    try:
        # Generate embedding
        response = client.models.embed_content(
            model="gemini-embedding-exp-03-07",
            contents=text,
        )
        embedding = response.embeddings[0].values

        # Update document with embedding
        collection.update_one(
            {"_id": doc["_id"]},
            {"$set": {"embedding": embedding}}
        )
        print(f"Updated document ID: {doc['_id']}")
        # time.sleep(1)  # Optional: avoid rate limits
    except Exception as e:
        print(f"Failed on document ID {doc['_id']}: {e}")
