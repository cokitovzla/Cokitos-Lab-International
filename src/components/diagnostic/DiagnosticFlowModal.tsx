import React, { useState, useEffect, useRef } from 'react';
import { ProjectType, LeadDiagnostic, DiagnosticAnswer } from '../../types/index.ts';
import { 
  GENERAL_QUESTIONS, 
  SPECIALIZED_MODULE_QUESTIONS, 
  MODULE_METAS, 
  DiagnosticQuestion,
  DiagnosticOption 
} from './diagnosticConfig.ts';
import { api } from '../../lib/api.ts';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Save, 
  CloudCheck, 
  Loader2, 
  Copy, 
  Check, 
  MessageCircle, 
  Bookmark, 
  HelpCircle, 
  Sparkles, 
  AlertCircle,
  Plus,
  Send,
  Building,
  Code2,
  Users,
  Zap,
  Cpu,
  Compass,
  Globe,
  Lightbulb
} from 'lucide-react';

interface DiagnosticFlowModalProps {
  isOpen: boolean;
  referenceCode: string;
  leadId?: string;
  leadName?: string;
  leadEmail?: string;
  leadPhone?: string;
  initialSelectedAreas?: ProjectType[];
  recoveryToken?: string;
  onClose: () => void;
  onCompleted?: (diagnostic: LeadDiagnostic) => void;
}

const MODULE_ICONS: Record<string, React.ElementType> = {
  Building,
  Code2,
  Users,
  Zap,
  Cpu,
  Compass,
  Globe,
  Lightbulb,
};

export const DiagnosticFlowModal: React.FC<DiagnosticFlowModalProps> = ({
  isOpen,
  referenceCode,
  leadId,
  leadName,
  leadEmail,
  leadPhone,
  initialSelectedAreas = ['software'],
  recoveryToken,
  onClose,
  onCompleted,
}) => {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAreas, setSelectedAreas] = useState<ProjectType[]>(initialSelectedAreas);
  const [answers, setAnswers] = useState<Record<string, DiagnosticAnswer>>({});
  const [showExitModal, setShowExitModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-save debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Steps structure:
  // Step 0: General diagnostic
  // Step 1..N: Each selected specialized module
  // Step N+1: Review & Submit
  const steps: { id: 'general' | ProjectType | 'review'; title: string; subtitle: string; icon: string }[] = [
    {
      id: 'general',
      title: 'Diagnóstico General de Negocio',
      subtitle: 'Comprender tu actividad, situación actual y metas primarias',
      icon: 'Building',
    },
    ...selectedAreas.map((area) => {
      const meta = MODULE_METAS[area];
      return {
        id: area,
        title: meta.name,
        subtitle: meta.description,
        icon: meta.iconName,
      };
    }),
    {
      id: 'review',
      title: 'Resumen & Finalización',
      subtitle: 'Revisión final de requerimientos para el laboratorio',
      icon: 'Sparkles',
    },
  ];

  const currentStep = steps[currentStepIndex] || steps[0];
  const totalSteps = steps.length;
  const progressPercentage = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  // Fetch initial diagnostic data from backend
  useEffect(() => {
    let isMounted = true;
    const fetchDiag = async () => {
      try {
        setLoading(true);
        const res = await api.getPublicDiagnostic(referenceCode);
        if (isMounted && res.diagnostic) {
          if (res.diagnostic.answers) {
            setAnswers(res.diagnostic.answers);
          }
          if (res.diagnostic.selectedAreas && res.diagnostic.selectedAreas.length > 0) {
            setSelectedAreas(res.diagnostic.selectedAreas);
          }
          if (typeof res.diagnostic.currentStep === 'number' && res.diagnostic.currentStep < totalSteps) {
            setCurrentStepIndex(res.diagnostic.currentStep);
          }
          if (res.diagnostic.status === 'completado') {
            setCompleted(true);
          }
        }
      } catch (e) {
        console.warn('Could not load existing diagnostic, starting fresh session:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDiag();
    return () => {
      isMounted = false;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [referenceCode]);

  // Debounced auto-save to backend
  const triggerAutoSave = (
    newAnswers = answers, 
    newStep = currentStepIndex, 
    newAreas = selectedAreas
  ) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    setSaving(true);
    setSaveSuccess(false);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const pct = Math.round(((newStep + 1) / (1 + newAreas.length + 1)) * 100);
        await api.savePublicDiagnostic(referenceCode, {
          answers: newAnswers,
          currentStep: newStep,
          totalSteps: 1 + newAreas.length + 1,
          progressPercentage: pct,
          selectedAreas: newAreas,
        });
        setSaveSuccess(true);
      } catch (err) {
        console.error('Error auto-saving diagnostic:', err);
      } finally {
        setSaving(false);
      }
    }, 600);
  };

  const handleAnswerChange = (
    question: DiagnosticQuestion, 
    value: any, 
    displayValue: string
  ) => {
    const newAnswers: Record<string, DiagnosticAnswer> = {
      ...answers,
      [question.id]: {
        questionId: question.id,
        questionLabel: question.label,
        module: question.module,
        value,
        displayValue,
      },
    };
    setAnswers(newAnswers);
    triggerAutoSave(newAnswers, currentStepIndex, selectedAreas);
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      triggerAutoSave(answers, nextIndex, selectedAreas);
      // Scroll to top of modal container
      const container = document.getElementById('diag-content-scroll');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      triggerAutoSave(answers, prevIndex, selectedAreas);
      const container = document.getElementById('diag-content-scroll');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddModule = (area: ProjectType) => {
    if (!selectedAreas.includes(area)) {
      const updated = [...selectedAreas, area];
      setSelectedAreas(updated);
      triggerAutoSave(answers, currentStepIndex, updated);
    }
  };

  const handleRemoveModule = (area: ProjectType) => {
    if (selectedAreas.length <= 1) return; // Keep at least one area
    const updated = selectedAreas.filter(a => a !== area);
    setSelectedAreas(updated);
    if (currentStep.id === area) {
      setCurrentStepIndex(0);
    }
    triggerAutoSave(answers, currentStepIndex, updated);
  };

  const handleCompleteDiagnostic = async () => {
    try {
      setCompleting(true);
      setErrorMsg(null);
      const res = await api.completePublicDiagnostic(referenceCode);
      setCompleted(true);
      if (onCompleted && res.diagnostic) {
        onCompleted(res.diagnostic);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'No fue posible completar el diagnóstico. Por favor reintenta.');
    } finally {
      setCompleting(false);
    }
  };

  const getRecoveryUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/#recuperar?ref=${encodeURIComponent(referenceCode)}${recoveryToken ? `&token=${encodeURIComponent(recoveryToken)}` : ''}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getRecoveryUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referenceCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handleSendWhatsAppReminder = () => {
    const phone = leadPhone?.replace(/\D/g, '') || '';
    const text = encodeURIComponent(
      `Hola equipo de Cokito's Lab, tengo iniciada la solicitud ${referenceCode} a nombre de ${leadName || 'mi persona'}. Este es mi enlace para consultar y continuar el diagnóstico: ${getRecoveryUrl()}`
    );
    window.open(`https://wa.me/584242636400?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0B1F2D]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#BCE4F7] flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-[#E0F2FE] bg-[#F8FCFE] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#00D9F5]/10 border border-[#00D9F5]/30 text-xs font-mono font-bold text-[#0B1F2D]">
              <span className="w-2 h-2 rounded-full bg-[#00D9F5] animate-pulse" />
              <span>{referenceCode}</span>
            </span>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#64748B]">
              <span>|</span>
              <span>Paso {currentStepIndex + 1} de {totalSteps}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-save indicator */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              {saving ? (
                <span className="inline-flex items-center gap-1 text-[#009bb3]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Guardando...</span>
                </span>
              ) : saveSuccess ? (
                <span className="inline-flex items-center gap-1 text-[#00897B] font-medium">
                  <CloudCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Guardado en la nube</span>
                </span>
              ) : null}
            </div>

            <button
              onClick={() => setShowExitModal(true)}
              className="text-xs font-mono px-3 py-1.5 rounded-md bg-[#EAF6FD] hover:bg-[#D5EBF9] text-[#1E3A52] font-semibold transition-all border border-[#CDE9F7] cursor-pointer"
            >
              Guardar y Salir
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-[#E0F2FE] h-1.5 relative overflow-hidden">
          <div 
            className="bg-linear-to-r from-[#00D9F5] to-[#00E3B2] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Modal Scrollable Body */}
        <div id="diag-content-scroll" className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#00D9F5] animate-spin mx-auto" />
              <p className="text-sm font-mono text-[#1E3A52]">Cargando sesión de diagnóstico inteligente...</p>
            </div>
          ) : completed ? (
            /* Completed Screen */
            <div className="py-10 text-center max-w-xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#00E3B2]/15 border-2 border-[#00E3B2] flex items-center justify-center mx-auto text-[#00897B]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="font-mono text-xs text-[#00897B] font-bold uppercase tracking-wider block">
                Diagnóstico Completado con Éxito
              </span>
              <h2 className="text-2xl font-extrabold text-[#0B1F2D]">
                ¡Gracias por detallar tu proyecto, {leadName || 'Estimado Cliente'}!
              </h2>
              <p className="text-sm text-[#1E3A52] leading-relaxed">
                Toda la información ha sido sincronizada directamente con el equipo de ingeniería y dirección comercial de Cokito's Lab bajo la referencia <strong className="font-mono text-[#009bb3]">{referenceCode}</strong>.
              </p>

              <div className="p-4 rounded-xl bg-[#F0F9FF] border border-[#BCE4F7] text-left text-xs font-mono space-y-2 text-[#1E3A52]">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Referencia comercial:</span>
                  <strong className="text-[#0B1F2D]">{referenceCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Áreas analizadas:</span>
                  <span className="text-[#0B1F2D] font-bold">{selectedAreas.map(a => MODULE_METAS[a]?.name).join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Próximo paso:</span>
                  <span className="text-[#00897B] font-bold">Evaluación por el Director Cokito & emisión de propuesta</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleSendWhatsAppReminder}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs font-mono transition-all shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notificar al Director por WhatsApp</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-[#EAF6FD] hover:bg-[#D5EBF9] text-xs font-mono text-[#0B1F2D] font-bold border border-[#BCE4F7] transition-all cursor-pointer"
                >
                  Cerrar Ventana
                </button>
              </div>
            </div>
          ) : currentStep.id === 'review' ? (
            /* Review & Final Submit Step */
            <div className="space-y-6">
              <div className="border-b border-[#E0F2FE] pb-4">
                <span className="text-xs font-mono text-[#00897B] font-bold uppercase tracking-wider block mb-1">
                  Paso Final de Verificación
                </span>
                <h3 className="text-xl font-extrabold text-[#0B1F2D]">
                  Resumen de tu Diagnóstico Comercial
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Revisa los módulos completados. Puedes regresar a editar cualquier respuesta antes de enviar.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Answers breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* General answers box */}
                <div className="p-4 rounded-xl bg-[#F8FCFE] border border-[#BCE4F7] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0B1F2D] border-b border-[#E0F2FE] pb-2">
                    <Building className="w-4 h-4 text-[#009bb3]" />
                    <span>Diagnóstico General ({GENERAL_QUESTIONS.filter(q => !!answers[q.id]).length} respondidas)</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {GENERAL_QUESTIONS.slice(0, 5).map(q => (
                      <div key={q.id}>
                        <span className="text-[11px] text-[#64748B] block font-mono">{q.label}</span>
                        <span className="text-[#0B1F2D] font-medium">
                          {answers[q.id]?.displayValue || <em className="text-slate-400">Por definir</em>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialized modules box */}
                <div className="p-4 rounded-xl bg-[#F8FCFE] border border-[#BCE4F7] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0B1F2D] border-b border-[#E0F2FE] pb-2">
                    <Sparkles className="w-4 h-4 text-[#00E3B2]" />
                    <span>Módulos Especializados Seleccionados ({selectedAreas.length})</span>
                  </div>
                  <div className="space-y-2.5">
                    {selectedAreas.map(area => {
                      const meta = MODULE_METAS[area];
                      const qCount = SPECIALIZED_MODULE_QUESTIONS[area]?.filter(q => !!answers[q.id])?.length || 0;
                      return (
                        <div key={area} className="p-2.5 rounded-lg bg-white border border-[#E0F2FE] flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-[#0B1F2D] block">{meta.name}</span>
                            <span className="text-[10px] font-mono text-[#64748B]">{qCount} preguntas respondidas</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#E0F8FF] text-[#00897B] font-bold">
                            Activo
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="p-5 rounded-xl bg-linear-to-r from-[#E0F8FF] to-[#E8FBF7] border border-[#00E3B2] text-center space-y-3">
                <h4 className="text-base font-extrabold text-[#0B1F2D]">
                  ¿Listo para enviar tu diagnóstico al laboratorio?
                </h4>
                <p className="text-xs text-[#1E3A52] max-w-md mx-auto">
                  Al confirmar, nuestro equipo técnico generará el desglose inicial de arquitectura y alcance en el CRM.
                </p>
                <button
                  onClick={handleCompleteDiagnostic}
                  disabled={completing}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-mono font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {completing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Procesando y Sincronizando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#0B1F2D]" />
                      <span>Completar y Enviar Diagnóstico Oficial</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Standard Question Steps */
            <div className="space-y-6">
              
              {/* Step Header */}
              <div className="border-b border-[#E0F2FE] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-[#009bb3] uppercase tracking-wider mb-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00b38c]" />
                    <span>{currentStep.id === 'general' ? 'Módulo Base' : MODULE_METAS[currentStep.id as ProjectType]?.badge}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#0B1F2D]">
                    {currentStep.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {currentStep.subtitle}
                  </p>
                </div>

                {/* Add more areas during diagnostic */}
                {currentStep.id !== 'general' && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-[#64748B]">Agregar otra área:</span>
                    {(['software', 'crm', 'automation', 'optimization', 'consulting', 'landing', 'idea'] as ProjectType[])
                      .filter(a => !selectedAreas.includes(a))
                      .map(a => (
                        <button
                          key={a}
                          onClick={() => handleAddModule(a)}
                          className="px-2 py-1 rounded bg-[#EAF6FD] hover:bg-[#00D9F5]/20 text-[10px] font-mono text-[#0B1F2D] font-bold border border-[#BCE4F7] transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3 text-[#009bb3]" />
                          <span>{MODULE_METAS[a]?.badge}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Render Questions for this step */}
              <div className="space-y-6">
                {(currentStep.id === 'general' 
                  ? GENERAL_QUESTIONS 
                  : SPECIALIZED_MODULE_QUESTIONS[currentStep.id as ProjectType] || []
                ).map((q, idx) => {
                  const currentAnswer = answers[q.id];
                  
                  return (
                    <div 
                      key={q.id}
                      className="p-4 sm:p-5 rounded-xl bg-white border border-[#E0F2FE] shadow-xs hover:border-[#BCE4F7] transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <label className="block text-xs sm:text-sm font-bold text-[#0B1F2D]">
                          <span className="font-mono text-[#009bb3] mr-1.5">{idx + 1}.</span>
                          {q.label}
                          {q.required && <span className="text-[#009bb3] ml-1">*</span>}
                        </label>
                        {currentAnswer && (
                          <span className="text-[10px] font-mono text-[#00897B] bg-[#E8FBF7] px-2 py-0.5 rounded font-bold shrink-0">
                            ✓ Respondida
                          </span>
                        )}
                      </div>

                      {q.description && (
                        <p className="text-[11px] text-[#64748B] italic">
                          {q.description}
                        </p>
                      )}

                      {/* Render input by type */}
                      {q.type === 'single' && q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt) => {
                            const isSelected = currentAnswer?.value === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleAnswerChange(q, opt.value, opt.label)}
                                className={`p-3 rounded-lg border text-left text-xs font-mono transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                  isSelected
                                    ? 'bg-[#E0F8FF] border-[#00D9F5] text-[#0B1F2D] font-bold shadow-xs'
                                    : 'bg-[#F8FCFE] border-[#CDE9F7] text-[#1E3A52] hover:bg-white hover:border-[#00D9F5]/50'
                                }`}
                              >
                                <span>{opt.label}</span>
                                {isSelected && <Check className="w-4 h-4 text-[#00897B] shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'multiple' && q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt) => {
                            const selectedValues: string[] = Array.isArray(currentAnswer?.value) 
                              ? currentAnswer.value 
                              : [];
                            const isSelected = selectedValues.includes(opt.value);

                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  let nextValues: string[];
                                  if (opt.value === 'ninguna' || opt.value === 'no_lo_se') {
                                    nextValues = isSelected ? [] : [opt.value];
                                  } else {
                                    nextValues = isSelected
                                      ? selectedValues.filter(v => v !== opt.value)
                                      : [...selectedValues.filter(v => v !== 'ninguna' && v !== 'no_lo_se'), opt.value];
                                  }
                                  const displayLabels = q.options!
                                    .filter(o => nextValues.includes(o.value))
                                    .map(o => o.label)
                                    .join('; ');
                                  handleAnswerChange(q, nextValues, displayLabels || 'Ninguna');
                                }}
                                className={`p-3 rounded-lg border text-left text-xs font-mono transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                  isSelected
                                    ? 'bg-[#E0F8FF] border-[#00D9F5] text-[#0B1F2D] font-bold shadow-xs'
                                    : 'bg-[#F8FCFE] border-[#CDE9F7] text-[#1E3A52] hover:bg-white hover:border-[#00D9F5]/50'
                                }`}
                              >
                                <span>{opt.label}</span>
                                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                  isSelected ? 'border-[#009bb3] bg-[#00D9F5] text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isSelected && <Check className="w-3 h-3 text-[#0B1F2D]" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'textarea' && (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={3}
                            value={currentAnswer?.value || ''}
                            onChange={(e) => handleAnswerChange(q, e.target.value, e.target.value)}
                            placeholder="Escribe tu respuesta aquí con el nivel de detalle que desees..."
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white text-xs sm:text-sm text-[#0B1F2D] placeholder-[#94A3B8] outline-none transition-all resize-y font-mono"
                          />
                          {q.allowUnknown && (
                            <button
                              type="button"
                              onClick={() => handleAnswerChange(q, 'Por definir / Requiere orientación', 'Por definir / Requiere orientación')}
                              className="text-[11px] font-mono text-[#009bb3] hover:underline cursor-pointer"
                            >
                              Prefiero definirlo durante la llamada de orientación
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Controls */}
        <div className="px-5 py-4 border-t border-[#E0F2FE] bg-[#F8FCFE] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0 || completed}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white border border-[#CDE9F7] hover:bg-[#EAF6FD] text-xs font-mono font-bold text-[#1E3A52] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-2">
            {!completed && (
              currentStepIndex < totalSteps - 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-[#00D9F5] hover:bg-[#00E3B2] text-xs font-mono font-bold text-[#0B1F2D] transition-all shadow-xs cursor-pointer"
                >
                  <span>Siguiente Paso</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteDiagnostic}
                  disabled={completing}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-[#00E3B2] hover:bg-[#00D9F5] text-xs font-mono font-bold text-[#0B1F2D] transition-all shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Finalizar y Enviar</span>
                </button>
              )
            )}
          </div>
        </div>

      </div>

      {/* Exit / Save and Continue Later Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#BCE4F7] max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#00897B] font-bold uppercase tracking-wider">
                Progreso Guardado con Seguridad
              </span>
              <button 
                onClick={() => setShowExitModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="text-base font-extrabold text-[#0B1F2D]">
              Puedes continuar en cualquier momento
            </h4>

            <p className="text-xs text-[#1E3A52] leading-relaxed">
              Tus respuestas están resguardadas en el servidor bajo la referencia <strong className="font-mono text-[#009bb3]">{referenceCode}</strong>.
            </p>

            {/* Reference Copy Box */}
            <div className="p-3 rounded-lg bg-[#F0F9FF] border border-[#BCE4F7] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#64748B] block">Código de Referencia:</span>
                <span className="text-sm font-mono font-bold text-[#0B1F2D]">{referenceCode}</span>
              </div>
              <button
                onClick={handleCopyRef}
                className="px-2.5 py-1.5 rounded bg-white hover:bg-[#EAF6FD] text-xs font-mono border border-[#BCE4F7] text-[#009bb3] font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 text-[#00897B]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRef ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            {/* Private Recovery Link Box */}
            <div className="p-3 rounded-lg bg-[#F8FCFE] border border-[#CDE9F7] space-y-1.5">
              <span className="text-[10px] font-mono text-[#64748B] block">Enlace Privado de Recuperación:</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getRecoveryUrl()}
                  className="w-full text-[11px] font-mono bg-white px-2 py-1.5 rounded border border-[#CDE9F7] text-[#1E3A52] select-all outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-2.5 py-1.5 rounded bg-[#00D9F5] hover:bg-[#00E3B2] text-xs font-mono text-[#0B1F2D] font-bold inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-[#00897B]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <p className="text-[10px] text-[#64748B]">
                Guarda este enlace o cópialo en tus notas para reanudar desde cualquier dispositivo.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleSendWhatsAppReminder}
                className="w-full py-2.5 px-4 rounded-md bg-[#25D366] hover:bg-[#20BA5A] text-white font-mono font-bold text-xs inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar recordatorio a mi WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  setShowExitModal(false);
                  onClose();
                }}
                className="w-full py-2 px-4 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-mono text-slate-700 font-medium cursor-pointer"
              >
                Entendido, salir del cuestionario
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
