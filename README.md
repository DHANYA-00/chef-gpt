# 👨‍🍳 Chef-GPT

**Chef-GPT** is an AI-powered recipe assistant that helps users discover meals using the ingredients they already have.

It generates personalized recipes based on **available ingredients, dietary preferences, and calorie goals**, making everyday meal planning easier.

---

## ✨ Features

* 🥕 **Ingredient-Based Recipes** – Enter the ingredients you have and get recipe suggestions.
* 🥗 **Dietary Preferences** – Customize recipes for vegan, keto, low-carb, high-protein, and more.
* 🔢 **Calorie Goals** – Generate recipes based on a target calorie limit.
* 📋 **Structured Recipes** – Get ingredients, instructions, calories, and preparation time in a clear format.
* 🔄 **Smart Substitutions** – Suggest alternatives when an ingredient is unavailable.
* 🤖 **AI-Powered Suggestions** – Uses LLMs to generate personalized cooking recommendations.

---

## 🧠 AI Concepts

Chef-GPT demonstrates several practical AI engineering concepts:

* **Prompt Engineering** – Guides the LLM to generate useful and consistent recipes.
* **Function Calling** – Connects AI responses with backend functions for specific tasks.
* **Structured Output** – Returns recipes in a predictable JSON format.
* **RAG** – Retrieves relevant recipes, substitutions, and cooking information before generating responses.

---

## 🔄 How It Works

```text
User Ingredients
       │
       ▼
Diet + Calorie Preferences
       │
       ▼
AI Processing
       │
       ├── Prompt Engineering
       ├── Function Calling
       └── RAG Retrieval
       │
       ▼
Personalized Recipe
       │
       ▼
Ingredients + Steps + Nutrition
```

---

## 🛠️ Tech Stack

### 🤖 AI

* Groq API
* Large Language Models
* Prompt Engineering
* Function Calling
* RAG

### 🖥️ Backend

* Python
* FastAPI
* Uvicorn

### 🎨 Frontend

* Streamlit

---

## 💡 Example

**Input:**

> I have tofu, spinach, and rice. I want something vegan under 400 calories.

**Chef-GPT:**

> **Vegan Spinach-Tofu Rice Bowl**
> Provides ingredients, preparation steps, estimated calories, and suitable substitutions.

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chef-gpt
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Add API Key

Create a `.env` file and add:

```env
GROQ_API_KEY=your_api_key
```

### 4. Start Backend

```bash
cd backend
uvicorn main:app --reload
```

### 5. Start Frontend

Open another terminal:

```bash
cd frontend
streamlit run app.py
```

---

🔥 *Chef-GPT turns the ingredients in your kitchen into your next meal.*
