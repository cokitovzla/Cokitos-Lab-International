import React, { useState } from 'react';
import { api } from '../../lib/api.ts';
import { Lead, LeadDiagnostic } from '../../types/index.ts';
import { X, Search, AlertCircle, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

interface RecoverRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecovered: (lead: Lead, diagnostic: LeadDiagnostic, token: string) => void;
}

export const RecoverRequestModal: React.FC<RecoverRequestModalProps> = ({
  isOpen,
  onClose,
  onRecovered,
}) => {
  if (!isOpen) return null;

  const [referenceCode, setReferenceCode] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanRef = referenceCode.trim().toUpperCase();
    const cleanId = identifier.trim();

    if (!cleanRef) {
      setErrorMsg('Por favor ingresa tu código de referencia comercial (ej. CL-2026-00001) o token de recuperación.');
      return;
    }

    if (!cleanId) {
      setErrorMsg('Por favor ingresa el correo electrónico o teléfono registrado para verificar tu identidad.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.recoverLead(cleanRef, cleanId);
      if (res.success && res.lead) {
        onRecovered(res.lead, res.diagnostic, res.recoveryToken);
        onClose();
      } else {
        setErrorMsg('No se encontró ninguna solicitud coincidente con los datos proporcionados.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al verificar la solicitud. Por favor revisa los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0B1F2D]/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#BCE4F7] p-6 space-y-5 animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between border-b border-[#E0F2FE] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D9F5]" />
            <h3 className="text-base font-extrabold text-[#0B1F2D]">
              Recuperar mi Solicitud & Diagnóstico
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#1E3A52] leading-relaxed">
          Ingresa tu código de referencia comercial oficial y el correo o teléfono que registraste para verificar tu identidad y retomar tu diagnóstico donde lo dejaste.
        </p>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#0B1F2D] font-bold mb-1">
              Código de Referencia Comercial <span className="text-[#009bb3]">*</span>
            </label>
            <input
              type="text"
              required
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
              placeholder="Ej. CL-2026-00001"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white text-xs sm:text-sm font-mono text-[#0B1F2D] uppercase placeholder-[#94A3B8] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#0B1F2D] font-bold mb-1">
              Correo Electrónico o Teléfono Registrado <span className="text-[#009bb3]">*</span>
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="tu@correo.com o número de contacto"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white text-xs sm:text-sm font-mono text-[#0B1F2D] placeholder-[#94A3B8] outline-none transition-all"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-mono font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Localizar y Reanudar</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-mono text-slate-700 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>

        <div className="p-3 rounded-lg bg-[#F0F9FF] border border-[#BCE4F7] text-[11px] text-[#1E3A52] font-mono leading-relaxed">
          <span className="font-bold text-[#00897B] block mb-0.5">Seguridad Cokito's Lab:</span>
          Por protección de la confidencialidad de tu proyecto, el acceso requiere coincidencia exacta con el contacto registrado.
        </div>

      </div>
    </div>
  );
};
