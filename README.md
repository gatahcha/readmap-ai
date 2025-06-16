## 📚 Readmap.ai 🤖 
Tired of generic book lists? Readmap.ai is your AI-powered book mentor that builds a personalized learning roadmap *just for you* based on your interests, goals, and current knowledge level. Whether you're exploring a new field or deepening your expertise, Readmap.ai gives you a structured, smarter path forward.

🌐 [readmap.ai](https://readmap-ai-988084809850.us-west1.run.app/)

## ✨ Features
- 🔍 AI-generated reading roadmap based on your query
- 🧠 Personalized recommendations that evolve with user preferences
- 📚 Structured book lists with progression logic
- 💬 Interactive chatbot interface
- 🎨 Clean and modern UI powered by Tailwind CSS

## 🛠️ Tech Stack
- Frontend: Next.js (App Router, TypeScript)
- Styling: Tailwind CSS, ShadCN UI
- Backend: FastAPI
- AI & Embeddings: Vertex AI (Google Cloud), LangChain, FAISS
- Database: MongoDB Atlas
- Deployment: Cloud Run (Google Cloud), Vercel (for frontend demo builds)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/readmap-ai.git
cd readmap-ai
```

## 2. Run the backend
Create a .env file in the backend directory with:
```bash
MONGO_DB_USERNAME="your_username"
MONGO_DB_PASSWORD="your_password"
GOOGLE_API_KEY="your_google_api_key"
```

## 3. Run the frontend 
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
