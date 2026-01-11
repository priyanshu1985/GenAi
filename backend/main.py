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

try:
    from routes.auth_routes import router as auth_router
except ImportError as e:
    print(f"Import error for auth routes: {e}")
    auth_router = None

try:
    from routes.user_language_routes import router as language_router
except ImportError as e:
    print(f"Import error for language routes: {e}")
    language_router = None

try:
    from routes.video_routes import router as video_router
except ImportError as e:
    print(f"Import error for video routes: {e}")
    video_router = None

try:
    from routes.message_routes import router as message_router
except ImportError as e:
    print(f"Import error for message routes: {e}")
    message_router = None

try:
    from routes.child_routes import router as child_router
except ImportError as e:
    print(f"Import error for child routes: {e}")
    child_router = None

app = FastAPI(title="Buildathon Backend - Multi-Language", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/")
async def root():
    return {"message": "Buildathon Backend API - Multi-Language", "status": "running", "supported_languages": ["hi", "en", "te", "mr"]}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running properly"}

if user_router:
    app.include_router(user_router, prefix="/api")
else:
    print("Warning: Could not load user routes")

if ai_router:
    app.include_router(ai_router, prefix="/api")
else:
    print("Warning: Could not load AI routes")

if auth_router:
    app.include_router(auth_router, prefix="/api")
else:
    print("Warning: Could not load auth routes")

if language_router:
    app.include_router(language_router, prefix="/api")
else:
    print("Warning: Could not load language routes")

if video_router:
    app.include_router(video_router, prefix="/api")
else:
    print("Warning: Could not load video routes")

if message_router:
    app.include_router(message_router, prefix="/api")
else:
    print("Warning: Could not load message routes")

if child_router:
    app.include_router(child_router, prefix="/api")
else:
    print("Warning: Could not load child routes")
