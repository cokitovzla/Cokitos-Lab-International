import React, { useState, useEffect } from 'react';
import { LabSettings, User } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { 
  Building2, 
  Users, 
  Database, 
  CheckCircle2, 
  Save, 
  ShieldCheck, 
  Download,
  Settings,
  Mail,
  Phone,
  Globe2
} from 'lucide-react';

interface SettingsViewProps {
  currentUser: User | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser }) => {
  const [settings, setSettings] = useState<LabSettings>({
    name: "COKITO'S LAB",
    descriptor: 'Laboratorio de innovación y tecnología aplicada',
    slogan: 'Menos caos. Automatiza. Escala.',
    philosophy: 'Transformamos ideas en sistemas que funcionan.',
    contactEmail: 'cokito.int@gmail.com',
    contactPhone: '+58 422 461 2534',
    location: 'Francia 🇫🇷 • Venezuela 🇻🇪 • USA 🇺🇸',
    activeInquiries: true,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getSettings();
        if (res.settings) setSettings(res.settings);
        if (res.users) setUsers(res.users);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await api.updateSettings(settings);
      setSettings(res.settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportCsv = () => {
    window.location.href = api.getExportCsvUrl();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* 1. UNIFIED VIEW HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D0EBF7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9F5] to-[#3B82F6] flex items-center justify-center text-white shadow-sm shrink-0">
            <Settings className="w-5 h-5 font-bold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F2D] tracking-tight">
              Configuración del Laboratorio
            </h1>
            <p className="text-xs font-mono text-[#64748B]">
              Parámetros institucionales, hubs globales de contacto y seguridad del Control Center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#EAF6FD] border border-[#BCE4F7] text-xs font-mono text-[#009bb3] font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar CSV</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Configuración guardada exitosamente en la base de datos persistente.</span>
        </div>
      )}

      {/* Lab Profile Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-white border border-[#D0EBF7] space-y-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#D0EBF7]">
          <div className="flex items-center gap-2 text-[#009bb3]">
            <Building2 className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#0B1F2D]">
              Identidad Institucional del Laboratorio
            </h3>
          </div>
          <span className="text-xs font-mono text-[#64748B]">
            Voz de marca oficial
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-mono text-[#1E3A52] font-bold block mb-1.5">
              Nombre de la Marca
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#F5FBFF] border border-[#D0EBF7] text-xs text-[#0B1F2D] outline-none font-mono focus:border-[#00D9F5]"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#1E3A52] font-bold block mb-1.5">
              Eslogan Comercial
            </label>
            <input
              type="text"
              value={settings.slogan}
              onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#F5FBFF] border border-[#D0EBF7] text-xs text-[#0B1F2D] outline-none font-mono focus:border-[#00D9F5]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-mono text-[#1E3A52] font-bold block mb-1.5">
            Descriptor de la Marca
          </label>
          <input
            type="text"
            value={settings.descriptor}
            onChange={(e) => setSettings({ ...settings, descriptor: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-[#F5FBFF] border border-[#D0EBF7] text-xs text-[#0B1F2D] outline-none font-mono focus:border-[#00D9F5]"
          />
        </div>

        <div>
          <label className="text-xs font-mono text-[#1E3A52] font-bold block mb-1.5">
            Filosofía Institucional
          </label>
          <textarea
            rows={2}
            value={settings.philosophy}
            onChange={(e) => setSettings({ ...settings, philosophy: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-[#F5FBFF] border border-[#D0EBF7] text-xs text-[#0B1F2D] outline-none focus:border-[#00D9F5]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-[#D0EBF7]">
          <div>
            <label className="text-xs font-mono text-[#1E3A52] font-bold block mb-1.5">
              Email Público de Contacto
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#F5FBFF] border border-[#D0EBF7] text-xs text-[#0B1F2D] outline-none font-mono focus:border-[#00D9F5]"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#1E3A52] font-bold block mb-1.5">
              Teléfono de Contacto
            </label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#F5FBFF] border border-[#D0EBF7] text-xs text-[#0B1F2D] outline-none font-mono focus:border-[#00D9F5]"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs font-mono transition-colors cursor-pointer shadow-xs shadow-[#00D9F5]/20 hover:shadow-[0_0_15px_rgba(0,217,245,0.4)]"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </form>

      {/* Hubs Globales de Cokito's Lab */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#D0EBF7] space-y-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#D0EBF7]">
          <div className="flex items-center gap-2 text-[#009bb3]">
            <Globe2 className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#0B1F2D]">
              Hubs Internacionales & Representaciones Regionales
            </h3>
          </div>
          <span className="text-xs font-mono text-[#00897B] font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            3 Sedes Operativas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* France */}
          <div className="p-5 rounded-2xl bg-[#F8FCFE] border border-[#D0EBF7] hover:border-blue-400 transition-all space-y-3 relative overflow-hidden group">
            <div className="h-1 bg-gradient-to-r from-blue-600 via-white to-red-600 absolute top-0 left-0 right-0" />
            <div className="flex items-center justify-between">
              <span className="text-2xl">🇫🇷</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200 uppercase">
                Hub Europa
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B1F2D]">Morice Mojica</h4>
              <p className="text-xs font-mono text-[#009bb3] font-bold">+33 (77) 4853604</p>
              <p className="text-xs font-mono text-[#64748B]">cokito.int@gmail.com</p>
            </div>
            <p className="text-[11px] text-[#475569] pt-2 border-t border-[#D0EBF7] leading-relaxed">
              París / Occitania. Operaciones europeas, desarrollo SaaS y LegalTech.
            </p>
          </div>

          {/* Venezuela */}
          <div className="p-5 rounded-2xl bg-[#F8FCFE] border border-[#D0EBF7] hover:border-amber-400 transition-all space-y-3 relative overflow-hidden group">
            <div className="h-1 bg-gradient-to-r from-yellow-400 via-blue-600 to-red-600 absolute top-0 left-0 right-0" />
            <div className="flex items-center justify-between">
              <span className="text-2xl">🇻🇪</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200 uppercase">
                Hub Suramérica (Principal)
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B1F2D]">Ana Teresa Sandoval</h4>
              <p className="text-xs font-mono text-[#00897B] font-bold">+58 (422) 4612534</p>
              <p className="text-xs font-mono text-[#64748B]">cokito.vzla@gmail.com</p>
            </div>
            <p className="text-[11px] text-[#475569] pt-2 border-t border-[#D0EBF7] leading-relaxed">
              Caracas. Captación regional, coordinación EdTech (Güakytopia) y retail.
            </p>
          </div>

          {/* USA */}
          <div className="p-5 rounded-2xl bg-[#F8FCFE] border border-[#D0EBF7] hover:border-red-400 transition-all space-y-3 relative overflow-hidden group">
            <div className="h-1 bg-gradient-to-r from-red-600 via-white to-blue-800 absolute top-0 left-0 right-0" />
            <div className="flex items-center justify-between">
              <span className="text-2xl">🇺🇸</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 uppercase">
                Hub Norteamérica
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0B1F2D]">Antonio Fuentes</h4>
              <p className="text-xs font-mono text-[#009bb3] font-bold">+1 (424) 3462359</p>
              <p className="text-xs font-mono text-[#64748B]">cokito.int@gmail.com</p>
            </div>
            <p className="text-[11px] text-[#475569] pt-2 border-t border-[#D0EBF7] leading-relaxed">
              Los Ángeles / Remoto. Expansión internacional, SportsTech y automatización.
            </p>
          </div>
        </div>
      </div>

      {/* Authorized Staff & Roles */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#D0EBF7] space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#D0EBF7]">
          <div className="flex items-center gap-2 text-[#00897B]">
            <Users className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#0B1F2D]">
              Equipo Técnico & Roles Autorizados
            </h3>
          </div>
          <span className="text-xs font-mono text-[#009bb3] font-bold bg-[#EAF6FD] px-2.5 py-1 rounded-full border border-[#BCE4F7]">
            {users.length} Cuentas Activas
          </span>
        </div>

        <div className="divide-y divide-[#D0EBF7]">
          {users.map((u) => (
            <div key={u.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[#0B1F2D] block">{u.name}</span>
                <span className="text-xs font-mono text-[#64748B]">{u.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono border uppercase bg-[#EAF6FD] text-[#009bb3] border-[#BCE4F7] font-semibold">
                  {u.role}
                </span>
                <span className="text-xs font-mono text-emerald-600 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Activo
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Database & Persistence Info */}
      <div className="p-6 rounded-2xl bg-white border border-[#D0EBF7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-[#009bb3] mb-1">
            <Database className="w-4 h-4" />
            <h4 className="text-sm font-bold text-[#0B1F2D] font-mono">
              Persistencia de Datos del Servidor
            </h4>
          </div>
          <p className="text-xs text-[#64748B] font-mono">
            Ruta física: <code className="bg-[#EAF6FD] text-[#009bb3] px-1.5 py-0.5 rounded">data/cokitos_lab_db.json</code> · Escribe atómicamente en disco en cada acción.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#EAF6FD] border border-[#BCE4F7] text-xs font-mono text-[#009bb3] font-bold transition-colors cursor-pointer shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Descargar Copia CSV</span>
        </button>
      </div>

    </div>
  );
};
