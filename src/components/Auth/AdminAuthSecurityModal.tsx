import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  KeyRound, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Sparkles,
  Radio,
  Video,
  FileText,
  Film
} from 'lucide-react';
import { authService, MASTER_ADMIN_EMAIL, MASTER_ADMIN_PASSWORDS } from '../../services/authService';

interface AdminAuthSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorized: () => void;
  featureTitle?: string;
  featureDescription?: string;
}

export const AdminAuthSecurityModal: React.FC<AdminAuthSecurityModalProps> = ({
  isOpen,
  onClose,
  onAuthorized,
  featureTitle = 'Gestión Oficial de Transmisión & Contenido',
  featureDescription = 'El streaming en vivo, el sistema VAR, la producción de video y las crónicas periodísticas requieren autorización exclusiva del Administrador para salvaguardar la integridad de la competición.'
}) => {
  const [authTab, setAuthTab] = useState<'pin' | 'credentials'>('pin');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState(MASTER_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedPin = pin.trim();

    if (!trimmedPin) {
      setError('Por favor digita la clave maestra de administrador.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = authService.verifyAdminPassword(trimmedPin);
      if (result.success) {
        setIsSuccess(true);
        try {
          localStorage.setItem('deporverso_auth_session', JSON.stringify({
            authenticated: true,
            role: 'SUPER_ADMIN',
            email: result.user?.email || MASTER_ADMIN_EMAIL,
            isSuperAdmin: true,
            loginTimestamp: Date.now()
          }));
        } catch (e) {}

        setTimeout(() => {
          setIsLoading(false);
          onAuthorized();
          onClose();
        }, 600);
      } else {
        setIsLoading(false);
        setError('Clave maestra incorrecta. Verifica tu PIN de administrador.');
      }
    }, 200);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setError('Por favor completa el correo y contraseña de administrador.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = authService.verifyLogin(trimmedEmail, trimmedPass);
      if (result.success && result.isSuperAdmin) {
        setIsSuccess(true);
        try {
          localStorage.setItem('deporverso_auth_session', JSON.stringify({
            authenticated: true,
            role: 'SUPER_ADMIN',
            email: result.user?.email || trimmedEmail,
            isSuperAdmin: true,
            loginTimestamp: Date.now()
          }));
        } catch (e) {}

        setTimeout(() => {
          setIsLoading(false);
          onAuthorized();
          onClose();
        }, 600);
      } else if (result.success && !result.isSuperAdmin) {
        setIsLoading(false);
        setError('Este usuario no posee privilegios de Super Administrador para operar Streaming, VAR y Crónicas.');
      } else {
        setIsLoading(false);
        setError(result.message || 'Credenciales de administrador no válidas.');
      }
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-[120000] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#060a14] border border-amber-500/40 rounded-3xl shadow-[0_0_80px_rgba(245,158,11,0.2)] overflow-hidden text-white flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Glow Accent Top Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono">
                  ACCESO RESTRINGIDO
                </span>
                <span className="text-[10px] text-slate-400 font-mono">CIG DEPORVERSO</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                {featureTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Context Card */}
        <div className="px-6 pt-4 pb-2">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-cyan-500/5 border border-amber-500/25 text-xs text-slate-300 leading-relaxed space-y-1.5">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Módulo de Control Exclusivo para Administrador</span>
            </div>
            <p className="text-[11px] text-slate-300">
              {featureDescription}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-white/10 text-cyan-300">
                <Radio className="w-3 h-3 text-cyan-400" /> Streaming TV
              </span>
              <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-white/10 text-rose-300">
                <Video className="w-3 h-3 text-rose-400" /> Sala VAR
              </span>
              <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-white/10 text-amber-300">
                <FileText className="w-3 h-3 text-amber-400" /> Crónicas IA
              </span>
              <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-white/10 text-pink-300">
                <Film className="w-3 h-3 text-pink-400" /> Videos & Reels
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Clave Maestra vs Correo y Contraseña */}
        <div className="px-6 pt-3">
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-black/50 border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthTab('pin'); setError(null); }}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authTab === 'pin'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Clave Maestra (PIN)</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthTab('credentials'); setError(null); }}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authTab === 'credentials'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Correo y Clave</span>
            </button>
          </div>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
            <span>¡Identidad confirmada! Desbloqueando acceso de administrador...</span>
          </div>
        )}

        {/* Content Body: Forms */}
        <div className="p-6 pt-3">
          {authTab === 'pin' ? (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                  Digita la Clave Maestra de Administrador:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Ej. 1326 o tu clave oficial"
                    autoFocus
                    autoComplete="off"
                    className="w-full bg-black/60 border border-white/20 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-2xl px-4 py-3 text-base font-mono tracking-widest text-white placeholder-slate-500 outline-hidden transition-all text-center"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                  Acceso directo con credencial maestra CIG autorizada.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer transform active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{isLoading ? 'Verificando...' : 'Desbloquear con Clave Maestra'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 font-mono">
                  Correo Electrónico de Administrador:
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="roly3d.rg@gmail.com"
                    className="w-full bg-black/60 border border-white/20 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 outline-hidden transition-all pl-10"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 font-mono">
                  Contraseña de Administrador:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/60 border border-white/20 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 outline-hidden transition-all pl-10 pr-10"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer transform active:scale-95 disabled:opacity-50"
                >
                  <Shield className="w-4 h-4 text-slate-950" />
                  <span>{isLoading ? 'Comprobando...' : 'Iniciar Sesión como Administrador'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Quick Info Footer */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>¿Eres operador de mesa o aficionado?</span>
            <button
              type="button"
              onClick={onClose}
              className="text-cyan-400 hover:underline cursor-pointer font-semibold"
            >
              Continuar en modo consulta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
