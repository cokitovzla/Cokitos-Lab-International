import { 
  Lead, 
  Task, 
  Project, 
  User, 
  LabSettings, 
  DashboardStats 
} from '../types/index.ts';

const TOKEN_KEY = 'cokitos_lab_auth_token';
const USER_KEY = 'cokitos_lab_auth_user';

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
    return this.request('/api/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getPublicProjects(): Promise<{ projects: Project[] }> {
    return this.request('/api/public/projects');
  }

  public async getPublicSettings(): Promise<{ settings: LabSettings }> {
    return this.request('/api/public/settings');
  }

  // AUTH
  public async login(email: string, password: string): Promise<{ success: boolean; token: string; user: User }> {
    const res = await this.request<{ success: boolean; token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token, res.user);
    return res;
  }

  public async checkMe(): Promise<{ user: User }> {
    return this.request('/api/auth/me');
  }

  public async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  // CRM LEADS
  public async getLeads(filters?: { search?: string; status?: string; projectType?: string }): Promise<{ leads: Lead[] }> {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters?.projectType && filters.projectType !== 'all') params.set('projectType', filters.projectType);
    const qs = params.toString();
    return this.request(`/api/leads${qs ? `?${qs}` : ''}`);
  }

  public async getLead(id: string): Promise<{ lead: Lead }> {
    return this.request(`/api/leads/${id}`);
  }

  public async updateLead(id: string, updates: Partial<Lead>): Promise<{ lead: Lead }> {
    return this.request(`/api/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  public async addLeadNote(id: string, content: string): Promise<{ lead: Lead }> {
    return this.request(`/api/leads/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  public async deleteLead(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/leads/${id}`, {
      method: 'DELETE',
    });
  }

  // TASKS
  public async getTasks(): Promise<{ tasks: Task[] }> {
    return this.request('/api/tasks');
  }

  public async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<{ task: Task }> {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  public async updateTask(id: string, updates: Partial<Task>): Promise<{ task: Task }> {
    return this.request(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  public async deleteTask(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // PROJECTS
  public async getProjects(): Promise<{ projects: Project[] }> {
    return this.request('/api/projects');
  }

  public async createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<{ project: Project }> {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  public async updateProject(id: string, updates: Partial<Project>): Promise<{ project: Project }> {
    return this.request(`/api/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  public async deleteProject(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // STATS
  public async getStats(): Promise<{ stats: DashboardStats }> {
    return this.request('/api/stats');
  }

  // SETTINGS
  public async getSettings(): Promise<{ settings: LabSettings; users: User[] }> {
    return this.request('/api/settings');
  }

  public async updateSettings(settings: Partial<LabSettings>): Promise<{ settings: LabSettings }> {
    return this.request('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  }

  public getExportCsvUrl(): string {
    return `/api/export/leads`;
  }
}

export const api = new ApiClient();
