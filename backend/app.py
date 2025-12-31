from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from docx import Document
import json
import re
import google.generativeai as genai
import os

path = "backend/movie_dataset_wording.docx"
doc = Document(path)

documents = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

embeddings = embed_model.encode(documents)
dimension = embeddings.shape[1]

index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings))

def retrieve_context(query, top_k=6):
    query_embedding = embed_model.encode([query])
    _, indices = index.search(np.array(query_embedding), top_k)
    return [documents[i] for i in indices[0]]


genai.configure(api_key="AIzaSyAhYe_BFqNFC0K5Tg-2Z8MyPEWHNmNB8FQ")

def rag_gemini_answer(query):
    context = retrieve_context(query)
    context_text = "\n".join(context)

    prompt = f"""You are a movie recommendation system. Based on the context provided, recommend movies matching the user query.

Context:
{context_text}

User Query: {query}

Respond ONLY with valid JSON in this exact format with no markdown, no explanation, no extra text:
{{"movies": [{{"id": 1, "title": "Movie Name", "language": "Tamil", "genre": "Action", "mood": "Intense", "rating": 8.0}}]}}"""

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        text = response.text.strip()
        
    except Exception as e:
        print(f"Gemini API Error: {e}")
        raise HTTPException(status_code=503, detail=f"AI service unavailable: {str(e)}")
    
    text = text.replace("```json", "").replace("```", "").strip()
    
    try:
        parsed = json.loads(text)
        return parsed.get("movies", [])
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        print(f"Response text: {text}")
        
        match = re.search(r'\{.*?"movies".*?\[.*?\].*?\}', text, re.DOTALL)
        if match:
            try:
                parsed = json.loads(match.group())
                return parsed.get("movies", [])
            except:
                pass
        
        return []


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class MovieQuery(BaseModel):
    query: str

@app.post("/recommend")
def recommend_movie(data: MovieQuery):
    try:
        result = rag_gemini_answer(data.query)
        return {"recommendation": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error in recommend_movie: {e}")
        raise HTTPException(status_code=500, detail=str(e))