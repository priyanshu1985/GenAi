from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from routes.user_routes import router as user_router
except ImportError as e:
    print(f"Import error for user routes: {e}")
    user_router = None

try:
    from routes.ai_routes import router as ai_router
except ImportError as e:
    print(f"Import error for AI routes: {e}")
    ai_router = None

app = FastAPI(title="Buildathon Backend", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Buildathon Backend API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running properly"}

if user_router:
    app.include_router(user_router)
else:
    print("Warning: Could not load user routes")

if ai_router:
    app.include_router(ai_router)
else:
    print("Warning: Could not load AI routes")
