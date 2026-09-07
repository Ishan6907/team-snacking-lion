# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json tsconfig.node.json vite.config.ts index.html ./
COPY src/ ./src/
RUN npm run build:frontend

# Stage 2: Build backend
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci
COPY backend/tsconfig.json ./
COPY backend/src/ ./src/
RUN npm run build

# Stage 3: Production
FROM node:20-alpine
WORKDIR /app

# Copy backend production deps
COPY backend/package.json backend/package-lock.json* ./backend/
WORKDIR /app/backend
RUN npm ci --omit=dev

# Copy compiled backend
COPY --from=backend-build /app/backend/dist ./dist

# Copy frontend build
COPY --from=frontend-build /app/dist ../dist

ENV NODE_ENV=production
ENV PORT=8000
EXPOSE 8000
CMD ["node", "dist/index.js"]
