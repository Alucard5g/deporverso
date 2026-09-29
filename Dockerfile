# ==============================================================================
# CORPORACIÓN E INNOVACIÓN GUERRA (CIG) - DEPORVERSO PRODUCTION CONTAINER
# Multi-Stage Secure Build for Google Cloud Run (Non-Root, Hardened Runtime)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build, Obfuscation & Cryptographic Sealing
# ------------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar herramientas necesarias para compilación nativa si hicieran falta
RUN apk add --no-cache python3 make g++

# Aprovechar caché de capas de Docker para dependencias
COPY package*.json ./
# Instalación determinista con fallback automático para evitar fallos de lockfile en Cloud Build
RUN npm ci || npm install --no-audit

# Copiar todo el código fuente del proyecto
COPY . .

# Ejecutar compilación completa: Vite SPA + esbuild Server + Ofuscación + Sellado IP SHA-256
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Minimalist, Hardened Production Runner (Zero Root Privileges)
# ------------------------------------------------------------------------------
FROM node:22-alpine AS runner

# Definir variables de entorno de producción
ENV NODE_ENV=production \
    PORT=8080 \
    HOST=0.0.0.0

WORKDIR /app

# Crear usuario y grupo del sistema sin privilegios root (Principle of Least Privilege)
RUN addgroup -g 10001 -S ciggroup && \
    adduser -u 10001 -S ciguser -G ciggroup

# Copiar manifiesto de dependencias e instalar estrictamente módulos de producción
COPY package*.json ./
RUN (npm ci --omit=dev --ignore-scripts || npm install --omit=dev --ignore-scripts --no-audit) && \
    npm cache clean --force

# Copiar artefactos compilados y ofuscados desde la etapa builder
COPY --from=builder --chown=ciguser:ciggroup /app/dist ./dist
COPY --from=builder --chown=ciguser:ciggroup /app/CIG-SECURITY-MANIFEST.* ./
COPY --from=builder --chown=ciguser:ciggroup /app/.cig-security/cig-public.pem ./.cig-security/cig-public.pem

# Asignar permisos y cambiar al usuario seguro
USER ciguser:ciggroup

# Puerto estándar de Google Cloud Run
EXPOSE 8080

# Healthcheck interno del contenedor
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/api/health || exit 1

# Comando de arranque del servidor de producción ofuscado
CMD ["node", "dist/server.cjs"]
