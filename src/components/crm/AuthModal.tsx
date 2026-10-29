import React, { useState } from 'react';
import { LabLogo } from '../common/LabLogo.tsx';
import { api } from '../../lib/api.ts';
import { User } from '../../types/index.ts';
import { Lock, Mail, KeyRound, AlertCircle, Loader2, X, ShieldAlert } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('admin@cokitoslab.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await api.login(email, password);
      onSuccess(response.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al autenticar credenciales administrativas.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@cokitoslab.com');
    setPassword('admin123');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#0B1F2D] border border-[#00D9F5]/40 rounded-2xl shadow-2xl overflow-hidden p-7 sm:p-9">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#F5FBFF]/60 hover:text-[#F5FBFF] hover:bg-[#143247] rounded-md transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Lab Logo */}
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <LabLogo variant="symbol" size="md" />
          </div>
          <h3 className="text-xl font-extrabold text-[#F5FBFF] tracking-tight">
            Control Center — Cokito's Lab
          </h3>
          <p className="text-xs font-mono text-[#00D9F5] mt-1">
            ACCESO RESTRINGIDO A PERSONAL AUTORIZADO
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#F5FBFF]/80 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#00D9F5] absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cokitoslab.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[#081722] border border-[#16364d] focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] text-sm text-[#F5FBFF] outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#F5FBFF]/80 mb-1.5">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#00D9F5] absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[#081722] border border-[#16364d] focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] text-sm text-[#F5FBFF] outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-[#00D9F5]/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validando Credenciales...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Ingresar al Control Center</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Fast Fill */}
        <div className="mt-6 pt-5 border-t border-[#143247] flex flex-col items-center gap-2 text-center">
          <span className="text-[11px] font-mono text-[#F5FBFF]/50">
            Credenciales de Director / Administrador
          </span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs font-mono text-[#00E3B2] hover:underline cursor-pointer flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Cargar credenciales de demostración (admin123)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
