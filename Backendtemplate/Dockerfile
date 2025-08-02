# ---- Backend (Node/Express) Dockerfile ----
# 1. Install dependencies in a separate layer for better caching
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Install only production deps to keep image small; adjust if dev deps are needed
RUN npm ci --production

# 2. Copy source and run
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy installed node_modules from previous stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the backend source
COPY . .

# Expose the port defined in .env (defaults to 8080)
EXPOSE 8080

# Start the API server
CMD ["node", "index.js"]
