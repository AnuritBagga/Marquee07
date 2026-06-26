# Marquee — AI Interviewer Landing Page (PRD)

## Original Problem Statement
Founder wants to build "Marquee" — an AI Interviewer platform with three product modes:
1. **Campuses/Universities** — student interview training
2. **Companies** — auto Round-1 shortlisting with custom parameters
3. **Self-Practice** — individual learners

Interview domains: Technical (DSA / coding / system design), Engineering fields (Mechanical / CS / etc.), Government exams (UPSC, NDA, CDS), JD-based custom, Behavioral.

Stage 1 ask: **Frontend only**. Highly attractive, "cult-classic-yet-royal", new-age cinematic site with scroll-driven animation, parallax, layered depth, smooth easing, lighting & shadow that feels like one continuous scene. Budget: under 10 credits.

## User Personas
- **Campus Placement Officer** — needs cohort-scale mock interviews & readiness dashboards
- **Recruiter / Talent Lead** — wants JD-based auto-shortlist with rationale & bias-audited transcripts
- **Aspiring Candidate** — student / UPSC / engineering grad needing unlimited private rehearsal
- **Govt Exam Aspirant** — UPSC personality test, NDA / CDS interview practice

## Core Requirements (static)
- One-page cinematic marketing site
- Dark royal aesthetic (deep obsidian + gold accent), non-AI-slop
- Cormorant Garamond serif headings + Satoshi sans body + JetBrains Mono code
- Lenis smooth scroll + Framer Motion parallax / layered depth
- Sections: Nav · Hero · Method (live demo mockup) · Three Modes · Domains · Testimonial · CTA + Footer

## What's Been Implemented (2026-02-21 · iter 5 — Live AI)
- All previous iterations (Landing · Demo lobby · 3D Walk-in · Session · Scorecard · InterviewerCam)
- ✅ **Backend `/api/sessions/next-question`** — Groq Llama 3.3 70B with per-domain personas (Riya / Karan / Dr. Mehta / Anya), strict 1-question-at-a-time, cross-questions from history, terminates with `[END]` after ~5 turns
- ✅ **Backend `/api/sessions/transcribe`** — Multipart audio → Groq Whisper Large v3 → text
- ✅ **`useLiveInterview(domain)` hook** — full duplex loop: fetch question → SpeechSynthesis (browser TTS) → MediaRecorder mic capture (25s max, with `Stop & submit`) → backend transcribe → next question. Drives a simulated amplitude curve while TTS plays
- ✅ **Session "Start Live AI Round" button** (gold pill in header) — toggles between scripted demo and real-AI mode; live transcript replaces scripted transcript when active; phase pill shows `asking/speaking/listening/transcribing/ended/error`
- ✅ **InterviewerCam amplitude sync** — when a live `amplitude` prop is supplied, the mouth-pulse glow is driven by it directly instead of the simulated sine
- ✅ `GROQ_API_KEY` stored server-side only in `/app/backend/.env`; key is never exposed to the browser

## Files / Architecture (current)
- `/app/backend/server.py` — status checks + `/api/sessions/next-question` + `/api/sessions/transcribe`
- `/app/backend/.env` — `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`, `GROQ_API_KEY`
- `/app/frontend/src/hooks/useLiveInterview.js` — orchestration hook
- `/app/frontend/src/components/session/InterviewerCam.jsx` — accepts optional `amplitude` for live sync
- `/app/frontend/src/pages/Session.jsx` — Live mode integration
- All Iter 1–4 files unchanged
- ✅ Brand identity established — "Marquee · The New Standard of Interviewing"
- ✅ Lenis-powered smooth-scroll experience + cinematic landing page
- ✅ Three-Modes asymmetric bento grid + Domains marquee + Testimonial + CTA + Footer
- ✅ `/demo` lobby with 4 cinematic rooms
- ✅ `/demo/:domain` Session — typewriter Q&A, code editor with syntax highlighting, live metrics, controls
- ✅ Scorecard with weighted metrics + closing remark + retry/access CTAs
- ✅ `/demo/:domain/enter` — 3D cinematic walk-in (door opens, walk forward, "have a seat", camera descends)
- ✅ **Iter 4 — Real Interviewer Cam in Session:**
  - New `InterviewerCam` component shows a high-resolution portrait of the assigned interviewer (Riya Menon for DSA, Karan Iyer for System Design, Dr. Mehta for UPSC, Anya Kapoor for Behavioral)
  - 2.5D layered scene: blurred boardroom background → warm spotlight halo → portrait → mouth-area pulse → vignette → nameplate + LIVE/REC HUD
  - Speaking sync: when the AI question is being typed (typewriter active), the portrait micro-animates (subtle scale, breathing tilt, brightness pulse, mouth glow) — the visual equivalent of lip-sync to the AI question audio. When candidate is answering, switches to "Listening" with calmer motion. When idle, gentle breathing only.
  - Audio bars and SPEAKING / LISTENING / ON AIR HUD label transition in real time.
- ✅ Stylized 3D walk-in chairperson kept as silhouette+gold pin (intentional: the real face reveal happens at the session transition for dramatic effect)

## Files / Architecture
- `/app/frontend/src/pages/{Landing,Demo,Enter,Session}.jsx`
- `/app/frontend/src/components/landing/*` — Nav, Hero, LiveDemo, ThreeModes, Domains, Testimonial, CTAFooter, SmoothScroll
- `/app/frontend/src/components/three/*` — InterviewRoom, Panelist, CinematicCamera (walk-in)
- `/app/frontend/src/components/session/InterviewerCam.jsx` — **NEW** animated portrait panel
- `/app/frontend/src/data/interviewScripts.js` — 4 scripted Q&A sequences with portrait URLs + interviewer titles

## Prioritized Backlog
- **P0 (next phase)** — Build the actual mock interview flow UI (clickable demo) + campus/company dashboard previews
- **P0** — Backend: FastAPI auth, sessions, transcription pipeline (Whisper), follow-up LLM (Claude/GPT)
- **P1** — Real-time WebRTC audio capture in browser; live transcription view
- **P1** — Code editor (Monaco) integration with run/grade flow for DSA
- **P1** — Recruiter dashboard: candidate list, scorecards, transcript replays
- **P2** — Campus admin: cohort upload, assignment scheduling, readiness analytics
- **P2** — Bias-audit reports & transcript exports
- **P2** — Pricing page, blog/manifesto, careers
- **P2** — Mobile fine-tune of the cinematic parallax (currently desktop-optimized)

## Next Tasks
1. Validate visual direction with founder
2. Decide LLM provider (Claude / GPT / Gemini) for cross-questioning
3. Decide STT provider (OpenAI Whisper vs Deepgram)
4. Begin Phase 2: clickable mock interview flow (still no backend, but full UI)
