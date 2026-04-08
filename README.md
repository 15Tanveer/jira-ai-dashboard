# Jira AI Analytics Dashboard

Production-grade fullstack application with hybrid analytics + RAG chat over Jira issues.

## Stack
- Backend: Node.js + TypeScript + Express + Prisma + PostgreSQL (pgvector) + Redis + OpenAI
- Frontend: Next.js App Router + Tailwind + Recharts

## Quick Start
1. `cp backend/.env.example backend/.env`
2. `docker compose up -d`
3. `npm install`
4. `npm run prisma:generate -w backend`
5. `npm run prisma:migrate -w backend`
6. `npm run seed -w backend`
7. `npm run dev`

## APIs
- `GET /api/metrics/project-health`
- `GET /api/metrics/overburn`
- `GET /api/metrics/utilization`
- `GET /api/metrics/sentiment`
- `POST /api/chat`
- `POST /api/chat/stream` (SSE)

## Notes
- Replace `backend/src/data/jira-seed.json` with your provided Jira export.
- Designed so seed ingestion can be swapped for Jira REST API ingestion service later.
