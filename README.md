# TEXT-TO-SQL Generator

A secure web app that converts natural language to SQL queries using Groq API (Llama3), with dual-layer security.

## Stack
- **Frontend**: React.js + Vite
- **Backend**: Python Flask
- **AI**: Groq API (llama3-70b-8192)
- **DB Support**: MySQL, PostgreSQL, SQLite, MongoDB
- **Security**: Dual-layer (Prompt + Response)

---

## Setup

### 1. Backend (Flask)
```bash
cd server
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
# Add your Groq API key → https://console.groq.com
```

Edit `server/.env`:
```
GROQ_API_KEY=your_key_here
FLASK_DEBUG=true
PORT=5000
```

Run the server:
```bash
cd server
python app.py
```
Flask runs at: http://localhost:5000

---

### 2. Frontend (React)
```bash
cd client
npm install
npm run dev
```
React runs at: http://localhost:5173

---

## How It Works

```
User Prompt
    ↓
[Security Layer 1] — Prompt injection / SQL injection detection
    ↓ (safe)
[Groq API] — Generates SQL based on prompt + DB type
    ↓
[Security Layer 2] — Scans for DROP/DELETE/TRUNCATE/harmful patterns
    ↓
React UI — Shows query + warnings
```

## API

**POST /api/query**
```json
{
  "prompt": "Get all users created last month",
  "dbType": "postgresql"
}
```
Response:
```json
{
  "sql": "SELECT * FROM users WHERE ...",
  "dbType": "postgresql",
  "warnings": [],
  "blocked": false
}
```

**GET /api/health** — Health check