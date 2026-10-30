import React, { useState, useEffect } from 'react';
import { LabSettings, User } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { 
  Building2, 
  Users, 
  Database, 
  CheckCircle2, 
  Save, 
  Key, 
  ShieldCheck, 
  Download,
  Terminal,
  RefreshCw
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
    <div className="max-w-4xl space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#F5FBFF] tracking-tight">
          Configuración del Laboratorio & Control Center
        </h2>
        <p className="text-xs font-mono text-[#F5FBFF]/60 mt-0.5">
          Parámetros globales de Cokito's Lab, datos de contacto público y control de acceso
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-lg bg-[#00E3B2]/15 border border-[#00E3B2]/40 text-[#00E3B2] text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configuración guardada exitosamente en la base de datos persistente.</span>
        </div>
      )}

      {/* Lab Profile Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-[#081722] border border-[#16364d] space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#143247] text-[#00D9F5]">
          <Building2 className="w-5 h-5" />
          <h3 className="text-base font-bold text-[#F5FBFF]">
            Identidad Institucional del Laboratorio
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1.5">
              Nombre de la Marca
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-3 py-2 rounded bg-[#0B1F2D] border border-[#16364d] text-xs text-[#F5FBFF] outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1.5">
              Eslogan Comercial
            </label>
            <input
              type="text"
              value={settings.slogan}
              onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
              className="w-full px-3 py-2 rounded bg-[#0B1F2D] border border-[#16364d] text-xs text-[#F5FBFF] outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1.5">
            Descriptor de la Marca
          </label>
          <input
            type="text"
            value={settings.descriptor}
            onChange={(e) => setSettings({ ...settings, descriptor: e.target.value })}
            className="w-full px-3 py-2 rounded bg-[#0B1F2D] border border-[#16364d] text-xs text-[#F5FBFF] outline-none font-mono"
          />
        </div>

        <div>
          <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1.5">
            Filosofía Institucional
          </label>
          <textarea
            rows={2}
            value={settings.philosophy}
            onChange={(e) => setSettings({ ...settings, philosophy: e.target.value })}
            className="w-full px-3 py-2 rounded bg-[#0B1F2D] border border-[#16364d] text-xs text-[#F5FBFF] outline-none font-sans"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-[#143247]">
          <div>
            <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1.5">
              Email Público de Contacto
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-3 py-2 rounded bg-[#0B1F2D] border border-[#16364d] text-xs text-[#F5FBFF] outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1.5">
              Teléfono de Contacto
            </label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="w-full px-3 py-2 rounded bg-[#0B1F2D] border border-[#16364d] text-xs text-[#F5FBFF] outline-none font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs font-mono transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </form>

      {/* Hubs Globales de Cokito's Lab */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#081722] border border-[#16364d] space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#143247]">
          <div className="flex items-center gap-2 text-[#00D9F5]">
            <Building2 className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#F5FBFF]">
              Hubs Internacionales & Representaciones Regionales
            </h3>
          </div>
          <span className="text-xs font-mono text-[#00E3B2]">
            3 Sedes Operativas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0B1F2D] border border-[#16364d] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg">🇫🇷</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#143247] text-[#00D9F5] uppercase">
                Hub Europa
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F5FBFF]">Morice Mojica</h4>
              <p className="text-xs font-mono text-[#00D9F5]">+33 (77) 4853604</p>
              <p className="text-xs font-mono text-[#F5FBFF]/60">cokito.int@gmail.com</p>
            </div>
            <p className="text-[11px] text-[#F5FBFF]/70 pt-2 border-t border-[#143247]">
              París / Occitania. Operaciones europeas, desarrollo SaaS y LegalTech.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1F2D] border border-[#16364d] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg">🇻🇪</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E3B2]/20 text-[#00E3B2] uppercase font-bold">
                Hub Suramérica (Principal)
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F5FBFF]">Ana Teresa Sandoval</h4>
              <p className="text-xs font-mono text-[#00E3B2]">+58 (422) 4612534</p>
              <p className="text-xs font-mono text-[#F5FBFF]/60">cokito.vzla@gmail.com</p>
            </div>
            <p className="text-[11px] text-[#F5FBFF]/70 pt-2 border-t border-[#143247]">
              Caracas. Captación regional, coordinación EdTech (Güakytopia) y retail.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1F2D] border border-[#16364d] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg">🇺🇸</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#143247] text-[#00D9F5] uppercase">
                Hub Norteamérica
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F5FBFF]">Antonio Fuentes</h4>
              <p className="text-xs font-mono text-[#00D9F5]">+1 (424) 3462359</p>
              <p className="text-xs font-mono text-[#F5FBFF]/60">cokito.int@gmail.com</p>
            </div>
            <p className="text-[11px] text-[#F5FBFF]/70 pt-2 border-t border-[#143247]">
              Los Ángeles / Remoto. Expansión internacional, SportsTech y automatización.
            </p>
          </div>
        </div>
      </div>

      {/* Authorized Staff & Roles */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#081722] border border-[#16364d] space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#143247]">
          <div className="flex items-center gap-2 text-[#00E3B2]">
            <Users className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#F5FBFF]">
              Equipo Técnico & Roles Autorizados
            </h3>
          </div>
          <span className="text-xs font-mono text-[#00D9F5]">
            {users.length} Cuentas Activas
          </span>
        </div>

        <div className="divide-y divide-[#143247]">
          {users.map((u) => (
            <div key={u.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-[#F5FBFF] block">{u.name}</span>
                <span className="text-xs font-mono text-[#F5FBFF]/50">{u.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono border uppercase bg-[#00D9F5]/10 text-[#00D9F5] border-[#00D9F5]/30">
                  {u.role}
                </span>
                <span className="text-xs font-mono text-[#00E3B2] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Activo
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Database & Persistence Info */}
      <div className="p-6 rounded-2xl bg-[#081722] border border-[#16364d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#00D9F5] mb-1">
            <Database className="w-4 h-4" />
            <h4 className="text-sm font-bold text-[#F5FBFF] font-mono">
              Persistencia de Datos del Servidor
            </h4>
          </div>
          <p className="text-xs text-[#F5FBFF]/60 font-mono">
            Ruta física: <code>data/cokitos_lab_db.json</code> · Escribe atómicamente en disco en cada acción.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#0B1F2D] hover:bg-[#143247] border border-[#00D9F5]/30 text-xs font-mono text-[#00D9F5] transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Descargar Copia CSV</span>
        </button>
      </div>

    </div>
  );
};
