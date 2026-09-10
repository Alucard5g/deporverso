import React, { useState } from 'react';
import { Shield, Lock, AlertCircle, X, User } from 'lucide-react';

interface SuperAdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SuperAdminAuthModal: React.FC<SuperAdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Clave maestra de acceso
      if (password.trim() === '1326') {
        setIsLoading(false);
        onSuccess();
        onClose();
        setEmail('');
        setPassword('');
      } else {
        setIsLoading(false);
        setError('Acceso Denegado: Contraseña de SuperAdmin incorrecta.');
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0d0d0d] border border-amber-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <Shield className="w-8 h-8" />
          </div>
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full inline-block">
            Acceso de Administración Maestro
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Autenticación SuperAdmin
          </h2>
          <p className="text-xs text-white/60">
            Ingresa las credenciales autorizadas del panel de administración principal.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-center gap-2.5 text-rose-400 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/70 mb-1">
              Contraseña de SuperAdmin (Clave Maestra)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                autoFocus
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value.trim() === '1326') {
                    // Auto-submit when typing authorized password
                    setTimeout(() => {
                      setIsLoading(false);
                      onSuccess();
                      onClose();
                      setPassword('');
                    }, 200);
                  }
                }}
                className="w-full bg-[#141414] border border-amber-500/40 rounded-xl pl-9 pr-3 py-3 text-sm text-white focus:outline-none focus:border-amber-400 font-mono tracking-widest text-center"
              />
            </div>
            <p className="text-[11px] text-white/50 mt-1.5 font-medium flex items-center justify-between">
              <span>Acceso restringido a personal directivo autorizado</span>
              <span className="text-[10px] text-amber-400/80 font-bold">Módulo Seguro</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{isLoading ? 'Verificando Credenciales...' : 'Ingresar al Modo Administrador'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
