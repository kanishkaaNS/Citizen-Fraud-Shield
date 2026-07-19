# Citizen Fraud Shield

AI-Powered Digital Public Safety Platform — built for **ET AI Hackathon 2026** (Problem Statement #6: AI for Digital Public Safety).

## What it does

Three pillars of fraud protection for Indian citizens:

| Pillar | Feature | Status |
|--------|---------|--------|
| 🛡️ Scam Detector | Analyzes call transcripts/messages for digital-arrest scam indicators | ✅ Live |
| 🔍 Counterfeit Detector | Checks currency note photos for counterfeit indicators | 🚧 Day 2 |
| 🕸️ Fraud Network Graph | Visualizes scammer-victim-mule connections | 🚧 Day 3 |

## Tech Stack

- **Frontend + API:** Next.js 16 (App Router), TypeScript
- **Styling:** Tailwind CSS v4
- **AI:** Google Gemini API (text + vision)
- **Database:** Supabase (Postgres)
- **Graph DB:** Neo4j Aura
- **Deployment:** Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Copy env template and fill in your keys
cp .env.example .env.local

# Run development server
npm run dev

# Run tests
npx vitest run
```

## Environment Variables

See `.env.example` for all required variables. You need:
- `GEMINI_API_KEY` — Google Gemini API key
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-only)
- `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` — Neo4j Aura credentials

## Supabase Setup

Create these tables in your Supabase project:

```sql
CREATE TABLE scam_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text_snippet TEXT,
  risk_score INTEGER,
  verdict TEXT,
  flagged_phrases JSONB,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE currency_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_hash TEXT,
  verdict TEXT,
  confidence INTEGER,
  indicators JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Architecture

```
Next.js Client (UI)
  /scam  /currency  /graph
        │ fetch() (JSON over HTTPS)
        ▼
Next.js API Routes (server)
  /api/scam/classify   /api/currency/check
  /api/graph/query     /api/reports
        │            │            │
        ▼            ▼            ▼
   Gemini API     Supabase      Neo4j Aura
```

## Team

Built by a 2-person team with AI-assisted development.

---

*Doubt hard. Build harder.*
