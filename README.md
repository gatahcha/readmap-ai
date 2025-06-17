## 📚 Readmap.ai 🤖

Tired of generic book lists? Readmap.ai is your AI-powered book mentor that builds a personalized learning roadmap *just for you* based on your interests, goals, and current knowledge level. Whether you're exploring a new field or deepening your expertise, Readmap.ai gives you a structured, smarter path forward.

🌐 [readmap.ai](https://readmap-ai.com)

## ✨ Features

- 🔍 AI-generated reading roadmap based on your query
- 🧠 Personalized recommendations that evolve with user preferences
- 📚 Structured book lists with progression logic
- 💬 Interactive chatbot interface
- 🎨 Clean and modern UI powered by Tailwind CSS

## 🛠️ Tech Stack

- Frontend: Next.js (App Router, TypeScript)
- Styling: Tailwind CSS, ShadCN UI
- Backend: MongoDB Atlas, Python (Setup Database, Vectorization)
- AI & Embeddings: Vertex AI (Google Cloud)
- Database: MongoDB Atlas
- Deployment: Cloud Run (Google Cloud)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- Python (v3.8 or later)
- MongoDB Atlas account
- Google Cloud account with Vertex AI enabled

### Setup Instructions

1. Setup your Google Cloud project:
   - Enable Vertex AI API
   - Create a service account with the necessary permissions
   - Generate an API key and download the JSON credentials file
2. Create a MongoDB Atlas cluster and obtain your connection string.
3. Clone the repository

    ```bash
    git clone https://github.com/gatahcha/readmap-ai.git
    ```

4. Rename the `.env.example` file in the backend directory to `.env` and fill in your MongoDB and Google API credentials. Your .env file should look like this:

    ```bash
    MONGO_DB_USERNAME="your_username"
    MONGO_DB_PASSWORD="your_password"
    GOOGLE_API_KEY="your_google_api_key"
    ```

5. Setup the MongoDB Atlas by running the following command in the backend directory:

    ```bash
    cd setup
    python -m venv venv # (Only if you want to create a virtual environment, which is recommended)
    source venv/bin/activate # (On Windows use `venv\Scripts\activate`) NOTE: Make sure to activate the virtual environment if you created one. If not, you can skip this step.
    python -m pip install -r requirements.txt
    python setup.py
    ```

    This sets up the database and initializes the necessary collections. This also vectorizes the books and stores them in the database.

6. [Optional] If you want to add your own books, you can add them by using ```bash
    python add_books.py``` Please read the instructions in the `add_books.py` file for more details.

7. Now you can run Readmap.ai locally by following the steps below.

    ```bash
    npm install
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. NOTE: port 3000 is the default port for Next.js. If you want to change it, you can do so by setting the `PORT` environment variable. Always check the port in the terminal output after running the command, port numnber may vary.
