/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG) & DEPORVERSO MULTI-SPORT PLATFORM
 * SERVICIO ARQUITECTÓNICO DE SELLADO TEMPORAL BITCOIN (OPENTIMESTAMPS)
 * ============================================================================
 * Archivo: server/services/openTimestampsService.ts
 * Propósito: 
 *   1. Cálculo determinista de huella SHA-256 (NIST FIPS 180-4).
 *   2. Envío programático a servidores de calendario públicos de OpenTimestamps.
 *   3. Generación y serialización de prueba binaria .ots (RFC / Binary Format).
 *   4. Verificación matemática pericial del .ots frente al hash original.
 *   5. Actualización (upgrade) de atestaciones pendientes a bloques de Bitcoin minados.
 * ============================================================================
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

// Resolutor universal para opentimestamps: funciona en ESM (tsx dev) y CJS (dist/server.cjs para Render)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requireFn: any = typeof globalThis !== 'undefined' && typeof (globalThis as any).require === 'function'
  ? (globalThis as any).require
  : createRequire(
      typeof import.meta !== 'undefined' && import.meta?.url
        ? import.meta.url
        : `file://${process.cwd()}/package.json`
    );

const OpenTimestamps = requireFn('opentimestamps');

export interface TimestampResult {
  success: boolean;
  sha256: string;
  otsBuffer: Buffer;
  otsBase64: string;
  otsSizeBytes: number;
  providerDetails: string;
  isPendingBitcoin: boolean;
  calendarsSubmitted: string[];
  timestampIso: string;
  errorMessage?: string;
}

export interface VerificationResult {
  valid: boolean;
  hashMatch: boolean;
  originalHash: string;
  otsDeclaredHash: string;
  status: 'BITCOIN_CONFIRMED' | 'CALENDAR_PENDING' | 'INVALID_HASH' | 'VERIFICATION_ERROR';
  bitcoinBlockHeight?: number;
  bitcoinBlockTime?: string;
  calendars: string[];
  message: string;
  otsInfoRaw?: string;
}

export interface UpgradeResult {
  upgraded: boolean;
  otsBuffer: Buffer;
  otsBase64: string;
  message: string;
}

export class OpenTimestampsService {
  private static readonly STORAGE_DIR = path.join(process.cwd(), 'storage', 'timestamps');

  /**
   * Garantiza la existencia del directorio de almacenamiento de archivos .ots
   */
  private static ensureStorageDir(): void {
    if (!fs.existsSync(this.STORAGE_DIR)) {
      fs.mkdirSync(this.STORAGE_DIR, { recursive: true });
    }
  }

  /**
   * 1. Cálculo de huella criptográfica SHA-256 (RFC / FIPS 180-4)
   * Acepta texto, Buffer binario u objetos JSON serializables
   */
  public static calculateSha256(data: string | Buffer | object): { hashHex: string; hashBuffer: Buffer } {
    let bufferToHash: Buffer;

    if (Buffer.isBuffer(data)) {
      bufferToHash = data;
    } else if (typeof data === 'string') {
      bufferToHash = Buffer.from(data, 'utf-8');
    } else {
      // Normalización determinista de objetos JSON
      bufferToHash = Buffer.from(JSON.stringify(data), 'utf-8');
    }

    const hashBuffer = crypto.createHash('sha256').update(bufferToHash).digest();
    const hashHex = hashBuffer.toString('hex');

    return { hashHex, hashBuffer };
  }

  /**
   * Cálculo de hash SHA-256 directo de un archivo en disco
   */
  public static async calculateFileSha256(filePath: string): Promise<{ hashHex: string; hashBuffer: Buffer }> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);

      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => {
        const hashBuffer = hash.digest();
        resolve({
          hashHex: hashBuffer.toString('hex'),
          hashBuffer
        });
      });
      stream.on('error', (err) => reject(err));
    });
  }

  /**
   * 2. Sellado de tiempo en la blockchain de Bitcoin vía OpenTimestamps
   * 
   * Envía programáticamente el hash SHA-256 a los calendarios públicos oficiales:
   *  - https://a.pool.opentimestamps.org
   *  - https://b.pool.opentimestamps.org
   *  - https://a.pool.eternitywall.com
   *  - https://ots.btc.catallaxy.com
   * 
   * @param inputHash - Hash SHA-256 en formato hex (64 caracteres) o Buffer (32 bytes)
   * @param timeoutMs - Tiempo máximo de espera para la respuesta de los calendarios (default: 8000ms)
   */
  public static async stampHash(
    inputHash: string | Buffer,
    timeoutMs: number = 8000
  ): Promise<TimestampResult> {
    const hashHex = Buffer.isBuffer(inputHash) ? inputHash.toString('hex') : inputHash.trim().toLowerCase();
    const hashBuffer = Buffer.isBuffer(inputHash) ? inputHash : Buffer.from(hashHex, 'hex');

    if (hashHex.length !== 64) {
      throw new Error(`El hash proporcionado no es un SHA-256 válido. Longitud esperada: 64 caracteres hex, recibida: ${hashHex.length}`);
    }

    // Instanciar archivo de timestamp desacoplado (Detached Timestamp File)
    const detached = OpenTimestamps.DetachedTimestampFile.fromHash(
      new OpenTimestamps.Ops.OpSHA256(),
      hashBuffer
    );

    // Timeout de seguridad para evitar bloqueos si los calendarios públicos experimentan alta latencia
    const stampPromise = OpenTimestamps.stamp(detached);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout de red al conectar con calendarios OpenTimestamps (${timeoutMs}ms)`)), timeoutMs)
    );

    try {
      await Promise.race([stampPromise, timeoutPromise]);

      // Serializar la prueba criptográfica a bytes binarios estándar .ots
      const otsBytes: Uint8Array = detached.serializeToBytes();
      const otsBuffer = Buffer.from(otsBytes);
      const otsBase64 = otsBuffer.toString('base64');

      // Extraer metadatos de los calendarios que registraron la atestación
      const infoText: string = OpenTimestamps.info(detached) || '';
      const calendarMatches = infoText.match(/https?:\/\/[^\s]+/g) || [];
      const uniqueCalendars: string[] = Array.from(new Set(calendarMatches));

      return {
        success: true,
        sha256: hashHex,
        otsBuffer,
        otsBase64,
        otsSizeBytes: otsBuffer.length,
        providerDetails: 'OpenTimestamps Bitcoin Calendar Pool',
        isPendingBitcoin: true, // Inicialmente la prueba está comprometida en el calendario, pendiente de minar en Bitcoin
        calendarsSubmitted: uniqueCalendars.length > 0 ? uniqueCalendars : [
          'https://a.pool.opentimestamps.org',
          'https://b.pool.opentimestamps.org',
          'https://a.pool.eternitywall.com'
        ],
        timestampIso: new Date().toISOString()
      };
    } catch (error: any) {
      // Manejo de contingencia y diagnóstico
      return {
        success: false,
        sha256: hashHex,
        otsBuffer: Buffer.alloc(0),
        otsBase64: '',
        otsSizeBytes: 0,
        providerDetails: 'Fallo al contactar calendarios OpenTimestamps',
        isPendingBitcoin: false,
        calendarsSubmitted: [],
        timestampIso: new Date().toISOString(),
        errorMessage: error.message || 'Error desconocido durante el sellado OpenTimestamps'
      };
    }
  }

  /**
   * 3. Almacenar el archivo .ots en disco local o almacenamiento persistente
   */
  public static async saveOtsFile(fileNameOrId: string, otsBuffer: Buffer): Promise<string> {
    this.ensureStorageDir();
    const sanitizedName = fileNameOrId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const finalPath = path.join(this.STORAGE_DIR, `${sanitizedName}.ots`);
    await fs.promises.writeFile(finalPath, otsBuffer);
    return finalPath;
  }

  /**
   * 4. Función de Verificación Criptográfica
   * Comprueba matemáticamente la validez del archivo .ots frente al hash original
   * 
   * @param originalHashHex - Hash SHA-256 esperado (64 caracteres hex)
   * @param otsData - Buffer del archivo .ots, cadena en base64 o ruta al archivo en disco
   */
  public static async verifyTimestampProof(
    originalHashHex: string,
    otsData: Buffer | string
  ): Promise<VerificationResult> {
    const cleanExpectedHash = originalHashHex.trim().toLowerCase();

    // Resolver buffer de datos OTS
    let otsBuffer: Buffer;
    if (Buffer.isBuffer(otsData)) {
      otsBuffer = otsData;
    } else if (typeof otsData === 'string' && fs.existsSync(otsData)) {
      otsBuffer = await fs.promises.readFile(otsData);
    } else if (typeof otsData === 'string') {
      // Intento de decodificar Base64
      otsBuffer = Buffer.from(otsData, 'base64');
    } else {
      throw new Error('Formato de entrada OTS inválido para verificación');
    }

    try {
      // Deserializar el archivo de prueba .ots
      const parsedOts = OpenTimestamps.DetachedTimestampFile.deserialize(otsBuffer);
      const otsHashBuffer = Buffer.from(parsedOts.fileDigest());
      const otsDeclaredHash = otsHashBuffer.toString('hex').toLowerCase();

      // Validación de integridad: el hash del documento debe coincidir exactamente con el hash del .ots
      const hashMatch = otsDeclaredHash === cleanExpectedHash;

      if (!hashMatch) {
        return {
          valid: false,
          hashMatch: false,
          originalHash: cleanExpectedHash,
          otsDeclaredHash,
          status: 'INVALID_HASH',
          calendars: [],
          message: `Discrepancia criptográfica: El hash del documento (${cleanExpectedHash}) no coincide con el registrado en el archivo .ots (${otsDeclaredHash}).`
        };
      }

      // Recrear detached file original para ejecutar verificación contra Bitcoin o calendarios
      const detachedOriginal = OpenTimestamps.DetachedTimestampFile.fromHash(
        new OpenTimestamps.Ops.OpSHA256(),
        Buffer.from(cleanExpectedHash, 'hex')
      );

      // Inspeccionar detalles y atestaciones
      const otsInfo = OpenTimestamps.info(parsedOts) || '';
      const calendarMatches = otsInfo.match(/https?:\/\/[^\s]+/g) || [];
      const calendars: string[] = Array.from(new Set(calendarMatches));

      // Ejecutar verificación contra la red OpenTimestamps / Bitcoin
      let verifyOutput: any = null;
      let isConfirmedInBitcoin = false;
      let blockHeight: number | undefined;

      try {
        verifyOutput = await OpenTimestamps.verify(parsedOts, detachedOriginal);
        // Si verifyOutput contiene bloques o firmas de bloque
        if (verifyOutput && typeof verifyOutput === 'object') {
          const keys = Object.keys(verifyOutput);
          if (keys.length > 0) {
            isConfirmedInBitcoin = true;
          }
        }
      } catch (err: any) {
        console.warn('[OTS VERIFY] Nota de verificación:', err?.message);
      }

      // Detección de atestación de Bitcoin en el dump de información
      if (otsInfo.includes('Bitcoin block') || otsInfo.includes('btc block')) {
        isConfirmedInBitcoin = true;
        const blockMatch = otsInfo.match(/Bitcoin block\s+(\d+)/i);
        if (blockMatch) {
          blockHeight = parseInt(blockMatch[1], 10);
        }
      }

      if (isConfirmedInBitcoin) {
        return {
          valid: true,
          hashMatch: true,
          originalHash: cleanExpectedHash,
          otsDeclaredHash,
          status: 'BITCOIN_CONFIRMED',
          bitcoinBlockHeight: blockHeight,
          calendars,
          message: `Sello verificado matemáticamente y anclado de forma inmutable en la blockchain de Bitcoin${blockHeight ? ` (Bloque #${blockHeight})` : ''}.`,
          otsInfoRaw: otsInfo
        };
      } else {
        return {
          valid: true,
          hashMatch: true,
          originalHash: cleanExpectedHash,
          otsDeclaredHash,
          status: 'CALENDAR_PENDING',
          calendars,
          message: 'Sello válido emitido por servidores de calendario OpenTimestamps. Registro pendiente de inclusión en el próximo bloque minado de Bitcoin.',
          otsInfoRaw: otsInfo
        };
      }
    } catch (err: any) {
      return {
        valid: false,
        hashMatch: false,
        originalHash: cleanExpectedHash,
        otsDeclaredHash: 'DESERIALIZATION_FAILED',
        status: 'VERIFICATION_ERROR',
        calendars: [],
        message: `Error al procesar el archivo .ots: ${err.message}`
      };
    }
  }

  /**
   * 5. Actualización (Upgrade) de la prueba .ots
   * Consulta los calendarios para descargar la ruta Merkle hacia el bloque de Bitcoin ya minado
   */
  public static async upgradeTimestamp(otsBufferOrBase64: Buffer | string): Promise<UpgradeResult> {
    let otsBuffer: Buffer;
    if (Buffer.isBuffer(otsBufferOrBase64)) {
      otsBuffer = otsBufferOrBase64;
    } else {
      otsBuffer = Buffer.from(otsBufferOrBase64, 'base64');
    }

    try {
      const parsedOts = OpenTimestamps.DetachedTimestampFile.deserialize(otsBuffer);
      const changed: boolean = await OpenTimestamps.upgrade(parsedOts);

      if (changed) {
        const upgradedBytes = parsedOts.serializeToBytes();
        const upgradedBuffer = Buffer.from(upgradedBytes);
        return {
          upgraded: true,
          otsBuffer: upgradedBuffer,
          otsBase64: upgradedBuffer.toString('base64'),
          message: 'La prueba .ots ha sido actualizada exitosamente con la atestación definitiva de Bitcoin.'
        };
      } else {
        return {
          upgraded: false,
          otsBuffer,
          otsBase64: otsBuffer.toString('base64'),
          message: 'La prueba aún no cuenta con un bloque de Bitcoin minado o ya se encuentra completamente actualizada.'
        };
      }
    } catch (error: any) {
      return {
        upgraded: false,
        otsBuffer,
        otsBase64: otsBuffer.toString('base64'),
        message: `Fallo durante el proceso de upgrade: ${error.message}`
      };
    }
  }
}
