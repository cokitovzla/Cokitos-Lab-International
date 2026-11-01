import { ProjectType } from '../../types/index.ts';

export interface DiagnosticOption {
  value: string;
  label: string;
  helper?: string;
}

export interface DiagnosticQuestion {
  id: string;
  label: string;
  description?: string;
  module: 'general' | ProjectType;
  type: 'single' | 'multiple' | 'text' | 'textarea';
  options?: DiagnosticOption[];
  allowUnknown?: boolean;
  required?: boolean;
  dependsOn?: {
    questionId: string;
    value: string | string[];
  };
}

export interface DiagnosticModuleMeta {
  id: 'general' | ProjectType;
  name: string;
  badge: string;
  description: string;
  iconName: string;
}

export const MODULE_METAS: Record<'general' | ProjectType, DiagnosticModuleMeta> = {
  general: {
    id: 'general',
    name: 'Diagnóstico General',
    badge: 'Base Operativa',
    description: 'Comprender tu actividad, contexto organizacional y objetivos primarios.',
    iconName: 'Building',
  },
  software: {
    id: 'software',
    name: 'Sistemas & Software a Medida',
    badge: 'Módulo 1',
    description: 'Arquitectura, funcionalidades requeridas, usuarios y alcance técnico.',
    iconName: 'Code2',
  },
  crm: {
    id: 'crm',
    name: 'CRM & Gestión Operativa',
    badge: 'Módulo 2',
    description: 'Gestión de prospectos, embudo de ventas, tareas de equipo y reportería.',
    iconName: 'Users',
  },
  automation: {
    id: 'automation',
    name: 'Automatización de Procesos',
    badge: 'Módulo 3',
    description: 'Identificación de tareas repetitivas, flujos manuales y sincronizaciones.',
    iconName: 'Zap',
  },
  optimization: {
    id: 'optimization',
    name: 'Optimización de Sistemas',
    badge: 'Módulo 4',
    description: 'Rendimiento, cuellos de botella, estabilidad y modernización de código.',
    iconName: 'Cpu',
  },
  consulting: {
    id: 'consulting',
    name: 'Consultoría Tecnológica',
    badge: 'Módulo 5',
    description: 'Decisiones estratégicas, selección de stack, viabilidad y auditoría técnica.',
    iconName: 'Compass',
  },
  landing: {
    id: 'landing',
    name: 'Landing Pages & Plataformas Web',
    badge: 'Módulo 6',
    description: 'Captación de clientes, catálogo, e-commerce, pasarelas y gestión de pedidos.',
    iconName: 'Globe',
  },
  idea: {
    id: 'idea',
    name: 'Orientación de Idea & MVP',
    badge: 'Módulo 7',
    description: 'Estructuración de tu concepto, propuesta de valor y definición de prototipo.',
    iconName: 'Lightbulb',
  },
};

export const GENERAL_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'gen_organization_type',
    label: '¿Qué tipo de organización o perfil te describe mejor?',
    module: 'general',
    type: 'single',
    required: true,
    options: [
      { value: 'pyme', label: 'Pequeña o Mediana Empresa (PyME)' },
      { value: 'startup', label: 'Startup en crecimiento / Fase semilla' },
      { value: 'empresa_grande', label: 'Empresa consolidada / Corporativo' },
      { value: 'independiente', label: 'Profesional independiente o Consultor' },
      { value: 'no_lo_se', label: 'No lo sé / Por definir' },
    ],
  },
  {
    id: 'gen_industry',
    label: '¿En qué sector o industria opera tu proyecto?',
    module: 'general',
    type: 'single',
    required: true,
    options: [
      { value: 'legal_servicios', label: 'Servicios Profesionales / LegalTech' },
      { value: 'comercio_retail', label: 'Comercio, Retail o Tiendas' },
      { value: 'tecnologia_saas', label: 'Tecnología, Software o SaaS' },
      { value: 'salud_bienestar', label: 'Salud, Bienestar o Medicina' },
      { value: 'educacion_capacitacion', label: 'Educación, Cursos o Capacitación' },
      { value: 'logistica_industrial', label: 'Logística, Industria o Manufactura' },
      { value: 'otro', label: 'Otro sector especializado' },
      { value: 'no_lo_se', label: 'Prefiero no especificarlo ahora' },
    ],
  },
  {
    id: 'gen_main_challenge',
    label: '¿Cuál es el principal obstáculo o problema que necesitas resolver?',
    module: 'general',
    type: 'textarea',
    required: true,
    allowUnknown: true,
    description: 'Explica en tus palabras qué te quita más tiempo o dónde se traba tu operación actualmente.',
  },
  {
    id: 'gen_expected_outcome',
    label: '¿Qué resultado o meta concreta esperas alcanzar con esta solución?',
    module: 'general',
    type: 'textarea',
    required: false,
    description: 'Ejemplo: duplicar ventas, automatizar el 80% de los presupuestos, tener reportes diarios sin errores.',
  },
  {
    id: 'gen_team_size',
    label: '¿Cuántas personas de tu equipo usarán o gestionarán la herramienta?',
    module: 'general',
    type: 'single',
    options: [
      { value: 'solo_yo', label: 'Solo yo (1 persona)' },
      { value: 'equipo_pequeno', label: 'Equipo pequeño (2 a 5 personas)' },
      { value: 'equipo_mediano', label: 'Equipo en crecimiento (6 a 20 personas)' },
      { value: 'equipo_grande', label: 'Más de 20 personas' },
      { value: 'no_lo_se', label: 'No lo sé con certeza todavía' },
    ],
  },
  {
    id: 'gen_current_tools',
    label: '¿Qué herramientas utilizan actualmente para manejar esta información?',
    module: 'general',
    type: 'multiple',
    options: [
      { value: 'excel_sheets', label: 'Excel o Google Sheets' },
      { value: 'whatsapp_correo', label: 'WhatsApp y Correos electrónicos manuales' },
      { value: 'software_legado', label: 'Software instalado o sistema antiguo' },
      { value: 'saas_comercial', label: 'Herramientas SaaS (HubSpot, Notion, Trello, etc.)' },
      { value: 'papel_manual', label: 'Procesos en papel / Memoria' },
      { value: 'ninguna', label: 'Ninguna, empezamos desde cero' },
    ],
  },
  {
    id: 'gen_integrations_needed',
    label: '¿Requieren conectarse con otras plataformas existentes?',
    module: 'general',
    type: 'multiple',
    options: [
      { value: 'pasarelas_pago', label: 'Pasarelas de pago (Stripe, Pago Móvil, PayPal, etc.)' },
      { value: 'whatsapp_api', label: 'WhatsApp / Notificaciones automáticas' },
      { value: 'facturacion_erp', label: 'Facturación fiscal o software contable / ERP' },
      { value: 'correo_calendario', label: 'Google Calendar / Gmail / Outlook' },
      { value: 'redes_anuncios', label: 'Meta Ads / Google Analytics' },
      { value: 'ninguna', label: 'No se requieren integraciones externas' },
      { value: 'no_lo_se', label: 'No lo sé / Necesito orientación' },
    ],
  },
  {
    id: 'gen_urgency_priority',
    label: '¿Con qué prioridad o urgencia planeas iniciar este desarrollo?',
    module: 'general',
    type: 'single',
    required: true,
    options: [
      { value: 'inmediata', label: 'Inmediata (necesitamos arrancar cuanto antes)' },
      { value: 'proximas_semanas', label: 'En las próximas 2 a 4 semanas' },
      { value: 'este_trimestre', label: 'En el transcurso de este trimestre' },
      { value: 'planificacion_exploracion', label: 'Fase de planificación y evaluación de costos' },
    ],
  },
  {
    id: 'gen_timeframe_target',
    label: '¿En qué tiempo te gustaría tener lista una primera versión operativa?',
    module: 'general',
    type: 'single',
    options: [
      { value: 'menos_1_mes', label: '1 mes o menos (lanzamiento rápido / sprint)' },
      { value: '1_a_3_meses', label: '1 a 3 meses (desarrollo estándar robusto)' },
      { value: '3_a_6_meses', label: '3 a 6 meses (proyecto amplio o modular)' },
      { value: 'flexible', label: 'Flexible, priorizamos la calidad y el ajuste' },
      { value: 'no_lo_se', label: 'No lo sé / Sugerir cronograma' },
    ],
  },
  {
    id: 'gen_budget_expectation',
    label: 'Rango de inversión orientativo (opcional):',
    module: 'general',
    type: 'single',
    description: 'Esto nos ayuda a sugerir la mejor arquitectura que maximice tu retorno sin sobredimensionar costos.',
    options: [
      { value: 'menos_1k', label: 'Menos de $1,000 USD / €950' },
      { value: '1k_a_3k', label: '$1,000 – $3,000 USD / €950 – €2,800' },
      { value: '3k_a_7k', label: '$3,000 – $7,000 USD / €2,800 – €6,500' },
      { value: '7k_a_15k', label: '$7,000 – $15,000 USD / €6,500 – €14,000' },
      { value: 'mas_15k', label: 'Más de $15,000 USD / Solución corporativa' },
      { value: 'por_definir', label: 'Prefiero evaluarlo según el alcance que propongan' },
    ],
  },
];

export const SPECIALIZED_MODULE_QUESTIONS: Record<ProjectType, DiagnosticQuestion[]> = {
  software: [
    {
      id: 'soft_platform_type',
      label: '¿Dónde interactuarán principalmente tus usuarios?',
      module: 'software',
      type: 'multiple',
      required: true,
      options: [
        { value: 'web_cloud', label: 'Plataforma Web en la Nube (accesible desde navegador)' },
        { value: 'mobile_app', label: 'Aplicación Móvil dedicada (iOS / Android)' },
        { value: 'intranet_desktop', label: 'Panel Privado de Escritorio / Intranet de empresa' },
        { value: 'api_backend', label: 'API / Microservicio para conectar otros sistemas' },
        { value: 'no_lo_se', label: 'No lo sé / Lo que resulte más eficiente' },
      ],
    },
    {
      id: 'soft_user_roles',
      label: '¿Qué roles o tipos de accesos tendrá la plataforma?',
      module: 'software',
      type: 'multiple',
      options: [
        { value: 'superadmin', label: 'Administrador general (control total de la plataforma)' },
        { value: 'operadores', label: 'Equipo operativo / Colaboradores internos con permisos limitados' },
        { value: 'clientes_externos', label: 'Clientes o usuarios externos con portal de autoservicio' },
        { value: 'proveedores', label: 'Proveedores o socios externos' },
        { value: 'no_lo_se', label: 'Por definir en la fase de arquitectura' },
      ],
    },
    {
      id: 'soft_key_features',
      label: '¿Cuáles son las funciones más importantes que debe tener?',
      module: 'software',
      type: 'textarea',
      description: 'Por ejemplo: generación automática de presupuestos, panel de control con gráficos, exportación a PDF, subida de expedientes, etc.',
    },
  ],

  crm: [
    {
      id: 'crm_lead_volume',
      label: '¿Aproximadamente cuántos prospectos o contactos reciben al mes?',
      module: 'crm',
      type: 'single',
      required: true,
      options: [
        { value: 'menos_30', label: 'Menos de 30 contactos al mes' },
        { value: '30_a_100', label: 'Entre 30 y 100 contactos al mes' },
        { value: '100_a_500', label: 'Entre 100 y 500 contactos al mes' },
        { value: 'mas_500', label: 'Más de 500 contactos al mes' },
        { value: 'no_lo_se', label: 'No lo sabemos con precisión' },
      ],
    },
    {
      id: 'crm_commercial_bottleneck',
      label: '¿Cuál es el mayor dolor de cabeza en su gestión comercial hoy?',
      module: 'crm',
      type: 'multiple',
      options: [
        { value: 'olvido_seguimiento', label: 'Se pierden prospectos por falta de seguimiento a tiempo' },
        { value: 'desorden_informacion', label: 'La información de clientes está regada en WhatsApp y libretas' },
        { value: 'sin_metricas', label: 'No sabemos cuántos prospectos se cierran ni por qué se pierden' },
        { value: 'tareas_descoordinadas', label: 'El equipo no tiene claras las tareas del día a día' },
        { value: 'lentitud_propuestas', label: 'Tardamos mucho tiempo en emitir presupuestos o contratos' },
      ],
    },
    {
      id: 'crm_pipeline_customization',
      label: '¿Tienen definidos pasos o etapas de venta claras?',
      module: 'crm',
      type: 'single',
      options: [
        { value: 'si_definidas', label: 'Sí, tenemos etapas claras y queremos digitalizarlas' },
        { value: 'parcialmente', label: 'Tenemos una idea general pero queremos ayuda para estructurarlas' },
        { value: 'no_definidas', label: 'No, necesitamos que nos propongan un flujo óptimo' },
      ],
    },
  ],

  automation: [
    {
      id: 'auto_manual_tasks',
      label: '¿Qué actividades manuales consumen más horas de trabajo a la semana?',
      module: 'automation',
      type: 'textarea',
      required: true,
      description: 'Ejemplo: pasar datos de pedidos a hojas de cálculo, enviar correos de confirmación, emitir reportes de inventario.',
    },
    {
      id: 'auto_frequency',
      label: '¿Con qué frecuencia se ejecutan estos procesos manuales?',
      module: 'automation',
      type: 'single',
      options: [
        { value: 'tiempo_real', label: 'Varias veces al día / Cada vez que entra un cliente' },
        { value: 'diario', label: 'Una o dos veces al día de forma rutinaria' },
        { value: 'semanal', label: 'Cierres o reportes semanales' },
        { value: 'mensual', label: 'Facturaciones o conciliaciones de fin de mes' },
      ],
    },
    {
      id: 'auto_desired_notification',
      label: '¿Dónde le gustaría recibir alertas y confirmaciones automáticas?',
      module: 'automation',
      type: 'multiple',
      options: [
        { value: 'whatsapp_notif', label: 'Mensajes de WhatsApp a clientes y/o administradores' },
        { value: 'correo_notif', label: 'Correos electrónicos transaccionales estructurados' },
        { value: 'dashboard_notif', label: 'Notificaciones en el panel de control' },
        { value: 'telegram_slack', label: 'Canales internos (Telegram, Slack, Discord)' },
      ],
    },
  ],

  optimization: [
    {
      id: 'opt_current_problem',
      label: '¿Qué síntomas o problemas presenta el sistema actualmente?',
      module: 'optimization',
      type: 'multiple',
      required: true,
      options: [
        { value: 'lentitud', label: 'Lentitud de carga o consultas pesadas' },
        { value: 'caidas_servidor', label: 'Se cae o deja de responder en picos de uso' },
        { value: 'errores_bugs', label: 'Errores frecuentes en formularios o procesos' },
        { value: 'costos_elevados', label: 'Costos de servidores o licencias demasiado altos' },
        { value: 'codigo_obsoleto', label: 'Código viejo o sin documentación dejado por desarrolladores anteriores' },
        { value: 'diseno_antiguo', label: 'La interfaz se ve antigua y poco profesional' },
      ],
    },
    {
      id: 'opt_access_level',
      label: '¿Cuentas con acceso al código fuente y al servidor actual?',
      module: 'optimization',
      type: 'single',
      options: [
        { value: 'acceso_total', label: 'Sí, tenemos acceso total al repositorio y hosting' },
        { value: 'acceso_parcial', label: 'Acceso parcial (algunas credenciales pendientes)' },
        { value: 'sin_acceso', label: 'No tenemos acceso directo, dependemos de un proveedor actual' },
        { value: 'no_lo_se', label: 'No lo sé con certeza, debo consultarlo' },
      ],
    },
    {
      id: 'opt_expected_impact',
      label: '¿Cuál es la meta más importante de esta optimización?',
      module: 'optimization',
      type: 'textarea',
      description: 'Ejemplo: que soporte 500 usuarios concurrentes sin colgarse, o reducir el tiempo de carga a menos de 2 segundos.',
    },
  ],

  consulting: [
    {
      id: 'cons_consulting_goal',
      label: '¿En qué área específica necesitas la asesoría de Cokito\'s Lab?',
      module: 'consulting',
      type: 'multiple',
      required: true,
      options: [
        { value: 'arquitectura_stack', label: 'Selección de tecnologías, base de datos y arquitectura cloud' },
        { value: 'auditoria_seguridad', label: 'Auditoría de código, buenas prácticas o seguridad de la información' },
        { value: 'viabilidad_mvp', label: 'Evaluación de viabilidad técnica y estimación de costos de un producto' },
        { value: 'liderazgo_tecnico', label: 'Acompañamiento como Director de Tecnología / CTO fraccional' },
        { value: 'rescate_proyecto', label: 'Rescate o diagnóstico de un desarrollo que está estancado' },
      ],
    },
    {
      id: 'cons_current_docs',
      label: '¿Cuentas con especificaciones, diagramas o documentación escrita?',
      module: 'consulting',
      type: 'single',
      options: [
        { value: 'documentado', label: 'Sí, tenemos requerimientos y especificaciones detalladas' },
        { value: 'bocetos_notas', label: 'Tenemos notas, bocetos e ideas principales por escrito' },
        { value: 'sin_documentar', label: 'Aún no tenemos nada documentado formalmente' },
      ],
    },
  ],

  landing: [
    {
      id: 'land_web_type',
      label: '¿Qué tipo de plataforma web necesitas desarrollar?',
      module: 'landing',
      type: 'single',
      required: true,
      options: [
        { value: 'landing_conversion', label: 'Landing page enfocada en captar prospectos o ventas directas' },
        { value: 'web_corporativa', label: 'Sitio web corporativo e institucional completo' },
        { value: 'tienda_ecommerce', label: 'Tienda Online (E-commerce) con catálogo y pasarela de pago' },
        { value: 'plataforma_capacitacion', label: 'Plataforma de cursos, membresías o capacitaciones' },
        { value: 'catalogo_interactivo', label: 'Catálogo de productos o servicios interactivo con cotizador' },
      ],
    },
    {
      id: 'land_payment_gateway',
      label: '¿Necesitas cobrar en línea a través de la página?',
      module: 'landing',
      type: 'multiple',
      options: [
        { value: 'tarjetas_internacionales', label: 'Tarjetas internacionales (Stripe, PayPal)' },
        { value: 'pago_movil_vzla', label: 'Pago Móvil / Transferencias nacionales (Venezuela)' },
        { value: 'criptomonedas', label: 'USDT / Binance Pay / Criptomonedas' },
        { value: 'transferencias_manuales', label: 'Confirmación manual con subida de comprobante' },
        { value: 'sin_pagos', label: 'No se requieren cobros en línea (solo contacto y cotización)' },
      ],
    },
    {
      id: 'land_content_ready',
      label: '¿Ya cuentas con los textos, imágenes e identidad de marca?',
      module: 'landing',
      type: 'single',
      options: [
        { value: 'todo_listo', label: 'Sí, tenemos textos, fotos y logotipo listos' },
        { value: 'marca_lista_sin_textos', label: 'Tenemos el logo y marca, pero necesitamos apoyo redactando' },
        { value: 'desde_cero', label: 'Empezamos desde cero, requerimos propuesta de identidad y diseño' },
      ],
    },
  ],

  idea: [
    {
      id: 'idea_summary',
      label: 'Cuéntanos tu idea en un par de frases sencillas:',
      module: 'idea',
      type: 'textarea',
      required: true,
      description: '¿Qué hace la solución y cómo ayuda a la persona o empresa que la utiliza?',
    },
    {
      id: 'idea_stage',
      label: '¿En qué etapa se encuentra actualmente esta idea?',
      module: 'idea',
      type: 'single',
      required: true,
      options: [
        { value: 'concepto_mental', label: 'Es una idea reciente en mi mente' },
        { value: 'investigacion_mercado', label: 'He investigado competidores y mercado' },
        { value: 'hablado_clientes', label: 'Ya he conversado con potenciales clientes y existe interés real' },
        { value: 'tenemos_clientes_esperando', label: 'Ya tengo clientes o usuarios esperando el lanzamiento' },
      ],
    },
    {
      id: 'idea_target_audience',
      label: '¿Quiénes serán los usuarios principales que pagarán o usarán el producto?',
      module: 'idea',
      type: 'single',
      options: [
        { value: 'empresas_b2b', label: 'Empresas o negocios (B2B)' },
        { value: 'consumidor_final_b2c', label: 'Personas particulares / Consumidor final (B2C)' },
        { value: 'ambos', label: 'Ambos públicos simultáneamente' },
        { value: 'no_lo_se', label: 'Por validar en la fase de consultoría' },
      ],
    },
    {
      id: 'idea_first_milestone',
      label: '¿Qué te gustaría ver listo en tu primera versión funcional (MVP)?',
      module: 'idea',
      type: 'textarea',
      description: 'No necesitas pensar en todo el sistema completo; piensa en la función clave que demostraría que la idea funciona.',
    },
  ],
};
