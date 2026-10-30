import React, { useState, useEffect } from 'react';
import { ProjectType, ContactPreference, Lead } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { Language, translations } from '../../lib/i18n.ts';
import { trackSectionNavigation } from '../../lib/analytics.ts';
import { Send, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

interface LeadCaptureSectionProps {
  preselectedServiceType?: ProjectType | null;
  onLeadSubmitted?: (lead: Lead) => void;
  currentLang: Language;
}

export const LeadCaptureSection: React.FC<LeadCaptureSectionProps> = ({
  preselectedServiceType,
  onLeadSubmitted,
  currentLang,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    projectType: (preselectedServiceType || 'software') as ProjectType,
    description: '',
    contactPreference: 'email' as ContactPreference,
    dataConsent: true,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

  const t = translations[currentLang].contact;

  useEffect(() => {
    if (preselectedServiceType) {
      setFormData(prev => ({ ...prev, projectType: preselectedServiceType }));
    }
  }, [preselectedServiceType]);

  const projectTypeOptions: { value: ProjectType; label: string }[] = [
    { value: 'software', label: currentLang === 'en' ? 'Custom Software & Platforms' : currentLang === 'fr' ? 'Logiciels et Systèmes sur Mesure' : 'Software a medida' },
    { value: 'landing', label: currentLang === 'en' ? 'Landing Pages & Conversion Funnels' : currentLang === 'fr' ? 'Landing Pages et Tunnels de Conversion' : 'Landing pages y plataformas de captación' },
    { value: 'crm', label: currentLang === 'en' ? 'CRM & Operations Management' : currentLang === 'fr' ? 'CRM et Gestion Opérationnelle' : 'CRM y gestión operativa' },
    { value: 'automation', label: currentLang === 'en' ? 'Process Automation' : currentLang === 'fr' ? 'Automatisation des Processus' : 'Automatización de procesos' },
    { value: 'optimization', label: currentLang === 'en' ? 'Existing Systems Optimization' : currentLang === 'fr' ? 'Optimisation de Systèmes Existants' : 'Optimización de sistemas' },
    { value: 'consulting', label: currentLang === 'en' ? 'Technology Advisory' : currentLang === 'fr' ? 'Conseil Technologique' : 'Consultoría tecnológica' },
    { value: 'idea', label: currentLang === 'en' ? 'I have an idea & need guidance' : currentLang === 'fr' ? 'J\'ai une idée et j\'ai besoin d\'orientation' : 'Tengo una idea y necesito orientación' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Client-side validations
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setErrorMsg(currentLang === 'en' ? 'Please enter your full name (at least 2 letters).' : currentLang === 'fr' ? 'Veuillez renseigner votre nom complet (au moins 2 lettres).' : 'Por favor ingresa tu nombre completo (mínimo 2 caracteres).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMsg(currentLang === 'en' ? 'Please enter a valid email address.' : currentLang === 'fr' ? 'Veuillez saisir une adresse e-mail valide.' : 'Por favor introduce una dirección de correo electrónico válida.');
      return;
    }

    if (!formData.description.trim() || formData.description.trim().length < 5) {
      setErrorMsg(currentLang === 'en' ? 'Please briefly describe what you need to solve.' : currentLang === 'fr' ? 'Veuillez décrire brièvement votre besoin.' : 'Por favor describe qué problema o idea deseas resolver.');
      return;
    }

    if (!formData.dataConsent) {
      setErrorMsg(currentLang === 'en' ? 'Consent is required to receive a response.' : currentLang === 'fr' ? 'Votre consentement est requis pour recevoir une réponse.' : 'Debes aceptar el consentimiento para recibir respuesta del laboratorio.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.submitLead({
        fullName: formData.fullName,
        company: formData.company || undefined,
        email: formData.email,
        phone: formData.phone || undefined,
        projectType: formData.projectType,
        description: formData.description,
        contactPreference: formData.contactPreference,
        dataConsent: formData.dataConsent,
      });

      trackSectionNavigation('/contact/success', 'lead_form_submitted');
      setSubmittedLead(response.lead);
      if (onLeadSubmitted) {
        onLeadSubmitted(response.lead);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with laboratory.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedLead(null);
    setFormData({
      fullName: '',
      company: '',
      email: '',
      phone: '',
      projectType: 'software',
      description: '',
      contactPreference: 'email',
      dataConsent: true,
    });
  };

  return (
    <section id="contacto" className="py-12 bg-[#F5FBFF] border-t border-[#E0F2FE] relative bg-tech-grid-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#009bb3] uppercase tracking-wider mb-2 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00b38c]" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F2D] tracking-tight mb-2">
            {t.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#1E3A52] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Confirmation Screen */}
        {submittedLead ? (
          <div className="p-6 sm:p-8 rounded-2xl lab-card-clean bg-white border-[#00E3B2] text-center shadow-xl relative animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#00E3B2]/15 border border-[#00E3B2] flex items-center justify-center mx-auto mb-4 text-[#00897B]">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <span className="font-mono text-xs text-[#00897B] uppercase tracking-wider block mb-1 font-bold">
              {t.successTag}
            </span>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1F2D] mb-2">
              {t.successTitle}, {submittedLead.fullName}!
            </h3>

            <p className="text-xs sm:text-sm text-[#1E3A52] max-w-lg mx-auto mb-4 leading-relaxed">
              {t.successMsg} ID: <strong className="font-mono text-[#009bb3]">{submittedLead.id}</strong>.
            </p>

            <div className="p-3.5 rounded-lg bg-[#F0F9FF] border border-[#BCE4F7] max-w-md mx-auto text-left text-xs font-mono mb-6 space-y-1.5 text-[#1E3A52]">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-[#00897B] font-bold">{t.successState}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.successType}</span>
                <span className="text-[#0B1F2D] capitalize font-medium">{submittedLead.projectType}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.successEmail}</span>
                <span className="text-[#0B1F2D] font-medium">{submittedLead.email}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#EAF6FD] hover:bg-[#00D9F5] border border-[#BCE4F7] hover:border-[#00D9F5] text-xs font-mono text-[#0B1F2D] font-bold transition-all cursor-pointer shadow-xs"
            >
              <span>{t.newInquiryBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00897B]" />
            </button>
          </div>
        ) : (
          /* High-Contrast Luminous Light Form */
          <div className="rounded-2xl lab-card-clean bg-white p-5 sm:p-7 shadow-xl border border-[#BCE4F7] relative">
            
            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-xs flex items-center gap-2.5 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Row 1: Nombre + Empresa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-mono text-[#0B1F2D] font-bold mb-1">
                    {t.nameLabel} <span className="text-[#009bb3]">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t.namePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#0B1F2D] placeholder-[#94A3B8] outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs font-mono text-[#0B1F2D] font-bold mb-1">
                    {t.companyLabel} <span className="text-[#64748B] font-normal">(opcional)</span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={t.companyPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#0B1F2D] placeholder-[#94A3B8] outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Row 2: Correo + Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-mono text-[#0B1F2D] font-bold mb-1">
                    {t.emailLabel} <span className="text-[#009bb3]">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#0B1F2D] placeholder-[#94A3B8] outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-mono text-[#0B1F2D] font-bold mb-1">
                    {t.phoneLabel} <span className="text-[#64748B] font-normal">(opcional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t.phonePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#0B1F2D] placeholder-[#94A3B8] outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Tipo de proyecto */}
              <div>
                <label htmlFor="projectType" className="block text-xs font-mono text-[#0B1F2D] font-bold mb-1">
                  {t.projectTypeLabel} <span className="text-[#009bb3]">*</span>
                </label>
                <select
                  id="projectType"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value as ProjectType })}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#0B1F2D] outline-none transition-all font-mono"
                >
                  {projectTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-white text-[#0B1F2D]">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 4: Descripción de la necesidad */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="description" className="block text-xs font-mono text-[#0B1F2D] font-bold">
                    {t.descLabel} <span className="text-[#009bb3]">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    {formData.description.length} chars
                  </span>
                </div>
                <textarea
                  id="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t.descPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#0B1F2D] placeholder-[#94A3B8] outline-none transition-all resize-y"
                />
              </div>

              {/* Row 5: Preferencia de contacto */}
              <div>
                <label className="block text-xs font-mono text-[#0B1F2D] font-bold mb-1.5">
                  {t.prefLabel}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { value: 'email' as ContactPreference, label: t.prefEmail },
                    { value: 'whatsapp' as ContactPreference, label: t.prefWhatsapp },
                    { value: 'call' as ContactPreference, label: t.prefCall },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className={`flex items-center justify-center p-2 rounded-md border text-xs font-mono cursor-pointer transition-all ${
                        formData.contactPreference === item.value
                          ? 'border-[#00D9F5] bg-[#E0F8FF] text-[#00897B] font-bold shadow-xs'
                          : 'border-[#CDE9F7] bg-[#F8FCFE] text-[#1E3A52] hover:border-[#00D9F5]/60 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="contactPreference"
                        value={item.value}
                        checked={formData.contactPreference === item.value}
                        onChange={() => setFormData({ ...formData, contactPreference: item.value })}
                        className="sr-only"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Row 6: Consentimiento */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-[#1E3A52] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.dataConsent}
                    onChange={(e) => setFormData({ ...formData, dataConsent: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded border-[#CDE9F7] bg-white text-[#00D9F5] focus:ring-[#00D9F5]"
                  />
                  <span>
                    {t.consentText}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-md bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-[#00D9F5]/25 cursor-pointer disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,217,245,0.4)]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.submitting}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.submitBtn}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </section>
  );
};
