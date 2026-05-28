# Youssef Gamal — Software Engineer

🌍 Live demo: https://youssef-gamal-cv.vercel.app/

Summary
-------

I build production-ready web applications with a focus on clean UI, performance, and maintainability. This portfolio showcases projects that combine frontend engineering, animation, and lightweight backend integrations.

Tech highlights
---------------
- Next.js (App Router) — TypeScript-ready, server and client components
- Tailwind CSS v4 — utility-first styling
- Framer Motion — UI animations and transitions
- Supabase — lightweight database for contact messages
- Resend API — transactional email delivery

Key features
------------
- Responsive, accessible portfolio site with animated UI
- Contact form backed by Supabase for message persistence
- Dockerfile for containerized deployments

Run locally
-----------
1. Install dependencies:

```bash
npm install
```

2. Copy and populate environment variables (see `.env.example`):

```bash
cp .env.example .env.local
# then edit .env.local and add your keys
```

3. Start the dev server:

```bash
npm run dev
```

Docker (optional)
-----------------
Build and run the container locally:

```bash
docker build -t portfolio:dev .
docker run -p 3000:3000 --env-file .env.local portfolio:dev
```

Deployment
----------
The project is ready for deployment to Vercel or any container platform. If deploying to Vercel, use the App Router configuration and set environment variables in the Vercel dashboard.

Notes for recruiters
-------------------
If you'd like to discuss opportunities, please use the contact form on the live site or open an issue in this repository and include your preferred contact method and a brief message.

License
-------
MIT

--
Maintainer: Youssef Gamal
