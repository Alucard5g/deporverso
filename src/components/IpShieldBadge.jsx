import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  FileText, 
  Lock, 
  Download, 
  X,
  Info,
  KeyRound
} from 'lucide-react';

/**
 * ============================================================================
 * CORPORACIÓN E INNOVACIÓN GUERRA (CIG)
 * Componente: IpShieldBadge (VISTA PÚBLICA / CERTIFICADO DE AUTENTICIDAD)
 * 
 * POLÍTICA DE SEGURIDAD Y PRIVACIDAD CIG:
 * 1. Lo que es PÚBLICO:
 *    - Certificado de Software Original y Sello de Integridad.
 *    - Master Merkle Root Hash (SHA-256) público.
 *    - Comprobante público de anclaje inmutable en Bitcoin (OpenTimestamps).
 *    - Enlace a /.well-known/master-hash.txt y /.well-known/master-hash.txt.ots.
 * 
 * 2. Lo que está OCULTO AL PÚBLICO (Exclusivo para Rolando Guerra en Master Admin):
 *    - Estructura y nombres de archivos de código (manifest.sha256).
 *    - Estrategias de defensa procesal y jurisprudencia contra el SENADI.
 *    - Comandos de auditoría de bajo nivel y firma Ed25519 corporativa.
 *    - Generador de dictámenes periciales notariados en PDF.
 * ============================================================================
 */
export const IpShieldBadge = ({ className = '', onOpenAdminPanel = null }) => {
  const [masterHash, setMasterHash] = useState('cedc7eb9ff3dedf79628543ef93a9139587080be3eeefe377b221c2fc639b7d6');
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Intentar leer el master-hash.txt público desplegado en producción
    fetch('/.well-known/master-hash.txt')
      .then((res) => {
        if (res.ok) return res.text();
        throw new Error('Fallback hash');
      })
      .then((text) => {
        const cleanHash = text.trim();
        if (cleanHash && cleanHash.length === 64) {
          setMasterHash(cleanHash);
        }
      })
      .catch(() => {
        // Mantiene el hash de respaldo predeterminado
      });
  }, []);

  const handleCopyHash = (e) => {
    e.stopPropagation();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(masterHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shortHash = `${masterHash.slice(0, 8)}...${masterHash.slice(-8)}`;

  return (
    <>
      {/* BADGE PÚBLICO EN FOOTER */}
      <div 
        className={`inline-flex flex-wrap items-center gap-2 p-2 sm:p-2.5 rounded-2xl bg-[#060b19]/90 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-950/20 text-xs font-mono text-slate-300 transition-all hover:border-cyan-400/60 ${className}`}
      >
        {/* Ícono y Marca Pública CIG */}
        <div 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 cursor-pointer hover:text-cyan-300 transition-colors"
          title="Ver Certificado Público de Autenticidad"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-[#040816] rounded-[6px] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>
          <span className="font-bold text-white tracking-wider flex items-center gap-1">
            <span>CIG CERTIFIED</span>
            <span className="hidden sm:inline text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">
              BITCOIN OTS
            </span>
          </span>
        </div>

        <span className="text-white/20 hidden sm:inline">|</span>

        {/* Master Hash Truncado con Copiar */}
        <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-lg border border-white/10">
          <Lock className="w-3 h-3 text-cyan-400/80" />
          <span className="text-[11px] text-cyan-300 font-mono" title={masterHash}>
            {shortHash}
          </span>
          <button
            onClick={handleCopyHash}
            className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer rounded"
            title="Copiar Hash SHA-256 de integridad pública"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>

        {/* Enlace al hash público */}
        <a
          href="/.well-known/master-hash.txt"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
          title="Ver Master Hash público"
        >
          <span>Verificar</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* Botón de Certificado Público Modal */}
        <button
          onClick={() => setShowModal(true)}
          className="px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
        >
          <Info className="w-3 h-3 text-cyan-400" />
          <span>Certificado</span>
        </button>
      </div>

      {/* MODAL PÚBLICO: CERTIFICADO DE AUTENTICIDAD & INTEGRIDAD */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#060b18] border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-200">
            {/* Cabecera Pública */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-amber-300 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-[#040816] rounded-[14px] flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase">
                    Corporación e Innovación Guerra (CIG)
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Certificado de Software Original & Autenticidad
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificación Pública */}
            <div className="p-4 rounded-2xl bg-[#091533] border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" /> Huella Criptográfica Pública (SHA-256):
                </span>
                <button
                  onClick={handleCopyHash}
                  className="text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <div className="p-2.5 bg-black/60 rounded-xl font-mono text-[11px] sm:text-xs text-cyan-300 break-all select-all border border-white/5">
                {masterHash}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Este software opera con tecnología propia certificada. La huella digital maestra garantiza a clientes, ligas deportivas y usuarios que esta instancia es legítima, original y auditada por <strong>Corporación e Innovación Guerra (CIG)</strong>.
              </p>
            </div>

            {/* Garantía de Integridad y Blockchain */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-white font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sellado de Tiempo Inalterable en Bitcoin</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                El código fuente y sus algoritmos están anclados mediante el protocolo <strong>OpenTimestamps</strong> en la red descentralizada de Bitcoin, otorgando certeza cronológica e inmutabilidad internacional contra cualquier manipulación.
              </p>
            </div>

            {/* Archivos de Verificación Pública */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-400 block uppercase font-bold">
                Verificación Pública (.well-known):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href="/.well-known/master-hash.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-black/40 hover:bg-black/70 border border-white/10 hover:border-cyan-400/50 flex items-center justify-between text-xs transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>master-hash.txt</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <a
                  href="/.well-known/master-hash.txt.ots"
                  download="master-hash.txt.ots"
                  className="p-3 rounded-xl bg-black/40 hover:bg-black/70 border border-white/10 hover:border-cyan-400/50 flex items-center justify-between text-xs transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>Recibo OpenTimestamps (.ots)</span>
                  </span>
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            </div>

            {/* Pie del modal con aviso de privacidad y acceso admin */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-mono border-t border-white/10 pt-4">
              <span>© 2026 <strong>Corporación e Innovación Guerra</strong></span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IpShieldBadge;
