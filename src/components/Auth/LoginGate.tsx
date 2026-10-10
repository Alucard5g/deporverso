import React, { useState } from 'react';
import { 
  Shield, Lock, Mail, Eye, EyeOff, ArrowRight, 
  AlertCircle, UserPlus, LogIn, User, CheckCircle, X
} from 'lucide-react';
import { UserRole } from '../../types';
import { authService, AppUser } from '../../services/authService';
import { googleSignIn } from '../../services/firebaseAuth';

interface LoginGateProps {
  onLoginSuccess: (authData: {
    role: UserRole;
    email: string;
    isSuperAdmin: boolean;
  }) => void;
  onClose?: () => void;
  initialMode?: 'register' | 'login';
}

export const LoginGate: React.FC<LoginGateProps> = ({ 
  onLoginSuccess,
  onClose,
  initialMode = 'register'
}) => {
  const [authMode, setAuthMode] = useState<'register' | 'login'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        onLoginSuccess({
          role: 'LEAGUE_ADMIN',
          email: result.user.email || 'user@example.com',
          isSuperAdmin: false,
        });
      }
    } catch (err: any) {
      setError('Error al iniciar sesión con Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const GoogleButton = () => (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm border border-slate-200"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      <span>Iniciar con Google</span>
    </button>
  );

  // Manejo de Inicio de Sesión de Usuarios Registrados
  const handleUserLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Por favor ingresa tu correo y contraseña registrados.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = authService.verifyLogin(trimmedEmail, trimmedPassword);

      if (result.success) {
        setIsLoading(false);
        onLoginSuccess({
          role: result.role,
          email: result.user?.email || trimmedEmail,
          isSuperAdmin: result.isSuperAdmin,
        });
      } else {
        setIsLoading(false);
        setError(result.message || 'Credenciales no autorizadas. Por favor verifica tus datos.');
      }
    }, 250);
  };

  // Manejo de Registro Ágil para Interesados (Sin Perfil de Acceso)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedName = regName.trim();
    const trimmedEmail = regEmail.trim().toLowerCase();
    const trimmedPassword = regPassword.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('El correo y la contraseña son obligatorios.');
      return;
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Ingresa un formato de correo electrónico válido.');
      return;
    }

    if (trimmedPassword.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    // Verificar si el correo ya existe
    const existingUsers = authService.getRegisteredUsers();
    if (existingUsers.some(u => u.email.toLowerCase() === trimmedEmail)) {
      setError('Este correo ya está registrado. Por favor inicia sesión.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Todo registro de interesado se crea como usuario activo de liga
      const newUser: AppUser = {
        id: `u-${Date.now()}`,
        email: trimmedEmail,
        password: trimmedPassword,
        name: trimmedName || trimmedEmail.split('@')[0],
        role: 'LEAGUE_ADMIN',
        status: 'ACTIVO',
        createdAt: new Date().toISOString().split('T')[0],
      };

      authService.saveUser(newUser);

      setIsLoading(false);
      setSuccessMsg('✓ Registro completado exitosamente. Ingresando a DeporVerso...');

      setTimeout(() => {
        onLoginSuccess({
          role: newUser.role,
          email: newUser.email,
          isSuperAdmin: false,
        });
      }, 600);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#081325_1px,transparent_1px),linear-gradient(to_bottom,#081325_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Tarjeta de Acceso */}
      <div className="relative w-full max-w-sm bg-[#080d1a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 z-10 my-auto">
        
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer z-20"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Cabecera y Marca Oficial */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold tracking-widest uppercase">
            <Shield className="w-3 h-3 text-cyan-400" />
            <span>Plataforma Oficial CIG</span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">
            Depor<span className="text-cyan-400">Verso</span>
          </h1>

          <p className="text-xs text-slate-400 mx-auto leading-relaxed max-w-[280px]">
            Gestión Oficial de Fútbol, VAR y Vocalía Digital.
          </p>
        </div>

        {/* Pestañas de Navegación de Acceso */}
        <div className="grid grid-cols-2 bg-slate-950 p-1.5 rounded-2xl border border-white/10 gap-1.5">
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setError(null); setSuccessMsg(null); }}
            className={`py-3 px-2 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer truncate text-xs ${
              authMode === 'register'
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span>Registro</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
            className={`py-3 px-2 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer truncate text-xs ${
              authMode === 'login'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LogIn className="w-4 h-4 shrink-0" />
            <span>Ingresar</span>
          </button>
        </div>

        {/* ================================================================ */}
        {/* PESTAÑA 1: REGISTRO DE INTERESADOS EN LA APP                     */}
        {/* ================================================================ */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} autoComplete="on" className="space-y-3.5 text-xs animate-in fade-in">
            <div className="bg-cyan-500/10 border border-cyan-500/30 p-2.5 rounded-xl text-slate-300 text-[11px] leading-relaxed">
              <strong className="text-cyan-300 font-bold">Acceso a la Demo Oficial:</strong> Al registrarte gratis accedes inmediatamente a la demo de la Liga Barrial Pichincha y el Club Deportivo Deporverso (este usuario solo accede a la demo). Los usuarios que paguen la suscripción acceden al portal de Deporverso completo.
            </div>

            {/* Nombre Completo / Organización */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Nombre o Nombre de Liga / Club *</span>
              </label>
              <input
                type="text"
                id="register-name"
                name="name"
                autoComplete="name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Ej. Carlos Mendoza (Liga Barrial)"
                required
                className="w-full bg-slate-950/80 border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 outline-none text-xs"
              />
            </div>

            {/* Correo Electrónico */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Correo Electrónico *</span>
              </label>
              <input
                type="email"
                id="register-email"
                name="username"
                autoComplete="username email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                className="w-full bg-slate-950/80 border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 outline-none text-xs"
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Contraseña *</span>
              </label>
              <div className="relative">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  id="register-password"
                  name="new-password"
                  autoComplete="new-password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  required
                  className="w-full bg-slate-950/80 border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2.5 pr-10 text-white placeholder-slate-500 outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Mensajes de Feedback */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Botón de Registro */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 hover:opacity-95 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Crear Mi Cuenta & Entrar</span>
                </>
              )}
            </button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#080d1a] px-2 text-slate-500">O continuar con</span>
              </div>
            </div>
            <GoogleButton />
          </form>
        )}

        {/* ================================================================ */}
        {/* PESTAÑA 2: INICIAR SESIÓN (USUARIOS REGISTRADOS / GUARDADOS)    */}
        {/* ================================================================ */}
        {authMode === 'login' && (
          <form onSubmit={handleUserLoginSubmit} autoComplete="on" className="space-y-4 animate-in fade-in">
            <div className="bg-cyan-500/10 border border-cyan-500/20 p-2.5 rounded-xl text-slate-300 text-[11px] leading-relaxed">
              <strong className="text-cyan-300">Fácil Acceso:</strong> Ingresa con tu correo y contraseña guardada en tu navegador (PC, celular o tablet).
            </div>

            {/* Campo Correo Electrónico */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5 text-xs">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Correo Electrónico Registrado</span>
              </label>
              <input
                type="email"
                id="login-email"
                name="username"
                autoComplete="username email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                className="w-full bg-slate-950/80 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-all outline-none"
              />
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5 text-xs">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Contraseña</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  name="current-password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña guardada"
                  required
                  className="w-full bg-slate-950/80 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Mensajes de Feedback */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Botón de Enviar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 via-cyan-400 to-emerald-400 hover:opacity-95 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ingresar a DeporVerso</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#080d1a] px-2 text-slate-500">O continuar con</span>
              </div>
            </div>
            <GoogleButton />
          </form>
        )}

        {/* Pie de Página Minimalista */}
        <div className="text-center text-[10px] text-slate-600 font-mono pt-1">
          Corporación e Innovación Guerra (CIG) © 2026. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};
