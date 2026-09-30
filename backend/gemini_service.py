import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


# -----------------------------
# Groq configuration
# -----------------------------

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("Missing GROQ_API_KEY in environment variables.")

client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
)

MODEL_NAME = "openai/gpt-oss-120b"


# -----------------------------
# System prompt
# -----------------------------

SYSTEM_PROMPT = """
You are Chef-GPT, a strict recipe assistant.

Create simple, practical, beginner-friendly recipes using ONLY the ingredients provided by the user.

STRICT RULES:
- Never invent, assume, or add ingredients not provided by the user.
- Do not assume pantry basics such as oil, salt, pepper, garlic, onion, spices, etc.
- Every ingredient in the recipe MUST be from the user's ingredient list.
- Every cooking step must use only the provided ingredients.
- Follow the requested diet and calorie limit.
- If the ingredients cannot make a suitable recipe, clearly say so instead of inventing ingredients.
- Do not claim exact calories unless reasonably calculable.
- Do not provide reasoning or chain-of-thought.
- Return only the final recipe.
"""


# -----------------------------
# Fallback recipe
# -----------------------------

def _fallback_recipe(
    ingredients_str: str,
    diet: str = None,
    calories: int = None
) -> str:

    diet_line = f"- Diet target: {diet}\n" if diet else ""
    calories_line = (
        f"- Calorie target: under {calories}\n"
        if calories
        else ""
    )

    return (
        "## Quick Pantry Recipe\n\n"
        "AI service is temporarily unavailable, "
        "so here is a simple fallback recipe.\n\n"
        "### Ingredients\n"
        f"- {ingredients_str}\n"
        "- 1 tbsp oil\n"
        "- Salt and pepper to taste\n\n"
        "### Steps\n"
        "1. Prepare and chop the ingredients.\n"
        "2. Heat oil in a pan over medium heat.\n"
        "3. Add the main ingredients and cook until tender.\n"
        "4. Add salt and pepper and mix well.\n"
        "5. Cook thoroughly and serve warm.\n\n"
        "### Notes\n"
        f"{diet_line}"
        f"{calories_line}"
        "- Add herbs, lemon or chili flakes for extra flavor.\n"
    )


# -----------------------------
# Generate recipe
# -----------------------------

def fetch_recipe(
    ingredients,
    diet: str = None,
    calories: int = None
):
    # Handle both list and string inputs
    if isinstance(ingredients, list):
        ingredients_str = ", ".join(ingredients)
    else:
        ingredients_str = str(ingredients)

    user_prompt = f"""
Create a recipe using these ingredients:

Ingredients: {ingredients_str}

Diet preference:
{diet if diet else "No specific diet"}

Calorie target:
{calories if calories else "No specific calorie target"}

Return the recipe using this structure:

## Recipe Name

### Ingredients
- ingredient 1
- ingredient 2

### Steps
1. Step one
2. Step two
3. Step three

### Notes
- Useful tips
- Nutrition/diet considerations if relevant
"""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            temperature=0.7,
            max_tokens=1000
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print("GROQ ERROR:", repr(e))

        return _fallback_recipe(
            ingredients_str,
            diet,
            calories
        )
