import streamlit as st
import requests
import json
from datetime import datetime

# Set page configuration
st.set_page_config(
    page_title="👨‍🍳 Chef-GPT - AI Recipe Generator",
    page_icon="🍳",
    layout="wide"
)

# Title and description
st.title("👨‍🍳 Chef-GPT - AI-Powered Recipe Assistant")
st.markdown("""
**Chef-GPT** helps you cook delicious meals with the ingredients you already have. 
Simply enter your available ingredients, and get personalized recipe suggestions tailored to your dietary preferences and calorie goals.
""")

# Sidebar with instructions
with st.sidebar:
    st.header("📋 How to Use")
    st.markdown("""
    1. Enter ingredients you have (comma separated)
    2. Optionally select dietary preferences
    3. Optionally set calorie limit
    4. Click 'Generate Recipe'
    5. Enjoy your personalized recipe!
    """)
    
    st.header("💡 Tips")
    st.markdown("""
    - Be specific with ingredients (e.g., "chicken breast, rice, broccoli")
    - Dietary options: vegan, keto, low-carb, high-protein, etc.
    - Calorie limits help adjust portions
    """)

# Main content area
col1, col2 = st.columns([3, 1])

with col1:
    # Input fields
    ingredients = st.text_area(
        "📝 Enter your ingredients (comma separated)",
        placeholder="e.g., chicken, rice, tomatoes, onions, garlic...",
        height=100
    )
    
    diet_options = ["None", "Vegan", "Vegetarian", "Keto", "Low-Carb", "High-Protein", "Gluten-Free", "Dairy-Free"]
    diet = st.selectbox("🥗 Dietary Preference (Optional)", diet_options)
    
    calories = st.number_input(
        "🔥 Calorie Limit (Optional)", 
        min_value=100, 
        max_value=5000, 
        value=None, 
        step=50,
        placeholder="Enter calorie limit"
    )

with col2:
    st.write("")
    st.write("")
    generate_btn = st.button("✨ Generate Recipe", type="primary", use_container_width=True)
    
    # Info box
    with st.expander("ℹ️ About Chef-GPT"):
        st.markdown("""
        Chef-GPT uses advanced AI to:
        - Generate personalized recipes
        - Adapt to dietary restrictions
        - Optimize for calorie goals
        - Provide step-by-step instructions
        """)

# Generate recipe when button is clicked
if generate_btn:
    if not ingredients.strip():
        st.error("⚠️ Please enter at least one ingredient!")
    else:
        with st.spinner("👨‍🍳 Cooking up your personalized recipe..."):
            try:
                # Prepare the request to the backend API
                api_url = "http://localhost:8000/api/recipes"  # Assuming backend runs on port 8000
                
                # Parse ingredients string into a list
                ingredients_list = [item.strip() for item in ingredients.split(',') if item.strip()]
                
                payload = {
                    "ingredients": ingredients_list,
                    "diet": diet if diet != "None" else None,
                    "calories": int(calories) if calories else None
                }
                
                # Make request to the backend
                response = requests.post(
                    api_url,
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    result = response.json()
                    recipe = result["recipe"]
                    
                    # Display the recipe
                    st.success("✅ Recipe generated successfully!")
                    
                    st.subheader("🍽️ Your Personalized Recipe")
                    st.markdown("---")
                    
                    # Display the recipe with improved formatting
                    st.markdown(recipe)
                    
                    # Add download button for the recipe
                    st.download_button(
                        label="📥 Download Recipe",
                        data=recipe,
                        file_name=f"chef-gpt-recipe-{datetime.now().strftime('%Y%m%d-%H%M%S')}.txt",
                        mime="text/plain"
                    )
                    
                else:
                    st.error(f"❌ Error from backend: {response.status_code} - {response.text}")
                    
            except requests.exceptions.ConnectionError:
                st.error("❌ Could not connect to the backend API. Please make sure the FastAPI server is running.")
                st.info("💡 Run the backend server with: `cd backend && uvicorn main:app --reload`")
                
            except Exception as e:
                st.error(f"❌ An error occurred: {str(e)}")

# Footer
st.markdown("---")
st.markdown("*👨‍🍳 Powered by Chef-GPT - AI Recipe Assistant | Made with ❤️ using Streamlit & Google Gemini*")