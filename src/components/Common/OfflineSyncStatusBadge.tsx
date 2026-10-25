import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  HardDrive, 
  Layers, 
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { offlineSyncQueue, SyncEngineStatus, QueueItem } from '../../services/offlineSyncQueue';

export const OfflineSyncStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<SyncEngineStatus>(offlineSyncQueue.getStatus());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isManualSyncing, setIsManualSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = offlineSyncQueue.subscribe((newStatus) => {
      setStatus(newStatus);
    });
    return () => unsubscribe();
  }, []);

  const handleManualFlush = async () => {
    setIsManualSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await offlineSyncQueue.flushQueue();
      if (res.successCount > 0) {
        setSyncFeedback(`✓ Se procesaron ${res.successCount} registros en lote`);
      } else if (status.pendingCount === 0) {
        setSyncFeedback('Todo sincronizado con el servidor');
      } else {
        setSyncFeedback('Reintentando en segundo plano...');
      }
    } catch (e: any) {
      setSyncFeedback(`Error: ${e.message}`);
    } finally {
      setIsManualSyncing(false);
      setTimeout(() => setSyncFeedback(null), 3500);
    }
  };

  const getEntityLabel = (entity: string) => {
    switch (entity) {
      case 'match': return 'Estado de Partido';
      case 'event': return 'Evento de Juego (Gol/Tarjeta)';
      case 'var_incident': return 'Incidencia VAR';
      case 'acta': return 'Acta Arbitral';
      case 'chronicle': return 'Crónica IA';
      default: return entity;
    }
  };

  const timeAgo = (timestamp: number) => {
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 60) return `hace ${diffSec}s`;
    if (diffSec < 3600) return `hace ${Math.floor(diffSec / 60)}m`;
    return `hace ${Math.floor(diffSec / 3600)}h`;
  };

  return (
    <div className="relative">
      {/* BADGE TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Motor de Sincronización en Lote DeporVerso (Offline-First)"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border shadow-sm ${
          !status.isOnline
            ? 'bg-amber-950/80 text-amber-300 border-amber-600/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
            : status.pendingCount > 0
            ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 animate-pulse'
            : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:border-emerald-500/60'
        }`}
      >
        {!status.isOnline ? (
          <>
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Offline</span>
            {status.pendingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-black font-black text-[10px] flex items-center justify-center">
                {status.pendingCount}
              </span>
            )}
          </>
        ) : status.pendingCount > 0 ? (
          <>
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${status.isSyncing ? 'animate-spin' : ''}`} />
            <span>{status.pendingCount} en cola</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline font-mono text-[11px]">Sync OK</span>
          </>
        )}
      </button>

      {/* POPOVER MODAL / DRAWER */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-xs" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 z-[130] w-80 sm:w-96 bg-[#0a0f1d] border border-cyan-500/30 rounded-2xl shadow-2xl p-4 text-white animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Database className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                    Motor Offline & Sincronización
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${status.isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span>{status.isOnline ? 'Conexión a Internet Activa' : 'Sin Señal en Campo (Modo Offline)'}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 my-3">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] text-slate-400 font-medium">Registros en Cola</div>
                <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">
                  {status.pendingCount}
                </div>
                <div className="text-[9px] text-slate-500">Persistidos en LocalStorage</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] text-slate-400 font-medium">Último Envío</div>
                <div className="text-xs font-bold text-emerald-400 font-mono mt-1 truncate">
                  {status.lastSyncedAt ? timeAgo(status.lastSyncedAt) : 'Pendiente'}
                </div>
                <div className="text-[9px] text-slate-500">Auto-sincronización activa</div>
              </div>
            </div>

            {/* Sync Feedback Message */}
            {syncFeedback && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-xs text-cyan-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{syncFeedback}</span>
              </div>
            )}

            {/* Queue Items List */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1.5">
                <span>Elementos Pendientes ({status.items.length})</span>
                {status.items.length > 0 && (
                  <button
                    onClick={() => offlineSyncQueue.clearQueue()}
                    className="text-[10px] text-rose-400 hover:underline"
                  >
                    Descartar todo
                  </button>
                )}
              </div>

              {status.items.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1 opacity-80" />
                  <p className="text-xs font-semibold text-emerald-300">Base de Datos al Día</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Todos los eventos, actas y clips de VAR han sido confirmados por Firestore.
                  </p>
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
                  {status.items.map((item: QueueItem) => (
                    <div 
                      key={item.id}
                      className="p-2 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between gap-2"
                    >
                      <div className="truncate">
                        <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span className="truncate">{getEntityLabel(item.entity)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ID: {item.entityId.slice(0, 14)}... • {timeAgo(item.queuedAt)}
                        </div>
                        {item.lastError && (
                          <div className="text-[9px] text-rose-400 truncate">
                            Error: {item.lastError}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono shrink-0">
                        Intento {item.retryCount}/5
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={handleManualFlush}
                disabled={isManualSyncing || status.isSyncing}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isManualSyncing || status.isSyncing ? 'animate-spin' : ''}`} />
                <span>
                  {isManualSyncing || status.isSyncing ? 'Sincronizando Lote...' : 'Sincronizar Lote Ahora'}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
