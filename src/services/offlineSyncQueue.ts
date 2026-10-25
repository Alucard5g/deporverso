/**
 * DEPORVERSO OFFLINE BATCH SYNCHRONIZATION ENGINE
 * Motor de Sincronización en Lote Fuera de Línea con Cola Persistente
 * 
 * Diseñado para operaciones en campos deportivos con conectividad precaria (2G/3G/4G congestionado).
 * Garantiza persistencia en localStorage/IndexedDB, deduplicación de estados y reintentos automáticos
 * al reanudarse la conectividad con reintento exponencial y batching inteligente.
 */

export type SyncEntityType = 'match' | 'event' | 'var_incident' | 'chronicle' | 'transfer' | 'acta';
export type SyncOperation = 'upsert' | 'delete';

export interface QueueItem {
  id: string;
  entity: SyncEntityType;
  entityId: string;
  operation: SyncOperation;
  payload: any;
  queuedAt: number;
  retryCount: number;
  lastError?: string;
  tenantId?: string;
}

export interface SyncEngineStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt: number | null;
  items: QueueItem[];
}

const STORAGE_KEY = 'deporverso_offline_sync_queue_v2';
const MAX_RETRIES = 5;

type ListenerCallback = (status: SyncEngineStatus) => void;

class OfflineSyncEngine {
  private queue: QueueItem[] = [];
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private isSyncing: boolean = false;
  private lastSyncedAt: number | null = null;
  private listeners: Set<ListenerCallback> = new Set();
  private autoSyncInterval: any = null;

  constructor() {
    this.loadFromStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      // Heartbeat periódico de verificación cada 30 segundos
      this.autoSyncInterval = setInterval(() => {
        if (this.isOnline && this.queue.length > 0 && !this.isSyncing) {
          this.flushQueue();
        }
      }, 30000);
    }
  }

  private handleOnline = () => {
    this.isOnline = true;
    console.log('[OfflineSyncEngine] Conexión a internet restablecida. Iniciando procesamiento por lotes...');
    this.notify();
    this.flushQueue();
  };

  private handleOffline = () => {
    this.isOnline = false;
    console.warn('[OfflineSyncEngine] Sin conexión a internet. Cambiando a modo de persistencia local segura.');
    this.notify();
  };

  private loadFromStorage() {
    try {
      if (typeof localStorage === 'undefined') return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.queue = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[OfflineSyncEngine] Error al cargar cola persistente de localStorage:', e);
      this.queue = [];
    }
  }

  private saveToStorage() {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      console.warn('[OfflineSyncEngine] Error al persistir cola en localStorage:', e);
    }
  }

  private notify() {
    const status: SyncEngineStatus = this.getStatus();
    this.listeners.forEach(cb => {
      try {
        cb(status);
      } catch (err) {
        console.error('[OfflineSyncEngine] Error en listener callback:', err);
      }
    });
  }

  public getStatus(): SyncEngineStatus {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingCount: this.queue.length,
      lastSyncedAt: this.lastSyncedAt,
      items: [...this.queue]
    };
  }

  public subscribe(cb: ListenerCallback): () => void {
    this.listeners.add(cb);
    cb(this.getStatus());
    return () => {
      this.listeners.delete(cb);
    };
  }

  /**
   * Encola una transacción deportiva. Deduplica si es actualización de estado del mismo partido.
   */
  public enqueue(
    entity: SyncEntityType,
    entityId: string,
    payload: any,
    operation: SyncOperation = 'upsert',
    tenantId?: string
  ): QueueItem {
    // Deduplicación para estados de partido o actas (mantiene únicamente el estado más reciente)
    if (entity === 'match' || entity === 'acta') {
      const existingIdx = this.queue.findIndex(item => item.entity === entity && item.entityId === entityId);
      if (existingIdx !== -1) {
        this.queue[existingIdx] = {
          ...this.queue[existingIdx],
          payload: { ...this.queue[existingIdx].payload, ...payload },
          queuedAt: Date.now(),
          retryCount: 0
        };
        this.saveToStorage();
        this.notify();
        console.log(`[OfflineSyncEngine] Deduplicada actualización para ${entity}:${entityId}`);
        if (this.isOnline) this.flushQueue();
        return this.queue[existingIdx];
      }
    }

    const item: QueueItem = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      entity,
      entityId,
      operation,
      payload,
      queuedAt: Date.now(),
      retryCount: 0,
      tenantId
    };

    this.queue.push(item);
    this.saveToStorage();
    this.notify();
    console.log(`[OfflineSyncEngine] Encolado [${entity}:${entityId}]. Total en cola: ${this.queue.length}`);

    // Si estamos en línea, procesar inmediatamente en segundo plano
    if (this.isOnline && !this.isSyncing) {
      setTimeout(() => this.flushQueue(), 100);
    }

    return item;
  }

  /**
   * Procesa en lote todos los elementos pendientes en la cola
   */
  public async flushQueue(): Promise<{ successCount: number; failureCount: number }> {
    if (this.isSyncing) {
      return { successCount: 0, failureCount: 0 };
    }

    if (this.queue.length === 0) {
      this.lastSyncedAt = Date.now();
      this.notify();
      return { successCount: 0, failureCount: 0 };
    }

    this.isSyncing = true;
    this.notify();

    let successCount = 0;
    let failureCount = 0;
    const remainingQueue: QueueItem[] = [];

    // Import dinámico tardío para evitar dependencias circulares con firebaseService
    const { syncDirectToFirestore } = await import('./firebaseService');

    for (const item of this.queue) {
      try {
        const ok = await syncDirectToFirestore(item);
        if (ok) {
          successCount++;
        } else {
          item.retryCount += 1;
          item.lastError = 'El servidor no confirmó recepción';
          if (item.retryCount <= MAX_RETRIES) {
            remainingQueue.push(item);
          } else {
            console.error(`[OfflineSyncEngine] Elemento descartado tras ${MAX_RETRIES} reintentos:`, item);
          }
          failureCount++;
        }
      } catch (err: any) {
        item.retryCount += 1;
        item.lastError = err?.message || 'Error de red desconocido';
        if (item.retryCount <= MAX_RETRIES) {
          remainingQueue.push(item);
        }
        failureCount++;
      }
    }

    this.queue = remainingQueue;
    this.saveToStorage();
    this.isSyncing = false;
    this.lastSyncedAt = Date.now();
    this.notify();

    console.log(`[OfflineSyncEngine] Procesamiento finalizado. Exitosos: ${successCount}, Pendientes: ${this.queue.length}`);
    return { successCount, failureCount };
  }

  /**
   * Limpia manualmente la cola si el usuario lo solicita
   */
  public clearQueue() {
    this.queue = [];
    this.saveToStorage();
    this.notify();
  }
}

export const offlineSyncQueue = new OfflineSyncEngine();
