# Define build args for all stages

FROM node:20.6.0-bullseye-slim AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apt-get update && apt-get install -y libc6 && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y python3 make build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json  package-lock.json*  ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder

ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_COLORTHIEF_URL
ARG NEXT_PUBLIC_HUMAN_MODELS_PATH

ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_COLORTHIEF_URL=${NEXT_PUBLIC_COLORTHIEF_URL}
ENV NEXT_PUBLIC_HUMAN_MODELS_PATH=${NEXT_PUBLIC_HUMAN_MODELS_PATH}


WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# RUN echo "ANON KEY ${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
RUN echo ${NEXT_PUBLIC_SUPABASE_ANON_KEY} >> .env
RUN echo ${NEXT_PUBLIC_SUPABASE_URL} >> .env
RUN echo ${NEXT_PUBLIC_HUMAN_MODELS_PATH} >> .env
RUN echo ${NEXT_PUBLIC_COLORTHIEF_URL} >> .env

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner

ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_COLORTHIEF_URL
ARG NEXT_PUBLIC_HUMAN_MODELS_PATH

ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_COLORTHIEF_URL=${NEXT_PUBLIC_COLORTHIEF_URL}
ENV NEXT_PUBLIC_HUMAN_MODELS_PATH=${NEXT_PUBLIC_HUMAN_MODELS_PATH}

WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]