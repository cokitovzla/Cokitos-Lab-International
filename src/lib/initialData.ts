import { Project, Lead, Task, User, LabSettings } from '../types/index.ts';

export const INITIAL_SETTINGS: LabSettings = {
  name: "COKITO'S LAB",
  descriptor: 'Laboratorio de innovación y tecnología aplicada',
  slogan: 'Menos caos. Automatiza. Escala.',
  philosophy: 'Transformamos ideas en sistemas que funcionan.',
  contactEmail: 'contacto@cokitoslab.com',
  contactPhone: '+58 412 000 0000',
  location: 'Laboratorio Virtual & Operaciones Remotas',
  activeInquiries: true,
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_01',
    name: "Control Center CRM & Captación",
    clientName: "Cokito's Lab Interno",
    company: "Cokito's Lab",
    description: "Sistema operativo integral de captación, gestión de pipeline comercial de 8 etapas, seguimiento de tareas e instrumentación tecnológica interna.",
    status: "en_desarrollo",
    assignedLead: "Director Cokito",
    startDate: "2026-09-01",
    targetDate: "2026-11-15",
    milestones: [
      { id: 'm1', title: 'Arquitectura y base de datos persistente', done: true },
      { id: 'm2', title: 'Landing page y captación en tiempo real', done: true },
      { id: 'm3', title: 'Pipeline Kanban y gestión de oportunidades', done: true },
      { id: 'm4', title: 'Módulo de conversión a proyectos', done: false, dueDate: '2026-11-05' }
    ],
    internalNotes: "V1.0 lista para producción y despliegue.",
    visibleOnLanding: true,
    category: "CRM & Gestión Operativa",
    outcomeMetric: "Centralización del 100% de oportunidades",
    tags: ["Full-Stack", "CRM", "Automatización"],
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'proj_02',
    name: "Automatización de Conciliación y Facturación",
    clientName: "Grupo Logístico Delta",
    company: "Delta Logistics",
    description: "Flujo automatizado de ingesta de órdenes, verificación de pagos bancarios y generación de comprobantes fiscales electrónicos sin intervención manual.",
    status: "entregado",
    assignedLead: "Especialista de Sistemas",
    startDate: "2026-07-10",
    targetDate: "2026-09-20",
    milestones: [
      { id: 'm21', title: 'Diseño de arquitectura de integración', done: true },
      { id: 'm22', title: 'Conectores bancarios y API fiscal', done: true },
      { id: 'm23', title: 'Pruebas de estrés y entrega en producción', done: true }
    ],
    internalNotes: "Cliente reporta ahorro de 18 horas semanales en el equipo de finanzas.",
    visibleOnLanding: true,
    category: "Automatización Inteligente",
    outcomeMetric: "Reducción de 85% en tiempo de procesamiento",
    tags: ["Integraciones", "API", "FinOps"],
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
  },
  {
    id: 'proj_03',
    name: "Portal de Operaciones y Seguimiento de Flota",
    clientName: "Distribuidora Andina",
    company: "Andina S.A.",
    description: "Plataforma web reactiva para monitoreo en vivo de despachos, asignación de rutas y confirmación de entregas con geolocalización.",
    status: "pruebas",
    assignedLead: "Director Cokito",
    startDate: "2026-08-15",
    targetDate: "2026-11-30",
    milestones: [
      { id: 'm31', title: 'Levantamiento de requerimientos de ruta', done: true },
      { id: 'm32', title: 'Aplicación web progresiva para conductores', done: true },
      { id: 'm33', title: 'Panel de despacho y métricas operativas', done: false, dueDate: '2026-11-10' }
    ],
    internalNotes: "Fase de validación con 15 unidades de transporte.",
    visibleOnLanding: true,
    category: "Sistemas a Medida",
    outcomeMetric: "Optimización de despachos en tiempo real",
    tags: ["React", "PWA", "Logística"],
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
  {
    id: 'proj_04',
    name: "Motor Omnicanal de Agendamiento y Atención",
    clientName: "SaludConecta Red Médica",
    company: "SaludConecta",
    description: "Asistente automatizado de reservas vía WhatsApp y Web, sincronizado en dos vías con agendas de especialistas y notificaciones de recordatorio.",
    status: "entregado",
    assignedLead: "Especialista de Sistemas",
    startDate: "2026-06-01",
    targetDate: "2026-08-15",
    milestones: [
      { id: 'm41', title: 'Integración WhatsApp Business API', done: true },
      { id: 'm42', title: 'Motor de citas y slots disponibles', done: true },
      { id: 'm43', title: 'Alertas automatizadas y confirmaciones', done: true }
    ],
    internalNotes: "Tasa de asistencia mejoró sustancialmente en las primeras semanas.",
    visibleOnLanding: true,
    category: "Automatización Inteligente",
    outcomeMetric: "60% menos ausencias en citas",
    tags: ["WhatsApp API", "Webhooks", "Automatización"],
    createdAt: new Date(Date.now() - 50 * 86400000).toISOString(),
  },
  {
    id: 'proj_05',
    name: "Hub B2B de Pedidos y Sincronización de Stock",
    clientName: "Ferreterías Industriales del Norte",
    company: "Grupo Industrial Norte",
    description: "Portal privado para clientes mayoristas con cotizaciones en tiempo real, catálogo dinámico y enlace bidireccional con software contable.",
    status: "en_desarrollo",
    assignedLead: "Director Cokito",
    startDate: "2026-09-10",
    targetDate: "2026-12-01",
    milestones: [
      { id: 'm51', title: 'Conector de catálogo e inventario', done: true },
      { id: 'm52', title: 'Portal de compras para mayoristas', done: true },
      { id: 'm53', title: 'Líneas de crédito y facturación automática', done: false, dueDate: '2026-11-20' }
    ],
    internalNotes: "Integración contable en validación de seguridad.",
    visibleOnLanding: true,
    category: "Sistemas a Medida",
    outcomeMetric: "Pedidos procesados 4x más rápido",
    tags: ["B2B", "Catálogo", "ERP Conector"],
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'proj_06',
    name: "Plataforma de Captación y Calificación de Leads",
    clientName: "Inversiones Inmobiliarias Prime",
    company: "Prime Real Estate",
    description: "Landing page de alto rendimiento con scoring dinámico de prospectos, enrutamiento a asesores según presupuesto y analítica de conversión.",
    status: "entregado",
    assignedLead: "Director Cokito",
    startDate: "2026-05-10",
    targetDate: "2026-07-01",
    milestones: [
      { id: 'm61', title: 'Diseño UX enfocado en conversión', done: true },
      { id: 'm62', title: 'Formularios inteligentes con lógica condicional', done: true },
      { id: 'm63', title: 'Despliegue perimetral y tracking de eventos', done: true }
    ],
    internalNotes: "Excelente rendimiento en campañas de adquisición.",
    visibleOnLanding: true,
    category: "Landing Pages & Captación",
    outcomeMetric: "+42% en tasa de conversión calificada",
    tags: ["Landing Page", "Lead Scoring", "Edge Hosting"],
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'Director Cokito',
    email: 'admin@cokitoslab.com',
    role: 'admin',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'user_lead_dev',
    name: 'Especialista de Sistemas',
    email: 'anat.vacaviejavzla@gmail.com',
    role: 'especialista',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead_101',
    fullName: 'Roberto Mendoza',
    company: 'Manufacturas del Centro',
    email: 'r.mendoza@mcentro.com',
    phone: '+58 414 332 9911',
    projectType: 'automation',
    description: 'Buscamos automatizar el traspaso de información entre nuestro inventario físico y la tienda virtual para evitar desfases de stock.',
    contactPreference: 'whatsapp',
    dataConsent: true,
    status: 'en_evaluacion',
    assignedTo: 'Director Cokito',
    source: 'landing_page',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    notes: [
      {
        id: 'n_1',
        content: 'Solicitud recibida desde la landing. Necesidad clara de sincronización bidireccional vía webhooks.',
        author: 'Sistema',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      }
    ],
    activity: [
      {
        id: 'a_1',
        type: 'contact_created',
        description: 'Solicitud registrada desde el formulario público del laboratorio',
        author: 'Sistema',
        timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
      }
    ]
  },
  {
    id: 'lead_102',
    fullName: 'Mariana Silva',
    company: 'Consultores Estratégicos Nova',
    email: 'mariana.silva@novaconsulting.net',
    phone: '+58 424 551 2288',
    projectType: 'crm',
    description: 'Requerimos un CRM centralizado para controlar prospectos de consultoría B2B con etapas personalizadas y alertas por correo.',
    contactPreference: 'email',
    dataConsent: true,
    status: 'propuesta_enviada',
    assignedTo: 'Director Cokito',
    source: 'landing_page',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    notes: [
      {
        id: 'n_3',
        content: 'Propuesta comercial enviada con alcance de 8 semanas.',
        author: 'Director Cokito',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      }
    ],
    activity: [
      {
        id: 'a_3',
        type: 'status_change',
        description: 'Estado actualizado a "Propuesta enviada"',
        author: 'Director Cokito',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
      }
    ]
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_01',
    leadId: 'lead_102',
    leadName: 'Mariana Silva',
    title: 'Hacer seguimiento a propuesta comercial Nova',
    description: 'Verificar si recibieron el desglose de hitos y resolver dudas del alcance.',
    assignedTo: 'Director Cokito',
    priority: 'alta',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    status: 'pendiente',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'task_02',
    projectId: 'proj_01',
    projectName: "Control Center CRM & Captación",
    title: 'Revisión final de métricas de despliegue en Vercel',
    description: 'Validar la navegación fluida, diseño responsive y carga ultrarrápida.',
    assignedTo: 'Especialista de Sistemas',
    priority: 'urgente',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'en_progreso',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  }
];
