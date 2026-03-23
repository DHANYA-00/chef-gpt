import openai
import os
from dotenv import load_dotenv

load_dotenv()

# Read provider + keys from .env.
# We keep backwards compatibility with older env var names (GEMINI_API_KEY/XAI_API_KEY).
provider = os.getenv("LLM_PROVIDER", "groq").strip().lower()

if provider == "xai":
    api_key = os.getenv("XAI_API_KEY")
    if not api_key:
        raise ValueError("Missing XAI_API_KEY in .env (LLM_PROVIDER=xai).")
    model_name = os.getenv("XAI_MODEL", "grok-2")
    client = openai.OpenAI(api_key=api_key, base_url="https://api.x.ai/v1")
elif provider == "groq":
    api_key = os.getenv("GROQ_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Missing GROQ_API_KEY in .env (LLM_PROVIDER=groq).")
    model_name = os.getenv("GROQ_MODEL", "llama3-70b-8192")
    # Groq provides an OpenAI-compatible API.
    client = openai.OpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")
else:
    # Google Gemini OpenAI-compatible endpoint (legacy).
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Missing GEMINI_API_KEY in .env.")
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    client = openai.OpenAI(
        api_key=api_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    )

system_prompt = """
You are Chef-GPT, a professional recipe assistant.
- Always provide clear, step-by-step instructions.
- Ensure the recipe is simple, creative, and beginner-friendly.
- If calories or diet preferences are given, adapt the recipe accordingly.
"""

def _fallback_recipe(ingredients_str: str, diet: str = None, calories: int = None) -> str:
    title = "Quick Pantry Skillet"
    diet_line = f"- Diet target: {diet}\n" if diet else ""
    calories_line = f"- Calorie target: under {calories}\n" if calories else ""
    return (
        f"## {title}\n\n"
        "AI service is temporarily unavailable, so here is a reliable fallback recipe.\n\n"
        f"### Ingredients\n- {ingredients_str}\n- 1 tbsp oil\n- Salt and pepper to taste\n\n"
        "### Steps\n"
        "1. Prep and chop all ingredients into bite-sized pieces.\n"
        "2. Heat oil in a pan over medium heat.\n"
        "3. Add firm ingredients first and cook for 4-6 minutes.\n"
        "4. Add soft ingredients and season well.\n"
        "5. Cook until tender and serve warm.\n\n"
        "### Notes\n"
        f"{diet_line}"
        f"{calories_line}"
        "- Add herbs, lemon, or chili flakes for extra flavor.\n"
    )

def fetch_recipe(ingredients, diet: str = None, calories: int = None):
    
    # Handle both string and list inputs for ingredients
    if isinstance(ingredients, list):
        ingredients_str = ", ".join(ingredients)
    else:
        ingredients_str = str(ingredients)
    
    user_prompt = f"""
    Think step by step about how to combine these ingredients into a recipe.
    Ingredients: {ingredients_str}.
    {f'The recipe should be suitable for a {diet} diet.' if diet else ''}
    {f'Try to keep it under {calories} calories.' if calories else ''}

    First, explain your reasoning briefly.
    Then, provide the final recipe in a structured format.
    """

    try:
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            top_p=0.9,
            max_tokens=1000
        )
        return response.choices[0].message.content.strip()
    except Exception:
        return _fallback_recipe(ingredients_str, diet, calories)
