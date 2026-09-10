#!/bin/bash
# ==============================================================================
# DEPORVERSO - SCRIPT DE DESPLIEGUE AUTOMÁTICO A GOOGLE CLOUD RUN
# ==============================================================================
set -e

echo "🚀 Iniciando despliegue de Deporverso en Google Cloud Run..."

# 1. Verificar autenticación con Google Cloud
if ! command -v gcloud &> /dev/null; then
  echo "❌ Error: 'gcloud' CLI no está instalado. Instálalo desde https://cloud.google.com/sdk"
  exit 1
fi

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
  echo "⚠️ No hay un proyecto seleccionado en gcloud."
  read -p "Ingresa tu GCP Project ID: " PROJECT_ID
  gcloud config set project "$PROJECT_ID"
fi

REGION="us-central1"
SERVICE_NAME="deporverso"

echo "📍 Proyecto GCP: $PROJECT_ID"
echo "📍 Región: $REGION"
echo "📦 Servicio: $SERVICE_NAME"
echo ""

# 2. Asegurar que las APIs necesarias estén activadas
echo "🔧 Verificando APIs requeridas (Cloud Run, Cloud Build, Artifact Registry)..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --quiet

# 3. Desplegar directamente desde el código fuente con el Dockerfile optimizado
echo "🔨 Compilando contenedor y desplegando servicio..."
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production

# 4. Obtener y mostrar la URL del servicio
URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format='value(status.url)')

echo ""
echo "=========================================================="
echo "🎉 ¡Despliegue exitoso!"
echo "🌐 URL pública de Deporverso: $URL"
echo "=========================================================="
