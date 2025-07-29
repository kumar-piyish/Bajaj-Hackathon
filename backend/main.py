from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
import fitz  # PyMuPDF
from datetime import datetime
from bson import ObjectId
import os
import jwt
import google.generativeai as genai

from database import users_col, docs_col, queries_col
from auth import register_user, authenticate_user, create_access_token, get_current_user
from embeddings import embed_and_store, retrieve_relevant
from models import RegisterRequest, TokenResponse, UploadPDFResponse, QueryRequest, QueryResponse

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Create FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# User Registration & Login
# -------------------------------

@app.post("/register")
def register(req: RegisterRequest):
    user_id = register_user(req.username, req.email, req.password)
    token = create_access_token(user_id)
    return {"access_token": token}


@app.post("/token", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_id = authenticate_user(form_data.username, form_data.password)
    token = create_access_token(user_id)
    return {"access_token": token}

# -------------------------------
# File Upload & Text Extraction
# -------------------------------

def extract_pdf_text(data: bytes) -> str:
    pdf = fitz.open(stream=data, filetype="pdf")
    return "\n".join(page.get_text() for page in pdf)

@app.post("/upload-pdf", response_model=UploadPDFResponse)
async def upload_pdf(
    document: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    data = await document.read()
    text = extract_pdf_text(data)

    words = text.split()
    chunks = [" ".join(words[i:i+500]) for i in range(0, len(words), 500)]

    doc = {
        "user_id": ObjectId(user_id),
        "filename": document.filename,
        "uploaded_at": datetime.utcnow()
    }
    res = docs_col.insert_one(doc)
    doc_id = str(res.inserted_id)

    embed_and_store(doc_id, chunks)

    return {"document_id": doc_id, "snippet": chunks[0][:300]}

# -------------------------------
# Query Processing
# -------------------------------
@app.post("/process-query", response_model=QueryResponse)
def process_query(
    req: QueryRequest,
    user_id: str = Depends(get_current_user)
):
    doc = docs_col.find_one({"_id": ObjectId(req.document_id), "user_id": ObjectId(user_id)})
    if not doc:
        raise HTTPException(404, "Document not found")

    context_chunks = retrieve_relevant(req.query, k=5)

    prompt = (f"""
You are a smart, professional assistant who specializes in analyzing health insurance policies.

Your task is to answer a user's question about coverage by reviewing:

1. The extracted content from a policy document
2. A specific user question about a health situation

--- POLICY DOCUMENT CONTENT ---
{chr(10).join(context_chunks)}

--- USER'S QUERY ---
"{req.query}"

🎯 Your response must be:
- ✅ Start with a **clear, direct answer** in 1 sentence (e.g., "Yes, this is covered", "No, this isn't covered", or "It depends")
- 💬 Then give a **simple explanation** in plain English that a non-expert can understand (1–2 short paragraphs max)
- 📑 Include a **short bullet list of supporting clauses** (quoted briefly from the policy)
- ❗ If key details are missing (e.g., waiting period info), say that clearly and suggest what the user can check

📝 Keep the format friendly, brief, and easy to scan. Use bullet points, spaces, and bold headers where helpful. Avoid long paragraphs or legal jargon.
""")

    model = genai.GenerativeModel("gemini-2.5-pro")
    resp = model.generate_content(prompt)
    answer = resp.text.strip()

    res = queries_col.insert_one({
        "user_id": ObjectId(user_id),
        "document_id": ObjectId(req.document_id),
        "query": req.query,
        "answer": answer,
        "timestamp": datetime.utcnow()
    })

    return {
        "answer": answer,
        "query_id": str(res.inserted_id)  # ✅ Properly indented now
    }


# backend/main.py (continued)

from models import FeedbackRequest
from database import feedback_col

@app.post("/feedback")
def submit_feedback(req: FeedbackRequest, user_id: str = Depends(get_current_user)):
    print("Received feedback:", req.dict())  # ✅ Log for debug

    feedback_col.insert_one({
        "user_id":     ObjectId(user_id),
        "query_id":    ObjectId(req.query_id),
        "feedback":    req.feedback,
        "timestamp":   datetime.utcnow()
    })
    return {"message": "Feedback recorded"}


# -------------------------------
# Health Check
# -------------------------------

@app.get("/health")
def health():
    return {"status": "ok"}
