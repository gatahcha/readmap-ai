import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import * as path from 'path';

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



async function findFirstItem() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const firstItem = await client.db(DATABASE_NAME)
                                    .collection(COLLECTION_NAME)
                                    .findOne({});
    console.log(firstItem);
  } finally {
    await client.close();
  }
}

findFirstItem();