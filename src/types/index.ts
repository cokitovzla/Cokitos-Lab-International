export type ProjectType = 
  | 'software'
  | 'crm'
  | 'automation'
  | 'optimization'
  | 'consulting'
  | 'landing'
  | 'idea';

export type PipelineStage = 
  | 'nuevo_contacto'
  | 'en_evaluacion'
  | 'contactado'
  | 'reunion_programada'
  | 'propuesta_enviada'
  | 'negociacion'
  | 'ganado'
  | 'perdido';

export type ContactPreference = 'email' | 'whatsapp' | 'call';

export type TaskPriority = 'baja' | 'media' | 'alta' | 'urgente';
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';

export type ProjectStatus = 'planificacion' | 'en_desarrollo' | 'pruebas' | 'entregado' | 'mantenimiento';

export interface LeadNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'status_change' | 'note_added' | 'task_created' | 'contact_created' | 'project_created' | 'email_sent';
  description: string;
  author: string;
  timestamp: string;
}

export interface DiagnosticAnswer {
  questionId: string;
  questionLabel: string;
  module: 'general' | ProjectType;
  value: any;
  displayValue: string;
}

export type DiagnosticStatus = 'no_iniciado' | 'en_progreso' | 'completado';

export interface LeadDiagnostic {
  id: string;
  leadId: string;
  referenceCode: string;
  status: DiagnosticStatus;
  selectedAreas: ProjectType[];
  answers: Record<string, DiagnosticAnswer>;
  progressPercentage: number;
  currentStep: number;
  totalSteps: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface RecoveryTokenRecord {
  tokenHash: string;
  leadId: string;
  referenceCode: string;
  email: string;
  phone?: string;
  expiresAt: number;
  attempts: number;
  revoked: boolean;
  createdAt: string;
}

export interface Lead {
  id: string;
  referenceCode?: string; // Standard format CL-AAAA-NNNNN
  fullName: string;
  company?: string;
  email: string;
  phone?: string;
  projectType: ProjectType;
  serviceAreas?: ProjectType[]; // Multi-select support for the 7 specialized areas
  description: string;
  contactPreference: ContactPreference;
  dataConsent: boolean;
  status: PipelineStage;
  assignedTo: string;
  source: 'landing_page' | 'manual' | 'referral';
  createdAt: string;
  updatedAt: string;
  notes: LeadNote[];
  activity: ActivityItem[];
  convertedProjectId?: string;
  isArchived?: boolean;
  archivedAt?: string;
  diagnosticStatus?: DiagnosticStatus;
  diagnosticId?: string;
}

export interface Task {
  id: string;
  leadId?: string;
  leadName?: string;
  projectId?: string;
  projectName?: string;
  title: string;
  description?: string;
  assignedTo: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  done: boolean;
  dueDate?: string;
}

export interface ProjectColorTheme {
  primary: string; // e.g. '#00D9F5' or '#8B5CF6'
  secondary?: string; // e.g. '#00E3B2' or '#EC4899'
  bgTint?: string; // e.g. 'rgba(0, 217, 245, 0.05)'
  borderColor?: string;
}

export interface Project {
  id: string;
  leadId?: string;
  name: string;
  clientName: string;
  company?: string;
  description: string;
  status: ProjectStatus;
  releasePhase?: string; // Uniform release phase: 'BETA 2.0', 'OMEGA DEMO', etc.
  assignedLead: string;
  startDate: string;
  targetDate?: string;
  milestones: ProjectMilestone[];
  internalNotes?: string;
  visibleOnLanding: boolean;
  category: string; // Primary category for display
  categories?: string[]; // Global categories for multi-category matching
  outcomeMetric?: string;
  tags: string[];
  demoUrl?: string;
  colorTheme?: ProjectColorTheme;
  createdAt: string;
}

export interface LabHub {
  id: string;
  city: string;
  country: string;
  flag?: string;
  leadPerson?: string;
  role?: string;
  email?: string;
  phone?: string;
  description?: string;
  isMain?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'especialista' | 'consultor';
  avatar?: string;
  location?: string;
  createdAt: string;
}

export interface LabSettings {
  name: string;
  descriptor: string;
  slogan: string;
  philosophy: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  activeInquiries: boolean;
  hubs?: LabHub[];
}

export interface DashboardStats {
  totalContacts: number;
  newLeads: number;
  activeOpportunities: number;
  activeProjects: number;
  pendingTasks: number;
  overdueTasks: number;
  conversionRate: number;
  recentActivity: ActivityItem[];
}
