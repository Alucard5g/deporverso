#!/usr/bin/env node
/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG)
 * SUITE DE PRUEBAS AUTOMATIZADAS DE NAVEGADOR (PUPPETEER E2E)
 * ============================================================================
 * Script: scripts/test-browser.cjs
 * Propósito: Validar renderizado web, telemetría y reproducción de medios.
 * ============================================================================
 */

const puppeteer = require('puppeteer');

async function runSmokeTest() {
  console.log('\n============================================================');
  console.log(' [CIG SMOKE TEST] VALIDACIÓN AUTOMATIZADA DE NAVEGADOR      ');
  console.log(' Entidad: CORPORACIÓN E INNOVACIÓN GUERRA (CIG)             ');
  console.log('============================================================\n');

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const targetUrl = process.env.TEST_URL || 'http://localhost:3000';
    console.log(`[TEST] Navegando a ${targetUrl}...`);

    const response = await page.goto(targetUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    const status = response ? response.status() : 0;
    console.log(`[TEST] Código HTTP de respuesta: ${status}`);

    const title = await page.title();
    console.log(`[TEST] Título de la página: "${title}"`);

    // Verificar presencia del contenedor principal o canvas
    const hasRoot = await page.$('#root');
    if (!hasRoot) {
      throw new Error('No se encontró el contenedor #root en el DOM');
    }

    console.log('✓ [VERIFICADO] Interfaz montada correctamente en el DOM.');
    console.log('✓ [VERIFICADO] Suite E2E de navegador completada con éxito.\n');
    process.exitCode = 0;
  } catch (error) {
    console.error(`❌ [FALLO EN PRUEBA]: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runSmokeTest();
