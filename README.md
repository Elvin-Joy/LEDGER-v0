# LedgerAI

**LedgerAI** is an AI-powered personal expense tracker. Instead of filling out forms, users manage their expenses by talking to it in plain language — e.g. *"₹450 lunch today"* or *"How much did I spend on food this month?"*

Gemini interprets what the user means and returns structured data; a secure FastAPI backend handles all authentication, validation, and database operations. Gemini never touches the database directly and never generates SQL.

---

## Features

- **User authentication** — registration, login, logout, JWT-based sessions, Argon2 password hashing
- **User-specific data isolation** — a user can only ever see their own expenses
- **Expense management (CRUD)** — create, view, update, delete expenses
- **Filtering & sorting** — by category, date, amount, with ascending/descending order and pagination
- **Dashboard** — total spending, expense count, highest expense, spending-by-category donut chart, recent expenses table
- **Conversational AI assistant** — a single chat interface that can:
  - Create expenses from natural language (*"₹300 dinner today"*)
  - Answer spending questions from real data (*"How much did I spend on food?"*)
  - Hold basic general conversation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Recharts, lucide-react |
| Backend | Python, FastAPI, SQLAlchemy 2 |
| Database | PostgreSQL (hosted on Supabase) |
| Auth | JWT, Argon2 (via `pwdlib`) |
| AI | Google Gemini (`google-genai`) |

---

## Architecture

```
User
 │
 ▼
React Frontend
 │
 ▼
FastAPI Backend ── validation, auth, business logic
 │
 ├──► PostgreSQL (Supabase)
 │
 └──► Gemini (structured intent only, never SQL)
```

The AI never queries or modifies the database directly. It only reads the user's message and returns structured JSON (an action + data). FastAPI validates that JSON before doing anything with it.

### Unified AI endpoint

```
POST /ai/ask
```

Body:
```json
{ "question": "₹450 lunch today" }
```

Gemini classifies the request as one of:
- **CREATE_EXPENSE** — extracts amount, category, description, and date, then the backend validates and stores it
- **SPENDING_QUERY** — the backend retrieves the user's real expense data and Gemini answers using only that data

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A PostgreSQL database (a free [Supabase](https://supabase.com) project works well)
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET_KEY=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

- API base URL: `http://127.0.0.1:8000`
- Interactive docs (Swagger): `http://127.0.0.1:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- Frontend runs at: `http://localhost:5173`

---

## API Overview

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create a new user |
| POST | `/auth/login` | Log in and receive a JWT |
| GET | `/auth/me` | Get the current logged-in user |

### Expenses
| Method | Endpoint | Description |
|---|---|---|
| POST | `/expenses/` | Create an expense |
| GET | `/expenses/` | List expenses (supports filtering, sorting, pagination) |
| GET | `/expenses/{id}` | Get a single expense |
| PUT | `/expenses/{id}` | Update an expense |
| DELETE | `/expenses/{id}` | Delete an expense |
| GET | `/expenses/summary` | Get total spending, count, highest expense, by-category breakdown |

### AI
| Method | Endpoint | Description |
|---|---|---|
| POST | `/ai/ask` | Unified natural-language endpoint — handles both expense creation and spending questions |

All expense and AI endpoints require a valid JWT (`Authorization: Bearer <token>`).

---

## Project Structure

```
LEDGER-v0/
├── backend/
│   └── app/
│       ├── ai/              # Gemini service + AI routes
│       ├── models/          # SQLAlchemy models
│       ├── routes/          # Auth + expense routes
│       ├── schemas/         # Pydantic schemas
│       └── main.py
└── frontend/
    └── src/
        ├── components/
        │   ├── Auth/
        │   ├── AI/           # LedgerAI Assistant (chat UI)
        │   ├── Dashboard/
        │   └── Expenses/
        ├── pages/
        └── services/
```

---

## Example Usage

**Creating an expense:**
> "₹450 lunch today"
> → *"Added ₹450 for Lunch."*

**Asking about spending:**
> "How much did I spend on food?"
> → *"You spent ₹1,680.50 on food."*

---

## Notes / Scope

The scope is deliberately small and focused. Not included: receipt OCR, bank account/statement import, budget management, savings goals, recurring expense detection, background notifications, mobile app, and multi-currency support.

## Author

Built by Elvin Joy
