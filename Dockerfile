# =============================================================================
# Factor V: Build, Release, Run — Strict stage separation
# Factor II: Dependencies — Isolated via container
# Factor X: Dev/Prod Parity — Same runtime everywhere
# =============================================================================

# ---- Stage 1: Dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ---- Stage 2: Build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env vars must be passed via --build-arg or .env
# Next.js inlines NEXT_PUBLIC_* vars at build time
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_CONTACT_EMAIL
ARG NEXT_PUBLIC_LINKEDIN_URL
ARG NEXT_PUBLIC_GITHUB_URL
ARG NEXT_PUBLIC_BUYMEACOFFEE_URL

RUN npm run build

# ---- Stage 3: Run ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only what's needed to run
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Factor VII: Port Binding — Export service via PORT
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Factor IX: Disposability — Fast startup, graceful shutdown
# Next.js standalone handles SIGTERM gracefully
CMD ["node", "server.js"]
