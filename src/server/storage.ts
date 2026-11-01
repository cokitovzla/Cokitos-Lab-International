import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  Lead, 
  Task, 
  Project, 
  User, 
  LabSettings, 
  ActivityItem, 
  DashboardStats,
  LeadDiagnostic,
  RecoveryTokenRecord,
  DiagnosticAnswer,
  ProjectType
} from '../types/index.ts';

interface DatabaseSchema {
  leads: Lead[];
  tasks: Task[];
  projects: Project[];
  users: User[];
  settings: LabSettings;
  activityLog: ActivityItem[];
  diagnostics: LeadDiagnostic[];
  recoveryTokens: RecoveryTokenRecord[];
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
    this.ensureHistoricalMigration();
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
        const hasOldMocks = !parsed.projects || parsed.projects.some((p: any) => p.id === 'proj_01' || p.id === 'proj_02' || p.id === 'proj_binlegal' || p.id === 'proj_crm_omega');
        return {
          leads: parsed.leads || initialLeads,
          tasks: parsed.tasks || initialTasks,
          projects: hasOldMocks ? initialProjects : parsed.projects,
          users: initialUsers,
          settings: hasOldMocks || !parsed.settings?.hubs ? initialSettings : parsed.settings,
          activityLog: parsed.activityLog || [],
          diagnostics: parsed.diagnostics || [],
          recoveryTokens: parsed.recoveryTokens || [],
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
      diagnostics: [],
      recoveryTokens: [],
    };
    this.saveDatabase(defaultData);
    return defaultData;
  }

  // Retroactive migration: Assign sequential references CL-AAAA-NNNNN and diagnostics to historical leads
  private ensureHistoricalMigration(): void {
    let modified = false;
    const leadsNeedingRef = this.data.leads
      .filter(l => !l.referenceCode)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    if (leadsNeedingRef.length > 0) {
      for (const lead of leadsNeedingRef) {
        const leadYear = new Date(lead.createdAt || Date.now()).getFullYear() || 2026;
        lead.referenceCode = this.generateReferenceCode(leadYear);
        lead.serviceAreas = lead.serviceAreas || [lead.projectType];
        lead.diagnosticStatus = lead.diagnosticStatus || 'no_iniciado';
        modified = true;
      }
    }

    // Ensure all leads have matching diagnostics and serviceAreas
    for (const lead of this.data.leads) {
      if (!lead.serviceAreas || lead.serviceAreas.length === 0) {
        lead.serviceAreas = [lead.projectType];
        modified = true;
      }
      if (!lead.diagnosticStatus) {
        lead.diagnosticStatus = 'no_iniciado';
        modified = true;
      }

      let existingDiag = this.data.diagnostics.find(d => d.leadId === lead.id || d.referenceCode === lead.referenceCode);
      if (!existingDiag && lead.referenceCode) {
        const newDiag: LeadDiagnostic = {
          id: `diag_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          leadId: lead.id,
          referenceCode: lead.referenceCode,
          status: 'no_iniciado',
          selectedAreas: lead.serviceAreas,
          answers: {},
          progressPercentage: 0,
          currentStep: 0,
          totalSteps: 1 + (lead.serviceAreas?.length || 1),
          createdAt: lead.createdAt || new Date().toISOString(),
          updatedAt: lead.createdAt || new Date().toISOString(),
        };
        this.data.diagnostics.push(newDiag);
        lead.diagnosticId = newDiag.id;
        modified = true;
      }
    }

    if (modified) {
      this.saveDatabase();
      console.log(`[CRM] Migración histórica completada. Referencias CL y diagnósticos sincronizados para ${this.data.leads.length} solicitudes.`);
    }
  }

  public generateReferenceCode(targetYear = new Date().getFullYear()): string {
    const prefix = `CL-${targetYear}-`;
    let maxNum = 0;
    for (const lead of this.data.leads) {
      if (lead.referenceCode && lead.referenceCode.startsWith(prefix)) {
        const numPart = parseInt(lead.referenceCode.slice(prefix.length), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    }
    const nextNum = maxNum + 1;
    return `${prefix}${String(nextNum).padStart(5, '0')}`;
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

  public getLeadByReference(refCode: string): Lead | undefined {
    if (!refCode) return undefined;
    const clean = refCode.trim().toUpperCase();
    return this.data.leads.find(l => l.referenceCode && l.referenceCode.toUpperCase() === clean);
  }

  public createLead(input: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'notes' | 'activity' | 'status' | 'assignedTo' | 'source'> & { 
    source?: 'landing_page' | 'manual' | 'referral'; 
    status?: Lead['status']; 
    assignedTo?: string;
    serviceAreas?: ProjectType[];
  }): { lead: Lead; diagnostic: LeadDiagnostic; recoveryToken: string } {
    const now = new Date().toISOString();
    const leadYear = new Date().getFullYear();
    const referenceCode = this.generateReferenceCode(leadYear);
    const serviceAreas = input.serviceAreas && input.serviceAreas.length > 0 ? input.serviceAreas : [input.projectType];

    const newLead: Lead = {
      id: `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      referenceCode,
      fullName: input.fullName.trim(),
      company: input.company?.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim(),
      projectType: input.projectType,
      serviceAreas,
      description: input.description.trim(),
      contactPreference: input.contactPreference || 'email',
      dataConsent: !!input.dataConsent,
      status: input.status || 'nuevo_contacto',
      diagnosticStatus: 'no_iniciado',
      assignedTo: input.assignedTo || 'Director Cokito',
      source: input.source || 'landing_page',
      createdAt: now,
      updatedAt: now,
      notes: [],
      activity: [
        {
          id: `act_${Date.now()}`,
          type: 'contact_created',
          description: `Contacto capturado desde ${input.source === 'manual' ? 'ingreso manual en CRM' : 'la Landing Page del laboratorio'} [Ref: ${referenceCode}]`,
          author: 'Sistema',
          timestamp: now,
        }
      ],
    };

    // Create associated Diagnostic record
    const diagnostic: LeadDiagnostic = {
      id: `diag_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      leadId: newLead.id,
      referenceCode: referenceCode,
      status: 'no_iniciado',
      selectedAreas: serviceAreas,
      answers: {},
      progressPercentage: 0,
      currentStep: 0,
      totalSteps: 1 + serviceAreas.length,
      createdAt: now,
      updatedAt: now,
    };
    newLead.diagnosticId = diagnostic.id;

    // Create high-entropy secure recovery token (30 days expiration)
    const rawToken = `cl_recov_${crypto.randomBytes(24).toString('hex')}`;
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const tokenRecord: RecoveryTokenRecord = {
      tokenHash,
      leadId: newLead.id,
      referenceCode: referenceCode,
      email: newLead.email,
      phone: newLead.phone,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      attempts: 0,
      revoked: false,
      createdAt: now,
    };

    this.data.leads.unshift(newLead);
    this.data.diagnostics.push(diagnostic);
    this.data.recoveryTokens.push(tokenRecord);
    this.logActivity(newLead.activity[0]);
    this.saveDatabase();

    return { lead: newLead, diagnostic, recoveryToken: rawToken };
  }

  // DIAGNOSTICS MANAGEMENT
  public getDiagnosticByLeadId(leadId: string): LeadDiagnostic | undefined {
    return this.data.diagnostics.find(d => d.leadId === leadId);
  }

  public getDiagnosticByReference(refCode: string): LeadDiagnostic | undefined {
    if (!refCode) return undefined;
    const clean = refCode.trim().toUpperCase();
    return this.data.diagnostics.find(d => d.referenceCode && d.referenceCode.toUpperCase() === clean);
  }

  public saveDiagnostic(input: {
    leadId?: string;
    referenceCode?: string;
    answers?: Record<string, DiagnosticAnswer>;
    progressPercentage?: number;
    currentStep?: number;
    totalSteps?: number;
    selectedAreas?: ProjectType[];
  }): LeadDiagnostic | null {
    let diag = this.data.diagnostics.find(d => 
      (input.leadId && d.leadId === input.leadId) || 
      (input.referenceCode && d.referenceCode.toUpperCase() === input.referenceCode.trim().toUpperCase())
    );

    const now = new Date().toISOString();

    if (!diag && input.referenceCode) {
      const lead = this.getLeadByReference(input.referenceCode);
      if (lead) {
        diag = {
          id: `diag_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          leadId: lead.id,
          referenceCode: lead.referenceCode!,
          status: 'no_iniciado',
          selectedAreas: input.selectedAreas || lead.serviceAreas || [lead.projectType],
          answers: {},
          progressPercentage: 0,
          currentStep: 0,
          totalSteps: 1 + (lead.serviceAreas?.length || 1),
          createdAt: now,
          updatedAt: now,
        };
        this.data.diagnostics.push(diag);
      }
    }

    if (!diag) return null;

    if (input.answers) {
      diag.answers = {
        ...diag.answers,
        ...input.answers,
      };
    }

    if (input.selectedAreas) {
      diag.selectedAreas = input.selectedAreas;
      diag.totalSteps = 1 + input.selectedAreas.length;
    }

    if (typeof input.progressPercentage === 'number') {
      diag.progressPercentage = Math.min(100, Math.max(0, Math.round(input.progressPercentage)));
    }

    if (typeof input.currentStep === 'number') {
      diag.currentStep = input.currentStep;
    }

    if (typeof input.totalSteps === 'number') {
      diag.totalSteps = input.totalSteps;
    }

    // Auto update status if answers exist and wasn't completed
    if (diag.status === 'no_iniciado' && Object.keys(diag.answers).length > 0) {
      diag.status = 'en_progreso';
    }

    diag.updatedAt = now;

    // Update parent lead status as well
    const lead = this.getLeadById(diag.leadId);
    if (lead) {
      lead.diagnosticStatus = diag.status;
      if (input.selectedAreas) {
        lead.serviceAreas = input.selectedAreas;
      }
      lead.updatedAt = now;
    }

    this.saveDatabase();
    return diag;
  }

  public completeDiagnostic(leadIdOrRef: string): LeadDiagnostic | null {
    const diag = this.data.diagnostics.find(d => 
      d.leadId === leadIdOrRef || 
      (d.referenceCode && d.referenceCode.toUpperCase() === leadIdOrRef.trim().toUpperCase())
    );
    if (!diag) return null;

    const now = new Date().toISOString();
    diag.status = 'completado';
    diag.progressPercentage = 100;
    diag.completedAt = now;
    diag.updatedAt = now;

    const lead = this.getLeadById(diag.leadId);
    if (lead) {
      lead.diagnosticStatus = 'completado';
      lead.updatedAt = now;

      const act: ActivityItem = {
        id: `act_${Date.now()}`,
        type: 'status_change',
        description: `Diagnóstico inteligente completado por el cliente [Ref: ${lead.referenceCode}]`,
        author: 'Cliente',
        timestamp: now,
      };
      lead.activity.unshift(act);
      this.logActivity(act);
    }

    this.saveDatabase();
    return diag;
  }

  // SECURE RECOVERY TOKEN CREATION & VERIFICATION
  public createRecoveryTokenForLead(leadId: string): string | null {
    const lead = this.getLeadById(leadId);
    if (!lead || !lead.referenceCode) return null;

    const now = new Date().toISOString();
    const rawToken = `cl_recov_${crypto.randomBytes(24).toString('hex')}`;
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const tokenRecord: RecoveryTokenRecord = {
      tokenHash,
      leadId: lead.id,
      referenceCode: lead.referenceCode,
      email: lead.email,
      phone: lead.phone,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      attempts: 0,
      revoked: false,
      createdAt: now,
    };

    this.data.recoveryTokens.push(tokenRecord);
    this.saveDatabase();
    return rawToken;
  }

  public verifyRecovery(refOrToken: string, identifier: string): { 
    success: boolean; 
    lead?: Lead; 
    diagnostic?: LeadDiagnostic; 
    token?: string; 
    error?: string 
  } {
    const cleanInput = (refOrToken || '').trim();
    const cleanId = (identifier || '').trim().toLowerCase();

    if (!cleanInput || !cleanId) {
      return { success: false, error: 'Debes proporcionar tu referencia comercial o token y tu correo electrónico o teléfono.' };
    }

    let tokenRecord: RecoveryTokenRecord | undefined;
    let lead: Lead | undefined;

    // Check if input is a raw token or a referenceCode
    if (cleanInput.startsWith('cl_recov_')) {
      const hash = crypto.createHash('sha256').update(cleanInput).digest('hex');
      tokenRecord = this.data.recoveryTokens.find(t => t.tokenHash === hash);
      if (tokenRecord) {
        lead = this.getLeadById(tokenRecord.leadId);
      }
    } else {
      // Input is reference code (e.g. CL-2026-00001)
      lead = this.getLeadByReference(cleanInput);
      if (lead) {
        tokenRecord = this.data.recoveryTokens.find(t => t.leadId === lead?.id && !t.revoked);
      }
    }

    if (!lead) {
      return { success: false, error: 'No se encontró ninguna solicitud con los datos proporcionados.' };
    }

    if (tokenRecord) {
      if (tokenRecord.revoked) {
        return { success: false, error: 'Este enlace de recuperación ha sido revocado por seguridad.' };
      }
      if (tokenRecord.expiresAt < Date.now()) {
        return { success: false, error: 'El enlace de recuperación ha expirado. Por favor solicita uno nuevo.' };
      }
      if (tokenRecord.attempts >= 5) {
        tokenRecord.revoked = true;
        this.saveDatabase();
        return { success: false, error: 'Límite de intentos de seguridad excedido. Por favor contacta al equipo de Cokito\'s Lab.' };
      }
    }

    // Identity check: compare email or phone
    const cleanLeadEmail = lead.email.trim().toLowerCase();
    const cleanLeadPhone = (lead.phone || '').replace(/\D/g, '');
    const cleanInputDigits = cleanId.replace(/\D/g, '');

    const emailMatch = cleanLeadEmail === cleanId;
    const phoneMatch = cleanInputDigits.length >= 7 && cleanLeadPhone.length >= 7 && cleanLeadPhone.includes(cleanInputDigits);

    if (!emailMatch && !phoneMatch) {
      if (tokenRecord) {
        tokenRecord.attempts += 1;
        this.saveDatabase();
      }
      return { 
        success: false, 
        error: 'El correo electrónico o teléfono no coincide con la solicitud registrada.' 
      };
    }

    // Success! If needed, generate or return fresh token
    let rawToken: string;
    if (cleanInput.startsWith('cl_recov_')) {
      rawToken = cleanInput;
    } else {
      rawToken = this.createRecoveryTokenForLead(lead.id) || `cl_recov_${crypto.randomBytes(24).toString('hex')}`;
    }

    const diagnostic = this.getDiagnosticByLeadId(lead.id);

    return {
      success: true,
      lead,
      diagnostic,
      token: rawToken
    };
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
      'Referencia CL',
      'Nombre',
      'Empresa',
      'Email',
      'Telefono',
      'Tipo de Proyecto',
      'Areas Especializadas',
      'Estado Diagnostico',
      'Etapa Pipeline',
      'Preferencia Contacto',
      'Asignado a',
      'Origen',
      'Fecha Creacion',
      'Descripcion'
    ];

    const rows = this.data.leads.map(l => [
      `"${l.id}"`,
      `"${l.referenceCode || ''}"`,
      `"${(l.fullName || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${l.projectType}"`,
      `"${(l.serviceAreas || [l.projectType]).join('; ')}"`,
      `"${l.diagnosticStatus || 'no_iniciado'}"`,
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
