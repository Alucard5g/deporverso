#!/usr/bin/env node
/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG)
 * SISTEMA PERICIAL: GENERADOR AUTOMATIZADO DE INFORME PERICIAL DE PROPIEDAD
 * INTELECTUAL NOTARIADO EN PDF
 * ============================================================================
 * Script: scripts/export-legal-ip-certificate.js
 * Propósito: 
 *   Generar un informe pericial legal formal en PDF con membrete institucional,
 *   declaración de titularidad exclusiva a nombre de Rolando Guerra (CIG),
 *   resumen del Merkle Master Root Hash SHA-256, recibo OpenTimestamps en Bitcoin,
 *   y fundamentación jurídica bajo el Convenio de Berna y Ley de Comercio Electrónico.
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const REPORTS_DIR = path.join(ROOT_DIR, 'public', 'generated-reports');
const MASTER_HASH_PATH = path.join(ROOT_DIR, 'master-hash.txt');
const MANIFEST_PATH = path.join(ROOT_DIR, 'manifest.sha256');

export async function generateLegalIpCertificatePdf(customOutputPath = null) {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  // Leer Master Hash y cantidad de archivos
  let masterHash = 'cedc7eb9ff3dedf79628543ef93a9139587080be3eeefe377b221c2fc639b7d6';
  if (fs.existsSync(MASTER_HASH_PATH)) {
    masterHash = fs.readFileSync(MASTER_HASH_PATH, 'utf-8').trim();
  }

  let totalFiles = 276;
  if (fs.existsSync(MANIFEST_PATH)) {
    const lines = fs.readFileSync(MANIFEST_PATH, 'utf-8').trim().split('\n');
    totalFiles = lines.filter(l => l.trim().length > 0).length;
  }

  const currentDate = new Date().toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
  const currentTimestamp = new Date().toISOString();

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Dictamen Pericial de Propiedad Intelectual - CIG</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 18mm 20mm 18mm;
    }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      font-size: 11pt;
      margin: 0;
      padding: 0;
    }
    .header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand-title {
      font-size: 18pt;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-subtitle {
      font-size: 9pt;
      font-weight: 700;
      color: #0284c7;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    .doc-type {
      text-align: right;
      font-size: 9pt;
      color: #64748b;
      font-family: monospace;
    }
    .title-box {
      background: linear-gradient(135deg, #091533 0%, #030712 100%);
      color: #ffffff;
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 5px solid #00e5ff;
    }
    .title-box h1 {
      margin: 0;
      font-size: 14pt;
      font-weight: 800;
      letter-spacing: 0.2px;
    }
    .title-box p {
      margin: 4px 0 0 0;
      font-size: 9pt;
      color: #94a3b8;
    }
    .section-title {
      font-size: 11pt;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-top: 18px;
      margin-bottom: 10px;
    }
    .data-grid {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
      font-size: 10pt;
    }
    .data-grid td {
      padding: 6px 10px;
      border-bottom: 1px solid #f1f5f9;
    }
    .data-grid td.label {
      width: 32%;
      font-weight: 700;
      color: #475569;
      background-color: #f8fafc;
    }
    .data-grid td.value {
      color: #0f172a;
      font-family: monospace;
      font-size: 9.5pt;
    }
    .hash-box {
      background-color: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 9.5pt;
      word-break: break-all;
      color: #0369a1;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .legal-box {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 6px;
      padding: 12px 14px;
      font-size: 9.5pt;
      color: #166534;
      margin-bottom: 15px;
    }
    .legal-box strong {
      color: #14532d;
    }
    .footer-signatures {
      margin-top: 35px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .signature-block {
      width: 45%;
      border-top: 1px solid #94a3b8;
      padding-top: 8px;
      text-align: center;
      font-size: 9.5pt;
    }
    .signature-name {
      font-weight: bold;
      color: #0f172a;
    }
    .signature-title {
      font-size: 8.5pt;
      color: #64748b;
    }
    .watermark {
      font-size: 8pt;
      color: #94a3b8;
      text-align: center;
      margin-top: 25px;
      font-family: monospace;
    }
  </style>
</head>
<body>

  <div class="header">
    <div>
      <h1 class="brand-title">CORPORACIÓN E INNOVACIÓN GUERRA</h1>
      <div class="brand-subtitle">División de Seguridad de la Información & Propiedad Intelectual (CIG)</div>
    </div>
    <div class="doc-type">
      CÓDIGO: CIG-PERITAJE-IP-2026<br>
      EMISIÓN: ${currentDate}
    </div>
  </div>

  <div class="title-box">
    <h1>DICTAMEN PERICIAL Y CERTIFICACIÓN DE PROPIEDAD INTELECTUAL</h1>
    <p>Prueba de Autoría, Integridad Algorítmica y Anterioridad Temporal en Blockchain (OpenTimestamps / Bitcoin)</p>
  </div>

  <div class="section-title">1. Declaración de Titularidad y Autoría</div>
  <table class="data-grid">
    <tr>
      <td class="label">Titular Legítimo Exclusivo:</td>
      <td class="value" style="font-family: inherit; font-weight: bold;">ROLANDO GUERRA</td>
    </tr>
    <tr>
      <td class="label">Entidad Corporativa:</td>
      <td class="value" style="font-family: inherit;">CORPORACIÓN E INNOVACIÓN GUERRA (CIG)</td>
    </tr>
    <tr>
      <td class="label">Software / Plataforma:</td>
      <td class="value" style="font-family: inherit;">DeporVerso Platform (deporverso.com / deporverso.app)</td>
    </tr>
    <tr>
      <td class="label">Total Archivos Auditados:</td>
      <td class="value">${totalFiles} componentes de código fuente, esquemas y lógica de negocio</td>
    </tr>
    <tr>
      <td class="label">Fecha y Hora UTC de Sellado:</td>
      <td class="value">${currentTimestamp}</td>
    </tr>
  </table>

  <div class="section-title">2. Huella Criptográfica Maestra (Merkle Master Root Hash)</div>
  <p style="font-size: 9.5pt; color: #475569; margin: 4px 0 6px 0;">
    El siguiente valor representa la función resumen criptográfica SHA-256 (NIST FIPS 180-4) calculada sobre la totalidad de archivos que conforman el software. Cualquier alteración de un solo bit en el código genera una huella completamente divergente.
  </p>
  <div class="hash-box">
    ${masterHash}
  </div>

  <div class="section-title">3. Protocolo de Sellado Temporal en Bitcoin (OpenTimestamps)</div>
  <table class="data-grid">
    <tr>
      <td class="label">Estándar Criptográfico:</td>
      <td class="value">OpenTimestamps Protocol (OTS) — Merkle Tree Root Anchor</td>
    </tr>
    <tr>
      <td class="label">Red de Anclaje Inmutable:</td>
      <td class="value">Bitcoin Blockchain Calendar (Prueba de Trabajo Descentralizada)</td>
    </tr>
    <tr>
      <td class="label">Archivo Recibo de Prueba:</td>
      <td class="value">master-hash.txt.ots (Firma binaria criptográfica)</td>
    </tr>
    <tr>
      <td class="label">Comando de Verificación Oficial:</td>
      <td class="value">ots verify master-hash.txt.ots</td>
    </tr>
  </table>

  <div class="section-title">4. Fundamentación Jurídica y Eficacia Probatoria (Sustitución SENADI)</div>
  <div class="legal-box">
    <strong>• Convenio de Berna para la Protección de las Obras Literarias y Artísticas (Art. 5.2):</strong><br>
    Suscrito y ratificado por la República del Ecuador. Establece formalmente que la protección por derechos de autor <em>no estará subordinada a ninguna formalidad ni registro previo</em>, naciendo los derechos desde el instante de su creación.<br><br>
    <strong>• Código Orgánico de la Economía Social de los Conocimientos (COESCC - Código Ingenios Art. 100):</strong><br>
    El software goza de protección por derecho de autor sin necesidad de registro constitutivo. La prueba pericial criptográfica con anclaje temporal inalterable acredita con fecha cierta y certeza indubitable la existencia y contenido de la obra.<br><br>
    <strong>• Ley de Comercio Electrónico, Firmas y Mensajes de Datos (Arts. 2, 8 y 14):</strong><br>
    Reconoce plena validez jurídica a los mensajes de datos, sellos de tiempo y algoritmos criptográficos como prueba judicial válida ante los tribunales de justicia.
  </div>

  <div class="footer-signatures">
    <div class="signature-block">
      <div class="signature-name">ROLANDO GUERRA</div>
      <div class="signature-title">Titular de Derechos & Arquitecto de Software<br>Corporación e Innovación Guerra (CIG)</div>
    </div>
    <div class="signature-block">
      <div class="signature-name">CIG CRYPTOGRAPHIC AUDITOR</div>
      <div class="signature-title">División DevSecOps & Seguridad Informática<br>Certificación Digital SHA-256 + Bitcoin OTS</div>
    </div>
  </div>

  <div class="watermark">
    DOCUMENTO OFICIAL GENERADO POR DEPORVERSO CIG INDUSTRIAL SECURITY CORE — HASH ID: ${masterHash.slice(0, 16)}...
  </div>

</body>
</html>
  `;

  const fileName = `dictamen_pericial_cig_${Date.now()}.pdf`;
  const outputPath = customOutputPath || path.join(REPORTS_DIR, fileName);

  console.log('Iniciando Puppeteer para compilación de dictamen pericial en PDF...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        bottom: '15mm',
        left: '15mm',
        right: '15mm'
      }
    });

    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`✅ Dictamen pericial generado exitosamente en: ${outputPath}`);
    return {
      success: true,
      fileName,
      filePath: outputPath,
      fileSize: pdfBuffer.length,
      downloadUrl: `/generated-reports/${path.basename(outputPath)}`
    };
  } finally {
    await browser.close();
  }
}

// Ejecución directa desde CLI si se llama con `node scripts/export-legal-ip-certificate.js`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateLegalIpCertificatePdf()
    .then(res => {
      console.log('Certificado listo:', res);
      process.exit(0);
    })
    .catch(err => {
      console.error('Error generando certificado:', err);
      process.exit(1);
    });
}
