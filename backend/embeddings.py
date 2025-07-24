# backend/embeddings.py
import os
import chromadb
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# ChromaDB client
client     = chromadb.PersistentClient(path="./vector_store")
collection = client.get_or_create_collection(name="insurance_docs")

# Local model for embeddings
_model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_local(texts: list[str]) -> list[list[float]]:
    return _model.encode(texts).tolist()

def embed_and_store(doc_id: str, texts: list[str]):
    embs = embed_local(texts)
    # store in Chroma under the doc_id namespace
    for idx, (chunk, emb) in enumerate(zip(texts, embs)):
        collection.add(
            documents=[chunk],
            embeddings=[emb],
            ids=[f"{doc_id}_{idx}"],
            metadatas=[{"doc_id": doc_id}],
        )
    return embs

def retrieve_relevant(query: str, k: int = 5) -> list[str]:
    q_emb = embed_local([query])[0]
    results = collection.query(
        query_embeddings=[q_emb],
        n_results=k,
    )
    return results["documents"][0]
