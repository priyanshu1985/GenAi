# Buildathon - Voice-First Learning Assistant for Children

A multilingual, personalized learning assistant for children using AI-powered voice interactions.

## Tech Stack

**Frontend:** React + Vite
**Backend:** Python FastAPI + Hugging Face + OpenRouter

## Project Structure

```
buildathon/
├── backend/                 # Python FastAPI backend
│   ├── AI/                  # AI pipeline modules
│   │   ├── stt.py          # Speech-to-Text (Whisper)
│   │   ├── llm.py          # LLM (OpenRouter/Mistral)
│   │   ├── tts.py          # Text-to-Speech (MMS-TTS)
│   │   ├── pipeline.py     # Complete pipeline
│   │   └── profiles.py     # Child profiles
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── main.py             # FastAPI app
│   └── requirements.txt    # Python dependencies
├── src/                    # React frontend
└── README.md
```

---

## How to Run

You need **2 terminals** - one for backend, one for frontend.

### Terminal 1: Backend (Python)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# On Windows (Command Prompt):
venv\Scripts\activate

# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# On Windows (Git Bash):
source venv/Scripts/activate

# On macOS/Linux:
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt
python -m pip install -r requirements.txt
# Run the backend server
uvicorn main:app --reload --port 8000
```

Backend will be running at: `http://localhost:8000`

### Terminal 2: Frontend (React)

```bash
# Navigate to project root (if not already there)
cd buildathon

# Install dependencies (first time only)
npm install

# Run the frontend
npm run dev
```

Frontend will be running at: `http://localhost:5173`

---

## Environment Variables

Create a `.env` file in the `backend/` folder:

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret

# Hugging Face
HF_API_KEY=your_huggingface_api_key

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key

# AI Mode: "live" or "mock"
AI_MODE=live
```

---

## API Endpoints

| Method | Endpoint            | Description                               |
| ------ | ------------------- | ----------------------------------------- |
| POST   | `/ai/interact`      | Main voice interaction (audio + child_id) |
| POST   | `/ai/text`          | Text-only interaction                     |
| GET    | `/ai/children`      | List all child profiles                   |
| GET    | `/ai/child/{id}`    | Get specific child profile                |
| GET    | `/ai/greeting/{id}` | Get personalized greeting                 |
| GET    | `/ai/health`        | Check AI service health                   |

### Example: Test the /interact endpoint

```bash
curl -X POST "http://localhost:8000/ai/interact" \
  -F "file=@audio.wav" \
  -F "child_id=child_001"
```

---

## Quick Start Commands

### Windows Command Prompt

```cmd
:: Terminal 1 - Backend
cd backend
venv\Scripts\activate
uvicorn main:app --reload

:: Terminal 2 - Frontend
npm run dev
```

### Windows PowerShell

```powershell
# Terminal 1 - Backend
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload

# Terminal 2 - Frontend
npm run dev
```

### macOS / Linux

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload

# Terminal 2 - Frontend
npm run dev
```

### Git Bash (Windows)

```bash
# Terminal 1 - Backend
cd backend
source venv/Scripts/activate
uvicorn main:app --reload

# Terminal 2 - Frontend
npm run dev
```

---

## Sample Child Profiles

The system includes sample child profiles for testing:

| Child ID  | Name   | Age | Language | Level        |
| --------- | ------ | --- | -------- | ------------ |
| child_001 | Aarav  | 5   | Hindi    | Beginner     |
| child_002 | Priya  | 6   | Hindi    | Intermediate |
| child_003 | Ravi   | 4   | Tamil    | Beginner     |
| child_004 | Ananya | 5   | Telugu   | Beginner     |
| child_005 | Kiran  | 6   | English  | Intermediate |

---

## Troubleshooting

**Backend not starting?**

- Make sure virtual environment is activated
- Check if all dependencies are installed: `pip install -r requirements.txt`
- Verify `.env` file exists with correct API keys

**Frontend not connecting to backend?**

- Ensure backend is running on port 8000
- Check CORS settings in `main.py`

**API returning mock responses?**

- Set `AI_MODE=live` in `.env` file
- Restart the backend server
