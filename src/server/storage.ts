import fs from 'fs';
import path from 'path';
import { 
  Lead, 
  Task, 
  Project, 
  User, 
  LabSettings, 
  ActivityItem, 
  DashboardStats 
} from '../types/index.ts';

interface DatabaseSchema {
  leads: Lead[];
  tasks: Task[];
  projects: Project[];
  users: User[];
  settings: LabSettings;
  activityLog: ActivityItem[];
}

const DB_PATH = path.resolve(process.cwd(), 'data', 'cokitos_lab_db.json');

import { 
  INITIAL_PROJECTS, 
  INITIAL_SETTINGS, 
  INITIAL_USERS, 
  INITIAL_LEADS, 
  INITIAL_TASKS 
} from '../lib/initialData.ts';

const initialSettings: LabSettings = INITIAL_SETTINGS;
const initialUsers: User[] = INITIAL_USERS;
const initialProjects: Project[] = INITIAL_PROJECTS;
const initialLeads: Lead[] = INITIAL_LEADS;
const initialTasks: Task[] = INITIAL_TASKS;

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          leads: parsed.leads || initialLeads,
          tasks: parsed.tasks || initialTasks,
          projects: parsed.projects || initialProjects,
          users: parsed.users || initialUsers,
          settings: parsed.settings || initialSettings,
          activityLog: parsed.activityLog || [],
        };
      }
    } catch (e) {
      console.error('Error loading database file, initializing with defaults:', e);
    }

    const defaultData: DatabaseSchema = {
      leads: initialLeads,
      tasks: initialTasks,
      projects: initialProjects,
      users: initialUsers,
      settings: initialSettings,
      activityLog: [
        {
          id: 'log_01',
          type: 'contact_created',
          description: 'Inicialización de base de datos de Cokito\'s Lab',
          author: 'Sistema',
          timestamp: new Date().toISOString(),
        }
      ],
    };
    this.saveDatabase(defaultData);
    return defaultData;
  }

  private saveDatabase(dataToSave: DatabaseSchema = this.data): void {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database file:', e);
    }
  }

  // LEADS
  public getLeads(filters?: { search?: string; status?: string; projectType?: string }): Lead[] {
    let result = [...this.data.leads];

    if (filters?.status && filters.status !== 'all') {
      result = result.filter(l => l.status === filters.status);
    }

    if (filters?.projectType && filters.projectType !== 'all') {
      result = result.filter(l => l.projectType === filters.projectType);
    }

    if (filters?.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(l => 
        l.fullName.toLowerCase().includes(query) ||
        (l.company && l.company.toLowerCase().includes(query)) ||
        l.email.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query)
      );
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getLeadById(id: string): Lead | undefined {
    return this.data.leads.find(l => l.id === id);
  }

  public createLead(input: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'notes' | 'activity' | 'status' | 'assignedTo' | 'source'> & { source?: 'landing_page' | 'manual' | 'referral'; status?: Lead['status']; assignedTo?: string }): Lead {
    const now = new Date().toISOString();
    const newLead: Lead = {
      id: `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      fullName: input.fullName.trim(),
      company: input.company?.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim(),
      projectType: input.projectType,
      description: input.description.trim(),
      contactPreference: input.contactPreference || 'email',
      dataConsent: !!input.dataConsent,
      status: input.status || 'nuevo_contacto',
      assignedTo: input.assignedTo || 'Director Cokito',
      source: input.source || 'landing_page',
      createdAt: now,
      updatedAt: now,
      notes: [],
      activity: [
        {
          id: `act_${Date.now()}`,
          type: 'contact_created',
          description: `Contacto capturado desde ${input.source === 'manual' ? 'ingreso manual en CRM' : 'la Landing Page del laboratorio'}`,
          author: 'Sistema',
          timestamp: now,
        }
      ],
    };

    this.data.leads.unshift(newLead);
    this.logActivity(newLead.activity[0]);
    this.saveDatabase();
    return newLead;
  }

  public updateLead(id: string, updates: Partial<Lead>, authorName = 'Administrador'): Lead | null {
    const leadIndex = this.data.leads.findIndex(l => l.id === id);
    if (leadIndex === -1) return null;

    const lead = this.data.leads[leadIndex];
    const now = new Date().toISOString();

    // Check if status changed
    if (updates.status && updates.status !== lead.status) {
      const stageLabels: Record<string, string> = {
        nuevo_contacto: 'Nuevo contacto',
        en_evaluacion: 'En evaluación',
        contactado: 'Contactado',
        reunion_programada: 'Reunión programada',
        propuesta_enviada: 'Propuesta enviada',
        negociacion: 'Negociación',
        ganado: 'Ganado',
        perdido: 'Perdido',
      };

      const act: ActivityItem = {
        id: `act_${Date.now()}`,
        type: 'status_change',
        description: `Etapa cambiada de "${stageLabels[lead.status] || lead.status}" a "${stageLabels[updates.status] || updates.status}"`,
        author: authorName,
        timestamp: now,
      };
      lead.activity.unshift(act);
      this.logActivity(act);
    }

    const updatedLead: Lead = {
      ...lead,
      ...updates,
      updatedAt: now,
    };

    this.data.leads[leadIndex] = updatedLead;
    this.saveDatabase();
    return updatedLead;
  }

  public addLeadNote(id: string, content: string, authorName = 'Administrador'): Lead | null {
    const lead = this.getLeadById(id);
    if (!lead) return null;

    const now = new Date().toISOString();
    const note = {
      id: `note_${Date.now()}`,
      content: content.trim(),
      author: authorName,
      createdAt: now,
    };
    lead.notes.unshift(note);

    const act: ActivityItem = {
      id: `act_${Date.now()}`,
      type: 'note_added',
      description: `Nota agregada por ${authorName}`,
      author: authorName,
      timestamp: now,
    };
    lead.activity.unshift(act);
    this.logActivity(act);

    lead.updatedAt = now;
    this.saveDatabase();
    return lead;
  }

  public deleteLead(id: string): boolean {
    const initialLen = this.data.leads.length;
    this.data.leads = this.data.leads.filter(l => l.id !== id);
    if (this.data.leads.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // TASKS
  public getTasks(): Task[] {
    return [...this.data.tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  public createTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.tasks.unshift(newTask);

    // If associated with a lead, log activity
    if (task.leadId) {
      const lead = this.getLeadById(task.leadId);
      if (lead) {
        const act: ActivityItem = {
          id: `act_${Date.now()}`,
          type: 'task_created',
          description: `Tarea creada: "${task.title}" (Prioridad: ${task.priority})`,
          author: task.assignedTo || 'Administrador',
          timestamp: new Date().toISOString(),
        };
        lead.activity.unshift(act);
        this.logActivity(act);
      }
    }

    this.saveDatabase();
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Task>): Task | null {
    const index = this.data.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.data.tasks[index] = {
      ...this.data.tasks[index],
      ...updates,
    };
    this.saveDatabase();
    return this.data.tasks[index];
  }

  public deleteTask(id: string): boolean {
    const len = this.data.tasks.length;
    this.data.tasks = this.data.tasks.filter(t => t.id !== id);
    if (this.data.tasks.length !== len) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // PROJECTS
  public getProjects(publicOnly = false): Project[] {
    let result = [...this.data.projects];
    if (publicOnly) {
      result = result.filter(p => p.visibleOnLanding);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getProjectById(id: string): Project | undefined {
    return this.data.projects.find(p => p.id === id);
  }

  public createProject(project: Omit<Project, 'id' | 'createdAt'>): Project {
    const newProj: Project = {
      ...project,
      id: `proj_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.projects.unshift(newProj);

    // If converted from lead, mark lead as ganado and store convertedProjectId
    if (project.leadId) {
      this.updateLead(project.leadId, {
        status: 'ganado',
        convertedProjectId: newProj.id,
      });

      const lead = this.getLeadById(project.leadId);
      if (lead) {
        const act: ActivityItem = {
          id: `act_${Date.now()}`,
          type: 'project_created',
          description: `Oportunidad convertida en proyecto activo: "${project.name}"`,
          author: project.assignedLead || 'Administrador',
          timestamp: new Date().toISOString(),
        };
        lead.activity.unshift(act);
        this.logActivity(act);
      }
    }

    this.saveDatabase();
    return newProj;
  }

  public updateProject(id: string, updates: Partial<Project>): Project | null {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.data.projects[index] = {
      ...this.data.projects[index],
      ...updates,
    };
    this.saveDatabase();
    return this.data.projects[index];
  }

  public deleteProject(id: string): boolean {
    const len = this.data.projects.length;
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    if (this.data.projects.length !== len) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // SETTINGS
  public getSettings(): LabSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<LabSettings>): LabSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
    };
    this.saveDatabase();
    return this.data.settings;
  }

  // USERS
  public getUsers(): User[] {
    return this.data.users;
  }

  public createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.saveDatabase();
    return newUser;
  }

  // STATS & ACTIVITY
  private logActivity(act: ActivityItem) {
    this.data.activityLog.unshift(act);
    if (this.data.activityLog.length > 100) {
      this.data.activityLog = this.data.activityLog.slice(0, 100);
    }
  }

  public getStats(): DashboardStats {
    const leads = this.data.leads;
    const tasks = this.data.tasks;
    const projects = this.data.projects;

    const totalContacts = leads.length;
    const newLeads = leads.filter(l => l.status === 'nuevo_contacto').length;
    const activeOpportunities = leads.filter(l => !['ganado', 'perdido'].includes(l.status)).length;
    const activeProjects = projects.filter(p => p.status !== 'entregado').length;
    
    const nowStr = new Date().toISOString().split('T')[0];
    const pendingTasks = tasks.filter(t => t.status !== 'completada' && t.status !== 'cancelada').length;
    const overdueTasks = tasks.filter(t => t.status !== 'completada' && t.status !== 'cancelada' && t.dueDate < nowStr).length;

    const wonLeads = leads.filter(l => l.status === 'ganado').length;
    const evaluatedLeads = leads.filter(l => ['ganado', 'perdido', 'negociacion', 'propuesta_enviada'].includes(l.status)).length;
    const conversionRate = evaluatedLeads > 0 ? Math.round((wonLeads / evaluatedLeads) * 100) : (wonLeads > 0 ? 50 : 0);

    // Recent activity combining leads activity
    const allActivities: ActivityItem[] = [...this.data.activityLog];
    leads.forEach(l => {
      l.activity.forEach(a => {
        if (!allActivities.some(existing => existing.id === a.id)) {
          allActivities.push(a);
        }
      });
    });

    const recentActivity = allActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 15);

    return {
      totalContacts,
      newLeads,
      activeOpportunities,
      activeProjects,
      pendingTasks,
      overdueTasks,
      conversionRate,
      recentActivity,
    };
  }

  // CSV EXPORT
  public generateLeadsCsv(): string {
    const headers = [
      'ID',
      'Nombre',
      'Empresa',
      'Email',
      'Telefono',
      'Tipo de Proyecto',
      'Etapa',
      'Preferencia Contacto',
      'Asignado a',
      'Origen',
      'Fecha Creacion',
      'Descripcion'
    ];

    const rows = this.data.leads.map(l => [
      `"${l.id}"`,
      `"${(l.fullName || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${l.projectType}"`,
      `"${l.status}"`,
      `"${l.contactPreference}"`,
      `"${l.assignedTo}"`,
      `"${l.source}"`,
      `"${l.createdAt}"`,
      `"${(l.description || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

export const db = new DatabaseManager();
