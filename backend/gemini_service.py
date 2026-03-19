import openai
import os
from dotenv import load_dotenv

load_dotenv()

# Get API key from .env
api_key = os.getenv("XAI_API_KEY")
if not api_key:
    raise ValueError("XAI_API_KEY not found in .env file")

# Configure model and OpenAI client
# Use Grok model; override with XAI_MODEL in .env if needed.
model_name = os.getenv("XAI_MODEL", "grok-beta")

client = openai.OpenAI(
    api_key=api_key,
    base_url="https://api.x.ai/v1"
)

system_prompt = """
You are Chef-GPT, a professional recipe assistant.
- Always provide clear, step-by-step instructions.
- Ensure the recipe is simple, creative, and beginner-friendly.
- If calories or diet preferences are given, adapt the recipe accordingly.
"""

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

    final_prompt = f"{system_prompt.strip()}\n\n{user_prompt.strip()}"

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
