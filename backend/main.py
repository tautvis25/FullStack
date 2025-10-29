from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# --- 1. DATABASE SETUP (Replace with your actual SQLModel/SQLAlchemy code) ---
# Since we don't have a database connection here, we will simulate the DB interaction
# by using a dictionary to store data *across requests*, which is better than a list
# but still NOT a true persistent database.
# A real solution requires connecting to Postgres/SQLite/etc. here.

# Simulating a persistent store (This is NOT production-ready for millions of users!)
# In a real app, this would be replaced by database queries (e.g., session.add(new_item))
mock_database = {}
next_id = 1

# --- App Setup ---
app = FastAPI()

# --- CORS CONFIGURATION ---
origins = [
    "http://localhost:5173",       # Your local React Dev Server
    "https://web-umber.vercel.app", # Your live Vercel frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # List of origins allowed to connect
    allow_credentials=True,       # Allow cookies/credentials
    allow_methods=["*"],          # Allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],          # Allow all request headers
)

# --- Item Model (Pydantic) ---
class Item(BaseModel):
    title: str
    description: Optional[str] = None
    # ID is returned by the DB, so it's optional on input but required on output
    id: Optional[int] = None 

# --- Response Model (What the API sends back) ---
class ItemResponse(Item):
    id: int


# --- 1. Your Working GET Route (Read All) ---
@app.get("/items", response_model=List[ItemResponse])
async def read_items():
    # In a real app: return session.exec(select(YourDatabaseTable)).all()
    
    # Simulating DB return:
    return list(mock_database.values())


# --- 2. THE WORKING POST ROUTE (Create Item and Save) ---
@app.post("/items", response_model=ItemResponse, status_code=201)
async def create_item(item: Item):
    global next_id
    
    # 1. Create the item object with a unique ID
    new_item_data = item.model_dump()
    new_item_data['id'] = next_id
    
    # 2. SIMULATE SAVING TO DATABASE
    mock_database[next_id] = ItemResponse(**new_item_data)
    
    # 3. Print the data (Logs on Render)
    print(f"--- DATABASE LOG ---")
    print(f"New Task SAVED and PRINTED! ID: {next_id}, Title: '{item.title}'")
    print(f"--------------------")
    
    # Increment ID for next request
    next_id += 1
    
    # Return the newly created item with its assigned ID
    return mock_database[new_item_data['id']]

# --- Root Route (Health Check) ---
@app.get("/")
async def root():
    return {"status": "Server is running and ready for requests!", "db_count": len(mock_database)}