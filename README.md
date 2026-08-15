# Jira AI Analytics Dashboard

A full-stack engineering analytics application that combines structured Jira metrics with retrieval-augmented AI chat over issue data.

Instead of treating an LLM as the analytics engine, the project separates deterministic project metrics from conversational retrieval: conventional services calculate measurable signals, while the RAG layer is used to explore and explain the underlying Jira context.

## What it does

- Project-health analytics over Jira issue data
- Overburn and utilisation metrics
- Sentiment-oriented analysis
- AI chat over Jira issues using retrieval-augmented generation
- Streaming chat responses over Server-Sent Events (SSE)
- PostgreSQL vector search with `pgvector`
- Redis-backed infrastructure
- Seed-based Jira ingestion designed to be replaceable with Jira REST API ingestion

## Architecture

```text
Jira issue data
      │
      ├──► Analytics services ──► Project metrics
      │
      └──► Embeddings / pgvector ──► Retrieval ──► AI chat

                         API
                          │
                    Next.js UI
```

The split keeps quantitative metrics deterministic while allowing the conversational layer to answer questions using retrieved issue context.

## Tech stack

### Backend

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- pgvector
- Redis
- OpenAI

### Frontend

- Next.js App Router
- Tailwind CSS
- Recharts

### Infrastructure

- Docker Compose

## Quick start

```bash
cp backend/.env.example backend/.env
docker compose up -d
npm install
npm run prisma:generate -w backend
npm run prisma:migrate -w backend
npm run seed -w backend
npm run dev
```

## API surface

```text
GET  /api/metrics/project-health
GET  /api/metrics/overburn
GET  /api/metrics/utilization
GET  /api/metrics/sentiment
POST /api/chat
POST /api/chat/stream
```

`/api/chat/stream` streams responses using SSE.

## Jira data

The current ingestion path uses the Jira export at:

```text
backend/src/data/jira-seed.json
```

The ingestion boundary is intentionally structured so the seed source can later be replaced by a Jira REST API integration without redesigning the analytics and retrieval layers.

## Why this project

The project explores a practical pattern for AI-enabled internal tools: use normal application logic for facts that can be calculated reliably, and use retrieval + an LLM where natural-language exploration adds value.

## Status

Engineering / AI systems project under active development.
