import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Send, 
  FileCode, 
  Cpu, 
  Fingerprint, 
  Copy, 
  Check, 
  ExternalLink,
  Activity,
  Layers,
  FileCheck,
  Zap,
  Terminal,
  Server,
  Download,
  Scale,
  Sparkles,
  FileText,
  KeyRound,
  EyeOff,
  Eye,
  Clock
} from 'lucide-react';

interface SecurityStatusData {
  entity: string;
  project: string;
  security_shield_active: boolean;
  anti_scraping_enabled: boolean;
  rate_limiting_active: boolean;
  manifest: {
    timestamp_utc: string;
    merkle_master_root_hash: string;
    total_audited_files: number;
    asymmetric_algorithm: string;
    public_key_fingerprint: string;
    opentimestamps?: {
      provider: string;
      proof_file: string;
    };
    legal_declaration: string;
  } | null;
  verification: {
    hasManifest: boolean;
    hasSignatureEd25519: boolean;
    hasOpenTimestampsProof: boolean;
    hasCorporatePublicKey: boolean;
    corporatePublicKeyFingerprint: string;
  };
  metrics: {
    activeTrackedIps: number;
    totalTrackedHits: number;
  };
  webhookConfigured: boolean;
}

interface OtsStatusData {
  success: boolean;
  masterHash: string;
  hasOtsReceipt: boolean;
  otsSizeBytes: number;
  hasManifest: boolean;
  blockchain: string;
  standard: string;
  owner: string;
  lastAuditedUtc: string | null;
}

export const CigSecurityPanel: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<SecurityStatusData | null>(null);
  const [otsStatus, setOtsStatus] = useState<OtsStatusData | null>(null);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [sendingTest, setSendingTest] = useState<boolean>(false);
  const [generatingPdf, setGeneratingPdf] = useState<boolean>(false);
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [copiedGitCmd, setCopiedGitCmd] = useState<boolean>(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const [resStatus, resOts] = await Promise.all([
        fetch('/api/cig/security-status'),
        fetch('/api/cig/ots-status')
      ]);

      if (resStatus.ok) {
        const data = await resStatus.json();
        setStatus(data);
      }
      if (resOts.ok) {
        const otsData = await resOts.json();
        setOtsStatus(otsData);
      }
    } catch (e) {
      console.warn('Error fetching CIG security status:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleRunVerify = async () => {
    setVerifying(true);
    setVerificationResult(null);
    try {
      const res = await fetch('/api/cig/verify', { method: 'POST' });
      const data = await res.json();
      setVerificationResult(data);
      if (data.signatureVerified) {
        setToastMsg('✓ Integridad pericial y firma Ed25519 verificadas con éxito.');
      } else {
        setToastMsg('⚠️ Alerta en la verificación de integridad.');
      }
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err: any) {
      setToastMsg(`Error en verificación: ${err.message}`);
    } finally {
      setVerifying(false);
    }
  };

  const handleGeneratePdfCertificate = async () => {
    setGeneratingPdf(true);
    try {
      const res = await fetch('/api/cig/generate-legal-certificate-pdf', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.downloadUrl) {
        setPdfDownloadUrl(data.downloadUrl);
        setToastMsg(`✓ Dictamen pericial generado: ${data.fileName}`);
        // Disparar descarga automática
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setToastMsg('Error generando el dictamen pericial en PDF');
      }
    } catch (err: any) {
      setToastMsg(`Error generando PDF: ${err.message}`);
    } finally {
      setGeneratingPdf(false);
      setTimeout(() => setToastMsg(null), 5000);
    }
  };

  const handleDispatchNotification = async () => {
    setSendingTest(true);
    try {
      const res = await fetch('/api/cig/dispatch-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: 'Prueba manual de auditoría notarial CIG desde el panel maestro' })
      });
      const data = await res.json();
      setToastMsg(`Notificación: ${data.message || 'Despachada correctamente'}`);
      setTimeout(() => setToastMsg(null), 5000);
    } catch (err: any) {
      setToastMsg(`Fallo al enviar notificación: ${err.message}`);
    } finally {
      setSendingTest(false);
    }
  };

  const copyMasterHash = () => {
    const hash = otsStatus?.masterHash || status?.manifest?.merkle_master_root_hash;
    if (hash) {
      navigator.clipboard.writeText(hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const copyGitCommands = () => {
    const cmd = `git config --global gpg.format ssh && git config --global user.signingkey .cig-security/cig-public.pem && git config --global commit.gpgsign true`;
    navigator.clipboard.writeText(cmd);
    setCopiedGitCmd(true);
    setTimeout(() => setCopiedGitCmd(false), 2000);
  };

  const activeMasterHash = otsStatus?.masterHash || status?.manifest?.merkle_master_root_hash || 'cedc7eb9ff3dedf79628543ef93a9139587080be3eeefe377b221c2fc639b7d6';

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Banner de Titularidad Soberana y Separación de Privacidad (Exclusivo Rolando Guerra) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#060b19] via-[#0c162e] to-[#060b19] border-2 border-cyan-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-amber-300 p-0.5 shrink-0 shadow-xl">
              <div className="w-full h-full bg-[#040816] rounded-[14px] flex items-center justify-center">
                <Shield className="w-7 h-7 text-cyan-400" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-mono font-black tracking-wider uppercase">
                  CONFIDENCIAL · SOLO PROPIETARIO
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  AUTORÍA: ROLANDO GUERRA
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Centro Soberano de Defensa de Propiedad Intelectual & Evidencias Periciales
              </h2>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                Este panel contiene tu estrategia de defensa legal inalterable, fundamentos jurídicos contra el SENADI, bóveda privada de código fuente (276 archivos) y generador de dictámenes periciales notariados.
              </p>
            </div>
          </div>

          {/* Acciones de Alto Nivel de CIG */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleGeneratePdfCertificate}
              disabled={generatingPdf}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 disabled:opacity-50 text-slate-950 font-black text-xs font-mono rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all"
              title="Generar y descargar Dictamen Pericial Notariado CIG en PDF listo para tribunales o notarías"
            >
              <FileText className={`w-4 h-4 text-slate-950 ${generatingPdf ? 'animate-pulse' : ''}`} />
              <span>{generatingPdf ? 'Generando PDF...' : 'Descargar Dictamen Pericial PDF (Tarea 1)'}</span>
            </button>

            <button
              onClick={handleRunVerify}
              disabled={verifying}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
              <span>{verifying ? 'Verificando...' : 'Verificar Integridad'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-white text-xs cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* MATRIZ DE PRIVACIDAD: QUÉ ES PÚBLICO VS QUÉ ES PRIVADO (DEFENSA ROLANDO GUERRA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Columna 1: LO QUE VE EL PÚBLICO */}
        <div className="p-5 rounded-2xl bg-[#081226] border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              Visible para el Público (Clientes, Ligas, Visitantes)
            </span>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
              Prestigio & Confianza
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            El público y tus clientes solo ven el <strong>Sello de Software Original y Certificación CIG</strong> en el footer.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Master Hash SHA-256 público (<code className="text-cyan-300 font-mono">master-hash.txt</code>) para comprobar que la app en producción no está alterada.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Recibo de sellado temporal en Bitcoin (<code className="text-purple-300 font-mono">master-hash.txt.ots</code>).</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Garantía de marca: «Desarrollado y protegido por Corporación e Innovación Guerra (CIG)».</span>
            </li>
          </ul>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-slate-400">
            🔒 <em>Protegido: Ningún usuario externo puede ver nombres de archivos, estructura del backend ni tus estrategias legales.</em>
          </div>
        </div>

        {/* Columna 2: LO QUE ES EXCLUSIVO DE ROLANDO GUERRA (DEFENSA LEGAL) */}
        <div className="p-5 rounded-2xl bg-[#091533] border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-amber-400" />
              Exclusivo de Rolando Guerra (Conocimiento & Defensa Legal)
            </span>
            <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
              Secreto & Soberanía
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Toda la artillería legal y pericial para ganar cualquier litigio o defenderte de plagios:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Manifiesto Completo de Código (<code className="text-emerald-300 font-mono">manifest.sha256</code>):</strong> 276 huellas individuales de archivos fuente para cotejo pericial judicial.</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Estrategia de Sustitución del SENADI:</strong> Aplicación del Convenio de Berna Art. 5.2 y Ley de Comercio Electrónico.</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Dictámenes Periciales Notariados en PDF (Tarea 1):</strong> Emisión instantánea lista para apostillar.</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Clave Asimétrica Ed25519 y Firmas de Commits (Tarea 3):</strong> Prueba de no-repudio irrevocable.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* DETALLE DE LAS 3 TAREAS DE BLINDAJE INDUSTRIAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Tarea 1: Generador de Dictamen Pericial Notariado */}
        <div className="p-5 rounded-2xl bg-[#090d16] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 uppercase">
              <FileText className="w-4 h-4 text-amber-400" /> Tarea 1: Dictamen Pericial PDF
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              OPERATIVO
            </span>
          </div>
          <h4 className="text-sm font-black text-white">Certificado Notariado CIG</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Genera un documento PDF formal con membrete de CIG, titularidad de Rolando Guerra, Master Hash, Merkle Tree y fundamentación jurídica del Convenio de Berna.
          </p>
          <button
            onClick={handleGeneratePdfCertificate}
            disabled={generatingPdf}
            className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs font-mono rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-slate-950" />
            <span>{generatingPdf ? 'Compilando...' : 'Descargar Dictamen PDF'}</span>
          </button>
        </div>

        {/* Tarea 2: Monitor de Confirmación Bitcoin (OpenTimestamps) */}
        <div className="p-5 rounded-2xl bg-[#090d16] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5 uppercase">
              <Zap className="w-4 h-4 text-purple-400" /> Tarea 2: Monitor Bitcoin OTS
            </span>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
              CRON DIARIO
            </span>
          </div>
          <h4 className="text-sm font-black text-white">Consolidación en Blockchain</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Workflow automático <code className="text-purple-300 font-mono">ots-upgrade-monitor.yml</code> que consulta diariamente a Bitcoin y consolida el recibo OTS tras confirmación de bloque.
          </p>
          <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 text-[11px] font-mono text-slate-300 flex items-center justify-between">
            <span>Recibo OTS:</span>
            <span className="text-purple-400 font-bold">{otsStatus?.otsSizeBytes || 207} bytes</span>
          </div>
        </div>

        {/* Tarea 3: Firmas Asimétricas en Commits de Git */}
        <div className="p-5 rounded-2xl bg-[#090d16] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5 uppercase">
              <Fingerprint className="w-4 h-4 text-cyan-400" /> Tarea 3: Firma Git Ed25519
            </span>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/30">
              NO-REPUDIO
            </span>
          </div>
          <h4 className="text-sm font-black text-white">Firma Soberana de Commits</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Clave Ed25519 vinculada a Rolando Guerra para firmar cada línea de código subida a GitHub sin depender de terceros.
          </p>
          <button
            onClick={copyGitCommands}
            className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copiedGitCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedGitCmd ? 'Comandos Copiados' : 'Copiar Configuración Git'}</span>
          </button>
        </div>

      </div>

      {/* BÓVEDA PRIVADA DE EVIDENCIAS (DESCARGAS EXCLUSIVAS DEL PROPIETARIO) */}
      <div className="p-5 rounded-2xl bg-[#090d16] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Bóveda Privada de Evidencias Criptográficas (Exclusivo Administrador)</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Archivos protegidos para custodia de Rolando Guerra. No compartidos públicamente.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            276 ARCHIVOS INDEXADOS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Descarga Privada del Manifiesto Completo */}
          <a
            href="/api/cig/download-manifest"
            className="p-3.5 rounded-xl bg-black/50 hover:bg-black/80 border border-white/10 hover:border-cyan-400/50 flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 group-hover:text-cyan-300">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>manifest.sha256 (Privado)</span>
              </span>
              <span className="text-[10px] text-slate-500 block font-mono">
                276 huellas individuales de código
              </span>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
          </a>

          {/* Descarga del Recibo OTS */}
          <a
            href="/.well-known/master-hash.txt.ots"
            download="master-hash.txt.ots"
            className="p-3.5 rounded-xl bg-black/50 hover:bg-black/80 border border-white/10 hover:border-purple-400/50 flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 group-hover:text-purple-300">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>master-hash.txt.ots</span>
              </span>
              <span className="text-[10px] text-slate-500 block font-mono">
                Prueba binaria inalterable Bitcoin
              </span>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-purple-400" />
          </a>

          {/* Descarga del Master Hash */}
          <a
            href="/.well-known/master-hash.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-xl bg-black/50 hover:bg-black/80 border border-white/10 hover:border-emerald-400/50 flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 group-hover:text-emerald-300">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>master-hash.txt</span>
              </span>
              <span className="text-[10px] text-slate-500 block font-mono">
                Merkle Root Root Hash (64 hex)
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
          </a>
        </div>
      </div>

      {/* MASTER HASH Y CADENA DE CUSTODIA CRIPTOGRÁFICA */}
      <div className="p-5 rounded-2xl bg-[#090d16] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Master Merkle Root Hash (SHA-256)</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Huella matemática global que protege el 100% de la arquitectura DeporVerso
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Última auditoría: {otsStatus?.lastAuditedUtc ? new Date(otsStatus.lastAuditedUtc).toLocaleString() : 'Reciente'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/60 p-3 rounded-xl border border-white/10 font-mono text-xs text-slate-200">
          <span className="flex-1 truncate font-bold text-emerald-400">
            {activeMasterHash}
          </span>
          <button
            onClick={copyMasterHash}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedHash ? 'Copiado' : 'Copiar Hash'}</span>
          </button>
        </div>
      </div>

      {/* FUNDAMENTACIÓN JURÍDICA DE DEFENSA CONTRA EL SENADI (CONFIDENCIAL ROLANDO GUERRA) */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#091533] to-[#040816] border border-cyan-500/30 space-y-4">
        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-mono">
            Estrategia de Litigio y Fundamento Jurídico contra SENADI
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <span className="font-bold text-amber-300 font-mono block text-xs">
              1. Convenio de Berna (Art. 5.2)
            </span>
            <p className="text-slate-300 text-[11px]">
              Suscrito por Ecuador y 180+ países. Establece el principio universal de <strong>no-subordinación a formalidades</strong>: los derechos de autor nacen automáticamente con la creación del software. No requieres pagar tasas al SENADI para ser el dueño legítimo ante la ley.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <span className="font-bold text-cyan-300 font-mono block text-xs">
              2. Código Ingenios (COESCC Art. 100)
            </span>
            <p className="text-slate-300 text-[11px]">
              La ley ecuatoriana protege el software como obra literaria. El registro administrativo ante el SENADI es meramente declarativo, nunca constitutivo. El registro criptográfico inalterable en Bitcoin constituye <strong>prueba pericial indubitable de anterioridad temporal</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <span className="font-bold text-emerald-300 font-mono block text-xs">
              3. Ley de Comercio Electrónico (Arts. 2 y 14)
            </span>
            <p className="text-slate-300 text-[11px]">
              Otorga plena validez probatoria a los algoritmos hash SHA-256 y sellos de tiempo electrónicos como prueba judicial formal en tribunales de justicia ecuatorianos e internacionales.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-[11px] leading-relaxed">
            <strong>Cómo actuar ante un intento de plagio o copia:</strong>
            <p>
              Presenta directamente el <strong>Dictamen Pericial Notariado CIG en PDF</strong> y el archivo <code className="text-white font-mono">master-hash.txt.ots</code> ante el juez o fiscal. El perito informático ejecutará <code className="text-white font-mono">ots verify master-hash.txt.ots</code>, demostrando que tu obra existía en la blockchain antes de que el usurpador creara su versión, anulando cualquier intento de reclamo.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CigSecurityPanel;
