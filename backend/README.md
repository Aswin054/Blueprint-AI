# Roadmap — AI-Generated Project Roadmaps for Beginners

> Describe a software project you want to build. Get back a structured,
> step-by-step roadmap — broken into phases and checkable tasks — tailored
> to your skill level, time available, and tech stack. Edit it anytime
> just by chatting with it.

Built for students and beginners who know *what* they want to build but
not *what order* to build it in. No accounts, no database — your roadmap
and progress are saved locally in your browser.

---



## Why this exists

ChatGPT can already generate a roadmap like this in one prompt — and it's
worth being upfront about that. What this app adds on top:

- **Persistent, trackable progress.** A chat reply disappears into scroll
  history. This app turns that one-time answer into checkboxes that
  survive a refresh.
- **A constrained, single-purpose tool.** It only does one job — structure
  a software project into phases and tasks — with a fixed output schema,
  so the result is consistent every time instead of varying by how you
  phrase the prompt.
- **A demonstration of engineering judgment**, not just a wrapper around
  an API call: a backend proxy that protects the API key, rate limiting
  that caps cost, strict JSON validation instead of fragile text-parsing,
  and a clean separation between frontend and backend.

---

## How it works

1. You describe your project idea in plain language.
2. The app asks a few clarifying questions — skill level, time available,
   preferred tech stack, and any extra goals.
3. The backend sends this to an LLM (via Groq's free API) with a strict
   prompt that forces clean JSON output — no prose, no markdown.
4. The response is validated against a fixed schema (Pydantic) and
   rendered as numbered phases, each with checkable tasks.
5. You check off tasks as you go. Progress is saved in your browser's
   local storage automatically — no login required.
6. Want to change something? Type an instruction like *"make phase 2
   easier"* or *"swap React for Vue"* — the AI edits the existing roadmap
   in place rather than starting over.

---

## Tech stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Browser `localStorage` for persistence — no backend database

**Backend**
- Python + FastAPI
- Pydantic for strict request/response validation
- Groq API (Llama 3.1) for roadmap generation — free tier, fast inference
- SlowAPI for per-IP rate limiting (default: 5 generations/day)
- `python-dotenv` for environment variable management

**Deployment**
- Frontend → [Vercel](https://vercel.com)
- Backend → [Render](https://render.com) or [Railway](https://railway.app)

---

## Project structure

```
roadmap-app/
├── frontend/                  React app (Vite + Tailwind)
│   └── src/
│       ├── components/        UI components (input, questions, roadmap, chat edit)
│       ├── hooks/              useLocalStorage — persistence layer
│       └── lib/                 api.js — talks only to OUR backend, never Groq directly
│
├── backend/                   Python + FastAPI proxy
│   └── app/
│       ├── routes/            /api/generate-roadmap, /api/edit-roadmap
│       ├── services/          groq_client.py — wraps the Groq API call
│       ├── middleware/        rate_limiter.py — SlowAPI config
│       ├── prompts/           System prompts for generation + editing
│       └── models/            schemas.py — Pydantic models (Task, Phase, Roadmap)
│
└── README.md
```

---

## Getting started

### Prerequisites
- Node.js 18+
- Python 3.10+
- A free [Groq API key](https://console.groq.com)

### 1. Clone and set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```
GROQ_API_KEY=your_groq_api_key_here
```

Run the server:

```bash
uvicorn app.main:app --reload
```

The API will be live at `http://localhost:8000`. Interactive docs are
available at `http://localhost:8000/docs`.

### 2. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/` (or confirm the existing one):

```
VITE_API_BASE_URL=http://localhost:8000
```

Run the dev server:

```bash
npm run dev
```

The app will be live at `http://localhost:5173`.

---

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/generate-roadmap` | Generates a new roadmap from a project idea + clarifying answers |
| `POST` | `/api/edit-roadmap` | Modifies an existing roadmap based on a chat instruction |
| `GET` | `/health` | Health check |

Request/response shapes are defined in `backend/app/models/schemas.py`
and enforced automatically by Pydantic.

---

## Design notes

- **No accounts, no user database.** Roadmaps and progress live entirely
  in the browser's local storage. This was a deliberate scope decision —
  it removes auth, GDPR-shaped concerns, and backend storage complexity
  for a v1 that's meant to be demoed instantly, with zero signup friction.
- **The backend exists specifically to protect the API key.** The
  frontend never talks to Groq directly — every request routes through
  the FastAPI proxy, which is the only place the key is held.
- **Rate limiting caps cost, not just abuse.** Since this is a free
  portfolio project with no monetization, the 5-requests-per-day-per-IP
  limit exists to keep the worst-case cost bounded even if the link gets
  shared widely.

---

## Possible next steps (v2 ideas)

- User accounts + a real database, for cross-device sync
- Streaks / reminders to build habit-forming follow-through, not just
  one-time roadmap generation
- Exportable roadmaps (PDF / Markdown)
- A small library of pre-vetted project ideas for users who don't have
  one yet

---

## License

This project is licensed under the [MIT License](LICENSE) — free to use,
modify, and build on.

---

## Author

Built by **Aswin** — Electrical and Electronics Engineering student,
working at the intersection of robotics, AI/ML, and software engineering.
