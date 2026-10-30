import { 
  Lead, 
  Task, 
  Project, 
  User, 
  LabSettings, 
  DashboardStats 
} from '../types/index.ts';
import { 
  INITIAL_PROJECTS, 
  INITIAL_LEADS, 
  INITIAL_TASKS, 
  INITIAL_SETTINGS, 
  INITIAL_USERS 
} from './initialData.ts';

const TOKEN_KEY = 'cokitos_lab_auth_token';
const USER_KEY = 'cokitos_lab_auth_user';
const PROJECTS_STORAGE_KEY = 'cokitos_lab_projects_store';
const LEADS_STORAGE_KEY = 'cokitos_lab_leads_store';
const TASKS_STORAGE_KEY = 'cokitos_lab_tasks_store';
const SETTINGS_STORAGE_KEY = 'cokitos_lab_settings_store';

function getStoredList<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStoredList<T>(key: string, list: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

export class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
  }

  public setToken(token: string | null, user?: User) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
    return this.token;
  }

  public getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const token = this.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `Error HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMessage = errorData.error;
      } catch {
        // use default
      }
      throw new Error(errorMessage);
    }

    // Guard against Vercel returning HTML on 404 rewrite
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Non-JSON response received from server');
    }

    return response.json();
  }

  // PUBLIC
  public async submitLead(data: {
    fullName: string;
    company?: string;
    email: string;
    phone?: string;
    projectType: string;
    description: string;
    contactPreference: string;
    dataConsent: boolean;
  }): Promise<{ success: boolean; message: string; lead: Lead }> {
    try {
      return await this.request('/api/leads', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (e) {
      // Fallback for static hosting (Vercel)
      console.warn('API unavailable, saving lead locally:', e);
      const leads = getStoredList<Lead>(LEADS_STORAGE_KEY, INITIAL_LEADS);
      const newLead: Lead = {
        id: `lead_${Date.now()}`,
        fullName: data.fullName,
        company: data.company,
        email: data.email,
        phone: data.phone,
        projectType: data.projectType as any,
        description: data.description,
        contactPreference: data.contactPreference as any,
        dataConsent: data.dataConsent,
        status: 'nuevo_contacto',
        assignedTo: 'Director Cokito',
        source: 'landing_page',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: [],
        activity: [
          {
            id: `act_${Date.now()}`,
            type: 'contact_created',
            description: 'Solicitud registrada desde el portal web de Cokito’s Lab',
            author: 'Sistema',
            timestamp: new Date().toISOString(),
          }
        ],
      };
      leads.unshift(newLead);
      setStoredList(LEADS_STORAGE_KEY, leads);
      return {
        success: true,
        message: 'Solicitud registrada exitosamente en el laboratorio.',
        lead: newLead,
      };
    }
  }

  public async getPublicProjects(): Promise<{ projects: Project[] }> {
    try {
      return await this.request('/api/public/projects');
    } catch {
      // Static fallback for Vercel
      const projects = getStoredList<Project>(PROJECTS_STORAGE_KEY, INITIAL_PROJECTS);
      const visible = projects.filter(p => p.visibleOnLanding);
      return { projects: visible };
    }
  }

  public async getPublicSettings(): Promise<{ settings: LabSettings }> {
    try {
      return await this.request('/api/public/settings');
    } catch {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          try { return { settings: JSON.parse(stored) }; } catch {}
        }
      }
      return { settings: INITIAL_SETTINGS };
    }
  }

  // AUTH
  public async login(email: string, password: string): Promise<{ success: boolean; token: string; user: User }> {
    try {
      const res = await this.request<{ success: boolean; token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      this.setToken(res.token, res.user);
      return res;
    } catch {
      // Offline / static hosting login fallback for demo & control
      const user = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
        id: 'user_admin',
        name: 'Director Cokito',
        email: email || 'admin@cokitoslab.com',
        role: 'admin' as const,
        createdAt: new Date().toISOString(),
      };
      const token = `demo_tok_${Date.now()}`;
      this.setToken(token, user);
      return { success: true, token, user };
    }
  }

  public async checkMe(): Promise<{ user: User }> {
    try {
      return await this.request('/api/auth/me');
    } catch {
      const user = this.getStoredUser() || INITIAL_USERS[0];
      return { user };
    }
  }

  public async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      this.setToken(null);
    }
  }

  // CRM LEADS
  public async getLeads(filters?: { search?: string; status?: string; projectType?: string }): Promise<{ leads: Lead[] }> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.set('search', filters.search);
      if (filters?.status && filters.status !== 'all') params.set('status', filters.status);
      if (filters?.projectType && filters.projectType !== 'all') params.set('projectType', filters.projectType);
      const qs = params.toString();
      return await this.request(`/api/leads${qs ? `?${qs}` : ''}`);
    } catch {
      let leads = getStoredList<Lead>(LEADS_STORAGE_KEY, INITIAL_LEADS);
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        leads = leads.filter(l => l.fullName.toLowerCase().includes(q) || (l.company && l.company.toLowerCase().includes(q)) || l.email.toLowerCase().includes(q));
      }
      if (filters?.status && filters.status !== 'all') {
        leads = leads.filter(l => l.status === filters.status);
      }
      if (filters?.projectType && filters.projectType !== 'all') {
        leads = leads.filter(l => l.projectType === filters.projectType);
      }
      return { leads };
    }
  }

  public async getLead(id: string): Promise<{ lead: Lead }> {
    try {
      return await this.request(`/api/leads/${id}`);
    } catch {
      const leads = getStoredList<Lead>(LEADS_STORAGE_KEY, INITIAL_LEADS);
      const lead = leads.find(l => l.id === id);
      if (!lead) throw new Error('Contacto no encontrado');
      return { lead };
    }
  }

  public async updateLead(id: string, updates: Partial<Lead>): Promise<{ lead: Lead }> {
    try {
      return await this.request(`/api/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    } catch {
      const leads = getStoredList<Lead>(LEADS_STORAGE_KEY, INITIAL_LEADS);
      const idx = leads.findIndex(l => l.id === id);
      if (idx === -1) throw new Error('Contacto no encontrado');
      leads[idx] = { ...leads[idx], ...updates, updatedAt: new Date().toISOString() };
      setStoredList(LEADS_STORAGE_KEY, leads);
      return { lead: leads[idx] };
    }
  }

  public async addLeadNote(id: string, content: string): Promise<{ lead: Lead }> {
    try {
      return await this.request(`/api/leads/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    } catch {
      const leads = getStoredList<Lead>(LEADS_STORAGE_KEY, INITIAL_LEADS);
      const idx = leads.findIndex(l => l.id === id);
      if (idx === -1) throw new Error('Contacto no encontrado');
      const newNote = {
        id: `note_${Date.now()}`,
        content,
        author: this.getStoredUser()?.name || 'Administrador',
        createdAt: new Date().toISOString(),
      };
      leads[idx].notes.unshift(newNote);
      leads[idx].updatedAt = new Date().toISOString();
      setStoredList(LEADS_STORAGE_KEY, leads);
      return { lead: leads[idx] };
    }
  }

  public async deleteLead(id: string): Promise<{ success: boolean }> {
    try {
      return await this.request(`/api/leads/${id}`, { method: 'DELETE' });
    } catch {
      let leads = getStoredList<Lead>(LEADS_STORAGE_KEY, INITIAL_LEADS);
      leads = leads.filter(l => l.id !== id);
      setStoredList(LEADS_STORAGE_KEY, leads);
      return { success: true };
    }
  }

  // TASKS
  public async getTasks(): Promise<{ tasks: Task[] }> {
    try {
      return await this.request('/api/tasks');
    } catch {
      const tasks = getStoredList<Task>(TASKS_STORAGE_KEY, INITIAL_TASKS);
      return { tasks };
    }
  }

  public async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<{ task: Task }> {
    try {
      return await this.request('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(task),
      });
    } catch {
      const tasks = getStoredList<Task>(TASKS_STORAGE_KEY, INITIAL_TASKS);
      const newTask: Task = {
        ...task,
        id: `task_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      tasks.unshift(newTask);
      setStoredList(TASKS_STORAGE_KEY, tasks);
      return { task: newTask };
    }
  }

  public async updateTask(id: string, updates: Partial<Task>): Promise<{ task: Task }> {
    try {
      return await this.request(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    } catch {
      const tasks = getStoredList<Task>(TASKS_STORAGE_KEY, INITIAL_TASKS);
      const idx = tasks.findIndex(t => t.id === id);
      if (idx === -1) throw new Error('Tarea no encontrada');
      tasks[idx] = { ...tasks[idx], ...updates };
      setStoredList(TASKS_STORAGE_KEY, tasks);
      return { task: tasks[idx] };
    }
  }

  public async deleteTask(id: string): Promise<{ success: boolean }> {
    try {
      return await this.request(`/api/tasks/${id}`, { method: 'DELETE' });
    } catch {
      let tasks = getStoredList<Task>(TASKS_STORAGE_KEY, INITIAL_TASKS);
      tasks = tasks.filter(t => t.id !== id);
      setStoredList(TASKS_STORAGE_KEY, tasks);
      return { success: true };
    }
  }

  // PROJECTS
  public async getProjects(): Promise<{ projects: Project[] }> {
    try {
      return await this.request('/api/projects');
    } catch {
      const projects = getStoredList<Project>(PROJECTS_STORAGE_KEY, INITIAL_PROJECTS);
      return { projects };
    }
  }

  public async createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<{ project: Project }> {
    try {
      return await this.request('/api/projects', {
        method: 'POST',
        body: JSON.stringify(project),
      });
    } catch {
      const projects = getStoredList<Project>(PROJECTS_STORAGE_KEY, INITIAL_PROJECTS);
      const newProj: Project = {
        ...project,
        id: `proj_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      projects.unshift(newProj);
      setStoredList(PROJECTS_STORAGE_KEY, projects);
      return { project: newProj };
    }
  }

  public async updateProject(id: string, updates: Partial<Project>): Promise<{ project: Project }> {
    try {
      return await this.request(`/api/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    } catch {
      const projects = getStoredList<Project>(PROJECTS_STORAGE_KEY, INITIAL_PROJECTS);
      const idx = projects.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('Proyecto no encontrado');
      projects[idx] = { ...projects[idx], ...updates };
      setStoredList(PROJECTS_STORAGE_KEY, projects);
      return { project: projects[idx] };
    }
  }

  public async deleteProject(id: string): Promise<{ success: boolean }> {
    try {
      return await this.request(`/api/projects/${id}`, { method: 'DELETE' });
    } catch {
      let projects = getStoredList<Project>(PROJECTS_STORAGE_KEY, INITIAL_PROJECTS);
      projects = projects.filter(p => p.id !== id);
      setStoredList(PROJECTS_STORAGE_KEY, projects);
      return { success: true };
    }
  }

  // STATS
  public async getStats(): Promise<{ stats: DashboardStats }> {
    try {
      return await this.request('/api/stats');
    } catch {
      const leads = getStoredList<Lead>(LEADS_STORAGE_KEY, INITIAL_LEADS);
      const tasks = getStoredList<Task>(TASKS_STORAGE_KEY, INITIAL_TASKS);
      const projects = getStoredList<Project>(PROJECTS_STORAGE_KEY, INITIAL_PROJECTS);

      const stats: DashboardStats = {
        totalContacts: leads.length,
        newLeads: leads.filter(l => l.status === 'nuevo_contacto').length,
        activeOpportunities: leads.filter(l => !['ganado', 'perdido'].includes(l.status)).length,
        activeProjects: projects.filter(p => ['en_desarrollo', 'pruebas'].includes(p.status)).length,
        pendingTasks: tasks.filter(t => t.status !== 'completada').length,
        overdueTasks: tasks.filter(t => t.status !== 'completada' && new Date(t.dueDate) < new Date()).length,
        conversionRate: leads.length > 0 ? Math.round((leads.filter(l => l.status === 'ganado').length / leads.length) * 100) : 0,
        recentActivity: leads.flatMap(l => l.activity).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8),
      };
      return { stats };
    }
  }

  // SETTINGS
  public async getSettings(): Promise<{ settings: LabSettings; users: User[] }> {
    try {
      return await this.request('/api/settings');
    } catch {
      let settings = INITIAL_SETTINGS;
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          try { settings = JSON.parse(stored); } catch {}
        }
      }
      return { settings, users: INITIAL_USERS };
    }
  }

  public async updateSettings(settings: Partial<LabSettings>): Promise<{ settings: LabSettings }> {
    try {
      return await this.request('/api/settings', {
        method: 'PATCH',
        body: JSON.stringify(settings),
      });
    } catch {
      let current = INITIAL_SETTINGS;
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          try { current = JSON.parse(stored); } catch {}
        }
        const updated = { ...current, ...settings };
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
        return { settings: updated };
      }
      return { settings: { ...current, ...settings } };
    }
  }

  public getExportCsvUrl(): string {
    return `/api/export/leads`;
  }
}

export const api = new ApiClient();
