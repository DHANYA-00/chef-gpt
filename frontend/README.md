# Chef-GPT Frontend

This is the Streamlit-based frontend for the Chef-GPT recipe generator application.

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Ensure Backend is Running:**
   The frontend communicates with the backend API. Make sure the FastAPI backend is running:
   ```bash
   cd ../backend
   uvicorn main:app --reload
   ```

3. **Run the Streamlit App:**
   ```bash
   streamlit run app.py
   ```

## Features

- Clean, user-friendly interface
- Ingredient input with text area
- Dietary preference selector
- Calorie limit input
- Real-time recipe generation
- Downloadable recipes
- Responsive design

## How to Use

1. Enter your available ingredients in the text area (comma-separated)
2. Select a dietary preference if desired
3. Set a calorie limit if desired
4. Click "Generate Recipe"
5. View and enjoy your personalized recipe!

## Troubleshooting

- If you get a connection error, make sure the backend API server is running on `http://localhost:8000`
- Ensure your `.env` file contains the `GEMINI_API_KEY`