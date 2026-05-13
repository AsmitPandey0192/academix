# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Academix is a student result prediction ML platform built with Next.js 16 (App Router), using TypeScript, PostgreSQL, and GROQ/Gemini API for AI insights.

## Commands

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Architecture

### Authentication Flow
- JWT-based sessions via `jose` library (`lib/jwt.ts`)
- Cookie-based session storage with `SESSION_COOKIE` constant (`lib/auth-constants.ts`)
- Two user roles: `student` and `educator`
- Session verification middleware pattern in API routes

### Key Libraries
- **Database**: `pg` (node-postgres) with connection pooling via `getPool()` in `lib/db.ts`
- **AI Insights**: `@google/generative-ai` (Gemini 1.5 flash) for educator analytics insights
- **Forms**: `react-hook-form` + `zod` for validation
- **UI**: Tailwind CSS 4.x, Radix UI primitives, `class-variance-authority`

### Data Flow
1. Educator uploads CSV → `lib/educator-analytics.ts:buildAnalyticsFromCsv()` parses and computes predictions
2. CSV sample sent to Gemini API → returns `AiInsights` (classSummary, keyInsights, recommendations)
3. Client displays analytics dashboard with charts via `recharts`

### Auth Context
- `AuthProvider` in `lib/auth-context.tsx` manages user state across the app
- Profile enrichment via `lib/profile-resolver.ts` (merges mock data with auth user)
- Mock data in `lib/mock-data.ts` provides `Student`, `Educator`, and `AnalyticsOverview` types

### API Routes
- `/api/auth/*` - login, logout, register, me
- `/api/educator/*` - analyze (CSV upload with Gemini insights), invites
- `/api/student/*` - invites management

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - JWT signing secret (min 16 chars in production)
- `GEMINI_API_KEY` - For AI insights (optional, graceful fallback if missing)