# ---- Frontend (Vite + React) Dockerfile ----
# 1. Build static assets
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Serve with Nginx
FROM nginx:alpine
# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional) — using default conf is fine
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
