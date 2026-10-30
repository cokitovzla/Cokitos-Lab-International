export type Language = 'es' | 'en' | 'fr';

export interface Translations {
  nav: {
    home: string;
    about: string;
    why: string;
    what: string;
    how: string;
    services: string;
    methodology: string;
    projects: string;
    contact: string;
    startProject: string;
    crmAdmin: string;
  };
  hero: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    titleEnd: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    metric1Val: string;
    metric1Label: string;
    metric2Val: string;
    metric2Label: string;
    metric3Val: string;
    metric3Label: string;
    engineTitle: string;
    engineVer: string;
    step1: string;
    step2: string;
    step3: string;
    phase: string;
    deliverable: string;
    matrixStatus: string;
  };
  about: {
    tagline: string;
    title: string;
    p1: string;
    p2: string;
    whyLabel: string;
    whyTitle: string;
    whyDesc: string;
    visionLabel: string;
    visionTitle: string;
    visionDesc: string;
    whatLabel: string;
    whatTitle: string;
    whatDesc: string;
    howLabel: string;
    howTitle: string;
    howDesc: string;
    philosophyTag: string;
    philosophyTitle: string;
    philosophyDesc: string;
    guarantee: string;
    personalityHeader: string;
    personalitySubtitle: string;
    personality: {
      professionalTitle: string;
      professionalTag: string;
      professionalDesc: string;
      analyticalTitle: string;
      analyticalTag: string;
      analyticalDesc: string;
      innovativeTitle: string;
      innovativeTag: string;
      innovativeDesc: string;
      resolutiveTitle: string;
      resolutiveTag: string;
      resolutiveDesc: string;
      closeTitle: string;
      closeTag: string;
      closeDesc: string;
    };
  };
  services: {
    tag: string;
    title: string;
    subtitle: string;
    badge: string;
    quoteBtn: string;
    items: {
      softwareTitle: string;
      softwareTag: string;
      softwareDesc: string;
      crmTitle: string;
      crmTag: string;
      crmDesc: string;
      automationTitle: string;
      automationTag: string;
      automationDesc: string;
      optimizationTitle: string;
      optimizationTag: string;
      optimizationDesc: string;
      consultingTitle: string;
      consultingTag: string;
      consultingDesc: string;
      landingTitle: string;
      landingTag: string;
      landingDesc: string;
    };
  };
  methodology: {
    tag: string;
    title: string;
    subtitle: string;
    validationCriteria: string;
    labDeliverable: string;
    qualityBadge: string;
    stages: {
      s1Code: string;
      s1Title: string;
      s1Tagline: string;
      s1Desc: string;
      s1Deliverable: string;
      s2Code: string;
      s2Title: string;
      s2Tagline: string;
      s2Desc: string;
      s2Deliverable: string;
      s3Code: string;
      s3Title: string;
      s3Tagline: string;
      s3Desc: string;
      s3Deliverable: string;
      s4Code: string;
      s4Title: string;
      s4Tagline: string;
      s4Desc: string;
      s4Deliverable: string;
    };
  };
  projects: {
    tag: string;
    title: string;
    subtitle: string;
    allFilter: string;
    empty: string;
    milestones: string;
    context: string;
  };
  contact: {
    tag: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    projectTypeLabel: string;
    descLabel: string;
    descPlaceholder: string;
    prefLabel: string;
    prefEmail: string;
    prefWhatsapp: string;
    prefCall: string;
    consentText: string;
    submitBtn: string;
    submitting: string;
    successTag: string;
    successTitle: string;
    successMsg: string;
    successState: string;
    successType: string;
    successEmail: string;
    newInquiryBtn: string;
  };
  footer: {
    desc: string;
    slogan: string;
    navTitle: string;
    contactTitle: string;
    crmLink: string;
    privacy: string;
    terms: string;
    rights: string;
  };
}

export const translations: Record<Language, Translations> = {
  es: {
    nav: {
      home: 'Inicio',
      about: 'El Laboratorio',
      why: 'Why (Propósito)',
      what: 'What (Qué Hacemos)',
      how: 'How (Metodología)',
      services: 'Servicios',
      methodology: 'The Lab Method',
      projects: 'Proyectos',
      contact: 'Contacto',
      startProject: 'Iniciar un proyecto',
      crmAdmin: 'CRM Admin',
    },
    hero: {
      badge: 'Menos caos. Automatiza. Escala.',
      titleStart: 'Transformamos',
      titleHighlight: 'ideas en sistemas',
      titleEnd: 'que funcionan.',
      subtitle: 'Analizamos tus necesidades, diseñamos soluciones inteligentes y desarrollamos tecnología a medida para llevar tu operación al siguiente nivel. No vendemos plantillas: creamos sistemas digitales que funcionan para negocios reales.',
      ctaPrimary: 'Hablemos de tu proyecto',
      ctaSecondary: 'Explora el laboratorio',
      metric1Val: '100%',
      metric1Label: 'Software a la medida',
      metric2Val: '<24h',
      metric2Label: 'Diagnóstico de viabilidad',
      metric3Val: '0',
      metric3Label: 'Código desechable',
      engineTitle: 'The Lab Method Engine',
      engineVer: 'ARQ. v1.0',
      step1: 'IDEAS',
      step2: 'SISTEMAS',
      step3: 'RESULTADOS',
      phase: 'Fase',
      deliverable: 'Entregable clave:',
      matrixStatus: 'Persistencia Activa',
    },
    about: {
      tagline: '01 · Identidad & Principios del Laboratorio',
      title: 'Una nueva forma de resolver problemas.',
      p1: 'En Cokito’s Lab combinamos análisis, creatividad y desarrollo tecnológico para transformar ideas, optimizar operaciones y construir soluciones digitales.',
      p2: 'No empezamos por la tecnología. Empezamos por entender lo que necesitas.',
      whyLabel: 'Why · Propósito',
      whyTitle: 'Hacemos que las ideas funcionen en el mundo real.',
      whyDesc: 'Creemos que cada negocio tiene un potencial mayor cuando cuenta con sistemas inteligentes, procesos claros y tecnología bien aplicada. Existimos para convertir ese potencial en resultados tangibles.',
      visionLabel: 'Visión de Futuro',
      visionTitle: 'El estándar en soluciones tecnológicas aplicadas.',
      visionDesc: 'Ser el laboratorio de referencia en soluciones tecnológicas que impulsan empresas más eficientes, autónomas y escalables en cualquier sector industrial.',
      whatLabel: 'What · Qué Hacemos',
      whatTitle: 'Diseñamos y desarrollamos soluciones a la medida.',
      whatDesc: 'Creamos sistemas, plataformas, CRMs y automatizaciones que optimizan operaciones, integran procesos fragmentados y erradican tareas manuales repetitivas.',
      howLabel: 'How · Cómo lo Hacemos',
      howTitle: 'Analizamos. Diseñamos. Desarrollamos. Optimizamos.',
      howDesc: 'Aplicamos un método estructurado que combina ciencia, estrategia de datos, diseño de interfaz y desarrollo robusto, enfocado en soluciones prácticas y listas para escalar.',
      philosophyTag: 'Nuestra Filosofía',
      philosophyTitle: '"Porque las cosas pueden funcionar mejor."',
      philosophyDesc: 'No somos una agencia convencional de diseño web. Somos un laboratorio donde estudiamos problemas a fondo, identificamos oportunidades latentes y construimos tecnología a medida con código limpio y arquitectura duradera.',
      guarantee: 'Sistemas con Garantía',
      personalityHeader: 'Nuestra Personalidad en Cada Proyecto',
      personalitySubtitle: '5 Pilares de Ejecución',
      personality: {
        professionalTitle: 'Profesional',
        professionalTag: 'Rigor Técnico',
        professionalDesc: 'Aplicamos estándares estrictos de desarrollo tecnológico y control de versiones. Diseñamos con código tipado, arquitectura tolerante a fallos y documentación transparente para que tu sistema opere sin interrupciones.',
        analyticalTitle: 'Analíticos',
        analyticalTag: 'Diagnóstico Previo',
        analyticalDesc: 'Antes de escribir una línea de código, estudiamos los cuellos de botella del equipo, el flujo de datos y las restricciones del negocio para transformar la complejidad operativa en un sistema limpio.',
        innovativeTitle: 'Innovadores',
        innovativeTag: 'Vanguardia Útil',
        innovativeDesc: 'Implementamos arquitecturas modernas, APIs reactivas y automatizaciones en tiempo real que eliminan las tareas manuales propensas a error, posicionando tu empresa con ventaja tecnológica real.',
        resolutiveTitle: 'Resolutivos',
        resolutiveTag: 'Impacto Rápido',
        resolutiveDesc: 'Evitamos la burocracia y las complejidades innecesarias. Priorizamos el despliegue de soluciones prácticas que resuelvan problemas hoy y generen un retorno inmediato en ahorro de horas de trabajo.',
        closeTitle: 'Cercanos',
        closeTag: 'Trato Directo',
        closeDesc: 'Comunicación clara, transparente y directa, sin jerga confusa ni intermediarios. Nos involucramos como tu brazo tecnológico de confianza en cada fase del ciclo de vida.',
      },
    },
    services: {
      tag: '02 · Capacidades del Laboratorio',
      title: 'Nuestros Servicios & Soluciones Tecnológicas',
      subtitle: 'Soluciones digitales estructuradas con código limpio, arquitectura moderna y rendimiento operativo sub-segundo.',
      badge: 'Tecnología sin obsolescencia',
      quoteBtn: 'Cotizar',
      items: {
        softwareTitle: 'Sistemas y Software a Medida',
        softwareTag: 'Plataformas, portales y aplicaciones empresariales',
        softwareDesc: 'Desarrollamos aplicaciones web de alto rendimiento, portales de clientes y plataformas internas diseñadas exactamente para las reglas y lógica de tu negocio.',
        crmTitle: 'CRM y Gestión Operativa',
        crmTag: 'Organización y control en tiempo real',
        crmDesc: 'Sistemas a medida para captar leads, administrar pipelines comerciales, dar seguimiento a tareas y convertir oportunidades en proyectos sin fuga de datos.',
        automationTitle: 'Automatización de Procesos',
        automationTag: 'Flujos inteligentes e integraciones',
        automationDesc: 'Reducimos drásticamente las horas dedicadas a tareas repetitivas conectando tus herramientas, pasarelas de pago, correos y sistemas contables.',
        optimizationTitle: 'Optimización de Sistemas Existentes',
        optimizationTag: 'Análisis, mejora y escalabilidad',
        optimizationDesc: 'Diagnosticamos y modernizamos herramientas tecnológicas lentas, obsoletas o fragmentadas para devolverles velocidad, seguridad y estabilidad.',
        consultingTitle: 'Consultoría Tecnológica',
        consultingTag: 'Estrategia y acompañamiento',
        consultingDesc: 'Evaluamos la viabilidad técnica de nuevas ideas, definimos la arquitectura correcta antes de gastar en desarrollo y guiamos la toma de decisiones tecnológicas.',
        landingTitle: 'Landing Pages & Plataformas de Captación',
        landingTag: 'Websites de alto impacto y conversión',
        landingDesc: 'Diseñamos y desarrollamos páginas web persuasivas, ultrarrápidas y optimizadas para convertir visitas en prospectos calificados con sincronización directa al CRM.',
      },
    },
    methodology: {
      tag: '03 · The Lab Method',
      title: 'Nuestra Metodología de Ejecución',
      subtitle: 'Un método estructurado que combina ciencia, desarrollo tecnológico y sentido práctico para transformar ideas en sistemas funcionales sin improvisaciones.',
      validationCriteria: 'Criterios de Validación Técnica:',
      labDeliverable: 'Entregable del Laboratorio',
      qualityBadge: 'Control de calidad verificado antes del pase a producción.',
      stages: {
        s1Code: 'OBSERVE',
        s1Title: 'ANALIZAMOS',
        s1Tagline: 'Entendemos el problema, el contexto y los objetivos.',
        s1Desc: 'No escribimos una sola línea de código sin entender la raíz del problema. Evaluamos la operación actual, los cuellos de botella manuales y los objetivos prioritarios.',
        s1Deliverable: 'Diagnóstico Operativo y Mapa de Requerimientos',
        s2Code: 'DECODE',
        s2Title: 'DISEÑAMOS',
        s2Tagline: 'Definimos la solución y la arquitectura del sistema.',
        s2Desc: 'Modelamos la estructura de base de datos, los flujos de datos y la seguridad de acceso. Cada componente se proyecta pensando en escalabilidad y adopción rápida.',
        s2Deliverable: 'Blueprint de Arquitectura y Prototipo Funcional',
        s3Code: 'BUILD',
        s3Title: 'DESARROLLAMOS',
        s3Tagline: 'Construimos, integramos y probamos con rigor.',
        s3Desc: 'Desarrollamos utilizando código tipado, arquitecturas modernas y validaciones estrictas. Conectamos bases de datos persistentes y aplicamos pruebas funcionales.',
        s3Deliverable: 'Sistema Completo en Staging & Producción',
        s4Code: 'EVOLVE',
        s4Title: 'OPTIMIZAMOS',
        s4Tagline: 'Medimos resultados y mejoramos continuamente.',
        s4Desc: 'El despliegue no es el final. Medimos los tiempos de respuesta y la estabilidad para realizar ajustes finos que aseguren un crecimiento sostenido.',
        s4Deliverable: 'Telemetría de Rendimiento y Plan de Evolución',
      },
    },
    projects: {
      tag: '04 · Soluciones & Sistemas',
      title: 'Proyectos del Laboratorio',
      subtitle: 'Muestra verificada de arquitecturas, CRMs y automatizaciones desarrolladas por Cokito\'s Lab. Sincronizado en tiempo real.',
      allFilter: 'Todos los Sistemas',
      empty: 'Aún no hay proyectos marcados para visualización pública en esta categoría.',
      milestones: 'Hitos Técnicos',
      context: 'Contexto:',
    },
    contact: {
      tag: '05 · Captación & Contacto',
      title: 'Cuéntanos qué necesitas resolver.',
      subtitle: 'No necesitas tener una solución técnica definida. Cuéntanos tu idea, necesidad o fricción operativa. En el laboratorio nos encargamos de analizarlo y diseñar el sistema adecuado.',
      nameLabel: 'Nombre completo',
      namePlaceholder: 'Ej. Carlos Valero',
      companyLabel: 'Empresa u organización',
      companyPlaceholder: 'Ej. Distribuidora Andina',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'carlos@empresa.com',
      phoneLabel: 'Teléfono / WhatsApp',
      phonePlaceholder: '+58 412 123 4567',
      projectTypeLabel: 'Tipo de proyecto o necesidad',
      descLabel: 'Descripción de la necesidad',
      descPlaceholder: 'Explícanos tu objetivo: ¿Qué proceso deseas automatizar o qué sistema te gustaría desarrollar?',
      prefLabel: 'Preferencia de contacto',
      prefEmail: 'Correo',
      prefWhatsapp: 'WhatsApp',
      prefCall: 'Llamada telefónica',
      consentText: 'Doy mi consentimiento para que Cokito\'s Lab trate mis datos exclusivamente para responder a esta solicitud y coordinar el diagnóstico inicial.',
      submitBtn: 'Enviar al laboratorio',
      submitting: 'Procesando en el laboratorio...',
      successTag: 'Solicitud Registrada en el Laboratorio',
      successTitle: '¡Mensaje recibido',
      successMsg: 'Hemos registrado tu requerimiento en el CRM. Nuestro equipo evaluará tu caso y se comunicará en menos de 24 horas hábiles.',
      successState: 'Nuevo Contacto (En Cola)',
      successType: 'Tipo de Proyecto:',
      successEmail: 'Email de Respuesta:',
      newInquiryBtn: 'Enviar otra consulta o proyecto',
    },
    footer: {
      desc: 'Laboratorio de innovación y tecnología aplicada. Analizamos problemas reales y construimos sistemas digitales a medida, eficientes y preparados para escalar.',
      slogan: 'Menos caos. Automatiza. Escala.',
      navTitle: 'Navegación',
      contactTitle: 'Información del Laboratorio',
      crmLink: 'Acceso a Cokito\'s Lab Control Center (CRM)',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Uso',
      rights: 'Todos los derechos reservados.',
    },
  },

  en: {
    nav: {
      home: 'Home',
      about: 'The Lab',
      why: 'Why (Purpose)',
      what: 'What (Capabilities)',
      how: 'How (Method)',
      services: 'Services',
      methodology: 'The Lab Method',
      projects: 'Projects',
      contact: 'Contact',
      startProject: 'Start a project',
      crmAdmin: 'CRM Admin',
    },
    hero: {
      badge: 'Less chaos. Automate. Scale.',
      titleStart: 'We transform',
      titleHighlight: 'ideas into systems',
      titleEnd: 'that work.',
      subtitle: 'We analyze your operational needs, design intelligent architectures, and build custom digital technology to bring your business to the next level. No templates: pure custom digital engineering.',
      ctaPrimary: 'Let\'s discuss your project',
      ctaSecondary: 'Explore the lab',
      metric1Val: '100%',
      metric1Label: 'Custom software',
      metric2Val: '<24h',
      metric2Label: 'Feasibility diagnostic',
      metric3Val: '0',
      metric3Label: 'Disposable code',
      engineTitle: 'The Lab Method Engine',
      engineVer: 'ARCH. v1.0',
      step1: 'IDEAS',
      step2: 'SYSTEMS',
      step3: 'RESULTS',
      phase: 'Phase',
      deliverable: 'Key deliverable:',
      matrixStatus: 'Active Persistence',
    },
    about: {
      tagline: '01 · Identity & Lab Principles',
      title: 'A new way to solve complex operational problems.',
      p1: 'At Cokito’s Lab, we combine scientific analysis, creativity, and software engineering to transform ideas, streamline operations, and build high-performance digital tools.',
      p2: 'We don’t start with code. We start by deeply understanding what your business needs.',
      whyLabel: 'Why · Purpose',
      whyTitle: 'We make ideas work in the real world.',
      whyDesc: 'We believe every company has greater potential when backed by intelligent systems, frictionless workflows, and well-applied technology. We exist to convert that potential into measurable results.',
      visionLabel: 'Vision for the Future',
      visionTitle: 'The benchmark in applied digital engineering.',
      visionDesc: 'To be the go-to laboratory for custom technological solutions that power more efficient, autonomous, and scalable businesses across industries.',
      whatLabel: 'What · What We Build',
      whatTitle: 'We design and engineer bespoke digital solutions.',
      whatDesc: 'We build custom platforms, business CRMs, and automated pipelines that eradicate repetitive manual tasks and integrate fragmented business data.',
      howLabel: 'How · How We Execute',
      howTitle: 'We Analyze. Design. Develop. Optimize.',
      howDesc: 'We apply a structured method combining data science, UI ergonomics, and rock-solid backend engineering, focused on practical outcomes ready for growth.',
      philosophyTag: 'Our Philosophy',
      philosophyTitle: '"Because things can always work better."',
      philosophyDesc: 'We are not a generic design agency. We are a specialized software laboratory where we diagnose bottlenecks, detect hidden opportunities, and build tailored systems with clean, durable code.',
      guarantee: 'Engineered with Lifetime Quality',
      personalityHeader: 'Our Engineering DNA on Every Project',
      personalitySubtitle: '5 Core Execution Pillars',
      personality: {
        professionalTitle: 'Professional',
        professionalTag: 'Technical Rigor',
        professionalDesc: 'We apply strict software engineering standards, typed code, fault-tolerant architectures, and clear technical documentation so your systems run 24/7 without surprises.',
        analyticalTitle: 'Analytical',
        analyticalTag: 'Pre-build Diagnosis',
        analyticalDesc: 'Before writing a line of code, we map team bottlenecks, data dependencies, and business constraints to transform operational friction into a clean, predictable workflow.',
        innovativeTitle: 'Innovative',
        innovativeTag: 'Useful Vanguard',
        innovativeDesc: 'We implement modern reactive APIs, optimized data layers, and automated real-time webhooks that cut out error-prone manual labor, giving your company a lasting edge.',
        resolutiveTitle: 'Resolutive',
        resolutiveTag: 'Fast Impact',
        resolutiveDesc: 'Zero bureaucracy and zero useless over-engineering. We deliver pragmatic systems that solve real headaches today and create immediate savings in labor hours and overhead.',
        closeTitle: 'Collaborative',
        closeTag: 'Direct Dialogue',
        closeDesc: 'Transparent, engineer-to-client communication without confusing marketing jargon or layers of account managers. We act as your trusted technical arm at every step.',
      },
    },
    services: {
      tag: '02 · Laboratory Capabilities',
      title: 'Our Engineering Services',
      subtitle: 'Structured digital solutions with exact engineering, clean code, and sub-second performance.',
      badge: 'Zero obsolescence technology',
      quoteBtn: 'Get Quote',
      items: {
        softwareTitle: 'Custom Software & Platforms',
        softwareTag: 'Enterprise portals, dashboards, and custom apps',
        softwareDesc: 'High-performance web applications, customer portals, and internal platforms built precisely for your company’s unique business logic.',
        crmTitle: 'CRM & Operational Management',
        crmTag: 'Real-time control and pipeline organization',
        crmDesc: 'Tailored systems to capture leads, track sales pipelines, assign team tasks, and convert opportunities into projects without data leakage.',
        automationTitle: 'Process Automation & Integrations',
        automationTag: 'Intelligent event-driven pipelines',
        automationDesc: 'Drastically reduce weekly repetitive tasks by linking your ERP, payment gateways, email notifications, and accounting software.',
        optimizationTitle: 'Existing Systems Modernization',
        optimizationTag: 'Audit, speed, and architectural scaling',
        optimizationDesc: 'We diagnose and refactor slow, outdated, or fragmented software tools, restoring agility, data integrity, and enterprise security.',
        consultingTitle: 'Technology Advisory & Architecture',
        consultingTag: 'Strategy, scoping, and roadmap design',
        consultingDesc: 'We evaluate technical feasibility, map database models, and write technical specifications (PRD) before you invest in software development.',
        landingTitle: 'Landing Pages & Conversion Funnels',
        landingTag: 'High-impact acquisition websites',
        landingDesc: 'We design and develop persuasive, ultra-fast web pages optimized to convert traffic into qualified leads with direct CRM integration.',
      },
    },
    methodology: {
      tag: '03 · The Lab Method',
      title: 'Our Execution Methodology',
      subtitle: 'A structured roadmap combining science, technology, and common sense to build systems that work without guesswork.',
      validationCriteria: 'Technical Validation Criteria:',
      labDeliverable: 'Laboratory Deliverable',
      qualityBadge: 'Audited quality assurance prior to production release.',
      stages: {
        s1Code: 'OBSERVE',
        s1Title: 'ANALYZE',
        s1Tagline: 'We understand the root problem, context, and goals.',
        s1Desc: 'We do not code before understanding the real root bottleneck. We review legacy workflows, friction points, and commercial objectives.',
        s1Deliverable: 'Operational Diagnosis & System Requirements Map',
        s2Code: 'DECODE',
        s2Title: 'DESIGN',
        s2Tagline: 'We architect the solution and system layout.',
        s2Desc: 'We model relational schemas, API payloads, access controls, and UI ergonomics with rapid adoption and horizontal scalability in mind.',
        s2Deliverable: 'Architecture Blueprint & Functional Prototype',
        s3Code: 'BUILD',
        s3Title: 'DEVELOP',
        s3Tagline: 'We build, integrate, and test with rigor.',
        s3Desc: 'We build using TypeScript, modern reactive frameworks, automated migrations, and persistent backend databases under strict functional tests.',
        s3Deliverable: 'Production-Ready Software on Cloud Infrastructure',
        s4Code: 'EVOLVE',
        s4Title: 'OPTIMIZE',
        s4Tagline: 'We monitor telemetry and continuously improve.',
        s4Desc: 'Deployment is just the start. We measure response latencies, user throughput, and system stability to perform fine-tuning for continuous scale.',
        s4Deliverable: 'Performance Telemetry & System Evolution Plan',
      },
    },
    projects: {
      tag: '04 · Systems & Solutions',
      title: 'Laboratory Projects',
      subtitle: 'Verified collection of custom systems, CRMs, and automations developed by Cokito\'s Lab. Synced in real time.',
      allFilter: 'All Systems',
      empty: 'No public projects visible in this category yet.',
      milestones: 'Technical Milestones',
      context: 'Context:',
    },
    contact: {
      tag: '05 · Intake & Contact',
      title: 'Tell us what problem you need to solve.',
      subtitle: 'You don\'t need a full technical spec. Just explain your idea, operational pain point, or goal. Our lab will analyze it and architect the proper system.',
      nameLabel: 'Full Name',
      namePlaceholder: 'e.g. Alex Henderson',
      companyLabel: 'Company / Organization',
      companyPlaceholder: 'e.g. Apex Industrial',
      emailLabel: 'Email Address',
      emailPlaceholder: 'alex@company.com',
      phoneLabel: 'Phone / WhatsApp',
      phonePlaceholder: '+1 (555) 234-5678',
      projectTypeLabel: 'Project Type or Need',
      descLabel: 'Description of the Need',
      descPlaceholder: 'Describe your objective: What process do you want to automate or what system do you need built?',
      prefLabel: 'Preferred Contact Method',
      prefEmail: 'Email',
      prefWhatsapp: 'WhatsApp',
      prefCall: 'Phone Call',
      consentText: 'I consent to Cokito\'s Lab processing my data solely to respond to this project inquiry and coordinate an initial technical diagnostic.',
      submitBtn: 'Send to Laboratory',
      submitting: 'Processing in the lab...',
      successTag: 'Inquiry Logged in the Laboratory',
      successTitle: 'Inquiry received',
      successMsg: 'We registered your requirement in our CRM. Our specialist team will review it and reply within 24 business hours.',
      successState: 'New Lead (In Diagnostic Queue)',
      successType: 'Project Type:',
      successEmail: 'Reply Email:',
      newInquiryBtn: 'Send another project inquiry',
    },
    footer: {
      desc: 'Applied innovation and technology laboratory. We diagnose real-world business challenges and build durable, automated, custom digital systems.',
      slogan: 'Less chaos. Automate. Scale.',
      navTitle: 'Navigation',
      contactTitle: 'Laboratory Contact',
      crmLink: 'Cokito\'s Lab Control Center (CRM Access)',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      rights: 'All rights reserved.',
    },
  },

  fr: {
    nav: {
      home: 'Accueil',
      about: 'Le Laboratoire',
      why: 'Why (Raison d\'être)',
      what: 'What (Ce que nous faisons)',
      how: 'How (Méthode)',
      services: 'Services',
      methodology: 'The Lab Method',
      projects: 'Projets',
      contact: 'Contact',
      startProject: 'Démarrer un projet',
      crmAdmin: 'CRM Admin',
    },
    hero: {
      badge: 'Moins de chaos. Automatisez. Développez.',
      titleStart: 'Nous transformons',
      titleHighlight: 'les idées en systèmes',
      titleEnd: 'qui fonctionnent.',
      subtitle: 'Nous analysons vos besoins opérationnels, concevons des solutions intelligentes et développons une technologie sur mesure pour dynamiser votre entreprise.',
      ctaPrimary: 'Parlons de votre projet',
      ctaSecondary: 'Découvrir le laboratoire',
      metric1Val: '100%',
      metric1Label: 'Logiciel sur mesure',
      metric2Val: '<24h',
      metric2Label: 'Diagnostic de faisabilité',
      metric3Val: '0',
      metric3Label: 'Code jetable',
      engineTitle: 'The Lab Method Engine',
      engineVer: 'ARCH. v1.0',
      step1: 'IDÉES',
      step2: 'SYSTÈMES',
      step3: 'RÉSULTATS',
      phase: 'Phase',
      deliverable: 'Livrable clé :',
      matrixStatus: 'Persistance Active',
    },
    about: {
      tagline: '01 · Identité et Principes du Laboratoire',
      title: 'Une nouvelle façon de résoudre les défis complexes.',
      p1: 'Chez Cokito’s Lab, nous combinons analyse scientifique, créativité et technologie logicielle pour transformer les idées, optimiser les opérations et construire des outils numériques performants.',
      p2: 'Nous ne commençons pas par la technologie. Nous commençons par comprendre vos besoins profonds.',
      whyLabel: 'Why · Raison d\'être',
      whyTitle: 'Nous donnons vie aux idées dans le monde réel.',
      whyDesc: 'Chaque entreprise possède un potentiel décuplé lorsqu\'elle s\'appuie sur des systèmes intelligents, des processus clairs et une technologie bien appliquée. Nous existons pour convertir ce potentiel en résultats mesurables.',
      visionLabel: 'Vision d\'Avenir',
      visionTitle: 'La référence en solutions technologiques appliquées.',
      visionDesc: 'Devenir le laboratoire de référence pour les systèmes sur mesure qui rendent les entreprises plus autonomes, performantes et évolutives.',
      whatLabel: 'What · Ce que nous faisons',
      whatTitle: 'Nous concevons et développons des solutions sur mesure.',
      whatDesc: 'Nous créons des plateformes sur mesure, des CRM métiers et des automatisations intelligentes qui éliminent les tâches manuelles répétitives.',
      howLabel: 'How · Comment nous procédons',
      howTitle: 'Analyser. Concevoir. Développer. Optimiser.',
      howDesc: 'Nous appliquons une méthode rigoureuse alliant science des données, ergonomie utilisateur et robustesse logicielle, orientée vers des résultats pérennes.',
      philosophyTag: 'Notre Philosophie',
      philosophyTitle: '"Parce que les choses peuvent toujours mieux fonctionner."',
      philosophyDesc: 'Nous ne sommes pas une agence web conventionnelle. Nous sommes un laboratoire de recherche et de développement technologique qui étudie les dysfonctionnements à la source pour concevoir des logiciels durables et fiables.',
      guarantee: 'Développement de Haute Qualité',
      personalityHeader: 'Notre ADN Technologique sur Chaque Projet',
      personalitySubtitle: '5 Piliers d\'Exécution',
      personality: {
        professionalTitle: 'Professionnel',
        professionalTag: 'Rigueur Technique',
        professionalDesc: 'Nous appliquons des normes strictes de qualité logicielle, de code typé, de tolérance aux pannes et de documentation limpide pour un fonctionnement 24/7 sans interruption.',
        analyticalTitle: 'Analytique',
        analyticalTag: 'Diagnostic Préalable',
        analyticalDesc: 'Avant d\'écrire la moindre ligne de code, nous analysons les goulots d\'étranglement opérationnels et les flux de données pour structurer un système prévisible et fluide.',
        innovativeTitle: 'Innovant',
        innovativeTag: 'Avant-garde Utile',
        innovativeDesc: 'Nous intégrons des architectures modernes, des APIs réactives et des automatisations en temps réel pour éliminer les erreurs manuelles et offrir un véritable avantage compétitif.',
        resolutiveTitle: 'Résolutif',
        resolutiveTag: 'Impact Rapide',
        resolutiveDesc: 'Zéro bureaucratie et zéro complexité inutile. Nous livrons des systèmes pragmatiques qui résolvent les blocages réels dès aujourd\'hui avec un retour sur investissement immédiat.',
        closeTitle: 'Proche & Direct',
        closeTag: 'Dialogue Direct',
        closeDesc: 'Communication transparente et directe, sans jargon complexe ni intermédiaires. Nous devenons votre partenaire technologique de confiance à chaque étape.',
      },
    },
    services: {
      tag: '02 · Capacités du Laboratoire',
      title: 'Nos Services & Solutions Technologiques',
      subtitle: 'Des solutions structurées avec une précision méticuleuse, un code propre et des performances élevées.',
      badge: 'Technologie sans obsolescence',
      quoteBtn: 'Devis',
      items: {
        softwareTitle: 'Logiciels & Systèmes sur Mesure',
        softwareTag: 'Portails d\'entreprise, dashboards et applications métiers',
        softwareDesc: 'Applications web ultra-rapides, portails clients et plateformes internes conçus selon la logique exacte de votre entreprise.',
        crmTitle: 'CRM & Pilotage Opérationnel',
        crmTag: 'Organisation et contrôle en temps réel',
        crmDesc: 'Systèmes personnalisés pour acquérir des prospects, gérer les pipelines de vente, suivre les tâches et convertir sans déperdition de données.',
        automationTitle: 'Automatisation de Processus',
        automationTag: 'Flux intelligents et intégrations d\'APIs',
        automationDesc: 'Réduisez considérablement vos heures de saisie manuelle en connectant vos outils de gestion, passerelles de paiement, e-mails et comptabilité.',
        optimizationTitle: 'Optimisation de Systèmes Existants',
        optimizationTag: 'Audit, performance et montée en charge',
        optimizationDesc: 'Nous modernisons les outils logiciels lents ou vieillissants pour leur redonner vélocité, sécurité et haute disponibilité.',
        consultingTitle: 'Conseil Technologique & Architecture',
        consultingTag: 'Stratégie, cadrage et choix technologiques',
        consultingDesc: 'Nous analysons la faisabilité technique de vos projets, modélisons vos bases de données et établissons vos spécifications avant tout investissement.',
        landingTitle: 'Landing Pages & Tunnels de Conversion',
        landingTag: 'Sites d\'acquisition à haute conversion',
        landingDesc: 'Conception et développement de pages persuasives, ultra-véloces et optimisées pour convertir les visiteurs en prospects qualifiés connectés au CRM.',
      },
    },
    methodology: {
      tag: '03 · The Lab Method',
      title: 'Notre Méthode d\'Exécution',
      subtitle: 'Un processus structuré combinant démarche scientifique, génie logiciel et pragmatisme pour transformer les idées en systèmes fiables.',
      validationCriteria: 'Critères de Validation Technique :',
      labDeliverable: 'Livrable du Laboratoire',
      qualityBadge: 'Contrôle qualité certifié avant la mise en production.',
      stages: {
        s1Code: 'OBSERVE',
        s1Title: 'ANALYSER',
        s1Tagline: 'Comprendre le problème, le contexte et les objectifs.',
        s1Desc: 'Nous n\'écrivons aucun code sans identifier la racine du problème. Nous analysons les goulots d\'étranglement opérationnels et les priorités métiers.',
        s1Deliverable: 'Diagnostic Opérationnel & Cahier des Charges',
        s2Code: 'DECODE',
        s2Title: 'CONCEVOIR',
        s2Tagline: 'Définir la solution et l\'architecture globale.',
        s2Desc: 'Nous modélisons les bases de données, les flux d\'échanges et la sécurité pour assurer une évolutivité maximale et une adoption fluide.',
        s2Deliverable: 'Schéma d\'Architecture & Prototype Fonctionnel',
        s3Code: 'BUILD',
        s3Title: 'DÉVELOPPER',
        s3Tagline: 'Construire, intégrer et tester avec rigueur.',
        s3Desc: 'Développement sous typage strict, frameworks réactifs modernes et intégration de bases de données persistantes sous tests rigoureux.',
        s3Deliverable: 'Système Opérationnel Prêt pour la Production',
        s4Code: 'EVOLVE',
        s4Title: 'OPTIMISER',
        s4Tagline: 'Mesurer la télémétrie et améliorer en continu.',
        s4Desc: 'Le déploiement n\'est que le commencement. Nous surveillons la latence et la stabilité afin d\'ajuster les performances pour soutenir votre croissance.',
        s4Deliverable: 'Télémétrie de Performance & Plan d\'Évolution',
      },
    },
    projects: {
      tag: '04 · Systèmes & Solutions',
      title: 'Projets du Laboratoire',
      subtitle: 'Sélection vérifiée d\'architectures, de CRM et d\'automatisations conçus par Cokito\'s Lab. Synchronisation en temps réel.',
      allFilter: 'Tous les Systèmes',
      empty: 'Aucun projet public disponible dans cette catégorie pour l\'instant.',
      milestones: 'Jalons Techniques',
      context: 'Contexte :',
    },
    contact: {
      tag: '05 · Contact & Diagnostic',
      title: 'Dites-nous ce que vous souhaitez résoudre.',
      subtitle: 'Vous n\'avez pas besoin d\'un cahier des charges rédigé. Expliquez-nous votre besoin, votre idée ou votre blocage. Nous nous chargeons de l\'analyser et de concevoir la solution adéquate.',
      nameLabel: 'Nom complet',
      namePlaceholder: 'ex. Thomas Bernard',
      companyLabel: 'Entreprise ou organisation',
      companyPlaceholder: 'ex. Distribution Alpha',
      emailLabel: 'Adresse e-mail',
      emailPlaceholder: 'thomas@entreprise.com',
      phoneLabel: 'Téléphone / WhatsApp',
      phonePlaceholder: '+33 6 12 34 56 78',
      projectTypeLabel: 'Type de projet ou besoin',
      descLabel: 'Description du besoin',
      descPlaceholder: 'Expliquez votre objectif : Quel processus souhaitez-vous automatiser ou quel système voulez-vous développer ?',
      prefLabel: 'Préférence de contact',
      prefEmail: 'E-mail',
      prefWhatsapp: 'WhatsApp',
      prefCall: 'Appel téléphonique',
      consentText: 'Je consens à ce que Cokito\'s Lab traite mes coordonnées afin de répondre à cette demande et planifier un diagnostic technique initial.',
      submitBtn: 'Envoyer au laboratoire',
      submitting: 'Traitement au laboratoire...',
      successTag: 'Demande Enregistrée au Laboratoire',
      successTitle: 'Message bien reçu',
      successMsg: 'Votre besoin a été enregistré dans notre CRM. Notre équipe étudiera votre demande et vous répondra sous 24 heures ouvrées.',
      successState: 'Nouveau Contact (En File d\'Attente)',
      successType: 'Type de Projet :',
      successEmail: 'E-mail de Réponse :',
      newInquiryBtn: 'Envoyer une autre demande de projet',
    },
    footer: {
      desc: 'Laboratoire d\'innovation et de technologie appliquée. Nous analysons les défis réels et bâtissons des systèmes numériques sur mesure, efficients et prêts à grandir.',
      slogan: 'Moins de chaos. Automatisez. Développez.',
      navTitle: 'Navigation',
      contactTitle: 'Contact du Laboratoire',
      crmLink: 'Accès au Cokito\'s Lab Control Center (CRM)',
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions d\'Utilisation',
      rights: 'Tous droits réservés.',
    },
  },
};
