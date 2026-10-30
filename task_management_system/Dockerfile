# ─────────────────────────────────────────────────────────────
#  Stage 1 – deps: install only production dependencies
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ─────────────────────────────────────────────────────────────
#  Stage 2 – runner: lean, non-root production image
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Pull in only the installed packages from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY package.json ./
COPY src/ ./src/

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

# Health-check uses the /health endpoint defined in app.js
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "src/server.js"]
