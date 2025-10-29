from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict


app = FastAPI(
    title="Simple Backend API",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",          # For local testing
    #"https://YOUR_VERCEL_URL.vercel.app" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root() -> Dict[str, str]:
    return {"message": "Hello from the Backend Server!"}

@app.get("/api/data")
async def get_data() -> Dict[str, str]:

    return {"greeting": "Data successfully fetched from FastAPI!"}

#uvicorn main:app --host 0.0.0.0 --port $PORT