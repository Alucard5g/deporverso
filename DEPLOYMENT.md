# 🌐 Guía Maestra de Despliegue: Deporverso en Google Cloud Run & GitHub

Esta guía detalla el proceso paso a paso para **sincronizar el proyecto con GitHub** y habilitar el **despliegue automático (CI/CD) a Google Cloud Run** para el lanzamiento en internet de la plataforma.

---

## 📋 Arquitectura de Despliegue

```
┌─────────────────────────────────┐
│ Google AI Studio (Desarrollo)   │
└───────────────┬─────────────────┘
                │ Git Push / Export
                ▼
┌─────────────────────────────────┐
│ Repositorio GitHub (main)       │
└───────┬─────────────────┬───────┘
        │                 │
 (Opción A: Actions)  (Opción B: Cloud Build)
        ▼                 ▼
┌─────────────────────────────────┐
│ Artifact Registry / Docker GCR  │
└───────────────┬─────────────────┘
                │ Despliegue Contenedor
                ▼
┌─────────────────────────────────┐
│ Google Cloud Run (Puerto 3000)  │
│ 🌐 https://deporverso-...run.app│
└─────────────────────────────────┘
```

---

## 🚀 PASO 1: Sincronización desde aquí con GitHub

### Método 1: Exportar directamente desde AI Studio
1. En el menú superior o lateral de **Google AI Studio**, haz clic en el ícono de **Ajustes (⚙️)** o **Share/Export**.
2. Selecciona **Export to GitHub** o descarga el archivo comprimido **Export to ZIP**.
3. Si exportas a GitHub, selecciona tu cuenta u organización y asigna el nombre del repositorio (ej. `deporverso`).

### Método 2: Mediante Git CLI (si tienes terminal local o clonado)
```bash
git init
git add .
git commit -m "feat: calendario cuántico multideporte y configuración para Cloud Run"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/deporverso.git
git push -u origin main
```

---

## ☁️ PASO 2: Despliegue en Google Cloud Run (2 Opciones de Sincronización)

### 🥇 Opción A: Despliegue Nativo Continuo desde Google Cloud Console (Recomendado - 2 minutos, sin tokens)
Google Cloud Run se conecta directamente a tu repositorio de GitHub y cada vez que hagas `git push`, Cloud Run compila el `Dockerfile` y lanza la nueva versión automáticamente:

1. Ve a la consola de **Google Cloud**: [console.cloud.google.com/run](https://console.cloud.google.com/run).
2. Haz clic en **Crear Servicio** (*Create Service*).
3. Selecciona la opción: **"Implementar continuamente a partir de un repositorio"** (*Continuously deploy from a repository*).
4. Haz clic en **Configurar con Cloud Build** (*Set up with Cloud Build*):
   - Proveedor: **GitHub**.
   - Selecciona tu repositorio: `TU-USUARIO/deporverso`.
   - Rama: `^main$`.
   - Tipo de compilación: **Dockerfile** (Ruta: `/Dockerfile`, ya creado en la raíz).
5. Configuración del servicio:
   - Nombre del servicio: `deporverso`.
   - Región: `us-central1` (o la más cercana a tu audiencia).
   - Autenticación: **Permitir invocaciones no autenticadas** (para que la página sea pública en internet).
   - Puerto de contenedor: `3000`.
   - Memoria: `512 MiB` (suficiente para iniciar con escala a cero y costo mínimo).
6. En **Variables de Entorno**:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: Tu API Key de Google AI Studio.
7. Haz clic en **Crear**. En menos de 2 minutos obtendrás tu URL pública HTTPS (ej. `https://deporverso-xyz-uc.a.run.app`).

---

### 🥈 Opción B: Despliegue mediante GitHub Actions (Workflow Automatizado)
El repositorio ya incluye el archivo `.github/workflows/deploy-cloudrun.yml`. Para activarlo:

1. En tu repositorio de GitHub, ve a **Settings > Secrets and variables > Actions**.
2. Agrega los siguientes **Repository Secrets**:
   - `GCP_PROJECT_ID`: El ID de tu proyecto en Google Cloud (ej. `deporverso-prod`).
   - `GCP_SA_KEY`: Clave JSON de una Service Account de GCP con los roles:
     - *Cloud Run Admin* (`roles/run.admin`)
     - *Storage Admin* o *Artifact Registry Writer*
     - *Service Account User* (`roles/iam.serviceAccountUser`)
   - `GEMINI_API_KEY`: Tu clave de API de Gemini para la IA periodística y visión artificial.
3. Haz un `git push` a la rama `main` o ve a la pestaña **Actions** en GitHub y haz clic en **Run workflow**.
4. GitHub Actions compilará la imagen Docker, la subirá a Google Container Registry y actualizará el servicio de Cloud Run automáticamente.

---

## 🎯 PASO 3: Vincular tu Dominio Propio (ej. `deporverso.com`)
Una vez desplegado en Cloud Run:
1. En Google Cloud Run, entra al servicio `deporverso`.
2. Haz clic en la pestaña **Administrar Dominios Personalizados** (*Manage Custom Domains*).
3. Haz clic en **Agregar Asignación**:
   - Ingresa tu dominio (ej. `deporverso.com` o `app.deporverso.com`).
4. Google Cloud te proveerá los registros DNS (tipo `CNAME` o `A`) para copiar en tu registrador de dominios (GoDaddy, Namecheap, Cloudflare, Google Domains, etc.).
5. Google Cloud gestionará y renovará automáticamente el **Certificado SSL HTTPS gratuito**.

---

## 🛡️ Verificación de Producción Local (Prueba previa de Docker)
Si deseas probar el contenedor localmente antes de desplegar:
```bash
# Construir imagen local
docker build -t deporverso .

# Correr contenedor en puerto 3000
docker run -p 3000:3000 -e GEMINI_API_KEY=tu_api_key deporverso

# Abrir en navegador
open http://localhost:3000
```
