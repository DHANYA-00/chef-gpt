# Chef-GPT

Chef-GPT is an AI cooking assistant that turns the ingredients you already have into practical, personalized recipes and guides you through cooking them step by step.

**Live:** https://chef-gpt-swart.vercel.app/
**GitHub:** https://github.com/DHANYA-00/chef-gpt

## Features

* **Smart recipe generation** — Uses ingredients, goal, time, hunger, diet, calories, and ingredient-usage preference to generate up to 3 recipes with a recommendation.
* **Recipe adaptation** — Make recipes faster, healthier, spicier, cheaper, easier, more filling, or higher in protein.
* **Ingredient substitution** — Remove unavailable ingredients and automatically adjust the recipe when possible.
* **Cooking mode** — Step-by-step instructions with progress tracking and built-in timers.
* **Meal rescue** — Get recovery steps for issues such as excess salt, spice, water, or undercooking.
* **Recipe export** — Download recipes as `.txt` or save them as PDF.
* **Honest responses** — Rejects recipes that require unavailable ingredients instead of inventing them.
* **No accounts or database** — Recipes are handled in browser memory.

## How It Works

```text
User preferences + ingredients
            ↓
     Next.js Frontend
            ↓
   Next.js API Proxy
            ↓
      FastAPI Backend
            ↓
 ┌──────────┼───────────┐
 Prompting  Validation  JSON Parsing
 └──────────┼───────────┘
            ↓
        Groq LLM
```

The backend validates model output with **Pydantic** and checks returned ingredients against the user's available ingredients. Recipe modifications, substitutions, and rescue requests use the current recipe as context.

## AI Concepts

* **Prompt Engineering** — Separate system and task prompts control recipe generation and modifications.
* **Structured Output** — Recipes are returned as validated JSON containing ingredients, steps, timers, tags, and notes.
* **Output Validation & Retry** — Invalid or invented ingredients are rejected and regenerated.
* **Prompt-Injection Awareness** — User input is treated as data rather than model instructions.
* **No RAG or Function Calling** — The current version relies on prompt engineering and structured LLM output.

## Tech Stack

**Frontend:** Next.js, TypeScript, Tailwind CSS, lucide-react
**Backend:** Python, FastAPI, Uvicorn, Pydantic
**AI:** Groq API, `openai/gpt-oss-120b`

## API

| Method | Endpoint                  | Purpose                    |
| ------ | ------------------------- | -------------------------- |
| GET    | `/health`                 | Health check               |
| POST   | `/api/recipes/generate`   | Generate up to 3 recipes   |
| POST   | `/api/recipes/modify`     | Modify the current recipe  |
| POST   | `/api/recipes/substitute` | Handle missing ingredients |
| POST   | `/api/recipes/rescue`     | Recover a cooking problem  |

Interactive API docs are available at `/docs`.

## Project Structure

```text
chef-gpt/
├── backend/
│   ├── main.py
│   ├── groq_service.py
│   ├── schemas.py
│   └── requirements.txt
│
└── frontend/
    ├── app/
    │   ├── api/recipes/[action]/route.ts
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    └── lib/
```

## Getting Started

### 1. Clone

```bash
git clone <repository-url>
cd chef-gpt
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
```

Create `.env`:

```env
GROQ_API_KEY=your_api_key
```

Run:

```bash
uvicorn main:app --reload
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create `.env.local`:

```env
BACKEND_URL=http://localhost:8000
```

Run:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deployment

* **Backend:** Deploy the `backend` folder to Render or another Python host.
* **Frontend:** Deploy the `frontend` folder to Vercel.
* Set `GROQ_API_KEY` on the backend and `BACKEND_URL` on the frontend.

## Limitations

* No database or user accounts; refreshing clears the current recipe.
* Free hosting may have cold-start delays.
* Each modification, substitution, or rescue uses an additional LLM call.
* Nutrition values are estimates.
* Recipes use only listed ingredients plus water.
* Cooking rescue guidance is informational; follow appropriate food-safety practices.

> **Chef-GPT turns the ingredients in your kitchen into your next meal.**
