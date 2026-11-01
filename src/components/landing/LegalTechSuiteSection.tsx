import React, { useState } from 'react';
import { Language } from '../../lib/i18n.ts';
import { trackSectionNavigation } from '../../lib/analytics.ts';
import { 
  CheckCircle2, 
  Minus, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Scale, 
  Clock, 
  Calendar, 
  FileText, 
  Users, 
  Briefcase, 
  Info,
  Check,
  ChevronRight
} from 'lucide-react';

interface LegalTechSuiteSectionProps {
  currentLang: Language;
}

export const LegalTechSuiteSection: React.FC<LegalTechSuiteSectionProps> = ({ currentLang }) => {
  const [showTable, setShowTable] = useState(true);

  // Comparison matrix data (The 12 features requested)
  const comparisonFeatures = [
    {
      name: currentLang === 'en' ? 'Requests & Contacts Ingestion' : currentLang === 'fr' ? 'Captation des demandes et contacts' : 'Solicitudes y contactos',
      alfa: true,
      beta: true,
      omega: true,
      note: currentLang === 'en' ? 'Digital intake forms' : currentLang === 'fr' ? 'Formulaires d\'accueil' : 'Formularios y captación digital',
    },
    {
      name: currentLang === 'en' ? 'Commercial Pipeline & Follow-up' : currentLang === 'fr' ? 'Suivi commercial et relances' : 'Seguimiento comercial',
      alfa: true,
      beta: true,
      omega: true,
      note: currentLang === 'en' ? 'Lead stages & status' : currentLang === 'fr' ? 'Étapes de prospection' : 'Etapas del prospecto',
    },
    {
      name: currentLang === 'en' ? 'Organized Client Directory' : currentLang === 'fr' ? 'Répertoire organisé' : 'Directorio organizado',
      alfa: false,
      beta: true,
      omega: true,
      note: currentLang === 'en' ? 'Contact history & records' : currentLang === 'fr' ? 'Fiches clients' : 'Fichas estructuradas de clientes',
    },
    {
      name: currentLang === 'en' ? 'Calendar & Team Meetings' : currentLang === 'fr' ? 'Agenda et réunions d\'équipe' : 'Agenda y reuniones',
      alfa: false,
      beta: true,
      omega: true,
      note: currentLang === 'en' ? 'Schedule coordination' : currentLang === 'fr' ? 'Coordination d\'agenda' : 'Coordinación diaria de citas',
    },
    {
      name: currentLang === 'en' ? 'Legal Procedures Management' : currentLang === 'fr' ? 'Gestion des démarches juridiques' : 'Gestión de trámites',
      alfa: false,
      beta: 'essential', // Essential
      omega: 'complete', // Complete by stages
      note: currentLang === 'en' ? 'Essential in Beta / Full stages in Omega' : currentLang === 'fr' ? 'Essentiel en Beta / Complet en Omega' : 'Esencial en Beta / Completo por etapas en Omega',
    },
    {
      name: currentLang === 'en' ? 'Lawyer & Case Assignment' : currentLang === 'fr' ? 'Attribution des avocats' : 'Asignación de abogados',
      alfa: false,
      beta: true,
      omega: true,
      note: currentLang === 'en' ? 'Assign cases to legal staff' : currentLang === 'fr' ? 'Délégation de dossiers' : 'Designación de responsable por trámite',
    },
    {
      name: currentLang === 'en' ? 'Tasks, Deadlines & Supervision' : currentLang === 'fr' ? 'Tâches, délais et supervision' : 'Tareas y responsables',
      alfa: false,
      beta: 'basic',
      omega: 'supervised',
      note: currentLang === 'en' ? 'Supervised workflows in Omega' : currentLang === 'fr' ? 'Supervision complète en Omega' : 'Supervisión y control en Omega',
    },
    {
      name: currentLang === 'en' ? 'Digital Client Case Files' : currentLang === 'fr' ? 'Dossier numérique par client' : 'Expedientes digitales',
      alfa: false,
      beta: false,
      omega: true,
      note: currentLang === 'en' ? 'Unified digital repository' : currentLang === 'fr' ? 'Dossier juridique complet' : 'Historial integral de cada cliente',
    },
    {
      name: currentLang === 'en' ? 'Documents & Proofs Repository' : currentLang === 'fr' ? 'Documents et pièces justificatives' : 'Documentos y recaudos',
      alfa: false,
      beta: false,
      omega: true,
      note: currentLang === 'en' ? 'Files & compliance attachment' : currentLang === 'fr' ? 'Pièces jointes et archivage' : 'Gestión documental y recaudos',
    },
    {
      name: currentLang === 'en' ? 'Fee Quotes & Acceptance' : currentLang === 'fr' ? 'Devis et acceptation des services' : 'Presupuestos y propuestas',
      alfa: false,
      beta: false,
      omega: true,
      note: currentLang === 'en' ? 'Formal proposal generation' : currentLang === 'fr' ? 'Génération de devis' : 'Generación y aceptación de honorarios',
    },
    {
      name: currentLang === 'en' ? 'Multi-Role Access & Permissions' : currentLang === 'fr' ? 'Rôles et permissions avancées' : 'Roles y permisos',
      alfa: false,
      beta: false,
      omega: true,
      note: currentLang === 'en' ? 'Partner, associate, assistant' : currentLang === 'fr' ? 'Niveaux d\'accès stricts' : 'Control por nivel de usuario',
    },
    {
      name: currentLang === 'en' ? 'Full Operational Supervision' : currentLang === 'fr' ? 'Supervision opérationnelle globale' : 'Supervisión integral',
      alfa: false,
      beta: false,
      omega: true,
      note: currentLang === 'en' ? 'Audit log & full command' : currentLang === 'fr' ? 'Traçabilité et audit' : 'Trazabilidad y panel de control total',
    },
  ];

  return (
    <div className="mb-14 space-y-10">
      
      {/* LegalTech CRM Suite Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B1F2D] via-[#102A3D] to-[#081824] text-white border border-[#00D9F5]/40 shadow-xl overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D9F5]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D9F5]/15 border border-[#00D9F5]/40 text-[#00D9F5] text-xs font-mono font-bold tracking-wide uppercase">
            <Scale className="w-3.5 h-3.5 text-[#00E3B2]" />
            <span>Arquitectura Comercial LegalTech · Cokito’s Lab</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F5FBFF] leading-tight">
            LegalTech CRM Suite
          </h3>

          <p className="text-sm sm:text-base text-[#D0EBF7] leading-relaxed max-w-3xl">
            Una familia de soluciones escalables para organizar la operación de despachos jurídicos, desde la captación inicial hasta la gestión integral de expedientes.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-[#00E3B2]">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#00D9F5]" />
              <span>Diseñado para problemas operativos reales</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#00D9F5]" />
              <span>Puntos de partida configurables a medida</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#00D9F5]" />
              <span>Desarrollado por Cokito’s Lab International</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3 Related Cards: ALFA, BETA, OMEGA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* 1. ALFA — GESTIÓN ESENCIAL */}
        <div className="rounded-2xl bg-white border border-[#CDE9F7] hover:border-[#3B82F6] transition-all duration-300 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#3B82F6]" />
          
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-[#3B82F6] uppercase tracking-wider">
                Nivel 1 · Esencial
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-extrabold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                ALFA 1.0
              </span>
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-[#0B1F2D] group-hover:text-[#3B82F6] transition-colors">
                ALFA — Gestión esencial
              </h4>
              <p className="text-xs font-mono text-[#00897B] font-semibold mt-0.5">
                Para abogados independientes y pequeños despachos
              </p>
            </div>

            <p className="text-xs text-[#1E3A52] leading-relaxed">
              Organiza el primer contacto, los datos del cliente y el seguimiento comercial en un entorno sencillo y accesible.
            </p>

            {/* Scope Included List */}
            <div className="p-3.5 rounded-xl bg-[#F8FCFE] border border-[#DCEFF9] space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#0B1F2D] uppercase tracking-wider block">
                Alcance operativo incluido:
              </span>
              <ul className="space-y-1.5 text-xs text-[#1E3A52]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
                  <span>Captación de solicitudes jurídicas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
                  <span>Registro organizado de contactos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
                  <span>Seguimiento comercial inicial</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
                  <span>Organización básica de oportunidades</span>
                </li>
              </ul>
            </div>

            {/* IMPORTANT DISCLAIMER: CASO BINLEGAL */}
            <div className="p-3.5 rounded-xl bg-[#FEF9C3]/50 border border-[#FDE047] text-xs text-[#854D0E] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-4 h-4 text-[#CA8A04] shrink-0" />
                <span>Caso BinLegal — Implementación personalizada</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#713F12]">
                Caso real desarrollado a medida para <strong>José Rafael Vásquez</strong> basado en el alcance esencial de Alfa. Sus datos, identidad y enlace pertenecen a ese cliente; no debe utilizarse su nombre para representar a Beta u Omega.
              </p>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-[#EAF6FD] space-y-2">
            <a
              href="https://bin-legal-beta-2-0.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSectionNavigation('https://bin-legal-beta-2-0.vercel.app', 'demo_alfa_binlegal')}
              className="w-full py-2.5 px-4 rounded-lg bg-[#0B1F2D] hover:bg-[#1E3A8A] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <span>Explorar Caso BinLegal (Alfa)</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#00D9F5]" />
            </a>
            <button
              onClick={() => {
                trackSectionNavigation('/contacto', 'quote_request_alfa_binlegal');
                const el = document.getElementById('contacto');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#EAF6FD] hover:bg-[#00D9F5] text-[#007b8f] hover:text-[#0B1F2D] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all border border-[#BCE4F7] cursor-pointer"
            >
              <span>Solicitar una cotización similar a esto</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-[#64748B] block text-center">
              Despliegue verificado en Vercel
            </span>
          </div>
        </div>

        {/* 2. BETA — OPERACIÓN COORDINADA */}
        <div className="rounded-2xl bg-white border border-[#CDE9F7] hover:border-[#00D9F5] transition-all duration-300 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#00D9F5]" />
          
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-[#009bb3] uppercase tracking-wider">
                Nivel 2 · Coordinación
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-extrabold bg-[#00D9F5]/10 text-[#009bb3] border border-[#00D9F5]/30">
                BETA 2.0
              </span>
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-[#0B1F2D] group-hover:text-[#009bb3] transition-colors">
                BETA — Operación coordinada
              </h4>
              <p className="text-xs font-mono text-[#00897B] font-semibold mt-0.5">
                Para pequeños equipos jurídicos
              </p>
            </div>

            <p className="text-xs text-[#1E3A52] leading-relaxed">
              Conecta la captación de clientes con la agenda y la coordinación diaria de los trámites del despacho.
            </p>

            {/* Scope Included List */}
            <div className="p-3.5 rounded-xl bg-[#F8FCFE] border border-[#DCEFF9] space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#0B1F2D] uppercase tracking-wider block">
                Todo lo de Alfa, más:
              </span>
              <ul className="space-y-1.5 text-xs text-[#1E3A52]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00D9F5] shrink-0 mt-0.5" />
                  <span>Agenda centralizada y reuniones</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00D9F5] shrink-0 mt-0.5" />
                  <span>Directorio organizado de expedientes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00D9F5] shrink-0 mt-0.5" />
                  <span>Gestión esencial de trámites</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00D9F5] shrink-0 mt-0.5" />
                  <span>Asignación de abogados por caso</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00D9F5] shrink-0 mt-0.5" />
                  <span>Tareas y seguimiento operativo básico</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00E3B2] shrink-0 mt-0.5" />
                  <span>Experiencia multilingüe internacional</span>
                </li>
              </ul>
            </div>

            {/* IMPORTANT DISCLAIMER: JURISNOVA */}
            <div className="p-3.5 rounded-xl bg-[#E0F8FF] border border-[#BCE4F7] text-xs text-[#006064] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-4 h-4 text-[#00897B] shrink-0" />
                <span>Demostrador Comercial Beta</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#006064]">
                El producto oficial es <strong>LegalTech CRM Suite — Beta</strong>. <em>JurisNova</em> es una firma ficticia utilizada para demostrar cómo puede personalizarse la plataforma para un despacho cliente.
              </p>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-[#EAF6FD] space-y-2">
            <a
              href="https://cl-demo-legal-crm-beta-2-0.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSectionNavigation('https://cl-demo-legal-crm-beta-2-0.vercel.app', 'demo_beta_jurisnova')}
              className="w-full py-2.5 px-4 rounded-lg bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <span>Explorar Demo Beta (JurisNova)</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#0B1F2D]" />
            </a>
            <button
              onClick={() => {
                trackSectionNavigation('/contacto', 'quote_request_beta_jurisnova');
                const el = document.getElementById('contacto');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#E0F8FF] hover:bg-[#00E3B2] text-[#006064] hover:text-[#0B1F2D] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all border border-[#00D9F5]/40 cursor-pointer"
            >
              <span>Solicitar una cotización similar a esto</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-[#64748B] block text-center">
              Demostrador multilingüe interactivo
            </span>
          </div>
        </div>

        {/* 3. OMEGA — GESTIÓN JURÍDICA INTEGRAL (FLAGSHIP HIGHLIGHTED) */}
        <div className="rounded-2xl bg-gradient-to-b from-[#FAF5FF] via-white to-[#F5FAFF] border-2 border-[#8B5CF6] hover:border-[#7C3AED] transition-all duration-300 p-6 flex flex-col justify-between shadow-md hover:shadow-2xl relative overflow-hidden group">
          {/* Top Rainbow Accent & Glow */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8B5CF6] via-[#00D9F5] to-[#00E3B2]" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#8B5CF6]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4">
            {/* Header: Flagship badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-extrabold text-[#7C3AED] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Solución Integral · Flagship</span>
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-black bg-[#7C3AED] text-white shadow-xs">
                OMEGA 1.0
              </span>
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-[#0B1F2D] group-hover:text-[#7C3AED] transition-colors">
                OMEGA — Gestión jurídica integral
              </h4>
              <p className="text-xs font-mono text-[#7C3AED] font-semibold mt-0.5">
                Demostrador comercial para firmas jurídicas · Cokito’s Lab
              </p>
            </div>

            <p className="text-xs text-[#1E3A52] leading-relaxed font-medium">
              Centraliza solicitudes, clientes, trámites, tareas, responsables, expedientes, documentos, presupuestos y seguimiento operativo en un solo entorno.
            </p>

            {/* Scope Included List */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E9D5FF] space-y-2 shadow-2xs">
              <span className="text-[11px] font-mono font-bold text-[#7C3AED] uppercase tracking-wider block">
                Todo lo de Beta, más control exhaustivo:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#1E3A52]">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <span className="text-[11px]">Solicitudes separadas de trámites</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <span className="text-[11px]">Gestión por etapas de trámite</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <span className="text-[11px]">Tareas, responsables y supervisión</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <span className="text-[11px]">Expediente digital por cliente</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <span className="text-[11px]">Documentos y recaudos</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <span className="text-[11px]">Presupuestos y aceptación</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <span className="text-[11px]">Roles y permisos avanzados</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0 mt-0.5" />
                  <span className="text-[11px]">Agenda y vencimientos</span>
                </li>
              </ul>
            </div>

            {/* Omega Real Milestones Status */}
            <div className="p-3 rounded-xl bg-[#F3E8FF]/60 border border-[#D8B4FE] text-xs space-y-1.5">
              <span className="font-mono text-[10px] uppercase font-bold text-[#6B21A8] block">
                Hitos de Desarrollo de Omega:
              </span>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[#1E3A52]">
                  <span>Captación y seguimiento de solicitudes</span>
                  <span className="text-[#15803D] font-bold">✓ Listo</span>
                </div>
                <div className="flex items-center justify-between text-[#1E3A52]">
                  <span>Gestión de trámites, etapas y responsables</span>
                  <span className="text-[#15803D] font-bold">✓ Listo</span>
                </div>
                <div className="flex items-center justify-between text-[#1E3A52]">
                  <span>Tareas, agenda y coordinación del equipo</span>
                  <span className="text-[#8B5CF6] font-bold">● En progreso</span>
                </div>
                <div className="flex items-center justify-between text-[#1E3A52]">
                  <span>Expedientes digitales, documentos y permisos</span>
                  <span className="text-[#8B5CF6] font-bold">● En progreso</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-[#E9D5FF] space-y-2">
            <a
              href="https://cl-demo-legal-crm-omega-1-0.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSectionNavigation('https://cl-demo-legal-crm-omega-1-0.vercel.app', 'demo_omega_flagship')}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-lg"
            >
              <span>Explorar Demo Omega 1.0 (Flagship)</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#00D9F5]" />
            </a>
            <button
              onClick={() => {
                trackSectionNavigation('/contacto', 'quote_request_omega_flagship');
                const el = document.getElementById('contacto');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#FAF5FF] hover:bg-[#8B5CF6] text-[#7C3AED] hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all border border-[#DDD6FE] cursor-pointer"
            >
              <span>Solicitar una cotización similar a esto</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-[#7C3AED] block text-center font-semibold">
              En desarrollo / Demo funcional activo
            </span>
          </div>
        </div>

      </div>

      {/* COMPARADOR RESUMIDO ALFA / BETA / OMEGA (Interactive SaaS Matrix) */}
      <div className="rounded-3xl bg-white border border-[#CDE9F7] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0F2FE]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#009bb3] uppercase tracking-wider font-bold mb-1">
              <Layers className="w-3.5 h-3.5 text-[#00897B]" />
              <span>Matriz Comparativa de Capacidades</span>
            </div>
            <h4 className="text-xl font-extrabold text-[#0B1F2D] tracking-tight">
              Comparador Resumido: Alfa · Beta · Omega
            </h4>
            <p className="text-xs text-[#64748B] mt-0.5">
              Puntos de partida configurables según las necesidades de cada cliente. Sin tarifas fijas ni ataduras; desarrollo a medida por Cokito’s Lab.
            </p>
          </div>

          <button
            onClick={() => setShowTable(!showTable)}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-[#EAF6FD] hover:bg-[#D0EBF7] text-[#009bb3] text-xs font-mono font-bold transition-colors cursor-pointer border border-[#BCE4F7]"
          >
            {showTable ? 'Ocultar Comparador' : 'Mostrar Comparador'}
          </button>
        </div>

        {showTable && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-[#CCE8F6] text-[#0B1F2D] font-mono">
                  <th className="py-3 px-4 font-extrabold w-2/5">
                    Capacidad Operativa Jurídica
                  </th>
                  <th className="py-3 px-3 text-center font-bold text-[#3B82F6] w-1/5 bg-[#F8FCFE] rounded-t-lg">
                    ALFA
                    <span className="block text-[10px] text-[#64748B] font-normal">Gestión Esencial</span>
                  </th>
                  <th className="py-3 px-3 text-center font-bold text-[#009bb3] w-1/5 bg-[#F0FBFF] rounded-t-lg">
                    BETA
                    <span className="block text-[10px] text-[#64748B] font-normal">Operación Coordinada</span>
                  </th>
                  <th className="py-3 px-3 text-center font-extrabold text-[#7C3AED] w-1/5 bg-[#FAF5FF] border-t-2 border-x-2 border-[#8B5CF6] rounded-t-lg shadow-xs">
                    OMEGA 1.0
                    <span className="block text-[10px] text-[#7C3AED] font-bold">Solución Integral</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF6FD] font-sans">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FCFE] transition-colors">
                    <td className="py-3 px-4 text-[#0B1F2D] font-medium">
                      <div>{row.name}</div>
                      <div className="text-[10px] font-mono text-[#64748B]">{row.note}</div>
                    </td>

                    {/* ALFA */}
                    <td className="py-3 px-3 text-center bg-[#F8FCFE]/60">
                      {row.alfa === true ? (
                        <CheckCircle2 className="w-4 h-4 text-[#3B82F6] mx-auto" />
                      ) : (
                        <Minus className="w-4 h-4 text-[#CBD5E1] mx-auto" />
                      )}
                    </td>

                    {/* BETA */}
                    <td className="py-3 px-3 text-center bg-[#F0FBFF]/60 font-mono text-[11px]">
                      {row.beta === true ? (
                        <CheckCircle2 className="w-4 h-4 text-[#009bb3] mx-auto" />
                      ) : row.beta === 'essential' ? (
                        <span className="px-2 py-0.5 rounded bg-[#00D9F5]/20 text-[#009bb3] font-bold">Esencial</span>
                      ) : row.beta === 'basic' ? (
                        <span className="px-2 py-0.5 rounded bg-[#00D9F5]/20 text-[#009bb3] font-bold">Básico</span>
                      ) : (
                        <Minus className="w-4 h-4 text-[#CBD5E1] mx-auto" />
                      )}
                    </td>

                    {/* OMEGA (Flagship highlight) */}
                    <td className="py-3 px-3 text-center bg-[#FAF5FF] border-x-2 border-[#8B5CF6]/40 font-mono text-[11px] font-bold text-[#7C3AED]">
                      {row.omega === true ? (
                        <CheckCircle2 className="w-4 h-4 text-[#7C3AED] mx-auto" />
                      ) : row.omega === 'complete' ? (
                        <span className="px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#7C3AED] font-extrabold">Por etapas</span>
                      ) : row.omega === 'supervised' ? (
                        <span className="px-2 py-0.5 rounded bg-[#8B5CF6]/20 text-[#7C3AED] font-extrabold">Supervisado</span>
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#7C3AED] mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
