import React, { useState } from 'react';
import { LabLogo } from '../common/LabLogo.tsx';
import { api } from '../../lib/api.ts';
import { User } from '../../types/index.ts';
import { 
  Lock, 
  Mail, 
  KeyRound, 
  AlertCircle, 
  Loader2, 
  X, 
  Shield, 
  ExternalLink,
  Scale,
  Users2,
  Info
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await api.login(email.trim(), password.trim());
      onSuccess(response.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Credenciales no válidas. Acceso restringido al personal autorizado de Cokito’s Lab.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F2D]/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-[#BCE4F7] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#64748B] hover:text-[#0B1F2D] hover:bg-[#EAF6FD] rounded-full transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Lab Logo */}
        <div className="text-center mb-6">
          <div className="inline-block mb-2">
            <LabLogo variant="symbol" size="md" />
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1F2D] tracking-tight">
            Control Center — Cokito's Lab
          </h3>
          <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-[#0B1F2D] text-[#00D9F5] text-[10px] font-mono font-bold tracking-wider uppercase">
            <Shield className="w-3 h-3 text-[#00E3B2]" />
            <span>Área Operativa Privada</span>
          </div>
        </div>

        {/* Explanatory & Public Orientative Box */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-[#F0F9FF] to-[#E5F5FD] border border-[#BCE4F7] text-xs space-y-3">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#00897B] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#0B1F2D] block">
                ¿Enviaste una solicitud o cotización desde la web?
              </span>
              <p className="text-[#1E3A52] leading-relaxed">
                Este es el centro de mando interno donde el equipo de Cokito's Lab recibe, procesa y supervisa en tiempo real cada requerimiento. Por razones de confidencialidad de nuestros clientes, <strong>este panel es de acceso restringido a la dirección del laboratorio</strong>.
              </p>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#CCE8F6] space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#00897B] uppercase tracking-wider block">
              ¿Quieres ver en vivo cómo opera un CRM desarrollado por Cokito's Lab?
            </span>
            <p className="text-[11px] text-[#64748B]">
              Puedes interactuar libremente con cualquiera de nuestras demostraciones activas:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <a
                href="https://cl-demo-legal-crm-omega-1-0.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white hover:bg-[#FAF5FF] border border-[#E9D5FF] hover:border-[#8B5CF6] text-left transition-all flex flex-col justify-between group shadow-2xs"
              >
                <div className="flex items-center justify-between text-[#8B5CF6] mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Scale className="w-3.5 h-3.5" />
                    <span>LegalTech CRM Suite</span>
                  </div>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[10px] text-[#64748B]">
                  CRM legal con expedientes, pipeline y trámites por etapas ↗
                </span>
              </a>

              <a
                href="https://agir-ensemble-nine.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white hover:bg-[#F0FDF4] border border-[#BBF7D0] hover:border-[#22C55E] text-left transition-all flex flex-col justify-between group shadow-2xs"
              >
                <div className="flex items-center justify-between text-[#15803D] mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Users2 className="w-3.5 h-3.5" />
                    <span>Agir Ensemble CRM</span>
                  </div>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[10px] text-[#64748B]">
                  Plataforma y CRM social de intervención en Francia ↗
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Secure Form (ZERO credentials on screen) */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#0B1F2D] font-bold mb-1.5">
              Correo Institucional o Autorizado
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#009bb3] absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@cokitoslab.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#0B1F2D] outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#0B1F2D] font-bold mb-1.5">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#009bb3] absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#0B1F2D] outline-none font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-[#00D9F5]/20 cursor-pointer disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,217,245,0.4)]"
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

      </div>
    </div>
  );
};
