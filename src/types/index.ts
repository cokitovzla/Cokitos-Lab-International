export type ProjectType = 
  | 'software'
  | 'crm'
  | 'automation'
  | 'optimization'
  | 'consulting'
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

export interface Lead {
  id: string;
  fullName: string;
  company?: string;
  email: string;
  phone?: string;
  projectType: ProjectType;
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

export interface Project {
  id: string;
  leadId?: string;
  name: string;
  clientName: string;
  company?: string;
  description: string;
  status: ProjectStatus;
  assignedLead: string;
  startDate: string;
  targetDate?: string;
  milestones: ProjectMilestone[];
  internalNotes?: string;
  visibleOnLanding: boolean;
  category: string;
  outcomeMetric?: string;
  tags: string[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'ingeniero' | 'consultor';
  avatar?: string;
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
