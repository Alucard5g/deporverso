# =========================================================
# DEPORVERSO - DOCKERFILE MULTI-STAGE FOR GOOGLE CLOUD RUN
# =========================================================

# --- ETAPA 1: BUILDER ---
FROM node:20-slim AS builder

WORKDIR /app

# Copiar manifiestos de dependencias
COPY package*.json ./

# Instalar dependencias para la compilación (funciona con o sin package-lock.json)
RUN npm install --no-audit --no-fund

# Copiar el código fuente completo
COPY . .

# Construir el frontend (Vite) y el backend empaquetado (dist/server.cjs)
ENV NODE_ENV=production
RUN npm run build

# --- ETAPA 2: RUNNER PRODUCCIÓN ULTRA-LIGERO ---
FROM node:20-slim AS runner

WORKDIR /app

# Instalar variables de entorno de producción (8080 es el estándar de Cloud Run)
ENV NODE_ENV=production
ENV PORT=8080

# Usuario no root por seguridad
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 -g nodejs deporverso

# Copiar package.json y dependencias de producción únicamente
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

# Copiar artefactos compilados desde el builder
COPY --from=builder /app/dist ./dist

# Asignar permisos correctos
RUN chown -R deporverso:nodejs /app

USER deporverso

# Puertos expuestos para Google Cloud Run (8080 estándar, 3000 alternativo)
EXPOSE 8080
EXPOSE 3000

# Comando de inicio del servidor CommonJS compilado
CMD ["node", "dist/server.cjs"]
