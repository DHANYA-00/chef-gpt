# 👨‍🍳 Chef-GPT

**Chef-GPT** is an AI-powered recipe assistant that helps users cook delicious meals with the ingredients they already have. It generates recipe suggestions tailored to dietary preferences (vegan, keto, low-calorie, etc.) and calorie goals. The system uses large language models (LLMs) and incorporates cutting-edge AI techniques such as **Prompt Engineering**, **Function Calling**, **Structured Output**, and **Retrieval-Augmented Generation (RAG)** to deliver highly personalized and structured cooking guidance.

---

## 📌 Features

* 🧾 **Ingredient-Based Recipe Suggestions**
  Input what you have in your kitchen and get smart recipe recommendations.
* 🥗 **Diet-Friendly Customizations**
  Adapt recipes to be vegan, keto, low-carb, high-protein, etc.
* 🔢 **Calorie-Based Adjustments**
  Automatically adjust ingredients to meet calorie goals.
* 📦 **Structured Output in JSON**
  Recipes are returned in a structured format with ingredients, steps, calories, and prep time.
* 📚 **RAG-powered Retrieval**
  Fetches recipes, substitutions, and cooking tips from a knowledge base or external database.

---

## 📖 Overall Project Idea

Chef-GPT aims to solve a common everyday problem: *"What can I cook with what I already have?"* Instead of searching through dozens of recipe websites, users can simply input available ingredients (e.g., "I have rice, eggs, and carrots"), and Chef-GPT provides a complete, personalized recipe. The system can:

* Customize meals based on dietary preferences.
* Suggest healthy alternatives.
* Return structured and ready-to-use instructions.

This is especially useful for people with specific health needs or limited pantry options.

---

## 🚀 Getting Started

### Prerequisites

* Python 3.8+
* Groq API key

### Installation

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Set up your Groq API key in the `.env` file

### Running the Application

The application consists of a backend API and a frontend:

**Backend (API Server):**
```bash
# From the backend directory
cd backend
uvicorn main:app --reload
```

**Frontend (Streamlit UI):**
```bash
# From the frontend directory
cd frontend
streamlit run app.py
```

*Note: Make sure the backend API server is running before using the frontend.*

---

## 🧠 How Core AI Concepts Are Used

### 1. 🗣️ Prompting

Prompting helps convert the user's input into something the AI model can understand and respond to meaningfully.

* **Zero-shot Prompting**: For basic input like "I have oats and milk," the AI generates recipes without prior examples.
* **Few-shot Prompting**: Providing a few examples of ingredient-recipe pairs so the model learns to follow a pattern.

> Example Prompt:
> "I have tomatoes, spinach, and eggs. Give me a high-protein breakfast recipe."



### 2. 🧾 Function Calling

Function calling ensures more accurate and interactive AI behavior by delegating specific tasks to backend logic.

#### Functions:

* `suggestRecipe(ingredients, diet)` → Fetches a suitable recipe.
* `adjustCalories(target)` → Adjusts portion sizes or swaps ingredients.

This improves **efficiency**, **correctness**, and **modularity** in the codebase.

### 3. 🔍 Retrieval-Augmented Generation (RAG)

The model enhances its knowledge by retrieving external documents or database entries before generating output.

Chef-GPT uses RAG to:

* Retrieve cooking tips or substitutions.
* Pull verified recipes from a local or cloud-hosted dataset.

> Example: If a user doesn’t have eggs, RAG can fetch vegan alternatives like flaxseed or tofu.

---

## 🚀 Scalability, Efficiency & Correctness

### ✅ Correctness

* Recipes match dietary preferences and calorie goals.
* Ingredients are used as requested.
* Instructions are logically sequenced.

### ⚡ Efficiency

* Uses function calling to reduce token usage and speed up response time.
* Caches frequent requests (like popular ingredients).

### 🌐 Scalability

* Works with a growing recipe dataset (NoSQL or vector DB).
* Modular APIs allow scaling with more users or dietary modules (e.g., diabetic-friendly, gluten-free).

---

## 🧪 Example Interaction

**User**: I have tofu, spinach, and rice. I want something vegan and under 400 calories.
**Chef-GPT**: Suggests “Vegan Spinach-Tofu Rice Bowl” with ingredients, prep steps, time, and nutrition info.

---


