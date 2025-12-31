from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from docx import Document
import json
import re
from google import genai

doc = Document("movie_dataset_wording.docx")

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


client = genai.Client(api_key="AIzaSyAhYe_BFqNFC0K5Tg-2Z8MyPEWHNmNB8FQ")
model_name = "gemini-2.5-flash"

def rag_gemini_answer(query):
    context = retrieve_context(query)

    prompt = f"""
You are a movie recommendation system.

Using ONLY the provided context, recommend movies that match the user query.

Rules:
- Respond ONLY in valid JSON
- Do NOT explain anything
- Do NOT add markdown
- Do NOT add extra text

Return JSON in this exact format:
{{
  "movies": [
    {{
      "id": 1,
      "title": "Generated Movie Name",
      "language": "Tamil / English / Hindi / Telugu / Malayalam",
      "genre": "Action / Comedy / Drama / Romance / Sci-Fi / Thriller",
      "mood": "Happy / Emotional / Intense / Romantic / Dark",
      "rating": 7.5
    }}
  ]
}}

Context:
{chr(10).join(context)}

User Query:
{query}
"""

    response = client.models.generate_content(
        model=model_name,
        contents=prompt
    )

    text = response.text.strip()
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return []

    try:
        parsed = json.loads(match.group())
        return parsed.get("movies", [])
    except json.JSONDecodeError:
        return []

