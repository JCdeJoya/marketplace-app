FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies with all devDependencies needed for build
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the app
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3001

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set proper permissions
RUN chown -R nextjs:nodejs .

USER nextjs

EXPOSE 3001

# Use the standalone server
CMD ["node", "server.js"]