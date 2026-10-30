import React from 'react';
import { Target, Compass, Code2, RefreshCw, FlaskConical, Binary, Lightbulb, Wrench, MessageSquareText, ShieldCheck } from 'lucide-react';
import { Language, translations } from '../../lib/i18n.ts';

interface AboutLabProps {
  currentLang: Language;
}

export const AboutLab: React.FC<AboutLabProps> = ({ currentLang }) => {
  const t = translations[currentLang].about;

  const pillars = [
    {
      label: t.whyLabel,
      title: t.whyTitle,
      description: t.whyDesc,
      icon: Target,
      accent: 'text-[#00D9F5]',
      borderHover: 'hover:border-[#00D9F5]',
      bgBadge: 'bg-[#00D9F5]/10 text-[#00D9F5] border-[#00D9F5]/30',
    },
    {
      label: t.visionLabel,
      title: t.visionTitle,
      description: t.visionDesc,
      icon: Compass,
      accent: 'text-[#00E3B2]',
      borderHover: 'hover:border-[#00E3B2]',
      bgBadge: 'bg-[#00E3B2]/10 text-[#00E3B2] border-[#00E3B2]/30',
    },
    {
      label: t.whatLabel,
      title: t.whatTitle,
      description: t.whatDesc,
      icon: Code2,
      accent: 'text-[#00D9F5]',
      borderHover: 'hover:border-[#00D9F5]',
      bgBadge: 'bg-[#00D9F5]/10 text-[#00D9F5] border-[#00D9F5]/30',
    },
    {
      label: t.howLabel,
      title: t.howTitle,
      description: t.howDesc,
      icon: RefreshCw,
      accent: 'text-[#00E3B2]',
      borderHover: 'hover:border-[#00E3B2]',
      bgBadge: 'bg-[#00E3B2]/10 text-[#00E3B2] border-[#00E3B2]/30',
    },
  ];

  const personality = [
    { 
      name: t.personality.professionalTitle, 
      tag: t.personality.professionalTag,
      desc: t.personality.professionalDesc, 
      icon: FlaskConical,
      color: 'text-[#00D9F5]',
      badgeColor: 'bg-[#00D9F5]/15 border-[#00D9F5]/40 text-[#00D9F5]'
    },
    { 
      name: t.personality.analyticalTitle, 
      tag: t.personality.analyticalTag,
      desc: t.personality.analyticalDesc, 
      icon: Binary,
      color: 'text-[#00E3B2]',
      badgeColor: 'bg-[#00E3B2]/15 border-[#00E3B2]/40 text-[#00E3B2]'
    },
    { 
      name: t.personality.innovativeTitle, 
      tag: t.personality.innovativeTag,
      desc: t.personality.innovativeDesc, 
      icon: Lightbulb,
      color: 'text-[#00D9F5]',
      badgeColor: 'bg-[#00D9F5]/15 border-[#00D9F5]/40 text-[#00D9F5]'
    },
    { 
      name: t.personality.resolutiveTitle, 
      tag: t.personality.resolutiveTag,
      desc: t.personality.resolutiveDesc, 
      icon: Wrench,
      color: 'text-[#00E3B2]',
      badgeColor: 'bg-[#00E3B2]/15 border-[#00E3B2]/40 text-[#00E3B2]'
    },
    { 
      name: t.personality.closeTitle, 
      tag: t.personality.closeTag,
      desc: t.personality.closeDesc, 
      icon: MessageSquareText,
      color: 'text-[#00D9F5]',
      badgeColor: 'bg-[#00D9F5]/15 border-[#00D9F5]/40 text-[#00D9F5]'
    },
  ];

  return (
    <section id="laboratorio" className="py-12 bg-[#F5FBFF] border-t border-[#E0F2FE] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#009bb3] uppercase tracking-wider mb-2 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00b38c]" />
            <span>{t.tagline}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F2D] tracking-tight mb-2">
            {t.title}
          </h2>

          <p className="text-sm sm:text-base text-[#1E3A52] leading-snug">
            {t.p1}{' '}
            <span className="text-[#00897B] font-semibold block sm:inline sm:ml-1.5">
              {t.p2}
            </span>
          </p>
        </div>

        {/* 4 Pillars Grid (Why, Vision, What, How) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.label}
                className="p-5 rounded-xl lab-card-clean bg-white border-[#BCE4F7] hover:border-[#00D9F5] group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded border ${pillar.bgBadge} font-bold`}>
                    {pillar.label}
                  </span>
                  <div className="p-2 rounded-lg bg-[#F0F9FF] border border-[#BCE4F7] group-hover:border-[#00D9F5] transition-colors">
                    <Icon className={`w-4 h-4 ${pillar.accent}`} />
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#0B1F2D] group-hover:text-[#009bb3] transition-colors mb-2 leading-snug">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#1E3A52] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Philosophy Callout Banner (High-Contrast Laboratory Banner in Deep Navy #0B1F2D) */}
        <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-[#0B1F2D] via-[#102d42] to-[#0B1F2D] border border-[#00D9F5]/45 hover:border-[#00D9F5] transition-all shadow-[0_10px_30px_rgba(11,31,45,0.22)] mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <span className="font-mono text-[11px] text-[#00D9F5] uppercase tracking-wider block mb-1 font-bold">
              {t.philosophyTag}
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-[#F5FBFF] mb-1.5">
              {t.philosophyTitle}
            </h4>
            <p className="text-xs sm:text-sm text-[#D0E6F5] leading-relaxed">
              {t.philosophyDesc}
            </p>
          </div>
          <div className="shrink-0 p-3 rounded-lg bg-[#06141F] border border-[#00E3B2] text-xs font-mono text-[#00E3B2] flex items-center gap-2 font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#00E3B2]" />
            <span>{t.guarantee}</span>
          </div>
        </div>

        {/* Personality Section: Packed, Rich Text & Clear Layout */}
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#D0EBF7]">
            <span className="text-xs font-mono text-[#009bb3] uppercase tracking-wider font-bold">
              {t.personalityHeader}
            </span>
            <span className="text-[11px] font-mono text-[#00897B] font-semibold">
              {t.personalitySubtitle}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {personality.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="p-4 rounded-xl lab-card-clean bg-white hover:bg-[#0B1F2D] border-[#BCE4F7] hover:border-[#00D9F5] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-default"
                >
                  <div>
                    {/* Header Row: Icon + Name in the same line */}
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="p-2 rounded-lg bg-[#F0F9FF] border border-[#BCE4F7] group-hover:border-[#00D9F5] group-hover:bg-[#133045] transition-colors shrink-0">
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-sm text-[#0B1F2D] group-hover:text-white transition-colors leading-tight">
                          {item.name}
                        </h5>
                        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border ${item.badgeColor} mt-0.5 inline-block font-semibold`}>
                          {item.tag}
                        </span>
                      </div>
                    </div>

                    {/* Rich Descriptive Text */}
                    <p className="text-xs text-[#1E3A52] group-hover:text-[#D0E6F5] transition-colors leading-relaxed pt-1.5 border-t border-[#E0F2FE] group-hover:border-[#1A384F]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
