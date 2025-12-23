# Build stage
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies (need devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Copy only necessary files from build stage
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/public ./public

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
