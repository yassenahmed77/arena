# ARENA — Next.js (App Router)

Personal coding-practice trainer built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Features
- **100% Free & Offline Ready**: Generates JavaScript problems, tests, and Franco-Arabic feedback locally without requiring any paid API keys or external services.
- **Arena Tab**: Problem solving, in-browser test runner, martial-arts belt progression system (White Belt → Black Belt), and solution history drawer.
- **Checklist Tab**: Daily task checklist with automatic daily reset.
- **Optional API Proxy**: Includes optional `/api/claude` route if you ever want to connect a custom key in Vercel environment variables.

## Local Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Vercel Deployment (100% Free)

1. Push repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "arena nextjs free v1"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```

2. Import to Vercel:
   - Framework Preset: **Next.js**
   - Click **Deploy**! (No API key or payment needed).
