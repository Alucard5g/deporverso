# =========================================================
# DEPORVERSO - DOCKERFILE MULTI-STAGE FOR GOOGLE CLOUD RUN
# =========================================================

# --- ETAPA 1: BUILDER ---
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias necesarias para compilación
RUN apk add --no-cache libc6-compat

# Copiar manifiestos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para compilar)
RUN npm ci

# Copiar el código fuente completo
COPY . .

# Construir el frontend (Vite) y el backend empaquetado (dist/server.cjs)
ENV NODE_ENV=production
RUN npm run build

# --- ETAPA 2: RUNNER PRODUCCIÓN ULTRA-LIGERO ---
FROM node:20-alpine AS runner

WORKDIR /app

# Instalar variables de entorno de producción
ENV NODE_ENV=production
ENV PORT=3000

# Usuario no root por seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 deporverso

# Copiar package.json y dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copiar artefactos compilados desde el builder
COPY --from=builder /app/dist ./dist

# Asignar permisos correctos
RUN chown -R deporverso:nodejs /app

USER deporverso

# Puerto expuesto para Google Cloud Run (3000)
EXPOSE 3000

# Comando de inicio del servidor CommonJS compilado
CMD ["node", "dist/server.cjs"]
