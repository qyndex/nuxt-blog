FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time env vars for nuxt build (SSR renders need these)
ARG SUPABASE_URL
ARG SUPABASE_KEY
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_KEY=${SUPABASE_KEY}
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.output ./
EXPOSE 3000
CMD ["node", "server/index.mjs"]
